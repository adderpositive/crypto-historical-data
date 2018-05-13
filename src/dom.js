import $ from 'jquery';
import { 
  formatDateForInput,
  getDates
} from './helpers.js';

// preloader
export function removePreloader( interval ) {
  $( '.preloader' ).remove();
  clearInterval( interval );
}


export function addPreloader( interval ) {
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
  interval = setInterval( function() {
    var $dots = $( '.js-dot' );
    var dotsLength = $dots.text().length;

    if ( dotsLength < 3 ) {
      $dots.text( $dots.text() + '.' );
    } else {
      $dots.text( '' );
    }
  }, 500 );
}

export function addTable( data ) {
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
}

export function addButtons() {
  var isButtonsExist = $( '.download-buttons' ).length;

 if ( !isButtonsExist ) {
        
    $( '#app' ).append(
      '<div class="button-wrap download-buttons">' +
      '<a class="button" href="./data/data.json" download>Download .json</a><br />' +
      '<a class="button" href="./data/data.csv" download>Download .csv</a><br />' +
      '<a class="button js-table-open" href="#">Just show data</a>' +
      '</div>'
    );
  }
}


export function addTableEvents() {
  // add open event
  $( '.js-table-open' ).click( function() {
    $( '.table-wrap' ).addClass( 'active' );
  } );

  // add close event
  $( '.js-table-close' ).click( function() {
    $( '.table-wrap' ).removeClass( 'active' );
  } );
}

export function setDates() {
  $( '#date-to' ).val( formatDateForInput( getDates().dateFrom ) );
  $( '#date-from' ).val( formatDateForInput( getDates().dateTo ) );
}

export function eventSettings() {
  $( '.js-show-settings' ).click( function() {
    const $this = $( this );
    const $parent = $this.parents( '.settings-wrap' );
    
    $parent.find( '.settings' ).slideDown( 400 );
    $this.hide();
  });
}