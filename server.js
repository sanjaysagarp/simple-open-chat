"use strict";

var express = require('express'),
	logger = require('morgan'),
	bodyParser = require('body-parser'),
	routes = require('./routes'),
	//socket = require('./routes/socket.js'),
	config = require('./config/config'),
	http = require('http');

var app = module.exports = express();

var server = http.createServer(app);

// hooks socket.io to express
//var io = require('socket.io').listen(server);

app.set('views', config.root + '/views');
app.set('view engine', 'jade');
app.set('view options', {
	layout: false
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(config.root + '/public'));
app.use(logger('dev'));

app.use(function removeTrailingSlashes(req, res, next) {
	var url = req.url;
	if (url.substring(url.length- 1, url.length) == '/' && url.length > 1) {
		console.log('removed trailing slash');
		res.redirect(301, url.substring(0, url.length - 1));
	} else {
		next();
	}
});

// Routes

app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// Socket.io Communication

//io.sockets.on('connection', socket);

server.listen(80, function() {
	console.log('server is listening...'); 
});