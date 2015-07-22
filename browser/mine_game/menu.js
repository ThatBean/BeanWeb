//menu action and logic, receive user operation and send to grid

Dr.Declare('Mine_Menu', 'class');
Dr.Require('Mine_Menu', 'Mine_Type');
Dr.Require('Mine_Menu', 'CanvasExt');
Dr.Require('Mine_Menu', 'ActionBox');
Dr.Implement('Mine_Menu', function (global, module_get) {
	
	var Module = function () {
		//
	}
	
	var Mine_Type = Dr.Get('Mine_Type');
	var CanvasExt = Dr.Get('CanvasExt');
	var ActionBox = Dr.Get('ActionBox');
	
	Module.type = Mine_Type.type;
	
	Module.prototype.init = function (canvas_element) {
		//CanvasExt
		this._canvas_ext = new CanvasExt;
		this._canvas_ext.init(canvas_element);
		
		this._action_box = new ActionBox;
		
		var _this = this;
		var on_event_callback =  function (event_key, action) { _this.onAction(event_key, action); };
		this._canvas_ext.getEventCenter().addEventListener('action_move', on_event_callback);
		this._canvas_ext.getEventCenter().addEventListener('action_start', on_event_callback);
		this._canvas_ext.getEventCenter().addEventListener('action_end', on_event_callback);
		this._canvas_ext.getEventCenter().addEventListener('action_cancel', on_event_callback);
		this._action_data = {
			is_active: false,
			
			start_position: null,
			start_time: 0,	//in second
			end_position: null,
			end_time: 0,
			end_block: null,
		};
		
		
		
		
		
		
		
		
	}
	
	
	Module.prototype.onAction = function (event_key, action) {
		action.event.preventDefault();
		
		Dr.log('Get', event_key, action.position_listener);
		
		// Dr.UpdateLoop.add(function (delta_time) { 
			// Dr.log('Get', event_key, action.position_listener);
		// });
		
		switch(event_key) {
			case 'action_move':
				if (this._action_data.is_active) {
					//update hover
					if (action.position_listener) {
						this._visible_offset_left += action.position_listener.x - this._action_data.last_position.x;
						this._visible_offset_top += action.position_listener.y - this._action_data.last_position.y;
						
						this._update_data.is_update_needed = true;
						this._update_data.result_action_type = 'dragging';
					}
				}
				break;
			case 'action_start':
				if (!this._action_data.is_active) {
					this._action_data.is_active = true;
					this._update_data.is_update_needed = true;
					this._update_data.result_action_type = 'start';
				}
				else {
					Dr.log('strange', this._action_data)
				}
				break;
			case 'action_end':
				if (this._action_data.is_active) {
					var delta_dist = get_dist(this._action_data.start_position, this._action_data.last_position);
					var delta_time = Dr.now() - this._action_data.start_time;
					if (delta_dist > Dr.devicePixelRatio * 5) {
						this._update_data.result_action_type = 'drag';
					}
					else {
						if (delta_time > 0.5) {
							this._update_data.result_action_type = 'hold';
						}
						else {
							this._update_data.result_action_type = 'click';
						}
					}
					
					Dr.log('result_action_type', this._update_data.result_action_type, this._action_data.start_time)
					
					this._update_data.is_update_needed = true;
					this._action_data.is_active = false;
				}
				break;
			case 'action_cancel':
				if (this._action_data.is_active) {
					Dr.log('Get action_cancel', this._action_data);
					this._action_data.is_active = false;
				}
				break;
			default:
				break;
		}
		
		
		if (action.position_listener) {
			this._action_data.last_position = action.position_listener;
		}
		
		if (this._action_data.is_active) {
			if (!this._action_data.start_position) this._action_data.start_position = this._action_data.last_position;
			if (!this._action_data.start_time) this._action_data.start_time = Dr.now();
			
			this._update_data.selected_block = this.getBlockAtPoint(this._action_data.last_position);
		}
		else {
			Dr.log('flush');
			this._action_data.start_time = 0;
			this._action_data.start_position = null;
		}
	}
	return Module;
});