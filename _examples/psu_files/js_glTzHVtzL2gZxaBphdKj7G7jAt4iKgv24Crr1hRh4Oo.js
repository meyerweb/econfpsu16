
/**
 * @file
 * Provides the flexslider js for the homepage
 */

;(function ($, D) {
  D.behaviors.psu_slideshow = {
    attach: function(context, settings) {
      var useCSS = true;
      if ($.browser.msie && $.browser.version > 9) {
        useCSS = false;
      }
      
      $('#rotator').flexslider({
        animation: 'slide',
        slideshow: false,
        useCSS: useCSS,
	      pauseOnHover: true,
	      start: function(slider) {
          // Mark non-screen reader friendly items as aria-hidden.
          $('.flexslider .clone').attr('aria-hidden', 'true');
          $('.flexslider .flex-control-nav').attr('aria-hidden', 'true');
          $('.flexslider .flex-direction-nav').attr('aria-hidden', 'true');
	      }
      });
    }
  }
})(jQuery, Drupal); 
;
