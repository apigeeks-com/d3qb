define(["underscore", "dc"], function (_, dc) {

    // chart type definition


    return function(qb, defaults) {

        return {
            title: "Geo Choropleth Chart",

            create: function(el, slice) {
                var chart = dc.geoChoroplethChart(el, qb.id);
                //var chart = dc.geoChoroplethChart("#aus-map");
                var slice = qb.chart._configure(chart, "geoChoropleth", slice);

                //d3.json("data/aus-states.json", function(statesJson) {

                // REVIEW: very opinionated.
                // REVIEW: a more thoughtful implementation is required.
                // REVIEW: see geo.js for an approach

                var statesJson;
                $.ajax({ url: 'data/aus-states.json',
                    async: false,
                    dataType: 'json',
                    success: function(data) {
                        statesJson = data;
                    }
                });
                console.log(statesJson);

                // chart.height(slice.height);
                // chart.width(slice.width);

                // chart.dimension(slice.dimension);
                // chart.group(slice.group);

                //chart.colorDomain([0, 200]);

                //REVIEW: too opinionated. ensure it's externally configurable.
                chart.colors(d3.scale.quantize().range(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"]))
                //chart.colors(["#56B2EA","#E064CD","#F8B700","#78CC00","#7B71C5"]);

                //REVIEW: too opinionated. default color should be configurable.
                chart.colorCalculator(function (d) { return d ? usChart.colors()(d) : '#ccc'; });

                chart.title(function(d) {
                    return d.key + " : " + (d.value ? d.value : 0);
                });

                // REVIEW: too opinionated: "state" is not a constant.
                // REVIEW: no sanity checking of NULL statesJson.
                // REVIEW: is "features" key a constant?
                chart.overlayGeoJson(statesJson.features, "state",
                    function(d) {
                        // REVIEW: too opionated
                        return d.properties.STATE_NAME;
                    });

                // REVIEW: is mercator the only projection?
                chart.projection(d3.geo.mercator() .scale(500).translate([-850, -100]));

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
