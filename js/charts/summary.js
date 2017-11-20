define(["underscore", "dc", "d3qb/js/charts/dc/summaryText"], function (_, dc, SummaryText) {

    // chart type definition

    return function(qb) {

        return {
            title: "Summary",

            create: function(el, slice) {
                var chart = dc.summaryText(el, qb.id);

                slice.dimension = qb.data;
                slice.group = slice.group || qb.data.groupAll();
                slice = qb.chart._configure(chart, "count", slice);

                var $el = slice.el;
                console.log('Chart Summary: %o %o' , slice,  $el);

                chart.html({
                    some: slice.some || '<div class="qb-filter-stats">showing <strong><%=selected_total%></strong> of <strong><%=pretty_total%></strong> - <span class="fa fa-close clickable" data-action="reset"></span></div>',
                    all: slice.all || '<div class="qb-filter-stats"><strong><%=pretty_total%></strong> records</div>'
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
