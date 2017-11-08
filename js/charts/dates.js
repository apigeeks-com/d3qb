define(["underscore", "dc", "d3qb/js/chart", "datepicker" ], function (_, dc, chart) {

    var DateRangeFilter = function (d) {
        var v = chart.valueAccessor()(d);
        console.log("DateRangeFilter: %o -> %o", v, d);
        return v > 0;
    };


    var DateChart = function (parent, chartGroup) {
        var _chart = dc.baseMixin({});

        _chart.data(function (group) {
            console.log("[Dates] data: %o", group);
            return group.all().filter(new DateRangeFilter());
        });

        _chart._doRender = function () {
            _chart.select('.qb-dates').remove();
            var select = _chart.root().append('div').classed("qb-dates input-group input-daterange", true);

            var input1 = select.append("input").classed("form-control start-date");
            var input2 = select.append("input").classed("form-control end-date");

            _chart._doRedraw();

            _chart.datepicker = $(select);
            _chart.datepicker.datepicker({ todayBtn: true, todayHighlight: true, clearBtn: true, autoclose: true });

            setTimeout(function() {
                var $input = $("input");
                console.log("[Dates] doRender: %o -> %o", $(select), $input);
                $(input1).on( {
                    changeDate: function(e) {
                        console.log("[Dates] changeDate: %o", arguments);
                    },
                    change: function() {
                        console.log("[Dates] change: %o", arguments);
                    }
                });
            },1000);
            return _chart;
        };

        chart.onChange = function (val) {
            console.log("[Dates] onChange: %o", val);
            if (val) {
                _chart.replaceFilter(val);
            } else {
                _chart.filterAll();
            }
            dc.events.trigger(function () {
                _chart.redrawGroup();
            });
        };

        chart._doRedraw = function () {
            console.log("[Dates] doRedraw", this);

            _chart.group(function (g) {
                console.log("Tabulate: ", g);
                return g.flavor;
            });
        }
        return _chart.anchor(parent, chartGroup);
    }

    return function(qb) {

        var defn = {
            title: "Date Range",

            create: function (el, slice) {
                var chart = new DateChart(el,qb.id);

                slice = qb.chart._configure(chart, "table", slice);
                console.log("[Dates] create: %o -> %o ->%o", el, chart, slice);
                if (slice.dimension) chart.dimension(slice.dimension);


                return chart;
            },
            defaults: {
                width: 800,
                height: 400,
                locale: 'YYYY-MM-DD'
            }
        }

        return defn;
    }
});
