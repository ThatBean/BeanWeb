if (typeof(Dr) === 'undefined') {
    console.log('[Dr][node] something wrong... <Dr> not defined');
}
else if (Dr.environment !== 'node') {
    console.log('[Dr][node] something wrong... environment: ', Dr.environment);
}
else {
    // Required Non-Standard-JavaScript Methods
    Dr.log('[Dr] Adding node methods...');

    var node_module_fs = Dr.require('fs');

    Dr.loadScript = function (script_src, callback) {
        Dr.debug(10, 'Loading Script:', script_src);
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
            Dr.debug(10, "[loadScriptByList]", script_src_list);
            if (script_src_list.length <= 0) callback();
            else Dr.loadScript(script_src_list.shift(), loop_load_script);
        };
        //start loop
        loop_load_script();
    };

    Dr.loadJsonFile = function (file_path) {
        var file_text = node_module_fs.readFileSync(file_path, {encoding: 'utf8'});
        //delete the '//...' from each line to support basic comment
        var file_line_array = file_text.split('\n');
        var json_line_array = [];
        for (var index in file_line_array) {
            var text_without_comment = file_line_array[index].replace(/\/\/.*/, '');
            if (text_without_comment) json_line_array.push(text_without_comment);
        }
        var json_text = json_line_array.join('\n');
        //Dr.log('Get Json from file:', file_path);
        //Dr.log(json_text);
        return JSON.parse(json_text);
    }
}