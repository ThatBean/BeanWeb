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
		var _key_code_to_def = {
			'8': 'K_BACKSPACE',
			'9': 'K_TAB',
			
			'12': 'K_CLEAR',
			'13': 'K_ENTER',
			
			'16': 'K_SHIFT',
			'17': 'K_CTRL',
			'18': 'K_ALT',
			'19': 'K_PAUSE',
			'20': 'K_CAPS_LOCK',
			
			'27': 'K_ESC',
			
			'32': 'K_SPACE',
			'33': 'K_PRIOR',
			'34': 'K_NEXT',
			'35': 'K_END',
			'36': 'K_HOME',
			'37': 'K_LEFT',
			'38': 'K_UP',
			'39': 'K_RIGHT',
			'40': 'K_DOWN',
			'41': 'K_SELECT',
			'42': 'K_PRINT',
			'43': 'K_EXECUTE',
			'45': 'K_INSERT',
			'46': 'K_DELETE',
			'47': 'K_HELP',
			'48': 'K_0',
			'49': 'K_1',
			'50': 'K_2',
			'51': 'K_3',
			'52': 'K_4',
			'53': 'K_5',
			'54': 'K_6',
			'55': 'K_7',
			'56': 'K_8',
			'57': 'K_9',
			'65': 'K_A',
			'66': 'K_B',
			'67': 'K_C',
			'68': 'K_D',
			'69': 'K_E',
			'70': 'K_F',
			'71': 'K_G',
			'72': 'K_H',
			'73': 'K_I',
			'74': 'K_J',
			'75': 'K_K',
			'76': 'K_L',
			'77': 'K_M',
			'78': 'K_N',
			'79': 'K_O',
			'80': 'K_P',
			'81': 'K_Q',
			'82': 'K_R',
			'83': 'K_S',
			'84': 'K_T',
			'85': 'K_U',
			'86': 'K_V',
			'87': 'K_W',
			'88': 'K_X',
			'89': 'K_Y',
			'90': 'K_Z',
			
			'96': 'K_KP_0',
			'97': 'K_KP_1',
			'98': 'K_KP_2',
			'99': 'K_KP_3',
			'100': 'K_KP_4',
			'101': 'K_KP_5',
			'102': 'K_KP_6',
			'103': 'K_KP_7',
			'104': 'K_KP_8',
			'105': 'K_KP_9',
			
			'112': 'K_F1',
			'113': 'K_F2',
			'114': 'K_F3',
			'115': 'K_F4',
			'116': 'K_F5',
			'117': 'K_F6',
			'118': 'K_F7',
			'119': 'K_F8',
			'120': 'K_F9',
			'121': 'K_F10',
			'122': 'K_F11',
			'123': 'K_F12',
		};
		
		var _event_to_action_type = {
			'touchstart': 'action_start',
			'touchmove': 'action_move',
			'touchend': 'action_end',
			'touchcancel': 'action_cancel',
			
			'mousedown': 'action_start',
			'mousemove': 'action_move',
			'mouseup': 'action_end',
			'mouseout': 'action_cancel',
		};
		
		return {
			//JavaScript only
			clock: Date.now,
			clock_per_sec: 1000,
			getUTCTimeStamp: function () {
				return Math.floor(Date.now() / 1000);
			},
			getRandomInt: function (range_01, range_02) {
				var from = Math.min(range_01, range_02);
				var to = Math.max(range_01, range_02);
				return _get_random_int(from, to);
			},
			getRandomIntMulti: function (range_01, range_02, count) {
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
			assertList: (function () {
				if (console.assert.apply) {
					return function (arg_list) {
						console.assert.apply(console, arg_list);
					}
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
			})(),
			
			
			//client related (the visible area, view port)
			getElementAtClient: function (view, client_x, client_y) {
				var element = view.document.elementFromPoint(client_x, client_y);	//view should be a window
				//alert("Clicked at: "+getObject.tagName);
				if (element && element.tagName.toUpperCase().search(/FRAME/) != -1) {	//deal with frames...
					//for (int i=0;i<window.frames.length;i++) {
						//if (window.self!=window.frames[i]) B_func_fakeMouseEvent(window.frames[i],client_x-getObject.offset,client_y,mouseEvent);
					//}
					alert('Element in another Frame');
					return null;
				}
				return element;
			},
			simulateClientClick: (function() {
				if (document.createEventObject) { //For IE 8
					return function (type, element, view, client_x, client_y) {
						var event = view.document.createEventObject();
						event.clientX = client_x;
						event.clientY = client_y;
						element.fireEvent('on' + type, event);
					}
				}
				else {
					return function (type, element, view, client_x, client_y) {
						var event = view.document.createEvent('MouseEvents');
						//event.initMouseEvent(type, canBubble, cancelable, view, detail, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, button, relatedTarget);
						event.initMouseEvent(type, true, true, view, 0, 0, 0, client_x, client_y, false, false, false, false, 0, null); 
						element.dispatchEvent(event);
					}	
				};
			})(),
			
			//document related
			getBody: function (document) {
				var document = document || Dr.document;
				return document.getElementsByTagName("body")[0];
			},
			loadScript: function (script_src, callback) {
				Dr.log('Loading Script:', script_src);
				var script_element = document.createElement('script');
				script_element.type = 'text/javascript';
				script_element.async = true;
				script_element.src = script_src;
				script_element.onload = function () {
					callback(script_element);
				};
				var exist_script_element = document.getElementsByTagName('script')[0];
				exist_script_element.parentNode.insertBefore(script_element, exist_script_element);
			},
			loadImage: function (image_src, callback) {
				var image_element = new Image();
				image_element.src = image_src;
				image_element.onload = function () {
					callback(image_element);
				};
				return image_element;
			},
			createHttpRequest: function (url, message, finish_callback, state_change_callback) {
				//alert(url+"|"+message);
				var xml_http = new XMLHttpRequest();
				if (!xml_http) {
					alert('Browser does not support HTTP Request');
					return;
				} 
				xml_http.onreadystatechange= function () {
					if (xml_http.readyState == 4 && xml_http.status==200) { 
						finish_callback(xml_http, xml_http.responseText || xml_http.responseXML);
					}
					else { 
						if (state_change_callback) state_change_callback(xml_http);
					}
				};
				xml_http.open('POST', url, true);
				xml_http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
				xml_http.send(message);
				return xml_http;
			},
			createDownload: function (filename, file_src) {
				var tag = document.createElement('a');
				tag.setAttribute('href', file_src);
				tag.setAttribute('download', filename);
				tag.click();
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
			createStyle: function (css_text) {
				var style = document.createElement('style');
				style.type = 'text/css';
				if (style.styleSheet) {	// IE
					style.styleSheet.cssText = css_text;
				}
				else {
					style.innerHTML = css_text;
				}
				document.getElementsByTagName("head")[0].appendChild(style);
			},
			setStyleTransformDegree: (function () {
				var key_transform;
				// will init upon first call
				return function (element, rotate_degree) {
					if (!key_transform) {
						if (element.style.webkitTransform != null) key_transform = 'webkitTransform';
						if (element.style.MozTransform != null) key_transform = 'MozTransform';
						if (element.style.msTransform != null) key_transform = 'msTransform';
						if (element.style.OTransform != null) key_transform = 'OTransform';
						if (element.style.transform != null) key_transform = 'transform';
						if (!key_transform) { alert('style unsupport transform'); key_transform = 'unsupport_transform'; }
					}
					element.style[key_transform] = 'rotate(' + rotate_degree + 'deg)';
				}
			})(),
			getViewportSize: function () {
				var client_width, client_height;
				if (Dr.window.innerHeight) {
					client_width = Dr.window.innerWidth;
					client_height = Dr.window.innerHeight;
				} else if (Dr.document.documentElement && Dr.document.documentElement.clientHeight) {
					client_width = Dr.document.documentElement.clientWidth;
					client_height = Dr.document.documentElement.clientHeight;
				} else if (Dr.document.body) {
					client_width = Dr.document.body.clientWidth;
					client_height = Dr.document.body.clientHeight;
				}
				
				return {
					width: client_width,
					height: client_height,
				};
			},
			getPageSize: function () {
				var body = Dr.getBody();
				var scroll_x, scroll_y;
				if (Dr.window.innerHeight && Dr.window.scrollMaxY) {
					scroll_x = Dr.getBody().scrollWidth;
					scroll_y = Dr.window.innerHeight + Dr.window.scrollMaxY;
				} else if (body.scrollHeight > body.offsetHeight) {
					scroll_x = body.scrollWidth;
					scroll_y = body.scrollHeight;
				} else {
					scroll_x = body.offsetWidth;
					scroll_y = body.offsetHeight;
				}
				
				viewport_size = Dr.getViewportSize();
				
				var page_width, page_height;
				page_height = ( (scroll_y < viewport_size.height) ? viewport_size.height : scroll_y );
				page_width = ( (scroll_x < viewport_size.width) ? viewport_size.width : scroll_x );
				
				return {
					width: page_width,
					height: page_height,
				};
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
			
			//event related
			getKeyDefination: function (key_code) {
				return _key_code_to_def[key_code] || 'K_UNDEFINED';
			},
			getActionFromEvent: function (event) {
				var action_type = _event_to_action_type[event.type];
				
				var position_visible;
				if (event.targetTouches) {
					position_visible = {
						x: event.targetTouches[0].clientX,
						y: event.targetTouches[0].clientY,
					}
				}
				else {
					position_visible = {
						x: event.clientX,
						y: event.clientY,
					}
				}
				
				var position_document;
				if (event.pageX || event.pageY) {
					position_document = {
						x: event.pageX,
						y: event.pageY,
					};
				}
				else {
					var body = Dr.getBody();
					position_document = {
						x: position_visible.x + body.scrollLeft + Dr.document.documentElement.scrollLeft,
						y: position_visible.y + body.scrollTop + Dr.document.documentElement.scrollTop,
					};
				}
				
				return {
					event: event,
					action_type: action_type,
					position_visible: position_visible,	//position relative to visible (inner window or device screen)
					position_document: position_document, //position relative to document
				}
			},
			getPositonInElementFromAction: function (action, element) {
				return {
					x: action.position_document.x - element.offsetLeft,
					y: action.position_document.y - element.offsetTop,
				};
			},
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
	
	Dr.global = window;	//normally window, or {} for a sandbox?
	Dr.window = window;	//normally window, always in fact
	Dr.document = document;	//normally document, always in fact
	Dr.devicePixelRatio = window.devicePixelRatio || 1;
	
	
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
	};
	
	Dr.window.addEventListener(("onorientationchange" in window ? "orientationchange" : "resize"), function (event) {
		Dr.Event.emit('WINDOW_RESIZE', event);
	});
	
	Dr.window.addEventListener('load', function (event) {
		Dr.WINDOW_LOADED = true;
		Dr.Event.emit('WINDOW_LOADED', event);
	});
	
	Dr.afterWindowLoaded = function (callback) {
		if (Dr.WINDOW_LOADED) {
			callback('WINDOW_LOADED');
		}
		else {
			Dr.Event.subscribe('WINDOW_LOADED', callback);
		}
	}
	
	
	//time related
	Dr.startTimestamp = _required_native.getUTCTimeStamp();
	Dr.getUTCTimeStamp = _required_native.getUTCTimeStamp;
	Dr.startClock = _required_native.clock();
	Dr.clock = function () { return (_required_native.clock() - Dr.startClock); };
	Dr.clock_per_sec = _required_native.clock_per_sec;
	Dr.now = function () {
		return (_required_native.clock() - Dr.startClock) / _required_native.clock_per_sec;	//return running time in seconds
	};
	
	//math related
	Dr.getRandomInt = _required_native.getRandomInt;
	Dr.getRandomIntMulti = _required_native.getRandomIntMulti;
	Dr.rollDice = function () {
		return Dr.getRandomInt(1, 100);
	};
	
	//function argument to array
	Dr.getArgumentArray = _required_native.getArgumentArray;
	
	//client related (the visible area, view port)
	Dr.getElementAtClient = _required_native.getElementAtClient;
	Dr.simulateClientClick = _required_native.simulateClientClick;
	
	//document related
	Dr.getBody = _required_native.getBody;
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
	Dr.loadImage = _required_native.loadImage;
	Dr.loadText = function (src, callback) {
		Dr.createHttpRequest(src, null, function (xml_http, response_text) {
			callback(response_text);
		});
	};
	Dr.createHttpRequest = _required_native.createHttpRequest;
	Dr.createDownload = _required_native.createDownload;
	Dr.createTextDownload = _required_native.createTextDownload;
	Dr.createOffscreenCanvas = _required_native.createOffscreenCanvas;
	Dr.createStyle = _required_native.createStyle;
	Dr.setStyleTransformDegree = _required_native.setStyleTransformDegree;
	Dr.getViewportSize = _required_native.getViewportSize;
	Dr.getPageSize = _required_native.getPageSize;
	
	
	//window related
	Dr.onNextScreenUpdate = _required_native.onNextScreenUpdate;
	
	//event related
	Dr.getKeyDefination = _required_native.getKeyDefination;
	Dr.getActionFromEvent = _required_native.getActionFromEvent;
	Dr.getPositonInElementFromAction = _required_native.getPositonInElementFromAction;
	
	//extend
	console.log('[Dr] add extend function...');
	
	Dr.loop = function (loop_time, loop_func) {
		var looped_time = 0;
		while (loop_time > looped_time) {
			loop_func(looped_time);
			looped_time++;
		};
	};
	
	Dr.combine = function (source, target) {
		var result = (source instanceof Array && target instanceof Array) ? [] : {};
		for (var i in source) result[i] = source[i];
		for (var i in target) result[i] = target[i];
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
			for (var j in array) {
				temp_object[array[j]] = true;
			};
		};
		var res_array = array_list[0];
		res_array.length = 0;
		for (var key in temp_object) {
			res_array.push(key);
		};
		return res_array;
	};
	
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
	
	
	Dr.logList = _required_native.logList;
	Dr.Log = (function () {
		var Log = function () {
			this._log_history = [];
		}
		Log.prototype.log = function () {
			var arg_list = Dr.getArgumentArray(arguments);
			arg_list.unshift('[' + Dr.now().toFixed(4) + 'sec]');
			this._log_history.push(arg_list);
			Dr.logList(arg_list);
		}
		Log.prototype.getHistory = function () {
			return this._log_history;
		}
		return new Log;
	})()
	Dr.log = function () {
		Dr.Log.log.apply(Dr.Log, Dr.getArgumentArray(arguments));
	}
	
	Dr.assertList = _required_native.assertList;
	Dr.assert = function () {
		var arg_list = Dr.getArgumentArray(arguments);
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
	
	
	Dr.Event = (function () {
		var Module = function () {
			this._event_data = [];
		}
		
		Module.prototype._get_callback_list = function (event_key) {
			if (!this._event_data[event_key]) this._event_data[event_key] = [];
			return this._event_data[event_key];
		}
		
		Module.prototype.subscribe = function (event_key, callback) {
			if (!callback && typeof(callback) != 'function') {
				Dr.log('callback error', callback);
				return;
			}
			
			var event_key = event_key || this._event_data.length;
			var callback_list = this._get_callback_list(event_key);
			
			for (var i in callback_list) {
				if (callback_list[i] = callback) {
					Dr.log('callback already exist');
					return;
				}
			}
			
			callback_list.push(callback);
			
			return event_key;
		}
		
		Module.prototype.unsubscribe = function (event_key, org_callback) {
			var callback_list = this._get_callback_list(event_key);
			for (var i in callback_list) {
				if (callback_list[i] = org_callback) {
					callback_list.splice(i, 1);
					return org_callback;
				}
			}
			return null;
		}
		
		Module.prototype.unsubscribeKey = function (event_key) {
			this._event_data[event_key] = null;
		}
		
		Module.prototype.unsubscribeAll = function () {
			this._event_data = [];
		}
		
		Module.prototype.emit = function (event_key) {
			Dr.log("[emit] Get", event_key)
			
			var args = Dr.getArgumentArray(arguments, 1);
			args.unshift(event_key);
			
			var callback_list = this._get_callback_list(event_key);
			for (var i in callback_list) {
				callback_list[i].apply(null, args);
			}
		}
		
		return new Module;
	})()
	
	
	Dr.ModuleManager = (function () {
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
			//Dr.log('_module_get', module_name, this._module_data_pool);
			if (module_name 
				&& this._module_data_pool[module_name] 
				&& this._module_data_pool[module_name].status.load == true)
				return this._module_data_pool[module_name].module;
			else
				return null;
		};
		Module.prototype._module_set = function (module_name, module) {
			if (!this._module_data_pool[module_name]) {
				alert('[_module_set] module not declared', module_name, module);
				debugger;
				return;
			}
			this._module_data_pool[module_name].module = module; 
			this._module_data_pool[module_name].status.load = true;
		};
		
		Module.prototype.declare =  function (module_name, module_type) {
			if (!module_name) {
				alert('[declare] error declare nameless module');
				return;
			};
			if (this._module_data_pool[module_name]) {
				if (module_type != this._module_data_pool[module_name].type) {
					alert('[declare] re-declare type mismatch');
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
			if (!this._module_data_pool[module_name] 
				|| !this._module_data_pool[module_name].status.declare) {
				alert('[implement] module not declared', module_name, module_implement_func);
				
				debugger;
				return;
			}
			
			this._module_data_pool[module_name].implement_func = module_implement_func;
			this._module_data_pool[module_name].status.implement = true;
		};
		Module.prototype.require =  function (module_name, required_module_name) {
			if (!this._module_data_pool[module_name] 
				|| !this._module_data_pool[module_name].status.declare) {
				alert('[load] module not declared', module_name, required_module_name);
				
				debugger;
				return;
			}
			
			this._module_data_pool[module_name].require.push(required_module_name);
		};
		Module.prototype.load =  function (module_name) {
			if (!this._module_data_pool[module_name] 
				|| !this._module_data_pool[module_name].status.declare) {
				alert('[load] module not declared', module_name);
				
				debugger;
				return;
			}
			
			var module_data = this._module_data_pool[module_name];
			
			if (module_data.status.load) {
				return;
			}
			
			Dr.log('[load] try load module', module_name);
			
			//loop for all required
			var require_name_list = module_data.require;
			var all_requirment_meet = true;
			for (var i in require_name_list) {
				if (!this._module_get(require_name_list[i])) {
					Dr.log('[load] missing required module', i, require_name_list[i], 'for loading module', module_name);
					all_requirment_meet = false;
				}
			}
			
			if (typeof(module_data.implement_func) != 'function') {
				Dr.log('[load] missing module implement func', module_data.implement_func, 'for loading module', module_name);
				all_requirment_meet = false;
			}
			
			if (all_requirment_meet) {
				var _this = this;	//for module get closure
				var module = module_data.implement_func(Dr.global, function (module_name) {
					return _this._module_get(module_name);
				});
				this._module_set(module_name, module);
				Dr.log('[load] loaded', module_name);
			}
			else
				return;
		};
		Module.prototype.loadAll = function () {
			var left_to_load = 'init';
			var last_left_to_load;
			var left_module_name_list;
			
			while(left_to_load != 0) {
				Dr.log('[loadAll] start', left_to_load, last_left_to_load, left_module_name_list);
				
				if (last_left_to_load == left_to_load) {
					alert('[loadAll] Still has ' + left_to_load + ' left ot load, infinite loop load?');
					break;
				}
				
				last_left_to_load = left_to_load;
				left_to_load = 0;
				left_module_name_list = [];
				
				for (var module_name in this._module_data_pool) {
					var module_data = this._module_data_pool[module_name];
					if (module_data.status.load == false) {
						this.load(module_name);
						if (module_data.status.load == true) {
							Dr.log('[loadAll] loaded', module_name);
						}
						else {
							left_to_load += 1;
							left_module_name_list.push(module_name);
						}
					}
				}
			}
		};
		
		Module.prototype.get = function (module_name) {
			return this._module_get(module_name);
		};
		
		return new Module;
	})()
	
	Dr.Declare = function (module_name, module_type) { Dr.ModuleManager.declare(module_name, module_type); }
	Dr.Require = function (module_name, required_module_name) { Dr.ModuleManager.require(module_name, required_module_name); }
	Dr.Implement = function (module_name, module_implement_func) { Dr.ModuleManager.implement(module_name, module_implement_func); }
	Dr.LoadAll = function () { Dr.ModuleManager.loadAll(); }
	Dr.Get = function (module_name) { return Dr.ModuleManager.get(module_name); }
	
	
	Dr.UpdateLoop = (function () {
		var Module = function () {
			this._update_list = [];	//non-constant, will be refreshed on every update
			this._last_update_clock = Dr.clock();
			this._is_active = false;
			
			//prepare a update closure
			var o_this = this;
			this._update_func = function () {
				o_this.update();
			}
		}
		
		Module.prototype.update = function () {
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
			
			if (this._is_active) {
				Dr.onNextScreenUpdate(this._update_func);
			}
			else {
				Dr.log('[UpdateLoop] Stopped');
			}
		}
		
		
		Module.prototype.start = function () {
			if (this._is_active) {
				return;
			}
			this._is_active = true;
			this._update_func();
		}
		
		Module.prototype.stop = function () {
			this._is_active = false;
		}
		
		Module.prototype.clear = function () {
			this._update_list = [];
		}
		
		Module.prototype.add = function (update_func) {
			this._update_list.push(update_func);
		}
		
		return new Module;
	})()
	
	console.log('[Dr] Finished Initialize.');
	
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

