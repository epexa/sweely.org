/**
 * @module       Carousel with orbital pagination
 * @author       ATOM
 * @license      MIT
 * @version      v1.0.1
 */

// Core
function initCarousel( options ) {
	function CustomCarousel( options ) {
		this.init( options );
		this.addListeners();
		return this;
	}

	CustomCarousel.prototype.init = function ( options ) {
		this.node        = options.node;
		this.node.slider = this;
		this.slides      = this.node.querySelector( '.slides' ).children;
		this.slidesN     = this.slides.length;
		this.pagination  = this.node.querySelector( '.pagination' );
		this.pagTransf   = 'translate( -50%, -50% )';
		this.dots        = this.pagination.children;
		this.dotsN       = this.dots.length;
		this.step        = -360/this.dotsN;
		this.angle       = 0;
		this.next        = this.node.querySelector( '.next' );
		this.prev        = this.node.querySelector( '.prev' );
		this.activeN     = options.activeN || 0;
		this.prevN       = this.activeN;
		this.speed       = options.speed || 300;
		this.autoplay    = options.autoplay || false;
		this.autoplayId  = null;

		this.setSlide( this.activeN );
		this.arrangeDots();
		this.pagination.style.transitionDuration = this.speed +'ms';
		if ( this.autoplay ) this.startAutoplay();
	}

	CustomCarousel.prototype.addListeners = function () {
		var slider = this;

		if ( this.next ) {
			this.next.addEventListener( 'click', function() {
				slider.setSlide( slider.activeN + 1 );
			});
		}

		if ( this.prev ) {
			this.prev.addEventListener( 'click', function() {
				slider.setSlide( slider.activeN - 1 );
			});
		}

		for ( var i = 0; i < this.dots.length; i++ ) {
			this.dots[i].addEventListener( 'click', function( i ) {
				return function() { slider.setSlide( i ); }
			}( i ));
		}

		if ( this.autoplay ) {
			this.node.addEventListener( 'mouseenter', function() {
				slider.stopAutoplay();
			});

			this.node.addEventListener( 'mouseleave', function() {
				slider.startAutoplay();
			});
		}
	};

	CustomCarousel.prototype.setSlide = function ( slideN ) {
		this.slides[ this.activeN ].classList.remove( 'active' );
		if ( this.dots[ this.activeN ] ) this.dots[ this.activeN ].classList.remove( 'active' );

		this.prevN = this.activeN;
		this.activeN = slideN;
		if ( this.activeN < 0 ) this.activeN = this.slidesN -1;
		else if ( this.activeN >= this.slidesN ) this.activeN = 0;

		this.slides[ this.activeN ].classList.toggle( 'active' );
		if ( this.dots[ this.activeN ] ) this.dots[ this.activeN ].classList.toggle( 'active' );

		this.rotate();
	};

	CustomCarousel.prototype.rotate = function () {
		if ( this.activeN < this.dotsN ) {
			this.angle += function ( dots, next, prev, step ) {
				var inc, half = dots/2;
				if( prev > dots ) prev = dots - 1;
				if( Math.abs( inc = next - prev ) <= half ) return step * inc;
				if( Math.abs( inc = next - prev + dots ) <= half ) return step * inc;
				if( Math.abs( inc = next - prev - dots ) <= half ) return step * inc;
			}( this.dotsN, this.activeN, this.prevN, this.step )

			this.pagination.style.transform = this.pagTransf +'rotate('+ this.angle +'deg)';
		}
	};

	CustomCarousel.prototype.startAutoplay = function () {
		var slider = this;

		this.autoplayId = setInterval( function(){
			slider.setSlide( slider.activeN + 1 );
		}, this.autoplay );
	};

	CustomCarousel.prototype.stopAutoplay = function () {
		clearInterval( this.autoplayId );
	};

	CustomCarousel.prototype.arrangeDots = function () {
		for ( var i = 0; i < this.dotsN; i++ ) {
			this.dots[i].style.transform = 'rotate('+ 360/this.dotsN * i +'deg)';
		}
	};

	return new CustomCarousel( options );
}
// End of carousel

// Global variables
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

// Registration script

