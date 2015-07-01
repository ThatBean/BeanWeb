//the map for drawing, deal with user operation pre processing, send to map
//the drag-able block grid
Dr.Declare('Mine_Grid', 'class');
Dr.Require('Mine_Grid', 'CanvasExt');
Dr.Require('Mine_Grid', 'Mine_Type');
//Dr.Require('Mine_Grid', 'Mine_Map'); //not actually needed
Dr.Require('Mine_Grid', 'Mine_ImageStore');
Dr.Implement('Mine_Grid', function (global, module_get) {
	
	var Module = function () {
		//
	}
	
	var CanvasExt = Dr.Get('CanvasExt');
	
	var Mine_Type = Dr.Get('Mine_Type');
	//var Mine_Map = Dr.Get('Mine_Map');
	var Mine_ImageStore = Dr.Get('Mine_ImageStore');
	
	Module.type = Mine_Type.type;
	
	
	Module.prototype.init = function (canvas_element, mine_map, scale) {
		this._scale = scale || 1;	//scale will be applied last
		
		
		//Mine_Map
		this._mine_map = mine_map;
		
		this._block_type = mine_map.block_type;
		this._map_row_count = mine_map.row_count;
		this._map_col_count = mine_map.col_count;
		
		
		//CanvasExt
		this._canvas_ext = new CanvasExt;
		this._canvas_ext.init(canvas_element);
		
		this._visible_width = this._canvas_ext.width;
		this._visible_height = this._canvas_ext.height;
		
		// top left == (0 ,0), for scroll/drag
		this._visible_offset_top = 0;
		this._visible_offset_left = 0;
		
		var _this = this;
		var on_event_callback =  function (event_key, action) { _this.onAction(event_key, action); };
		this._canvas_ext.getEventCenter().addEventListener('action_move', on_event_callback);
		this._canvas_ext.getEventCenter().addEventListener('action_start', on_event_callback);
		this._canvas_ext.getEventCenter().addEventListener('action_end', on_event_callback);
		this._canvas_ext.getEventCenter().addEventListener('action_cancel', on_event_callback);
		
		
		//Mine_ImageStore
		this._image_store = new Mine_ImageStore;
		this._image_store.init();
		
		this._block_size = this._image_store.getBlockImageSizeByType(this._block_type);
		this._total_size = Mine_Type.getTotalSize(this._block_size, this._block_type, this._map_row_count, this._map_col_count);
	}
	
	Module.prototype.drawBlock = function (block) {
		
	}
	
	Module.prototype.update = function (delta_time) {
		//update block animation????
	}
	
	Module.prototype.onAction = function (event_key, action) {
		action.event.preventDefault();
		
		Dr.UpdateLoop.add(function (delta_time) { 
			Dr.log('Get', event_key, action.position_listener);
		});
	}
	
	return Module;
});