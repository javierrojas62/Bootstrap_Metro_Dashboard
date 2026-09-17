// Ejercicio 2, punto 4: demo de los 3 plugins nuevos agregados (Select2, Toastr, jQuery-Confirm)

$(function () {
	$('#demoSelect2').select2();

	$('#btnToastr').on('click', function () {
		toastr.success('Plugin Toastr funcionando correctamente', 'Notificación');
	});

	$('#btnConfirm').on('click', function () {
		$.confirm({
			title: 'Plugin jQuery-Confirm',
			content: 'Este es un evento onclick.',
			buttons: {
				ok: function () { toastr.info('Confirmado'); },
				cancel: function () { }
			}
		});
	});
});
