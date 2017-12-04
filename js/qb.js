define(["underscore", "moment", "crossfilter", "dc", "d3",
    "d3qb/js/defaults", "d3qb/js/colors", "d3qb/js/charts/index", "d3qb/js/reducers", "d3qb/js/valuers"], function (_, moment, crossfilter, dc, d3, defaults, colors, Charts, Reducers, Valuers) {

    //"/js/dc-addons/dist/dc-addons.js",
    if (!dc) throw "missing dc";
    // if (!dcaddons) throw "missing dcaddons";
    if (!colorbrewer) throw "missing colorbrewer"
    if (!crossfilter) throw "missing crossfilter"

    return function(options, data) {

        console.log("QB: %o", options);

        var qb = { accessor: {}, register: {} };

        _.extend(qb, {

            init: function(options) {
                _.extend(this.options, options);
                this.id = this.id || this.options.id || "qb_"+new Date().getMilliseconds();
                this.options.filters = _.defaults({}, options.filters);
                this.DEBUG = options.debug?true:false;
                console.log("new QB( %s ): %o", this.id, this.options);
                return this;
            },
            options: { decimalPlaces: 2 , el: "body", data: {} },
            _labels: { daysOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], monthsOfYear: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], weekOrWeekend: ["Weekday", "Weekend"] },
            _css: {
                "qb-chart": "qb-chart panel panel-default",
                "qb-chart-header": "panel-heading"
            },
            css: function(name) {
                return qb._css[name] || name;
            },
            colors: function(palette) {
                palette = palette || this.options.colors || "default";
                if (_.isString(palette)) {
                    var _colors = colors[palette] || colors.default;
                    palette = _colors.colors;
                }
                if (!_.isArray(palette))  throw "Invalid Color Palette";
                return d3.scale.ordinal().range(palette);
            },
            load: function(data) {
                if (!data) {
                    return this;
                }
                this.options.data.parse && _.map(data, this.options.data.parse);

                this.data = crossfilter(data);
                // REVIEW: this.raw could become an issue for large datasets as it duplicates this.data
                // this.raw = data;
                this.all = this.data.groupAll();
                this.DEBUG && console.log("Loaded data: %o %o", this, data)
                return this;
            },

            register: {
                labels: function(name, labels) {
                    qb._labels[name] = labels
                    return qb.register;
                },

                dimension: function(name, slice) {
                    var _d = _.isObject(slice)?_.extend({},slice):{};
                    _d = _.pick(_d, "dimension", "keyAccessor", "label", "filterPrinter", "dimensionFormat", "byType", "byKey");
                    console.warn("register dimension (%s): %o %o", name, _d, _.extend({},slice) );

//if (slice.byType) throw "x";
                    _d.dimension = _.isObject(slice)?qb.dimension(name):qb.dimension(name, slice);
                    _d.keyAccessor = _d.keyAccessor || function(r) { return qb.as[_d.byType||"value"](r, _d.byKey||"key") };
                    // auto-lookup labels
                    var _labels = qb._labels[name];
                    if (_labels) {
                        _d.label = _d.label || function(r) { var v=r.key; return _labels[v]||v; };

                        // and the filter printer ...
                        if (!_d.filterPrinter) {
                            _d.filterPrinter = function(r) {
                                var filter = "";
                                for(var i=0;i<r.length;i++) { filter+=(filter?", ":"")+(_labels[r[i]]||r[i]) }
                                return filter;
                            }
                        }
                    }
                    _d.label = _d.label || _d.keyAccessor;

                    qb._dimensions[name] = qb._dimensions[name] || _d;
                    return qb.register;
                },

                d: qb.register.dimension,

                measure: function(name, slice) {
                    var _m = _.pick(slice, "valueAccessor", "reducer")

                    qb._measure(name, slice);
                    console.log("register-measure()", name, _m)
                    qb._measures[name] = qb._measures[name] || _m;
                    return qb.register;
                }
            },

            // var bornIn = qb.dimension("dob", "year")
            dimension: function(meta, type) {
                // assume object is already a dimension
                if (_.isObject(meta)) return meta;
                // regular function dimension
                if (_.isFunction(meta)) return qb.data.dimension( meta );

                // named dimension
                if (_.isString(meta)) {
                    // a simple name function
                    type = type || "value"

                    console.log("dimension (%s) = %o ", type, meta)

                    if (_.isFunction(type)) {
                        return qb.data.dimension( type(meta) );
                    }
                    // simple type-based accessor
                    if (_.isString(type)) {
                        var fn = qb.as[type]
                        if (!fn) throw "oops:d3qb:dimension:unknown:accessor#"+type;
                        console.log("Dimension (%s) As: %o %o", meta, type, fn)
                        if (!qb.data) throw "oops:d3qb:dimension:data:missing"

                        // dynamic dimension by value Functor()
                        return qb.data.dimension( function(model) { return fn(model, meta) } );
                    }
                    throw "oops:d3qb:dimension:create:invalid:dimension#"+meta
                }
                throw "oops:d3qb:dimension:create:lost:dimension"
            },

            group: function(dim, type) {
                if (!type) return dim?dim.group().reduceCount():null;
                var reducer = null;
                if (_.isFunction(type) || _.isObject(type)) {
                    reducer = type;
                } else if (_.isString(type)) {
                    var fn = qb.reduce[type]
                    if (!fn) throw "oops:d3qb:group:type:unknown#"+type;
                    reducer = fn.apply(this, this._skipArgs(arguments, 2));
                } else throw "oops:d3qb:group:type:invalid#"+type

                if (_.isObject(reducer)) return dim.group().reduce( reducer.add, reducer.remove, reducer.initial );
                if (_.isFunction(reducer)) return dim.group().reduceSum( reducer );
                throw "oops:d3qb:group:invalid:reducer#"+reducer;
            },

            // _getMeasureFQ: function(name, slice) {
            //     return _.isString(slice.reducer)?slice.reducer+"_"+(_.isString(slice.valueAccessor)?slice.valueAccessor+"_":"")+name:name;
            // },

            _measure: function(name, slice) {
                slice.reducer = slice.reducer || "summarize";
                slice.valueAccessor = slice.valueAccessor || "count";

                // string or fn reduce - defaults to count / summarize()
                slice.reducer = _.isString(slice.reducer)?qb.reduce[slice.reducer](name, slice):slice.reducer;

                // string or fn accessor - defaults to value accessor
                slice.valueAccessor = (_.isString(slice.valueAccessor)?qb.accessor[slice.valueAccessor]:slice.valueAccessor)
            },

            _slice: function(slice) {
                if (!_.isObject(slice)) throw "oops:d3qb:invalid:slice";
                slice = _.extend( {}, defaults, slice);
                slice.margins = _.extend( {}, defaults.margins, slice.margins );


                slice.dimension = slice.dimension || slice.by;
                // merge dimensions and measures
                // if either is a string, then lookup them up in their respective registries
                if (_.isString(slice.dimension)) {
                    slice.by = slice.dimension;
                    if (!qb._dimensions[slice.dimension]) {
                        qb.register.dimension(slice.dimension, slice);
                    }
                    _.extend(slice, qb._dimensions[slice.dimension]);
                }

                if (slice.type=="count") return slice;

                // named measures - either registered global or inferred
                if (_.isString(slice.measure)) {
                    if (qb._measures[slice.measure]) {
                        _.extend(slice, qb._measures[slice.measure]);
                    } else {
                        qb._measure(slice.measure, slice);
                    }
                }
//		if (_.isObject(slice.measure)) _.extend(slice, slice.measure);

                // make sure nothing went horribly wrong .. we assume sensible defaults from here
                _.each(slice.requires, function(prop) {
                    if (!slice[prop]) throw "oops:d3qb:slice:missing:"+prop
                })

                qb.chart._sanityCheck(slice);

                // setup the measure's value accessor
                slice.valueAccessor = _.isString(slice.valueAccessor)?qb.reduce[slice.valueAccessor]:slice.valueAccessor;
                slice.valueAccessor = slice.valueAccessor || qb.accessor.value;

                // aggregate the measure by dimension
                // qb.group consumes dimension and group, the 3rd/4th parameters are passed as arguments to the reducer()
                if (!slice.group && _.isString(slice.measure)) {
                    slice.group = qb.group(slice.dimension, slice.reducer, slice.measure, slice)
                } else {
                    slice.group = slice.group || qb.group(slice.dimension, slice.reducer, slice)
                }

                console.log("_slice: %o -> %o", qb, slice)
                return slice;
            },

            // quick and dirty default slicer
            sliceBy: function(mName, dName) {
                if (!qb._dimensions) throw "oops:d3qb:slice:dimensions:not-registered"
                if (!qb._measures) throw "oops:d3qb:slice:measures:not-registered"

                if (!dName) throw "oops:d3qb:slice:missing:dimension#"
                if (!mName) throw "oops:d3qb:slice:missing:measure#"

                return qb._slice({ dimension: dName, measure: mName, by: [mName, dName] });
            },

            // draw(type$, measure$, byDimension$)
            // draw(type$, measure{})
            draw: function(type, _slice, _slice_by) {
                if (!_slice) throw "oops:d3qb:draw:missing:slice"
                if (_slice&&_slice_by) _slice = qb.sliceBy(_slice,_slice_by); // quick draw
                if (!_.isObject(_slice)) throw "oops:d3qb:draw:missing:slice"

                if (_slice.disabled) {
                    console.warn("Disabled: %s -> %s by %s", type, _slice.measure, _slice_by || _slice.by);
                    return false;
                }

                // new slice, force type
                slice = qb._slice( _.extend(_slice, {type: type}) );
                // identify, not explicit
                slice.id = qb.id+(slice.id || "_qb_"+type+"_"+(++qb._sliceCount));

                // root element
                var el = slice.el || "#"+slice.id;
                var $chart = $(el);
                var use_existing_dom = $chart.length?true:false;

//                console.log("Draw Chart [%s] %o / %o / %o / %s", type, slice, _slice, $chart, use_existing_dom);

                // attach to dom if not existing
                if (!use_existing_dom) {
                    slice.el = $chart = $("<div/>");
                    var $el = $(qb.options.el);
                    $chart.appendTo($el);
                    $chart.attr("id", slice.id);
                    console.log("NEW DOM: %s -> %o", slice.type, slice);
                }

                // help to make it pretty
                $chart.addClass(qb.css("qb-chart-"+type));
                $chart.addClass( qb.css("qb-chart") );

                // header & controls
                if ($chart.length) {
                    if (slice.header) { $("<div/>").appendTo($chart).addClass(qb.css("qb-chart-header")).html(slice.header) }

                    if ( slice.showControls) {
                        var $controls = $("<div class='qb-controls'/>").appendTo($chart);
                        $("<span class='reset clickable' style='display: none;'><i class='fa fa-close'></i> </span>").appendTo($controls);
                        $("<span class='filter clickable'/>").appendTo($controls);
                    }
                }

                // call chart factory
                var chart = qb.chart._create(el, slice);
//                console.warn("draw():", slice.id, el, chart);


                // bind reset/firr handlers
                if ($chart.length && slice.showControls) {
                    $(".reset", $chart).hide().click(function() { chart.filterAll(); qb.render() })
                    $(".filter", $chart).hide().click(function() { chart.filterAll(); qb.render() })
                }
                chart.$el = $chart;

                return chart;
            },

            render: function() {
                $("[data-measure]").each(function() {
                    var slice = $(this).data();
                    slice.el = $(this)
                    if (slice.type&&slice.measure&&slice.dimension) qb.draw(slice.type, slice);
                });
                dc.renderAll(qb.id);
                return this;
            },
            reset: function() {
                dc.filterAll(qb.id);
                dc.renderAll(qb.id);
                return this;
            },

            filters: function(_newFilters) {
                var charts = dc.chartRegistry.list(qb.id);
                if (!_newFilters) {
                    var filters = {}
                    for (var i = 0; i < charts.length; ++i) {
                        filters[i] = charts[i].filters();
                    }
                    console.log("get filters: ", filters)
                } else {
                    for (var i = 0; i < charts.length; ++i) {
                        if (_newFilters[i]) {
                            charts[i].filter(null);
                            _.each(_newFilters[i], function(_filter) {
                                if (_filter) {
                                    charts[i].filter(_filter);
                                    console.log("set filter: ", i, _filter)
                                }
                            })
                            charts[i].redrawGroup();
                        }
                    }
                }
                return filters;
            },

            // key and value closures
            // used by valueAccessor to identify the value
            accessor: {
                key:  function(r) { return r.key },
                keyDate:  function(r) { return qb.as.date(r, "key") },
                value:  function(r) { return r.value },
                number:  function(r) { return parseFloat(r.value).toFixed(qb.options.decimalPlaces)  },
                total:  function(r) { return parseFloat(r.value?r.value.total:0).toFixed(qb.options.decimalPlaces) },
                count:  function(r) { return r.value?r.value.count:0 },
                average:  function(r) { return parseFloat(r.value?r.value.average:0).toFixed(qb.options.decimalPlaces) },
                min:  function(r) { return r.value?r.value.min:0 },
                max:  function(r) { return r.value?r.value.max:0 },
            },

            // data type transformation
            as: {
                value: 	function(model, meta) { return model[meta] },
                lookup: function(model, meta) { return qb._labels[meta][model[meta]] },
                number: function(model, meta) { return ( model[meta]?parseFloat(model[meta]):0 ).toFixed(qb.options.decimalPlaces) },
                date: 	function(model, meta) { return Date.parse(model[meta]) },
                day:	function(model, meta) { return Date.parse(model[meta]).getDay() },
                month: 	function(model, meta) { return qb._labels.monthsOfYear[qb.as.date(model, meta).getMonth()] },
                year: 	function(model, meta) { var y = new Date(model[meta]); return 1900+y.getYear() },
                week: 	function(model, meta) { return qb.as.date(model, meta).getWeek() },
                dayOfWeek:	function(model, meta) { return qb._labels.daysOfWeek[qb.as.day(model, meta)] },
                weekOrWeekend:	function(model, meta) { var d = qb.as.day(model, meta); return qb._labels.weekOrWeekend[d>0&&d<6?0:1] },
            },

            extent: {
                // dimension-based extent extensions
            },

            // aggregation - {add,remove,initial} or fn() reduce operations
            reduce: new Reducers(qb),
            chart: {
                _configure: function(chart, type, _slice) {
                    var slice = _.extend( { type: type, scale: {} }, defaults, _slice);
                    qb.chart._sanityCheck(slice);

                    slice.margins = _.extend({ top: 5, bottom: 5, left: 5, right: 5 }, slice.margins );

                    var DEBUG = (slice.debug || chart.debug)?true:false;

                    // axis labels
                    if (slice.x && slice.x.label) chart.xAxisLabel(slice.x.label);
                    if (slice.y && slice.y.label) chart.yAxisLabel(slice.y.label);

                    // the basics
                    chart
                        .width(slice.width)
                        .height(slice.height)
                        .renderLabel(slice.renderLabel)
                        .renderTitle(slice.renderTitle)
                        .transitionDuration(slice.transitionDuration);

                    slice.margins && chart.margins && chart.margins(slice.margins);
                    slice.dimension && chart.dimension(slice.dimension);
                    slice.group && chart.group(slice.group);

                    if (chart.colors) {
                        chart.colors( qb.colors(slice.colors) );
                    }

                    if (slice.showControls===false) {
                        chart.turnOffControls();
                    } else {
                        chart.turnOnControls();
                        qb.chart._controls(chart);
                    }

                    // filtering
                    if (_.isFunction(slice.filterPrinter)) {
                        chart.filterPrinter(slice.filterPrinter);
                    }

                    // support post-render processing
                    if (_.isFunction(slice.renderlet )) {
                        chart.renderlet(slice.renderlet);
                    }

                    // Category Labels
                    // TODO: allow over-ride. Refactor into a public function
                    var Label = function(item) {
                        if (slice.labels) return slice.labels[item.key] || item.key;
                        return item.key || slice.keyAccessor.apply(this,arguments);
                    }
                    slice.renderLabel && chart.label( Label );

                    // ToolTips Titles
                    var Title = function(d) {
                        return slice.title || Label(d)+" = "+(slice.valueAccessor?slice.valueAccessor(d):d.value);
                    }
                    slice.renderTitle && chart.title( Title );

                    // key/value accessors (default to dimension/measure field accessors)
                    slice.valueAccessor && chart.valueAccessor(slice.valueAccessor);
                    slice.keyAccessor && chart.keyAccessor(slice.keyAccessor);

                    // optionally handle 'top-n' filtering
                    if (slice.top) {
                        if (_.isFunction(slice.top)) chart.data(slice.top);
                        else if (slice.top>0) chart.data(function(group) { return group.top(slice.top) });
                    }

                    // grid lines
                    if (chart.renderHorizontalGridLines)
                        chart.renderHorizontalGridLines(slice.renderHorizontalGridLines);

                    if (chart.renderVerticalGridLines)
                        chart.renderVerticalGridLines(slice.renderVerticalGridLines);

                    // spacing and layout
                    chart.gap && chart.gap(slice.gap || 5);

                    DEBUG && console.log("configured slice: %s -> %o ", slice.header?slice.header:"untitled", slice );

                    return slice;
                },
                _create: function(el, slice) {
                    if (!el) throw "oops:d3qb:chart:create:missing:dom-selector";
                    if (!slice.type) throw "oops:d3qb:chart:create:missing:type";
                    if (slice.disabled) return false;

                    // configure chart factory for this qb
                    var charts = Charts(qb);

                    // find the chart implementation
                    var Chart = charts[slice.type];
                    if (!Chart) throw "oops:d3qb:chart:create:missing:chart#"+slice.type;

                    // generate a default slice
                    var _slice = _.extend({}, Chart.defaults, slice);
                    var chart = Chart.create(el, _slice);
                    if (!chart) throw "oops:d3qb:chart:create:chart:failed#"+slice.type;
                    console.log("create [%s] %o -> %o", Chart.title, slice, chart);

                    return chart;
                },
                _sanityCheck: function(slice) {
                    if (!slice) throw "oops:d3qb:slice:missing";
                    if (!_.isObject(slice)) throw "oops:d3qb:slice:invalid";
                },

                _controls: function(chart) {
                    var $c = (chart.root());
                    console.log("_controls: %o %o", $c, chart);
                    chart.select(".reset").on("click", function() {
                        chart.filterAll();
                    })
                },

                scale: {
                    time: function(chart, slice, axis) {
                        if (axis&&axis!="x") throw "oops:d3qb:scale:time:invalid-axis";
                        slice.scale = slice.scale || {}
                        var scale = slice.scale.time || {}
                        axis = axis || "x"

                        scale.from = scale.from || new Date(2000,1,1);
                        scale.to = scale.to || new Date();

                        var timescale = d3.time.scale().domain([scale.from,scale.to]);

                        chart.x( timescale );
                        // see https://github.com/mbostock/d3/wiki/Time-Intervals
                        chart.xUnits(scale.units || d3.time.month);

                        console.log("Timescale: ", chart, scale, timescale);
                        return chart;
                    },

                    linear: function(chart, slice, axis) {
                        slice.scale = slice.scale || {}
                        var scale = slice.scale.linear || {}
                        axis = axis || "y"
                        chart[axis](d3.scale.linear())
                    },

                    log: function(chart, slice, axis) {
                        slice.scale = slice.scale || {}
                        axis = axis || "y"
                        chart[axis](d3.scale.log())
                    }
                }

            },

//http://stackoverflow.com/questions/14492284/center-a-map-in-d3-given-a-geojson-object
            _centerOnGeo: function(json, width, height, scale) {
                var center = d3.geo.centroid(json)
                scale  = scale || 150;
                var offset = [width/2, height/2];
                var projection = d3.geo.mercator().scale(scale).center(center).translate(offset);

                // create the path
                var path = d3.geo.path().projection(projection);

                // using the path determine the bounds of the current map and use
                // these to determine better values for the scale and translation
                var bounds  = path.bounds(json);
                var hscale  = scale*width  / (bounds[1][0] - bounds[0][0]);
                var vscale  = scale*height / (bounds[1][1] - bounds[0][1]);
                var scale   = (hscale < vscale) ? hscale : vscale;
                var offset  = [width - (bounds[0][0] + bounds[1][0])/2, height - (bounds[0][1] + bounds[1][1])/2];

                // new projection
                projection = d3.geo.mercator().center(center).scale(scale).translate(offset);
                return path.projection(projection);
            },

            _skipArgs: function(args, skip) {
                var newArgs = []
                for (var i = skip; i < args.length; i++) newArgs.push(args[i]);
                return newArgs;
            },

            _setter: function(dst, src) {
                if (!_.isObject(dst)&&_.isObject(src)) throw "oops:d3qb:chart:setter:args:invalid"
                _.each(src, function(v,k) {
                    var method = dst[k]
                    (method && _.isFunction(method) ) && dst[method].apply(dst, [ src[k] ] );
                    console.log("set: ", dst, src, k, v, method)
                })
                return dst;
            },

            _dimensions: {}, _measures: {}, _sliceCount:0,
        });

        return qb.init(options).load(data);

    }

});
