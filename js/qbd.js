define(["jquery", "underscore", "dc", "d3", "qb"], function ($, _, dc, d3, qb) {

var qbd = {};

_.extend(qbd, {
	options: { el: "body", responseType: "json",
		css: { 	root: "qb-main ", qbd: "qbd ",
				header: "qb-header", chart: "qb-chart", empty: "qb-empty" }
	}, _qbd: {},

	init: function(options) {
		_.extend(qbd.options,options);
        this.DEBUG = options.debug?true:false;

		qbd.$el = qbd._createContainerElement(qbd.options);
		qbd.$el.addClass(qbd.options.css.root);
        console.log("init qbd(): %o %o -> %o", qbd, qbd.options, qbd.$el)

        // this.DEBUG &&
        console.log("loaded qbd(): %o %o %o", qbd, qbd.$el, qbd.options)

		this.options.qbd && qbd.loadAll(this.options.qbd)
		return this;
	},
	qb: function(qb_id) {
 		if (!qb_id) throw "urn:oops:qbd:qb:missing-id"
		var qbd_qb = qbd._qbd[qb_id];

        if (!qbd_qb) throw "urn:oops:qbd:qb:missing#"+qb_id
 		return qbd_qb
 	},
	loadAll: function(dashes) {
        console.log("load all dashboards: %o", dashes);
		_.each(dashes, function(conf, qbd_id) {
			conf.id = conf.id || "qbd_"+qbd_id
			qbd.show(conf)
		});
	},
 	register: {
		qb: function(qb_id, qbd_conf) {
			if (!qb_id) throw "urn:oops:qbd:register:qb:missing:id"
			if (!qbd_conf) throw "urn:oops:qbd:register:qb:missing:config"
			qbd._qbd[qb_id] = qb(qbd_conf);

			// safely get our new qb()
			var _qb = qbd.qb(qb_id);

            this.DEBUG && console.log("registered qb(): ", qb_id, _qb, qbd_conf)

			// global labels
			_.each(qbd.options.labels, function(labels, label_id) {
				_qb.register.labels(label_id, labels);
			})
			return _qb;
		},
	},

	show: function(conf, params) {
	    var self = this;
		qbd._drawHeader(conf);

        this.DEBUG && console.log("Dashboard: ", conf.id, conf)
		var responseAccessor = conf.responseAccessor || qbd.options.responseAccessor
		var responseType = conf.responseType || qbd.options.responseType || "json"

		if (_.isString(responseAccessor)) responseAccessor = qbd.responseFormat[responseAccessor]

		var $loading = $(conf.loader || ".qb-loading" );
		var url = conf.url+"?"

		_.each(params, function(v,k) {
			url+=k+"="+encodeURIComponent(v)+"&"
		})
		url = url.substring(0,url.length-1)

		$loading.show();
		// ask the data source
		if (conf.url && d3[responseType]) {
			// TODO: optimise re-use of data sources
            this.DEBUG && console.log("Loading QB %s data: %s", responseType, url);

            d3[responseType](url, function(response) {
                //self.DEBUG &&
                console.log("Loaded QB data: %s %o %o", conf.id, conf, response);

				var data = responseAccessor?responseAccessor(response):response
				// register() and load() data into qb(), finally .. render()
				qbd.register.qb(conf.id, conf);

				if ( (!data || !data.length) && conf.empty) {
					qbd.drawEmpty(conf);
				} else {
                    var _qb = qbd.qb(conf.id);
					_qb.load(data);
					qbd.draw(conf);
					$loading.hide();
					_qb.render();
				}
			})
		}

	},

	draw: function(conf) {
        conf.$el = this.element(conf) || qbd.$el;
		if (!conf.$el || !conf.$el.length) throw "urn:oops:qbd:chart:element:missing#"+chart_id;

        // draw all configured charts, including container elements
		// attach them to the conf.el
		var self = this
		var _qb = qbd.qb(conf.id);
		_.each(conf.charts, function(chart_conf, chart_id) {
            if (!chart_conf) throw "urn:oops:qbd:chart:config:missing#"+chart_id;
		    if (!chart_conf.type) throw "urn:oops:qbd:chart-type:missing#"+chart_id;

		    //			self.drawChart(chart_conf, conf.el)

			var chart = _qb.draw(chart_conf.type, chart_conf)
			if (conf.filters) {
				chart.filter(null)
				var filters = conf.filters[chart_conf.dimension]
				_.each(filters, function(filter) {
					filter && chart.filter(filter)
				})

                console.log("preset-filter: ", chart_conf.id, filters);
			}
//			chart.$el.addClass(qbd.options.css.qbd);
//		$el && $el.append( conf.el )
		})
		return qbd;
	},

	drawEmpty: function(conf) {
	    conf.$el = this.element(conf);
        conf.$el.addClass(qbd.options.css.empty);
        this.DEBUG && console.log("drawEmpty: %o", conf);

		var $panel = $("<div/>").html(conf.empty.template)
        conf.$el.append( $panel )
	},
	drawChart: function(conf) {
		conf.el = qbd._createContainerElement(conf)
		conf.el.addClass(qbd.options.css.chart)
		conf.height && conf.el.height(conf.height+64)
		conf.width && conf.el.width(conf.width+16)
		return qbd;
	},

	chart : function(qb_id, type, slice, lazy) {
		var _qb = qbd.qb(qb_id);
		var chart = _qb.draw(type, slice, lazy);

        this.DEBUG && console.log("qbd chart()", chart, qb_id, _qb, type, slice, lazy)
		return chart;
	},

	render: function() {
		_.each(qbd._qbd, function(_qb) {
			_qb.reset();
		});
	},

	_drawHeader: function(conf) {
		conf.$el = qbd._createContainerElement(conf, qbd.options.css.qbd)
		qbd.$el.append( conf.el );
        conf.$el.addClass(qbd.options.css.qbd);
		if (conf.header) {
			var $panel = $("<div/>").addClass(qbd.options.css.header || "header").html(conf.header)
            conf.$el.append( $panel )
		}
		return qbd;
	},

	_renderQBs: function(el) {
		$("[data-qb]",$(el)).each(function() {
			var slice = $(this).data();
			var qb_id = slice.qb;
			var qbd_qb = qbd.qb(qb_id)
			if (qbd_qb&&slice.type&&slice.measure&&slice.dimension) {
				slice.el = $(this)
				qbd_qb.draw(slice.type, slice);
			} else {
			    console.warn("invalid qb in DOM");
            }
		});
		return this;
	},

    element: function(conf) {
        if (conf.$el) {
            console.log("element ($el): %o -> %o", conf, typeof conf.el);
            return conf.$el;
        }
        if (_.isString(conf.el)) {
            console.log("element (el): %o -> %o", conf, typeof conf.el);
            return conf.$el = $(conf.el);
        }
        console.log("element (?): %o -> %o -> %o", conf, typeof conf.el, $(conf.el));
        return $(conf.el);
    },

    _createContainerElement: function(conf, selector) {
	    var $el = false;
        if (selector && _.isString(selector)) {
            $el = $(selector);
            console.log("container selector: %o -> %o", conf, selector, $el);
        } else {
            $el = this.element(conf);
            console.log("container element: %o -> %o", conf, $el);
        }

		if (!$el || !$el.length) {
		    var $old = $el;
			$el = $("<div/>");
			conf.id && $el.attr("id", conf.id);
            console.log("create dom container: %o -> %o -> %o", conf, $el, $old)
		} else {
            console.log("append dom container: %o -> %o", conf, $el)
        }
		return $el;
	},

	responseFormat: {
		"scorpio4": function(r) { return r.result },
		"data.gov.au": function(r) { return r.result.records }
	}
});
return function(options) {
    return qbd.init(options);
}

});
