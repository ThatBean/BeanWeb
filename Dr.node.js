if (typeof(Dr) === 'undefined' || Dr.environment !== 'node') {
	console.log('[Dr] something wrong...');
}
else {
	// Required Non-Standard-JavaScript Methods
	console.log('[Dr] Adding node methods...');
	
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
}