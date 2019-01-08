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
			swal({title: 'Thank you!', text: 'Your request is accepted, you will be notified by email!'});
			document.querySelector('.mfp-close').click();
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

(function() {
    'use strict';

    // Avoid `console` errors in browsers that lack a console.
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any code in here.
$(function() {
    'use strict';

    /** navbar reference **/
    var $navbar = $(".main-nav"),
        stickyPoint = 90;

    /** Perspective mockups reference **/
    var $perspectiveMockups = $(".perspective-mockups");

    // This element is used as reference for relocation of the mockups on mobile devices.
    // If you remove it please be sure you add another reference element preferably within the same section and/or position the button was.
    // You can change the selector (".learn-more") to one that uniquely identifies the reference element.
    var $topReference = $(".learn-more", ".lightweight-template");

    var setMockupsTop = function() {
        // check if the perspective mockups elements are on the page, if you're not going to use them, you can remove all its references
        if (!$perspectiveMockups.length) return;

        if ($(window).outerWidth() < 768) {
            $perspectiveMockups.css({top: $topReference.offset().top + "px"});
            return;
        }

        $perspectiveMockups.removeAttr("style");
    };

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

    /**
     * Blog interaction with buttons: favorite and bookmark
     **/
    $('.card-blog').on({
        click: function (e) {
            e.preventDefault();

            var $el = $(this).removeClass('far').addClass('fas');
            if ($el.hasClass('favorite')) {
                $el.addClass('text-danger');
            } else {
                $el.addClass('text-warning');
            }
        },
        mouseenter: function () {
            $(this).addClass('fas');
        },
        mouseleave: function () {
            $(this).removeClass('fas');
        }
    }, 'i.far');

    /**
     * Position the perspective mockups at the end of the first content section on mobile
     **/
    $perspectiveMockups.removeClass("hidden-preload");
    $(window).on("resize", setMockupsTop);

    setMockupsTop();

    /** PLUGINS INITIALIZATION */
    /* Bellow this, you can remove the plugins you're not going to use.
     * If you do so, remember to remove the script reference within the HTML.
     **/

    /**
     * Handle the login form, once the server has sent a successful response
     **/
    $('.login-form form').on('form.submitted', function(evt, data) {
        window.location.replace('admin/');
    });

    /**
     * Prettyprint
     **/
    window.prettyPrint && prettyPrint();

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
     * typed.js
     **/
    if ($(".typed").length) {
        var typed = new Typed('.typed', {
            strings: ['Invoicing', 'Subscriptions', 'Mailing', 'Reporting'],
            typeSpeed: 150,
            backDelay: 500,
            backSpeed: 50,
            loop: true
        });
    }

    /**
     * COUNTERS
     **/
    if ($(".counter").length) {
        $('.counter').counterUp();
    }

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

            // Defaults to use for specific types
            var typeDefaults = {
                image: {
                    closeOnContentClick: true
                },
                gallery: {
                    delegate: 'a',
                    // when gallery is used change the type to 'image'
                    type: 'image',
                    tLoading: 'Loading image #%curr%...',
                    mainClass: 'mfp-with-zoom mfp-img-mobile',
                    gallery: {
                        enabled: true,
                        navigateByImgClick: true,
                        preload: [0,1] // Will preload 0 - before current, and 1 after the current image
                    },
                    image: {
                        tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'
                    }
                }
            };

            // Load configuration values from data attributes
            var type = $element.data('type') || 'inline';
            var zoomSpeed = $element.data('zoom') || false;
            var focus = $element.data('focus') || false;

            var attributes = {};

            if (zoomSpeed) {
                attributes.zoom = {
                    enabled: true,
                    duration: zoomSpeed
                }
            }

            if (focus) {
                attributes.focus = focus;
            }

            // According to the type, get the JSON configuration for each
            $.each(['image', 'gallery'], function () {
                var attr = $element.data(this) || false;

                if (attr) {
                    typeDefaults[type][this] = attr;
                }

                // remove the values from the markup
                $element.removeAttr("data-" + this);
            });

            var options = $.extend({}, defaults, {
                type: type
            }, typeDefaults[type], attributes);

            $element.magnificPopup(options);
        });

        $(document).on('click', '.modal-popup-dismiss', function (e) {
            e.preventDefault();
            $.magnificPopup.close();
        });
    })();

    /**
     * PRICING TABLES
     **/
    $(".pricing-table-basis").on("change", 'input[name="pricing-value"]', function() {
        console.log(this.value);
        var period = this.value;

        $(".odometer").each(function() {
            this.innerHTML = $(this).data(period + "-price");
        });
    });

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

        $('.scroll-bar').each(function (i, e) {
            var bar = new SimpleBar(e);
        });
    });
})(jQuery);