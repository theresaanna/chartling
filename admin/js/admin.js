"use strict";

define(['import'], function(importModule) {
  $(document).ready(function() {

    $('#import-data').on('submit', function() {
      event.preventDefault();
      var url = $(this).find('#import-url').val()
        , type = $(this).find('#import-type').val();
      importModule(url, type);
    });

  });
});
