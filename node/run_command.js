var Os = require('os')
var ChildProcess = require('child_process')
var Fs = require('fs')


function spawnShellSubProcess (command, options) {
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
	return spawnSubProcess(shell_executable, arg_list, options);
}


//used later
function spawnSubProcess (command, arg_list, options) {
	var arg_list = arg_list || [];
	var options = options || {};

	var spawn_options = {
		cwd: options.cwd || process.cwd(),
		env: options.env || process.env
	};

	//console.warn('[][][][][][][][]',spawn_options);

	//options.stdoutLog = (options.stdoutLog == undefined) ? true : options.stdoutLog;
	//options.stderrLog = (options.stderrLog == undefined) ? true : options.stderrLog;
	options.fileStreamOptions = options.fileStreamOptions || {
		flags: 'w',   //can be 'r+' for appending
		encoding: 'utf-8',
		mode: 0666
	};

	///spawn!
	var sub_process = ChildProcess.spawn(command, arg_list, spawn_options);

	///setup output stream
	if (options.stdoutFile) {
		console.warn('created stdoutFile', options.stdoutFile);
		options.stdoutFileStream = Fs.createWriteStream(options.stdoutFile, options.fileStreamOptions);
		options.stdoutFileStream.write(options.stdoutFileStart); 
	}
	if (options.stderrFile) {
		if (options.stdoutFile == options.stderrFile) options.stderrFileStream = options.stdoutFileStream;
		else options.stderrFileStream = Fs.createWriteStream(options.stderrFile, options.fileStreamOptions);
		console.warn('created stderrFile', options.stderrFile);
		options.stderrFileStream.write(options.stderrFileStart); 
	}

	///add stream event
	sub_process.stdout.on('data', function(data) {
		if (options.stdoutFileStream) options.stdoutFileStream.write(data);
		if (options.stdoutLog) console.log(data.toString('utf8'));
	});
	sub_process.stdout.on('end', function() {
		console.warn('end of stdout');
		if (options.stdoutFileStream) options.stdoutFileStream.end(options.stdoutFileEnd); 
	});

	sub_process.stderr.on('data', function(data) {
		if (options.stderrFileStream) options.stderrFileStream.write(data);
		if (options.stderrLog) console.error(data.toString('utf8'));
	});
	sub_process.stderr.on('end', function() {
		console.warn('end of stderr');
		if (options.stderrFileStream) options.stderrFileStream.end(options.stderrFileEnd);
	});

	///on exit
	sub_process.on('exit', function(code, signal) {
		console.warn('[Exit] code:', code, ' signal:', signal);
		if (code != 0) console.log('[Exit] code:', code, ' signal:', signal);
		if (options.callback) options.callback(code, signal);
	});

	return sub_process;
}
