define(["underscore", "dc"], function (_, dc) {

    // chart type definition

    return function(qb, defaults) {

        return {
            title: "Line Chart",

            create: function(el, slice) {
                var chart = dc.lineChart(el, qb.id);
        		    slice = qb.chart._configure(chart, "line", slice);

                chart.legend(dc.legend().x(800).y(10).itemHeight(13).gap(5))

               // slice.mouseZoomable && chart.mouseZoomable(slice.mouseZoomable);

                if (slice.ordinal) {
                    chart.x(d3.scale.ordinal()).elasticX(slice.elasticX).xUnits(dc.units.ordinal)
                } else {
                    chart.x(d3.scale.linear().nice()).elasticX(slice.elasticX);
                }

                chart.y(d3.scale.linear().nice()).elasticY(slice.elasticY);
                chart.renderArea(slice.renderArea);

                chart.ordinalColors(["#56B2EA","#E064CD","#F8B700","#78CC00","#7B71C5"]);

                chart.brushOn(slice.brushOn);

                // TODO: Can't draw dots unless brushOn is off - apparently
                if (!chart.brushOn) {
                    chart.dotRadius(slice.dotRadius);
                    chart.renderDataPoints(slice.renderDataPoints);
                }
                chart.renderHorizontalGridLines(slice.renderHorizontalGridLines);

                // chart.interpolate('step-before')
                // .clipPadding(slice.clipPadding)

                // chart.on('renderlet', function (chart)
                // {
                //     chart.selectAll("text.y-axis-label.y-label")
                //       .attr("transform", "rotate(0)," + "translate(45, 10)");
                //     chart.selectAll("text.x-axis-label")
                //       .attr("transform", "translate(30, "+(chart.height()-10)+")");
                //     chart.selectAll("g.axis.y")
                //       .attr("transform", "translate(50, 25)");
                //     chart.selectAll(".grid-line line")
                //       .attr("x1", "-80");
                //     chart.select("g.axis.y .tick")
                //       .attr("style", "opacity:0;");
                // });

                return chart;
            },

            defaults: _.extend(defaults, {
                aspectRatio: 800/400,
                width: 800, height: 400,
                renderDataPoints: true,
                renderHorizontalGridLines: false,
                renderArea: false,
                brushOn: false,
                elasticX: true,
                elasticY: true,
                mouseZoomable: true,
                dotRadius: 8
            })

        }
    }

});
