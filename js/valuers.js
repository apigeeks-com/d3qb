define(["underscore"], function(_) {

    return function(qb,options) {

        options = _.defaults({
            decimalPlaces: 2,
            labels: _.extend({
                weekOrWeekend: ["week", "weekend"],
                daysOfWeek: ["Mon", "Tues", "Web", "Thur", "Fri", "Sat", "Sun"],
                monthsOfYear: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            })
        });

        var as = {
            value: 	function(model, meta) { return model[meta] },
            lookup: function(model, meta) { return options.labels[meta][model[meta]] },
            number: function(model, meta) { return ( model[meta]?parseFloat(model[meta]):0 ).toFixed(options.decimalPlaces) },
            date: 	function(model, meta) { return Date.parse(model[meta]) },
            day:	function(model, meta) { return Date.parse(model[meta]).getDay() },
            month: 	function(model, meta) { return options.labels.monthsOfYear[as.date(model, meta).getMonth()] },
            year: 	function(model, meta) { var y = new Date(model[meta]); return 1900+y.getYear() },
            week: 	function(model, meta) { return as.date(model, meta).getWeek() },
            dayOfWeek:	function(model, meta) { return options.labels.daysOfWeek[as.day(model, meta)] },
            weekOrWeekend:	function(model, meta) {
                var d = as.day(model, meta);
                return options.labels.weekOrWeekend[d>0&&d<6?0:1]
            }
        }

        return as;
    }

});