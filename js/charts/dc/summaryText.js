define(["underscore", "dc", "d3qb/js/chart" ], function (_, dc, chart) {
    /**
     * The summary text widget is a simple widget designed to display the number of records selected by the
     * current filters out of the total number of records in the data set. Once created the summary text widget
     * will automatically update the text content of child elements with the following classes:
     *
     * * `.total-count` - total number of records
     * * `.filter-count` - number of records matched by the current filters
     *
     * Note: this widget works best for the specific case of showing the number of records out of a
     * total. If you want a more general-purpose numeric display, please use the
     * {@link dc.numberDisplay} widget instead.
     *
     * Examples:
     * - {@link http://dc-js.github.com/dc.js/ Nasdaq 100 Index}
     * @class summaryText
     * @memberof dc
     * @mixes dc.baseMixin
     * @example
     * var ndx = crossfilter(data);
     * var all = ndx.groupAll();
     *
     * dc.summaryText('.dc-data-count')
     *     .dimension(ndx)
     *     .group(all);
     * @param {String|node|d3.selection} parent - Any valid
     * {@link https://github.com/d3/d3-3.x-api-reference/blob/master/Selections.md#selecting-elements d3 single selector} specifying
     * a dom block element such as a div; or a dom element or d3 selection.
     * @param {String} [chartGroup] - The name of the chart group this chart instance should be placed in.
     * Interaction with a chart will only trigger events and redraws within the chart's group.
     * @returns {dc.summaryText}
     */
    dc.summaryText = function (parent, chartGroup) {
        var _formatNumber = d3.format(',d');
        var _chart = dc.baseMixin({});
        var _html = {some: '', all: ''};

        /**
         * Gets or sets an optional object specifying HTML templates
         * @method html
         * @memberof dc.summaryText
         * @instance
         * @example
         * @param {{some:String, all: String}} [options]
         * @returns {{some:String, all: String}|dc.summaryText}
         */
        _chart.html = function (options) {
            if (!arguments.length) {
                return _html;
            }
            if (options.all) {
                _html.all = _.template(options.all);
            }
            if (options.some) {
                _html.some = _.template(options.some);
            }
            return _chart;
        };

        /**
         * Gets or sets an optional function to format the filter count and total count.
         * @method formatNumber
         * @memberof dc.summaryText
         * @instance
         * @see {@link https://github.com/d3/d3-3.x-api-reference/blob/master/Formatting.md d3.format}
         * @example
         * counter.formatNumber(d3.format('.2g'))
         * @param {Function} [formatter=d3.format('.2g')]
         * @returns {Function|dc.summaryText}
         */
        _chart.formatNumber = function (formatter) {
            if (!arguments.length) {
                return _formatNumber;
            }
            _formatNumber = formatter;
            return _chart;
        };

        _chart._doRender = function () {
console.log("render summary: %o %o %o", arguments, _chart);

            var total_rows = _chart.dimension().size();
            var summary_by_dimension = _chart.group().all();

            // how many are selected?
            var selected = 0;
            _.each(summary_by_dimension, function(v) { selected+=v.value.count; });
            var is_filtered = !(selected==total_rows);

            // render context
            var context = { dimensions: summary_by_dimension, total: total_rows, pretty_total: _formatNumber(total_rows), selected_total: selected };


            // render - template depends on whether filtering or not
            var _summary_html = is_filtered?_html.some(context):_html.all(context);
            console.log("summary: %o -> %s", context, _summary_html, _chart.root(), _chart.$el );
            _chart.root().html( _summary_html );

            return _chart;
        };

        _chart._doRedraw = function () {
            return _chart._doRender();
        };

        return _chart.anchor(parent, chartGroup);
    };
});