window.addEventListener('DOMContentLoaded', function() {

	var $requestNewBtns = document.getElementsByClassName('request-new-btn'),
		$requestNewModal = document.querySelector('#modal-form'),
		$requestNewModalForm = $requestNewModal.querySelector('form'),
		$requestLocationInput = $requestNewModalForm.querySelector('.form-control[name="request-location"]'),
		emailApiUrl = 'https://realtcrm.com';

	for (var i = 0; i < $requestNewBtns.length; i++) {
		$requestNewBtns[i].addEventListener('click', function(e) {
			e.preventDefault();
			requestNewModal.show();
		});
	}
	
	document.querySelector('.navbar-collapse').addEventListener('click', function() { // mobile nav close onclick
		if (document.querySelector('.navbar').classList.contains('navbar-expanded'))
		document.querySelector('.navbar-toggler').click()
	});

	document.querySelector('.navbar-toggler').addEventListener('click', function() {
		if (!document.querySelector('.navbar').classList.contains('navbar-expanded')) {
			document.querySelector('body').style.position = 'fixed'
			document.querySelector('main').style.display = 'none'
			document.querySelector('footer').style.display = 'none'
			document.querySelector('.logo-sticky').style.display = 'none'
		} else {
			document.querySelector('body').style.position = 'inherit'
			document.querySelector('main').style.display = 'block'
			document.querySelector('footer').style.display = 'block'
			document.querySelector('.logo-sticky').style.display = 'block'
		}
	})

	document.getElementById('detect-location-btn').addEventListener('click', function() {
		if (navigator.geolocation) navigator.geolocation.getCurrentPosition(function(position) {
			var getQuery = new XMLHttpRequest();
			getQuery.open('GET', 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + position.coords.latitude + ',' + position.coords.longitude + '&sensor=false&language=en&key=AIzaSyD8rVrtqmTpH3oR3e2XZaPxwzt3Wos6HUg', true);
			getQuery.onreadystatechange = function() {
				if (getQuery.readyState == 4) {
					var data = JSON.parse(getQuery.responseText);
					var results = data.results.reverse();
					if (results[1]) $requestLocationInput.value = results[1].formatted_address;
					else if (results[0]) $requestLocationInput.value = results[0].formatted_address;
				}
			};
			getQuery.send();
			postAjax(emailApiUrl + '/coords', { latitude: position.coords.latitude, longitude: position.coords.longitude });
		});
	});
	
	$requestNewModalForm.addEventListener('submit', function(e) {
		e.preventDefault();
		var emailVal = this.querySelector('.form-control[name="request-email"]').value,
			accountTypeVal = this.querySelector('.form-control[name="request-account-type"]').value,
			loginVal = this.querySelector('.form-control[name="request-login"]').value;
			locationVal = $requestLocationInput.value;
		postAjax(emailApiUrl + '/request', { email: emailVal, acount_type: accountTypeVal, login: loginVal, location: locationVal }, function(responseJSON) {
			/* const responseData = JSON.parse(responseJSON);
			if (responseData.succesful) {
				swal('Success!', responseData.message, 'success');
				requestNewModal.hide();
				$requestNewModalForm.reset();
			} else {
				swal('Sorry...', responseData.message, 'warning');
			} */

			$('#modalSuccess').modal('show')

			//swal({title: 'Thank you!', text: 'Your request is accepted, you will be notified by email!'});

			$('#modal-form').modal('hide');
			//document.querySelector('body').style = '';
			$requestNewModalForm.reset();
		});
	});
	
	$requestNewModalFormRequestLogin = $requestNewModalForm.querySelector('.form-control[name="request-login"]');
	$requestNewModalForm.querySelector('.form-control[name="request-email"]').addEventListener('input', function() {
		var newRequestLogin = this.value.split('@')[0];
		$requestNewModalFormRequestLogin.value = newRequestLogin;
	});;
	
	/*const subscriptionForm = document.getElementById('subscription');
	if (subscriptionForm) {
		subscriptionForm.addEventListener('submit', function(e) {
			e.preventDefault();
			const name = e.target[1].value;
			const email = e.target[2].value;
			postAjax('/subscription', { name: name, email: email }, function(responseJSON) {
				const responseData = JSON.parse(responseJSON);
				if (responseData.succesful) {
					swal('Готово!', responseData.message, 'success');
					document.getElementById('subscribe-modal').style.display = 'none';
					subscriptionForm.reset();
				} else {
					swal('Извините...', responseData.message, 'warning');
				}
			});
		});
	}*/
	
	var $projectDetail = document.getElementById('project-detail');
	var $projectDetailBtns = document.getElementsByClassName('project-detail-btn');
	for (var i=0; i < $projectDetailBtns.length; i++) {
		$projectDetailBtns[i].addEventListener('click', function(e) {
			e.preventDefault();
			$projectDetail.style.display = 'block';
		});
	}
	
	$('.modal-popup').bind('click', function() {
		$('#modal-form').modal('show')
	})

	$('.lang-btn').bind('click', function() {
		$('#modalLang').modal('show')
	})
});

