/*
	[BOX] (Block W x H: 1 x 1)
	
		1	1	1	1
		2	2	2	2
		3	3	3	3

	[HEX] (Block W x H: 4 x 2 | Condensed Block W x H: 3 x 2 | Repeat W x H: 6 x 2 - 2 Block)
	
		1		1		1
			1		1
		2		2		2
			2		2	
		3		3		3
			3		3
		
	[TRI] (Block W x H: 2 x 1 | Condensed Block W x H: 1 x 1 | Repeat W x H: 2 x 2 - 4 Block)
	
		1		1		1		1
			2		2		2
			3		3		3
		4		4		4		4
		5		5		5		5
			6		6		6
			7		7		7
		8		8		8		8
*/

Dr.Declare('Mine_Type', 'class');
Dr.Implement('Mine_Type', function (global, module_get) {
	
	var Module = function () {
		//
	}
	
	Module.type = {
		BOX: 'BOX',
		HEX: 'HEX',
		TRI: 'TRI',
		
		NormalBlock: ' ',
		EmptyBlock: 'E',
		LockBlock: 'L',
	}
	
	// ( [/] )
	Module.getTLBR = function (x, y) {
		return x + y > 1;	// true = top
	}
	// ( [\] )
	Module.getTRBL = function (x, y) {
		return x < y;	// true = top
	}
	
	Module.condensedMap = {
		HEX: [
			[
				[Module.getTLBR, [-1, 0], [0, 0]],
				[false, [0, 0]],
				[false, [0, 0]],
				[Module.getTRBL, [1, 0], [0, 0]]
				[false, [1, 0]],
				[false, [1, 0]],
			], 
			[
				[Module.getTRBL, [0, 0], [-1, 0]],
				[false, [0, 0]],
				[false, [0, 0]],
				[Module.getTLBR, [0, 0], [1, 0]]
				[false, [1, 0]],
				[false, [1, 0]],
			], 
		],
		TRI: [
			[
				[Module.getTRBL, [0, 0], [-1, 1]],
				[Module.getTLBR, [0, 0], [0, 1]]
			], 
			[
				[Module.getTLBR, [-1, 2], [0, 3]],
				[Module.getTRBL, [0, 2], [0, 3]]
			], 
		],
	}
	
	//the x and y will be normalized first(based on smallest triangle)
	Module.getBlockFromPosition = function (block_type, x, y) {
		var x_integer = Math.floor(x);
		var y_integer = Math.floor(y);
		var x_decimal = x - x_integer;
		var y_decimal = y - y_integer;
		switch (block_type) {
			case Module.type.BOX:
				var row = x_integer;
				var col = y_integer;
				return [row, col];
				break;
			case Module.type.HEX:
				var row = (x_integer - x_integer % 6) / 3;
				var col = (y_integer - y_integer % 2) / 2;
				
				var map = Module.condensedMap.HEX[y_integer % 2][x_integer % 6];
				var location_mod;
				
				if (map[0]) {
					location_mod = map[0](x_decimal, y_decimal) ? map[1] : map[2];
				}
				else {
					location_mod = map[1][0];
				}
				
				row += location_mod[0];
				col += location_mod[1];
				
				return [row, col];
				break;
			case Module.type.TRI:
				var row = (x_integer - x_integer % 2);
				var col = (y_integer - y_integer % 2);
				
				var map = Module.condensedMap.HEX[y_integer % 2][x_integer % 2];
				var location_mod;
				
				if (map[0]) {
					location_mod = map[0](x_decimal, y_decimal) ? map[1] : map[2];
				}
				else {
					location_mod = map[1][0];
				}
				
				row += location_mod[0];
				col += location_mod[1];
				
				return [row, col];
				break;
			default:
				Dr.log('[Mine_Map] error block_type:', block_type);
				break;
		}
	}
	
	Module.getSurroundList = function (block_type, row, col) {
		switch (block_type) {
			case Module.type.BOX:
				return [
					[row - 1, col - 1],
					[row - 1, col    ],
					[row - 1, col + 1],
					
					[row    , col - 1],
					[row    , col + 1],
					
					[row + 1, col - 1],
					[row + 1, col    ],
					[row + 1, col + 1],
				];
				break;
			case Module.type.HEX:
				//shift col down when the row is even
				var shift_col = ((row % 2 == 0) ? 0 : 1);
				return [
					[row - 1, col - 1 + shift_col],
					[row - 1, col     + shift_col],
					[row    , col + 1],
					[row    , col - 1],
					[row + 1, col - 1 + shift_col],
					[row + 1, col     + shift_col],
				];
				
				break;
			case Module.type.TRI:
				//shift col right when the col is (4n +1) or (4n + 2)
				var shift_col = ((col % 4 == 0 || col % 4 == 3) ? 0 : 1);
				if (col % 2 == 0) {
					return [
						[row - 2, col - 1 + shift_col],
						[row - 2, col     + shift_col],
						
						[row - 1, col - 1],
						[row - 1, col    ],
						[row - 1, col + 1],
						
						[row    , col - 1],
						[row    , col + 1],
						
						[row + 1, col - 1 + shift_col],
						[row + 1, col     + shift_col],
						
						[row + 2, col - 1 + shift_col],
						[row + 2, col     + shift_col],
						
						[row + 3, col    ],
					];
				}
				else {
					return [
						[row - 3, col    ],
						
						[row - 2, col - 1 + shift_col],
						[row - 2, col     + shift_col],
						
						[row - 1, col - 1 + shift_col],
						[row - 1, col     + shift_col],
						
						[row    , col - 1],
						[row    , col + 1],
						
						[row + 1, col - 1],
						[row + 1, col    ],
						[row + 1, col + 1],
						
						[row + 2, col - 1 + shift_col],
						[row + 2, col     + shift_col],
					];
				}
				break;
			default:
				Dr.log('[Mine_Map] error block_type:', block_type);
				break;
		}
	}
	
	return Module;
});





