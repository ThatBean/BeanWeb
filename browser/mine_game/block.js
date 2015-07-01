//block data & logic

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
		this._chain_block_list = [];
		
		var surround_list = Mine_Type.getSurroundList(this._block_type, this._row, this._col);
		for (index in surround_list) {
			var row = surround_list[index][0];
			var col = surround_list[index][1];
			var is_edge_connected = surround_list[index][2];
			
			var surround_block = this._map.getBlockFromLocation(row, col);
			if (surround_block) {
				this._surround_block_list.push(surround_block);
				
				if (is_edge_connected) {
					this._chain_block_list.push(surround_block);
				}
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
	
	Module.prototype.chainOperation = function (chain_id, operation /* extra argument will be passed down */) {
		var chain_id = chain_id || Dr.generateId();
		
		//loop prevent
		if (this._last_chain_id == chain_id) { return; }
		else { this._last_chain_id = chain_id; }
		
		//execute first
		var is_chain_continue = this[operation].apply(this, Dr.getArgumentArray(arguments, 2));
		
		//continue
		if (is_chain_continue) {
			for (index in this._chain_block_list) {
				var chain_block = this._chain_block_list[index];
				chain_block.chainOperation.apply(chain_block, arguments);
			}
		}
	}
	
	return Module;
});