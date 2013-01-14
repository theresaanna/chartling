/* 
 * layout module
 * only public method is 'render' which accepts parsed CFPBDATA JSON
 */

define(["./settings"], function(layoutSettings) {
    return function() {
        this.calculateTextAnchor = function(d) {
          // calculate whether we are past the 6pm point on the pie
          // so that we know where to anchor the text
          // given that the label should "radiate" from the center
          var pos = "start",
              // bad var name, prob incorrect
              arcLine = d.endAngle + d.startAngle;

          // 180 degrees = pi radians
          // result - arcLine/2 > 3.14 = slice on left side if pie
          // otherwise its on the right
          // except for the last slice, which should be positioned "start"
          // the last slice will have an endAngle = Pi*2, except its a quadrillionth off
          if (arcLine/2 > Math.PI && d.endAngle !== Math.PI*2 + 0.000000000000001) {
              pos = "end";
          }

          return pos;
        },

        this.getLabelPositioning = function(d, arc) {
          // c = x,y coord of what I assume is the center point of the arc
          // can't find much on the concept of a centroid for arcs
          var c = arc.centroid(d),
              x = c[0],
              y = c[1], 
              // crazy pythagoras
              hyp = Math.sqrt(x*x + y*y);
              // x/hypotenuse * horiz label radius, y/hypotenuse * vert label radius
          return [(x/hyp), (y/hyp)];
        },

        this.getColor = function(d, i) {
          return layoutSettings.colorGradient[i];
        },

        // TODO: break this up
        this.render = function(chartData) {
            var pieConstructor = this;

            var chart = d3.select(".cfpb-data-visualization")
                .append("svg:svg")
                .data([chartData.slices])
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
                  percentLabel = slice.select("text.percent"),
                  issueLabel = slice.select("text.issue"),
                  defaultFill = path.attr("fill");
              path.attr("default-fill", defaultFill)
                   .attr("fill", layoutSettings.activeColor);

              percentLabel.attr("default-fill", defaultFill)
                   .attr("fill", layoutSettings.activeColor)
                    .style("font-size", "150%");
              slice.style("font-weight", "bold");

              })
              .on("mouseout", function(d) {
                  var slice = d3.select(this),
                      path = slice.select("path"),
                      percentLabel = slice.select("text.percent"),
                      issueLabel = slice.select("text.issue"),
                      defaultFill = path.attr("default-fill");
                path.attr("fill", defaultFill);
                percentLabel.attr("fill", defaultFill)
                  .style("font-size", "120%");
                slice.style("font-weight", "normal");
              });

            // percent text
            arcs.append("svg:text")
              // transform and translate are attributes of svg <text>
              .attr("transform", function(d) {
                d.innerRadius = 100;
                var coords = pieConstructor.getLabelPositioning(d, arc);
                // x/hypotenuse * horiz label radius, y/hypotenuse * vert label radius
                return "translate(" + (coords[0] * 214) +  ',' +
                   (coords[1]* 237) +  ")"; 
              })
              .attr("text-anchor", this.calculateTextAnchor)
              .attr("class", 'label percent')
              .attr("fill", this.getColor)
              .text(function(d, i) { return chartData.slices[i].percent + "%"; });

            //issue text
            arcs.append("svg:text")
                .attr("text-anchor", this.calculateTextAnchor)
                .attr("class", "label issue")
                .attr("transform", function(d) {
                  var coords = pieConstructor.getLabelPositioning(d, arc);
                  return "translate(" + (coords[0] * 264) + "," + (coords[1] * 257) + ")";
                })
                .text(function(d, i) { return chartData.slices[i].segmentName; });
        }
    };
});
