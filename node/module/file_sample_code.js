require('../Dr.js');

Dr.loadLocalScript('./file.js', function () {
	Dr.log("All script loaded");
	Dr.LoadAll();
	var Directory = Dr.Get('Directory');
	
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
	
	
	//Dr.startREPL();
});