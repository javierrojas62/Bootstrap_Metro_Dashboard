// Ejercicio 3: Fuentes de datos externas - AJAX

// Ejercicio 3.3: refresca el sparkline (jquery.sparkline) de un indicador con datos aleatorios nuevos
// (función compartida: también la usa js/ejercicio4-fetch.js)
function refreshBoxChart(selector) {
	var sparkOptions = {
		type: 'bar',
		height: retina() ? '120' : '60',
		barWidth: retina() ? '8' : '4',
		barSpacing: retina() ? '2' : '1',
		barColor: '#ffffff',
		negBarColor: '#eeeeee'
	};
	var newData = [];
	for (var i = 0; i < 13; i++) {
		newData.push(Math.floor(Math.random() * 14) - 5); // valores entre -5 y 8
	}
	$(selector).sparkline(newData, sparkOptions);
}

$(function () {
	// Ejercicio 3.1: AJAX con JavaScript puro (XMLHttpRequest) - indicador "online users"
	var refreshLink = document.getElementById('refreshOnlineUsers');

	refreshLink.addEventListener('click', function (e) {
		e.preventDefault(); // evita que el link navegue a "#"

		var randomFile = Math.floor(Math.random() * 3) + 1; // 1, 2 o 3
		var xhr = new XMLHttpRequest();

		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4 && xhr.status === 200) {
				document.getElementById('onlineUsersCount').innerText = xhr.responseText.trim();
				refreshBoxChart('#onlineUsersChart');
			}
		};

		xhr.open('GET', 'ajax/users_online_' + randomFile + '.html', true);
		xhr.send();
	});

	// Ejercicio 3.2: AJAX con jQuery - indicador "sales"
	$('#refreshSales').on('click', function (e) {
		e.preventDefault();

		var randomFile = Math.floor(Math.random() * 3) + 1; // 1, 2 o 3

		$.ajax({
			url: 'ajax/sales_' + randomFile + '.html',
			method: 'GET',
			success: function (data) {
				$('#salesCount').text(data.trim());
				refreshBoxChart('#salesChart');
			}
		});
	});
});
