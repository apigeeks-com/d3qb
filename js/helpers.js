define(["underscore"], function (_) {

    var convert_percent = function(w, type) {
        if (w>0) return w;
        var size_fn = $(document)[type];
        if (!size_fn) throw "invalid '"+type+"' property"
        var max_w = size_fn();
        var p_ix = w.indexOf("%");
        if (p_ix>0) {
            return max_w * parseInt(p_ix.substring(0,p_ix))/100;
        }
        return parseInt(w);
    };

    var jQueryElement = function(conf) {
        if (_.isString(conf)) {
            console.log("element ($): %o", $(conf) );
            return $(conf);
        }

        if (conf.$el) {
            console.log("element ($el): %o -> %o", conf, typeof conf.el);
            return conf.$el;
        }
        if (_.isString(conf.el)) {
            console.log("element (el): %o -> %o", conf, typeof conf.el);
            conf.$el = $(conf.el);
            return conf.$el;
        }
        console.log("element (?): %o -> %o -> %o", conf, typeof conf.el, $(conf.el));
        return $(conf.el);
    };


    var createDOMElement = function(conf, selector, dom_type) {
        var $el = false;
        if (selector && _.isString(selector)) {
            $el = $(selector);
            console.log("container selector: %o -> %o", conf, selector, $el);
        } else {
            $el = jQueryElement(conf);
            console.log("container element: %o -> %o", conf, $el);
        }
       dom_type = dom_type || "div";

        if (!$el || !$el.length) {
            var $old = $el;
            $el = $("<"+dom_type+"/>");
            conf.id && $el.attr("id", conf.id);
            console.log("create <%s>: %o -> %o -> %o", dom_type, conf, $el, $old)
        } else {
            console.log("append <%s>: %o -> %o", dom_type, conf, $el)
        }
        return $el;
    }
    return  {
        $: jQueryElement,
        convert_percent: convert_percent,
        createDOMElement: createDOMElement,
        jQueryElement: jQueryElement
    }

});
