/*
	[BOX]
	
		1	1	1	1
		2	2	2	2
		3	3	3	3

	[HEX]
	
		1		1		1
			1		1
		2		2		2
			2		2	
		3		3		3
			3		3
		
	[TRI]
	
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
	
	//the x and y will be normalized first
	Module.getBlockFromPosition = function (type, x, y) {
			switch (type) {
			case Module.type.BOX:
				var row = Math.floor(x);
				var col = Math.floor(y);
				return [row, col];
				break;
			case Module.type.HEX:
				var decimal = x - Math.floor(x);
				if (decimal >= 0.25 && decimal <= 0.75) {
					var row = Math.floor(x);
					var col = Math.floor(y);
					return [row, col];
				}
				else {
					
				}
				
				//shift col down when the row is even
				var shift_col = ((row % 2 == 0) ? 0 : 1;
				var row = Math.floor(x);
				var col = Math.floor(y);
				return [row, col];
				return ;
				break;
			case Module.type.TRI:
				//shift col right when the col is (4n +1) or (4n + 2)
				var shift_col = ((col % 4 == 0 || col % 4 == 3) ? 0 : 1;
				if (col % 2 == 0) {
					return ;
				}
				else {
					return ;
				break;
			default:
				Dr.log('[Mine_Map] error type:', type);
				break;
		}
	}
	
	Module.getChainList = function (type, row, col) {
		switch (type) {
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
				Dr.log('[Mine_Map] error type:', type);
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
	
	Module.prototype.init = function (type, width, height, mine_count, special_count_list) {
		
		switch (type) {
			case Module.type.BOX:
				break;
			case Module.type.HEX:
				break;
			case Module.type.TRI:
				height = height * 2;
				break;
			default:
				Dr.log('[Mine_Map] error type:', type);
				break;
		}
		
		//all directly accessible(public)
		this.type = type;
		this.data = this._editable ? data : null;
		
		this.width = data.width;
		this.height = data.height;
		
		//should not access(private)
		this._source = source;
		this._data = data;
	}
	
	Module.prototype.drawImage = function (context, x, y) {
		context.drawImage(this._data, x, y);
	}
	
	Module.prototype.drawImageData = function (context, x, y) {
		context.putImageData(this._data, x, y);
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