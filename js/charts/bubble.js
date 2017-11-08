define(["underscore", "dc", "d3qb/js/chart" ], function (_, dc, chart) {

    // chart type definition

    return function(qb) {

        return {
            title: "Bubble Chart",
            create: function(el, slice) {
                var chart = dc.bubbleChart(el,qb.id);
                slice = qb.chart._configure(chart, "bubble", slice);
                console.log("Bubble: ", chart, slice);

                chart
                // .x(d3.scale.ordinal())
                    .x(d3.scale.linear().nice())
                    .elasticX(slice.elasticX);
                // .xUnits(dc.units.ordinal)

                chart
                    .y(d3.scale.linear().nice())
                    .elasticY(slice.elasticY);

                chart.r(d3.scale.linear().domain([0, 4000]))

                chart.brushOn(slice.brushOn)

                // TODO: implement
                chart.radiusValueAccessor(function (data) {
                    return data[slice.radiusKey];
                }).maxBubbleRelativeSize(0.3)


                //     .clipPadding(slice.clipPadding)
                //     .elasticX(slice.elasticX)
                //     .elasticY(slice.elasticY)
                return chart;
            },

            defaults: {
                width: 800,
                height: 400
            }

        }
    }

});