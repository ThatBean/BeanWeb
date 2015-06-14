require('./Dr.js');

//TCP_hole_punching

var global_args = process.argv;

var node_exe = global_args[0];
var script_file = global_args[1];
var connection_type = global_args[2];	//'server' 'client'
var connection_server_address = global_args[3];	//client only, the server url
var connection_server_port = global_args[4];	//client only, the server url

var default_port = connection_type == 'server' ? 54321 : 12345;
var default_host_name = undefined;

var desc_pool = {};

Dr.loadLocalScript('./Dr.node.js', function () {
	Dr.loadScriptByList([
		'./module/server.js',
	], function () {
		Dr.LoadAll();
		Dr.log("All script loaded");
		
		//page function
		var createHttpRequest = (function (url, message, finish_callback) {
			var xml_http = new XMLHttpRequest();
			if (!xml_http) return;
			xml_http.onreadystatechange= function () { if (xml_http.readyState == 4 && xml_http.status==200) finish_callback(xml_http, xml_http.responseText || xml_http.responseXML); };
			xml_http.open('POST', url, true);
			xml_http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			xml_http.send(message);
			return xml_http;
		}).toString();
		var changeTo = (function (url) { window.location.href = url; }).toString();
		var comboFunc = (function (address, port) { 
			createHttpRequest(
				window.location.href, 
				JSON.stringify({ address: address, port: port }), 
				function () { changeTo('http://' + address + ':' + port); }); 
		}).toString();
		//page function
		
		
		var recordDesc = function (request, request_message) {
			var host = request.headers.host;
			var id = request.httpVersion;
			var desc = {
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
			};
			
			Dr.log('Get Desc:', desc.ID, desc.NET.remoteAddress, desc.NET.remotePort);
			//pick latest 10 and return
			desc_pool[desc.NET.remoteAddress + ':' + desc.NET.remotePort] = desc;
		}
			
		var getDescPage = function () {
			var respond_message = '<html>';
			
			respond_message += '<script type="text/javascript">';
			respond_message += 'var createHttpRequest = ' + createHttpRequest + ';\n';
			respond_message += 'var changeTo = ' + changeTo + ';\n';
			respond_message += 'var comboFunc = ' + comboFunc + ';\n';
			respond_message += '</script>\n';
			
			respond_message += '<b>This is ' + connection_type + '</b>\n';
			respond_message += '<pre>';
			for (var i in desc_pool) {
				var link_address = desc_pool[i].NET.remoteAddress;
				var link_port = desc_pool[i].NET.remotePort;
				respond_message += 'DESC[' + i + ']===============================\n';
				respond_message += '' + '<button onclick="comboFunc(\'' + link_address + '\', \'' + link_port + '\')">LINK:[' + link_address + ':' + link_port + ']</button>' + '\n';
				
				respond_message += JSON.stringify(desc_pool[i], null, '\t');
			}
			respond_message += '</pre>\n';
			
			respond_message += '</html>\n';
			return respond_message;
		}	
		
		var notifyConnection = function (address, port, message, callback) {
			var Http = Dr.require('http');
			var request = Http.request({
				hostname: address,
				port: port,
				method: message ? 'POST' : 'GET',
				keepAlive: true,
				headers: {
					'Content-Type': 'text/plain', 
					'Access-Control-Allow-Origin': '*',
				},
			}, callback);
			if (message) request.write(message);
			request.end();
			Dr.log('-- request sent', address, port, message);
		}	
		
		if (connection_type == 'client') {
			Dr.log('Register Client');
			notifyConnection(connection_server_address, connection_server_port, 'Register Client', function (response) {
				Dr.log('STATUS: ' + response.statusCode);
				Dr.log('HEADERS: ' + JSON.stringify(response.headers));
				response.setEncoding('utf8');
				response.on('data', function (chunk) {
					Dr.log('BODY: ' + chunk);
				});
				
				Dr.log('Get Client Registered');
				Dr.log(arguments);
			});
		}
		
		var Server = Dr.Get('Server');
		
		var server = Server.create(function (request, response, buffer) {
			var request_message = buffer.toString();
			
			var respond_message = '';
			if (connection_type == 'server') {
				recordDesc(request, request_message);
				respond_message = getDescPage();
				response.writeHead(200, {
					'Content-Type': 'text/html', 
					'Access-Control-Allow-Origin': '*',
				});
				response.write(respond_message);
				response.end();
			}
			if (connection_type == 'client') {
				if (request_message) {
					var connection_info = JSON.parse(request_message);
					notifyConnection(connection_info.address, connection_info.port, 'Hole Punching', function () {
						Dr.log('Get Hole Punched');
						Dr.log(arguments);
					});
				}
				recordDesc(request, request_message);
				respond_message = getDescPage();
				response.writeHead(200, {
					'Content-Type': 'text/html', 
					'Access-Control-Allow-Origin': '*',
				});
				response.write(respond_message);
				response.end();
			}
		}, default_port, default_host_name);
		
		server.start();
		
		//Dr.startREPL();
	});
});