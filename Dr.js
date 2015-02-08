// Js Dr Bean Dr.Eames
var DrAuthor = "Bean/Dr.Eames";
var DrVersion = "0.1";

var Dr = (typeof Dr == "function" && Dr.author == DrAuthor && Dr.verion >= DrVersion) ? Dr : (function (window, undefined) {
	
	// Check Function & add Fall-back
	console.log("[Dr] Checking Function & add Fall-back...");
	
	// Add setTimeout fall-back
	window.requestAnimationFrame = (function () {
	  return window.requestAnimationFrame ||
	  window.webkitRequestAnimationFrame ||
	  window.mozRequestAnimationFrame ||
	  function (callback) {
		window.setTimeout(callback, 1000 / 60);
	  };
	})();
	
	// Add Date.now fall-back
	Date.now = Date.now || function() { return new Date().getTime(); };
	
	// Add setTime/Interval fall-back
	(function (wraper) {
	window.setTimeout = wraper(window.setTimeout);
	window.setInterval = wraper(window.setInterval);
	})(
		function (native_set_func) {return function(func, delay){
		var org_this = this;	//keep this
		var args = Array.prototype.slice.call(arguments, 2);  //preserve tailing args
		return native_set_func(function() { func.apply(org_this, args); }, delay);
		}
	});
	
	// Pack required
	console.log("[Dr] Collecting Required...");
	var DrCollectRequired = function () {
		return {
			getUTCTimeStamp: Date.now,
			onScreenUpdate: window.requestAnimationFrame,
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
			}
			
		};
	}
	
	//the private functions & data
	var dr = {};
	
	// Required Non-Standard-JavaScript Methods
	var dr_required_native = DrCollectRequired();
	var dr_required_system = DrCollectRequired();
	
	
	// Dr Initialize
	console.log("[Dr] Initializing...");
	
	var Dr = function () {
		console.log("[Dr] A Frame by " + DrAuthor);
		console.log("[Dr] Version " + DrVersion);
	}
	
	Dr.author = DrAuthor;
	Dr.verion = DrVersion;
	
	Dr.global = window;
	
	Dr.objectConstructor = {
		Array: Array,
		Function: Function,
		Object: Object,
	};
	
	Dr.inspect = function (target) {
		console.log("[Inspect]", target);
		console.log("type: <" + typeof(target) + ">");
		
		if (typeof(target) == "object") {
			//Name - Instance Creator
			
			for (var i in Dr.objectConstructor) {
				if (target instanceof Dr.objectConstructor[i]) {
					console.log("Instance of: <" + i + ">")
				}
			}
		}
	};
	
	Dr.now = dr_required_native.getUTCTimeStamp;
	Dr.startTimestamp = Dr.now();
	Dr.clock = function () { return (Dr.now() - Dr.startTimestamp); };
	
	Dr.module_manager = (function () {
		/*
			Dr Module can be a function or an object
			module_type can be: function, object, ...
		*/
		var module_manager = {};
		
		module_manager._module_pool = {};
		
		module_manager._module_init = function (module_name) { 
			this._module_pool[module_name] = {
				status: "declared",
				require: [],
				module: null,
				implement_func: null,
				type: module_type,
				name: module_name,
			};
		};
		module_manager._module_get = function (module_name) { 
			if (this._module_pool[module_name] && this._module_pool[module_name].status == "loaded")
				return this._module_pool[module_name].module;
			else
				return null;
				//alert("get module failed! name: " + module_name);
		};
		module_manager._module_set = function (module_name, module) {
			if (!this._module_pool[module_name]) {
				alert("module not declared");
				return;
			}
			this._module_pool[module_name].module = module; 
			this._module_pool[module_name].status = "loaded";
		};
		
		module_manager.declare =  function (module_name, module_type) {
			if (this._module_pool[module_name] && module_type != this._module_pool[module_name].type) {
				alert("re-declare type mismatch");
				return;
			};
			
			this._module_init(module_name);
		};
		module_manager.implement =  function (module_name, module_implement_func) {
			if (!this._module_pool[module_name]) {
				alert("module not declared");
				return;
			}
			
			this._module_pool[module_name].implement_func = module_implement_func;
			this._module_pool[module_name].status = "implemented";
		};
		module_manager.require =  function (module_name, required_module_name) {
			if (!this._module_pool[module_name]) {
				alert("module not declared");
				return;
			}
			
			this._module_pool[module_name].require.push(required_module_name);
			this._module_pool[module_name].status = "required";
		};
		module_manager.load =  function (module_name) {
			if (!this._module_pool[module_name]) {
				alert("module not declared");
				return;
			}
			if (this._module_pool[module_name].status == "loaded") {
				return;
			}
			
			//loop for all required
			var require_name_list = this._module_pool[module_name].require;
			var all_required_implemented = true;
			for (var i in require_name_list) {
				if (!this._module_get(require_name_list[i])) {
					all_required_implemented = false;
				}
			}
			
			if (all_required_implemented) {
				var module = this._module_pool[module_name].implement_func(this.global, this._module_get);
				this._module_set(module_name, module);
			}
			else
				return;
		};
		
		/*
		//this will be called when all required module implementation is get
		
		module_implement_func = function (global, required__module_get_func) {
			var module_play = required__module_get_func("module_play");
			var module_stop = required__module_get_func("module_stop");
			
			//global usually means window
			
			//implementation
		}
		*/
		
		return module_manager;
	})()
	
	Dr.Time = (function () {
		var Time = function () {
			
		}
		
		return Time;
	})()
	
	Dr.TimeBuffer = (function () {
		var TimeBuffer = function (interval) {
			this.interval;
		}
		
		return TimeBuffer;
	})()
	
	
	
	return Dr;
})(window);