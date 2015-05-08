require('../Dr.js');

Dr.loadLocalScript('./file.js', function () {
	Dr.log("All script loaded");
	Dr.LoadAll();
	var Directory = Dr.Get('Directory');
	
	Dr.debugLogLevel = 1;
	
	var test_path = './test';
	Directory.create('./').modify('copy', test_path);
	
	var test_directory = Directory.create(test_path);
	test_directory.walk(function (path, name, type) {
		console.log('Get', ' - ', path, ' - ', name, ' - ', type);
		if (type == 'Directory') return 'continue';
	}, true);
	
	test_directory.modify('copy', './test_copy/');
	
	test_directory.modify('copy', './test_move/');
	Directory.create('./test_move').modify('move', './test_move_to/');
	
	test_directory.modify('copy', './test_delete/');
	Directory.create('./test_delete').modify('delete');
	
	Directory._delete('Directory', './test_move/');
	Directory._delete('Directory', './test_delete/');
	
	//test modify
	
	var test_path = './test_modify';
	Directory.modify('copy', 'Directory', './', test_path);
	Directory.modify('copy', 'Directory', test_path, './test_modify_copy');
	Directory.modify('copy', 'Directory', test_path, './test_modify_delete');
	Directory.modify('copy', 'Directory', test_path, './test_modify_move');
	
	Directory.modify('delete', 'Directory', './test_modify_delete');
	Directory.modify('move', 'Directory', './test_modify_move', './test_modify_move_to');
	
	//Dr.startREPL();
});