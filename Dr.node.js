if (typeof(Dr) === 'undefined' || Dr.environment !== 'node') {
	console.log('[Dr] something wrong...');
}
else {
	// Required Non-Standard-JavaScript Methods
	console.log('[Dr] Adding node methods...');
	
	var Fs = Dr.require('fs');
	
	Dr.loadScript = function (script_src, callback) {
		Dr.log('Loading Script:', script_src);
		if (script_src.search('://') !== -1) {
			Dr.log('not support web content yet...', script_src);
			return;
		}
		else {
			return Dr.loadLocalScript(script_src, callback);
		}
	};
	
	Dr.loadScriptByList = function (script_src_list, callback) {
		var loop_load_script = function () {
			Dr.log("[loadScriptByList]", script_src_list);
			if (script_src_list.length <= 0) callback();
			else Dr.loadScript(script_src_list.shift(), loop_load_script);
		}
		//start loop
		loop_load_script();
	};
	
	Dr.LoadJsonFile = function (file_path) {
		var file_text = Fs.readFileSync(file_path, {encoding: 'utf8'});
		//delete the '//...' from each line to support basic comment
		var file_line_array = file_text.split('\n');
		var json_line_array = [];
		for (var index in file_line_array) {
			var text_without_comment = file_line_array[index].replace(/\/\/.*/, '');
			if (text_without_comment) json_line_array.push(text_without_comment);
		}
		var json_text = json_line_array.join('\n');
		return JSON.parse(json_text);
	}
}