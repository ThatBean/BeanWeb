/* Auto Composer
 * for quick compose JSON data
 * to text
 * using configurable logic
 *
 * basic idea: operation will expand a text from input JSON data
 *
 * */

Dr.Declare('AutoComposer', 'class');
Dr.Implement('AutoComposer', function (global, module_get) {

    var Module = function () {
        //
    };

    Module.compose_operation_map = {};
    Module.compose_config_map = {};


    Module.prototype.compose = function (operation_data, data) {
        if (operation_data instanceof Object && Module.compose_operation_map[operation_data.operation]) {
            //single operation
            return this.compose_operation(operation_data, data);
        }
        else if (operation_data.operation_list instanceof Array) {
            //array of operations, or Error?
            return this.compose_operation_list(operation_data, data);
        }
        else {
            //definitely Error
            Dr.assert(false, '[compose] error operation_data', operation_data, data);
            return null;
        }
    };


    Module.prototype.compose_operation = function (operation_data, text) {
        var result_data = Module.compose_operation_map[operation_data.operation].call(this, operation_data, text);
        if (result_data) {
            Dr.log('[parse_operation] success', operation_data.operation, result_data.result, result_data.text.length - text.length);
            if (operation_data.as && result_data.result) {
                result_data[operation_data.as] = result_data.result;
                delete result_data.result;
            }
            return result_data;
        }
        else {
            Dr.log('[parse_operation] failed', operation_data.operation, operation_data.optional);
            if (operation_data.optional == true) {
                return {
                    text: text, //original text
                };
            }
            else {
                Dr.assert(false, '[parse_operation] error', operation_data, text);
                return null;
            }
        }
    };

    Module.prototype.parse_operation_list = function (operation_data, text) {
        var result_list = [];
        var operation_list = operation_data.operation_list;
        for (var index in operation_list) {
            var result_data = this.parse(operation_list[index], text);
            if (result_data) {
                text = result_data.text;
                delete result_data.text;
                result_list.push(result_data);
            }
        }

        //merge list
        var result_merged = {};
        for (var index in result_list) {
            var list_result = result_list[index];
            for (var key in list_result) {
                Dr.assert(!result_merged[key], '[parse_operation_list] key overwrite', key, result_merged, list_result);
                result_merged[key] = list_result[key];
            }
        }

        return {
            text: text,
            result: result_merged,
        };
    };





    //parse_operation
    Module.compose_operation_map.loop_till_text = function (operation_data, text) {
        var result_index = text.search(operation_data.arg);
        var loop_result = [];
        var loop_text = (result_index >= 0)
            ? text.substr(0, result_index - operation_data.arg.length)
            : text; //parse all

        while (loop_text.length != 0) {
            var result = this.parse_operation_list(operation_data, loop_text);
            loop_text = result.text;
            //delete result.text;
            loop_result.push(result.result);
        }

        return {
            text: (result_index >= 0)
                ? text.substr(result_index + operation_data.arg.length)
                : '',
            result: loop_result,
        }
    };

    Module.compose_operation_map.skip_till_regexp = function (operation_data, text) {
        var result_index = text.search(operation_data.arg);
        return {
            text: (result_index >= 0)
                ? text.substr(result_index)
                : '',
        }
    };

    Module.compose_operation_map.skip_after_text = function (operation_data, text) {
        var result_index = text.search(operation_data.arg);
        if (result_index >= 0) {
            return {
                text: text.substr(result_index + operation_data.arg.length),
            }
        }
        else {
            return null;
        }
    };

    Module.compose_operation_map.pick_one_regexp = function (operation_data, text) {
        var result_array = text.match(operation_data.arg);
        if (result_array) {
            var result_group = operation_data.group || 0;
            Dr.assert(result_group < result_array.length);
            return {
                text: text.substr(text.search(result_array[0]) + result_array[0].length),
                result: result_array[result_group],
            }
        }
        else {
            return null;
        }
    };


    //parse_config
    Module.compose_config_map.enum_compose_config = {
        operation_list: [
            { operation: 'skip_after_text', arg: 'enum' },
            { operation: 'pick_one_regexp', arg: /\w+/, as: 'enum_name' },
            { operation: 'pick_one_regexp', arg: /^\s*\/\/\s*([^\n\r]*)[\n\r]+/, group: 1, as: 'comment', optional: true },
            { operation: 'skip_after_text', arg: '{' },
            { operation: 'loop_till_text', arg: '}', as: 'key_list', operation_list: [
                { operation: 'pick_one_regexp', arg: /^\s*\/\/\s*([^\n\r]*)[\n\r]+/, group: 1, as: 'comment', optional: true },
                { operation: 'pick_one_regexp', arg: /\w+/, as: 'enum_key' },
                { operation: 'pick_one_regexp', arg: /^\s*=\s*(\d+)/, group: 1, as: 'custom_value', optional: true },
                { operation: 'skip_after_text', arg: ',', optional: true },
                { operation: 'pick_one_regexp', arg: /^\s*\/\/\s*([^\n\r]*)[\n\r]+/, group: 1, as: 'comment', optional: true },
                { operation: 'skip_till_regexp', arg: /\w+/},
            ] },
        ],
    };


    var easy_format = function(format) {
        var args = Array.prototype.slice.call(arguments, 1);
        return format.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match;
        });
    };


    Module.compose_config_map.cpp_enum_compose_config = {
        operation_list: [
            //enum <enum_name> <comment>
            //{
            { operation: 'concat_text', arg: ' ', operation_list: [
                { operation: 'const_text', arg: 'enum' },
                { operation: 'pick_data', arg: 'enum_name' },
                { operation: 'pick_data', arg: 'comment', optional: true, operation_list: [
                    { operation: 'add_prefix', arg: '// ' },
                ] },
            ] },
            { operation: 'const_text', arg: '\n{\n' },
            { operation: 'pick_data', arg: 'key_list', operation_list: [
                { operation: 'for_each', operation_list: [
                    //<enum_key> = <custom_value>, <comment>
                    //<enum_key>, <comment>
                    //<enum_key>,
                    { operation: 'const_text', arg: '\t' },
                    { operation: 'pick_data', arg: 'enum_key' },
                    { operation: 'pick_data', arg: 'custom_value', optional: true, operation_list: [
                        { operation: 'add_prefix', arg: ' = ' },
                    ] },
                    { operation: 'pick_data', arg: 'comment', optional: true, operation_list: [
                        { operation: 'add_prefix', arg: '// ' },
                    ] },
                    { operation: 'const_text', arg: '\n' },
                ] },
            ] },
            //};
            { operation: 'const_text', arg: '};\n' },
        ],
    };



    Module.compose_config_map.cpp_convert_enum_to_string_compose_config = {
        operation_list: [
            //<enum_name> Parse<enum_name>String(std::string source_string)
            //{
            { operation: 'pick_data', arg: 'enum_name' },
            { operation: 'const_text', arg: ' Parse' },
            { operation: 'pick_data', arg: 'enum_name' },
            { operation: 'const_text', arg: 'String(std::string source_string)\n' },
            { operation: 'const_text', arg: '{\n' },
            //    std::string::size_type found_pos = source_string.find_first_of(<common_prefix>);
            { operation: 'const_text', arg: '    std::string::size_type found_pos = source_string.find_first_of(' },
            { operation: 'pick_data', arg: 'common_prefix' },
            { operation: 'const_text', arg: ');\n' },
            //    if (found_pos != std::string::npos) source_string = source_string.replace(found_pos, strlen(<common_prefix>), "");
            { operation: 'const_text', arg: '    if (found_pos != std::string::npos) source_string = source_string.replace(found_pos, strlen(' },
            { operation: 'pick_data', arg: 'common_prefix' },
            { operation: 'const_text', arg: '), "");\n' },
            //    if (source_string.empty()) return <default_enum_key>;
            { operation: 'const_text', arg: 'if (source_string.empty()) return ' },
            { operation: 'pick_data', arg: 'default_enum_key' },
            { operation: ';\n' },
            { operation: 'pick_data', arg: 'key_list', operation_list: [
                { operation: 'for_each', operation_list: [
                    //    else if (source_string == "<enum_key>") return <enum_key>;
                    { operation: 'const_text', arg: '    else if (source_string == "' },
                    { operation: 'pick_data', arg: 'enum_key' },
                    { operation: ';\n' },
                ] },
            ] },
            //    else
            { operation: '    else\n' },
            //    {
            { operation: '    {\n' },
            //        Log("[Parse<enum_name>String] error source_string <%s>!", source_string.c_str());
            { operation: '        Log("[Parse' },
            { operation: 'pick_data', arg: 'enum_name' },
            { operation: 'String] error source_string <%s>!", source_string.c_str());\n' },
            //        assert(false);
            { operation: '        assert(false);\n' },
            //        return <invalid_enum_key>;
            { operation: '        return ' },
            { operation: 'pick_data', arg: 'invalid_enum_key' },
            { operation: ';\n' },
            //    }
            { operation: '    }\n' },

            { operation: 'const_text', arg: '\n{\n' },
            { operation: 'const_text', arg: '};\n' },
        ],
    };



