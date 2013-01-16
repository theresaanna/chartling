/* 
 * layout module
 * only public method is 'render' which accepts parsed CFPBDATA JSON
 */

define(["./settings", "./helpers"], function(layoutSettings, helpers) {
    return function() {
        this.getColor = function(d, i) {
          return layoutSettings.colorGradient[i];
        },

        this.d3Render = function(chartData) {
            var chart = d3.select(".cfpb-data-visualization-" + chartData.settings.timestamp)
                    .append("svg:svg")
                    .data([chartData.sections])
                        .attr("class", "pie")
                        .append("svg:g")
                        .attr("transform", "translate(450, 350)");

                var arc = d3.svg.arc()
                    .outerRadius(200);

                var pie = d3.layout.pie()
                  .value(function(d) {
                    return d.percent;
                  });

                var arcs = chart.selectAll("g.slice")
                    .data(pie)
                    .enter()
                      .append("svg:g")
                        .attr("class", "slice");

                // slice
                arcs.append("svg:path")
                    .attr("fill", this.getColor)
                    .attr("d", arc);

                arcs.on("mouseover", function(d) { 
                  var slice = d3.select(this),
                      path = slice.select("path"),
                      defaultFill = path.attr("fill");
                  path.attr("default-fill", defaultFill)
                       .attr("fill", layoutSettings.activeColor);
                  })
                  .on("mouseout", function(d) {
                      var slice = d3.select(this),
                          path = slice.select("path"),
                          defaultFill = path.attr("default-fill");
                    path.attr("fill", defaultFill);
                  });
        },

        this.raphaelRender = function(chartData) {

        },

        this.render = function(chartData) {
            var layoutModule = this;
            if (helpers.supportsSvg()) {
                // if svg is supported, use D3
                require(["libs/d3/d3.v3.min"], function(D3) {
                    layoutModule.d3Render(chartData);              
                });
            }
            else {
                // if not, use Raphael
                require(["libs/raphael-min"], function(raphael) {
                    layoutModule.raphaelRender(chartData);
                });
            }
        }
    };
});
