var Http = require('http');

var options = {
	hostname: 'www.thatbean.com',
	port: 888,
	method: 'POST',
};

var request = Http.request(options, function(respond) {
	console.log('STATUS: ' + respond.statusCode);
	console.log('HEADERS: ' + JSON.stringify(respond.headers));
	
	var buffer = '';
	respond.addListener('data', function(chunk){
		console.log('Get data', arguments);
		buffer += chunk;
	});
	respond.addListener('end', function(){
		console.log('Get end', arguments);
		console.log('Get message', buffer.toString());
		
		
	});
});

request.on('error', function(error) {
	console.log('problem with request: ' + error.message);
});

// write data to request body
request.write('Test Message\n');
request.write('Test Data\n');
request.end();