Dr.Declare('Mine_Grid', 'class');
Dr.Require('Mine_Grid', 'Mine_Type');
//Dr.Require('Mine_Grid', 'Canvas');
Dr.Implement('Mine_Grid', function (global, module_get) {
	
	var Module = function () {
		//
	}
	
	var Mine_Type = Dr.Get('Mine_Type');
	//var Canvas = Dr.Get('Canvas');
	
	Module.type = Mine_Type.type;
	
	Module.prototype.init = function (canvas) {
		this._canvas = canvas;
	}
	
	Module.prototype.initImageData = function () {
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
