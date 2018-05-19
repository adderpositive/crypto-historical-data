import $ from 'jquery';
import { 
  formatDateForInput,
  getDates
} from './helpers.js';

// preloader interval
let interval = null;

// preloader
export function removePreloader() {
  const $element = document.querySelector('.preloader');

  $element.parentNode.removeChild($element);
  clearInterval( interval );
}

export function addPreloader() {
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
  interval = setInterval(() => {
    const $dots = $( '.js-dot' );
    const dotsLength = $dots.text().length < 3;

    if ( dotsLength ) {
      $dots.text( $dots.text() + '.' );
    } else {
      $dots.text( '' );
    }
  }, 500 );
}

export function addTable( data ) {
  const $dataRows = [];
  const isTableExist = $( '.js-table' )[ 0 ].childNodes.length;
  let i;
  let row;

  for ( i in data ) {
    let j;

    for ( j in data[ i ].data ) {
      const date = new Date( data[ i ].data[ j ].time * 1000 );
      const formattedDate = date.getDate() + '. ' +
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
    const $element = document.querySelector('tbody > tr');
    $element.parentNode.removeChild($element);
  }

  for ( row in $dataRows ) {
    $( 'tbody' ).append( $dataRows[ row ] );
  }
}

export function addButtons() {
  const isButtonsExist = $( '.download-buttons' ).length;

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
  const $open = document.querySelector('.js-table-open');
  const $close = document.querySelector('.js-table-close');
  const $table = document.querySelector('.table-wrap');

  // add open event
  $open.addEventListener('click', () => {
    $table.classList.add('active');
  });

  // add close event
  $close.addEventListener('click', () => {
    $table.classList.remove('active');
  });
}

export function setDates() {
  const $dateTo =  document.getElementById('date-to');
  const $dateFrom =  document.getElementById('date-from');

  $dateTo.value = formatDateForInput( getDates().dateFrom );
  $dateFrom.value = formatDateForInput( getDates().dateTo );
}

export function eventSettings() {
  const $element = document.querySelector('.js-show-settings');

  $element.addEventListener('click', () => {
    const $parent = document.querySelector('.settings-wrap');
    
    $parent.querySelector('.settings').style.display = 'block';
    $element.style.display = 'none';
  });
}

export function getDateTo() {
  const value = document.getElementById('date-to').value;
  return value ? Date.parse( value ) : null;
}

export function getDateFrom() {
  const value = document.getElementById('date-from').value;
  return value ? Date.parse( value ) : null;
}

export function getCryptoAmount() {
  const value = +document.getElementById('amount').value;
  return value ? value : null;
}

export function getFiat() {
  const value = document.getElementById('fiat').value;
  return value ? value : null;
}