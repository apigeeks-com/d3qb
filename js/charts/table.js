define(["underscore", "dc", "d3qb/js/chart" ], function (_, dc, chart) {

    // chart type definition

    return function(qb) {

        return {
            title: "Data Table",

            create: function(el, slice) {
                var chart = dc.dataTable(el,qb.id);
                slice = qb.chart._configure(chart, "table", slice);
                console.log("Table: ", chart, slice);
                if (slice.dimension) chart.dimension(slice.dimension);

                chart.group(function(g) {
                    console.log("Tabulate: ", g);
                    return g.flavor;
                });

                slice.columns && chart.columns(slice.columns);
//			chart.size(10)
                return chart;
            },

            defaults: {
                width: 800, height: 400
            }

        }
    }

});