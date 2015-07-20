//menu action and logic, receive user operation and send to grid

Dr.Declare('Mine_Menu', 'class');
Dr.Require('Mine_Menu', 'Mine_Type');
Dr.Require('Mine_Menu', 'CanvasExt');
Dr.Require('Mine_Menu', 'ActionBox');
Dr.Implement('Mine_Menu', function (global, module_get) {
	
	var Module = function () {
		//
	}
	
	var Mine_Type = Dr.Get('Mine_Type');
	var CanvasExt = Dr.Get('CanvasExt');
	var ActionBox = Dr.Get('ActionBox');
	
	Module.type = Mine_Type.type;
	
	Module.prototype.init = function (canvas_element) {
		//CanvasExt
		this._canvas_ext = new CanvasExt;
		this._canvas_ext.init(canvas_element);
		
		
		
		this._action_box = new ActionBox;
		
		
	}
	
	
	return Module;
});