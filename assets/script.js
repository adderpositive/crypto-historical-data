(function() {
	// setting

	var app = {
		// how many days from today
		days: 30,
		// currencies sorted by market capital,
		cryptocurrenciesAmount: 5,
		// to which prices you want to transfer
		fiat: 'USD',


		/********************
		* get prices historical data for one crypto currency
		*
		* @parameter - crypto currency
		* @return - ajax function
		*/
		single: function (crypto) {
			return $.ajax({
				url: './data-currency',
				method: 'POST',
				dataType: 'json',
				data: {
					limit: app.days,
					fiat: app.fiat,
					cryptoCurrency: crypto.symbol,
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
			$.ajax({
				url: './data-all-currencies',
				method: 'POST',
				dataType: 'json',
				data: {
					amount: app.cryptocurrenciesAmount
				},
				success: function(data) {
					var requests = [];

					// create requests
					for(var i = 0; i < data.length; i++) {
						requests.push(app.single(data[i]));
					}

					// aysnchronous operation - waiting for all requests will be done
					$.when.apply(null, requests).then(function() {

						for(var i = 0; i < arguments.length; i++) {
							data[i].data = arguments[i][0].Data;
						}

						// TODO: PROCESS DATA
						console.log(data);
					});
				}
			});
		}
	};

	app.init();
}());