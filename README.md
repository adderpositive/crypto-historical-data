# crypto-historical-data
A small web script to get historical prices of cryptocurrencies builded on data from - https://min-api.cryptocompare.com/ and https://api.coinmarketcap.com/.

## Setting
Run `composer install`, then in `script.js` you can set some basic variables like: 
- `days` - how many days from today,
- `cryptocurrenciesAmount` - currencies sorted by market capital,
- `fiat` - to which prices you want to transfer.

Run index.php on your local/web server - you can download `.json` or `.csv` files for personal analyses.

## TODO
- update https://api.coinmarketcap.com/v1/ to version 2