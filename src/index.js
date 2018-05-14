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

  days = getDates().days;
  dom.setDates();

  // search data
  $( '.js-search' ).click(() => {
    const data = {};

    if ( $( '#date-to' ).val() ) {
      dateTo = Date.parse( $( '#date-to' ).val() );
    }

    if ( $( '#date-from' ).val() ) {
      dateFrom = Date.parse( $( '#date-from' ).val() );
    }

    if ( +$( '#amount' ).val() ) {
      cryptocurrenciesAmount = +$( '#amount' ).val();
    }

    if ( $( '#fiat' ).val().length ) {
      fiat = $( '#fiat' ).val()
    }

    days = getDates( new Date( dateTo ), new Date( dateFrom ) ).days;

    data.amountOfCurrencies = cryptocurrenciesAmount;
    data.fiat = fiat;
    data.days = days;
    data.timestamp = dateTo;

    init( data );

  });

  dom.eventSettings();

}());