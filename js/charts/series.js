define(["underscore", "dc", "meta4qb/js/chart" ], function (_, dc, chart) {

    // chart type definition

    return function(qb) {

        return {
            title: "Series Chart",

            create: function(el, slice) {
                var chart = dc.seriesChart(el,qb.id);
                slice = qb.chart._configure(chart, "series", slice);
                console.log("Series: ", chart, slice);

                chart.brushOn(slice.brushOn)
                    .clipPadding(slice.clipPadding)
                    .elasticX(slice.elasticX)
                    .elasticY(slice.elasticY)
                return chart;
            },

            defaults: {
                width: 800, height: 400
            }

        }
    }

});