define(["underscore", "dc", "d3", "d3qb/js/charts/grid" ], function (_, dc, d3, grid) {

    // grid type definition

    return function(qb) {

        return {
            title: "Data Grid",

            create: function(el, slice) {
                slice.keyAccessor = slice.keyAccessor || "Name";
console.log("slice.keyAccessor: %o", slice.keyAccessor);

                var grid = dc.dataGrid(el,qb.id);
                slice = qb.chart._configure(grid, "grid", slice);
                console.log("DataGrid: ", grid, slice);


                var defaultHtmlGroupTemplate = function (d) { return '<h2>'.d.key + 'with ' + d.values.length +' items</h2>'};

                var itemTemplate = _.template(slice.html);
                var htmlGroupTemplate = slice.htmlGroup?_.template(slice.htmlGroup):defaultHtmlGroupTemplate;

                //
                // grid.html(itemTemplate);
                // grid.htmlGroup(htmlGroupTemplate);

//                grid.order(d3[slice.order]);
//                grid.sortBy(d3[slice.order]);

                return grid;
            },

            defaults: {
                width: 800, height: 400,
                beginSlice: 0, endSlice:0,
                order: "descending",
                html: "<div>item</div>",
                htmlGroup: "<h3>group</h3>"
            }

        }
    }

});