/* 
 * layout module
 * only public method is 'render' which accepts parsed CFPBDATA JSON
 */
define(["./settings", "./helpers"], function(layoutSettings, helpers) {
    return function() {
        this.getColor = function(d, i) {
          return layoutSettings.colorGradient[i];
        },

        this.chartHover = function(d, d3Obj) {
            var slice = d3.select(d3Obj),
                path = slice.select("path"),
                enlargedArc = d3.svg.arc().outerRadius(220),
                defaultFill = path.attr("fill");
            path.attr("default-fill", defaultFill)
                .attr("fill", layoutSettings.activeColor)
                .attr("d", enlargedArc);
            $('#slice-' + d.data.segmentName).addClass('active');
        },

        this.chartHoverOff = function(d, d3Obj) {
            var slice = d3.select(d3Obj),
                path = slice.select("path"),
                defaultArc = d3.svg.arc().outerRadius(200),
                defaultFill = path.attr("default-fill");
            path.attr("fill", defaultFill)
                .attr("d", defaultArc);

            $('#slice-' + d.data.segmentName).removeClass('active');
        },

        this.d3Render = function(chartData, svgClass) {
            var chartModule = this;
            var chart = d3.select(svgClass)
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

                arcs.on("mouseover", function(d) { chartModule.chartHover(d, this); })
                  .on("mouseout", function(d) { chartModule.chartHoverOff(d, this); });
        },

        this.raphaelRender = function(chartData) {

        },
        
        this.indexEventHandler = function(event, isMouseout) {
            var chartModule = this,
                segment = event.target.dataset.segment;
            d3.selectAll("g.slice")
                .filter(function(d, i) {
                    if (d.data.segmentName === segment) {
                        chartModule[isMouseout ? 'chartHoverOff' : 'chartHover'](d, this);                            
                    }
                });
        },

        this.renderIndex = function(chartData, svgClass) {
            var chartModule = this,
                indexClass = svgClass + "-index",
                indexContainer = $(indexClass),
                numSlices = chartData.sections.length - 1,
                template;

            for (var i = 0; i <= numSlices; i++) {
               template = ich.pieChartIndex(chartData.sections[i]); 
               indexContainer.append(template);
            } 

            indexContainer.on('mouseover', function(event) {
                chartModule.indexEventHandler(event, false);
            });

            indexContainer.on('mouseout', function(event) {
                chartModule.indexEventHandler(event, true);
            });

        },

        this.render = function(chartData) {
            var layoutModule = this,
                svgClass = ".cfpb-data-visualization-" + chartData.settings.timestamp;


            if (helpers.supportsSvg()) {
                // if svg is supported, use D3
                require(["libs/d3/d3.v3.min"], function(D3) {
                    layoutModule.renderIndex(chartData, svgClass);

                    layoutModule.d3Render(chartData, svgClass);              
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
