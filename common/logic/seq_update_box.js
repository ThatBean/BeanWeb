/*
	Sequenced - Update - Box (of code)
		used to pack logic code into state-machine like "box"
	
	Packed Logic:
		In each Logic Sequence, there are multiple <SeqUpdateBox>(or state of state-machine), but only one is Active
		
		
		
		
*/


Dr.Declare('SeqUpdateBox', 'class');
Dr.Implement('SeqUpdateBox', function (global, module_get) {
	
	var Module = function () {
		//
	}
	
	Module.prototype.init = function (data_pack) {
		this.data_pack = data_pack || {};
		
		this.name = "SeqUpdateBox";	//for debug/log
	};
	
	// delta_time: in seconds
	Module.prototype.update = function (delta_time, data_pack) {
		// update logic
		
	};
	
	Module.prototype.enter = function (data_pack) {
		//
	};
	
	Module.prototype.exit = function (data_pack) {
		return data_pack;
	};
	
	return Module;
});