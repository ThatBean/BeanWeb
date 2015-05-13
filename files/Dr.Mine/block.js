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