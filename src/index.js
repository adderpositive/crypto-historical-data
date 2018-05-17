import { getDates } from './helpers.js';
import init from './api.js';
import * as dom from './dom.js';

document.addEventListener('DOMContentLoaded', () => {
  const $searchEl = document.getElementsByClassName('js-search')[0];
  // how many days - dateTo-dateFrom
  let days = 7;
  // currencies sorted by market capital
  let amountOfCurrencies = 10;
  // to which prices you want to transfer
  let fiat = 'USD';
  // day to
  let dateTo = null;
  // day from
  let dateFrom = null;

  // initial form setting
  days = getDates().days;
  dom.setDates();
  dom.eventSettings();

  // search data event
  $searchEl.addEventListener('click', () => {
    const data = {};

    dateTo = dom.getDateTo();
    dateFrom = dom.getDateFrom();

    if( dateTo > dateFrom ) {
      days = getDates( new Date( dateTo ), new Date( dateFrom ) ).days;

      data.amountOfCurrencies = dom.getCryptoAmount();;
      data.fiat = dom.getFiat();
      data.days = days;
      data.timestamp = dateTo;

      init( data );
    } else {
      alert('Date from can not be bigger or same then Date to!')
    }
  });
});