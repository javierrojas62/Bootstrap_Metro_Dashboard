// Ejercicio 2.d: modo oscuro con botón toggle, persistido en localStorage
// Estilos en css/dark-mode.css

$(function () {
	var darkModeEnabled = localStorage.getItem('darkMode') === 'true';
	$('body').toggleClass('dark-mode', darkModeEnabled);

	$('#darkModeToggle').on('click', function (e) {
		e.preventDefault();
		var isDark = $('body').toggleClass('dark-mode').hasClass('dark-mode');
		localStorage.setItem('darkMode', isDark);
	});
});
