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
                    if (slice.debug)  console.log("Tabulate: ", g);
                    return g[slice.dimension];
                });

                chart.showGroups(slice.showGroups);
                chart.size(slice.size);
                slice.columns && chart.columns(slice.columns);

                if (slice.sortBy) {
                    chart.sortBy(function(d) {
                        return d.sortBy;
                    });
                }
                return chart;
            },

            defaults: {
                width: 800, height: 400, showGroups: false, size: 200
            }

        }
    }

});