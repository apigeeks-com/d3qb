var _ = require("lodash");
var express = require('express');
var bodyParser = require('body-parser');
var assert = require("assert");
var path = require("path");

var cwd = __dirname;
var app = express();

var qb_js = path.join(cwd, '/../');

app.use(bodyParser.json());

var static_options = { redirect: false };

app.use('/bower_components/meta4qb/', express.static( qb_js, static_options ) );
app.use('/bower_components/', express.static( path.join(qb_js, 'bower_components'), static_options) );
app.use('/data', express.static(__dirname +'/data/', static_options) );
app.use(express.static(__dirname +'/www'));

var port = process.env.PORT | 3002
app.listen(port, function () {
  console.log('[meta4qb] app port: %s -> %s -> %s',port, cwd, qb_js);
});


