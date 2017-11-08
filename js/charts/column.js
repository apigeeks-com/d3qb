define(["underscore", "dc", "d3qb/js/chart" ], function (_, dc, chart) {

    // chart type definition

    return function(qb) {

        return {
            title: "Column Chart",
            create: function(el, slice) {
                var chart = dc.barChart(el, qb.id);
                slice = qb.chart._configure(chart, "bar", slice);
                console.log("Column: ", chart, slice);

                chart.
                x(d3.scale.ordinal())
                    .xUnits(dc.units.ordinal)
                    .y(d3.scale.linear());

                chart
                    .gap(slice.gap || 2);

                chart.brushOn(slice.brushOn)
                    .renderHorizontalGridLines(true)
                    //			.renderVerticalGridLines(false)
                    //			.elasticX(slice.elasticX)
                    .elasticY(slice.elasticY)
                    .centerBar(slice.centerBar);

                chart.xAxis().tickFormat();
                if(slice.label) chart.label(slice.label);

                return chart;
            },

            defaults: {
                aspectRatio: 400/250,
                width: 400, height: 250, centerBar: false, showControls: true, renderTitle: true
            }

        }
    }

});