//To cpp StringToEnum:
//<enum_name> Parse<enum_name>String(std::string source_string)
//{
//    std::string::size_type found_pos = source_string.find_first_of(<common_prefix>);
//    if (found_pos != std::string::npos) source_string = source_string.replace(found_pos, strlen(<common_prefix>), "");
//
//    if (source_string.empty()) return <default_enum_key>;
//    else if (source_string == "<enum_key>") return <enum_key>;
//    else if (source_string == "<enum_key>") return <enum_key>;
//    else if (source_string == "<enum_key>") return <enum_key>;
//    else if (source_string == "<enum_key>") return <enum_key>;
//    else if (source_string == "<enum_key>") return <enum_key>;
//    else
//    {
//        Log("[Parse<enum_name>String] error source_string <%s>!", source_string.c_str());
//        assert(false);
//        return <invalid_enum_key>;
//    }
//}
//
//
//To cpp EnumToString:
//const std::string& Get<enum_name>String(<enum_name> enum_value)
//{
//    static std::string invalid_string = "Error <enum_name>";
//    static std::map<<enum_name>, std::string> convert_map_buff_mod_key;
//    if (convert_map_buff_mod_key.empty())
//    {
//        convert_map_buff_mod_key[<enum_key>] = "<enum_key>";
//        convert_map_buff_mod_key[<enum_key>] = "<enum_key>";
//        convert_map_buff_mod_key[<enum_key>] = "<enum_key>";
//        convert_map_buff_mod_key[<enum_key>] = "<enum_key>";
//        convert_map_buff_mod_key[<enum_key>] = "<enum_key>";
//    }
//    std::map<eActorBuffModKeyType, std::string>::iterator find_result = convert_map_buff_mod_key.find(enum_value);
//    if (find_result != convert_map_buff_mod_key.end())
//        return convert_map_buff_mod_key[enum_value];
//    else
//    {
//        Log("[Get<enum_name>String] error enum_value <%d>!", enum_value);
//        assert(false);
//        return invalid_string;
//    }
//}


    return Module;
});