function postAjax(url, data, success) {
	var params = typeof data == 'string' ? data : Object.keys(data).map(
		function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
	).join('&');
	/* var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
	xhr.open('POST', url);
	xhr.onreadystatechange = function() {
		if (xhr.readyState>3 && xhr.status==200) { success(xhr.responseText); }
	};
	xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.send(params);
	return xhr; */
	var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
	var xhr = new XHR();
	xhr.open('GET', url + '?' + params, true);
	xhr.onload = function() {
		console.log( this );
		console.log( this.responseText );
		if (success) success(this.responseText);
	}
	xhr.onerror = function() {
		console.error('Error', this.status);
		if (this.status == 0 && success) success();
	}
	xhr.send();
}

// Slider, menu etc

$(function() {
    'use strict';

    /** navbar reference **/
    var $navbar = $(".main-nav"),
        stickyPoint = 90;

    var navbarSticky = function() {
        if ($(window).scrollTop() >= stickyPoint) {
            $navbar.addClass("navbar-sticky");
        } else {
            $navbar.removeClass("navbar-sticky");
        }
    };

    /**
     * STICKY MENU
     **/
    $(window).on("scroll", navbarSticky);

    navbarSticky();

    /**
     * SCROLLING NAVIGATION
     * Enable smooth transition animation when scrolling
     **/
    $('a.scrollto').on('click', function (event) {
        event.preventDefault();

        var scrollAnimationTime = 1200;
        var target = this.hash;

        $('html, body').stop().animate({
            scrollTop: $(target).offset().top - 45
        }, scrollAnimationTime, 'easeInOutExpo', function () {
            window.location.hash = target;
        });
    });

    /**
     *  NAVBAR SIDE COLLAPSIBLE - On Mobiles
     **/
    $(".navbar-toggler", $navbar).on("click", function() {
        $navbar.toggleClass("navbar-expanded");
    });

    /** PLUGINS INITIALIZATION */
    /* Bellow this, you can remove the plugins you're not going to use.
     * If you do so, remember to remove the script reference within the HTML.
     **/

    /**
     * AOS
     * Cool scrolling animations
     **/
    AOS.init({
        offset: 200,
        duration: 1500,
        disable: 'mobile'
    });

    /**
     * POPUPS
     **/
    (function() {
        $('.modal-popup').each(function () {
            var $element = $(this);

            // Some default to apply for all instances of Modal
            var defaults = {
                removalDelay: 500,
                preloader: false,
                midClick: true,
                callbacks: {
                    beforeOpen: function() {
                        this.st.mainClass = this.st.el.attr('data-effect');
                    }
                }
            };

            // Load configuration values from data attributes
            var focus = $element.data('focus') || false;

            var attributes = {};

            if (focus) {
                attributes.focus = focus;
            }
			
			var options = $.extend({}, defaults, attributes);
        });
    })();

});

'use strict';

