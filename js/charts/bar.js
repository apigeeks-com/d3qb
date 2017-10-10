define(["underscore", "dc", "d3qb/js/chart" ], function (_, dc, chart) {

    // chart type definition

    return function(qb) {

        return {
            title: "Bar Chart",

            create: function(el, slice) {
console.log("bar el: %o", el);
                var chart = dc.barChart(el, qb.id);
                slice = qb.chart._configure(chart, "bar", slice);
                console.log("Bar: ", chart, slice);

                chart.x(d3.scale.ordinal()).elasticX(slice.elasticX).xUnits(dc.units.ordinal)
//                chart.x(d3.scale.linear());
//                chart.y(d3.scale.linear());

                chart.round(dc.round.floor);

                chart.brushOn(slice.brushOn)
                    .renderHorizontalGridLines(false)
                    .renderVerticalGridLines(false)
                    .elasticX(slice.elasticX)
                    .elasticY(slice.elasticY)
                    .centerBar(slice.centerBar);

                chart.xAxis().tickFormat( function(v) { return v; });

                if (slice.label) chart.label(slice.label);

                return chart;
            },

            defaults: {
                aspectRatio: 600/300,
                width: 600,
                gap: 5,
                height: 300,
                brushOn: true,
                elasticY: false,
                centerBar: false,
                showControls: true
            }

        }
    }

});

/*
 elasticY(true)
 // (_optional_) whether bar should be center to its x value. Not needed for ordinal chart, `default=false`
 .centerBar(true)
 // (_optional_) set gap between bars manually in px, `default=2`
 .gap(1)
 // (_optional_) set filter brush rounding
 .round(dc.round.floor)
 .alwaysUseRounding(true)
 .x(d3.scale.linear().domain([-25, 25]))
 .renderHorizontalGridLines(true)
 // Customize the filter displayed in the control span
 .filterPrinter(function (filters) {
 var filter = filters[0], s = '';
 s += numberFormat(filter[0]) + '% -> ' + numberFormat(filter[1]) + '%';
 return s;
 });

 // Customize axes
 fluctuationChart.xAxis().tickFormat(
 function (v) { return v + '%'; });
 fluctuationChart.yAxis().ticks(5);


 */