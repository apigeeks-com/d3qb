if (top != self) { top.location.replace(self.location.href); }

// setup the require.js configuration
// define the paths for common 3rd party libraries
// meta4 specific

require.config({
    baseUrl: "/bower_components/",
    waitSeconds: 10,
    paths: {
        jquery: "/bower_components/jquery/dist/jquery.min",
        underscore: "/bower_components/underscore/underscore",
        bootstrap: "/bower_components/bootstrap/bootstrap",
        marionette: "/bower_components/backbone.marionette/lib/backbone.marionette",

        backbone: "/bower_components/backbone/backbone",

// QB
        colorbrewer: "/bower_components/colorbrewer/colorbrewer",
        crossfilter: "/bower_components/crossfilter/crossfilter.min",
        crossfilter2: "/bower_components/crossfilter2/crossfilter.min",
        moment: "/bower_components/moment/moment",
        datepicker: "/bower_components/datepicker/js/bootstrap-datepicker",

        dc: "/bower_components/dcjs/dc",
        d3: "/bower_components/d3/d3",

        defaults: "defaults",
        qb: "d3qb/js/qb",
        qbs: "d3qb/js/qbs",
        qbd: "d3qb/js/qbd"

    },
    wrapShim: true,
    shim : {
        underscore : {
            exports : '_'
        },
        "crossfilter": {
            exports : 'crossfilter'
        },
        "colorbrewer": {
            exports : 'colorbrewer'
        },
        "d3": {
            deps : ['underscore'],
            exports : 'd3'
        },
        "dc": {
            deps : [ 'd3', 'colorbrewer', 'crossfilter'],
            exports : 'dc'
        },
        marionette : {
            deps : ['jquery', 'underscore', 'backbone'],
            exports : 'Marionette'
        }

    }
});
requirejs(["qbd"], function(qbd) {

    console.log("Started: %o", qbd);

    var meta = {
        columns: [
            {
                id: "bcsrgrp",
                label: "Crime",
                dimenion: true
            },
            {
                id: "incyear",
                label: "Incident Yr",
                dimenion: true
            },
            {
                id: "incmonth",
                label: "Incident Month",
                dimenion: true
            },
            {
                id: "bcsrgclat",
                label: "Geo Lat",
                geo: "lat"
            },
            {
                id: "bcsrgclng",
                label: "Geo Lon",
                geo: "lon"
            },
            {
                id: "locsurb",
                label: "Suburb",
                dimenion: true
            },
            {
                id: "poi_age",
                label: "Age",
                measure: true
            },
            {
                id: "poi_sex",
                label: "Gender",
                dimension: true
            }
        ]

    }

    new qbd({
        debug: true,
        qbd: [{
            el: "#qb-container",
            url: "/data/nsw_gov_crime_poi.json",
            //url: "http://mvp.apigeeks.com:8529/" +
            //    "_db/lab-dashboards/dashboards/samples",
            colors: "red",
            charts: [
            {
                "disabled": false,
                "width": 800, "height": 300,
                "header": "Incidents by Suburb",
                "type": "geoChoropleth",
                "showControls": true,
                "renderHorizontalGridLines": false,
                "renderVerticalGridLines": false,
                "valueAccessor": "count",
                "measure": "incyear",
                "dimension": "locsurb"
            },
            /*
            {
                "width": 1020, "height": 350,
                "header": "By Year",
                "type": "line",
                "margins": {
                    "left": 80
                },
                "valueAccessor": "count",
                "measure": "poi_age",
                "dimension": "incyear",
                "xLabel": "Year",
                "yLabel": "Incidents",
            },
            {
                "width": 465, "height": 350,
                "header": "By Gender",
                "type": "donut",
                "valueAccessor": "count",
                "measure": "poisex",
                "dimension": "poisex",
                "radius" : "170",
                "innerRadius" : "0",
                //"renderLegend" : "true",
                "labels": {
                    "M": "Male",
                    "F": "Female",
                    "O": "Other",
                    "U": "Unknown",
                    "": "Not Specified"
                },
            },

            {
                "disabled": false,
                "width": 465, "height": 350,
                "header": "By Day of the Week",
                "type": "bar",
                "gap": 15,
                "ordinal": true,
                "renderLabel" : true,
                "margins": {
                    "left": 40
                },

                //"y": {
                //    "label": "Number of incidents"
                //},
                "valueAccessor": "count",
                "measure": "count",
                "dimension": "incday"
            },
            {
                "el": "#count_summary",
                "disabled": false,
                "header": "Fact",
                "type": "count",
                "measure": "poi_age",
                "dimension": "incyear",
            },
            {
                "el": "#average",
                "disabled": false,
                "type": "count",
                "measure": "poi_age",
                "dimension": "incyear",
            },
            {
                "el": "#trend",
                "disabled": false,
                "type": "count",
                "measure": "poi_age",
                "dimension": "incyear",
            },
            {
                "el": "#highest",
                "disabled": false,
                "type": "count",
                "measure": "poi_age",
                "dimension": "incyear",
            },
            {
                "el": "#lowest",
                "disabled": false,
                "type": "count",
                "measure": "poi_age",
                "dimension": "incyear",
            },*/
            /*
                {
                    "disabled": false,
                    "width": 330, "height": 653,
                    "header": "Age by Suburb",
                    "type": "row",
                    "showControls": true,
                    "renderHorizontalGridLines": false,
                    "renderVerticalGridLines": false,
                    "valueAccessor": "count",
                    "measure": "poi_age",
                    "dimension": "locsurb"
                },
                {
                    "debug": false,
                    "width": 200, "height": 200,
                    "header": "Incident Type",
                    "type": "row",
                    "gap": 1,
                    "renderLabel": true,
                    "valueAccessor": "count",
                    "measure": "poi_age",
                    "dimension": "bcsrgrp",
                    "class": "col-sm-3"
                },
                {
                    "disabled": false,
                    "width": 200, "height": 200,
                    "header": "POI Gender",
                    "type": "donut",
                    "valueAccessor": "count",
                    "measure": "poisex",
                    "labels": {
                        "M": "Male",
                        "F": "Female",
                        "": "Unknown"
                    },
                    "dimension": "poisex"
                },
                {
                    "el": "#count_summary",
                    "disabled": false,
                    "width": 800, "height": 400,
                    "header": "Fact",
                    "type": "count",
                    "measure": "poi_age",
                    "dimension": "incyear",
                },
                {
                    "width": 256, "height": 200,
                    "header": "Incidents by Year",
                    "type": "row",
                    "gap": 1,
                    "margins": {
                        "left": 20
                    },
                    "valueAccessor": "count",
                    "measure": "poi_age",
                    "dimension": "incyear"
                },
                {
                    "disabled": false,
                    "width": 718, "height": 350,
                    "header": "Monthly Incidents",
                    "type": "bar",
                    "gap": 1,
                    "ordinal": true,
                    "margins": {
                        "left": 70
                    },
                    "y": {
                        "label": "Number of incidents"
                    },
                    "valueAccessor": "count",
                    "measure": "poisex",
                    "dimension": "incmonth"
                },
                {
                    "disabled": true,
                    "width": 200, "height": 200,
                    "header": "Price",
                    "type": "row",
                    "valueAccessor": "average",
                    "measure": "locsurb",
                    "dimension": "bcsrgrp"
                }
                */
            ]
        }]
    });

});
