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
				var shift_col = ((row % 4 == 0 || row % 4 == 3) ? 0 : 1);
				if (row % 2 == 0) {
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