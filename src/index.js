import $ from 'jquery';
import { getDates } from './helpers.js';
import init from './api.js';
import * as dom from './dom.js';

(function() {
  // how many days from today
  let days = 7;
  // currencies sorted by market capital
  let cryptocurrenciesAmount = 10;
  // to which prices you want to transfer
  let fiat = 'USD';
  // day to
  let dateTo = null;
  // day to
  let dateFrom = null;
  // preloader interval
  let preloaderInterval = null;

  days = getDates().days;
  dom.setDates();

  // search data
  $( '.js-search' ).click( function() {

    if ( $( '#date-to' ).val() ) {
      dateTo = Date.parse( $( '#date-to' ).val() );
    }

    if ( $( '#date-from' ).val() ) {
      dateFrom = Date.parse( $( '#date-from' ).val() );
    }

    if ( +$( '#amount' ).val() ) {
      cryptocurrenciesAmount = +$( '#amount' ).val();
    }

    if ( $( '#fiat' ).val().length > 0 ) {
      fiat = $( '#fiat' ).val()
    }

    days = getDates( new Date( dateTo ), new Date( dateFrom ) ).days;

    console.log(days,  getDates( new Date( dateTo ), new Date( dateFrom ) ));

    const data = {
      amountOfCurrencies: cryptocurrenciesAmount,
      fiat: fiat,
      days: days,
      timestamp: dateTo
    }

    init( data, preloaderInterval );

  });

  dom.eventSettings();

}());