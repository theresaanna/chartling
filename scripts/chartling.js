$(document).ready(function() {
    // if there is a visualization to render on this page, there'll be
    // an object with JSON stored in ChartlingData
    if (typeof ChartlingData !== "undefined" && ChartlingData.length > 0) {
        /*
         * kicks off visualization rendering if there's a JSON object
         */
        require(["cfpb-data-layouts"], function(Chartling) {
            var chartlingData,
                i = ChartlingData.length;
            while (i--) {
                chartlingData = JSON.parse(ChartlingData[i]),
                    // in the future we'll need to determine vis type
                    pieChart = new Chartling.PieChart();

                pieChart.render(chartlingData);
            }
        }); 
    }
});
