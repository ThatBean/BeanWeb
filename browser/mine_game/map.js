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
		block_type, row, col, 
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
		
		if (row * col < (mine_block_count + empty_block_count + lock_block_count)) {
			Dr.log('[Mine_Map] error count:', row * col, (mine_block_count + empty_block_count + lock_block_count), 'input:', row, col, mine_block_count, empty_block_count, lock_block_count);
			return;
		}
		
		//all directly accessible(public)
		this.block_type = block_type;
		this.row_count = row;
		this.col_count = col;
		
		
		//should not access(private)
		this._block_type = block_type;
		this._row_count = row;
		this._col_count = col;
		
		this._mine_block_count = mine_block_count;
		this._empty_block_count = empty_block_count;
		this._lock_block_count = lock_block_count;
		
		this._map_mine_data = [];
		this._map_visual_data = [];
		this._map_block = [];
		
		this.initMapData();
		
		this.initBlock();
	}
	
	Module.prototype.checkLocationValid = function (row, col) {
		return row >= 0 
			&& col >= 0 
			&& row < this._row_count 
			&& col < this._col_count;
	}
	
	Module.prototype.initMapData = function () {
		var block_count = this._row_count * this._col_count;
		
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
		
		for (var i = 0; i < this._row_count; i++) {
			var row_mine_data = [];
			var row_visual_data = [];
			for (var j = 0; j < this._col_count; j++) {
				row_mine_data[j] = 0;
				row_visual_data[j] = Module.type.NormalBlock;
			}
			this._map_mine_data[i] = row_mine_data;
			this._map_visual_data[i] = row_visual_data;
		}
		
		var apply_data = function (map_data, col_count, id_list, apply_symbol) {
			for (var index in id_list) {
				var id = id_list[index];
				var row = Math.floor(id / col_count);
				var col = id % col_count;
				
				//Dr.log(id, row, col, '|', map_data, col_count, id_list, apply_symbol);
				
				map_data[row][col] = apply_symbol;
			}
		}
		
		apply_data(this._map_mine_data, this._col_count, mine_block_id_list, Dr.getRandomInt(1, 9));	//currently set mine count to 1, could any though
		apply_data(this._map_visual_data, this._col_count, empty_block_id_list, Module.type.EmptyBlock);
		apply_data(this._map_visual_data, this._col_count, lock_block_id_list, Module.type.LockBlock);
	}
	
	Module.prototype.initBlock = function () {
		this._map_block = [];
		
		for (var i = 0; i < this._row_count; i++) {
			var row_block = [];
			for (var j = 0; j < this._col_count; j++) {
				var block = new Mine_Block;
				block.init(
					this, 
					this._block_type, 
					i, j, 
					this._map_mine_data[i][j], 
					this._map_visual_data[i][j]
				);
				row_block[j] = block;
			}
			this._map_block[i] = row_block;
		}
		
		//after all is created...
		for (var i = 0; i < this._row_count; i++) {
			for (var j = 0; j < this._col_count; j++) {
				var block = this._map_block[i][j];
				block.initSurround();
			}
		}
	}
	
	
	Module.prototype.getBlockFromLocation = function (row, col) {
		if (this.checkLocationValid(row, col)) {
			return this._map_block[row][col];
		}
		else {
			Dr.debug(5, '[getBlockFromLocation] checkLocationValid', row, col);
			return;
		}
	}
	
	Module.prototype.print = function () {
		var mine_map_text = '';
		var visual_map_text = '';
		
		var surround_mine_map_text = '';
		
		for (var i = 0; i < this._row_count; i++) {
			mine_map_text += this._map_mine_data[i].join(' ') + '\n';
			visual_map_text += this._map_visual_data[i].join(' ') + '\n';
			
			var surround_mine_count_row = [];
			for (var j = 0; j < this._col_count; j++) {
				var block = this._map_block[i][j];
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