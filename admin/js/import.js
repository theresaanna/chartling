// ajax call for data import
// send data for mapping

"use strict";
define(["admin-helpers", "datamap"], function(Helpers, dataMap) {
    return function(importURL, importType) {
      $.ajax({
        url: "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20"
          + importType
          + "%20where%20url%3D%22"
          + encodeURIComponent(importURL)
          + "%22&format=json'&callback=?",
        dataType: "jsonp",
        success: function (data, status, xhr) {
          dataMap(data);
        }
      });
    };
});
