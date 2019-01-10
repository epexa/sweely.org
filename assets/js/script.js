/**
 * Global variables
 */
"use strict";
(function () {
	var userAgent = navigator.userAgent.toLowerCase(),
		initialDate = new Date(),

		$document = $(document),
		$window = $(window),
		$html = $("html"),
		$body = $("body"),

		isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1,
		isIE = userAgent.indexOf("msie") != -1 ? parseInt(userAgent.split("msie")[1]) : userAgent.indexOf("trident") != -1 ? 11 : userAgent.indexOf("edge") != -1 ? 12 : false,

		plugins = {
			pointerEvents: isIE < 11 ? "js/pointer-events.min.js" : false,
			customCarousel: document.querySelectorAll( '.circle-carousel' )
		};

	/**
	 * Initialize All Scripts
	 */
	$(function () {

		/**
		 * Is Mac os
		 * @description  add additional class on html if mac os.
		 */
		if (navigator.platform.match(/(Mac)/i)) $html.addClass("mac-os");

		/**
		 * Is Firefox
		 * @description  add additional class on html if mac os.
		 */
		if (isFirefox) $html.addClass("firefox");

		/**
		 * IE Polyfills
		 * @description  Adds some loosing functionality to IE browsers
		 */
		if (isIE) {
			if (isIE < 10) {
				$html.addClass("lt-ie-10");
			}

			if (isIE < 11) {
				if (plugins.pointerEvents) {
					$.getScript(plugins.pointerEvents)
						.done(function () {
							$html.addClass("ie-10");
							PointerEventsPolyfill.initialize({});
						});
				}
			}

			if (isIE === 11) {
				$("html").addClass("ie-11");
			}

			if (isIE === 12) {
				$("html").addClass("ie-edge");
			}
		}

		// Circle carousel
		if( plugins.customCarousel.length ) {
			for ( var i = 0; i < plugins.customCarousel.length; i++ ) {
				var carousel = initCarousel({
					node: plugins.customCarousel[i],
					speed: plugins.customCarousel[i].getAttribute( 'data-speed' ),
					autoplay: plugins.customCarousel[i].getAttribute( 'data-autoplay' )
				});
			}
		}

	});
}());
