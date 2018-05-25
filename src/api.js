import $ from 'jquery';
import * as dom from './dom.js';

function getSingleCryptoData( data ) {
  let { 
    fiat,
    symbol,
    days,
    timestamp 
  } = data;

  /* Exception for MIOTA coin 
  */
  if ( symbol === 'MIOTA' ) {
    symbol = 'IOT';
  }

  /* If fiat is BTC & symbol is BTC - api will response
  *  with error message
  *
  *  Solution is to get data in USD and then change them
  */
  if ( fiat === 'BTC' && symbol === 'BTC' ) {
    fiat = 'USD';
  }

  // cover to seconds, now it is in miliseconds
  if ( timestamp ) {
    timestamp /= 1000;
  }

  const sendRequest = new Promise(( resolve, reject ) => {
    const request = new XMLHttpRequest();
    request.open('POST', './data-currency', true);
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    request.onload = () => {
      if( request.status === 200 ) {
        resolve( request.responseText );
      }
    };
    request.send(JSON.stringify({
      fiat,    
      symbol,
      days,
      timestamp
    }));
  });
  

  return sendRequest;
}

/********************
 * save data to the file
 *
 * @parameter - saved data
 * 
 */
function saveFile( data ) {
  const dataArray = data;
  const request = new XMLHttpRequest();
  
  request.open('POST', './save', true);
  request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

  request.onload = () => {
    if ( request.readyState === request.DONE ) {
      if ( request.status === 200 ) {
        dom.removePreloader();
        dom.addButtons();
        dom.addTableEvents();
        dom.addTable( dataArray );
      }
    }
  }

  request.send({
    data: JSON.stringify( data )
  });
}

/********************
 * 1. get all currencies from ajax call
 * 2. create request on all gotten currencies
 * 3. save data into the currencies object
 * 4. process data
 *
 */
export default function init( data ) {
  let {
    amountOfCurrencies,
    fiat,
    days,
    timestamp
  } = data;
  
  dom.addPreloader();

  $.ajax( {
    url: './data-all-currencies',
    method: 'POST',
    dataType: 'json',
    data: {
      amountOfCurrencies
    },
    success: ( response ) => {
      const requests = [];
      const dataResponse = response.data;
      const dataKeys = Object.keys( dataResponse );
      const dataArray = [];
      let i;

      // sorted keys
      dataKeys.sort(( a, b ) => {
        return dataResponse[ a ].rank - dataResponse[ b ].rank;
      } );

      for ( i in dataKeys ) {
        // push to array item by rank
        dataArray.push( dataResponse[ dataKeys[ i ] ] ); 

        // create requests
        requests.push( 
          getSingleCryptoData({
            fiat,
            days,
            symbol: dataArray[ i ].symbol,
            timestamp
          }) 
        ); 
      }

      // aysnchronous operation - waiting for all requests will be done
      Promise.all( requests ).then(( operations ) => {
        let j;
        const isBTCException = fiat === 'BTC' && dataArray[ i ].symbol === 'BTC';

        for ( j in operations ) {
          dataArray[ j ].data = JSON.parse(operations[j]).Data;

          if ( isBTCException ) {
            let h;

            for ( h in dataArray[ i ].data ) {
              dataArray[ j ].data[ h ].close = 1;
              dataArray[ j ].data[ h ].high = 1;
              dataArray[ j ].data[ h ].low = 1;
              dataArray[ j ].data[ h ].open = 1;
              dataArray[ j ].data[ h ].volumefrom = 1;
              dataArray[ j ].data[ h ].volumeto = 1;
            }
          }
        }

        console.log( dataArray );
        saveFile( dataArray );
      });
    }
  });
}