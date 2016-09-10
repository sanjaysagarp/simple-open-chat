"use strict";

var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var config = require('./config/config');
var glob = require('glob');

var app = express();

app.set('views', config.root + 'app/views');
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(config.root + '/public'));

app.use(function removeTrailingSlashes(req, res, next) {
	var url = req.url;
	if (url.substring(url.length- 1, url.length) == '/' && url.length > 1) {
		console.log('removed trailing slash');
		res.redirect(301, url.substring(0, url.length - 1));
	} else {
		next();
	}
});

var controllers = glob.sync(config.root + '/app/controllers/*.js');
controllers.forEach(function(controller) {
	require(controller)(app);
});

app.listen(80, function() {
	console.log('server is listening...'); 
});