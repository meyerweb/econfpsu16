// Browser detection. Yes, really. Guess for which browser? Nope! Firefox.
var b = document.documentElement;
b.setAttribute('data-useragent',  navigator.userAgent);
b.setAttribute('data-platform', navigator.platform);

$(document).ready(function(){

	docWidth = document.body.clientWidth;

	// simple form validation
	$('form.validate').on('submit', function(e) {

		var theForm = $(this);

		var emailFilter = /^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/;

		theForm.find("input.required").each(function() {

			value = $.trim($(this).val());

			console.log('value: ' + value);

			if (value == "") {

				e.preventDefault();
				console.log('field is empty');

				$('p.error-message').html('wait, required information is missing');

				theForm.find('.note.required').addClass('highlight');

			} else if ($(this).prop('type') == 'email') {

				console.log('checking email');

				if (!emailFilter.test(value)) {

					e.preventDefault();
					console.log('bad email');

					$('p.error-message').html('that email address doesn\'t look right');

					$(this).siblings('.note.required').addClass('highlight');

					$(this).focus();


				} else if (!$(this).val()) {

					console.log('no email');

					$('p.error-message').html('we need your email!');

					$(this).siblings('.note.required').addClass('highlight');

					$(this).focus();

				};

			};

		});

	});

	/* -----------------------------------------------------

	MOBILE DROP-DOWN MAIN NAVIGATION

	------------------------------------------------------*/

	$('.main-nav').addClass('deluxe');

	$('.go-to-nav').click (function(event){

		var navState = $( "html" ).hasClass('show-nav');

		var scrollHandler = function(){
		    $('html').removeClass('show-nav');
		}

		if (!navState){
			$( "html" ).addClass('show-nav');
			/* $(window).bind('scroll', scrollHandler); */
		} else {
			$( "html" ).removeClass('show-nav');
			/* $(window).unbind('scroll', scrollHandler); */
		}

		return false;

	});

	$('#toggle-schedule').click (function(event) {

		if($('.event-calendar').hasClass('toggled')) {

			$(this).removeClass('toggled');
			$('.event-calendar').removeClass('toggled');
			$('h2.toggled').toggleClass('toggled nottoggled');

		} else {

			$(this).addClass('toggled');
			$('.event-calendar').addClass('toggled');
			$('body,html').scroll(); // fake scroll to prompt lazyload
			$('h2.nottoggled').toggleClass('nottoggled toggled');

		}

		return false;

	});

	$('.js ol.sessions .event-description h2 span.more').on('click', function() {

		$(this).parent('h2').toggleClass('toggled nottoggled');
		$('body,html').scroll(); // fake scroll to prompt lazyload

	});

	/* -----------------------------------------------------

	STICKY NAV FOR EVENTS

	------------------------------------------------------*/

	if($("#eventNav").length) {

		// alert("Nav found!");

		var stickyNavTop = $('#eventNav').offset().top;

		var stickyNav = function(){
		var scrollTop = $(window).scrollTop();

			if (scrollTop > stickyNavTop - 42) {
			    $('#eventNav').addClass('sticky');
			} else {
			    $('#eventNav').removeClass('sticky');
			}

		};

		stickyNav();

		/* Cache selectors */

		var lastId,
		    topMenu = $("#eventNav"),
		    topMenuHeight = topMenu.outerHeight()+60,

		    // All list items

		    menuItems = topMenu.find(".anchor-link"),

		    // Anchors corresponding to menu items

		    scrollItems = menuItems.map(function(){
				var item = $($(this).attr("href"));
				if (item.length) { return item; }
		    });

		/* Bind click handler to menu items so we can get a fancy scroll animation */

		menuItems.click(function(e){
		  var href = $(this).attr("href"),
		      offsetTop = href === "#" ? 0 : $(href).offset().top-topMenuHeight+36;
		  $('html, body').stop().animate({
		      scrollTop: offsetTop
		  }, 500, "swing");
		  e.preventDefault();
		});

		/* Bind to scroll */

		var findAnchors = function(){
		   // Get container scroll position
		   var fromTop = $(this).scrollTop()+topMenuHeight;

		   // Get id of current scroll item
		   var cur = scrollItems.map(function(){
		     if ($(this).offset().top < fromTop)
		       return this;
		   });
		   // Get the id of the current element
		   cur = cur[cur.length-1];
		   var id = cur && cur.length ? cur[0].id : "";

		   if (lastId !== id) {
		       lastId = id;
		       // Set/remove active class
		       menuItems
		         .parent().removeClass("active")
		         .end().filter("[href=#"+id+"]").parent().addClass("active");
		   }
		};

		$(window).scroll(function() {
		    stickyNav();
		    findAnchors();
		});
	}

	/* end sticky nav */

	$('textarea[data-autoresize]').on('input propertychange focus', function() {

		autoResize($(this));

	});
});

