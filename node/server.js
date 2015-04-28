var http = require('http');
var url = require('url');
var util = require('util');

var port = 888;

http.createServer(function (request, response) {
	//console.log('Get request', request.url, request.method);
	
	request_info = url.parse(request.url, true);
	
	var buffer = '';
	
	request.addListener('data', function(chunk){
		//console.log('Get data', arguments);
		buffer += chunk;
	});
	request.addListener('end', function(){
		//console.log('Get end', arguments);
		//console.log('Get message', buffer.toString());
		
		sendRespond();
	});
	
	function sendRespond () {
		response.writeHead(200, {
			'Content-Type': 'text/plain', 
			'Access-Control-Allow-Origin': '*',
		});
		
		response.write('request_info:');
		response.write(util.inspect(request_info));
		
		response.write('\n');
		
		response.write('url:');
		response.write(request.url);
		
		response.write('\n');
		
		response.write('method:');
		response.write(request.method);
		
		response.write('\n');
		
		response.write('message:');
		response.write(buffer.toString());
		
		response.write('\n');
		
		response.write('additional:');
		response.write('hello world');
		
		response.end();
	}
}).listen(port);

console.log('Server running at port:' + port);