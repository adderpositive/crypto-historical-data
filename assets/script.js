(function() {
	// setting

	var app = {
		// how many days from today
		days: 7,
		// currencies sorted by market capital,
		cryptocurrenciesAmount: 10,
		// to which prices you want to transfer
		fiat: 'USD',


		/********************
		* get prices historical data for one crypto currency
		*
		* @parameter - crypto currency
		* @return - ajax function
		*/
		single: function (crypto) {
			var symbol = crypto.symbol;

			// exceptions
			if(crypto.symbol === 'MIOTA') {
				symbol = 'IOT';
			}

			return $.ajax({
				url: './data-currency',
				method: 'POST',
				dataType: 'json',
				data: {
					limit: app.days,
					fiat: app.fiat,
					cryptoCurrency: symbol,
				}
			});
		},

		/********************
		* save data to the file
		*
		* @parameter - format (csv, xml, json), data
		* 
		*/
		saveFile: function(data) {
			$.ajax({
				url: './save',
				method: 'POST',
				dataType: 'json',
				data: {
					data: JSON.stringify(data)
				},
				success: function(data) {
					$('.loading').remove();
					$('#app').append('<a class="button" href="./data/data.json" download>Download .json</a><br />');
					$('#app').append('<a class="button" href="./data/data.csv" download>Download .csv</a>');
				}
			});
		},

		/********************
		* 1. get all currencies from ajax call
		* 2. create request on all gotten currencies
		* 3. save data into the currencies object
		* 4. process data
		*
		*/
		init: function() {
			$('#app').append('<div class="loading">Loading...</div>'); // add loading element

			$.ajax({
				url: './data-all-currencies',
				method: 'POST',
				dataType: 'json',
				data: {
					amount: app.cryptocurrenciesAmount
				},
				success: function(response) {
					var requests = [],
						data = response.data;
						dataKeys = Object.keys(data),
						dataArray = [];

					// sorted keys
					dataKeys.sort(function(a, b) {
						return data[a].rank - data[b].rank;
					});

					for(var i = 0; i < dataKeys.length; i++) {
						dataArray.push(data[dataKeys[i]]); // push to array item by rank
						requests.push(app.single(dataArray[i])); // create requests
					}

					// aysnchronous operation - waiting for all requests will be done
					$.when.apply(null, requests).then(function() {

						for(var i = 0; i < arguments.length; i++) {
							dataArray[i].data = arguments[i][0].Data;
						}

						console.log(dataArray);
						app.saveFile(dataArray);
					});
				}
			});
		}
	};

	app.init();
}());