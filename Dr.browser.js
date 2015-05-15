if (typeof(Dr) === 'undefined' || Dr.environment !== 'browser') {
	console.log('[Dr] something wrong...');
}
else {
	// Required Non-Standard-JavaScript Methods
	Dr.log('[Dr] Adding browser methods...');

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

	var _event_to_action_mapper = {
		'touchstart': 'action_start',
		'touchmove': 'action_move',
		'touchend': 'action_end',
		'touchcancel': 'action_cancel',
		
		'mousedown': 'action_start',
		'mousemove': 'action_move',
		'mouseup': 'action_end',
		'mouseout': 'action_cancel',
	};

	Dr.window = window;	//normally window, always in fact
	Dr.document = document;	//normally document, always in fact
	Dr.devicePixelRatio = Dr.window.devicePixelRatio || 1;

	Dr.document.onkeydown = function (event) {
		Dr.log("[document.onkeydown]", event.keyCode, event.which, Dr.getKeyDefination(event.keyCode || event.which));
		Dr.Event.emit("KEY_DOWN", event, Dr.getKeyDefination(event.keyCode || event.which));
	};
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
		if (Dr.WINDOW_LOADED) { callback('WINDOW_LOADED'); }
		else { Dr.Event.addEventListener('WINDOW_LOADED', callback); }
	};

	//client related (the visible area, view port)
	Dr.getElementAtClient = function (view, client_x, client_y) {
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
	};
	Dr.simulateClientClick = (function() {
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
	})();

	//document related
	Dr.getBody = function (document) {
		var document = document || Dr.document;
		return document.body || document.getElementsByTagName("body")[0];
	};
	Dr.loadScript = function (script_src, callback) {
		Dr.debug(10, 'Loading Script:', script_src);
		var script_element = document.createElement('script');
		script_element.type = 'text/javascript';
		script_element.async = true;
		script_element.src = script_src;
		script_element.onload = function () {
			callback(script_element);
		};
		var exist_script_element = document.getElementsByTagName('script')[0];
		exist_script_element.parentNode.insertBefore(script_element, exist_script_element);
	};
	Dr.loadScriptByList = function (script_src_list, callback) {
		var loop_load_script = function () {
			Dr.debug(10, '[loadScriptByList]', script_src_list);
			if (script_src_list.length <= 0) callback();
			else Dr.loadScript(script_src_list.shift(), loop_load_script);
		}
		//start loop
		loop_load_script();
	};
	Dr.loadText = function (src, callback) {
		Dr.createHttpRequest(src, null, function (xml_http, response_text) {
			callback(response_text);
		});
	};
	Dr.loadImage = function (image_src, callback) {
		var image_element = new Image();
		image_element.src = image_src;
		image_element.onload = function () {
			callback(image_element);
		};
		return image_element;
	};
	Dr.createHttpRequest = function (url, message, finish_callback, state_change_callback) {
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
	};
	Dr.createDownloadLink = function (file_name, file_src) {
		var tag = document.createElement('a');
		tag.setAttribute('href', file_src);
		tag.setAttribute('download', file_name);
		tag.click();
	};
	Dr.createDownloadLocalText = function (file_name, text) {
		var tag = document.createElement('a');
		tag.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
		tag.setAttribute('download', file_name);
		tag.click();
	};
	Dr.createOffscreenCanvas = function (width, height){
		var canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;
		return canvas;
	};
	Dr.createStyle = function (css_text) {
		var style = document.createElement('style');
		style.type = 'text/css';
		if (style.styleSheet) {	// IE
			style.styleSheet.cssText = css_text;
		}
		else {
			style.innerHTML = css_text;
		}
		document.getElementsByTagName("head")[0].appendChild(style);
	};
	Dr.setStyleTransformDegree = (function () {
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
	})();
	Dr.getViewportSize = function () {
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
	};
	Dr.getPageSize = function () {
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
	};

	//window related
	Dr.onNextScreenUpdate = function (callback) {
		return requestAnimationFrame(callback);
	};
	Dr.setDelayCallback = function (callback, delay, is_once) { 
		var set_func;
		var clear_func;
		if (is_once) {
			set_func = setInterval;
			clear_func = clearInterval;
		}
		else {
			set_func = setTimeout;
			clear_func = clearTimeout;
		}
		var delay_callback_id = set_func(callback, delay);
		return function () {clear_func(delay_callback_id)}
	};
	Dr.clearDelayCallback = function (delay_callback_clear_func) {
		if (delay_callback_clear_func) {
			delay_callback_clear_func();
		}
		else {
			clearTimeout();
			clearInterval();
		}
	};


	//event related
	Dr.getKeyDefination = function (key_code) {
		return _key_code_to_def[key_code] || 'K_UNDEFINED';
	};
	
	//simple event wrapper, merged touch and click
	Dr.applyActionListener = function (listener_element, callback) {
		for (var event_type in _event_to_action_mapper) {
			listener_element.addEventListener(event_type, function (event) {
				var action = Dr.getActionFromEvent(event, listener_element);
				callback(action);
			});
		}
	};
	Dr.getActionFromEvent = function (event, listener_element) {
		var action_type = _event_to_action_mapper[event.type];
		var position_visible;	//position relative to visible (inner window or device screen)
		var position_document;	//position relative to document
		var position_target;	//position relative to target element
		var position_listener;	//position relative to listener element
		
		if (event.targetTouches) {
			if (event.targetTouches[0]) {
				position_visible = {
					x: event.targetTouches[0].clientX,
					y: event.targetTouches[0].clientY,
				}
			}
			else {
				//when touchend, no targetTouches exist
				position_visible = null;
			}
		}
		else {
			position_visible = {
				x: event.clientX,
				y: event.clientY,
			}
		}
		
		if (position_visible) {
			if (event.targetTouches && event.targetTouches[0].pageX) {
				position_document = {
					x: event.targetTouches[0].pageX,
					y: event.targetTouches[0].pageY,
				}
			}
			else if (event.pageX || event.pageY) {
				position_document = {
					x: event.pageX,
					y: event.pageY,
				};
			}
			else {
				var body = Dr.getBody();
				position_document = {
					x: position_visible.x + body.scrollLeft + (Dr.document.documentElement ? Dr.document.documentElement.scrollLeft : 0),
					y: position_visible.y + body.scrollTop + (Dr.document.documentElement ? Dr.document.documentElement.scrollTop : 0),
				};
			}
			
			position_target = {
				x: position_document.x - event.target.offsetLeft,
				y: position_document.y - event.target.offsetTop,
			};
			
			position_listener = listener_element ? {
				x: position_document.x - listener_element.offsetLeft,
				y: position_document.y - listener_element.offsetTop,
			} : null;
		}
		
		return {
			event: event,
			action_type: action_type,
			position_visible: position_visible,
			position_document: position_document,
			position_target: position_target,
			position_listener: position_listener,
		}
	};

	Dr.log('[Dr] Finished adding browser methods...');





	//Log utility
	//Maintain a log of recent 'listMax' number
	//the log is updated to 'logTag'
	Dr.Declare('TagLog', 'class');
	Dr.Implement('TagLog', function (global, module_get) {
		var Module = function(output_func, is_hold_output) {
			//record putput func, so you don't need to set it next time
			if (output_func) {
				this.output_func = output_func;
				this.is_hold_output = is_hold_output;
			}
			this.List = [];		//store history logs
			this.listMax = 10;			//max history to maintain
			this.lastTime = Dr.now();	//init time
			this.logSeperator = '<br />';	//usually '<br />' or '\n'
			this.is_changed = false;
		}
		
		Module.prototype.Log = function (newLog, logTagId) {
			this.is_changed = true;
			//generate this log
			var now = Dr.now();
			this.List.unshift('[+' + (now - this.lastTime).toFixed(4) + 'sec]' + newLog);	//add to head of the array
			this.lastTime = now;
			//remove excessive log
			if (this.List.length > this.listMax) this.List.length = this.listMax;
			//record tag, so you don't need to set it next time
			if (logTagId) this.logTag = Dr.document.getElementById(logTagId);
			//update tag object html
			if (!this.is_hold_output) {
				this.Output();
			}
		}
		
		
		Module.prototype.Output = function () {
			//update tag object html
			if (this.is_changed && this.output_func) {
				var log_text = this.List.join(this.logSeperator);
				this.output_func(log_text);
				this.is_changed = false;
				//Dr.log('[TagLog] Output called');
			}
		}
		
		return Module;
	});



	//FPS utility
	//display the FPS or step to record
	Dr.Declare('FPS', 'class');
	Dr.Implement('FPS', function (global, module_get) {
		var Module = function (output_func) {
			//record putput func, so you don't need to set it next time
			if (output_func) this.output_func = output_func;
			//output_func(averageFPS, currentFPS)
			this.lastTime = Dr.now();
			this.List = [];
			this.listMax = 20;			//max history to maintain
		}
		Module.prototype.FPS = function (output_func) {
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
		Module.prototype.step = function () {
			//get step
			var now = Dr.now();
			var step = (now - this.lastTime);
			this.lastTime = now;
			//get stepFPS
			var stepFPS = 1 / step;
			//save to list
			this.List.unshift(stepFPS);
			if (this.List.length > this.listMax) this.List.length = this.listMax;
			return step;
		}
		return Module;
	});




	var sample_box_data = {
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		z: 0,
		//callback: function (box_data) {};	//you can add
		box_tag: 'tag',
	}


	Dr.Declare('ActionBox', 'class');
	Dr.Implement('ActionBox', function (global, module_get) {
		
		var Module = function () {
			this.box_list = [];
		}
		
		Module.prototype.addBox = function (box_tag, box_data) {
			var box_tag = box_tag || this.box_list.length;
			this.box_list.box_tag = this.box_list.box_tag || box_tag;
			this.box_list[box_tag] = box_data;
		};
		
		Module.prototype.removeBox = function (box_tag) {
			this.box_list[box_tag] = null;
		};
		
		Module.prototype.removeAllBox = function () {
			this.box_list = [];
		};
		
		Module.prototype.testPoint = function (position) {
			var res_box_list;
			var max_z = Number.NEGATIVE_INFINITY;
			for (var box_tag in this.box_list) {
				var box_data = this.box_list[box_tag];
				if (
					position.x >= box_data.x
					&& position.y >= box_data.y
					&& position.x <= box_data.width
					&& position.y <= box_data.height
				) {
					if (max_z < box_data.z) {
						res_box_list = [];	//clear previous
						max_z = box_data.z; 
					}
					res_box_list.push(box_data);
				}
			}
			return res_box_list;
		};
		
		return Module;
	});


	Dr.LoadAll();


	Dr.test_func_list = {
		ActionElement: function () {
			var log_action = function(event) {
				event.preventDefault();
				var action = Dr.getActionFromEvent(event);
				var element = Dr.document.getElementById('Dr.Canvas');
				
				var position = Dr.getPositonInElementFromAction(action, element);
				//Dr.log(action, element, position);
				Dr.log(action.action_type, position);
			}
			
			Dr.document.addEventListener('mousedown', log_action);
			Dr.document.addEventListener('mousemove', log_action);
			Dr.document.addEventListener('mouseup', log_action);
			Dr.document.addEventListener('mouseout', log_action);
		},
		
		ActionBox: function () {
			var box_data_a= {
				x: 0,
				y: 0,
				width: 10,
				height: 10,
				z: 0,
				//callback: function (box_data) {};	//you can add
				box_tag: 'tag_a',
			}
			var box_data_b = {
				x: 10,
				y: 10,
				width: 10,
				height: 10,
				z: 0,
				//callback: function (box_data) {};	//you can add
				box_tag: 'tag_b',
			}
			var box_data_c = {
				x: 10,
				y: 10,
				width: 10,
				height: 10,
				z: 10,
				//callback: function (box_data) {};	//you can add
				box_tag: 'tag_c',
			}
			
			var ActionBox = Dr.Get('ActionBox');
			var action_box = new ActionBox;
			
			action_box.addBox('tag_a', box_data_a);
			Dr.log('nothing at (-1, 5)', action_box.testPoint({x: -1, y: 5}));
			Dr.log('tag_a at (5, 5)', action_box.testPoint({x: 5, y: 5}));
			Dr.log('tag_a at (10, 10)', action_box.testPoint({x: 10, y: 10}));
			action_box.addBox('tag_b', box_data_b);
			Dr.log('nothing at (-1, 5)', action_box.testPoint({x: -1, y: 5}));
			Dr.log('tag_a at (5, 5)', action_box.testPoint({x: 5, y: 5}));
			Dr.log('tag_a, tag_b at (10, 10)', action_box.testPoint({x: 10, y: 10}));
			action_box.addBox('tag_c', box_data_c);
			Dr.log('nothing at (-1, 5)', action_box.testPoint({x: -1, y: 5}));
			Dr.log('tag_a at (5, 5)', action_box.testPoint({x: 5, y: 5}));
			Dr.log('tag_a, tag_b, tag_c at (10, 10), but tag_c has max z', action_box.testPoint({x: 10, y: 10}));
		},
		
		loopRollDice: function () {
			var res = [];
			var loop_time = 1000000;
			
			Dr.log('[loopRollDice]', 'loop_time', loop_time);
			
			Dr.loop(loop_time, function() {
				var index = Dr.rollDice();
				res[index] = (res[index] || 0) + 1;
			});
			
			Dr.log('[loopRollDice]', 'res', res);
			
			var min = [-1, loop_time];
			var max = [-1, 0];
			
			for (var index in res) {
				var count = res[index];
				if (count < min[1]) min = [index, count, count / loop_time];
				if (count > max[1]) max = [index, count, count / loop_time];
			}
			Dr.log('[loopRollDice]', 'min', min, 'max', max);
		},
	}
}