//block data & logic

Dr.Declare('Mine_Block', 'class');
Dr.Require('Mine_Block', 'Mine_Type');
Dr.Implement('Mine_Block', function (global, module_get) {
	
	var Module = function () {
		//
	}
	
	var Mine_Type = Dr.Get('Mine_Type');
	Module.type = Mine_Type.type;
	
	Module.prototype.init = function (map, block_type, row, col, mine_count, visual_type) {
		this._map = map;
		this._block_type = block_type;
		this._row = row;
		this._col = col;
		this._mine_count = mine_count;
		this._visual_type = visual_type;
		
		this._is_flagged = false;
	}
	
	Module.prototype.initSurround = function () {
		this.initSurroundList();
		this._surround_mine_count = this._mine_count > 0 ? 'X' : this.calcSurroundMineCount();
	}
	
	Module.prototype.getRow = function () { return this._row; }
	Module.prototype.getCol = function () { return this._col; }
	Module.prototype.getMineCount = function () { return this._mine_count; }
	Module.prototype.getSurroundMineCount = function () { return this._surround_mine_count; }
	Module.prototype.getVisualType = function () { return this._visual_type; }
	Module.prototype.getIsFlagged = function () { return this._is_flagged; }
	
	Module.prototype.toggleIsFlagged = function () { this._is_flagged = !this._is_flagged; }
	
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
		if (this._visual_type == Mine_Type.type.LockBlock || this._visual_type == Mine_Type.type.EmptyBlock) {
			return false;
		}
		
		if (this._mine_count > 0) {
			alert('BOOM!');
			return false;
		}
		
		this._visual_type = Mine_Type.type.FlippedBlock;
		return (this._surround_mine_count == 0);
	}
	
	Module.prototype.chainFlip = function () {
		this.chainOperation('flip');
	}
	
	Module.prototype.chainOperation = function (function_name, chain_id/* extra argument will be passed down */) {
		var chain_id = chain_id || Dr.generateId();
		
		//Dr.log('chainOperation', chain_id, this._row, this._col)
		
		//loop prevent
		if (this._last_chain_id == chain_id) { return; }
		else { this._last_chain_id = chain_id; }
		
		//execute first
		var is_chain_continue = this[function_name].apply(this, Dr.getArgumentArray(arguments, 2));
		
		//continue
		if (is_chain_continue) {
			for (index in this._chain_block_list) {
				var chain_block = this._chain_block_list[index];
				
				var arg_array = Dr.getArgumentArray(arguments);
				arg_array[0] = function_name;
				arg_array[1] = chain_id;
				
				chain_block.chainOperation.apply(chain_block, arg_array);
			}
		}
	}
	
	return Module;
});