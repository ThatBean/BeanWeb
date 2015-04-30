require('../Dr.js');

var port = 888;
var host_name = undefined;
var is_running = false;
var last_log = '';

Dr.loadLocalScript('../Dr.node.js', function () {
	Dr.loadScriptByList([
		'./command.js',
		'./server.js',
	], function () {
		Dr.log("All script loaded");
		
		Dr.LoadAll();
		
		var Server = Dr.Get('Server');
		var Command = Dr.Get('Command');
		
		var server = Server.create(function (request, response, buffer) {
			var operation = buffer.toString();
			var message = job(operation);
			
			response.writeHead(200, {
				'Content-Type': 'text/plain', 
				'Access-Control-Allow-Origin': '*',
			});
			response.write(message);
			response.end();
		}, port, host_name);
		server.start();
		
		var job = function (operation) {
			switch (operation) {
				case 'start':
					if (is_running) {
						return 'already running...';
					}
					else {
						var buffer = '';
						Command.run('git pull', {
							cwd: '/var/www/root',
							stdoutLog: true,
							stderrLog: true,
							callback: function (code, signal) {
								//Dr.log(arguments);
								//if (data) Dr.log(data.toString());
								console.warn('[Exit] code:', code, ' signal:', signal);
								is_running = false;
								last_log = buffer;
							},
							callbackOutput: function (event, from, data) {
								if (data && event == 'data' && from == 'stdout') {
									buffer += data;
								}
							},
						});
						return 'successfully started';
					}
					break;
				case 'status':
				default:
					return '[status] \n'
						+ 'is_running: ' + is_running.toString() + '\n'
						+ 'last_log: ' + last_log.toString() + '\n';
					break;
				
			}
			
			
		}
		
		
		//Dr.startREPL();
	});
});