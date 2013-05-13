/*
 * Requires jquery.responsiveText.js
*/


(function() {
  $(function() {
    return $('table.responsive').each(function(index, object) {
      var compression, max, min, padding;

      compression = 30;
      min = 8;
      max = 13;
      padding = 0;
      compression = parseFloat($(this).attr('data-compression') || compression);
      min = parseFloat($(this).attr('data-min') || min);
      max = parseFloat($(this).attr('data-max') || max);
      padding = parseFloat($(this).attr('data-padding') || padding);
      return $(object).responsiveTable({
        compressor: compression,
        minSize: min,
        maxSize: max,
        padding: padding
      });
    });
  });

}).call(this);
