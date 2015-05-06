///change cwd to current_script_path
var Path = require('path');
var current_script_path = Path.resolve(process.cwd(), Path.dirname(process.argv[1]));
console.log(current_script_path);
process.chdir(current_script_path);
///change cwd to current_script_path


require('../Dr.js');

Dr.loadLocalScript('../Dr.node.js', function () {
	/*
	Dr.loadScriptByList([
		'./command.js',
		'./server.js',
	], function () {
		Dr.log("All script loaded");
		Dr.LoadAll();
		
		var Server = Dr.Get('Server');
		var Command = Dr.Get('Command');
	});
	*/
	Dr.startREPL();
});