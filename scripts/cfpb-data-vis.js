$(document).ready(function() {
    // if there is a visualization to render on this page, there'll be
    // an object with JSON stored in CFPBDATA
    if (CFPBDATA) {
        /*
         * kicks off visualization rendering if there's a JSON object
         * in the DOM. we also don't load the D3 library unless its in use on this page.
         */
        require(["libs/d3/d3.v3.min", "cfpb-data-layouts"], function(D3, DataVis) {
            var cfpbData = JSON.parse(CFPBDATA),
                // in the future we'll need to determine vis type
                pieChart = DataVis.PieChart(cfpbData);

            pieChart.render(cfpbData);
        }); 
    }
});
