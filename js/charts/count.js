define(["underscore", "dc", "meta4qb/js/chart" ], function (_, dc, chart) {

    // chart type definition

    return function(qb) {

        return {
            title: "Count",

            create: function(el, slice) {
                var chart = dc.dataCount(el, qb.id);

                slice.dimension = qb.data;
                slice.group = slice.group || qb.data.groupAll();
                slice = qb.chart._configure(chart, "count", slice);

                console.log("Count: %o", slice);
                var $el = $(el);

                chart.html({
                    some: slice.some || '<div class="qb-filter-stats">showing <strong>%filter-count</strong> of <strong>%total-count</strong> - <button class="btn btn-default btn-sm" data-action="reset">reset</button></div>',
                    all: slice.all || '<div class="qb-filter-stats"><strong>%total-count</strong> records</div>'
                });

                chart.on("postRedraw", function() {
                    $("[data-action='reset']", $el).click(function() {
                        console.log("Filter Reset: ", qb, qb.filters() );
                        qb.reset();
                    })
                })


                return chart;
            },

            defaults: {
                width: 192, height: 32, required: []
            }

        }
    }

});