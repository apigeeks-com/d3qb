define(["underscore", "dc"], function (_, dc) {

    // chart type definition

    return function(qb, defaults) {

        return {
            title: "Line Chart",

            create: function(el, slice) {
                var chart = dc.lineChart(el, qb.id);
			    slice = qb.chart._configure(chart, "line", slice);

//                chart.legend(dc.legend().x(800).y(10).itemHeight(13).gap(5))

//                slice.mouseZoomable && chart.mouseZoomable(slice.mouseZoomable);

                if (slice.ordinal) {
                    chart.x(d3.scale.ordinal()).elasticX(slice.elasticX).xUnits(dc.units.ordinal)
                } else {
                    chart.x(d3.scale.linear().nice()).elasticX(slice.elasticX);
                }

                chart.y(d3.scale.linear().nice()).elasticY(slice.elasticY);
                chart.renderArea(slice.renderArea);

                chart.brushOn(slice.brushOn);
                //.interpolate('step-before')
                //.dotRadius(slice.dotRadius)
                // .clipPadding(slice.clipPadding)

                chart.xAxis().ticks(10).tickFormat();

                return chart;
            },

            defaults: _.extend(defaults, {
                aspectRatio: 800/400,
                width: 800, height: 400,
                renderDataPoints: true,
                renderArea: true,
                brushOn: true,
                elasticX: true,
                elasticY: true,
                mouseZoomable: true,
                dotRadius: 4,
            })

        }
    }

});