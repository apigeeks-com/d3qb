define(["underscore", "dc", "d3qb/js/chart", "helpers" ], function (_, dc, chart, helpers) {

    // chart type definition

    return function(qb) {

        return {
            title: "Data Table",

            create: function(el, slice) {
                var $table = helpers.createDOMElement({}, null, "table");
                $table.appendTo(el);
                $table.attr("id", el.substring(1)+"_datatable");
                console.log("$table: %o", $table, el);

                var chart = dc.dataTable(el+"_datatable",qb.id);
                slice = qb.chart._configure(chart, "table", slice);
                console.log("DataTable: %o -> %o %o", el, chart, slice);

                if (slice.dimension) {
                    chart.dimension(slice.dimension);

                    slice.sortBy = slice.sortBy || slice.dimension;
                }

                // grouping (not cross filtered)
                chart.group(function(d) {
                    if (slice.debug)  console.log("Tabulate: ", d);
                    return d[slice.dimension];
                });

                chart.showGroups(slice.showGroups?true:false);

                // table columns - default to dimension
                if (!slice.columns) {
                    slice.columns = [slice.dimension];
                }
                chart.columns(slice.columns);

                // number of row
                chart.size(slice.size);

                // sorting
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