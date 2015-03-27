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
		var _key_def_list = [];
		_key_def_list[8] = 'KEY_BACKSPACE';
		_key_def_list[9] = 'KEY_TAB';
		_key_def_list[12] = 'KEY_CLEAR';
		_key_def_list[13] = 'KEY_ENTER';
		_key_def_list[16] = 'KEY_SHIFT';
		_key_def_list[17] = 'KEY_CTRL';
		_key_def_list[18] = 'KEY_ALT';
		_key_def_list[19] = 'KEY_PAUSE';
		//_key_def_list[20] = 'KEY_CAPS_LOCK';
		_key_def_list[27] = 'KEY_ESC';
		_key_def_list[32] = 'KEY_SPACE';
		//_key_def_list[33] = 'KEY_PRIOR';
		//_key_def_list[34] = 'KEY_NEXT';
		_key_def_list[35] = 'KEY_END';
		_key_def_list[36] = 'KEY_HOME';
		_key_def_list[37] = 'KEY_LEFT';
		_key_def_list[38] = 'KEY_UP';
		_key_def_list[39] = 'KEY_RIGHT';
		_key_def_list[40] = 'KEY_DOWN';
		//_key_def_list[41] = 'KEY_Select';
		//_key_def_list[42] = 'KEY_Print';
		//_key_def_list[43] = 'KEY_Execute';
		_key_def_list[45] = 'KEY_INSERT';
		_key_def_list[46] = 'KEY_DELETE';
		//_key_def_list[47] = 'KEY_Help';
		_key_def_list[48] = 'KEY_0';
		_key_def_list[49] = 'KEY_1';
		_key_def_list[50] = 'KEY_2';
		_key_def_list[51] = 'KEY_3';
		_key_def_list[52] = 'KEY_4';
		_key_def_list[53] = 'KEY_5';
		_key_def_list[54] = 'KEY_6';
		_key_def_list[55] = 'KEY_7';
		_key_def_list[56] = 'KEY_8';
		_key_def_list[57] = 'KEY_9';
		_key_def_list[65] = 'KEY_A';
		_key_def_list[66] = 'KEY_B';
		_key_def_list[67] = 'KEY_C';
		_key_def_list[68] = 'KEY_D';
		_key_def_list[69] = 'KEY_E';
		_key_def_list[70] = 'KEY_F';
		_key_def_list[71] = 'KEY_G';
		_key_def_list[72] = 'KEY_H';
		_key_def_list[73] = 'KEY_I';
		_key_def_list[74] = 'KEY_J';
		_key_def_list[75] = 'KEY_K';
		_key_def_list[76] = 'KEY_L';
		_key_def_list[77] = 'KEY_M';
		_key_def_list[78] = 'KEY_N';
		_key_def_list[79] = 'KEY_O';
		_key_def_list[80] = 'KEY_P';
		_key_def_list[81] = 'KEY_Q';
		_key_def_list[82] = 'KEY_R';
		_key_def_list[83] = 'KEY_S';
		_key_def_list[84] = 'KEY_T';
		_key_def_list[85] = 'KEY_U';
		_key_def_list[86] = 'KEY_V';
		_key_def_list[87] = 'KEY_W';
		_key_def_list[88] = 'KEY_X';
		_key_def_list[89] = 'KEY_Y';
		_key_def_list[90] = 'KEY_Z';
		/*
		_key_def_list[96] = 'KEY_KP_0 KP_0';
		_key_def_list[97] = 'KEY_KP_1 KP_1';
		_key_def_list[98] = 'KEY_KP_2 KP_2';
		_key_def_list[99] = 'KEY_KP_3 KP_3';
		_key_def_list[100] = 'KEY_KP_4 KP_4';
		_key_def_list[101] = 'KEY_KP_5 KP_5';
		_key_def_list[102] = 'KEY_KP_6 KP_6';
		_key_def_list[103] = 'KEY_KP_7 KP_7';
		_key_def_list[104] = 'KEY_KP_8 KP_8';
		_key_def_list[105] = 'KEY_KP_9 KP_9';
		_key_def_list[106] = 'KEY_KP_Multiply KP_Multiply';
		_key_def_list[107] = 'KEY_KP_Add KP_Add';
		_key_def_list[108] = 'KEY_KP_Separator KP_Separator';
		_key_def_list[109] = 'KEY_KP_Subtract KP_Subtract';
		_key_def_list[110] = 'KEY_KP_Decimal KP_Decimal';
		_key_def_list[111] = 'KEY_KP_Divide KP_Divide';
		*/
		_key_def_list[112] = 'KEY_F1';
		_key_def_list[113] = 'KEY_F2';
		_key_def_list[114] = 'KEY_F3';
		_key_def_list[115] = 'KEY_F4';
		_key_def_list[116] = 'KEY_F5';
		_key_def_list[117] = 'KEY_F6';
		_key_def_list[118] = 'KEY_F7';
		_key_def_list[119] = 'KEY_F8';
		_key_def_list[120] = 'KEY_F9';
		_key_def_list[121] = 'KEY_F10';
		_key_def_list[122] = 'KEY_F11';
		_key_def_list[123] = 'KEY_F12';
		/*
		_key_def_list[124] = 'KEY_F13';
		_key_def_list[125] = 'KEY_F14';
		_key_def_list[126] = 'KEY_F15';
		_key_def_list[127] = 'KEY_F16';
		_key_def_list[128] = 'KEY_F17';
		_key_def_list[129] = 'KEY_F18';
		_key_def_list[130] = 'KEY_F19';
		_key_def_list[131] = 'KEY_F20';
		_key_def_list[132] = 'KEY_F21';
		_key_def_list[133] = 'KEY_F22';
		_key_def_list[134] = 'KEY_F23';
		_key_def_list[135] = 'KEY_F24';
		*/
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
			loadImage: function (image_src, callback) {
				var image_element = new Image();
				//image_element.src = 'images/BeanFont.png';
				//image_element.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAjoAAAANCAYAAACgqMT8AAAFoElEQVR4Xu1c0bLVQAjT//9o9TizynATErrbnusVn7RlKYQQaM+M37/Nn0FgEBgEBoFBYBAYBL4oAt+/aF6T1iAwCAwCg8AgMAgMAt/cRefHL6yi7evfrz+va/Hvr2vLNp+J9xzos991hl2PPqsYVIxObKdsEEanfI8fjMDiz+Jv5pVzPfrYsc9+ck/FDFb/ofhRf1b2qweW/2ib+3z1ONIK9txuPKfwrPLKbEB5Md244zqKh3GR6QTjcvTjanxHn3d1q3PesXVsHD1UftR95xlj4yGA5ny1h5Re3SY4sehUYpaDjM/rJleJLFqGPNjPW7G88uBkAnRlYGdxZ4O2OzCYfXX9PKLaY3cwP22vBlQ3nqv+MufUoM0vPFmk7lgUnIVMaUEXz1P2ld5V/c70GtWHYV51iTvIXTv2LPf8KbuKv4hHu3FrJXqPhYvne6L7+1S3Xkrf/njcWXTQWyAbnN2mU/a7QLAl4ckCq2Uuv5FXDakGSRTP6rmMOArv7gB4Eudquc24ZV5081I4ZXxde9XQ3YGu6qz8sTwQnnG53sVT8VwJucqr6x/1kptjVVOUR5WbyrvTb44vx+bJhWo3HtVf7v0Ozu+wPYXT3bGf0sXtRcchMWr4dY4NcWcIO89Wb0zsrekpQleCu4ats9ioeJFwOxg7DVH5cQbGK/a8aKPcnVoiTqgccvwrnhjD+nv0H79eID53f+LJvhc32XXUOyxOlx/RjtWlyostODEX9VORyjf2bM4X/azu5OEuJYrPXZyfsj8xkCLW6OfQjDOyV5zOfZTtVX0dPjhaE+vs8ifqRn75Z1rO5qDCIcZUcVL56f5Urfh/pY8yN6sXe6dfEA//1PzqF52qgRgoWajQ525EFCSQ7PnuJljFGOM8IRTIhyJGtQhlfyjn3GBsKWECUQkHI11H4NhCoxadKldHmFTsFScRf7O/u/mneFPl113AnE/6bMHpxnkFN1Rv1Ruqr1xBR3aO7qn4HEF36nhKt3br6OLp8rYbTxfPSjfRXKj47y4l6gWA9SFboqqZfor/CNeqJ6o6ME3v8Fzx4oe76LiNkwck27JcwLtLhyuY1aLENk22sHTsWT6sYbqNyoSULTqOfdXgrkCpPBx+sdqqs865iP/yd0WAXP5VQ7HivGro3Xownuzm1R14bIFUfaIWiSu6gzBRcajnKF2rONsZDKo31P0u367wJMaAvro4X7YV3p241sxycK4WHRT3Lp6OjscZfBrPXd6rOqk54dYxcur3mdOLTmzgXBRG6Dxk8oBxBtWHxMKF7nk22FcDKHFY55k9a6Bo7xDCyStjW4kKq90di85qRudzclXbiDXC28Goyu+UMLl+uo2ehcdddLrnXIFRfndwYCJfib/qo+o+yqU72Nx6qAXN6YE7tTxrWu7fTt3jWdWfqj5sKVF1V3Wp9KlaYDo4ZL1F+o9mKPvZCc0lhYPjH/WX0xtZVxlnnLi7uvjBp9scipCoEdEZl7iosdxYq4HtLCl3LjrdgaEaUgmkqoE7eDoN4yxMlZCwBVGRXWHhDItl4/yGHf1l8UN+kP3CId+r+i2eUXHGPsq4Km4gIVZxKqFn8Tj5xhcgR0cQj1jOuV4V1yqRd/uV1T2eZzGxurj6iPhT6SJaTCIGiFcoduSn4ifS4Wjv8oH5YTqvfrJFgz/XvctPB0/3A4CqL4pt1VDpPNN2J99cr8w556W3ir3isP3/6JRO/pObnWXvCiSMoGywMaJcJborWEqAOn4QTnfjfKU2c2YQGASeR0BpgbqvIt49r/y79904XDv3uU/bvS1+9y3gaUA+2/PeVqDPBsTN8QzONwM87geBfwgB9YVhVy92z5+C0o3DtTsV164fVb9d//b5WXRsqMZwEBgEBoFB4CEE2FBXX6zd8D7T0uDG4tq5GDxhd6peW7H+BJpngDoKyzbXAAAAAElFTkSuQmCC';
				image_element.src = image_src;
				image_element.onload = function () {
					callback(image_element);
				};
				return image_element;
			},
			createTextDownload: function (filename, text) {
				var tag = document.createElement('a');
				tag.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
				tag.setAttribute('download', filename);
				tag.click();
			},
			createOffscreenCanvas: function (width, height){
				var canvas = document.createElement('canvas');
				canvas.width = width;
				canvas.height = height;
				return canvas;
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
			getKeyDefination: function (key_code) {
				return _key_def_list[key_code] || 'KEY_UNDEFINED';
			}
		};
	}
	
	
	
	
	
	// Required Non-Standard-JavaScript Methods
	console.log('[Dr] Collecting Required...');
	var _required_native = _collect_required();
	
	
	// Dr Initialize
	console.log('[Dr] Initializing...');
	
	var Dr = function () {
		Dr.log('[Dr] A Frame by ' + Dr.author);
		Dr.log('[Dr] Version ' + Dr.verion);
	}
	
	Dr.author = DrAuthor;
	Dr.verion = DrVersion;
	
	Dr.global = window;	//normally window
	Dr.window = window;	//normally window, always in fact
	Dr.document = document;	//normally document, always in fact
	
	
	Dr.document.onkeydown = function (event) {
		Dr.log("[document.onkeydown]", event.keyCode, event.which, Dr.getKeyDefination(event.keyCode || event.which));
		Dr.Event.emit("KEY_DOWN", event, Dr.getKeyDefination(event.keyCode || event.which));
	};
	//Dr.document.onkeypress = function (event) {
	//	Dr.log("[document.onkeypress]", event.keyCode, event.which, Dr.getKeyDefination(event.keyCode || event.which));
	//	Dr.Event.emit("KEY_PRESS", Dr.getKeyDefination(event.keyCode || event.which));
	//};
	Dr.document.onkeyup = function (event) {
		Dr.log("[document.onkeyup]", event.keyCode, event.which, Dr.getKeyDefination(event.keyCode || event.which));
		Dr.Event.emit("KEY_UP", event, Dr.getKeyDefination(event.keyCode || event.which));
	};
	
	Dr.document.onpaste = function (event) {
		//get content
		var content;
		if (event.clipboardData) {
			content = (event.originalEvent || event).clipboardData.getData('text/plain');
		}
		else if (window.clipboardData) {
			content = window.clipboardData.getData('Text');
		}
		
		//pass on
		Dr.Event.emit("PASTE", event, content);
		
		var sample_process_func = function (event_key, event, content) {
			//cut the text content off the event chain
			event.preventDefault();
			theClipBoardData = content;
			alert("get Pasted ClipBoard Data!");
			var appendInfo = "[All Data is here]";
			if (theClipBoardData.length > 200) {appendInfo = "[Displayed only part of data for speed]"}
			document.getElementById('B_DataA').value = "[Data from ClipBoard] \n" + theClipBoardData.slice(0, 200) + "\n" + appendInfo;
		};
	};
	Dr.window.addEventListener(("onorientationchange" in window ? "orientationchange" : "resize"), function (event) {
		Dr.Event.emit("WINDOW_RESIZE", event);
	});
	
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
	Dr.getKeyDefination = _required_native.getKeyDefination;
	
	
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

