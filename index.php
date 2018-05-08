<?php

require __DIR__ . '/vendor/autoload.php';

session_start();

date_default_timezone_set('Europe/Prague');

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

// create app
$app = new \Slim\App(['settings' => ['displayErrorDetails' => true]]);

// get container
$container = $app->getContainer();

// register component on container
$container['view'] = function ($container) {
	$view = new \Slim\Views\Twig( __DIR__ . '/templates/', [
		/*'cache' => __DIR__ . '/cache/'  ONLY in production mode*/
	]);

	 // instantiate and add Slim specific extension
    $basePath = rtrim(str_ireplace('index.php', '', $container['request']->getUri()->getBasePath()), '/');
    $view->addExtension(new Slim\Views\TwigExtension($container['router'], $basePath));

    return $view;
};

$container['view']['version'] = '1.0.0';

$app->get('/', function ($request, $response, $args) {
    return $this->view->render($response, 'index.html');
})->setName('index');

$app->post('/data-all-currencies', function($request, $response, $args) {

    $data = $request->getParsedBody(); // get POST data

    // TODO: update to version 2
    $cryptoData = file_get_contents('https://api.coinmarketcap.com/v2/ticker/?limit=' . $data['amount']);
    return $response->withJson(json_decode($cryptoData));
});

$app->post('/data-currency', function($request, $response, $args) {

    $data = $request->getParsedBody(); // get POST data

    $link =  
        'https://min-api.cryptocompare.com/data/histoday?'
        . 'fsym=' . $data['cryptoCurrency']
        . '&tsym=' . $data['fiat']
        . '&limit=' . $data['limit'];

    if(isset($data['timestamp'])) {
        $link .= '&toTs=' . $data['timestamp'];
    }

    $data = file_get_contents($link); // get document
    return $response->withJson(json_decode($data));
});


$app->post('/save', function($request, $response, $args) {

    $data = $request->getParsedBody()['data']; // get POST data

    $dataArray = json_decode($data);
    $dataJson = json_encode($dataArray, JSON_PRETTY_PRINT);

    // save json
    $fJson = fopen('./data/data.json', 'w');
    fwrite($fJson , $dataJson);
    fclose($fJson);

    // save csv
    $fCsv = fopen('./data/data.csv', 'w');

    fputcsv($fCsv, array('Date', 'Coin', 'Close', 'High', 'Low', 'Open', 'VolumeFrom', 'VolumeTo'), ';');
    foreach( $dataArray as $currency ) {

        foreach( $currency->data as $day ) {
            $arrayDay = json_decode(json_encode($day), True); // from stdObject to array

            // transform date
            $helpDate = $arrayDay['time'];
            $date = new DateTime("@$helpDate");
            $arrayDay['time'] = date_format($date, 'd.m.Y');
            
            fputcsv($fCsv, array(
                $arrayDay['time'],
                $currency->name,
                str_replace('.', ',', $arrayDay['close']),
                str_replace('.', ',', $arrayDay['high']),
                str_replace('.', ',', $arrayDay['low']),
                str_replace('.', ',', $arrayDay['open']),
                str_replace('.', ',', $arrayDay['volumefrom']),
                str_replace('.', ',', $arrayDay['volumeto'])
            ),
            ';');
        }
    }
    fclose($fCsv);

    return $response->withJson(array('status' => 'OK'));
});

// run app
$app->run();