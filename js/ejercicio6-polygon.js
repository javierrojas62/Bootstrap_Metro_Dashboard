// Ejercicio 6: Fuentes de datos externas - API REST (Polygon.io) + CanvasJS

$(function () {
	var POLYGON_API_KEY = 'sidPHcxx9YV01qaokNixBCs32O9XpzQT';

	var polygonStatusEl = $('#polygonStatus');

	// Fecha de referencia: el plan free de Polygon.io da datos "end of day" con delay,
	// y además NO permite consultar fechas de más de ~2 años atrás ("NOT_AUTHORIZED").
	// Por eso calculamos dinámicamente un día hábil reciente en vez de hardcodear una fecha fija.
	function getRecentTradingDate(daysBack) {
		var d = new Date();
		d.setDate(d.getDate() - daysBack);
		while (d.getDay() === 0 || d.getDay() === 6) { // 0=domingo, 6=sábado
			d.setDate(d.getDate() - 1);
		}
		return d.toISOString().slice(0, 10);
	}

	var SUMMARY_DATE = getRecentTradingDate(4);

	// La "Grouped Daily" trae miles de tickers; recortamos a una watchlist
	// para poder graficarla en el widget de 12 columnas del punto 3.
	var WATCHLIST = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX', 'JPM', 'V'];

	$('#marketSummaryDate').text(SUMMARY_DATE);

	if (!POLYGON_API_KEY || POLYGON_API_KEY === 'TU_API_KEY_DE_POLYGON_IO') {
		polygonStatusEl.html(
			'<span style="color:#da4f49;">Falta configurar POLYGON_API_KEY en js/ejercicio6-polygon.js. ' +
			'Registrate gratis en <a href="https://polygon.io" target="_blank">polygon.io</a> y pegá tu token en la variable POLYGON_API_KEY.</span>'
		);
		return;
	}

	// Punto 1: Daily Open/Close de AAPL
	fetch('https://api.polygon.io/v1/open-close/AAPL/' + SUMMARY_DATE + '?adjusted=true&apiKey=' + POLYGON_API_KEY)
		.then(function (r) {
			if (!r.ok) { throw new Error('HTTP ' + r.status); }
			return r.json();
		})
		.then(function (data) {
			$('#aaplSummary').html(
				'Open: $' + data.open + ' | Close: $' + data.close +
				' | High: $' + data.high + ' | Low: $' + data.low +
				' | Vol: ' + data.volume
			);
		})
		.catch(function (err) {
			// Causas típicas en el plan free de Polygon.io:
			// 401 = API key inválida/faltante, 403 = endpoint no incluido en el plan,
			// 429 = límite de 5 llamadas/minuto superado.
			$('#aaplSummary').html('<span style="color:#da4f49;">Error al consultar AAPL: ' + err.message + '</span>');
		});

	// Punto 2: Grouped Daily (resumen del mercado) de una fecha particular
	fetch('https://api.polygon.io/v2/aggs/grouped/locale/us/market/stocks/' + SUMMARY_DATE + '?adjusted=true&apiKey=' + POLYGON_API_KEY)
		.then(function (r) {
			if (!r.ok) { throw new Error('HTTP ' + r.status); }
			return r.json();
		})
		.then(function (marketData) {
			var results = marketData.results || [];

			// Punto 3: graficamos la watchlist con barras verdes (suben) / rojas (bajan)
			var chartEl = $('#marketChart');
			chartEl.empty();

			WATCHLIST.forEach(function (ticker) {
				var bar = results.filter(function (r) { return r.T === ticker; })[0];
				if (!bar) { return; }

				var changePct = ((bar.c - bar.o) / bar.o) * 100;
				var isPositive = changePct >= 0;
				var color = isPositive ? '#5bb75b' : '#da4f49';
				var heightPct = Math.max(5, Math.min(100, Math.abs(changePct) * 20));

				var singleBar = $('<div class="singleBar"></div>').css('cursor', 'pointer');
				var barDiv = $('<div class="bar"></div>');
				var value = $('<div class="value"></div>').css({
					height: heightPct + '%',
					background: color
				});
				var title = $('<div class="title"></div>')
					.css('color', color)
					.html(ticker + '<br>' + (isPositive ? '+' : '') + changePct.toFixed(2) + '%');

				barDiv.append(value);
				singleBar.append(barDiv).append(title);

				singleBar.on('click', function () {
					showCandlestick(ticker);
				});

				chartEl.append(singleBar);
			});
		})
		.catch(function (err) {
			polygonStatusEl.html('<span style="color:#da4f49;">Error al consultar el resumen de mercado: ' + err.message + '</span>');
		});

	// Punto 4: gráfico de velas (CanvasJS StockChart) al hacer clic en una barra
	function showCandlestick(ticker) {
		var to = SUMMARY_DATE;
		var fromDate = new Date(SUMMARY_DATE);
		fromDate.setDate(fromDate.getDate() - 30);
		var from = fromDate.toISOString().slice(0, 10);

		fetch('https://api.polygon.io/v2/aggs/ticker/' + ticker + '/range/1/day/' + from + '/' + to + '?adjusted=true&sort=asc&apiKey=' + POLYGON_API_KEY)
			.then(function (r) {
				if (!r.ok) { throw new Error('HTTP ' + r.status); }
				return r.json();
			})
			.then(function (data) {
				var results = data.results || [];
				var dataPoints = results.map(function (bar) {
					return { x: new Date(bar.t), y: [bar.o, bar.h, bar.l, bar.c] };
				});

				$('#candleTicker').text(ticker);
				$('#candleChartContainer').show();

				var chart = new CanvasJS.StockChart('candleChart', {
					title: { text: ticker + ' - Últimos 30 días' },
					charts: [{
						data: [{
							type: 'candlestick',
							dataPoints: dataPoints
						}]
					}]
				});
				chart.render();
			})
			.catch(function (err) {
				alert('Error al obtener el historial de ' + ticker + ': ' + err.message);
			});
	}
});
