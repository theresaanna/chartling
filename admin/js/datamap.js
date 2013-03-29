// maps data fields to values

"use strict";
define(function() {
    return function(importedData) {

      // csv headers
      console.log(importedData.results[0].split(/<.*?>/).filter(Helpers.nonEmpty));
    };
});
