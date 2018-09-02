/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, browser:true, indent:2, jquery:true */
/*jshint devel: true */
/* jquery.csInit.js */
'use strict';

(function($) {
  $.fn.csInit = function() {
    return this.each(function(i,element) {
      var e = jQuery.Event('csInit');
      e.container = $(element);
      $(':root').trigger(e);
    });
  };
  $.csInit = function(handler) {
    $(':root').on('csInit',handler);
  };
}(jQuery));
