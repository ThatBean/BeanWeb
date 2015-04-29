require('../Dr.js');


Dr.loadLocalScript('./file.js', function () {
	Dr.log("All script loaded");
	Dr.LoadAll();
	
	test_path = './test';
	var Directory = Dr.Get('Directory');
	var test = Directory.create(test_path);
	test.walk(function (path, name, type) {
		//console.log('Get', ' - ', path, ' - ', name, ' - ', type);
	})
	
	test.modify('copy', './test_copy/');
	
	test.modify('copy', './test_move/');
	Directory.create('./test_move').modify('move', './test_move_to/');
	
	test.modify('copy', './test_delete/');
	Directory.create('./test_delete').modify('delete');
	
	Directory._delete('Directory', './test_move/');
	Directory._delete('Directory', './test_delete/');
	
	//Dr.startREPL();
});