(function($) {
    $(function() {
        /**
         * Swiper Initialization
         **/
        $('.swiper-container').each(function() {

            var $this = $(this);
            var boolData = {
                breakpoints: $this.data('sw-breakpoints'),
                active_selector: $this.data('sw-active-selector'),
                cover_flow: $this.data('sw-coverflow'),
                auto_play: $this.data('sw-autoplay'),
                loop: $this.data('sw-loop'),
                centered: $this.data('sw-centered-slides'),
                pagination: $this.data('sw-pagination'),
                nav_arrows: $this.data('sw-nav-arrows')
            };

            var breakPoints = boolData.breakpoints || false;
            var auto_play = boolData.auto_play !== null ? boolData.auto_play : false;
            var speed = $this.data('sw-speed') || 1100;
            var effect = $this.data('sw-effect') || "slide";
            var showItems = $this.data('sw-show-items') || 1;
            var loop = boolData.loop !== null ? boolData.loop : true;
            var centered = boolData.centered !== null ? boolData.centered : true;
            var spaceBetween = $this.data('sw-space-between') || (showItems > 1 ? 20 : 0);
            var scrollItems = $this.data('sw-scroll-items') || 1;
            var navigationElement = $this.data('sw-navigation');
            var navigationActiveClass = $this.data('sw-navigation-active') || "active";
            var navigationActiveSelector = boolData.active_selector !== null ? boolData.active_selector : false;
            var paginationCss = boolData.pagination !== undefined ? boolData.pagination : '.swiper-pagination';
            var navigationCss = boolData.nav_arrows !== undefined ? boolData.nav_arrows : '.swiper-button';

            var coverflow = boolData.coverflow ? $.extend({
                stretch: 0,
                depth: 0, // 100
                modifier: 1,
                rotate: 0,
                slideShadows : false
            }, boolData.coverflow) : {};

            var autoplay = auto_play ? {
                autoplay: {
                    delay: auto_play,
                    disableOnIteration: false
                },
                speed: speed
            } : {};

            var pagination = {};

            if (paginationCss) {
                pagination.pagination = {
                    el: paginationCss,
                    clickable: true,
                    dynamicBullets: true
                };
            }

            if (navigationCss) {
                pagination.navigation = {
                    nextEl: navigationCss + '-next',
                    prevEl: navigationCss + '-prev'
                }
            }

            var events = {};

            if (navigationElement) {
                events = {
                    transitionEnd: function () {
                        if (!navigationElement) return;

                        var $navigationElement = $(navigationElement);

                        if (navigationActiveSelector) {
                            $(navigationActiveSelector + '.' + navigationActiveClass, $navigationElement).removeClass(navigationActiveClass);
                            $('.nav-item:eq(' + swiper.realIndex + ') ' + navigationActiveSelector, $navigationElement).addClass(navigationActiveClass);
                        } else {
                            $('.' + navigationActiveClass, $navigationElement).removeClass(navigationActiveClass);
                            $('.nav-item:eq(' + swiper.realIndex + ')', $navigationElement).addClass(navigationActiveClass);
                        }
                    }
                }
            }

            var options = $.extend({
                loop: loop,
                slidesPerGroup: scrollItems,
                spaceBetween: spaceBetween,
                centeredSlides: centered,
                breakpoints: breakPoints,
                slidesPerView: showItems,
                parallax: true,
                effect: effect
            }, pagination, autoplay, coverflow);

            var swiper = new Swiper (this, options);

            for (var e in events) {
                swiper.on(e, events[e]);
            }

            if (navigationElement) {
                $(navigationElement).on('click', '.nav-item', function (evt) {
                    evt.preventDefault();

                    var $item = $(this);
                    var $activeItem = $item;

                    if (navigationActiveSelector) {
                        $activeItem = $(navigationActiveSelector, $item);
                    }

                    if ($activeItem.hasClass(navigationActiveClass)) {
                        return false;
                    }

                    var index = $item.data('step') || $item.index() + 1;
                    swiper.slideTo(index - 1);

                    if (navigationActiveSelector) {
                       $item.siblings().each(function() {
                           $(navigationActiveSelector, this).removeClass(navigationActiveClass);
                       });

                        $activeItem.addClass(navigationActiveClass);
                    } else {
                        $item.siblings('.'+navigationActiveClass).removeClass(navigationActiveClass);
                        $item.addClass(navigationActiveClass);
                    }

                    return false;
                });
            }
        });
    });
})(jQuery);
