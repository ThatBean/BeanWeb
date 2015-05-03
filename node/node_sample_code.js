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