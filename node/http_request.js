Dr.Declare('Request', 'class');
Dr.Implement('Request', function (global, module_get) {
	var Http = Dr.require('http');
	
	var Module = function () {
		//
	};
	
	Module.prototype.init = function (callback, method, message, port, host_name) {
		this.callback = callback;
		this.method = method;
		this.message = message;
		this.port = port;
		this.host_name = host_name;
		
		this.is_active = false;
	};
	
	Module.prototype.start = function () {
		if (this.is_active) return;
		
		var options = {
			method: this.method,
			port: this.port,
			hostname: this.host_name,
		};
		
		var _this = this;
		var request = Http.request(options, function (response) {
			_this.onRespond(request, response);
		});
		
		request.on('error', function(error) {
			Dr.log('problem with request: ' + error.message);
		});
		
		if (this.method == 'POST') request.write(this.message || '');
		request.end();
		
		this.request = request;
		
		this.is_active = true;
		Dr.log('Request started at port', this.port, 'host_name', this.host_name);
	};
	
	Module.prototype.stop = function () {
		if (!this.is_active) return;
		this.request.abort();
		this.is_active = false;
		Dr.log('Request stopped');
	};
	
	Module.prototype.onRespond = function (request, response) {
		Dr.log('STATUS: ' + respond.statusCode);
		Dr.log('HEADERS: ' + JSON.stringify(respond.headers));
		
		var buffer = '';
		var _this = this;
		respond.addListener('data', function(chunk){
			//console.log('Get data', arguments);
			buffer += chunk;
		});
		respond.addListener('end', function(){
			//console.log('Get message', buffer.toString());
			_this.onRespondEnd(request, response, buffer);
		});
	};
	
	Module.prototype.onRespondEnd = function (request, response, buffer) {
		if (this.callback) {
			this.callback(request, response, buffer);
		}
		else {
			Dr.log(request, response, buffer.toString());
		}
	};
		
	Module.create = function (callback, port, host_name) {
		var instance = new Module;
		instance.init(callback, port, host_name);
		return instance;
	};
	
	return Module;
});