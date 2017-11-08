define(["underscore", "dc"], function (_, dc) {

    // chart type definition

    return function(qb, defaults) {

        return {
            title: "Multiline Chart",

            create: function(el, slice) {

                //var chart = dc.seriesChart(el, qb.id);
                var chart = dc.compositeChart(el, qb.id);

        		    slice = qb.chart._configure(chart, "multiline", slice);

                var data = qb.data;

                // using series
                /*
                var dimension = data.dimension(function (d){return [d.bcsrgrp, d.incyear]; });
                var group = dimension.group().reduceSum(function(d){return d.poi_age});
                */
                // using composites

                // REVIEW: too opinionated. must be configurable
                var colors = [
                  "#04ada6", "#00a9e3", "#002563", "#752e87",
                  "#d31e3a", "#f48145", "#f9bc20"
                ];
                var categories = [];
                var last = null;
                var i = 0;

                // REVIEW: too opionated. assumes a fixed data structure
                // REVIEW: need a more thoughtful implementation
                for (var x = 0; x < qb.raw.length; x++) {
                  if (!categories[i])
                    categories[i] = [];
                  categories[i].push(qb.raw[x]);
                    // REVIEW: too opionated. assumes a fixed data structure
                  if (last && last != qb.raw[x].bcsrgrp)
                    i++;
                    // REVIEW: too opionated. assumes a fixed data structure
                  last = qb.raw[x].bcsrgrp;
                }
                for (x = 0; x < categories.length; x++) {
                    for (y = x + 1; y < categories.length;) {
                        // REVIEW: too opionated. assumes a fixed data structure
                      if (categories[y][0].bcsrgrp == categories[x][0].bcsrgrp) {
                           categories[x].concat(categories[y]);
                           categories.splice(y, 1);
                         }
                      else
                       y++;
                    }
                }

                // REVIEW: need a more thoughtful implementation
                var composites = [];
                var charts = [];
                for (x = 0, y = 0; x < categories.length; x++) {
                  composite = {};
                  composite.data = crossfilter();

                    // REVIEW: too opionated. assumes a fixed data structure
                  composite.data.add(categories[x].map(function(d) {
                        return {x: +d.incyear, y2:0, y1: d.poi_age};
                  }));
                  composite.dimension =
                      composite.data.dimension(dc.pluck('x'));
                  composite.group =
                      composite.dimension.group().reduceSum(dc.pluck('y1'));
                  composites.push(composite);

                    // REVIEW: too opinionated. assumes a fixed data structure
                  charts.push(
                    dc.lineChart(chart)
                      .group(composite.group, categories[x][0].bcsrgrp)
                      .dimension(composite.dimension)
                      .colors(colors[y])
                    );
                  y = y + 1 >= colors.length ? 0 : y + 1;
                }
                //var dimension = slice.dimension;


                chart.legend(dc.legend().horizontal(true)
                                        .x(0).y(350)
                                        .itemHeight(13)
                                        .autoItemWidth(true)
                                        .gap(20));

//                slice.mouseZoomable && chart. mouseZoomable(slice.mouseZoomable);

                if (slice.ordinal) {
                    chart.x(d3.scale.ordinal()).elasticX(slice.elasticX).xUnits(dc.units.ordinal)
                } else {
                    chart.x(d3.scale.linear().nice()).elasticX(slice.elasticX);
                }

                chart.y(d3.scale.linear().nice()).elasticY(slice.elasticY);
                //chart.renderArea(slice.renderArea);

                // REVIEW: too opionated. must be configurable
                chart.ordinalColors(["#56B2EA","#E064CD","#F8B700","#78CC00","#7B71C5"]);

                // Can't draw dots unless brushOn is off
                chart.brushOn(/*slice.brushOn*/true);
                //chart.dotRadius(slice.dotRadius);
                //chart.renderDataPoints(true);
                chart.renderHorizontalGridLines(true);
                chart.transitionDuration(0);

                // using series
                /*
                chart.seriesAccessor(function(d) {return "bcsrgrp: " + d.value.count;});
                chart.chart(function(c) { return dc.lineChart(c); })
                //chart.dimension(dimension);
                chart.dimension(slice.dimension);
                //chart.group(group);
                chart.group(slice.group);
                */

                // using composite
                chart.compose(charts);

                // REVIEW: too opionated !
                if (slice.by == "incyear")
                  chart.xAxis().ticks(10).tickFormat(d3.format("d"));

                // I should be getting those from meta columns instead
                chart.xAxisLabel(slice.xLabel);
                chart.yAxisLabel(slice.yLabel);

                //.interpolate('step-before')
                // .clipPadding(slice.clipPadding)

                chart.on('renderlet', function (chart)
                {
                    chart.selectAll("text.y-axis-label.y-label")
                      .attr("transform", "rotate(0)," +
                                         "translate(45, 10)");
                    chart.selectAll("text.x-axis-label")
                      .attr("transform", "translate(30, "+(chart.height()-10)+")");
                    chart.selectAll("g.axis.y")
                      .attr("transform", "translate(50, 25)");
                    chart.selectAll(".grid-line line")
                      .attr("x1", "-80");
                    chart.select("g.axis.y .tick")
                      .attr("style", "opacity:0;");
                });
                return chart;
            },

            defaults: _.extend(defaults, {
                aspectRatio: 800/400,
                width: 800, height: 400,
                renderDataPoints: true,
                renderArea: true,
                brushOn: false,
                elasticX: true,
                elasticY: true,
                mouseZoomable: true,
                dotRadius: 10,
            })

        }
    }

});
