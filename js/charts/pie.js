define(["underscore", "dc", "d3qb/js/chart" ], function (_, dc, chart) {

    return function(qb) {

        return {
            title: "Pie Chart",

            create: function(el, slice) {
                var chart = dc.pieChart(el, qb.id);
                slice = qb.chart._configure(chart, "pie", slice);
                console.log("Pie/Donut: ", chart, slice);

                chart.radius(slice.radius)
                    .innerRadius(slice.innerRadius)
                    .slicesCap(slice.slicesCap);

                if (slice.renderLegend) {
                    // chart.legend ||
                    var legend  = dc.legend();
                    legend.x(0).y(10).itemHeight(15).gap(10);
                    chart.legend(legend);
                }

                return chart;
            },
            defaults: {
                aspectRatio: 250/200,
                width: 250,
                height: 200,
                radius: 250,
                innerRadius: 0,
                slicesCap: 10,
                renderTitle: true,
                showControls: false,
                renderLabel: true,
                renderLegend: true
            }
        }
    };
});