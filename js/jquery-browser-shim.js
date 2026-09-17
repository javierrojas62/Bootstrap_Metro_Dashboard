// Shim de $.browser (removido de jQuery desde la v1.9, necesario para plugins viejos
// como jquery.uniform, jquery.cleditor y jquery.elfinder que todavía lo usan)
(function ($) {
	var matched, browser;
	var ua = navigator.userAgent.toLowerCase();
	matched = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
		/(webkit)[ \/]([\w.]+)/.exec(ua) ||
		/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
		/(msie) ([\w.]+)/.exec(ua) ||
		ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [];
	browser = {};
	if (matched[1]) {
		browser[matched[1]] = true;
		browser.version = matched[2] || "0";
	}
	if (browser.chrome) {
		browser.webkit = true;
	} else if (browser.webkit) {
		browser.safari = true;
	}
	$.browser = browser;
})(jQuery);
