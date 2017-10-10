define(["underscore"], function(_) {

    return function(options, qb) {
        options = _.defaults(options, { decimalPlaces: 2 });

        return {
            key:  function (r) {
                return r.key;
            },
            keyDate:  function (r) {
                return qb.as.date(r, "key");
            },
            value:  function (r) {
                return r.value;
            },
            number:  function (r) {
                return parseFloat(r.value).toFixed(options.decimalPlaces);
            },
            total:  function (r) {
                return parseFloat(r.value ? r.value.total : 0).toFixed(options.decimalPlaces);
            },
            count:  function (r) {
                return r.value ? r.value.count : 0;
            },
            average:  function (r) {
                return parseFloat(r.value ? r.value.average : 0).toFixed(options.decimalPlaces);
            },
            min:  function (r) {
                return r.value ? r.value.min : 0;
            },
            max:  function (r) {
                return r.value ? r.value.max : 0;
            }
        }
    }

});