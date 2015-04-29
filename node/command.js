Dr.Declare('Command', 'class');
Dr.Implement('Command', function (global, module_get) {
	var Os = Dr.require('os');
	var ChildProcess = Dr.require('child_process');
	
	var Module = function () {
		//
	};
	
	Module.run = function (command, options) {
		var platform = Os.platform();
		var shell_executable = '';
		var arg_list = [];
		if (platform.search('win') != -1) {
			shell_executable = 'cmd';
			arg_list = ['/s', '/c'];
		};
		if ((platform.search('nux') != -1) || (platform.search('darwin') != -1)) {
			shell_executable = 'sh';
			arg_list = ['-c'];
		};
		arg_list.push(command);
		return Module.spawn(shell_executable, arg_list, options);
	};


	Module.spawn = function (command, arg_list, options) {
		var arg_list = arg_list || [];
		var options = options || {};

		var spawn_options = {
			cwd: options.cwd || process.cwd(),
			env: options.env || process.env,
		};
		
		//spawn child_process
		var sub_process = ChildProcess.spawn(command, arg_list, spawn_options);
		
		///add stream event
		sub_process.stdout.on('data', function(data) {
			if (options.stdoutStream) options.stdoutStream.write(data);
			if (options.callbackOutput) options.callbackOutput('data', 'stdout', data);
		});
		sub_process.stdout.on('end', function() {
			if (options.stdoutStream) options.stdoutStream.end();
			if (options.callbackOutput) options.callbackOutput('end', 'stdout');
		});

		sub_process.stderr.on('data', function(data) {
			if (options.stderrStream) options.stderrStream.write(data);
			if (options.callbackOutput) options.callbackOutput('data', 'stderr', data);
		});
		sub_process.stderr.on('end', function() {
			if (options.stderrStream) options.stderrStream.end();
			if (options.callbackOutput) options.callbackOutput('end', 'stderr');
		});

		///on exit
		sub_process.on('exit', function(code, signal) {
			console.warn('[Exit] code:', code, ' signal:', signal);
			if (options.callback) options.callback(code, signal);
		});

		return sub_process;
	};
	
	return Module;
});
