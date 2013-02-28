/*
 * require.js module
 * responsible for pulling together modules that make up the vis library
 */
define(["layouts/pie-chart"], function(pieChart) {
    var Chartling = {};
    Chartling.PieChart = pieChart;

    return Chartling;
});
