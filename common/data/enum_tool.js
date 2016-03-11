var DR_ROOT = '../../';

require(DR_ROOT + 'Dr.js');
require(DR_ROOT + 'Dr.node.js');

var global_args = process.argv;

var node_exe = global_args[0];
var script_file = global_args[1];
var operation_type = global_args[2]; // 'extraction', 'generation'
var result_file_location = global_args[3]; // no extension
var target_location_list = global_args[4] ? Dr.getArgumentArray(global_args, 4) : null; //list of file or dir

var usuage = [
    '<node>',
    '<this_script>',
    '<operation_type>',
    '<result_file_location>',
    '<target_location> ...',
].join(' + ');
var get_arg = [
    node_exe,
    script_file,
    (operation_type || '<operation_type>'),
    (result_file_location || '<result_file_location>'),
    (target_location_list ? target_location_list.join(' + ') : '<target_location> ...'),
].join(' + ');

if (global_args.length < 5) {
    Dr.log('[Usage]\n' + usuage);
    Dr.log('[Get]\n' + get_arg);
    Dr.log('[Error] required arguments missing!');
    process.exit(-1);
}





Dr.loadScriptByList([
    DR_ROOT + 'node/module/file.js',

    DR_ROOT + 'common/data/auto_parser.js',
    DR_ROOT + 'common/data/auto_composer.js',
], function () {
    Dr.log("All script loaded");
    Dr.LoadAll();

    var File = Dr.Get('File');
    var AutoParser = Dr.Get('AutoParser');
    var AutoComposer = Dr.Get('AutoComposer');

    //Dr.debugLogLevel = 1;

    var target_file_ext;
    var operation_function;
    var packing_function;

    // check operation type
    switch (operation_type) {
        case 'extraction':
            target_file_ext = '.h';
            operation_function = function enum_extract(file_path, file_data) {
                Dr.log('[enum_extract]', file_path);
                var auto_parser = new AutoParser;

                var enum_text = file_data;
                var result_enum_json_map = {};
                while (enum_text.search('enum') >= 0) {
                    var parse_result = auto_parser.parse(AutoParser.parse_config_map.enum_parse_config, enum_text);
                    if (parse_result.result) {
                        result_enum_json_map[parse_result.result.enum_name] = parse_result.result;
                        enum_text = parse_result.text;
                    }
                    else {
                        break;
                    }
                }
                return result_enum_json_map;
            };
            packing_function = function enum_json_packing(enum_json_map) {
                var result_file_path = result_file_location + '.enum_json';
                File.writeFileSync(result_file_path, JSON.stringify(enum_json_map, null, '\t'));
            };
            break;
        case 'generation':
            target_file_ext = '.enum_json';
            operation_function = function enum_generate(file_path, file_data) {
                Dr.log('[enum_generate]', file_path);
                var auto_composer = new AutoComposer;

                var enum_json_data = JSON.parse(file_data);
                var result_h_cpp_text_data_map = {};
                for (var key in enum_json_data) {
                    var enum_json = enum_json_data[key];

                    var enum_definition_compose_result = auto_composer.compose(AutoComposer.compose_config_map.enum_definition_compose_config, enum_json).join('');
                    var header_string_to_enum_compose_result = auto_composer.compose(AutoComposer.compose_config_map.header_convert_string_to_enum_compose_config, enum_json).join('');
                    var header_enum_to_string_compose_result = auto_composer.compose(AutoComposer.compose_config_map.header_convert_enum_to_string_compose_config, enum_json).join('');
                    var cpp_string_to_enum_compose_result = auto_composer.compose(AutoComposer.compose_config_map.cpp_convert_string_to_enum_compose_config, enum_json).join('');
                    var cpp_enum_to_string_compose_result = auto_composer.compose(AutoComposer.compose_config_map.cpp_convert_enum_to_string_compose_config, enum_json).join('');

                    result_h_cpp_text_data_map[key] = {
                        enum_definition: enum_definition_compose_result,
                        header_string_to_enum: header_string_to_enum_compose_result,
                        header_enum_to_string: header_enum_to_string_compose_result,
                        cpp_string_to_enum: cpp_string_to_enum_compose_result,
                        cpp_enum_to_string: cpp_enum_to_string_compose_result,
                    };
                }
                return result_h_cpp_text_data_map;
            };
            packing_function = function h_cpp_packing(h_cpp_text_data_map) {
                var enum_definition_string_list = [];
                var h_string_list = [];
                var cpp_string_list = [];

                for (var key in h_cpp_text_data_map) {
                    var h_cpp_text_data = h_cpp_text_data_map[key];
                    enum_definition_string_list.push(h_cpp_text_data.enum_definition);
                    h_string_list.push(h_cpp_text_data.header_string_to_enum);
                    h_string_list.push(h_cpp_text_data.header_enum_to_string);
                    cpp_string_list.push(h_cpp_text_data.cpp_string_to_enum);
                    cpp_string_list.push(h_cpp_text_data.cpp_enum_to_string);
                }

                var def_file_path = result_file_location + '.enum_def.h';
                File.writeFileSync(def_file_path, enum_definition_string_list.join('\n'));

                var h_file_path = result_file_location + '.enum_h.h';
                File.writeFileSync(h_file_path, h_string_list.join('\n'));

                var cpp_file_path = result_file_location + '.enum_cpp.cpp';
                File.writeFileSync(cpp_file_path, cpp_string_list.join('\n'));
            };
            break;

        default:
            Dr.log('[Usage]\n' + usuage);
            Dr.log('[Get]\n' + get_arg);
            Dr.log('[Error] no valid operation');
            process.exit(-1);
            break;
    }



    // get file list
    var file_list = [];
    for (var index in target_location_list) {
        var target_location = target_location_list[index];
        var file_result = File.getFileList(target_location, target_file_ext);
        Dr.debug(10, target_location, target_file_ext, file_result);
        file_list = file_list.concat(file_result);
    }

    Dr.log('[get file] count:', file_list.length);

    // operation
    var result_data = {};
    for (var index in file_list) {
        var source_file_path = file_list[index][0];
        var buffer = File.readFileSync(source_file_path);
        file_result = operation_function(source_file_path, buffer.toString());

        // merge result
        for (var key in file_result) {
            Dr.assert(!result_data[key], 'result key conflict', key, source_file_path);
            result_data[key] = file_result[key];
        }
    }

    packing_function(result_data);
    return;
    //Dr.startREPL();
});