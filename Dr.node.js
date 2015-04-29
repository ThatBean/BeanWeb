if (typeof(Dr) === 'undefined' || Dr.environment !== 'node') {
	console.log('[Dr] something wrong...');
}
else {
	// Required Non-Standard-JavaScript Methods
	console.log('[Dr] Adding node methods...');
	
	Dr.loadScript = function (script_src, callback) {
		Dr.log('Loading Script:', script_src);
		var script_element = document.createElement('script');
		script_element.type = 'text/javascript';
		script_element.async = true;
		script_element.src = script_src;
		script_element.onload = function () {
			callback(script_element);
		};
		var exist_script_element = document.getElementsByTagName('script')[0];
		exist_script_element.parentNode.insertBefore(script_element, exist_script_element);
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