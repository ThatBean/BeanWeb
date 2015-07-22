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
		var on_event_callback =  function (event_key, action, action_data) { _this.onExtAction(event_key, action, action_data); };
		this._canvas_ext.getEventCenter().addEventListener(CanvasExt.event.EXT_ACTION_DRAGGING, on_event_callback);
		this._canvas_ext.getEventCenter().addEventListener(CanvasExt.event.EXT_ACTION_DRAG, on_event_callback);
		this._canvas_ext.getEventCenter().addEventListener(CanvasExt.event.EXT_ACTION_HOLD, on_event_callback);
		this._canvas_ext.getEventCenter().addEventListener(CanvasExt.event.EXT_ACTION_CLICK, on_event_callback);
		this._canvas_ext.getEventCenter().addEventListener(CanvasExt.event.EXT_ACTION_START, on_event_callback);
		
		this._update_data = {
			is_update_needed: false,
			result_action_type: '', //	'click', 'drag', 'hold'
			selected_action_box: null,
		};
		
		//update
		Dr.UpdateLoop.add(function (delta_time) { 
			_this.update(delta_time);
			return true;
		}, 'mine_menu_update');
	}
	
	
	Module.prototype.update = function (delta_time) {
		
		// this._update_data.is_update_needed = true;
		if (this._update_data.is_update_needed) {
			
			//this._canvas_ext.clearCanvas();
			//update map
			
			this._update_data.is_update_needed = false;
		}
	}
	
	Module.prototype.onExtAction = function (event_key, action, action_data) {
		action.event.preventDefault();
		//Dr.log('Get', event_key, action.position_listener);
		switch(event_key) {
			case CanvasExt.event.EXT_ACTION_DRAGGING:
			case CanvasExt.event.EXT_ACTION_DRAG:
			case CanvasExt.event.EXT_ACTION_HOLD:
			case CanvasExt.event.EXT_ACTION_CLICK:
			case CanvasExt.event.EXT_ACTION_START:
			default:
				break;
		}
		
		this._update_data.is_update_needed = true;
		this._update_data.result_action_type = event_key;
		
		if (action_data.is_active) {
			this._update_data.selected_action_box = this._action_box.checkAction(action);
		}
	}
	
	
	return Module;
});