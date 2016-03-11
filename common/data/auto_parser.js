/* Auto Parser
* for quick extract JSON data
* from text
* using configurable logic
*
* - basic idea: operations consume the source text, result is collected
* - - text -> { data, data, data... }
* - - text -> { data, data, data... }
* - - text -> { data, data, data... }
*
* - - {}, {}, {} -> [ {}, {}, {} ]
*
* - input format: (operation_data, text)
* - result success: { text: 'text left', result: {} }
* - result failed: null
*
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
            Dr.debug(10, '[parse_operation] success', operation_data.operation, result_data.result, result_data.text.length - text.length);
            if (operation_data.as && result_data.result) {
                result_data[operation_data.as] = result_data.result;
            }
            delete result_data.result; // no <as> no result
            return result_data;
        }
        else {
            Dr.debug(10, '[parse_operation] failed', operation_data.operation, operation_data.optional);
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

        var result_merged = {}; //merge result list
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
    Module.parse_operation_map.loop_till_selection = function (operation_data, text) {
        var result_index = text.search(operation_data.arg);
        var loop_text = (result_index >= 0)
            ? text.substr(0, result_index - operation_data.arg.length + 1)
            : text; //parse all
        var remain_text = (result_index >= 0)
            ? text.substr(result_index + operation_data.arg.length)
            : ''; //parsed all, nothing left
        var loop_result = [];
        while (loop_text.length != 0) {
            var result = this.parse_operation_list(operation_data, loop_text);
            loop_text = result.text;
            loop_result.push(result.result);
        }
        return {
            text: remain_text,
            result: loop_result,
        }
    };

    Module.parse_operation_map.skip_till_selection = function (operation_data, text) {
        var result_index = text.search(operation_data.arg);
        return {
            text: (result_index >= 0)
                ? text.substr(result_index)
                : '',
        }
    };

    Module.parse_operation_map.skip_after_selection = function (operation_data, text) {
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
            Dr.assert(result_array.index >= 0);

            var result_pick_text = result_array[result_group];
            if (operation_data.trim) {
                result_pick_text = result_pick_text.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
            }

            return {
                text: text.substr(result_array.index + result_array[0].length),
                result: result_pick_text,
            }
        }
        else {
            return null;
        }
    };

    Module.parse_operation_map.drop_excess_comment = function (operation_data, text) {
        var text_line_array = text.split('\n');
        var result_line_array = [];
        for (var index in text_line_array) {
            //var text_without_comment = text_line_array[index].replace(/^\s*\/\/[^\[].*/, ''); //drop fill-line inline comment
            var text_without_comment = text_line_array[index].replace(/\/\/[^\[].*/, ''); //drop all inline comment
            if (text_without_comment) result_line_array.push(text_without_comment);
        }
        return {
            text: result_line_array.join('\n'),
        }
    };



    //parse_config
    Module.parse_config_map.enum_parse_config = {
        operation_list: [
            { operation: 'drop_excess_comment' },
            { operation: 'skip_after_selection', arg: 'enum' },
            { operation: 'pick_one_regexp', arg: /\w+/, as: 'enum_name', trim: true },
            //{ operation: 'pick_one_regexp', arg: /^\s*\/\/\s*([^\n\r]*)[\n\r]+/, group: 1, as: 'comment', trim: true, optional: true },
            { operation: 'pick_one_regexp', arg: /^\s*\/\/\[common_prefix\]\s*(\w*)/, group: 1, as: 'common_prefix', trim: true, optional: true },
            { operation: 'pick_one_regexp', arg: /^\s*\/\/\[default_enum_key\]\s*(\w*)/, group: 1, as: 'default_enum_key', trim: true, optional: true },

            { operation: 'skip_after_selection', arg: '{' },
            { operation: 'loop_till_selection', arg: '}', as: 'key_list', operation_list: [
                //{ operation: 'pick_one_regexp', arg: /^\s*\/\/\s*([^\n\r]*)[\n\r]+/, group: 1, optional: true }, //drop pre comment
                { operation: 'pick_one_regexp', arg: /^\s*(\w+)/, group: 1, as: 'enum_key', trim: true },
                { operation: 'pick_one_regexp', arg: /^\s*=\s*([\w\d\+\-\(\)\<\>\|\&\s]+)\s*[\,\}\/\n\r]/, group: 1, as: 'custom_value', trim: true, optional: true },
                { operation: 'skip_after_selection', arg: '/^,/', optional: true },
                //{ operation: 'pick_one_regexp', arg: /^\s*\/\/\s*([^\n\r]*)[\n\r]+/, group: 1, as: 'comment', trim: true, optional: true },
                { operation: 'skip_till_selection', arg: /\w+/},
            ] },
        ],
    };

    return Module;
});