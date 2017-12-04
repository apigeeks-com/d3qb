define(["underscore", "helpers"], function (_, helpers) {
    return function(options, qb) {

        return {
            x_configure: function (chart, type, _slice) {
                var slice = _.extend({type: type, scale: {} }, qb.defaults.all, qb.defaults[type], _slice);
                qb.chart._sanityCheck(slice);
                console.log("_configured: ", slice.header ? slice.header : "untitled", slice, qb.defaults.all, qb.defaults[type]);

                if (slice.x && slice.x.label) chart.xAxisLabel(slice.x.label || slice.xLabel);
                if (slice.y && slice.y.label) chart.yAxisLabel(slice.y.label || slice.yLabel);

                slice.width = helpers.convert_percent(slice.width,"width");
                slice.height = helpers.convert_percent(slice.height,"height");

                chart
                    .width(slice.width)
                    .height(slice.height)
                    .renderLabel(slice.renderLabel)
                    .renderTitle(slice.renderTitle)
                    .transitionDuration(slice.transitionDuration);

                if (slice.dimension) chart.dimension(slice.dimension)
                slice.group && chart.group(slice.group)

                if (chart.colors) chart.colors(slice.colors || qb.options.colors)

                if (slice.showControls === false) {
                    chart.turnOffControls();
                } else {
                    chart.turnOnControls();
                    qb.chart._controls(chart);
                }

                if (_.isFunction(slice.filterPrinter)) chart.filterPrinter(slice.filterPrinter);
                // else chart.filterPrinter(function() {
                //     console.log("filter: %o -> %o", arguments, slice);
                // });
                if (slice.renderlet) chart.renderlet(slice.renderlet);

                // display the label
                var label = slice.label || slice.keyAccessor || slice.valueAccessor || function () { return "No Label"; }
                slice.renderLabel && chart.label(label);

                // render title
                var title = _.isFunction(slice.title)?slice.title:function (d) {
                    return label(d) + " = " + (slice.valueAccessor ? slice.valueAccessor(d) : d.value);
                }
                slice.renderTitle && chart.title(title);
                console.log("Label & Title", label, title);

                // key / value accessors
                if (slice.valueAccessor) chart.valueAccessor(slice.valueAccessor);

                if (_.isString(slice.keyAccessor)) {
                    slice.keyAccessor = function(d) {
console.log("keyAccessor: %o", d);
                        return d[slice.keyAccessor];
                    }
                }
                if (slice.keyAccessor) chart.keyAccessor(slice.keyAccessor);

                // optionally handle 'top-n' filtering
                if (slice.top) {
                    if (_.isFunction(slice.top)) {
                        chart.data(slice.top);
                    } else chart.data(function (group) {
                        return group.top(slice.top);
                    })
                }

                return slice;
            }
            ,
            _sanityCheck: function (slice) {
                if (!slice) throw "oops:d3qb:slice:missing";
                if (!_.isObject(slice)) throw "oops:d3qb:slice:invalid";
            },

            _controls: function (chart) {
                var $c = (chart.root())
                console.log("_controls()", $c, chart)
//			chart.select(".reset").on("click", function() {
//					chart.filterAll();
//			})
            },

            scale: {
                time: function (chart, slice, axis) {
                    if (axis && axis != "x") throw "oops:d3qb:scale:time:invalid-axis";
                    slice.scale = slice.scale || {}
                    var scale = slice.scale.time || {}
                    axis = axis || "x"

                    scale.from = scale.from || new Date(2013, 1, 1)
                    scale.to = scale.to || new Date()

                    var timescale = d3.time.scale().domain([scale.from, scale.to])

                    chart.x(timescale)
                    // see https://github.com/mbostock/d3/wiki/Time-Intervals
                    chart.xUnits(scale.units || d3.time.month)

                    console.log("Timescale: ", chart, scale, timescale)
                    return chart;
                },

                linear: function (chart, slice, axis) {
                    slice.scale = slice.scale || {}
                    var scale = slice.scale.linear || {}
                    axis = axis || "y"
                    chart[axis](d3.scale.linear())
                },

                log: function (chart, slice, axis) {
                    slice.scale = slice.scale || {}
                    axis = axis || "y"
                    chart[axis](d3.scale.log())
                }
            },
            _create: function (el, slice) {
                if (!el) throw "oops:d3qb:chart:create:missing:dom-selector";
                if (!slice.type) throw "oops:d3qb:chart:create:missing:type";
                return qb.chart[slice.type](el, slice);
            }
        }
    }

});
