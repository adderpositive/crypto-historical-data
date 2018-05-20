import { 
  formatDateForInput,
  getDates
} from './helpers.js';

// preloader interval
let interval = null;

// preloader
export function removePreloader() {
  const $element = document.querySelector('.preloader');

  $element.parentNode.removeChild( $element );
  clearInterval( interval );
}

export function addPreloader() {
  const $wrap = document.querySelector('body');
  const $preloader = document.createElement('div');

  $preloader.innerHTML =
    '<div class="preloader">' +
      '<div class="rocket-trajectory">' +
        '<div class="rocket">' +
          '<i class="rocket__fuel rocket__fuel--1"></i>' +
          '<i class="rocket__fuel rocket__fuel--2"></i>' +
        '</div>' +
      '</div>' +
      '<div class="preloader__loading">Loading data<span class="js-dot"></span></div>' +
    '</div>';
  
  $wrap.appendChild( $preloader.firstChild );
 
  // animate loading dots
  interval = setInterval(() => {
    const $dots = document.querySelector('.js-dot');
    let dotsText = $dots.innerText || $dots.textContent;
    const dotsLength = dotsText.length < 3;

    if ( dotsLength ) {
      dotsText += '.';
    } else {
      dotsText = '';
    }

    $dots.innerHTML = dotsText;
  }, 500 );
}

export function addTable( data ) {
  const $dataRows = [];
  const $tableWrap = document.querySelector('.js-table');
  const isTableExist = $tableWrap.childNodes.length;
  let i;
  let row;

  for ( i in data ) {
    let j;

    for ( j in data[ i ].data ) {
      const $row = document.createElement('tr');
      const date = new Date( data[ i ].data[ j ].time * 1000 );
      const formattedDate = 
        date.getDate() + '. ' +
        ( date.getMonth() + 1 ) + '. ' +
        date.getFullYear();
      
      $row.innerHTML = 
        '<td>' + formattedDate + '</td>' +
        '<td>' + data[ i ].name + '</td>' +
        '<td>' + data[ i ].data[ j ].close + '</td>' +
        '<td>' + data[ i ].data[ j ].high + '</td>' +
        '<td>' + data[ i ].data[ j ].low + '</td>' +
        '<td>' + data[ i ].data[ j ].open + '</td>' +
        '<td>' + data[ i ].data[ j ].volumefrom + '</td>' +
        '<td>' + data[ i ].data[ j ].volumeto + '</td>';
      
      $dataRows.push( $row );
    }
  }

  // create table if not exist else remove data from body
  if ( !isTableExist ) {
    const $newTable = document.createElement('div');

    $newTable.innerHTML =
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
      '</table>';
      $tableWrap.appendChild( $newTable.firstChild );
  } else {
    const $tbody = document.querySelector('tbody');
    
    while( $tbody.firstChild ) {
      $tbody.removeChild( $tbody.firstChild );
    }
  }

  const $tbody = document.querySelector('tbody');
  for ( row in $dataRows ) {
    $tbody.appendChild( $dataRows[ row ] );
  }
}

export function addButtons() {
  const isButtonsExist = document.querySelector('.download-buttons') !== null;

  if ( !isButtonsExist ) {
    const $app = document.getElementById('app');
    const $buttons = document.createElement('div');

    $buttons.innerHTML = 
      '<div class="button-wrap download-buttons">' +
        '<a class="button" href="./data/data.json" download>Download .json</a><br />' +
        '<a class="button" href="./data/data.csv" download>Download .csv</a><br />' +
        '<a class="button js-table-open" href="#">Just show data</a>' +
      '</div>';

    $app.appendChild( $buttons.firstChild );
  }
} 

export function addTableEvents() {
  const $open = document.querySelector('.js-table-open');
  const $close = document.querySelector('.js-table-close');
  const $table = document.querySelector('.table-wrap');

  // add open event
  $open.addEventListener( 'click', () => {
    $table.classList.add('active');
  });

  // add close event
  $close.addEventListener( 'click', () => {
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

  $element.addEventListener( 'click', () => {
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