$(document).ready(function() {
    if (CFPBDATA) {
        require(["libs/d3/d3.v3.min", "cfpb-data-layouts"], function(D3, DataVis) {
            var cfpbData = JSON.parse(CFPBDATA),
                // in the future we'll need to determine vis type
                pieChart = DataVis.PieChart(cfpbData);
        pieChart.render(cfpbData);
        }); 
    }
});
