require('./Dr.js');

//TCP_hole_punching

var global_args = process.argv;

var node_exe = global_args[0];
var script_file = global_args[1];
var connection_type = global_args[2];	//'server' 'client'
var connection_server_address = global_args[3];	//client only, the server address

var default_udp_port = 54321;
var default_tcp_port = 12345;
var default_host_name = undefined;

var desc_pool = {};
var connection_pool = {};

var client_status = {
	ack: false,
	local_location: {},
	connection: {},
};

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
var punchWebSocket = (function (address, port, callback) {
	var web_socket = new WebSocket('ws://' + address + ':' + port);
	web_socket.onopen = function() {
		console.log('WebSocket Opened');
		web_socket.send(JSON.stringify({
			operation: 'ack',
			from: {
				address: window.location.host,
				port: window.location.port,
			},
			test_message: 'Web Punch!!!',
		}));
	};
	web_socket.onmessage = function(event) { 
		console.log(event.data);
		if (event.data.search('ack') != -1) {
			web_socket.close();
			callback();
		}
	};
	web_socket.onclose = function(event) { console.log('WebSocket Closed', event); };
	web_socket.onerror = function(event) { console.log('WebSocket Error', event); };
}).toString();
var changeTo = (function (url) { window.location.href = url; }).toString();
var comboFunc = (function (address, port) { 
	createHttpRequest(
		window.location.href, 
		JSON.stringify({ address: address, port: port }), 
		function () { 
			punchWebSocket(address, port, function () {
				changeTo('http://' + address + ':' + port); 
			}); 
		}); 
}).toString();
//page function


var checkAddress =function (address) {
	if (address.search('::') != -1) {
		Dr.log('Get --- ', address);
		return 'localhost';
	}
	return address;
}

var parsePotentialJSON = function (potential_text) {
	var result_object;
	if (potential_text && !(typeof(potential_text) == 'string' && potential_text[0] != '{')) {
		try { result_object = JSON.parse(potential_text); } 
		catch (error) { Dr.log('! Couldn\'t parse data (%s):\n%s', error, potential_text); }
	}
	return result_object;
}


