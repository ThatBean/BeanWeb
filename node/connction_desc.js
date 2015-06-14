require('./Dr.js');

var port = 54321;
var host_name = undefined;

var desc_pool = [];

Dr.loadLocalScript('./Dr.node.js', function () {
	Dr.loadScriptByList([
		'./module/server.js',
	], function () {
		Dr.LoadAll();
		Dr.log("All script loaded");
		
		var getDesc = function (request, request_message) {
			var host = request.headers.host;
			var id = request.httpVersion;
			desc_pool.unshift({
				'ID': Dr.generateId(),
				'DATE': Date(),
				'HTTP': {
					host: request.headers.host,
					httpVersion: request.httpVersion,
					rawHeaders: request.rawHeaders,
					rawTrailers: request.rawTrailers,
					method: request.method,
					url: request.url,
					statusCode: request.statusCode,
					statusMessage: request.statusMessage,
					data: request_message,
				},
				'NET': {
					address: request.socket.address(),
					remoteAddress: request.socket.remoteAddress,
					remoteFamily: request.socket.remoteFamily,
					remotePort: request.socket.remotePort,
					localAddress: request.socket.localAddress,
					localPort: request.socket.localPort,
				},
			})
			
			//pick latest 10 and return
			desc_pool.length = 20;
			
			var respond_message = '';
			
			for (var i in desc_pool) {
				respond_message += 'DESC[' + i + ']===============================\n';
				respond_message += JSON.stringify(desc_pool[i], null, '\t');
			}
			
			return respond_message;
		}
		
		var Server = Dr.Get('Server');
		
		var server = Server.create(function (request, response, buffer) {
			var request_message = buffer.toString();
			var respond_message = getDesc(request, request_message);
			response.writeHead(200, {
				'Content-Type': 'text/plain', 
				'Access-Control-Allow-Origin': '*',
			});
			response.write(respond_message);
			response.end();
		}, port, host_name);
		
		server.start();
		
		//Dr.startREPL();
	});
});