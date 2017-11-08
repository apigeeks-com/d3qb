define(["underscore", "dc", "d3qb/js/chart" ], function (_, dc, chart) {

    // chart type definition

    return function(qb) {

        return {
            title: "DropDown Menu",

            create: function(el, slice) {
                var chart = dc.selectMenu(el, qb.id);
                qb.chart._configure(chart, "menu", slice);
                console.log("[dropdown]: ", chart, slice);

                if (slice.multiple) chart.multiple(true);
                if (slice.label) chart.label(slice.label);

                if (slice.size) chart.numberVisible(slice.size);
                return chart;
            },

            defaults: {
                width: 600,
                gap: 5,
                size: 10,
                height: 300,
                multiple: false,
                showControls: false
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