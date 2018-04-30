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

$container['view']['version'] = '0.0.1';

$app->get('/', function ($request, $response, $args) {
    return $this->view->render($response, 'index.html');
})->setName('index');

$app->post('/data-all-currencies', function($request, $response, $args) {

    $data = $request->getParsedBody(); // get POST data

    $cryptoData = file_get_contents('https://api.coinmarketcap.com/v1/ticker/?limit=' . $data['amount']);
    return $response->withJson(json_decode($cryptoData));
});

$app->post('/data-currency', function($request, $response, $args) {

    $data = $request->getParsedBody(); // get POST data

    $data = file_get_contents('https://min-api.cryptocompare.com/data/histoday?fsym=' . $data['cryptoCurrency'] . '&tsym=' . $data['fiat'] . '&limit=' . $data['limit']); // get document
    return $response->withJson(json_decode($data));
});

// run app
$app->run();