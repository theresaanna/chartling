"use strict";
define(function() {
    $(document).ready(function() {
        // if there is a visualization to render on this page, there'll be
        // an object with JSON stored in ChartlingData
        if (typeof ChartlingData !== "undefined" && ChartlingData.length > 0) {
            /*
             * kicks off visualization rendering if there's a JSON object
             */
            var chartlingData,
                layout,
                layoutModule,
                layoutObj,
                i = ChartlingData.length;
            while (i--) {
                chartlingData = JSON.parse(ChartlingData[i]);
                layout = chartlingData.settings.layoutType;

                require(["./layouts/" + layout], function(layoutModule) {
                    if (typeof layoutModule !== 'undefined') {
                        layoutObj = new layoutModule;
                        layoutObj.render(chartlingData);
                    }
                });
            }
        }
    });
});
