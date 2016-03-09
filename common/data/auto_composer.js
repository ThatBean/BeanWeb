/* Auto Composer
 * for quick compose JSON data
 * to text
 * using configurable logic
 *
 * basic idea: operation will expand a text from input JSON data
 *
 *   data, data, data... -> text
 *   data, data, data... -> text
 *   data, data, data... -> text
 *
 *   text, text, text -> result_text
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


    Module.prototype.compose_operation = function (operation_data, data) {
        var result_text = Module.compose_operation_map[operation_data.operation].call(this, operation_data, data);
        if (result_text != null) {
            Dr.debug(10, '[compose_operation] success', operation_data.operation, result_text);
            return result_text;
        }
        else {
            Dr.debug(10, '[compose_operation] failed', operation_data.operation, operation_data.optional);
            if (operation_data.optional == true) {
                return '';
            }
            else {
                Dr.assert(false, '[compose_operation] error', operation_data, data);
                return null;
            }
        }
    };

    Module.prototype.compose_operation_list = function (operation_data, data) {
        var result_text_list = [];
        var operation_list = operation_data.operation_list;
        for (var index in operation_list) {
            var result_text = this.compose_operation(operation_list[index], data);
            if (result_text != null) {
                result_text_list.push(result_text);
            }
        }
        return result_text_list;
    };




    //parse_operation
    Module.compose_operation_map.const_text = function (operation_data, data) {
        return (operation_data.arg).toString();
    };

    Module.compose_operation_map.format_data = function (operation_data, data) {
        function format_text (format, data_list) {
            return format.replace(/{(\d+)}/g, function(match, number) {
                return typeof(data_list[number]) != 'undefined' ? data_list[number] : match;
            });
        }
        var format = operation_data.arg;
        var text_list = this.compose_operation_list(operation_data, data);
        return format_text(format, text_list);;
    };

    Module.compose_operation_map.pick_data = function (operation_data, data) {
        return data[operation_data.arg] ? (data[operation_data.arg]).toString() : null;
    };
    Module.compose_operation_map.if_data = function (operation_data, data) {
        if (data[operation_data.arg] && operation_data.if_operation) {
            return this.compose_operation(operation_data.if_operation, data);
        }
        else if (operation_data.else_operation) {
            return this.compose_operation(operation_data.else_operation, data);
        }
        else {
            return '';
        }
    };

    Module.compose_operation_map.for_each_in_data = function (operation_data, data) {
        var data_selected = data[operation_data.arg];
        if (data_selected) {
            var text_list = [];
            for (var index in data_selected) {
                text_list.push(this.compose_operation(operation_data.for_operation, data_selected[index]));
            }
            return text_list.join(operation_data.delimiter || '');
        }
        else {
            return null;
        }
    };




    //parse_config
    Module.compose_config_map.cpp_enum_compose_config = {
        operation_list: [
            //enum <enum_name> <comment>
            //[common_prefix] common_prefix
            //[default_enum_key] default_enum_key
            //{
            // <key_list>
            //};
            { operation: 'format_data', arg: 'enum {0} // {1}\n' +
            '//[common_prefix] {2}\n' +
            '//[default_enum_key] {3}\n' +
            '{\n' +
            '{4}\n' +
            '};\n', operation_list: [
                { operation: 'pick_data', arg: 'enum_name', as: 'string' },
                { operation: 'pick_data', arg: 'comment', as: 'string', optional: true },
                { operation: 'pick_data', arg: 'common_prefix', as: 'string', optional: true },
                { operation: 'pick_data', arg: 'default_enum_key', as: 'string', optional: true },
                { operation: 'for_each_in_data', arg: 'key_list', delimiter: '',
                    //<enum_key> = <custom_value>, <comment>
                    //<enum_key>, <comment>
                    //<enum_key>,
                    for_operation: { operation: 'format_data', arg: '\t{0}{1},{2}\n', operation_list: [
                        { operation: 'pick_data', arg: 'enum_key', as: 'string' },
                        { operation: 'if_data', arg: 'custom_value', optional: true,
                            if_operation: { operation: 'format_data', arg: ' = {0}', operation_list: [
                                { operation: 'pick_data', arg: 'custom_value', as: 'string' },
                            ] }
                        },
                        { operation: 'if_data', arg: 'comment', optional: true,
                            if_operation: { operation: 'format_data', arg: '// {0}', operation_list: [
                                { operation: 'pick_data', arg: 'comment', as: 'string' },
                            ] },
                        },
                    ] },
                },
            ] },
        ],
    };



    Module.compose_config_map.header_convert_string_to_enum_compose_config = {
        operation_list: [
            { operation: 'if_data', arg: 'common_prefix', optional: true,
                //<enum_name> <enum_name>FromString(std::string source_string);
                if_operation: { operation: 'format_data', arg: '{0} {0}FromString(std::string source_string);\n', operation_list: [
                    { operation: 'pick_data', arg: 'enum_name', as: 'string' },
                ] },
                //<enum_name> <enum_name>FromString(const std::string& source_string);
                else_operation: { operation: 'format_data', arg: '{0} {0}FromString(const std::string& source_string);\n', operation_list: [
                    { operation: 'pick_data', arg: 'enum_name', as: 'string' },
                ] },
            },
        ],
    };

    Module.compose_config_map.cpp_convert_string_to_enum_compose_config = {
        operation_list: [
            { operation: 'if_data', arg: 'common_prefix', optional: true,
                //<enum_name> <enum_name>FromString(std::string source_string)
                //{
                //    std::string::size_type found_pos = source_string.find("<common_prefix>");
                //    if (found_pos != std::string::npos) source_string = source_string.replace(found_pos, strlen("<common_prefix>"), "");
                if_operation: { operation: 'format_data', arg: '{0} {0}FromString(std::string source_string)\n' +
                '{\n' +
                '\tstd::string::size_type found_pos = source_string.find("{1}");\n' +
                '\tif (found_pos != std::string::npos) source_string = source_string.replace(found_pos, strlen("{1}"), "");\n', operation_list: [
                    { operation: 'pick_data', arg: 'enum_name', as: 'string' },
                    { operation: 'pick_data', arg: 'common_prefix', as: 'string' },
                ] },
                //<enum_name> <enum_name>FromString(const std::string& source_string)
                //{
                else_operation: { operation: 'format_data', arg: '{0} {0}FromString(const std::string& source_string)\n' +
                '{\n', operation_list: [
                    { operation: 'pick_data', arg: 'enum_name', as: 'string' },
                ] },
            },
            //    if (source_string.empty()) return <default_enum_key>;
            //    if (source_string.empty()) return <enum_name>(-1);   //prevent further error
            { operation: 'if_data', arg: 'default_enum_key', optional: true,
                if_operation: { operation: 'format_data', arg: '\tif (source_string.empty()) return {0};\n', operation_list: [
                    { operation: 'pick_data', arg: 'default_enum_key', as: 'string' },
                ] },
                else_operation: { operation: 'format_data', arg: '\tif (source_string.empty()) return {0}(-1);\n', operation_list: [
                    { operation: 'pick_data', arg: 'enum_name', as: 'string' },
                ] },
            },
            { operation: 'for_each_in_data', arg: 'key_list',
                //    else if (source_string == "<enum_key>") return <enum_key>;
                for_operation: { operation: 'format_data', arg: '\telse if (source_string == "{0}") return {0};\n', operation_list: [
                    { operation: 'pick_data', arg: 'enum_key', as: 'string' },
                ] },
            },
            //    else
            //    {
            //        Log("[<enum_name>FromString] error source_string <%s>!", source_string.c_str());
            //        assert(false);
            //        return <invalid_enum_key>;
            //        return <enum_name>(-1);
            //    }
            //}
            { operation: 'format_data', arg: '\telse\n' +
            '\t{\n' +
            '\t\tLog("[{0}FromString] error source_string <%s>!", source_string.c_str());\n' +
            '\t\tassert(false);\n' +
            '\t\treturn {1};\n' +
            '\t}\n' +
            '}\n', operation_list: [
                { operation: 'pick_data', arg: 'enum_name', as: 'string' },
                { operation: 'if_data', arg: 'invalid_enum_key', optional: true,
                    if_operation: { operation: 'pick_data', arg: 'invalid_enum_key', as: 'string' },
                    else_operation: { operation: 'format_data', arg: '{0}(-1)', operation_list: [
                        { operation: 'pick_data', arg: 'enum_name', as: 'string' },
                    ] },
                },
            ] },
        ],
    };


    Module.compose_config_map.header_convert_enum_to_string_compose_config = {
        operation_list: [
            //const std::string& <enum_name>ToString(<enum_name> enum_value);
            { operation: 'format_data', arg: 'const std::string& {0}ToString({0} enum_value);\n', operation_list: [
                { operation: 'pick_data', arg: 'enum_name', as: 'string' },
            ] },
        ],
    };
    Module.compose_config_map.cpp_convert_enum_to_string_compose_config = {
        operation_list: [
            //const std::string& <enum_name>ToString(<enum_name> enum_value)
            //{
            //    static std::string invalid_string = "Error <enum_name>";
            //    static std::map<<enum_name>, std::string> convert_map;
            //    if (convert_map.empty())
            //    {
            { operation: 'format_data', arg: 'const std::string& {0}ToString({0} enum_value)\n' +
            '{\n' +
            '\tstatic std::string invalid_string = "Error {0}";\n' +
            '\tstatic std::map<{0}, std::string> convert_map;\n' +
            '\tif (convert_map.empty())\n' +
            '\t{\n', operation_list: [
                { operation: 'pick_data', arg: 'enum_name', as: 'string' },
            ] },
            { operation: 'for_each_in_data', arg: 'key_list',
                //        convert_map[<enum_key>] = "<enum_key>";
                for_operation: { operation: 'format_data', arg: '\t\tconvert_map[{0}] = "{0}";\n', operation_list: [
                    { operation: 'pick_data', arg: 'enum_key', as: 'string' },
                ] },
            },
            //    }
            //    std::map<<enum_name>, std::string>::iterator find_result = convert_map.find(enum_value);
            //    if (find_result != convert_map.end())
            //        return convert_map[enum_value];
            //    else
            //    {
            //        Log("[<enum_name>ToString] error enum_value <%d>!", enum_value);
            //        assert(false);
            //        return invalid_string;
            //    }
            //}
            { operation: 'format_data', arg: '\t}\n' +
            '\tstd::map<{0}, std::string>::iterator find_result = convert_map.find(enum_value);\n' +
            '\tif (find_result != convert_map.end())\n' +
            '\t\treturn convert_map[enum_value];\n' +
            '\telse\n' +
            '\t{\n' +
            '\t\tLog("[{0}ToString] error enum_value <%d>!", enum_value);\n' +
            '\t\tassert(false);\n' +
            '\t\treturn invalid_string;\n' +
            '\t}\n' +
            '}\n', operation_list: [
                { operation: 'pick_data', arg: 'enum_name', as: 'string' },
            ] },
        ],
    };



    return Module;
});