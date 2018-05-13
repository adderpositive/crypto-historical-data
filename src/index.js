import $ from 'jquery';

( function() {
  
  /*
    Oddělit API, formuláře, pomocné funcke a DOM
  */

  var app = {
    // how many days from today
    days: 7,
    // currencies sorted by market capital,
    cryptocurrenciesAmount: 10,
    // to which prices you want to transfer
    fiat: 'USD',
    // day to
    dateTo: null,
    // day to
    dateFrom: null,
    // preloader interval
    preloaderInterval: null,


    /********************
     * get prices historical data for one crypto currency
     *
     * @parameter - crypto currency
     * @return - ajax function
     */
    single: function( crypto ) {
      var symbol = crypto.symbol;
      var fiat = app.fiat;
      var data = {};

      // exceptions
      if ( crypto.symbol === 'MIOTA' ) {
        symbol = 'IOT';
      }

      /* if fiat is BTC & crypto is BTC - api will response
      *  with error message 
      *  Solution: get data in USD and then change them
      */
      if ( app.fiat === 'BTC' && crypto.symbol === 'BTC' ) {
        fiat = 'USD';
      }

      // default given data
      data = {
        limit: app.days, // amount of days
        fiat: fiat,
        cryptoCurrency: symbol
      };

      if ( app.dateTo ) {
        data.timestamp = app.dateTo / 1000; // to seconds
      }

      return $.ajax( {
        url: './data-currency',
        method: 'POST',
        dataType: 'json',
        data: data
      } );
    },

    /********************
     * save data to the file
     *
     * @parameter - format (csv, xml, json), data
     * 
     */
    saveFile: function( data ) {
      $.ajax( {
        url: './save',
        method: 'POST',
        dataType: 'json',
        data: {
          data: JSON.stringify( data )
        },
        success: function( data ) {
            var isButtonsExist = $( '.download-buttons' ).length;
          $( '.preloader' ).remove();
          clearInterval( app.preloaderInterval );

          if ( !isButtonsExist ) {
            $( '#app' ).append(
              '<div class="button-wrap download-buttons">' +
              '<a class="button" href="./data/data.json" download>Download .json</a><br />' +
              '<a class="button" href="./data/data.csv" download>Download .csv</a><br />' +
              '<a class="button js-table-open" href="#">Just show data</a>' +
              '</div>'
            );
          }

          // add open event
          $( '.js-table-open' ).click( function() {
            $( '.table-wrap' ).addClass( 'active' );
          } );

          // add close event
          $( '.js-table-close' ).click( function() {
            $( '.table-wrap' ).removeClass( 'active' );
          } );
        }
      } );
    },

    // preloader
    addPreloader: function() {
      $( 'body' ).append(
        '<div class="preloader">' +
        '<div class="rocket-trajectory">' +
        '<div class="rocket">' +
        '<i class="rocket__fuel rocket__fuel--1"></i>' +
        '<i class="rocket__fuel rocket__fuel--2"></i>' +
        '</div>' +
        '</div>' +
        '<div class="preloader__loading">Loading data<span class="js-dot"></span></div>' +
        '</div>'
      );

      // animate loading dots
      app.preloaderInterval = setInterval( function() {
        var $dots = $( '.js-dot' );
        var dotsLength = $dots.text().length;

        if ( dotsLength < 3 ) {
          $dots.text( $dots.text() + '.' );
        } else {
          $dots.text( '' );
        }
      }, 500 );
    },

    addHtmlTable: function( data ) {
      var $dataRows = [];
      var i;
      var isTableExist = $( '.js-table' )[ 0 ].childNodes.length;
      var row;

      for ( i in data ) {
        var j;

        for ( j in data[ i ].data ) {
          var date = new Date( data[ i ].data[ j ].time * 1000 );
          var formattedDate = date.getDate() + '. ' +
            ( date.getMonth() + 1 ) +
            '. ' + date.getFullYear();

          $dataRows.push( $(
            '<tr>' +
            '<td>' + formattedDate + '</td>' +
            '<td>' + data[ i ].name + '</td>' +
            '<td>' + data[ i ].data[ j ].close + '</td>' +
            '<td>' + data[ i ].data[ j ].high + '</td>' +
            '<td>' + data[ i ].data[ j ].low + '</td>' +
            '<td>' + data[ i ].data[ j ].open + '</td>' +
            '<td>' + data[ i ].data[ j ].volumefrom + '</td>' +
            '<td>' + data[ i ].data[ j ].volumeto + '</td>' +
            '</tr>'
          ) );
        }
      }

      // create table if not exist else remove data from body
      if ( !isTableExist ) {
        $( '.js-table' ).append(
          '<table class="u-full-width">' +
          '<thead>' +
          '<tr>' +
          '<th>Date</th>' +
          '<th>Coin</th>' +
          '<th>Close</th>' +
          '<th>High</th>' +
          '<th>Low</th>' +
          '<th>Open</th>' +
          '<th>Volume from</th>' +
          '<th>Volume to</th>' +
          '</tr>' +
          '</thead>' +
          '<tbody></tbody>' +
          '</table>'
        );
      } else {
        $( 'tbody > tr' ).remove();
      }

      for ( row in $dataRows ) {
        $( 'tbody' ).append( $dataRows[ row ] );
      }
    },

    /********************
     * 1. get all currencies from ajax call
     * 2. create request on all gotten currencies
     * 3. save data into the currencies object
     * 4. process data
     *
     */
    init: function() {
      app.addPreloader();

      $.ajax( {
        url: './data-all-currencies',
        method: 'POST',
        dataType: 'json',
        data: {
          amount: app.cryptocurrenciesAmount
        },
        success: function( response ) {
          var requests = [];
          var data = response.data;
          var dataKeys = Object.keys( data );
          var dataArray = [];
          var i;

          // sorted keys
          dataKeys.sort( function( a, b ) {
            return data[ a ].rank - data[ b ].rank;
          } );

          for ( i in dataKeys ) {
            dataArray.push( data[ dataKeys[ i ] ] ); // push to array item by rank
            requests.push( app.single( dataArray[ i ] ) ); // create requests
          }

          // aysnchronous operation - waiting for all requests will be done
          $.when.apply( null, requests ).then( function() {
            var j;
            var isBTCException = app.fiat === 'BTC' && dataArray[ i ].symbol === 'BTC';

            for ( j in arguments ) {
              dataArray[ j ].data = arguments[ j ][ 0 ].Data;

              if ( isBTCException ) {
                var h;

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

            app.addHtmlTable( dataArray );
            app.saveFile( dataArray );
          } );
        }
      } );
    }
  };


  // TODO: more code readable
  // on window ready set dates
  var today = new Date();
  var beforeWeek = new Date();

  beforeWeek.setDate( today.getDate() - 6 );

  function formatDateForInput( date ) {
    var years = date.getFullYear();
    var months = date.getMonth() + 1;
    var days = date.getDate();

    if ( months < 10 ) {
      months = '0' + months;
    }

    if ( days < 10 ) {
      days = '0' + days;
    }

    return years + '-' + months + '-' + days;
  }

  var _MS_PER_DAY = 1000 * 60 * 60 * 24;
  // a and b are javascript Date objects
  function dateDiffInDays( a, b ) {
    // Discard the time and time-zone information.
    var utc1 = Date.UTC( a.getFullYear(), a.getMonth(), a.getDate() );
    var utc2 = Date.UTC( b.getFullYear(), b.getMonth(), b.getDate() );

    return Math.floor( ( utc2 - utc1 ) / _MS_PER_DAY );
  }

  $( '#date-to' ).val( formatDateForInput( today ) );
  $( '#date-from' ).val( formatDateForInput( beforeWeek ) );

  app.days = dateDiffInDays( beforeWeek, today );



  // search data
  $( '.js-search' ).click( function() {

    /*
        formulářové hodnoty přidat do proměnných

    */

    if ( $( '#date-to' ).val() ) {
      app.dateTo = Date.parse( $( '#date-to' ).val() );
    }

    if ( $( '#date-from' ).val() ) {
      app.dateFrom = Date.parse( $( '#date-from' ).val() );
    }

    if ( +$( '#amount' ).val() ) {
      app.cryptocurrenciesAmount = +$( '#amount' ).val();
    }

    if ( $( '#fiat' ).val().length > 0 ) {
      app.fiat = $( '#fiat' ).val()
    }

    app.days = dateDiffInDays( new Date( app.dateFrom ), new Date( app.dateTo ) );

    console.log( app );

    app.init();
  } );

  // show settings
  $( '.js-show-settings' ).click( function() {
    var $this = $( this ),
      $parent = $this.parents( '.settings-wrap' );
    $parent.find( '.settings' ).slideDown( 400 );
    $this.hide();
  } );
}() );