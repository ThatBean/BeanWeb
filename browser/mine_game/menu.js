//menu action and logic, receive user operation and send to grid

Dr.Declare('Mine_Menu', 'class');
Dr.Require('Mine_Menu', 'Mine_Type');
Dr.Implement('Mine_Menu', function (global, module_get) {
	
	var Module = function () {
		//
	}
	
	var Mine_Type = Dr.Get('Mine_Type');
	
	Module.type = Mine_Type.type;
	
	Module.prototype.init = function (
		block_type, width, height, 
		mine_block_count, empty_block_count, lock_block_count
	) {
		switch (block_type) {
			case Module.type.BOX:
			case Module.type.HEX:
			case Module.type.TRI:
				break;
			default:
				Dr.log('[Mine_Menu] error block_type:', block_type);
				return;
				break;
		}
		
		if (width * height < (mine_block_count + empty_block_count + lock_block_count)) {
			Dr.log('[Mine_Menu] Error! count overflow:', width * height, (mine_block_count + empty_block_count + lock_block_count), 'input:', width, height, mine_block_count, empty_block_count, lock_block_count);
			return;
		}
		
		//all directly accessible(public)
		this.block_type = block_type;
		this.width = width;
		this.height = height;
		
		//should not access(private)
		this._block_type = block_type;
		this._width = width;
		this._height = height;
		
		this._mine_block_count = mine_block_count;
		this._empty_block_count = empty_block_count;
		this._lock_block_count = lock_block_count;
		
		this.initMapData();
		this.initBlock();
		
		
		Dr.Event.removeEventKey('MineGridUpdate');
	}
	
	Module.prototype.checkLocationValid = function (x, y) {
		return x >= 0 && x < this._width && y >= 0 && y < this._height;
	}
	
	Module.prototype.forEachXY = function (process_func) {
		for (var y = 0; y < this._height; y++) {
			for (var x = 0; x < this._width; x++) {
				process_func(x, y);
			}
		}
	}
	
	Module.prototype.getArrayYX = function (process_func) {
		var array_y_x = [];
		for (var y = 0; y < this._height; y++) {
			array_y_x[y] = [];
			for (var x = 0; x < this._width; x++) {
				array_y_x[y][x] = process_func(x, y);
			}
		}
		return array_y_x;
	}
	
	Module.prototype.initMapData = function () {
		var block_count = this._width * this._height;
		
		var block_id_pool = [];
		for (var i = 0; i < block_count; i++) block_id_pool[i] = i;
		
		var random_pick_id_list = function (block_id_pool, id_count) {
			var id_list = [];
			var block_index_list = Dr.getRandomIntMulti(0, block_id_pool.length - 1, id_count);
			for (var i = id_count - 1; i >= 0; i--) {
				var id_pack = block_id_pool.splice(block_index_list[i], 1);
				id_list.unshift(id_pack[0]);
			}
			return id_list;
		}
		
		var mine_block_id_list = random_pick_id_list(block_id_pool, this._mine_block_count);
		var empty_block_id_list = random_pick_id_list(block_id_pool, this._empty_block_count);
		var lock_block_id_list = random_pick_id_list(block_id_pool, this._lock_block_count);
		
		//init data, game will use block data directly
		this._map_init_mine_data = this.getArrayYX(function (x, y) { return 0; });
		this._map_init_visual_data = this.getArrayYX(function (x, y) { return Module.type.NormalBlock; });
		
		var quick_apply_data = function (map_data, width, id_list, apply_symbol) {
			for (var index in id_list) {
				var id = id_list[index];
				var y = Math.floor(id / width);
				var x = id % width;
				//Dr.log(id, x, y, '|', map_data, width, id_list, apply_symbol);
				map_data[y][x] = apply_symbol;
			}
		}
		
		quick_apply_data(this._map_init_mine_data, this._width, mine_block_id_list, 1/*Dr.getRandomInt(1, 9)*/);	//currently set mine count to 1, could any though
		quick_apply_data(this._map_init_visual_data, this._width, empty_block_id_list, Module.type.EmptyBlock);
		quick_apply_data(this._map_init_visual_data, this._width, lock_block_id_list, Module.type.LockBlock);
	}
	
	Module.prototype.initBlock = function () {
		var _this = this;
		this._map_block = this.getArrayYX(function (x, y) { 
			var block = new Mine_Block;
			block.init(_this, _this._block_type, x, y, _this._map_init_mine_data[y][x], _this._map_init_visual_data[y][x]);
			return block;
		});
		
		//after all is created...
		this.forEachXY(function (x, y) { _this.getBlockFromLocation(x, y).initSurround(); });
	}
	
	
	Module.prototype.getBlockFromLocation = function (x, y) {
		if (this.checkLocationValid(x, y)) {
			return this._map_block[y][x];
		}
		else {
			Dr.debug(5, '[getBlockFromLocation] checkLocationValid failed:', x, y);
			return;
		}
	}
	
	Module.prototype.notify = function (event_type) {
		var extra_arg_list = Dr.getArgumentArray(arguments, 1);
		switch (event_type) {
			case 'flip_mine_block':
				this.onFilpMineBlock.apply(this, extra_arg_list);
				break;
		}
	}
	
	Module.prototype.onFilpMineBlock = function (block) {
		Dr.log('[onFilpMineBlock] get block at:', block.getX(), block.getY(), 'mine_count:', block.getMineCount());
		
		var _this = this;
		this.forEachXY(function (x, y) { _this.getBlockFromLocation(x, y).forceFlip(); });
		
		
		var ImageDataFont = Dr.Get('ImageDataFont');
		var test_image_data_font = new ImageDataFont;
		test_image_data_font.init();
		var font_config = test_image_data_font.getFontConfig(12, 15, 'normal', 'monospace', '#F00'); //font_size, line_height, font_style, font_family, fill_style
		var font_config_bg = test_image_data_font.getFontConfig(12, 15, 'normal', 'monospace', '#000'); //font_size, line_height, font_style, font_family, fill_style
		
		
		var callback_func = function (key, mine_grid, canvas_ext) {
			var dist = 3;
			var result_image_data_font_bg = test_image_data_font.getTextImageData('Game Over', 6, 0, font_config_bg);
			result_image_data_font_bg.draw(canvas_ext.getMainContext(), 
				(canvas_ext.getWidth() - result_image_data_font_bg.width) * 0.5 - dist, 
				(canvas_ext.getHeight() - result_image_data_font_bg.height) * 0.5 - dist);
			result_image_data_font_bg.draw(canvas_ext.getMainContext(), 
				(canvas_ext.getWidth() - result_image_data_font_bg.width) * 0.5 - dist, 
				(canvas_ext.getHeight() - result_image_data_font_bg.height) * 0.5 + dist);
			result_image_data_font_bg.draw(canvas_ext.getMainContext(), 
				(canvas_ext.getWidth() - result_image_data_font_bg.width) * 0.5 + dist, 
				(canvas_ext.getHeight() - result_image_data_font_bg.height) * 0.5 - dist);
			result_image_data_font_bg.draw(canvas_ext.getMainContext(), 
				(canvas_ext.getWidth() - result_image_data_font_bg.width) * 0.5 + dist, 
				(canvas_ext.getHeight() - result_image_data_font_bg.height) * 0.5 + dist);
			
			var result_image_data_font = test_image_data_font.getTextImageData('Game Over', 6, 0, font_config);
			result_image_data_font.draw(canvas_ext.getMainContext(), 
				(canvas_ext.getWidth() - result_image_data_font.width) * 0.5, 
				(canvas_ext.getHeight() - result_image_data_font.height) * 0.5);
		};
		Dr.Event.addEventListener('MineGridUpdate', callback_func);
	}
	
	Module.prototype.print = function () {
		var _this = this;
		var Mine_Menu = this.getArrayYX(function (x, y) { return _this.getBlockFromLocation(x, y).getMineCount(); });
		var visual_map = this.getArrayYX(function (x, y) { return _this.getBlockFromLocation(x, y).getVisualType(); });
		var surround_Mine_Menu = this.getArrayYX(function (x, y) { return _this.getBlockFromLocation(x, y).getSurroundMineCount(); });
		
		var Mine_Menu_text = '';
		var visual_map_text = '';
		var surround_Mine_Menu_text = '';
		for (var y = 0; y < this._height; y++) {
			Mine_Menu_text += Mine_Menu[y].join(' ') + '\n';
			visual_map_text += visual_map[y].join(' ') + '\n';
			surround_Mine_Menu_text += surround_Mine_Menu[y].join(' ') + '\n';
		}
		
		Dr.log('[Mine Map]');
		Dr.log(Mine_Menu_text);
		Dr.log('[Visual Map]');
		Dr.log(visual_map_text);
		Dr.log('[Surround Mine Map]');
		Dr.log(surround_Mine_Menu_text);
	}
	
	return Module;
});