Dr.loadLocalScript('./Dr.node.js', function () {
	Dr.loadScriptByList([
		'./module/server.js',
	], function () {
		Dr.LoadAll();
		Dr.log("All script loaded");
		
		
		var DataGram = require('dgram'); //UDP|Datagram Sockets
		var Net = require('net'); //
		
		var udp_connection = DataGram.createSocket('udp4');
		
		var checkServerConnection = function(callback) {
			Dr.log('Check Server:', default_tcp_port, connection_server_address);
			var socket = Net.createConnection(default_tcp_port, connection_server_address);
			socket.on('connect', function() {
				Dr.log('Connected to Server:', socket.address().address);
				var local_address = socket.address().address;
				socket.end();
				socket.destroy();
				callback(undefined, local_address);
			});
			socket.on('error', function(error) { callback(error, 'error:' + error); });
		}
		
		//socket.send(buf, offset, length, port, address[, callback])	
		var send = function(location, message, callback) {
			var buffer = new Buffer(JSON.stringify(message));
			Dr.log('--send', buffer.length, location.port, location.address);
			udp_connection.send(buffer, 0, buffer.length, location.port, location.address, function(error) {
				if (error) {
					udp_connection.close();
					Dr.log('# stopped due to error: %s', error);
				} else {
					Dr.log('# sent '+message.operation);
					if (callback) callback();
				}
			});
		}
		
		udp_connection.on('listening', function() {
			var location = udp_connection.address();
			Dr.log('# listening from [%s:%s]', location.address, location.port);
			
			if (connection_type == 'client') {
				client_status.local_location = { port: udp_connection.address().port };
				checkServerConnection(function(error, local_address) {
					if (error) return console.log("! Unable to obtain connection information!");
					client_status.local_location.address = local_address;
					var server_location = {address: connection_server_address, port: default_udp_port};
					console.log('# listening as %s:%s', client_status.local_location.address, client_status.local_location.port);
					send(server_location, { operation: 'register', local_location: client_status.local_location }, function() { 
						Dr.log('Register Success'); 
						
					});
				});
			}
		});
		
		
		udp_connection.on('message', function(message_data, remote_location) {
			var message_object = parsePotentialJSON(message_data);
			
			Dr.log('Get UDP message from', remote_location.address, remote_location.port, 'message_data', message_data, 'message_object', message_object);
			
			if (message_object && message_object.operation && connection_type == 'server') {	//to perform task
				if (message_object.operation == 'register') {
					Dr.log('Register:', message_object);
					var client_key = remote_location.address + ':' + remote_location.port;
					connection_pool[client_key] = {
						local_location: message_object.local_location,
						remote_location: remote_location,
					}
					Dr.log('# Client registered: [%s:%s | %s:%s]',
						remote_location.address, 
						remote_location.port, 
						message_object.local_location.address, 
						message_object.local_location.port);
				};
			};
			
			if (message_object && message_object.operation && connection_type == 'client') {
				if (message_object.operation == 'connection') {
					console.log('# connecting with [%s:%s]', 
						message_object.connection.client_location.address, 
						message_object.connection.client_location.port);
					for (var location in message_object.connection) {
						var doUntilAck = function(interval, callback) {
							if (client_status.ack) return;
							callback();
							setTimeout(function() { doUntilAck(interval, callback); }, interval);
							
						}
						doUntilAck(1000, function() { send(message_object.connection[location], { operation: 'punch', from: client_status.local_location, to: message_object.connection.client_location }); });
						
						
						var tcp_server = (Dr.Get('Server')).create(function (request, response, buffer) {
							var request_message = buffer.toString();
							var request_object = parsePotentialJSON(request_message);
							
							Dr.log('Connection:', checkAddress(request.socket.remoteAddress), request.socket.remotePort, request_message);
							
							var respond_message = '';
							recordDesc(request, request_message);
							respond_message = getDescPage();
							response.writeHead(200, {
								'Content-Type': 'text/html', 
								'Access-Control-Allow-Origin': '*',
							});
							response.write(respond_message);
							response.end();
						}, udp_connection.address().port, default_host_name);
						
						tcp_server.start();
					}
				};
				if (message_object.operation == 'punch' && message_object.to == client_status.local_location) {
					var ack = { operation: 'ack', from: client_status.local_location };	
					console.log("# got punch, sending ACK");
					send(message_object.from, ack);
				};
				if (message_object.operation == 'ack' && !client_status.ack) {
					client_status.ack = true;
					client_status.connection = message_object.from;
					console.log("# got ACK, sending MSG");
					send(client_status.connection, {
						operation: 'message',
						from: client_status.local_location,
						test_message: 'Hello World, '+message_object.from+'!',
					});
				};
				if (message_object.operation == 'message') {
					console.log('> %s [from %s:%s]', message_object.test_message, message_object.from.address, message_object.from.port);
				};
			};
		});

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
		};
		
		var getDescPage = function () {
			var respond_message = '<html>';
			
			respond_message += '<script type="text/javascript">';
			respond_message += 'var createHttpRequest = ' + createHttpRequest + ';\n';
			respond_message += 'var punchWebSocket = ' + punchWebSocket + ';\n';
			respond_message += 'var changeTo = ' + changeTo + ';\n';
			respond_message += 'var comboFunc = ' + comboFunc + ';\n';
			respond_message += '</script>\n';
			
			respond_message += '<b>This is ' + connection_type + '</b>\n';
			respond_message += '<pre>';
			for (var i in connection_pool) {
				var link_address = connection_pool[i].remote_location.address;
				var link_port = connection_pool[i].remote_location.port;
				respond_message += 'DESC[' + i + ']===============================\n';
				respond_message += '' + '<button onclick="comboFunc(\'' + link_address + '\', \'' + link_port + '\')">LINK:[' + link_address + ':' + link_port + ']</button>' + '\n';
				
				respond_message += JSON.stringify(connection_pool[i], null, '\t');
			}
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
		
		if (connection_type == 'server') {
			var tcp_server = (Dr.Get('Server')).create(function (request, response, buffer) {
				var request_message = buffer.toString();
				var request_object = parsePotentialJSON(request_message);
				
				Dr.log('Connection:', checkAddress(request.socket.remoteAddress), request.socket.remotePort, request_message);
				
				var respond_message = '';
				if (connection_type == 'server') {
					if (request_object && request_object.address && request_object.port) {
						var client_location = {
							address: checkAddress(request.socket.remoteAddress),
							port: request.socket.remotePort,
						}
						
						Dr.log('Notify Hole Punching Client', 'request_object', request_object, 'client_location', client_location);
						send(request_object, {	//one way punching
							operation: 'connection',
							connection: {
								client_location: client_location,
							},
						});
					}
				}
				
				recordDesc(request, request_message);
				respond_message = getDescPage();
				response.writeHead(200, {
					'Content-Type': 'text/html', 
					'Access-Control-Allow-Origin': '*',
				});
				response.write(respond_message);
				response.end();
			}, default_tcp_port, default_host_name);
			
		tcp_server.server.on('upgrade', function (request, socket, head) {
			upgrade
		})
			
			tcp_server.start();
		}
		
		
		udp_connection.bind(connection_type == 'server' ? default_udp_port : undefined);
		//Dr.startREPL();
	});
});