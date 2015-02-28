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
	
	Dr.global = window;	//normally window
	
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
		
		module_manager._module_init = function (module_name, module_type) { 
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
			console.log("_module_get", module_name, this._module_pool);
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
			
			console.log("load module", module_name);
			
			//loop for all required
			var require_name_list = this._module_pool[module_name].require;
			var all_required_implemented = true;
			for (var i in require_name_list) {
				if (!this._module_get(require_name_list[i])) {
					console.log("missing module", i, require_name_list[i], "for loading module", module_name);
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
			}
			else
				return;
		};
		module_manager.loop_load =  function () {
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
							console.log("loaded", module_name)
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
		
		return module_manager;
	})()
	
	/*
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
Dr.module_manager.declare("Switch", "closure function");
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
Dr.module_manager.declare("TagLog", "closure function");
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
		if (logTagId) this.logTag = document.getElementById(logTagId);
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
var FPS = function (tagCurrentId, tagAverageId) {
	var step = FPS.step();
	//record tag, so you don't need to set it next time
	if (tagCurrentId) FPS.tagCurrent = document.getElementById(tagCurrentId);
	if (tagAverageId) FPS.tagAverage = document.getElementById(tagAverageId);
	//get average
	var totalValues = 0;
	for (var i = 0; i < FPS.List.length; i++) totalValues += FPS.List[i];
	var averageFPS = totalValues / FPS.List.length;
	//display
	FPS.tagCurrent.innerHTML = FPS.List[0].toFixed(2);
	FPS.tagAverage.innerHTML = averageFPS.toFixed(2);
	return step;
}
FPS.step = function () {
	//get step
	var now = Date.now();
	var step = (now - FPS.lastTime);
	FPS.lastTime = now;
	//get stepFPS
	var stepFPS = 1000 / step;
	//save to list
	FPS.List.unshift(stepFPS);
	if (FPS.List.length > FPS.listMax) FPS.List.length = FPS.listMax;
	return step;
}
FPS.tagCurrent;
FPS.tagAverage;
FPS.lastTime = Date.now();
FPS.List = [];
FPS.listMax = 20;			//max history to maintain


var B_Toolbox = B_Toolbox || {}

B_Toolbox.getPageSize = function () {
	var xScroll,yScroll;
	if (window.innerHeight && window.scrollMaxY) {
		xScroll = document.body.scrollWidth;
		yScroll = window.innerHeight + window.scrollMaxY;
	} else if (document.body.scrollHeight > document.body.offsetHeight) {
		xScroll = document.body.scrollWidth;
		yScroll = document.body.scrollHeight;
	} else {
		xScroll = document.body.offsetWidth;
		yScroll = document.body.offsetHeight;
	}
	var windowWidth,windowHeight;
	if (window.innerHeight) {
		windowWidth = window.innerWidth;
		windowHeight = window.innerHeight;
	} else if (document.documentElement && document.documentElement.clientHeight) {
		windowWidth = document.documentElement.clientWidth;
		windowHeight = document.documentElement.clientHeight;
	} else if (document.body) {
		windowWidth = document.body.clientWidth;
		windowHeight = document.body.clientHeight;
	}
	var pageWidth,pageHeight
	pageHeight = ( (yScroll < windowHeight) ? windowHeight : yScroll );
	pageWidth = ( (xScroll < windowWidth) ? windowWidth : xScroll );
	return {'pageX':pageWidth,'pageY':pageHeight,'winX':windowWidth,'winY':windowHeight};
}

B_Toolbox.setSize = function(element, width, height) {
	if (!element) {
		alert('[B_Toolbox.setSize] get null, ' + element);
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

B_Toolbox.resizeEventListener = function(func) {
	var evt = 'onorientationchange' in window ? 'orientationchange' : 'resize';
	window.addEventListener(evt, func);
}

B_Toolbox.createElement = function (element_parent,element_type,element_id) {
	var new_element= document.createElement(element_type);
	new_element.id = element_id;
	element_parent.appendChild(new_element);
	return new_element;
}



















Dr.module_manager.loop_load();
