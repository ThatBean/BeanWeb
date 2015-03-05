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
	var clock_per_sec = 1000;
	
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
			clock: Date.now,
			clock_per_sec: clock_per_sec,
			getUTCTimeStamp: function () {
				return Date.now / 1000;
			},
			onScreenUpdate: function (callback) {
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
	
	Dr.global = window;	//normally window
	Dr.window = window;	//normally window, always in fact
	Dr.document = document;	//normally document, always in fact
	
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
	
	Dr.now = dr_required_native.clock;
	Dr.getTimeStamp = dr_required_native.getUTCTimeStamp;
	Dr.startClock = Dr.now();
	Dr.startTimestamp = Dr.getTimeStamp();
	Dr.clock = function () { return (Dr.now() - Dr.startClock); };
	Dr.clock_per_sec = dr_required_native.clock_per_sec;
	Dr.onUpdate = dr_required_native.onScreenUpdate;
	
	Dr.module_manager = (function () {
		/*
			Dr Module can be a function or an object
			module_type can be: function, object, ...
		*/
		var module_manager = {};
		
		module_manager._module_pool = {};
		module_manager._loaded_module_pool = {};
		
		module_manager._module_init = function (module_name, module_type) { 
			this._module_pool[module_name] = {
				status: "declared",
				require: [],
				module: null,
				implement_func: null,
				type: module_type,
				name: module_name,
			};
			
			this._loaded_module_pool[module_name] = "just declared";
		};
		module_manager._module_get = function (module_name) { 
			//console.log("_module_get", module_name, this._module_pool);
			//return this._loaded_module_pool[module_name];
			
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
			
			this._loaded_module_pool[module_name] = module;
		};
		
		module_manager.declare =  function (module_name, module_type) {
			if (this._module_pool[module_name] && module_type != this._module_pool[module_name].type) {
				alert("re-declare type mismatch");
				return;
			};
			
			this._module_init(module_name, module_type);
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
			
			console.log("try load module", module_name);
			
			//loop for all required
			var require_name_list = this._module_pool[module_name].require;
			var all_required_implemented = true;
			for (var i in require_name_list) {
				if (!this._module_get(require_name_list[i])) {
					console.log("missing required module", i, require_name_list[i], "for loading module", module_name);
					all_required_implemented = false;
				}
			}
			
			if (typeof(this._module_pool[module_name].implement_func) != "function") {
				console.log("missing module implement func", this._module_pool[module_name].implement_func, "for loading module", module_name);
				all_required_implemented = false;
			}
			
			if (all_required_implemented) {
				var _this = this;	//for module get closure
				var module = this._module_pool[module_name].implement_func(this.global, function (module_name) {
					return _this._module_get(module_name);
				});
				this._module_set(module_name, module);
				console.log("loaded", module_name);
			}
			else
				return;
		};
		module_manager.loop_load = function () {
			var left_to_load = -1;
			var last_left_to_load = 0;
			
			while(left_to_load != 0) {
				console.log("load loop===", left_to_load, last_left_to_load);
				
				if (last_left_to_load == left_to_load) {
					alert("last_left_to_load == left_to_load, infinite loop load?");
					break;
				}
				
				last_left_to_load = left_to_load;
				left_to_load = 0;
				
				for (var module_name in this._module_pool) {
					var module_data = this._module_pool[module_name];
					if (module_data.status != "loaded") {
						this.load(module_name);
						if (module_data.status == "loaded")
							console.log("loop loaded", module_name);
						else
							left_to_load += 1;
					}
				}
			}
			
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
		
		module_manager.get = function (module_name) {
			if (module_name) {
				return module_manager._loaded_module_pool[module_name];
			}
		};
		
		return module_manager;
	})()
	
	Dr.UpdateList = [];
	Dr._last_update_clock = Dr.clock();
	var _update_func = function () {
		var _current_update_clock = Dr.clock()
		var delta_sec = (_current_update_clock - Dr._last_update_clock) / Dr.clock_per_sec;
		Dr._last_update_clock = _current_update_clock
		
		//console.log("Dr.Update", delta_sec);
		
		for (index in Dr.UpdateList) {
			Dr.UpdateList[index](delta_sec);
		}
		Dr.onUpdate(_update_func);
	}
	
	Dr.onUpdate(_update_func);
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


Dr.module_manager.declare("test_module", "class");
Dr.module_manager.implement("test_module", function (global, module_get) {
	console.log("testing... test_module");
	
	var aaa = module_get("aaa");
	console.log("testing... module_get", aaa);
	
	return Dr;
});
Dr.module_manager.require("test_module", "aaa");
//Dr.module_manager.load("test_module");



Dr.module_manager.declare("aaa", "class");
Dr.module_manager.implement("aaa", function (global, module_get) {
	console.log("testing... aaa");
	return Dr;
});
//Dr.module_manager.require("aaa");
//Dr.module_manager.load("test_module");













//Switch utility
//A switch that save and flip the value
Dr.module_manager.declare("Switch", "class");
Dr.module_manager.implement("Switch", function (global, module_get) {
	var Switch = function () {
		
	}
	
	Switch.prototype.Switch = function (key, value) {
		if (value == undefined)
			this[key] = !this[key];
		else
			this[key] = value;
	}
	return Switch;
});



//Log utility
//Maintain a log of recent 'listMax' number
//the log is updated to 'logTag'
Dr.module_manager.declare("TagLog", "class");
Dr.module_manager.implement("TagLog", function (global, module_get) {
	var TagLog = function() {
		this.List = [];		//store history logs
		this.listMax = 10;			//max history to maintain
		this.lastTime = Dr.now();	//init time
		this.logTag = undefined;	//define when use
		this.logSeperator = '<br />';	//usually '<br />' or '\n'
	}
	
	TagLog.prototype.Log = function (newLog, logTagId) {
		//generate this log
		var now = Dr.now();
		this.List.unshift('[+' + (now - this.lastTime) / 1000 + 'sec]' + newLog);	//add to head of the array
		this.lastTime = now;
		//remove excessive log
		if (this.List.length > this.listMax) this.List.length = this.listMax;
		//record tag, so you don't need to set it next time
		if (logTagId) this.logTag = Dr.document.getElementById(logTagId);
		//update tag object html
		if (this.logTag) {
			var HTMLtext = this.List.join(this.logSeperator);
			this.logTag.innerHTML = HTMLtext;
		}
	}
	return TagLog;
});



//FPS utility
//display the FPS or step to record
Dr.module_manager.declare("FPS", "class");
Dr.module_manager.implement("FPS", function (global, module_get) {
	var FPS = function (output_func) {
		//record putput func, so you don't need to set it next time
		if (output_func) this.output_func = output_func;
		//output_func(averageFPS, currentFPS)
		this.lastTime = Dr.now();
		this.List = [];
		this.listMax = 20;			//max history to maintain
	}
	FPS.prototype.FPS = function (output_func) {
		var step = this.step();
		//record tag, so you don't need to set it next time
		if (output_func) this.output_func = output_func;
		//get average
		var totalValues = 0;
		for (var i = 0; i < this.List.length; i++) totalValues += this.List[i];
		var averageFPS = totalValues / this.List.length;
		//display
		if (this.output_func) this.output_func(averageFPS, this.List[0]);
		return step;
	}
	FPS.prototype.step = function () {
		//get step
		var now = Dr.now();
		var step = (now - this.lastTime);
		this.lastTime = now;
		//get stepFPS
		var stepFPS = 1000 / step;
		//save to list
		this.List.unshift(stepFPS);
		if (this.List.length > this.listMax) this.List.length = this.listMax;
		return step;
	}
	return FPS;
});


Dr.module_manager.declare("Toolbox", "function pack");
Dr.module_manager.implement("Toolbox", function (global, module_get) {
	var Toolbox = {}
	Toolbox.getPageSize = function () {
		var xScroll,yScroll;
		if (Dr.window.innerHeight && Dr.window.scrollMaxY) {
			xScroll = Dr.document.body.scrollWidth;
			yScroll = Dr.window.innerHeight + Dr.window.scrollMaxY;
		} else if (Dr.document.body.scrollHeight > Dr.document.body.offsetHeight) {
			xScroll = Dr.document.body.scrollWidth;
			yScroll = Dr.document.body.scrollHeight;
		} else {
			xScroll = Dr.document.body.offsetWidth;
			yScroll = Dr.document.body.offsetHeight;
		}
		var windowWidth,windowHeight;
		if (Dr.window.innerHeight) {
			windowWidth = Dr.window.innerWidth;
			windowHeight = Dr.window.innerHeight;
		} else if (Dr.document.documentElement && Dr.document.documentElement.clientHeight) {
			windowWidth = Dr.document.documentElement.clientWidth;
			windowHeight = Dr.document.documentElement.clientHeight;
		} else if (Dr.document.body) {
			windowWidth = Dr.document.body.clientWidth;
			windowHeight = Dr.document.body.clientHeight;
		}
		var pageWidth,pageHeight
		pageHeight = ( (yScroll < windowHeight) ? windowHeight : yScroll );
		pageWidth = ( (xScroll < windowWidth) ? windowWidth : xScroll );
		return {'pageX':pageWidth,'pageY':pageHeight,'winX':windowWidth,'winY':windowHeight};
	}
	Toolbox.setSize = function(element, width, height) {
		if (!element) {
			alert('[Toolbox.setSize] get null, ' + element);
			return;
		}
		console.log(element)
		element.width = width;
		element.style.width = width + 'px';
		element.style.minWidth = width + 'px';
		element.style.maxWidth = width + 'px';
		element.height = height;
		element.style.height = height + 'px';
		element.style.minHeight = height + 'px';
		element.style.maxHeight = height + 'px';
	}
	Toolbox.resizeEventListener = function(func) {
		var evt = 'onorientationchange' in Dr.window ? 'orientationchange' : 'resize';
		Dr.window.addEventListener(evt, func);
	}
	Toolbox.createElement = function (element_data) {
		var new_element= Dr.document.createElement(element_data.type);
		if (element_data.parent) element_data.parent.appendChild(new_element);
		if (element_data.id) new_element.id = element_data.id;
		if (element_data.name) new_element.name = element_data.name;
		return new_element;
	}
	return Toolbox;
});



Dr.module_manager.loop_load();


