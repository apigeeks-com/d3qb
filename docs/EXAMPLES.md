Examples
========

A Yaml-based example for clarity. The current implementation only supports JSON.

	el: "#qb-container"
	url: "/data/nsw_gov_crime_poi.json"
	colors: orange
	charts:
	- disabled: false
	  width: 330
	  height: 600
	  header: Age by Suburb
	  type: row
	  showControls: false
	  renderHorizontalGridLines: false
	  renderVerticalGridLines: false
	  valueAccessor: count
	  measure: poi_age
	  dimension: locsurb
	- debug: true
	  width: 200
	  height: 200
	  header: Incident Type
	  type: row
	  gap: 5
	  renderLabel: true
	  valueAccessor: count
	  measure: poi_age
	  dimension: bcsrgrp
	- disabled: false
	  width: 200
	  height: 200
	  header: POI Gender
	  type: donut
	  valueAccessor: count
	  measure: poisex
	  labels:
		M: Male
		F: Female
		'': Unknown
	  dimension: poisex
	- el: "#count_summary"
	  disabled: false
	  width: 800
	  height: 400
	  header: Fact
	  type: count
	  measure: poi_age
	  dimension: incyear
	- width: 350
	  height: 200
	  header: Incidents by Year
	  type: row
	  gap: 5
	  margins:
		left: 50
	  valueAccessor: count
	  measure: poi_age
	  dimension: incyear
	- disabled: false
	  width: 760
	  height: 350
	  header: Monthly Incidents
	  type: bar
	  ordinal: true
	  margins:
		left: 60
	  y:
		label: Number of incidents
	  valueAccessor: count
	  measure: poisex
	  dimension: incmonth
	- disabled: true
	  width: 200
	  height: 200
	  header: Price
	  type: row
	  valueAccessor: average
	  measure: locsurb
	  dimension: bcsrgrp




