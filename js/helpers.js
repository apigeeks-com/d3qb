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
    }

    return  {
        convert_percent: convert_percent
    }

});
