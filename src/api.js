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
  if ( crypto.symbol === 'MIOTA' ) {
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

  return $.ajax({
    url: './data-currency',
    method: 'POST',
    dataType: 'json',
    data: {
      fiat,    
      symbol,
      days,
      timestamp
    }
  });
}

/********************
 * save data to the file
 *
 * @parameter - format (csv, xml, json), data
 * 
 */
function saveFile( data, interval ) {
  const dataArray = data;

  $.ajax( {
    url: './save',
    method: 'POST',
    dataType: 'json',
    data: {
      data: JSON.stringify( data )
    },
    success: function( data ) {
      dom.removePreloader( interval );
      dom.addButtons();
      dom.addTableEvents();
      dom.addTable( dataArray );
    }
  } );
}

/********************
 * 1. get all currencies from ajax call
 * 2. create request on all gotten currencies
 * 3. save data into the currencies object
 * 4. process data
 *
 */
export default function init( data, interval ) {
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
    success: function( response ) {
      const requests = [];
      const data = response.data;
      const dataKeys = Object.keys( data );
      const dataArray = [];
      let i;

      // sorted keys
      dataKeys.sort( function( a, b ) {
        return data[ a ].rank - data[ b ].rank;
      } );

      for ( i in dataKeys ) {
        // push to array item by rank
        dataArray.push( data[ dataKeys[ i ] ] ); 

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
      $.when.apply( null, requests ).then( function() {
        let j;
        const isBTCException = fiat === 'BTC' && dataArray[ i ].symbol === 'BTC';

        for ( j in arguments ) {
          dataArray[ j ].data = arguments[ j ][ 0 ].Data;

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

        saveFile( dataArray, interval );
      } );
    }
  } );
}