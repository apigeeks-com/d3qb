define(["underscore", "dc", "d3qb/js/chart" ], function (_, dc, chart) {

    // chart type definition

    return function(qb) {

        return {
            title: "Donut Chart",

            create: function(el, slice) {
                var chart = dc.pieChart(el, qb.id);
                slice = qb.chart._configure(chart, "donut", slice);
                console.log("Donut: %o", slice);


                chart.ordinalColors(["#04AEA6","#00A9E4","#0A7CB7",
                                     "#002664","#752F88"]);
                //chart.label(function(d){return d.value.percent});
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
                radius: 90,
                innerRadius: 20,
                slicesCap: 10,
                renderTitle: true,
                showControls: false,
                renderLabel: true,
                renderLegend: false
            }
        }
    }

});
