# crypto-historical-data
A small web script to get historical prices of cryptocurrencies builded on data from - https://min-api.cryptocompare.com/ and https://api.coinmarketcap.com/. Default setting: data from 7 days ago to now, 10 top cryptocurrencies in USD fiat money. GNU general public license.

Run index.php on your local/web server - you can download `.json`,`.csv` files for personal analyses or you can just watch data.

## Data you will get (example):

| Date        | Coin    | Close   | High    | Low     | Open    | Volume from | Volume to
| ----------- |:-------:|:-------:|:-------:|:-------:|:-------:|:-----------:| ------------:|
| 2. 5. 2018  | Bitcoin | 9232.19 | 9271.62 | 8993.82 | 9077.28 | 57618.44    | 527488395.49 |
| 3. 5. 2018  | Bitcoin | 9745.04 | 9817.19 | 9172.28 | 9232.19 | 90631.98    | 857646889.15 |
| 4. 5. 2018  | Bitcoin | 9699.61 | 9785.15 | 9547.21 | 9746.26 | 68689.75    | 663887678.35 |
| 5. 5. 2018  | Bitcoin | 9845.9  | 9968.85 | 9687.09 | 9700.37 | 68875.75    |  679872376.4 |

## TODO
- add styles to rocket! <3