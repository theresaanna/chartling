/*
 * require.js module
 * responsible for pulling together modules that make up the vis library
 */
define(["layouts/pie-chart"], function(pieChart) {
    var DataVis = {};
    DataVis.PieChart = pieChart;

    return DataVis;
});
