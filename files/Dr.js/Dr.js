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
	
	//this will not auto swap
	var _get_random_int = function (from, to) {
		//var from = range_smaller;
		//var to = range_bigger;
		var res = Math.floor(Math.random() * (to - from + 1) + from);
		if (res == to + 1) return _get_random_int(from, to);
		return res;
	}
	
	
	// Pack required
	var _collect_required = function () {
		return {
			//JavaScript only
			clock: Date.now,
			clock_per_sec: 1000,
			getUTCTimeStamp: function () {
				return Math.floor(Date.now() / 1000);
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
			get_random_int: function (range_01, range_02) {
				var from = Math.min(range_01, range_02);
				var to = Math.max(range_01, range_02);
				return _get_random_int(from, to);
			},
			get_random_int_multi: function (range_01, range_02, count) {
				var from = Math.min(range_01, range_02);
				var to = Math.max(range_01, range_02);
				var count = Math.min(count, (to - from));
				
				var res = new Array();
				for (var i = 0; i < count; i++) {
					var new_rand = _get_random_int(from, to - i);
					var j;
					for (j = 0; j < res.length; j++) {
						if (res[j] <= new_rand) 
							new_rand++;
						else 
							break;
					}
					res.splice(j, 0, new_rand);
				}
				return res;
			},

			
			
			
			
			
			//document related
			loadScript: function (script_src, callback) {
				console.log('Loading Script:', script_src);
				var script_element = document.createElement('script');
				script_element.type = 'text/javascript';
				script_element.async = true;
				script_element.src = script_src;
				script_element.onload = callback;
				//script_element.onload = 'Dr.log("sdfsdfdsfdsfdsfdsf")';
				//script_element.onload = function () {
				//	Dr.log("sdfsdfdsfdsfdsfdsf")	
				//};
				//script_element.onload = onload_script_string; //'Dr.Event.Emit("Loaded", ' + event_key + ')';
				var exist_script_element = document.getElementsByTagName('script')[0];
				exist_script_element.parentNode.insertBefore(script_element, exist_script_element);
			},
			addPastTextListener: function (callback) {
				document.addEventListener("paste", function(event) {
					//get content
					var content;
					if (event.clipboardData) {
						content = (event.originalEvent || event).clipboardData.getData('text/plain');
					}
					else if (window.clipboardData) {
						content = window.clipboardData.getData('Text');
					}
					
					//pass on
					callback(event, content);
					
					var sample_process_func = function (event, content) {
						//cut the text content off the event chain
						event.preventDefault();
						
						theClipBoardData = content;
						alert("get Pasted ClipBoard Data!");
						
						var appendInfo = "[All Data is here]";
						
						if (theClipBoardData.length > 200) {appendInfo = "[Displayed only part of data for speed]"}
						
						document.getElementById('B_DataA').value = "[Data from ClipBoard] \n" + theClipBoardData.slice(0, 200) + "\n" + appendInfo;
					};
				});
			},
			createTextDownload: function (filename, text) {
				var tag = document.createElement('a');
				tag.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
				tag.setAttribute('download', filename);
				tag.click();
			},
			
			
			
			//window related
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
			addWindowResizeListener: function (callback) {
				var event = "onorientationchange" in window ? "orientationchange" : "resize";
				window.addEventListener(event, callback);
			},
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
	Dr.get_random_int = _required_native.get_random_int;
	Dr.get_random_int_multi = _required_native.get_random_int_multi;
	Dr.onNextScreenUpdate = _required_native.onNextScreenUpdate;
	Dr.createTextDownload = _required_native.createTextDownload;
	Dr.loadScript = _required_native.loadScript;
	Dr.loadScriptByList = function (script_src_list, callback) {
		var loop_load_script = function () {
			Dr.log("[loadScriptByList]", script_src_list);
			if (script_src_list.length <= 0) 
				callback();
			else
				Dr.loadScript(script_src_list.shift(), loop_load_script);
		}
		//start loop
		loop_load_script();
	};
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
			this._key_callback_list = [];
		}
		
		Event.prototype.subscribe = function (event_key, callback) {
			if (!callback && typeof(callback) != 'function') {
				Dr.log('callback error', callback);
				return;
			}
			
			if (event_key) {
				this._key_callback_list[event_key] = this._key_callback_list[event_key] || [];
			}
			else {
				event_key = this._key_callback_list.push([]) - 1;	//get a vacant key
			}
			
			var callback_list = this._key_callback_list[event_key];
			for (var i in callback_list) {
				if (callback_list[i] = callback) {
					Dr.log('callback already exist');
					return;
				}
			}
			
			callback_list.push(callback);
			
			return event_key;
		}
		
		Event.prototype.unsubscribe = function (event_key, org_callback) {
			this._key_callback_list[event_key] = this._key_callback_list[event_key] || [];
			var callback_list = this._key_callback_list[event_key]
			for (var i in callback_list) {
				if (callback_list[i] = org_callback) {
					callback_list.splice(i, 1);
					return org_callback;
				}
			}
			return null;
		}
		
		Event.prototype.unsubscribeKey = function (event_key) {
			this._key_callback_list[event_key] = null;
		}
		
		Event.prototype.unsubscribeAll = function () {
			this._key_callback_list = [];
		}
		
		Event.prototype.emit = function (event_key) {
			Dr.log("[Event.prototype.emit] Get", event_key)
			
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
				alert('[ModuleManager.prototype._module_set] module not declared', module_name, module);
				debugger;
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
				alert('[ModuleManager.prototype.implement] module not declared', module_name, module_implement_func);
				
				debugger;
				return;
			}
			
			this._module_data_pool[module_name].implement_func = module_implement_func;
			this._module_data_pool[module_name].status.implement = true;
		};
		ModuleManager.prototype.require =  function (module_name, required_module_name) {
			if (!this._module_data_pool[module_name] 
				|| !this._module_data_pool[module_name].status.declare) {
				alert('[ModuleManager.prototype.require] module not declared', module_name, required_module_name);
				
				debugger;
				return;
			}
			
			this._module_data_pool[module_name].require.push(required_module_name);
		};
		ModuleManager.prototype.load =  function (module_name) {
			if (!this._module_data_pool[module_name] 
				|| !this._module_data_pool[module_name].status.declare) {
				alert('[ModuleManager.prototype.load] module not declared', module_name);
				
				debugger;
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
		ModuleManager.prototype.loadAll = function () {
			var left_to_load = -1;
			var last_left_to_load = 0;
			
			while(left_to_load != 0) {
				Dr.log('[loadAll] start', left_to_load, last_left_to_load);
				
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
	
	Dr.Declare = function (module_name, module_type) { Dr.ModuleManager.declare(module_name, module_type); }
	Dr.Require = function (module_name, required_module_name) { Dr.ModuleManager.require(module_name, required_module_name); }
	Dr.Implement = function (module_name, module_implement_func) { Dr.ModuleManager.implement(module_name, module_implement_func); }
	Dr.LoadAll = function () { Dr.ModuleManager.loadAll(); }
	Dr.Get = function (module_name) { return Dr.ModuleManager.get(module_name); }
	
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

Dr.ModuleManager.loadAll();
*/

