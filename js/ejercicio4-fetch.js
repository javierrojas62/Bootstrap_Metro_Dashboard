// Ejercicio 4: Fuentes de datos externas - JS Web APIs - Fetch
// Replica lo del Ejercicio 3 para "orders" y "visits", pero con fetch() en vez de AJAX.
// Usa refreshBoxChart() definida en js/ejercicio3-ajax.js (por eso ese script se carga antes).

function fetchAndUpdate(url, countSelector, chartSelector) {
	fetch(url)
		.then(function (response) { return response.text(); })
		.then(function (data) {
			$(countSelector).text(data.trim());
			refreshBoxChart(chartSelector);
		})
		.catch(function (error) {
			console.error('Error al obtener ' + url, error);
		});
}

$(function () {
	$('#refreshOrders').on('click', function (e) {
		e.preventDefault();
		var randomFile = Math.floor(Math.random() * 3) + 1; // 1, 2 o 3
		fetchAndUpdate('ajax/orders_' + randomFile + '.html', '#ordersCount', '#ordersChart');
	});

	$('#refreshVisits').on('click', function (e) {
		e.preventDefault();
		var randomFile = Math.floor(Math.random() * 3) + 1; // 1, 2 o 3
		fetchAndUpdate('ajax/visits_' + randomFile + '.html', '#visitsCount', '#visitsChart');
	});

	// Actualización automática del indicador de visitas cada 1 segundo
	setInterval(function () {
		var randomFile = Math.floor(Math.random() * 3) + 1; // 1, 2 o 3
		fetchAndUpdate('ajax/visits_' + randomFile + '.html', '#visitsCount', '#visitsChart');
	}, 1000);
});
