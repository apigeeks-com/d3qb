define(["underscore",
    "d3qb/js/charts/bar",
    "d3qb/js/charts/bubble",
    "d3qb/js/charts/column",
    "d3qb/js/charts/count",
    "d3qb/js/charts/dates",
    "d3qb/js/charts/donut",
    "d3qb/js/charts/dropdown",
    "d3qb/js/charts/geo",
    "d3qb/js/charts/grid",
    "d3qb/js/charts/line",
    "d3qb/js/charts/multi-line",
    "d3qb/js/charts/geo-choropleth",
    "d3qb/js/charts/pie",
    "d3qb/js/charts/row",
    "d3qb/js/charts/scatter",
    "d3qb/js/charts/series",
    "d3qb/js/charts/summary",
    "d3qb/js/charts/table",
    "d3qb/js/charts/time"
], function (_, Bar, Bubble, Column, Count, Dates, Donut, DropDown, Geo, Grid, Line, MultiLine, GeoChoropleth, Pie, Row, Scatter, Series, SummaryText, Table, Time) {

    return function(qb) {
        console.log("Chart Factory: %o", qb);

        var defaults = {
            width: 192, height: 192,
            renderArea: true, renderLabel: true, renderTitle: true,
            elasticY: true, elasticX: true, margins: {top: 15, right: 15, bottom: 15, left: 15},
            brushOn: true, transitionDuration: 500,
            required: [ "dimension", "measure", "reducer", "type" ],
            colors: ['#ccc', '#E2F2FF', '#C4E4FF', '#9ED2FF', '#81C5FF', '#6BBAFF', '#51AEFF', '#36A2FF', '#1E96FF', '#0089FF', '#0061B5'],
        };

        return {
            bar: new Bar(qb, defaults),
            bubble: new Bubble(qb, defaults),
            column: new Column(qb, defaults),
            count: new Count(qb, defaults),
            donut: new Donut(qb, defaults),
            dropdown: new DropDown(qb, defaults),
            geo: new Geo(qb, defaults),
            grid: new Grid(qb, defaults),
            line: new Line(qb, defaults),
            multiline: new MultiLine(qb, defaults),
            geoChoropleth: new GeoChoropleth(qb, defaults),
            pie: new Pie(qb, defaults),
            row: new Row(qb, defaults),
            scatter: new Scatter(qb, defaults),
            series: new Series(qb, defaults),
            summary: new SummaryText(qb, defaults),
            table: new Table(qb, defaults),
            time: new Time(qb, defaults)
        }
    }
});
