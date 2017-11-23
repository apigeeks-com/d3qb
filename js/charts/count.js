define(["underscore", "dc"], function (_, dc) {

    // chart type definition

    return function(qb) {

        return {
            title: "Count",

            create: function(el, slice) {
                var chart = dc.dataCount(el, qb.id);

                slice.dimension = qb.data;
                slice.group = slice.group || qb.data.groupAll();
                slice = qb.chart._configure(chart, "count", slice);

                var $el = slice.el;
                console.log('Chart Count: %o %o' , slice,  $el);

                chart.html({
                    some: slice.some || '<div class="qb-filter-stats">showing <strong>%filter-count</strong> of <strong>%total-count</strong> - <i class="fa clickable fa-close btn-sm" data-action="reset"></i></div>',
                    all: slice.all || '<div class="qb-filter-stats"><strong>%total-count</strong> records</div>'
                });

                chart.on("postRedraw", function() {
                    $("[data-action='reset']", $el).click(function() {
                        console.log("Filter Reset: ", qb, qb.filters() );
                        qb.reset();
                    });
                });

                return chart;
            },

            defaults: {
                width: 192, height: 32, required: []
            }

        }
    }

});
