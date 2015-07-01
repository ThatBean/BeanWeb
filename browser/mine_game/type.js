//basic type and function definition

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
	
	Module.fragSizeBlock = {	//how many frag for one block
		BOX: [1, 1],
		HEX: [4, 2],
		TRI: [2, 1],
	}
	
	Module.fragSizeCondensedBlock = {	//how many frag for one condensed block
		BOX: [1, 1],
		HEX: [3, 2],
		TRI: [1, 1],
	}
	
	Module.sizeAdjustment = {	//for calculate condensed block size to map size
		BOX: {
			row: [1, 0],	//scale, add
			col: [1, 0],
		},
		HEX: {
			row: [1, 1 / 3],	//scale, add
			col: [1, 1 / 2],
		},
		TRI: {
			row: [1, 1 / 2],	//scale, add
			col: [0.5, 0],
		},
	}
	
	Module.getTotalSize = function (block_size, block_type, map_row_count, map_col_count) {
		var condensed_block_width = block_size.width / Module.fragSizeBlock[block_type][0] * Module.fragSizeCondensedBlock[block_type][0];
		var condensed_block_row_count = map_row_count * Module.sizeAdjustment[block_type].row[0] + Module.sizeAdjustment[block_type].row[1];
		
		var condensed_block_height = block_size.height / Module.fragSizeBlock[block_type][1] * Module.fragSizeCondensedBlock[block_type][1];
		var condensed_block_col_count = map_col_count * Module.sizeAdjustment[block_type].col[0] + Module.sizeAdjustment[block_type].col[1];
		
		return {
			width: condensed_block_width * condensed_block_row_count,
			height: condensed_block_height * condensed_block_col_count,
		};
	}
	
	// ( [/] )
	Module.getTLBR = function (x, y) {
		return x + y > 1;	// true = top
	}
	// ( [\] )
	Module.getTRBL = function (x, y) {
		return x < y;	// true = top
	}
	
	Module.mapCondensedBlock = {
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
	
	//the x and y will be normalized first(based on fragment(smallest triangle))
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
				
				var map = Module.mapCondensedBlock.HEX[y_integer % 2][x_integer % 6];
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
				
				var map = Module.mapCondensedBlock.HEX[y_integer % 2][x_integer % 2];
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
					//row		col		is_connected by edge (false = by vertex)
					[row - 1, col - 1, false],
					[row - 1, col    , true],
					[row - 1, col + 1, false],
					
					[row    , col - 1, true],
					[row    , col + 1, true],
					
					[row + 1, col - 1, false],
					[row + 1, col    , true],
					[row + 1, col + 1, false],
				];
				break;
			case Module.type.HEX:
				//shift col down when the row is even
				var shift_col = ((row % 2 == 0) ? 0 : 1);
				return [
					[row - 1, col - 1 + shift_col, true],
					[row - 1, col     + shift_col, true],
					[row    , col + 1, true],
					[row    , col - 1, true],
					[row + 1, col - 1 + shift_col, true],
					[row + 1, col     + shift_col, true],
				];
				
				break;
			case Module.type.TRI:
				//shift col right when the col is (4n +1) or (4n + 2)
				var shift_col = ((row % 4 == 0 || row % 4 == 3) ? 0 : 1);
				if (row % 2 == 0) {
					return [
						[row - 2, col - 1 + shift_col, false],
						[row - 2, col     + shift_col, false],
						
						[row - 1, col - 1, false],
						[row - 1, col    , true],
						[row - 1, col + 1, false],
						
						[row    , col - 1, false],
						[row    , col + 1, false],
						
						[row + 1, col - 1 + shift_col, true],
						[row + 1, col     + shift_col, true],
						
						[row + 2, col - 1 + shift_col, false],
						[row + 2, col     + shift_col, false],
						
						[row + 3, col    , false],
					];
				}
				else {
					return [
						[row - 3, col    , false],
						
						[row - 2, col - 1 + shift_col, false],
						[row - 2, col     + shift_col, false],
						
						[row - 1, col - 1 + shift_col, true],
						[row - 1, col     + shift_col, true],
						
						[row    , col - 1, false],
						[row    , col + 1, false],
						
						[row + 1, col - 1, false],
						[row + 1, col    , true],
						[row + 1, col + 1, false],
						
						[row + 2, col - 1 + shift_col, false],
						[row + 2, col     + shift_col, false],
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
