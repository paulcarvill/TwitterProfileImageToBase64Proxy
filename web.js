// https://devcenter.heroku.com/articles/nodejs

var express = require('express');

var app = express.createServer(express.logger());
app.set( "jsonp callback", true );

app.get('/', function(request, response) {
  response.send('Hello paul!');
});

app.get('/user/:id', function(request, mainResponse){
	
	var http = require('http');
	var client = http.createClient(80, 'api.twitter.com');
	var request = client.request("GET", "/1/users/profile_image?screen_name="+request.params.id+"&size=bigger", {"host": "api.twitter.com"});

	request.addListener("response", function (response) {
		var body = "";

        response.addListener("data", function (data) {

        });

        response.addListener("end", function (end) {
			
			getProfilePic(response.headers.location, function(x){ 
				mainResponse.json({ img: x });
			});
        });
	});
	request.end();
	
	// parse an image into base64 and return it
	function getProfilePic( picUrl, callback ){
		var URL = require('url');
		var sURL = picUrl;
		var oURL = URL.parse(sURL);
		var http = require('http');
		var client = http.createClient(80, oURL.hostname);
		var request = client.request('GET', oURL.pathname, {'host': oURL.hostname});
		request.end();

		request.on('response', function (response) {
		    var type = response.headers["content-type"];
			var prefix = "data:" + type + ";base64,";
			var body = "";

		    response.setEncoding('binary');
		    response.on('end', function () {
		        var base64 = new Buffer(body, 'binary').toString('base64');
		        var data = prefix + base64;
				return callback(data);
		    });
		    response.on('data', function (chunk) {
		        if (response.statusCode == 200) body += chunk;
		    });
		});
	}

});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});