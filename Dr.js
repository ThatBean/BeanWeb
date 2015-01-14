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
	Dr.clock = function () { return (Dr.now() - Dr.startTimestamp); }
	
	
	Dr.declare =  function (module_name) {}
	Dr.implement =  function (module_name, module_implement_func) {}
	Dr.require =  function (module_name, required_module_name) {}
	
	Dr.module_pool = {}
	Dr.module_get = function (module_name) { return Dr.module_pool[module_name]; }
	Dr.module_set = function (module_name, module_instance) { Dr.module_pool[module_name] = module_instance; }
	
	
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