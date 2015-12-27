Dr.Declare('Action', 'function_pack');
Dr.Implement('Action', function (global, module_get) {
	
	var Module = function () {
		Dr.assert(false, 'this is a function pack');
	}
	
	//map event type to merged action type
	Module.eventActionMap = {
		'touchstart': 'action_start',
		'touchmove': 'action_move',
		'touchend': 'action_end',
		'touchcancel': 'action_cancel',
		
		'mousedown': 'action_start',
		'mousemove': 'action_move',
		'mouseup': 'action_end',
		'mouseout': 'action_cancel',
	};
	
	//simple event wrapper, add all event in eventActionMap
	Module.applyActionListener = function (listener_element, callback) {
		for (var event_type in Module.eventActionMap) {
			listener_element.addEventListener(event_type, function (event) {
				callback(Module.getActionFromEvent(event, listener_element));
			});
		}
	};
	
	
	Module.getActionFromEvent = function (event, listener_element) {
		var action_type = Module.eventActionMap[event.type];
		var positions = {};
		var position_visible;	//position relative to visible (inner window or device screen)
		var position_document;	//position relative to document
		var position_target;	//position relative to target element
		var position_listener;	//position relative to listener element
		
		if (event.targetTouches) {
			if (event.targetTouches[0]) {
				positions.visible = {
					x: event.targetTouches[0].clientX,
					y: event.targetTouches[0].clientY,
				}
			}
			else {
				//when touchend, no targetTouches exist
			}
		}
		else {
			positions.visible = {
				x: event.clientX,
				y: event.clientY,
			}
		}
		
		if (positions.visible) {
			if (event.targetTouches && event.targetTouches[0].pageX) {
				positions.document = {
					x: event.targetTouches[0].pageX,
					y: event.targetTouches[0].pageY,
				}
			}
			else if (event.pageX || event.pageY) {
				positions.document = {
					x: event.pageX,
					y: event.pageY,
				};
			}
			else {
				var body = Dr.getBody();
				positions.document = {
					x: position_visible.x + body.scrollLeft + (Dr.document.documentElement ? Dr.document.documentElement.scrollLeft : 0),
					y: position_visible.y + body.scrollTop + (Dr.document.documentElement ? Dr.document.documentElement.scrollTop : 0),
				};
			}
			
			positions.target = {
				x: positions.document.x - event.target.offsetLeft,
				y: positions.document.y - event.target.offsetTop,
			};
			
			positions.listener = listener_element ? {
				x: positions.document.x - listener_element.offsetLeft,
				y: positions.document.y - listener_element.offsetTop,
			} : null;
		}
		
		return {
			positions: positions,
			action_type: action_type,
			event: event,
			
			//legacy
			position_visible: positions.visible,
			position_document: positions.document,
			position_target: positions.target,
			position_listener: positions.listener,
		}
	};
	
	return Module;
});
