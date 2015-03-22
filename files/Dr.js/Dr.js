// Js Dr Bean Dr.Eames
var DrAuthor = 'Bean/Dr.Eames';
var DrVersion = '0.11';

var Dr = (typeof(Dr) == 'function' && Dr.author == DrAuthor && Dr.verion >= DrVersion) ? Dr : (function (window, undefined) {
	
	// Check Function & add Fall-back(polyfill)
	console.log('[Dr] Checking Function & add Fall-back...');
	
	// Add Date.now fall-back
	Date.now = Date.now || function() { return new Date().getTime(); };
	
	// Add setTime/Interval fall-back
	(function (wraper) {
	window.setTimeout = wraper(window.setTimeout);
	window.setInterval = wraper(window.setInterval);
	})(function (native_set_func) {
		return function(func, delay){
			var org_this = this;	//keep this
			var args = Array.prototype.slice.call(arguments, 2);  //preserve tailing args
			return native_set_func(function() { func.apply(org_this, args); }, delay);
		}
	});
	
	// Add requestAnimationFrame fall-back
	window.requestAnimationFrame = (function () {
	  return window.requestAnimationFrame ||
	  window.webkitRequestAnimationFrame ||
	  window.mozRequestAnimationFrame ||
	  function (callback) {
		window.setTimeout(callback, 1000 / 60);
	  };
	})();
	
	// Pack required
	var _collect_required = function () {
		return {
			clock: Date.now,
			clock_per_sec: 1000,
			getUTCTimeStamp: function () {
				return Math.floor(Date.now() / 1000);
			},
			onNextScreenUpdate: function (callback) {
				return window.requestAnimationFrame(callback);
			},
			setDelayCallback: function (callback, delay, is_once) { 
				var set_func;
				var clear_func;
				if (is_once) {
					set_func = window.setInterval;
					clear_func = window.clearInterval;
				}
				else {
					set_func = window.setTimeout;
					clear_func = window.clearTimeout;
				}
				var delay_callback_id = set_func(callback, delay);
				return function () {clear_func(delay_callback_id)}
			},
			clearDelayCallback: function (delay_callback_clear_func) {
				if (delay_callback_clear_func) {
					delay_callback_clear_func();
				}
				else {
					window.clearTimeout();
					window.clearInterval();
				}
			},
			loadScript: function (script_src, onload_script_string) {
				console.log('Loading Script:', script_src);
				var script_element = document.createElement('script');
				script_element.type = 'text/javascript';
				script_element.async = true;
				script_element.src = script_src;
				script_element.onload = onload_script_string; //'Dr.Event.Emit("Loaded", ' + event_key + ')';
				var exist_script_element = document.getElementsByTagName('script')[0];
				exist_script_element.parentNode.insertBefore(script_element, exist_script_element);
			},
			getArgumentArray: function (src_args, omit_arg) {
				return Array.prototype.slice.call(src_args, omit_arg || 0);
			},
			logList: (function () {
				if (console.log.apply) {
					return function (arg_list) {
						console.log.apply(console, arg_list);
					}
				}
				else {
					return function (arg_list) {
						console.log(arg_list);
					}
				}
			})(),
		};
	}
	
	
	
	
	// Required Non-Standard-JavaScript Methods
	console.log('[Dr] Collecting Required...');
	var _required_native = _collect_required();
	
	
	// Dr Initialize
	console.log('[Dr] Initializing...');
	
	var Dr = function () {
		Dr.log('[Dr] A Frame by ' + DrAuthor);
		Dr.log('[Dr] Version ' + DrVersion);
	}
	
	Dr.author = DrAuthor;
	Dr.verion = DrVersion;
	
	Dr.global = window;	//normally window
	Dr.window = window;	//normally window, always in fact
	Dr.document = document;	//normally document, always in fact
	
	
	
	Dr.now = _required_native.clock;
	Dr.getUTCTimeStamp = _required_native.getUTCTimeStamp;
	Dr.startClock = Dr.now();
	Dr.startTimestamp = Dr.getUTCTimeStamp();
	Dr.clock = function () { return (Dr.now() - Dr.startClock); };
	Dr.clock_per_sec = _required_native.clock_per_sec;
	Dr.onNextScreenUpdate = _required_native.onNextScreenUpdate;
	Dr.loadScript = _required_native.loadScript;
	Dr.getArgumentArray = _required_native.getArgumentArray;
	Dr.logList = _required_native.logList;
	Dr.Log = (function () {
		var Log = function () {
			this._log_history = [];
		}
		
		Log.prototype.log = function () {
			var arg_list = Dr.getArgumentArray(arguments);
			arg_list.unshift('[' + ((Dr.now() - Dr.startClock) / Dr.clock_per_sec) + 'sec]');
			this._log_history.push(arg_list);
			Dr.logList(arg_list);
		}
		
		Log.prototype.get_history = function () {
			return this._log_history;
		}
		
		return new Log;
	})()
	
	Dr.log = function () {
		Dr.Log.log.apply(Dr.Log, Dr.getArgumentArray(arguments));
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
	
	Dr.Event = (function () {
		var Event = function () {
			this._key_callback_list = {};
		}
		
		Event.prototype.Subscribe = function (event_key, callback) {
			if (!callback && typeof(callback) != 'function') {
				Dr.log('callback error', callback);
				return;
			}
			
			this._key_callback_list[event_key] = this._key_callback_list[event_key] || [];
			var callback_list = this._key_callback_list[event_key]
			for (var i in callback_list) {
				if (callback_list[i] = callback) {
					Dr.log('callback already exist');
					return;
				}
			}
			
			callback_list.push(callback);
		}
		
		Event.prototype.Unsubscribe = function (event_key, org_callback) {
			this._key_callback_list[event_key] = this._key_callback_list[event_key] || [];
			var callback_list = this._key_callback_list[event_key]
			for (var i in callback_list) {
				if (callback_list[i] = org_callback) {
					callback_list.splice(i, 1);
					return;
				}
			}
		}
		
		Event.prototype.UnsubscribeKey = function (event_key) {
			this._key_callback_list[event_key] = [];
		}
		
		Event.prototype.UnsubscribeAll = function () {
			this._key_callback_list = [];
		}
		
		Event.prototype.Emit = function (event_key) {
			var args = Dr.getArgumentArray(arguments, 1);
			args.unshift(event_key);
			
			this._key_callback_list[event_key] = this._key_callback_list[event_key] || [];
			var callback_list = this._key_callback_list[event_key]
			for (var i in callback_list) {
				callback_list[i].apply(null, args);
			}
		}
		
		return new Event;
	})()
	
	
	Dr.ModuleManager = (function () {
		/*
			Dr Module can be a function or an object
			module_type can be: function, object, ...
		*/
		var ModuleManager = function () {
			this._module_data_pool = {};
		}
		
		ModuleManager.prototype._module_init = function (module_name, module_type) { 
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
		ModuleManager.prototype._module_get = function (module_name) { 
			//Dr.log('_module_get', module_name, this._module_data_pool);
			if (module_name 
				&& this._module_data_pool[module_name] 
				&& this._module_data_pool[module_name].status.load == true)
				return this._module_data_pool[module_name].module;
			else
				return null;
		};
		ModuleManager.prototype._module_set = function (module_name, module) {
			if (!this._module_data_pool[module_name]) {
				alert('module not declared');
				return;
			}
			this._module_data_pool[module_name].module = module; 
			this._module_data_pool[module_name].status.load = true;
		};
		
		ModuleManager.prototype.declare =  function (module_name, module_type) {
			if (!module_name) {
				alert('error declare nameless module');
				return;
			};
			if (this._module_data_pool[module_name]) {
				if (module_type != this._module_data_pool[module_name].type) {
					alert('re-declare type mismatch');
					return;
				}
				else {
					Dr.log('re-declare', module_name, module_type);
				}
			}
			this._module_init(module_name, module_type);
			this._module_data_pool[module_name].status.declare = true;
		};
		ModuleManager.prototype.implement =  function (module_name, module_implement_func) {
			if (!this._module_data_pool[module_name] 
				|| !this._module_data_pool[module_name].status.declare) {
				alert('module not declared');
				return;
			}
			
			this._module_data_pool[module_name].implement_func = module_implement_func;
			this._module_data_pool[module_name].status.implement = true;
		};
		ModuleManager.prototype.require =  function (module_name, required_module_name) {
			if (!this._module_data_pool[module_name] 
				|| !this._module_data_pool[module_name].status.declare) {
				alert('module not declared');
				return;
			}
			
			this._module_data_pool[module_name].require.push(required_module_name);
			this._module_data_pool[module_name].status = 'required';
		};
		ModuleManager.prototype.load =  function (module_name) {
			if (!this._module_data_pool[module_name] 
				|| !this._module_data_pool[module_name].status.declare) {
				alert('module not declared');
				return;
			}
			
			var module_data = this._module_data_pool[module_name];
			
			if (module_data.status.load) {
				return;
			}
			
			Dr.log('try load module', module_name);
			
			//loop for all required
			var require_name_list = module_data.require;
			var all_requirment_meet = true;
			for (var i in require_name_list) {
				if (!this._module_get(require_name_list[i])) {
					Dr.log('missing required module', i, require_name_list[i], 'for loading module', module_name);
					all_requirment_meet = false;
				}
			}
			
			if (typeof(module_data.implement_func) != 'function') {
				Dr.log('missing module implement func', module_data.implement_func, 'for loading module', module_name);
				all_requirment_meet = false;
			}
			
			if (all_requirment_meet) {
				var _this = this;	//for module get closure
				var module = module_data.implement_func(this.global, function (module_name) {
					return _this._module_get(module_name);
				});
				this._module_set(module_name, module);
				Dr.log('loaded', module_name);
			}
			else
				return;
		};
		ModuleManager.prototype.loop_load = function () {
			var left_to_load = -1;
			var last_left_to_load = 0;
			
			while(left_to_load != 0) {
				//Dr.log('load loop===', left_to_load, last_left_to_load);
				
				if (last_left_to_load == left_to_load) {
					alert('last_left_to_load == left_to_load, infinite loop load?');
					break;
				}
				
				last_left_to_load = left_to_load;
				left_to_load = 0;
				
				for (var module_name in this._module_data_pool) {
					var module_data = this._module_data_pool[module_name];
					if (module_data.status.load == false) {
						this.load(module_name);
						if (module_data.status.load == true)
							Dr.log('loop loaded', module_name);
						else
							left_to_load += 1;
					}
				}
			}
			
		};
		
		ModuleManager.prototype.get = function (module_name) {
			return this._module_get(module_name);
		};
		
		return new ModuleManager;
	})()
	
	
	
	Dr.UpdateLoop = (function () {
		var UpdateLoop = function () {
			this._update_list = [];	//non-constant, will be refreshed on every update
			this._last_update_clock = Dr.clock();
			this._is_active = false;
			
			//prepare a update closure
			var o_this = this;
			this._update_func = function () {
				o_this.update();
			}
		}
		
		UpdateLoop.prototype.update = function () {
			var current_update_clock = Dr.clock()
			var delta_sec = (current_update_clock - this._last_update_clock) / Dr.clock_per_sec;
			this._last_update_clock = current_update_clock
			
			//Dr.log('Dr.Update', delta_sec);
			var next_update_list = [];
			for (index in this._update_list) {
				var is_keep_update = this._update_list[index](delta_sec);
				if (is_keep_update) {
					next_update_list.push(this._update_list[index]);
				}
			}
			this._update_list = next_update_list;
			//Dr.log('Dr.Update', delta_sec);
			
			if (this._is_active)
				Dr.onNextScreenUpdate(this._update_func);
			else
				Dr.log('[UpdateLoop] Stopped');
		}
		
		
		UpdateLoop.prototype.start = function () {
			if (this._is_active)
				return;
			
			this._is_active = true;
			this._update_func();
		}
		
		UpdateLoop.prototype.stop = function () {
			this._is_active = false;
		}
		
		UpdateLoop.prototype.clear = function () {
			this._update_list = [];
		}
		
		UpdateLoop.prototype.add = function (update_func) {
			this._update_list.push(update_func);
		}
		
		return new UpdateLoop;
	})()
	
	
	return Dr;
})(window);

/*
Dr.ModuleManager.declare('test_module', 'class');
Dr.ModuleManager.implement('test_module', function (global, module_get) {
	Dr.log('testing... test_module');
	
	var aaa = module_get('aaa');
	Dr.log('testing... module_get', aaa);
	
	return Dr;
});
Dr.ModuleManager.require('test_module', 'aaa');
//Dr.ModuleManager.load('test_module');



Dr.ModuleManager.declare('aaa', 'class');
Dr.ModuleManager.implement('aaa', function (global, module_get) {
	Dr.log('testing... aaa');
	return Dr;
});
//Dr.ModuleManager.require('aaa');
//Dr.ModuleManager.load('test_module');

Dr.ModuleManager.loop_load();
*/

