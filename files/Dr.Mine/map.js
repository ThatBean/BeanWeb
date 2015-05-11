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
		
		E: 'Empty',
		L: 'Locked',
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
	
	Module.getChainList = function (block_type, row, col) {
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
				var shift_col = ((row % 2 == 0) ? 0 : 1;
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
				var shift_col = ((col % 4 == 0 || col % 4 == 3) ? 0 : 1;
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
	
	Module.prototype.init = function (map, block_type, x, y, is_mine, special_type) {
		this._map = map;
		this._block_type = block_type;
		this._x = x;
		this._y = y;
		this._is_mine = is_mine;
		this._special_type = special_type;
		
		this.initChainList();
	}
	
	Module.prototype.initChainList = function () {
		this._chain_list = [];
		
		var chain_list = Module.getChainList(block_type, row, col);
		for (index in chain_list) {
			var row = chain_list[index][0];
			var col = chain_list[index][1];
			if (this._map.checkLocationValid(row, col)) {
				this._chain_list.push([row, col]);
			}
		}
	}
	
	Module.prototype.flip = function () {
		var is_chain = false;
		
		return is_chain;
	}
	
	Module.prototype.chain = function (callback) {
		
	}
	
	return Module;
});



Dr.Declare('Mine_Map', 'class');
Dr.Require('Mine_Map', 'Mine_Type');
Dr.Implement('Mine_Map', function (global, module_get) {
	
	
	var Module = function () {
		//
	}
	var Mine_Type = Dr.Get('Mine_Type');
	
	Module.type = Mine_Type.type;
	
	Module.prototype.init = function (type, row, col, mine_block_count, empty_block_count, lock_block_count) {
		
		switch (type) {
			case Module.type.BOX:
				break;
			case Module.type.HEX:
				break;
			case Module.type.TRI:
				col = col * 2;
				break;
			default:
				Dr.log('[Mine_Map] error type:', type);
				return;
				break;
		}
		
		if (row * col < (mine_block_count + empty_block_count + lock_block_count)) {
			Dr.log('[Mine_Map] error count:', row * col, (mine_block_count + empty_block_count + lock_block_count), 'input:', row, col, mine_block_count, empty_block_count, lock_block_count);
			return;
		}
		
		//all directly accessible(public)
		this.type = type;
		
		
		//should not access(private)
		this._type = type;
		this._row_count = row;
		this._col_count = col;
		
		this._mine_block_count = mine_block_count;
		this._empty_block_count = empty_block_count;
		this._lock_block_count = lock_block_count;
		
		this.initMapData();
	}
	
	Module.prototype.checkLocationValid = function (row, col) {
		return row >= 0 
			&& col >= 0 
			&& row < this._row_count 
			&& col < this._col_count;
	}
	
	Module.prototype.initMapData = function () {
		this._map_data = [];
		
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
		
	}
	
	Module.prototype.drawImageClip = function (context, x, y, clip_x, clip_y, clip_width, clip_height) {
		//context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
		context.drawImage(this._data, clip_x, clip_y, clip_width, clip_height, x, y, clip_width, clip_height);
	}
	
	Module.prototype.drawImageDataClip = function (context, x, y, clip_x, clip_y, clip_width, clip_height) {
		//context.putImageData(imgData,x,y,dirtyX,dirtyY,dirtyWidth,dirtyHeight);
		context.putImageData(this._data, clip_x ? x - clip_x : x, clip_y ? y - clip_y : y, clip_x, clip_y, clip_width, clip_height);
	}
	
	return Module;
});