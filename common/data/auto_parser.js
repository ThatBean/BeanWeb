/* Auto Parser
* for quick extract JSON data
* from text
* using configurable logic
*
*  basic idea: operations reduce the source text, result is collected
*
* */

Dr.Declare('AutoParser', 'class');
Dr.Implement('AutoParser', function (global, module_get) {

    // cool regexp reference
    //quotations : /((["'])(?:(?:\\\\)|\\\2|(?!\\\2)\\|(?!\2).|[\n\r])*\2)/,
    //multi_line_comment : /(\/\*(?:(?!\*\/).|[\n\r])*\*\/)/,
    //single_line_comment : /(\/\/[^\n\r]*[\n\r]+)/,
    //regex_literal : /(?:\/(?:(?:(?!\\*\/).)|\\\\|\\\/|[^\\]\[(?:\\\\|\\\]|[^]])+\])+\/)/,
    //html_comments : /(<!--(?:(?!-->).)*-->)/,

    var Module = function () {
        //
    };

    Module.parse_operation_map = {};
    Module.parse_config_map = {};


    Module.prototype.parse = function (operation_data, text) {
        if (operation_data instanceof Object && Module.parse_operation_map[operation_data.operation]) {
            //single operation
            return this.parse_operation(operation_data, text);
        }
        else if (operation_data.operation_list instanceof Array) {
            //array of operations, or Error?
            return this.parse_operation_list(operation_data, text);
        }
        else {
            //definitely Error
            Dr.assert(false, '[parse] error operation_data', operation_data, text);
            return null;
        }
    };
    
    
    Module.prototype.parse_operation = function (operation_data, text) {
        var result_data = Module.parse_operation_map[operation_data.operation].call(this, operation_data, text);
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
    Module.parse_operation_map.loop_till_text = function (operation_data, text) {
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

    Module.parse_operation_map.skip_till_regexp = function (operation_data, text) {
        var result_index = text.search(operation_data.arg);
        return {
            text: (result_index >= 0)
                ? text.substr(result_index)
                : '',
        }
    };

    Module.parse_operation_map.skip_after_text = function (operation_data, text) {
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

    Module.parse_operation_map.pick_one_regexp = function (operation_data, text) {
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
    Module.parse_config_map.enum_parse_config = {
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

    return Module;
});