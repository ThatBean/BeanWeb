Dr.Declare('Canvas', 'class');
Dr.Implement('Canvas', function (global, module_get) {
	
	var Module = function () {
		//
	}
	
	Module.event = {
		DRAW: 'DRAW',
		UPDATE: 'UPDATE',
	}
	
	Module.prototype.init = function (canvas) {
		this._canvas = canvas;
		
		this._event_center = Dr.GetNew('EventProto');
	}
	
	Module.prototype.initResource = function (resource_list) {
		// TODO
		// TODO
		// TODO
		// TODO
		// TODO
	}
	
	Module.prototype.update = function (delta_time) {
		this._event_center.emit(Module.event.UPDATE);
		
	}
	
	Module.prototype.draw = function (block) {
		this._event_center.emit(Module.event.DRAW);
	}
	
	Module.prototype.getEventCenter = function () {
		return this._event_center;
	}
	
	return Module;
});


Dr.Declare('Mine_Grid', 'class');
Dr.Require('Mine_Grid', 'Mine_Type');
Dr.Require('Mine_Grid', 'Canvas');
Dr.Implement('Mine_Grid', function (global, module_get) {
	
	var Module = function () {
		//
	}
	
	var Mine_Type = Dr.Get('Mine_Type');
	var Canvas = Dr.Get('Canvas');
	
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
