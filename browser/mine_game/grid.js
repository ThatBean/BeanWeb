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
		
		this._visible_width = this._canvas_ext.getWidth();
		this._visible_height = this._canvas_ext.getHeight();
		
		// top left == (0 ,0), for scroll/drag
		this._visible_offset_top = 0;
		this._visible_offset_left = 0;
		
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
			result_action_type: '', //	'click', 'drag', 'hold'
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
		
		this._visible_offset_left = Math.min(Math.max(this._visible_offset_left, this._visible_width - this._total_size.width), 0)
		this._visible_offset_top = Math.min(Math.max(this._visible_offset_top, this._visible_height - this._total_size.height), 0)
		
		if (this._update_data._selected_block) {
			if (this._update_data.result_action_type == 'hold') this._update_data._selected_block.toggleIsFlagged();
			if (this._update_data.result_action_type == 'click') this._update_data._selected_block.chainFlip();
		}
		
		// this._update_data.is_update_needed = true;
		if (this._update_data.is_update_needed) {
			this._canvas_ext.clearCanvas();
			//update map
			
			//update block
			for (var y = 0; y < this._map_height; y++) {
				for (var x = 0; x < this._map_width; x++) {
					var block = this._mine_map.getBlockFromLocation(x, y);
					this.updateBlock(block);
				}
			}
			
			this._update_data.result_action_type = '';
			this._update_data.result_action_type = '';
			this._update_data.is_update_needed = false;
		}
	}
	
	Module.prototype.updateBlock = function (block) {
		//update the block
		
		//
		
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
			//out of canvas
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
		
		if (block == this._update_data._selected_block) {
			if (this._action_data.is_active) variant_type = 'VARIANT_TYPE_PRESSED';
		}
		
		
		
		var image_data_ext = this._image_store.getImageData(image_type, variant_type, tag_image_type, this._scale);
		
		image_data_ext.draw(this._canvas_ext.getMainContext(), x, y);
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
	
	var get_dist = function (point_1, point_2) {
		var dx = point_1.x - point_2.x;
		var dy = point_1.y - point_2.y;
		return Math.sqrt(dx * dx + dy * dy);
	}
	
	Module.prototype.onAction = function (event_key, action) {
		action.event.preventDefault();
		
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
					this._action_data.result_action_type = 'start';
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
					
					this._update_data.is_update_needed = true;
					this._action_data.is_active = false;
					
					this._action_data.start_time = 0;
					this._action_data.start_position = null;
				}
				break;
			case 'action_cancel':
				if (this._action_data.is_active) {
					Dr.log('Get action_cancel', this._action_data);
					this._action_data.is_active = false;
					
					this._action_data.start_time = 0;
					this._action_data.start_position = null;
				}
				else {
					//strange...
				}
				break;
			default:
				break;
		}
		
		
		if (action.position_listener) {
			this._action_data.last_position = action.position_listener;
			
			if (this._action_data.is_active) {
				if (!this._action_data.start_position) this._action_data.start_position = action.position_listener;
				if (!this._action_data.start_time) this._action_data.start_time = Dr.now();
			this._update_data._selected_block = this.getBlockAtPoint(action.position_listener);
			}
		}
	}
	
	return Module;
});