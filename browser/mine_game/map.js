//map data and logic, receive user operation and send to block

Dr.Declare('Mine_Map', 'class');
Dr.Require('Mine_Map', 'Mine_Type');
Dr.Require('Mine_Map', 'Mine_Block');
Dr.Implement('Mine_Map', function (global, module_get) {
	
	var Module = function () {
		//
	}
	
	var Mine_Type = Dr.Get('Mine_Type');
	var Mine_Block = Dr.Get('Mine_Block');
	
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
				Dr.log('[Mine_Map] error block_type:', block_type);
				return;
				break;
		}
		
		if (width * height < (mine_block_count + empty_block_count + lock_block_count)) {
			Dr.log('[Mine_Map] error count:', width * height, (mine_block_count + empty_block_count + lock_block_count), 'input:', width, height, mine_block_count, empty_block_count, lock_block_count);
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
		
		this._map_mine_data = [];
		this._map_visual_data = [];
		this._map_block = [];
		
		this.initMapData();
		
		this.initBlock();
	}
	
	Module.prototype.checkLocationValid = function (x, y) {
		return x >= 0 
			&& y >= 0 
			&& x < this._width 
			&& y < this._height;
	}
	
	Module.prototype.initMapData = function () {
		var block_count = this._width * this._height;
		
		var block_id_pool = [];
		for (var i = 0; i < block_count; i++) block_id_pool[i] = i;
		
		var get_id_list = function (block_id_pool, id_count) {
			var id_list = [];
			var block_index_list = Dr.getRandomIntMulti(0, block_id_pool.length - 1, id_count);
			for (var i = id_count - 1; i >= 0; i--) {
				var id_pack = block_id_pool.splice(block_index_list[i], 1);
				id_list.unshift(id_pack[0]);
			}
			return id_list;
		}
		
		var mine_block_id_list = get_id_list(block_id_pool, this._mine_block_count);
		var empty_block_id_list = get_id_list(block_id_pool, this._empty_block_count);
		var lock_block_id_list = get_id_list(block_id_pool, this._lock_block_count);
		
		this._map_mine_data = [];
		this._map_visual_data = [];
		
		for (var y = 0; y < this._height; y++) {
			var row_mine_data = [];
			var row_visual_data = [];
			for (var x = 0; x < this._width; x++) {
				row_mine_data[x] = 0;
				row_visual_data[x] = Module.type.NormalBlock;
			}
			this._map_mine_data[y] = row_mine_data;
			this._map_visual_data[y] = row_visual_data;
		}
		
		var apply_data = function (map_data, width, id_list, apply_symbol) {
			for (var index in id_list) {
				var id = id_list[index];
				var y = Math.floor(id / width);
				var x = id % width;
				
				//Dr.log(id, x, y, '|', map_data, width, id_list, apply_symbol);
				
				map_data[y][x] = apply_symbol;
			}
		}
		
		apply_data(this._map_mine_data, this._width, mine_block_id_list, 1/*Dr.getRandomInt(1, 9)*/);	//currently set mine count to 1, could any though
		apply_data(this._map_visual_data, this._width, empty_block_id_list, Module.type.EmptyBlock);
		apply_data(this._map_visual_data, this._width, lock_block_id_list, Module.type.LockBlock);
	}
	
	Module.prototype.initBlock = function () {
		this._map_block = [];
		
		for (var y = 0; y < this._height; y++) {
			var row_block = [];
			for (var x = 0; x < this._width; x++) {
				var block = new Mine_Block;
				block.init(
					this, 
					this._block_type, 
					x, y, 
					this._map_mine_data[y][x], 
					this._map_visual_data[y][x]
				);
				row_block[x] = block;
			}
			this._map_block[y] = row_block;
		}
		
		//after all is created...
		for (var y = 0; y < this._height; y++) {
			for (var x = 0; x < this._width; x++) {
				var block = this._map_block[y][x];
				block.initSurround();
			}
		}
	}
	
	
	Module.prototype.getBlockFromLocation = function (x, y) {
		if (this.checkLocationValid(x, y)) {
			return this._map_block[y][x];
		}
		else {
			Dr.debug(5, '[getBlockFromLocation] checkLocationValid', x, y);
			return;
		}
	}
	
	Module.prototype.print = function () {
		var mine_map_text = '';
		var visual_map_text = '';
		
		var surround_mine_map_text = '';
		
		for (var y = 0; y < this._height; y++) {
			mine_map_text += this._map_mine_data[y].join(' ') + '\n';
			visual_map_text += this._map_visual_data[y].join(' ') + '\n';
			
			var surround_mine_count_row = [];
			for (var x = 0; x < this._width; x++) {
				var block = this._map_block[y][x];
				surround_mine_count_row.push(block.getSurroundMineCount());
			}
			surround_mine_map_text += surround_mine_count_row.join(' ') + '\n';
		}
		
		Dr.log('Notice the map is filpped');
		Dr.log(mine_map_text);
		Dr.log(visual_map_text);
		Dr.log(surround_mine_map_text);
	}
	
	return Module;
});