Dr.Declare('Mine_Block', 'class');
Dr.Require('Mine_Block', 'Mine_Type');
Dr.Implement('Mine_Block', function (global, module_get) {
	
	var Module = function () {
		//
	}
	
	var Mine_Type = Dr.Get('Mine_Type');
	Module.type = Mine_Type.type;
	
	Module.prototype.init = function (map, block_type, row, col, mine_count, special_type) {
		this._map = map;
		this._block_type = block_type;
		this._row = row;
		this._col = col;
		this._mine_count = mine_count;
		this._special_type = special_type;
	}
	
	Module.prototype.initSurround = function () {
		this.initSurroundList();
		this._surround_mine_count = this.calcSurroundMineCount();
	}
	
	Module.prototype.getMineCount = function () { return this._mine_count; }
	Module.prototype.getSurroundMineCount = function () { return this._surround_mine_count; }
	
	Module.prototype.initSurroundList = function () {
		// the block around this one
		this._surround_block_list = [];
		
		var surround_list = Mine_Type.getSurroundList(this._block_type, this._row, this._col);
		for (index in surround_list) {
			var row = surround_list[index][0];
			var col = surround_list[index][1];
			
			var surround_block = this._map.getBlockFromLocation(row, col);
			if (surround_block) {
				this._surround_block_list.push(surround_block);
			}
			else {
				Dr.debug(5, 'no block at', row, col);
			}
		}
	}
	
	Module.prototype.calcSurroundMineCount = function () {
		var count = 0;
		
		for (index in this._surround_block_list) {
			var surround_block = this._surround_block_list[index];
			count += surround_block.getMineCount();
		}
		
		return count;
	}
	
	Module.prototype.flip = function () {
		// TODO
		// TODO
		// TODO
		// TODO
		// TODO
		// TODO
	}
	
	Module.prototype.chainOperation = function (operation /* extra argument will be passed down */) {
		//execute first
		this[operation].apply(this, Dr.getArgumentArray(arguments, 1));
		
		for (index in this._surround_block_list) {
			var surround_block = this._surround_block_list[index];
			surround_block.chainOperation.apply(surround_block, arguments);
		}
	}
	
	return Module;
});







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
	
	Module.prototype.init = function (block_type, row, col, mine_block_count, empty_block_count, lock_block_count) {
		
		switch (block_type) {
			case Module.type.BOX:
			case Module.type.HEX:
				break;
			case Module.type.TRI:
				col = col * 2;
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
		
		var apply_data = function (map_data, row_count, id_list, apply_symbol) {
			for (var index in id_list) {
				var id = id_list[index];
				var row = Math.floor(id / row_count);
				var col = id % row_count;
				map_data[row][col] = apply_symbol;
			}
		}
		
		apply_data(this._map_mine_data, this._row_count, mine_block_id_list, 1);
		apply_data(this._map_visual_data, this._row_count, empty_block_id_list, Module.type.EmptyBlock);
		apply_data(this._map_visual_data, this._row_count, lock_block_id_list, Module.type.LockBlock);
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
	
	
	Module.prototype.getBlockFromPosition = function (x, y) {
		var location = Mine_Type.getBlockFromPosition(this._block_type, x, y);
		var row = location[0];
		var col = location[1];
		
		return this.getBlockFromLocation(row, col);
	}
	
	Module.prototype.getBlockFromLocation = function (row, col) {
		if (this.checkLocationValid(row, col)) {
			return this._map_block[row][col];
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
		
		Dr.log(mine_map_text);
		Dr.log(visual_map_text);
		Dr.log(surround_mine_map_text);
	}
	
	return Module;
});






Dr.Declare('Mine_Canvas', 'class');
Dr.Require('Mine_Canvas', 'Mine_Type');
Dr.Implement('Mine_Canvas', function (global, module_get) {
	
	var Module = function () {
		//
	}
	
	var Mine_Type = Dr.Get('Mine_Type');
	Module.type = Mine_Type.type;
	
	Module.prototype.init = function (canvas) {
		this._canvas = canvas;
	}
	
	Module.prototype.initImagData = function () {
		// TODO
		// TODO
		// TODO
		// TODO
		// TODO
	}
	
	Module.prototype.drawBlock = function (block) {
		
	}
	
	Module.prototype.onAction = function (action) {
		
	}
	
	return Module;
});