$(window).load(function(){

	$("img.delayed").lazyload({

		effect: "fadeIn"

	});

	collectPhotoCredits();

});

$(window).resize(function() {

	docWidth = document.body.clientWidth;

});

function collectPhotoCredits() {

	creditHolder = $(".image-credits");

	if (!creditHolder.hasClass("finished")) {

		$("*[data-credit-title]").each(function() {

			theTitle = "<cite>" + $(this).attr("data-credit-title") + "</cite>";
			theName = $(this).attr("data-credit-name");
			theLocation = $(this).attr("data-credit-location");

			if (theTitle == "<cite></cite>") theTitle = "Photo";

			if (theName != "") {

				if (theLocation != "") {

					theText = "<li>" + theTitle + " by <a href='" + theLocation + "'>" + theName + "</a></li>";

					$("#image-credits").append(theText);

				} else {

					theText = "<li>" + theTitle + " by " + theName + "</li>";

					$("#image-credits").append(theText);

				};

				creditHolder.addClass("finished");

			};

		});

	};

};

$(window).setBreakpoints({
// use only largest available vs use all available
	distinct: true,
// array of widths in pixels where breakpoints
// should be triggered
	breakpoints: [
		1,
		600
	]
});

// fix scroll distance for pages with sticky headers

window.smoothScrollTo = (function () {

	var timer, start, factor;

	return function (target) {

		var offset = window.pageYOffset,
			delta = target - window.pageYOffset;

		start = Date.now();

		factor = 0;

		if( timer ) {

			clearInterval(timer);

		}

		function step() {

			var y;

			factor = (Date.now() - start) / duration;

			if( factor >= 1 ) {

				clearInterval(timer);
				factor = 1;

			}

			y = factor * delta + offset;

			window.scrollBy(0, y - window.pageYOffset);

		}

		timer = setInterval(step, 10);

		return timer;

	};

}());

var stickyItem = 'eventNav';			// the ID of the fixed-position element
var iKnowTheHeight = 102;			// in this case, the header is initially hidden, so we'll pre-populate the height
var readAssistOffset = 40;			// (screen height - this offset value) = scroll distance
var duration = 200;					// scroll speed in ms
var doc = document.documentElement;

if (document.getElementById(stickyItem) != null){

	keydown = function (e) {

		var curElement = document.activeElement.nodeName;

		if ((e.keyCode === 32 && curElement === "BODY") || (e.keyCode === 33 || e.keyCode === 34)) {

			var viewportHeight = window.innerHeight;
			if (iKnowTheHeight) {

				var stickyHeaderHeight = iKnowTheHeight;

			} else {

				var stickyHeaderHeight = document.getElementById(stickyItem).offsetHeight;

			};
			var newViewportHeight = viewportHeight - stickyHeaderHeight - readAssistOffset;

			e.preventDefault();

			if(e) {

				isShift = e.shiftKey || e.keyCode === 33 ? true : false;

			} else {

				isShift = window.event.shiftKey || e.keyCode === 33 ? true : false;

			};

			currScrollPosition = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);

			scrollToHere = newViewportHeight + currScrollPosition;

			if (isShift) {

				scrollToHere = currScrollPosition - newViewportHeight;

			}

			smoothScrollTo(scrollToHere)

		}

	}

	window.onkeydown = keydown;

};


