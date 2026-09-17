// Ejercicio 5: JS Web APIs - Geolocation + Leaflet

$(function () {
	var geoStatusEl = document.getElementById('geoStatus');

	if (!navigator.geolocation) {
		geoStatusEl.innerHTML = '<span style="color:#da4f49;">Este navegador no soporta la API de Geolocation.</span>';
		return;
	}

	geoStatusEl.innerHTML = 'Obteniendo tu ubicación...';

	navigator.geolocation.getCurrentPosition(function (position) {
		var lat = position.coords.latitude;
		var lon = position.coords.longitude;

		geoStatusEl.innerHTML = 'Ubicación obtenida: lat ' + lat.toFixed(5) + ', lon ' + lon.toFixed(5);

		var map = L.map('userMap').setView([lat, lon], 13);

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			maxZoom: 19
		}).addTo(map);

		L.marker([lat, lon]).addTo(map)
			.bindPopup('Estás aquí')
			.openPopup();
	}, function (error) {
		geoStatusEl.innerHTML = '<span style="color:#da4f49;">No se pudo obtener la ubicación: ' + error.message + '</span>';
	});
});
