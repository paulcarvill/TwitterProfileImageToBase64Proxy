var express = require('express');
var requestHandlers = require('./requestHandlers');

// create our server
var start = function() {
	var app = express.createServer(express.logger());
	app.set( "jsonp callback", true );

	// OUR ROUTES:

	// route for index page request
	app.get('/', requestHandlers.root);

	// respond to requests for a user id with that user's profile details
	// We do this by first making a request to the twitter API, grabbing
	// some data from the response, and then making a second request to
	// get the real image data
	app.get('/user/:id', requestHandlers.user);



	var port = process.env.PORT || 3000;
	app.listen(port, function() {
	  console.log("Listening on " + port);
	});
}

exports.start = start;