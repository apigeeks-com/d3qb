define(["underscore", "dc", "d3qb/js/chart" ], function (_, dc, chart) {

    // time chart definition

    return function(qb) {

        return {
            title: "Time Chart",

            create: function(el, slice) {
                var chart = dc.lineChart(el,qb.id);
                slice = qb.chart._configure(chart, "time", slice);
                console.log("Time: ", chart, slice, d3);

                qb.chart.scale.time(chart, slice, "x")

                slice.scale.log && qb.chart.scale.log(chart, slice, "y")
                slice.scale.linear && qb.chart.scale.linear(chart, slice, "y")

                chart
                //		    .interpolate('cardinal')
                    .brushOn(slice.brushOn)
                    .renderArea(slice.renderArea)
                    .renderDataPoints(slice.renderDataPoints)
                    .dotRadius(slice.dotRadius)
                    .elasticY(slice.elasticY)
                    .elasticX(true)
                    .clipPadding(slice.clipPadding)

                chart.xAxis();

                return chart;
            },

            defaults: {
                width: 800,
                height: 200,
                renderArea: true,
                renderDataPoints: true,
                clipPadding: 8,
                mouseZoomable: true,
                dotRadius: 4,
                elasticY: true,
                elasticX: false,
            }

        }
    }

});