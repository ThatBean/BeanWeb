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
			
			// only after action finished
			action_type: '', //	'click', 'drag', 'hold'
			end_position: null,
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
			_this._update_data = {
				is_active: false,
				action_type: '', //	'click', 'drag', 'hold'
				start_position: null,
				end_position: null,
				end_block: null,
			};
		});
		
		this._block_size = this._image_store.getBlockImageSizeByType(this._block_type);
		
		//this._block_size.width += 3;
		//this._block_size.height += 1;
		
		this._frag_size = Mine_Type.getFragSize(this._block_size, this._block_type, this._map_row_count, this._map_col_count);
		
		var bottom_right_frag_position = Mine_Type.getFragPosition(this._block_type, this._map_row_count - 1, this._map_col_count - 1);
		
		switch(this._block_type) {
			case 'HEX':
				var row_check = (this._map_row_count - 1) % 2;
				bottom_right_frag_position[1] += (row_check == 0) ? 1 : 0;
				break;
			case 'TRI':
				var col_check = (this._map_col_count - 1) % 4;
				bottom_right_frag_position[0] += (col_check == 0 || col_check == 3) ? 1 : 0;
				break;
		}
		
		this._total_size = {
			width: Math.floor(bottom_right_frag_position[0] * this._frag_size.width + this._block_size.width) * this._scale,
			height: Math.floor(bottom_right_frag_position[1] * this._frag_size.height + this._block_size.height) * this._scale,
		}
	}
	
	Module.prototype.update = function (delta_time) {
		//update the whole grid, if needed
		
		this._visible_offset_left = Math.min(Math.max(this._visible_offset_left, this._visible_width - this._total_size.width), 0)
		this._visible_offset_top = Math.min(Math.max(this._visible_offset_top, this._visible_height - this._total_size.height), 0)
		
		this._update_data.is_active = true;
		if (this._update_data.is_active) {
			
			this._canvas_ext.clearCanvas();
			//update map
			
			//update block
			for (var col = 0; col < this._map_col_count; col++) {
				for (var row = 0; row < this._map_row_count; row++) {
					var block = this._mine_map.getBlockFromLocation(row, col);
					this.updateBlock(block);
				}
			}
			
			this._update_data.is_active = false;
		}
	}
	
	Module.prototype.updateBlock = function (block) {
		//update the block
		
		//??
		
		//position
		var frag_position = Mine_Type.getFragPosition(this._block_type, block.getRow(), block.getCol())
		var x = frag_position[0] * this._frag_size.width * this._scale + this._visible_offset_left;
		var y = frag_position[1] * this._frag_size.height * this._scale + this._visible_offset_top;
		
		if (
			x > this._visible_width
			|| x < 0 - this._block_size.width * this._scale
			|| y > this._visible_height
			|| y < 0 - this._block_size.height * this._scale
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
				image_type = ((block.getCol() % 2) == 1) ? 'IMAGE_TYPE_TRI_UP' : 'IMAGE_TYPE_TRI_DOWN';
				break;
			default:
				debugger;
				break;
		}
		
		var variant_type;
		var tag_image_type;
		switch(block.getSpecialType()) {
			case Mine_Type.type.FlippedBlock:
				variant_type = 'VARIANT_TYPE_FLIPPED';
				tag_image_type = 'TAG_IMAGE_NUMBER_1';
				break;
			case Mine_Type.type.NormalBlock:
				variant_type = 'VARIANT_TYPE_NORMAL';
				//tag_image_type = 'TAG_IMAGE_MARK_FLAG';
				tag_image_type = '';
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
		
		if (block == this._selected_block) {
			variant_type = 'VARIANT_TYPE_PRESSED';
		}
		
		var image_data_ext = this._image_store.getImageData(image_type, variant_type, tag_image_type, this._scale);
		
		image_data_ext.draw(this._canvas_ext.getMainContext(), x, y);
	}
	
	Module.prototype.getBlockFromActionPosition = function (action) {
		if (action.position_listener) {
			var frag_x = (action.position_listener.x - this._visible_offset_left) / (this._frag_size.width * this._scale);
			var frag_y = (action.position_listener.y - this._visible_offset_top) / (this._frag_size.height * this._scale);
			if (frag_x >= 0 && frag_y >= 0) {
				var location = Mine_Type.getBlockFromPosition(this._block_type, frag_x, frag_y);
				var row = location[0];
				var col = location[1];
				return this._mine_map.getBlockFromLocation(row, col);
			}
		}
		return;
	}
	
	Module.prototype.onAction = function (event_key, action) {
		action.event.preventDefault();
		
		Dr.UpdateLoop.add(function (delta_time) { 
			Dr.log('Get', event_key, action.position_listener);
		});
		
		
		this._selected_block = this.getBlockFromActionPosition(action);
		
		
		switch(event_key) {
			case 'action_move':
				if (this._action_data.is_active) {
					//update hover
					if (action.position_listener) {
						this._visible_offset_left += action.position_listener.x - this._action_data.last_position.x;
						this._visible_offset_top += action.position_listener.y - this._action_data.last_position.y;
					}
				}
				break;
			case 'action_start':
				if (this._action_data.is_active) {
					//update hover
				}
				else {
					this._action_data.is_active = true;
				}
				break;
			case 'action_end':
				if (this._action_data.is_active) {
					//check type and update block
					this._update_data = {}
					
					this._action_data.is_active = false;
				}
				else {
					//strange...
				}
				break;
			case 'action_cancel':
				if (this._action_data.is_active) {
					this._action_data.is_active = false;
				}
				else {
					//strange...
				}
				break;
			default:
				break;
		}
		
		this._action_status = {
			is_active: false,
			start_position: null,
			
			// only after action finished
			action_type: '', //	'click', 'drag', 'hold'
			end_position: null,
			end_block: null,
		};
		
		
		//
		if (action.position_listener) {
			this._action_data.last_position = action.position_listener;
		}
	}
	
	return Module;
});