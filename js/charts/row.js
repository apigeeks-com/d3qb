define(["underscore", "dc"], function (_, dc) {

    // chart type definition

    return function(qb) {
        return {
            title: "Row Chart",

            create: function(el, slice) {
                var chart = dc.rowChart(el,qb.id);
                slice = qb.chart._configure(chart, "row", slice);
                console.log("Row: %o -> %o", chart, slice);

                chart.gap(slice.gap || 1);

//			chart.renderVerticalGridLines(slice.renderVerticalGridLines);
//			chart.renderHorizontalGridLines(slice.renderHorizontalGridLines);
                slice.elasticX && chart.elasticX(slice.elasticX)


                if (slice.colors) {
                    chart.colors( qb.colors(slice.colors) );
                }

                return chart;
            },

            defaults: {
                width: 200,
                height: 200,
                renderTitle: true,
                renderHorizontalGridLines: false,
                renderVerticalGridLines: false,
                showControls: true
            }

        }
    }

});