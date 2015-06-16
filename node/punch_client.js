require('./Dr.js');

//TCP_hole_punching

var global_args = process.argv;

var node_exe = global_args[0];
var script_file = global_args[1];
var connection_server_address = global_args[2];	//the server address

var default_udp_port = 54321;
var default_tcp_port = 12345;
var default_host_name = undefined;

var client_status = {
	ack: false,
	server_location: {},
	local_location: {},
	connection: {},
};

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
		//'./module/server.js',
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
		var sendUdpData = function(location, message, callback) {
			var buffer = new Buffer(JSON.stringify(message));
			Dr.log('--sendUdpData', buffer.length, location.port, location.address);
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
			
			client_status.local_location = { port: udp_connection.address().port };
			checkServerConnection(function(error, local_address) {
				if (error) return console.log("! Unable to obtain connection information!");
				client_status.local_location.address = local_address;
				client_status.server_location = {address: connection_server_address, port: default_udp_port};
				console.log('# listening as %s:%s', client_status.local_location.address, client_status.local_location.port);
				sendUdpData(client_status.server_location, { operation: 'register', local_location: client_status.local_location }, function() { 
					Dr.log('Register Sent'); 
				});
			});
		});
		
		udp_connection.on('close', function() {
			Dr.log('Connection closed'); 
		});
		
		
		udp_connection.on('message', function(message_data, remote_location) {
			var message_object = parsePotentialJSON(message_data);
			
			//Dr.log('Get UDP message from', remote_location.address, remote_location.port, 'message_data', message_data, 'message_object', message_object);
			
			if (message_object && message_object.operation) {
				if (message_object.operation == 'register-success') {
					console.log('# register-success with [%s:%s]', 
						message_object.from.address, 
						message_object.from.port);
				};
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
						doUntilAck(1000, function() { sendUdpData(message_object.connection[location], { operation: 'punch', from: client_status.local_location, to: message_object.connection.client_location }); });
					}
				};
				if (message_object.operation == 'punch' && message_object.to == client_status.local_location) {
					var ack = { operation: 'ack', from: client_status.local_location };	
					console.log("# got punch, sending ACK");
					sendUdpData(message_object.from, ack);
				};
				if (message_object.operation == 'ack' && !client_status.ack) {
					client_status.ack = true;
					client_status.connection = message_object.from;
					console.log("# got ACK, sending MSG");
					sendUdpData(client_status.connection, {
						operation: 'message',
						from: client_status.local_location,
						test_message: 'Hello World, '+message_object.from+'!',
					});
				};
				if (message_object.operation == 'message') {
					console.log('> %s [from %s:%s]', message_object.test_message, message_object.from.address, message_object.from.port);
				};
				if (message_object.operation == 'close') {
					console.log('> %s [from %s:%s]', message_object.operation, message_object.from.address, message_object.from.port);
					udp_connection.close();
				};
			};
		});
		
		udp_connection.bind();
		
		var beforeExit = function() {
			Dr.log('About to exit, get:', arguments);
			var location = udp_connection.address();
			Dr.log('# close from [%s:%s]', location.address, location.port);
			sendUdpData(client_status.server_location, { operation: 'unregister', local_location: client_status.local_location }, function() { 
				Dr.log('UnRegister Sent'); 
				udp_connection.close();
				process.exit();
			});
		}
		//process.on('exit', beforeExit); //do something when app is closing
		process.on('SIGINT', beforeExit); //catches ctrl+c event
		//process.on('uncaughtException', beforeExit); //catches uncaught exceptions
		
		//Dr.startREPL();
	});
});