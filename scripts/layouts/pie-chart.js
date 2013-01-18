/* 
 * layout module
 * only public method is 'render' which accepts parsed CFPBDATA JSON
 */
define(["./settings", "./helpers"], function(layoutSettings, helpers) {
    return function() {
        // return appropriate color value from gradient array
        this.getColor = function(d, i) {
          return layoutSettings.colorGradient[i];
        },

        // event handlers for active states
        // these should be a little neater
        this.chartHover = function(d, d3Obj) {
            var slice = d3.select(d3Obj),
                path = slice.select("path"),
                enlargedArc = d3.svg.arc().outerRadius(220);
            path.attr("d", enlargedArc);
            $('#slice-' + d.data.id).addClass('active');
        },

        this.chartHoverOff = function(d, d3Obj) {
            var slice = d3.select(d3Obj),
                path = slice.select("path"),
                defaultArc = d3.svg.arc().outerRadius(200);
            path.attr("d", defaultArc);

            $('#slice-' + d.data.id).removeClass('active');
        },

        this.toggleTooltip = function(sliceData) {
            
        },

        // generate the pie slices themselves using d3
        this.d3Render = function(chartData, svgClass) {
            var chartModule = this;
            var chart = d3.select(svgClass)
                    .append("svg:svg")
                    .data([chartData.sections])
                        .attr("class", "pie")
                        .append("svg:g")
                        .attr("transform", "translate(450, 350)");

                // determines the diameter of slices
                var arc = d3.svg.arc()
                    .outerRadius(200);

                // a nice d3 method that does the math of generating
                // relatively sized slices for us
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

        this.renderTotal = function(chartData, svgClass) {
            var totalContainer = $(svgClass + '-total'),
                template = ich.pieChartTotal(chartData.settings);
            totalContainer.html(template);
        },

        this.renderIndex = function(chartData, svgClass) {
            var chartModule = this,
                indexClass = svgClass + "-index",
                indexContainer = $(indexClass + " .index"),
                numSlices = chartData.sections.length - 1,
                indexItems,
                template;

            for (var i = 0; i <= numSlices; i++) {
                chartData.sections[i].color = chartModule.getColor({}, i);  
                template = ich.pieChartIndex(chartData.sections[i]); 
                indexContainer.append(template);
            } 

            indexItems = indexContainer.find('li');

            indexItems.on('mouseover focus', function(event) {
                chartModule.indexEventHandler(event, false);
            });

            indexItems.on('mouseout blur', function(event) {
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
                    layoutModule.renderTotal(chartData, svgClass);
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
