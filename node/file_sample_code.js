require('../Dr.js');


Dr.loadLocalScript('./file.js', function () {
	Dr.log("All script loaded");
	Dr.LoadAll();
	
	test_path = '.';
	var PathContent = Dr.Get('PathContent');
	var test = PathContent.create(test_path);
	test.walk(function (path, name, type) {
		console.log('Get', ' - ', path, ' - ', name, ' - ', type);
	})
	
	test.modify('copy', './test/');
	
	Dr.startREPL();
});