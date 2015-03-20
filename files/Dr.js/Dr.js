// Js Dr Bean Dr.Eames
var DrAuthor = 'Bean/Dr.Eames';
var DrVersion = '0.1';

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
				var script_element = document.createElement('script');
				script_element.type = 'text/javascript';
				script_element.async = true;
				script_element.src = script_src;
				script_element.onload = onload_script_string; //'Dr.Event.Emit("Loaded", ' + event_key + ')';
				var exist_script_element = document.getElementsByTagName('script')[0];
				exist_script_element.parentNode.insertBefore(script_element, exist_script_element);
			},
			getArgumentArray: function (src_args, omit_arg) {
				var omit_arg = omit_arg || 0;
				return Array.prototype.slice.call(src_args, omit_arg);
			},
			
		};
	}
	
	// Required Non-Standard-JavaScript Methods
	console.log('[Dr] Collecting Required...');
	var _required_native = _collect_required();
	
	
	// Dr Initialize
	console.log('[Dr] Initializing...');
	
	var Dr = function () {
		console.log('[Dr] A Frame by ' + DrAuthor);
		console.log('[Dr] Version ' + DrVersion);
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
	
	
	Dr.inspect = function (target) {
		console.log('[Inspect]', target);
		console.log('type: <' + typeof(target) + '>');
		
		var object_constructor = {
			Array: Array,
			Function: Function,
			Object: Object,
		};
		
		if (typeof(target) == 'object') {
			//Name - Instance Creator
			for (var i in object_constructor) {
				if (target instanceof object_constructor[i]) {
					console.log('Instance of: <' + i + '>')
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
				console.log('callback error', callback);
				return;
			}
			
			this._key_callback_list[event_key] = this._key_callback_list[event_key] || [];
			var callback_list = this._key_callback_list[event_key]
			for (var i in callback_list) {
				if (callback_list[i] = callback) {
					console.log('callback already exist');
					return;
				}
			}
			
			callback_list.push(callback);
		}
		
		Event.prototype.Unsubscribe = function (event_key, callback) {
			this._key_callback_list[event_key] = this._key_callback_list[event_key] || [];
			var callback_list = this._key_callback_list[event_key]
			for (var i in callback_list) {
				if (callback_list[i] = callback) {
					callback_list.splice(i, 1);
					return;
				}
			}
		}
		
		Event.prototype.Emit = function (event_key) {
			var args = Array.prototype.slice.call(arguments, 1);
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
			this._module_pool = {};
			this._loaded_module_pool = {};
		}
		
		ModuleManager.prototype._module_init = function (module_name, module_type) { 
			this._module_pool[module_name] = {
				status: 'declared',
				require: [],
				module: null,
				implement_func: null,
				type: module_type,
				name: module_name,
			};
			
			this._loaded_module_pool[module_name] = 'just declared';
		};
		ModuleManager.prototype._module_get = function (module_name) { 
			//console.log('_module_get', module_name, this._module_pool);
			//return this._loaded_module_pool[module_name];
			
			if (this._module_pool[module_name] && this._module_pool[module_name].status == 'loaded')
				return this._module_pool[module_name].module;
			else
				return null;
				//alert('get module failed! name: ' + module_name);
		};
		ModuleManager.prototype._module_set = function (module_name, module) {
			if (!this._module_pool[module_name]) {
				alert('module not declared');
				return;
			}
			this._module_pool[module_name].module = module; 
			this._module_pool[module_name].status = 'loaded';
			
			this._loaded_module_pool[module_name] = module;
		};
		
		ModuleManager.prototype.declare =  function (module_name, module_type) {
			if (this._module_pool[module_name] && module_type != this._module_pool[module_name].type) {
				alert('re-declare type mismatch');
				return;
			};
			
			this._module_init(module_name, module_type);
		};
		ModuleManager.prototype.implement =  function (module_name, module_implement_func) {
			if (!this._module_pool[module_name]) {
				alert('module not declared');
				return;
			}
			
			this._module_pool[module_name].implement_func = module_implement_func;
			this._module_pool[module_name].status = 'implemented';
		};
		ModuleManager.prototype.require =  function (module_name, required_module_name) {
			if (!this._module_pool[module_name]) {
				alert('module not declared');
				return;
			}
			
			this._module_pool[module_name].require.push(required_module_name);
			this._module_pool[module_name].status = 'required';
		};
		ModuleManager.prototype.load =  function (module_name) {
			if (!this._module_pool[module_name]) {
				alert('module not declared');
				return;
			}
			if (this._module_pool[module_name].status == 'loaded') {
				return;
			}
			
			console.log('try load module', module_name);
			
			//loop for all required
			var require_name_list = this._module_pool[module_name].require;
			var all_required_implemented = true;
			for (var i in require_name_list) {
				if (!this._module_get(require_name_list[i])) {
					console.log('missing required module', i, require_name_list[i], 'for loading module', module_name);
					all_required_implemented = false;
				}
			}
			
			if (typeof(this._module_pool[module_name].implement_func) != 'function') {
				console.log('missing module implement func', this._module_pool[module_name].implement_func, 'for loading module', module_name);
				all_required_implemented = false;
			}
			
			if (all_required_implemented) {
				var _this = this;	//for module get closure
				var module = this._module_pool[module_name].implement_func(this.global, function (module_name) {
					return _this._module_get(module_name);
				});
				this._module_set(module_name, module);
				console.log('loaded', module_name);
			}
			else
				return;
		};
		ModuleManager.prototype.loop_load = function () {
			var left_to_load = -1;
			var last_left_to_load = 0;
			
			while(left_to_load != 0) {
				//console.log('load loop===', left_to_load, last_left_to_load);
				
				if (last_left_to_load == left_to_load) {
					alert('last_left_to_load == left_to_load, infinite loop load?');
					break;
				}
				
				last_left_to_load = left_to_load;
				left_to_load = 0;
				
				for (var module_name in this._module_pool) {
					var module_data = this._module_pool[module_name];
					if (module_data.status != 'loaded') {
						this.load(module_name);
						if (module_data.status == 'loaded')
							console.log('loop loaded', module_name);
						else
							left_to_load += 1;
					}
				}
			}
			
		};
		
		/*
		//this will be called when all required module implementation is get
		
		module_implement_func = function (global, required__module_get_func) {
			var module_play = required__module_get_func('module_play');
			var module_stop = required__module_get_func('module_stop');
			
			//global usually means window
			
			//implementation
		}
		*/
		
		ModuleManager.prototype.get = function (module_name) {
			if (module_name) {
				return this._loaded_module_pool[module_name];
			}
		};
		
		return new ModuleManager;
	})()
	
	Dr.UpdateList = [];
	Dr._last_update_clock = Dr.clock();
	var _update_func = function () {
		var current_update_clock = Dr.clock()
		var delta_sec = (current_update_clock - Dr._last_update_clock) / Dr.clock_per_sec;
		Dr._last_update_clock = current_update_clock
		
		//console.log('Dr.Update', delta_sec);
		
		for (index in Dr.UpdateList) {
			Dr.UpdateList[index](delta_sec);
		}
		Dr.onNextScreenUpdate(_update_func);
	}
	Dr.onNextScreenUpdate(_update_func);
	
	
	
	
	/*
	
	Dr.TimeBuffer = (function () {
		var TimeBuffer = function (interval) {
			this.interval;
		}
		
		return TimeBuffer;
	})()
	*/
	
	
	return Dr;
})(window);

/*
Dr.ModuleManager.declare('test_module', 'class');
Dr.ModuleManager.implement('test_module', function (global, module_get) {
	console.log('testing... test_module');
	
	var aaa = module_get('aaa');
	console.log('testing... module_get', aaa);
	
	return Dr;
});
Dr.ModuleManager.require('test_module', 'aaa');
//Dr.ModuleManager.load('test_module');



Dr.ModuleManager.declare('aaa', 'class');
Dr.ModuleManager.implement('aaa', function (global, module_get) {
	console.log('testing... aaa');
	return Dr;
});
//Dr.ModuleManager.require('aaa');
//Dr.ModuleManager.load('test_module');

Dr.ModuleManager.loop_load();
*/

