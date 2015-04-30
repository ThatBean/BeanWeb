Dr.Declare('Server', 'class');
Dr.Implement('Server', function (global, module_get) {
	var Http = Dr.require('http');
	var Url = Dr.require('url');
	var Util = Dr.require('util');
	
	var Module = function () {
		//
	};
	
	Module.prototype.init = function (callback, port, host_name) {
		this.callback = callback;
		this.port = port;
		this.host_name = host_name;
		this.is_server_active = false;
		
		var _this = this;
		this.server = Http.createServer(function (request, response) {
			_this.onRequest(request, response);
		});
		
	};
	
	Module.prototype.start = function () {
		if (this.is_server_active) return;
		this.server.listen(this.port, this.host_name);
		this.is_server_active = true;
		Dr.log('Server running at port', this.port, 'host_name', this.host_name);
	};
	
	Module.prototype.stop = function () {
		if (!this.is_server_active) return;
		this.server.close();
		this.is_server_active = false;
		Dr.log('Server stopped');
	};
	
	Module.prototype.onRequest = function (request, response) {
		var request_info = Url.parse(request.url, true);
		var buffer = '';
		
		var _this = this;
		request.addListener('data', function(chunk){
			//console.log('Get data', arguments);
			buffer += chunk;
		});
		request.addListener('end', function(){
			//console.log('Get end', arguments);
			//console.log('Get message', buffer.toString());
			_this.onRequestEnd(request, response, buffer);
		});
	};
	
	
	Module.prototype.onRequestEnd = function (request, response, buffer) {
		if (this.callback) {
			this.callback(request, response, buffer);
			//force end the response pending
			response.end();
		}
		else {
			response.writeHead(200, {
				'Content-Type': 'text/plain', 
				'Access-Control-Allow-Origin': '*',
			});
			
			response.write('request_info:');
			response.write(Util.inspect(request_info));
			
			
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
			response.end();
		}
	};
	
	
	Module.create = function (callback, port, host_name) {
		var instance = new Module;
		instance.init(callback, port, host_name);
		return instance;
	};
	
	return Module;
});