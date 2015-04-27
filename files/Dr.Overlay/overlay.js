//Bean's Fake Mouse for Good JS


/*
Dr.Declare('OverlayBase', 'prototype_class');
Dr.Implement('OverlayBase', function (global, module_get) {
	var Module = function () {
		//
	};
	
	//Module.status = Dr.combine(ActorSlotPool.status, ActorState.status);
	Module.state_status = ActorState.status;
	Module.slot_status = ActorSlotPool.status;
	
	Module.prototype.init = function (owner) {
	};
	
	Module.prototype.getSlotPool = function () { return this._slot_pool; };
	Module.prototype.setUpperSlotPool = function (upper_slot_pool) { this._upper_slot_pool = upper_slot_pool; };
	Module.prototype.getUpperSlotPool = function () { return this._upper_slot_pool; };
	
	return Module;
});

*/

//to use
//Dr.Get('OverlayCursor').create();

Dr.Declare('OverlayCursor', 'class');
Dr.Implement('OverlayCursor', function (global, module_get) {
	var Module = function () {
		//
	};
	
	Module.prototype.init = function () {
		this.is_triggered = false;
		this.action_state = '';
		this.config = this.get_config();
		this.element_map = this.init_element();
		
		this.set_element_style(this.config, this.element_map);
		this.calculate_position();
		this.init_event();
	};
	
	Module.prototype.clear = function () {
		for (var element_id in this.element_map) {
			Dr.log('removed', element_id);
			var element = this.element_map[element_id];
			element.parentNode.removeChild(element);
		}
	};
	
	
	Module.prototype.get_config = function () {
		var viewport_size = Dr.getViewportSize();
		
		//create CSS
		var config = {
			'CursorRad':40,
			'CursorOffset':10,
			'CursorFont':20,
			'CursorMargin':15,
			
			'CursorBgFont':18,
			'CursorBgRad':50,
			'CursorBgRadL':50,
			'CursorBgRadR':20,
			
			'CursorTipRad':6,
			'CursorTipOffset':60,
			'CursorTipBorder':3,
			
			'MoveThreshold':30,
			
			'MenuX':Math.min(500, viewport_size.width * 0.8),
			'MenuY':Math.min(500, viewport_size.height * 0.8),
			'MenuRad':10,
			'MenuBorder':5,
			'MenuFont':20,
			'MenuFontHeight':30,
			
			//color
			
			'CursorTipColor':'#FF0000',
			'MenuBorderColor':'#436EEE',
			'MenuBgColor':'#222222',
		};
		
		return config;
	}
	
	
	Module.prototype.set_element_style = function (config, element_map) {
		var element_style_config = {
			ELEMENT_CURSOR: {
				'position': 'fixed',
				'margin': 0,
				'padding': 0,
				'right': config.CursorMargin + 'px',
				'bottom': config.CursorMargin + 'px',
				'z-index': 2090,
				
				'font-size': config.CursorFont + 'px',
				'line-height': config.CursorRad * 2 + 'px',
				'font-weight': 'bold',
				'text-align': 'center',
				'color': '#FFF',
				
				'cursor': 'pointer',
				
				'width': config.CursorRad * 2 + 'px',
				'height': config.CursorRad * 2 + 'px',
				
				'border-radius': config.CursorRad + 'px',
				'border-style': 'none',
				
				'border': '#427AC7',
				'background-color': '#5091E9',
			},
			
			
			ELEMENT_CURSOR_BG: {
				'position': 'fixed',
				'margin': 0,
				'padding': 0,
				'right': (config.CursorMargin - (config.CursorBgRad - config.CursorRad)) + 'px',
				'bottom': (config.CursorMargin - (config.CursorBgRad - config.CursorRad)) + 'px',
				'z-index': 2080,
				
				'font-size': config.CursorBgFont + 'px',
				'line-height': config.CursorBgRad * 2 + 'px',
				'font-weight': 'bold',
				'text-align': 'center',
				'color': '#FFF',
				
				'filter': 'alpha(opacity=90)',
				'opacity': 0.9,
				
				'width': config.CursorBgRad * 2 + 'px',
				'height': config.CursorBgRad * 2 + 'px',
				'border-radius': config.CursorBgRad + 'px ' + config.CursorBgRad + 'px ' + config.CursorBgRadR + 'px ' + config.CursorBgRadL + 'px',
				'border-style': 'none',
				
				'background-color': '#505050',
			},
			
			ELEMENT_CURSOR_TIP: {
				'position': 'fixed',
				'margin': 0,
				'padding': 0,
				'display': 'none',
				'z-index': 2100,
				'width': config.CursorTipRad + 'px',
				'height': config.CursorTipRad + 'px',
				'border-radius': config.CursorTipRad + 'px',
				'border': config.CursorTipBorder + 'px solid ' + config.CursorTipColor,
			},
			
			ELEMENT_MENU: {
				'position': 'fixed',
				'padding': 0,
				'display': 'none',
				'z-index': 2080,
				'overflow-x': 'auto',
				
				'font-size': config.MenuFont + 'px',
				'line-height': config.MenuFontHeight + 'px',
				'text-align': 'center',
				'color': '#FFF',
				
				'left': '50%',
				'top': '50%',
				
				'filter': 'alpha(opacity=90)',
				'opacity': 0.9,
				
				'width': config.MenuX + 'px',
				'height': config.MenuY + 'px',
				'margin-left': - config.MenuX * 0.5 + 'px',
				'margin-top': - config.MenuY * 0.5 + 'px',
				
				'border-radius': config.MenuRad + 'px',
				'border': config.MenuBorder + 'px solid ' + config.MenuBorderColor,
				'background-color': config.MenuBgColor,
			},
		};
		
		for (var tag_name in element_style_config) {
			var element_style = element_map[tag_name].style;
			var style_list = element_style_config[tag_name];
			for (style_name in style_list) {
				element_style[style_name] = style_list[style_name];
			}
		}
	}
	
	
	Module.prototype.init_element = function () {
		var body = Dr.getBody();
		
		var create_element = function (parent, type, id, innerHTML) {
			var element = document.createElement(type);
			element.innerHTML = innerHTML || '';
			element.id = id;
			parent.appendChild(element);
			return element;
		}
		
		var Menu_innerHTML = '<br /><b>Bean\'s Fake Mouse for Good</b>'
			+ '<br />'
			+ '<br />[To Click]<br />Drag&Release'
			+ '<br />[To Cancel]<br />Drag&Drag Back&Release'
			+ '<br />[To Menu]<br />Just Click(You know)'
			+ '<br />'
			+ '<br /><button>Close Menu</button>'
			+ '<br /><button>Exit Mouse</button>'
			+ '<br />'
			+ '<br /><b>ThatBean.com</b><sup>ver 6.0</sup>'
			+ '<br />';
		
		return {
			ELEMENT_CURSOR: create_element(body,'div','ELEMENT_CURSOR','Menu'),
			ELEMENT_CURSOR_BG: create_element(body,'div','ELEMENT_CURSOR_BG','Bean\'s'),
			ELEMENT_CURSOR_TIP: create_element(body,'div','ELEMENT_CURSOR_TIP'),
			ELEMENT_MENU: create_element(body,'div','ELEMENT_MENU', Menu_innerHTML),
		};
	}
	
	
	Module.prototype.calculate_position = function () {
		//get page size info
		//viewport_size = Dr.getViewportSize();
		var cursor_offset_left = this.element_map.ELEMENT_CURSOR.offsetLeft;
		var cursor_offset_top = this.element_map.ELEMENT_CURSOR.offsetTop;
		
		this.cursor_offset_left_max = cursor_offset_left + this.config.CursorRad;
		this.cursor_offset_left_min = this.config.CursorOffset;
		this.cursor_offset_top_max = cursor_offset_top + this.config.CursorRad;
		this.cursor_offset_top_min = this.config.CursorOffset;
		this.cursor_center_left = cursor_offset_left + this.config.CursorRad;
		this.cursor_center_top = cursor_offset_top + this.config.CursorRad;
	}
	
	
	function clamp (value, min, max) {
		return ( value < min ) ? min : ( ( value > max ) ? max : value );
	}
	
	Module.prototype.action_update = function (x, y){
		var rad = Math.atan2((y - this.cursor_center_top), (x - this.cursor_center_left));
		var cos = Math.cos(rad);
		var sin = Math.sin(rad);
		//Dr.log(rad, cos, sin);
		
		var cursor_left = clamp(x + this.config.CursorOffset * cos - this.config.CursorRad, this.cursor_offset_left_min, this.cursor_offset_left_max);
		var cursor_top = clamp(y + this.config.CursorOffset * sin - this.config.CursorRad, this.cursor_offset_top_min, this.cursor_offset_top_max);
		
		var cursor_tip_left = cursor_left + this.config.CursorRad - this.config.CursorTipRad + this.config.CursorTipOffset * cos;
		var cursor_tip_top = cursor_top + this.config.CursorRad - this.config.CursorTipRad + this.config.CursorTipOffset * sin;
		
		this.element_map.ELEMENT_CURSOR.style.left = cursor_left + 'px';
		this.element_map.ELEMENT_CURSOR.style.top = cursor_top + 'px';
		
		this.element_map.ELEMENT_CURSOR_TIP.style.left = cursor_tip_left + 'px';
		this.element_map.ELEMENT_CURSOR_TIP.style.top = cursor_tip_top + 'px';
		
		Dr.setStyleTransformDegree(this.element_map.ELEMENT_CURSOR, (rad * 180 / Math.PI + 90));
		
		//Dr.log(cursor_left, cursor_top, '||', this.config.CursorTipOffset * cos, this.config.CursorTipOffset * sin, (rad * 180 / Math.PI + 180));
	}
	
	Module.prototype.action_commit = function (event_type){
		var view = Dr.window;
		
		var client_x = this.element_map.ELEMENT_CURSOR_TIP.offsetLeft + this.config.CursorTipRad;
		var client_y = this.element_map.ELEMENT_CURSOR_TIP.offsetTop + this.config.CursorTipRad;
		
		this.element_map.ELEMENT_CURSOR_TIP.style.display='none';
		var element = Dr.getElementAtClient(view, client_x, client_y);
		this.element_map.ELEMENT_CURSOR_TIP.style.display='block';
		
		if (element) {
			Dr.simulateClientClick(event_type, element, view, client_x, client_y);
		}
	}
	
	
	Module.prototype.action_start = function (x, y, event){
		event.preventDefault();
		event.stopPropagation();
		
		if (!this.is_active) {
			//set reigger
			this.is_active = true;
			this.is_away = false;
			this.action_start_x = x;
			this.action_start_y = y;
			this.action_state = 'action_start';
		}
	}
	
	
	Module.prototype.action_move = function (x, y, event){
		if (!this.is_active) return;
		event.preventDefault();
		event.stopPropagation();
		
		//check 'swipe' minimum distance
		if (Math.abs(this.cursor_center_left - x) + Math.abs(this.cursor_center_top - y) < this.config.MoveThreshold) {
			this.element_map.ELEMENT_CURSOR_TIP.style.display = 'none';
			this.element_map.ELEMENT_CURSOR.style.left = '';
			this.element_map.ELEMENT_CURSOR.style.top = '';
			this.element_map.ELEMENT_CURSOR.innerHTML = (this.is_away ? 'Cancel' : 'Menu');
			Dr.setStyleTransformDegree(this.element_map.ELEMENT_CURSOR, 0);
			this.action_state = (this.is_away ? 'action_cancel' : 'toggle_menu');
		}
		else {
			//show && move
			this.is_away = true;
			this.element_map.ELEMENT_CURSOR.innerHTML = 'Click';
			this.element_map.ELEMENT_CURSOR_TIP.style.display = 'block';
			this.action_update(x, y);
			this.action_state = 'action_move';
		}
	}
	
	Module.prototype.action_stop = function (event){
		if (!this.is_active) return;
		event.preventDefault();
		event.stopPropagation();
		
		//clear trigger
		this.is_active = false;
		
		Dr.log(this.action_state);
		switch (this.action_state) {
			case 'action_start':
			case 'toggle_menu':
				//this.element_map.ELEMENT_MENU.style.display = 'block';
				var menu_style = this.element_map.ELEMENT_MENU.style;
				menu_style.display = menu_style.display == 'block' ? 'none' : 'block';
				break;
			case 'action_cancel':
				//nothing
				break;
			case 'action_move':
				this.action_commit('click');
				break;
		}
		
		this.action_reset();
	}
	
	Module.prototype.action_reset = function (){
		this.element_map.ELEMENT_CURSOR_TIP.style.display = 'none';
		this.element_map.ELEMENT_CURSOR.style.left = '';
		this.element_map.ELEMENT_CURSOR.style.top = '';
		this.element_map.ELEMENT_CURSOR.innerHTML = 'Menu';
		Dr.setStyleTransformDegree(this.element_map.ELEMENT_CURSOR, 0);
	}
	
	Module.prototype.init_event = function (){
		
		// create a function to pass touch events and coordinates to drawer
		function getEventXY (event) {
			if (event.targetTouches) {
				return {
					x: event.targetTouches[0].clientX,
					y: event.targetTouches[0].clientY,
				}
			}
			else {
				return {
					x: event.clientX,
					y: event.clientY,
				}
			}
		}
		
		var _this = this;
		function _action_start (event) {
			var pos = getEventXY(event);
			return _this.action_start(pos.x, pos.y, event);
		}
		
		function _action_move (event) {
			var pos = getEventXY(event);
			return _this.action_move(pos.x, pos.y, event);
		}
		
		function _action_stop (event) {
			return _this.action_stop(event);
		}
		
		function _action_reset () {
			return _this.action_reset();
		}
		
		function _calculate_position (event) {
			return _this.calculate_position();
		}
		
		function _action_menu_close (event) {
			event.preventDefault();
			event.stopPropagation();
			_this.element_map.ELEMENT_MENU.style.display = 'none';
		}
		
		function _action_menu_exit (event) {
			event.preventDefault();
			event.stopPropagation();
			_this.clear();
		}
		
		var body = Dr.getBody();
		// attach the touchstart, touchmove, touchend event listeners.
		this.element_map.ELEMENT_CURSOR.addEventListener('touchstart', _action_start, false);
		this.element_map.ELEMENT_CURSOR.addEventListener('mousedown', _action_start, false);
		
		body.addEventListener('touchmove', _action_move, false);
		body.addEventListener('mousemove', _action_move, false);
		
		body.addEventListener('touchend', _action_stop, false);
		body.addEventListener('mouseup', _action_stop, false);
		
		body.addEventListener('touchcancel', _action_reset, false);
		//body.addEventListener('mouseout', _action_reset, false);	//fires too often(cross elements), cause error...
		
		this.element_map.ELEMENT_MENU.getElementsByTagName('button')[0].addEventListener('click', _action_menu_close, false);
		this.element_map.ELEMENT_MENU.getElementsByTagName('button')[1].addEventListener('click', _action_menu_exit, false);
		
		Dr.Event.subscribe('WINDOW_RESIZE', _calculate_position);
	}
	
	
	Module.create = function (owner) {
		var instance = new Module;
		Dr.afterWindowLoaded(function () { instance.init(); });
		return instance;
	};
	
	return Module;
});