/*
	Functions for auto-resizing textareas.
	Based almost entirely on John Long's excellent autogrow plugin (except I un-plugin-ifyed it):
	https://gist.github.com/jlong/2127634

	For a more consistent user experience you should apply resize: none to auto-resizing textareas in your CSS.
	The plugin needs to apply it on its own, so it's better that it not be there at all. (That said, you probably
	want to apply that style only when JS is avaialble.)
*/

var properties = ['-webkit-appearance','-moz-appearance','-o-appearance','appearance','font-family','font-size','font-weight','font-style','border','border-top','border-right','border-bottom','border-left','box-sizing','padding','padding-top','padding-right','padding-bottom','padding-left','min-height','max-height','line-height'],	escaper = $('<span />');

function escape(string) {
	return escaper.text(string).text().replace(/\n/g, '<br>');
};

function autoResize(which) {

	if (!which.data('autogrow-applied')) {

		var textarea = which,	 initialHeight = textarea.innerHeight(), expander = $('<div />'), timer = null;

		// Setup expander
		expander.css({'position': 'absolute', 'visibility': 'hidden', 'bottom': '110%'})
		$.each(properties, function(i, p) { expander.css(p, textarea.css(p)); });
		textarea.after(expander);

		// Setup textarea
		textarea.css({'overflow-y': 'hidden', 'resize': 'none', 'box-sizing': 'border-box'});

		// Sizer function
		function sizeTextarea() {
				clearTimeout(timer);
				timer = setTimeout(function() {
						var value = escape(textarea.val().replace(/\</g, '&lt;')) + '<br>z';
						expander.html(value);
						expander.css('width', textarea.innerWidth() + 2 + 'px');
						textarea.css('height', Math.max(expander.innerHeight(), initialHeight) + 2 + 'px');
				}, 100); // throttle by 100ms
		}

		// Bind sizer to IE 9+'s input event and Safari's propertychange event
		textarea.on('input.autogrow propertychange.autogrow focus', sizeTextarea);

		// Set the initial size
		sizeTextarea();

		// Record autogrow applied
		textarea.data('autogrow-applied', true);

	};

};

Modernizr.load({
	test: ($("picture" ).length > 0),
	yep: [ "/assets/_/js/libs/picturefill.js" ]
});

/*
	By Osvaldas Valutis, www.osvaldas.info
	Available for use under the MIT License
*/

;window.googleMapsScriptLoaded=function(){$(window).trigger("googleMapsScriptLoaded")};(function(e,t,n,r){"use strict";var i=e(t),s=e("body"),o=i.height(),u=0,a=function(e,t){var n=null;return function(){var r=this,i=arguments;clearTimeout(n);n=setTimeout(function(){t.apply(r,i)},e)}},f=function(e,t){var n,r;return function(){var i=this,s=arguments,o=+(new Date);if(n&&o<n+e){clearTimeout(r);r=setTimeout(function(){n=o;t.apply(i,s)},e)}else{n=o;t.apply(i,s)}}},l=false,c=false,h=e([]),p=function(t){u=i.scrollTop();h.each(function(){var t=e(this),n=t.data("options");if(t.offset().top-u>o*1)return true;if(!l&&!c){s.append('<script src="https://maps.googleapis.com/maps/api/js?v=3.exp&callback=googleMapsScriptLoaded'+(n.api_key?"&key="+n.api_key:"")+'"></script>');c=true}if(!l)return true;var r=new google.maps.Map(this,{zoom:15});if(n.callback!==false)n.callback(this,r);h=h.not(t)})};i.on("googleMapsScriptLoaded",function(){l=true;p()}).on("scroll",f(500,p)).on("resize",a(1e3,function(){o=i.height();p()}));e.fn.lazyLoadGoogleMaps=function(t){t=e.extend({api_key:false,callback:false},t);this.each(function(){var n=e(this);n.data("options",t);h=h.add(n)});p();this.debounce=a;this.throttle=f;return this}})(jQuery,window,document);


$(document).ready(function(){
	$(".more-events").click(function() {
    $('html,body').animate({
        scrollTop: $("#upcoming-events").offset().top},
        'slow');
	});

	$(".hero-image").click(function() {
  	window.location = $(this).find("a.featured-link").attr("href"); 
  	return false;
	});
});