$(document).ready(function() {
    // if there is a visualization to render on this page, there'll be
    // an object with JSON stored in CFPBDATA
    if (typeof CFPBDATA !== "undefined" && CFPBDATA.length > 0) {
        /*
         * kicks off visualization rendering if there's a JSON object
         * in the DOM. we also don't load the D3 library unless its in use on this page.
         */
        require(["libs/d3/d3.v3.min", "cfpb-data-layouts"], function(D3, DataVis) {
            var cfpbData,
                i = CFPBDATA.length;
            while (i--) {
                cfpbData = JSON.parse(CFPBDATA[i]),
                    // in the future we'll need to determine vis type
                    pieChart = new DataVis.PieChart();

                pieChart.render(cfpbData);
            }
        }); 
    }
});
