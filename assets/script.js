(function() {
	// setting

	var app = {
		// how many days from today
		days: 7,
		// currencies sorted by market capital,
		cryptocurrenciesAmount: 10,
		// to which prices you want to transfer
		fiat: 'USD',
		// day to
		dateTo: null,
		// preloader interval
		preloaderInterval: null,


		/********************
		* get prices historical data for one crypto currency
		*
		* @parameter - crypto currency
		* @return - ajax function
		*/
		single: function (crypto) {
			var symbol = crypto.symbol,
				fiat = app.fiat;

			// exceptions
			if(crypto.symbol === 'MIOTA') {
				symbol = 'IOT';
			}

			// if fiat is BTC & crypto is BTC - api will response
			// with error message
			if(app.fiat === 'BTC' && crypto.symbol === 'BTC') {
				fiat = 'USD';
			}

			// default given data
			var data = {
				limit: app.days - 1, // amount of days
				fiat: fiat,
				cryptoCurrency: symbol,
			};

			if(app.dateTo) {
				data.timestamp = app.dateTo / 1000; // to seconds
			}

			return $.ajax({
				url: './data-currency',
				method: 'POST',
				dataType: 'json',
				data: data
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
					$('.preloader').remove();
					clearInterval(preloaderInterval);

					if(!$('.download-buttons').length > 0) {
						$('#app').append(
							'<div class="button-wrap download-buttons">' +
								'<a class="button" href="./data/data.json" download>Download .json</a><br />' +
								'<a class="button" href="./data/data.csv" download>Download .csv</a><br />' +
								'<a class="button js-table-open" href="#">Just show data</a>' +
							'</div>'
						);
					}

					// add open event
					$('.js-table-open').click(function() {
						$('.table-wrap').addClass('active');
					});

					// add close event
					$('.js-table-close').click(function() {
						$('.table-wrap').removeClass('active');
					});
				}
			});
		},

		// preloader
		addPreloader: function() {
			$('body').append(
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
			preloaderInterval = setInterval(function() {
				var $dots = $('.js-dot');
					dotsLen = $dots.text().length;
				if(dotsLen < 3) {
					$dots.text($dots.text() + '.');
				} else {
					$dots.text('');
				}	
			}, 500);
		},

		addHtmlTable: function(data) {
			var $dataRows = [];

			for(var i = 0; i < data.length; i++) {
				for(var j = 0; j < data[i].data.length; j++) {
					var date = new Date(data[i].data[j].time * 1000);
					$dataRows.push($(
						'<tr>' +
							'<td>' + date.getDate() + '. ' + (date.getMonth() + 1) + '. ' + date.getFullYear() + '</td>' +
							'<td>' + data[i].name + '</td>' +
							'<td>' + data[i].data[j].close + '</td>' +
							'<td>' + data[i].data[j].high + '</td>' +
							'<td>' + data[i].data[j].low + '</td>' +
							'<td>' + data[i].data[j].open + '</td>' +
							'<td>' + data[i].data[j].volumefrom + '</td>' +
							'<td>' + data[i].data[j].volumeto + '</td>' +
						'</tr>'
					));
				}
			}

			// create table if not exist else remove data from body
			if(!$('.js-table')[0].childNodes.length > 0) {
				$('.js-table').append(
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
				$('tbody > tr').remove();
			}

			for(var i = 0; i < $dataRows.length; i++) {
				$('tbody').append($dataRows[i]);
			}
		},

		/********************
		* 1. get all currencies from ajax call
		* 2. create request on all gotten currencies
		* 3. save data into the currencies object
		* 4. process data
		*
		*/
		init: function() {
			app.addPreloader();

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

							// if fiat is BTC & crypto is BTC - api will response
							// with error message
							if(app.fiat === 'BTC' && dataArray[i].symbol === 'BTC') {
								for(var j = 0; j < dataArray[i].data.length; j++) {
									dataArray[i].data[j].close = 1;
									dataArray[i].data[j].high = 1;
									dataArray[i].data[j].low = 1;
									dataArray[i].data[j].open = 1;
									dataArray[i].data[j].time = 1;									
									dataArray[i].data[j].volumefrom = 1;
									dataArray[i].data[j].volumeto = 1;
								}
							}
						}

						app.addHtmlTable(dataArray);
						app.saveFile(dataArray);
					});
				}
			});
		}
	};

	// search data
	$('.js-search').click(function() {
		if($('#date-to').val()) {
			app.dateTo = Date.parse($('#date-to').val());
		}

		if(Number($('#days').val()) > 0) {
			app.days = Number($('#days').val());
		}

		if(Number($('#amount').val())) {
			app.cryptocurrenciesAmount = Number($('#amount').val());
		}

		if($('#fiat').val().length > 0) {
			app.fiat = $('#fiat').val()
		}

		app.init();
	});
	
	// show settings
	$('.js-show-settings').click(function() {
		var $this = $(this),
			$parent = $this.parents('.settings-wrap');
		$parent.find('.settings').slideDown(400);
		$this.hide();
	});
}());