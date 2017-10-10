define(["underscore", "dc", "d3qb/js/chart" ], function (_, dc, chart) {

    // chart type definition

    return function(qb) {

        return {
            title: "Scatter Chart",

            create: function(el, slice) {
                var chart = dc.scatterChart(el,qb.id);
                slice = qb.chart._configure(chart, "scatter", slice);

                console.log("Scatter: ", chart, slice);
                return chart;
            },

            defaults: {
                width: 800, height: 400
            }

        }
    }

});