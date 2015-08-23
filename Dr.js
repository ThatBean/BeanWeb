// Js Dr Bean Dr.Eames
var dr_author = 'Bean/Dr.Eames';
var dr_version = '0.12';
var dr_environment = 'unknown';

// Prevent unnecessary re-define
var Dr = (
	typeof(Dr) == 'function' 
	&& Dr.author == dr_author 
	&& Dr.version >= dr_version
) ? Dr : (function (undefined) {
	
	// Check Environment
	console.log('[Dr] Check Environment...');
	
	if (typeof(window) !== 'undefined' && typeof(document) !== 'undefined') {
		dr_environment = 'browser';
		console.log('detected', dr_environment);
	}
	
	if (typeof(process) !== 'undefined' && typeof(process.versions) !== 'undefined' && process.versions.node) {
		dr_environment = 'node';
		console.log('detected', dr_environment, process.versions.node);
	}
	
	if (typeof(cordova) !== 'undefined') {
		dr_environment = 'cordova';
		console.log('detected', dr_environment);
	}
	
	console.log('[Dr] Environment is', dr_environment);
	
	// Dr Initialize
	console.log('[Dr] Initializing...');
	
	var Dr = function () {
		Dr.log('[Dr] A Frame by ' + Dr.author);
		Dr.log('[Dr] Version ' + Dr.version);
		Dr.log('[Dr] Environment ' + Dr.environment);
	}
	
	Dr.author = dr_author;
	Dr.version = dr_version;
	Dr.environment = dr_environment;
	
	Dr.global = this.global || this;	//normally window, or {} for a sandbox?
	
	console.log('[Dr] Init Base Method...');
	
	Dr.getArgumentArray = function (src_args, omit_arg) {
		return Array.prototype.slice.call(src_args, omit_arg || 0);
	};
	Dr.logList = (function () {
		if (console.log.apply) {
			return function (arg_list) { console.log.apply(console, arg_list); }
		}
		else {
			return function (arg_list) { console.log(arg_list); }
		}
	})();
	Dr.assertList = (function () {
		if (console.assert.apply) {
			return function (arg_list) { console.assert.apply(console, arg_list); }
		}
		else {
			return function (arg_list) {
				var arg_list = arg_list || [];
				if (!arg_list[0]) {
					arg_list[0] = 'Assertion failed';
					throw new Error(arg_list);
				}
			}
		}
	})();
	
	console.log('[Dr] Init Module Manager...');
	
	Dr.ModuleManagerProto = (function () {
		var Module = function () {
			this._module_data_pool = {};
		}
		
		Module.prototype._module_init = function (module_name, module_type) { 
			this._module_data_pool[module_name] = {
				status: {
					declare: false,
					implement: false,
					load: false,
				},
				require: [],
				module: null,
				implement_func: null,
				type: module_type,
				name: module_name,
			};
		};
		Module.prototype._module_get = function (module_name) { 
			if (module_name 
				&& this._module_data_pool[module_name] 
				&& this._module_data_pool[module_name].status.load == true)
				return this._module_data_pool[module_name].module;
			else
				return null;
		};
		Module.prototype._module_set = function (module_name, module) {
			if (!this._module_data_pool[module_name]) {
				Dr.assert(false, '[_module_set] module not declared', module_name, module);
				return;
			}
			this._module_data_pool[module_name].module = module; 
			this._module_data_pool[module_name].status.load = true;
		};
		
		Module.prototype.declare =  function (module_name, module_type) {
			if (!module_name) {
				Dr.assert(false, '[declare] error declare nameless module');
				return;
			};
			if (this._module_data_pool[module_name]) {
				if (module_type != this._module_data_pool[module_name].type) {
					Dr.assert(false, '[declare] re-declare failed, type mismatch');
					return;
				}
				else {
					Dr.log('[declare] re-declare', module_name, module_type);
				}
			}
			this._module_init(module_name, module_type);
			this._module_data_pool[module_name].status.declare = true;
		};
		Module.prototype.implement =  function (module_name, module_implement_func) {
			if (!this._module_data_pool[module_name] || !this._module_data_pool[module_name].status.declare) {
				Dr.assert(false, '[implement] module not declared', module_name, module_implement_func);
				return;
			}
			
			this._module_data_pool[module_name].implement_func = module_implement_func;
			this._module_data_pool[module_name].status.implement = true;
		};
		Module.prototype.require =  function (module_name, required_module_name) {
			if (!this._module_data_pool[module_name] || !this._module_data_pool[module_name].status.declare) {
				Dr.assert(false, '[require] module not declared', module_name, required_module_name);
				return;
			}
			
			this._module_data_pool[module_name].require.push(required_module_name);
		};
		Module.prototype.load =  function (module_name) {
			if (!this._module_data_pool[module_name] || !this._module_data_pool[module_name].status.declare) {
				Dr.assert(false, '[load] module not declared', module_name);
				return;
			}
			
			
			var module_data = this._module_data_pool[module_name];
			
			if (typeof(module_data.implement_func) != 'function') {
				Dr.assert(false, '[load] missing module implement func', module_data.implement_func, 'for loading module', module_name);
				return;
			}
			
			if (module_data.status.load) return this._module_get(module_name);
			
			//loop for all required
			var require_name_list = module_data.require;
			for (var i in require_name_list) {
				if (!this._module_get(require_name_list[i])) {
					Dr.log('[load] missing required module', i, require_name_list[i], 'for loading module', module_name);
					return;
				}
			}
			
			var _this = this;	//for module get closure
			var module = module_data.implement_func(
				Dr.global, //access global (where Dr init runs in)
				function (module_name) { return _this._module_get(module_name); });	//packed module_get for access Required module
			
			this._module_set(module_name, module);
			Dr.log('[load] loaded', module_name);
			return this._module_get(module_name);
		};
		Module.prototype.loadAll = function () {
			var left_to_load = 'init';
			var last_left_to_load = 'init';
			
			while(left_to_load != 0) {
				Dr.debug(10, '[loadAll] start loop', left_to_load, last_left_to_load);
				
				last_left_to_load = left_to_load;
				left_to_load = 0;
				var left_module_name_list = [];
				
				for (var module_name in this._module_data_pool) {
					var module_data = this._module_data_pool[module_name];
					if (module_data.status.load == false) {
						this.load(module_name);
						if (module_data.status.load == false) {	//not the time
							left_to_load += 1;
							left_module_name_list.push(module_name);
						}
					}
				}
				
				if (last_left_to_load == left_to_load) {
					Dr.assert(false, '[loadAll] ' + left_to_load + ' left ot load, infinite loop load?');
					return;
				}
			}
		};
		
		Module.prototype.get = function (module_name) {
			return this._module_get(module_name);
		};
		
		return Module;
	})()
	
	//quick access
	Dr.ModuleManager = new Dr.ModuleManagerProto;
	Dr.Declare = function (module_name, module_type) { Dr.ModuleManager.declare(module_name, module_type); }
	Dr.Require = function (module_name, required_module_name) { Dr.ModuleManager.require(module_name, required_module_name); }
	Dr.Implement = function (module_name, module_implement_func) { Dr.ModuleManager.implement(module_name, module_implement_func); }
	Dr.LoadAll = function () { Dr.ModuleManager.loadAll(); }
	Dr.Get = function (module_name) { return Dr.ModuleManager.get(module_name); }
	Dr.GetNew = function (/* module_name, args for new */) {
		var arg_list = Dr.getArgumentArray(arguments);
		var module_name = arg_list.shift();
		var module = Dr.ModuleManager.get(module_name);
		if (module) {
			function wrapper () { return module.apply(this, arg_list); };
			wrapper.prototype = module.prototype;
			return new wrapper();
		}
	}
	
	
	
	// Check Function & add Fall-back(polyfill)
	console.log('[Dr] Checking Function & Add Fall-back...');
	
	// Add Date.now fall-back
	Date.now = Date.now || function() { return new Date().getTime(); };
	
	//JavaScript
	console.log('[Dr] Adding Pure JavaScript Functions...');
	
	//time related
	Dr.getUTCTimeStamp = function () { return Math.floor(Date.now() / 1000); };
	Dr.startTimestamp = Dr.getUTCTimeStamp();
	Dr.startClock = Date.now();
	Dr.clock = function () { return (Date.now() - Dr.startClock); }; //return running time in milliseconds
	Dr.clockPerSec = 1000;
	Dr.now = function () { return (Date.now() - Dr.startClock) / Dr.clockPerSec; };	//return running time in seconds
	
	//math related
	var get_random_int = function (from, to) { //this will not auto swap, meaning <from> should be smaller than <to>
		var res = Math.floor(Math.random() * (to - from + 1) + from);
		if (res == to + 1) return get_random_int(from, to);
		return res;
	}
	Dr.getRandomInt = function (range_01, range_02) {
		var range_02 = range_02 || 0;
		var from = Math.min(range_01, range_02);
		var to = Math.max(range_01, range_02);
		return get_random_int(from, to);
	};
	Dr.getRandomIntMulti = function (range_01, range_02, count) { //the result will be from small to big
		var from = Math.min(range_01, range_02);
		var to = Math.max(range_01, range_02);
		var count = Math.min(count, (to - from + 1));
		var res = [];
		for (var i = 0; i < count; i++) {
			var new_rand = get_random_int(from, to - i);
			for (var j = 0; j < res.length; j++) {
				if (res[j] <= new_rand) new_rand++;
				else break;
			}
			res.splice(j, 0, new_rand);
		}
		return res;
	};
	Dr.rollDice = function () { return Dr.getRandomInt(1, 100); };
	
	
	
	
	
	
	
	//extend
	console.log('[Dr] Adding Extend Function...');
	
	Dr.loop = function (loop_time, loop_func) {
		var looped_time = 0;
		while (loop_time > looped_time) {
			loop_func(looped_time);
			looped_time++;
		};
	};
	
	Dr.onNextProperUpdate = (function () {
		switch (Dr.environment) {
			case 'browser':
			case 'cordova':
				return function (callback) { Dr.window.requestAnimationFrame(callback); };
			case 'node':
				return function (callback) { setTimeout(callback, 1000 / 60); };
		}
	})();
	
	Dr.pick = function (pack, key) {
		if (pack instanceof Object) {
			var temp = pack[key];
			delete pack[key];
			return temp;
		}
	}
	
	Dr.reverseKeyValue = function (pack, key_override) {
		var reverse_pack = {};
		for (var key in pack) reverse_pack[pack[key]] = key_override || key;
		return reverse_pack;
	}
	
	Dr.combine = function (base, addon) {
		var result = (base instanceof Array && addon instanceof Array) ? [] : {};
		for (var i in base) result[i] = base[i];
		for (var i in addon) result[i] = addon[i];
		return result;
	};
	
	Dr.arrayCopy = function (array) {
		return Array.prototype.slice.call(array);
	};
	
	Dr.arrayDeduplication = function () {
		var array_list = Dr.getArgumentArray(arguments);
		var temp_object = {};
		for (var i in array_list) {
			var array = array_list[i];
			for (var j in array) temp_object[array[j]] = true;
		};
		var res_array = array_list[0];
		res_array.length = 0;
		for (var key in temp_object) res_array.push(key);
		return res_array;
	};
	
	//only safe within one runtime
	Dr.generateId = function () {
		//var symbol_list = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');	//full 62
		var symbol_list = '0123456789ACEFGHJKLMNPQRSTUVWXYZ'.split('');	//lite 32, easy to recognise
		var symbol_count = symbol_list.length;
		var result_count = 20;
		var index_list = [];
		var result_list = [];
		for (var i = 0; i < result_count; i++) {
			index_list[i] = 0;
			result_list[i] = symbol_list[index_list[i]];
		}
		return function () {
			//update index snd char
			//for (var i = 0; i < result_count; i++) {
			for (var i = result_count - 1; i >= 0; i--) {
				index_list[i] = (index_list[i] + 1) % symbol_count;
				result_list[i] = symbol_list[index_list[i]];
				if (index_list[i] > 0) break;
			}
			//get string
			return result_list.join('');
		};
	}();
	
	Dr.log = function () {
		var arg_list = Dr.getArgumentArray(arguments);
		Dr.logList(arg_list);
	}
	Dr.debugLogLevel = 0;
	Dr.debug = function (debug_level) {
		if (!Dr.debugLogLevel || Dr.debugLogLevel > debug_level) return;
		var arg_list = Dr.getArgumentArray(arguments);
		arg_list.shift();
		Dr.logList(arg_list);
	}
	
	Dr.assert = function () {
		var arg_list = Dr.getArgumentArray(arguments);
		if (!Dr.debugLogLevel && Dr.debugLogLevel > 10) Dr.logList((['[' + Dr.now().toFixed(4) + 'sec]', '[assert]']).concat(arg_list));
		Dr.assertList(arg_list);
	}
	
	Dr.inspect = function (target) {
		Dr.log('[Inspect]', target);
		Dr.log('type: <' + typeof(target) + '>');
		
		var object_constructor = {
			Array: Array,
			Function: Function,
			Object: Object,
		};
		
		if (typeof(target) == 'object') {
			//Name - Instance Creator
			for (var i in object_constructor) {
				if (target instanceof object_constructor[i]) {
					Dr.log('Instance of: <' + i + '>')
				}
			}
		}
	};
	
	
	
	
	
	
	
	
	Dr.Declare('LogProto', 'class');
	Dr.Implement('LogProto', function (global, module_get) {
		var Module = function () {
			this._is_show_debug = false;
			this._show_debug_level = 1;	//0 = normal log
			this._is_record_history = true;
			this._log_history = [];
		}
		Module.prototype.log = function () {
			var arg_list = Dr.getArgumentArray(arguments);
			arg_list.unshift('[' + Dr.now().toFixed(4) + 'sec]');
			Dr.logList(arg_list);
			if (this._is_record_history) this._log_history.push(arg_list);
		}
		Module.prototype.debug = function (debug_level) {
			var arg_list = Dr.getArgumentArray(arguments);
			arg_list.shift();	//drop debug level
			if (debug_level && debug_level > 0) arg_list.unshift('{' + debug_level + '}');
			arg_list.unshift('[' + Dr.now().toFixed(4) + 'sec]');
			if (!debug_level || (this._is_show_debug && debug_level >= this._show_debug_level)) Dr.logList(arg_list);
			if (this._is_record_history) this._log_history.push(arg_list);
		}
		Module.prototype.setDebug = function (debug_level) {
			var debug_level = debug_level || 0;
			this._is_show_debug = (debug_level > 0);
			this._show_debug_level = debug_level;	//0 = normal log
		}
		Module.prototype.getHistory = function () {
			return this._log_history;
		}
		Module.prototype.setRecordHistory = function (is_record_history) {
			this._is_record_history = is_record_history;
		}
		return Module;
	});
		
		
	Dr.Declare('EventProto', 'class');
	Dr.Implement('EventProto', function (global, module_get) {
		var Module = function () {
			this._event_data = [];
		}
		
		Module.prototype._get_callback_list = function (event_key) {
			if (!this._event_data[event_key]) this._event_data[event_key] = [];
			return this._event_data[event_key];
		}
		
		Module.prototype.addEventListener = function (event_key, callback) {
			if (!callback && typeof(callback) != 'function') {
				Dr.assert(false, 'callback error', callback);
				return;
			}
			
			var event_key = event_key || this._event_data.length;
			var callback_list = this._get_callback_list(event_key);
			
			for (var i in callback_list) {
				if (callback_list[i] == callback) {
					Dr.assert(false, 'callback already exist');
					return;
				}
			}
			
			callback_list.push(callback);
			
			return event_key;
		}
		
		Module.prototype.removeEventListener = function (event_key, org_callback) {
			var callback_list = this._get_callback_list(event_key);
			for (var i in callback_list) {
				if (callback_list[i] == org_callback) {
					callback_list.splice(i, 1);
					return org_callback;
				}
			}
			return null;
		}
		
		Module.prototype.removeEventKey = function (event_key) {
			this._event_data[event_key] = null;
		}
		
		Module.prototype.removeAll = function () {
			this._event_data = [];
		}
		
		Module.prototype.emit = function (event_key) {
			Dr.debug(5, "[emit] Get", event_key)
			
			var args = Dr.getArgumentArray(arguments, 1);
			args.unshift(event_key);
			
			var callback_list = this._get_callback_list(event_key);
			for (var i in callback_list) {
				callback_list[i].apply(null, args);
			}
		}
		
		return Module;
	});
	
	
	Dr.Declare('UpdateLoopProto', 'class');
	Dr.Implement('UpdateLoopProto', function (global, module_get) {
		var Module = function () {
			this._last_update_clock = Dr.clock();
			this._is_active = false;
			this.clear();	
			//prepare a update closure
			var _this = this;
			this._update_func = function () { _this.update(); };
		}
		
		Module.prototype.start = function () {
			this._is_active = true;
			Dr.onNextProperUpdate(this._update_func);
		}
		Module.prototype.stop = function () { 
			this._is_active = false; 
		}
		Module.prototype.clear = function () { 
			this._update_list = []; //index non-constant, will be refreshed on every update
			this._update_map = {};	//key constant, will be refreshed on every update
		}
		Module.prototype.add = function (update_func, key) { 
			if (key) this._update_map[key] = update_func;
			else this._update_list.push(update_func); 
		}
		Module.prototype.update = function () {
			var current_update_clock = Dr.clock();
			var delta_sec = (current_update_clock - this._last_update_clock) / Dr.clockPerSec;
			this._last_update_clock = current_update_clock;
			
			var next_update_list = [];
			for (index in this._update_list) {
				var is_keep_for_next_update = this._update_list[index](delta_sec);
				if (is_keep_for_next_update) next_update_list.push(this._update_list[index]);
			}
			this._update_list = next_update_list;
			
			var next_update_map = {};
			for (key in this._update_map) {
				var is_keep_for_next_update = this._update_map[key](delta_sec);
				if (is_keep_for_next_update) next_update_map[key] = this._update_map[key];
			}
			this._update_map = next_update_map;
			//Dr.log('Dr.Update', delta_sec);
			
			if (this._is_active) Dr.onNextProperUpdate(this._update_func);
			else Dr.debug(10, '[UpdateLoop] Stopped');
		}
		
		
		return Module;
	});
	
	//Toggle utility
	//A toggle that save and flip the value
	Dr.Declare('ToggleProto', 'class');
	Dr.Implement('ToggleProto', function (global, module_get) {
		var Module = function () {
			//
		}
		
		Module.prototype.toggle = function (key, value) {
			if (value == undefined) this[key] = !this[key];
			else this[key] = value;
			Dr.debug(5, '[Toggle]', key, value, this[key]);
		}
		
		return Module;
	});
	
	Dr.LoadAll();
	
	Dr.Event =Dr.GetNew('EventProto');
	
	Dr.UpdateLoop = Dr.GetNew('UpdateLoopProto');
	
	/* currently no need
	Dr.Log = Dr.GetNew('LogProto');
	Dr.log = function () { Dr.Log.log.apply(Dr.Log, Dr.getArgumentArray(arguments)); }
	Dr.debug = function (debug_level) { Dr.Log.debug.apply(Dr.Log, Dr.getArgumentArray(arguments)); }
	Dr.setDebug = function (debug_level) { Dr.Log.setDebug.apply(Dr.Log, Dr.getArgumentArray(arguments)); }
	*/
	
	Dr.Toggle = Dr.GetNew('ToggleProto');
	Dr.toggle = function () { Dr.Toggle.toggle.apply(Dr.Toggle, Dr.getArgumentArray(arguments)); }
	
	
	Dr.loadLocalScript = (function () {
		switch (Dr.environment) {
			case 'browser':
			case 'cordova':
				return function (script_src, callback) {
					var script_element = document.createElement('script');
					script_element.type = 'text/javascript';
					script_element.async = false;
					script_element.src = script_src;
					script_element.onload = function () { if (callback) callback(script_element); };
					var exist_script_element = document.getElementsByTagName('script')[0];
					exist_script_element.parentNode.insertBefore(script_element, exist_script_element);
				};
			case 'node':
				return function (script_src, callback) {
					var script_src = Dr.getLocalPath(script_src);
					
					try {
						var Fs = require('fs');
						var Vm = require('vm');
						var script_data = Fs.readFileSync(script_src);
						Vm.runInThisContext(script_data.toString(), script_src);
						if (callback) callback(null);
					}
					catch (error) {
						Dr.log('[loadLocalScript] Failed to load Script', script_src, 'Error', error);
						if (error.stack) Dr.log(error.stack);
					};
				};
		}
	})();
	
	console.log('[Dr] Adding Environment Specific Functions...');
	
	switch (Dr.environment) {
		case 'browser':
		case 'cordova':
			//Dr.loadLocalScript('./Dr.browser.js');
			break;
		case 'node':
			//Dr.loadLocalScript('./Dr.node.js');
			global.Dr = Dr;
			module.exports = Dr;
			
			Dr.nodeExePath = process.argv[0];
			Dr.require = require;
			
			var Path = require('path');
			Dr.nodeStartScriptPath = Path.resolve(process.cwd(), Path.dirname(process.argv[1]));
			Dr.getLocalPath = function (relative_path) {
				return Path.resolve(Dr.nodeStartScriptPath, relative_path);
			}
			Dr.startREPL = function () {
				var Repl = require("repl");
				Repl.start({
					prompt: 'Dr.node> ',
					input: process.stdin,
					output: process.stdout,
					useGlobal: true,
				});
			}
			
			Dr.debug(10, 'nodeStartScriptPath:', Dr.nodeStartScriptPath);
			break;
	}
	
	console.log('[Dr] Finished Initialize.');
	
	return Dr;
})();