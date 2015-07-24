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
		//Mine_Map
		this._mine_map = mine_map;
		
		this._block_type = mine_map.block_type;
		this._map_width = mine_map.width;
		this._map_height = mine_map.height;
		
		
		//CanvasExt
		this._canvas_ext = new CanvasExt;
		this._canvas_ext.init(canvas_element);
		
		this._visible_width = this._canvas_ext.width;
		this._visible_height = this._canvas_ext.height;
		
		// top left == (0 ,0), for scroll/drag
		this._visible_offset_top = 0;
		this._visible_offset_left = 0;
		
		var _this = this;
		var on_event_callback =  function (event_key, action, action_data) { _this.onExtAction(event_key, action, action_data); };
		this._canvas_ext.getEventCenter().addEventListener(CanvasExt.event.EXT_ACTION_DRAGGING, on_event_callback);
		this._canvas_ext.getEventCenter().addEventListener(CanvasExt.event.EXT_ACTION_DRAG, on_event_callback);
		this._canvas_ext.getEventCenter().addEventListener(CanvasExt.event.EXT_ACTION_HOLD, on_event_callback);
		this._canvas_ext.getEventCenter().addEventListener(CanvasExt.event.EXT_ACTION_CLICK, on_event_callback);
		this._canvas_ext.getEventCenter().addEventListener(CanvasExt.event.EXT_ACTION_START, on_event_callback);
		
		
		var _this = this;
		//Mine_ImageStore
		this._image_store = new Mine_ImageStore;
		this._image_store.init(function (image_store) {
			Dr.log('image_store inited');
			
			//update
			Dr.UpdateLoop.add(function (delta_time) { 
				_this.update(delta_time);
				return true;
			}, 'mine_grid_update');
		});
		
		this._update_data = {
			is_update_needed: false,
			result_action_type: '',
			selected_block: null,
		};
		
		this.resetScale(scale)
	}
	
	Module.prototype.resetScale = function (scale) {
		this._scale = scale || 1;	//scale will be applied last
		
		var block_size = this._image_store.getBlockImageSizeByType(this._block_type);
		this._block_size = {
			width: block_size.width * this._scale,
			height: block_size.height * this._scale,
		}
		
		var frag_size = Mine_Type.getFragSize(block_size, this._block_type, this._map_width, this._map_height);
		this._frag_size = {
			width: frag_size.width * this._scale,
			height: frag_size.height * this._scale,
		}
		
		var bottom_right_frag_position = Mine_Type.getFragPosition(this._block_type, this._map_width - 1, this._map_height - 1);
		switch(this._block_type) {
			case 'HEX':
				var x_check = (this._map_width - 1) % 2;
				bottom_right_frag_position[1] += (x_check == 0) ? 1 : 0;
				break;
			case 'TRI':
				var y_check = (this._map_height - 1) % 4;
				bottom_right_frag_position[0] += (y_check == 0 || y_check == 3) ? 1 : 0;
				break;
		}
		
		this._total_size = {
			width: Math.floor(bottom_right_frag_position[0] * this._frag_size.width + this._block_size.width),
			height: Math.floor(bottom_right_frag_position[1] * this._frag_size.height + this._block_size.height),
		}
		
		this._update_data.is_update_needed = true;
	}
	
	Module.prototype.update = function (delta_time) {
		//update the whole grid, if needed
		
		// this._update_data.is_update_needed = true;
		if (this._update_data.is_update_needed) {
			this._visible_offset_left = Math.min(Math.max(this._visible_offset_left, this._visible_width - this._total_size.width), 0)
			this._visible_offset_top = Math.min(Math.max(this._visible_offset_top, this._visible_height - this._total_size.height), 0)
			
			if (this._update_data.selected_block) {
				//Dr.log('update result_action_type', this._update_data.result_action_type)
				if (this._update_data.result_action_type == CanvasExt.event.EXT_ACTION_HOLD) this._update_data.selected_block.toggleIsFlagged();
				if (this._update_data.result_action_type == CanvasExt.event.EXT_ACTION_CLICK) this._update_data.selected_block.chainFlip();
			}
			
			this._canvas_ext.clearCanvas();
			//update map
			
			//update block
			for (var y = 0; y < this._map_height; y++) {
				for (var x = 0; x < this._map_width; x++) {
					var block = this._mine_map.getBlockFromLocation(x, y);
					this.updateBlock(block);
				}
			}
			
			//update selected block
			if (this._update_data.selected_block && 
				(this._update_data.result_action_type == CanvasExt.event.EXT_ACTION_DRAGGING
				|| this._update_data.result_action_type == CanvasExt.event.EXT_ACTION_START)) {
				this.drawBlock(this._update_data.selected_block, 'VARIANT_TYPE_PRESSED', '');
			}
			
			Dr.Event.emit('MineGridUpdate', this, this._canvas_ext);
			
			this._update_data.is_update_needed = false;
		}
		
	}
	
	Module.prototype.drawBlock = function (block, variant_type, tag_image_type) {
		//position
		var frag_position = Mine_Type.getFragPosition(this._block_type, block.getX(), block.getY())
		var x = frag_position[0] * this._frag_size.width + this._visible_offset_left;
		var y = frag_position[1] * this._frag_size.height + this._visible_offset_top;
		
		if (
			x > this._visible_width
			|| x < 0 - this._block_size.width
			|| y > this._visible_height
			|| y < 0 - this._block_size.height
		) {
			return;
		}
		
		//images
		var image_type;
		switch(this._block_type) {
			case Mine_Type.type.BOX:
				image_type = 'IMAGE_TYPE_BOX';
				break;
			case Mine_Type.type.HEX:
				image_type = 'IMAGE_TYPE_HEX';
				break;
			case Mine_Type.type.TRI:
				image_type = ((block.getY() % 2) == 1) ? 'IMAGE_TYPE_TRI_UP' : 'IMAGE_TYPE_TRI_DOWN';
				break;
			default:
				debugger;
				break;
		}
		
		var image_data_ext = this._image_store.getImageData(image_type, variant_type, tag_image_type, this._scale);
		image_data_ext.draw(this._canvas_ext.getMainContext(), x, y);
	}
	
	Module.prototype.updateBlock = function (block) {
		//update the block
		
		//
		
		var variant_type = '';
		var tag_image_type = '';
		switch(block.getVisualType()) {
			case Mine_Type.type.FlippedBlock:
				variant_type = 'VARIANT_TYPE_FLIPPED';
				if (block.getMineCount() > 0) tag_image_type = 'TAG_IMAGE_MARK_MINE';
				if (block.getSurroundMineCount() > 0) tag_image_type = 'TAG_IMAGE_NUMBER_' + block.getSurroundMineCount();
				break;
			case Mine_Type.type.NormalBlock:
				variant_type = 'VARIANT_TYPE_NORMAL';
				if (block.getIsFlagged()) tag_image_type = 'TAG_IMAGE_MARK_FLAG';
				break;
			case Mine_Type.type.EmptyBlock:
				variant_type = 'VARIANT_TYPE_FLIPPED';
				tag_image_type = 'TAG_IMAGE_MARK_EMPTY';
				break;
			case Mine_Type.type.LockBlock:
				variant_type = 'VARIANT_TYPE_NORMAL';
				tag_image_type = 'TAG_IMAGE_MARK_LOCK';
				break;
			default:
				debugger;
				break;
		}
		
		this.drawBlock(block, variant_type, tag_image_type);
	}
	
	Module.prototype.getBlockAtPoint = function (point) {
		var frag_x = (point.x - this._visible_offset_left) / (this._frag_size.width);
		var frag_y = (point.y - this._visible_offset_top) / (this._frag_size.height);
		if (frag_x >= 0 && frag_y >= 0) {
			var map_location = Mine_Type.getBlockFromPosition(this._block_type, frag_x, frag_y);
			var map_x = map_location[0];
			var map_y = map_location[1];
			return this._mine_map.getBlockFromLocation(map_x, map_y);
		}
		return;
	}
	
	Module.prototype.onExtAction = function (event_key, action, action_data) {
		action.event.preventDefault();
		
		//Dr.log('Get', event_key, action.position_listener);
		
		switch(event_key) {
			case CanvasExt.event.EXT_ACTION_DRAGGING:
				this._visible_offset_left += action.position_listener.x - action_data.last_position.x;
				this._visible_offset_top += action.position_listener.y - action_data.last_position.y;
				break;
			case CanvasExt.event.EXT_ACTION_DRAG:
			case CanvasExt.event.EXT_ACTION_HOLD:
			case CanvasExt.event.EXT_ACTION_CLICK:
			case CanvasExt.event.EXT_ACTION_START:
			default:
				break;
		}
		
		this._update_data.is_update_needed = true;
		this._update_data.result_action_type = event_key;
		
		if (action_data.is_active && action.position_listener) this._update_data.selected_block = this.getBlockAtPoint(action.position_listener);
	}
	
	return Module;
});