Dr.Declare('AutoParser', 'class');
Dr.Implement('AutoParser', function (global, module_get) {
    var enum_parse_config = {
        operation_list: [
            { operation: 'skip_till_text', arg: 'enum' },
            { operation: 'pick_one_regexp', arg: /\w+/, as: 'enum_name' },
            { operation: 'pick_one_regexp', arg: /\/\/\w+/, as: 'comment', optional: true },
            { operation: 'skip_till_text', arg: '{' },
            { operation: 'loop_till_text', arg: '}', as: 'key_list', operation_list: [
                { operation: 'pick_one_regexp', arg: /\w+/, as: 'enum_key' },
                { operation: 'pick_one_regexp', arg: /\d+/, as: 'custom_value', optional: true },
                { operation: 'pick_one_regexp', arg: /\/\/\w+/, as: 'comment', optional: true },
            ] },
        ],
    };
    
    var Module = function () {
        //
    };
    
    Module.prototype.parse = function (operation_data, text) {
        if (Module.prototype[operation_data.operation]) {
            return this.parse_operation(operation_data, text);
        }
        else if (operation_data.operation_list) {
            return this.parse_operation_list(operation_data, text);
        }
        else {
            Dr.assert(false, '[parse] error');
            return null;
        }
    };
    
    
    Module.prototype.parse_operation = function (operation_data, text) {
        var result_data = {};
        var result_operation = Module.prototype[operation_data.operation].call(this, operation_data, text);
        if (result_operation.is_success) {
            if (operation_data.as) {
                result_data[operation_data.as] = result_operation.result;
            }
            result_data.text = result_operation.text;
            return result_data;
        }
        else {
            if (operation_data.optional = true) {
                return null;
            }
            else {
                Dr.assert(false, '[parse_operation] error');
                return null;
            }
        }
    };
    
    Module.prototype.parse_operation_list = function (operation_data, text) {
        var result_list = [];
        var operation_list = operation_data.operation_list;
        for (var key in operation_list) {
            result_list.push(this.parse(operation_list[key], text));
        }
        return result_list;
    };
    
    
    Module.prototype.loop_till_text = function (operation_data, text) {
        var result_index = text.search(operation_data.arg);
        if (result_index > 0) {
            var loop_text = text.substr(0, result_index);
            return {
                text: text.substr(result_index + operation_data.arg.length),
                result: this.parse_operation_list(operation_data, loop_text),
                is_success: true,
            }
        }
        else {
            return {
                text: '',
                result: this.parse_operation_list(operation_data, text),
                is_success: true,
            }
        }
    };

    Module.prototype.skip_till_text = function (operation_data, text) {
        var result_index = text.search(operation_data.arg);
        if (result_index > 0) {
            return {
                text: text.substr(result_index + operation_data.arg.length),
                is_success: true,
            }
        }
        else {
            return {
                text: text,
                is_success: false,
            }
        }
    };
    
    Module.prototype.pick_one_regexp = function (operation_data, text) {
        var result_array = text.match(operation_data.arg);
        if (result_array) {
            return {
                text: text.substr(result_array[0].length),
                result: result_array[0],
                is_success: true,
            }
        }
        else {
            return {
                text: text,
                result: null,
                is_success: false,
            }
        }
    };
    
    return Module;
});