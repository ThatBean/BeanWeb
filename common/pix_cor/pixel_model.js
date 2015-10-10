/*
	This implements pixel model hierarchy(tree) in PixCor,
	a basic "PixelObject"
	
	This is packs graphical data & method for physics, animation, and game logic
	
	This will not be used directly in game,
	need to pack at least once more (for actor/world/ui)
*/


Dr.Declare('PixCorModel', 'class');
Dr.Require('PixCorModel', 'DataTreeNode');
Dr.Implement('PixCorModel', function (global, module_get) {
	
	var DataTreeNode = Dr.Get('DataTreeNode');	//for loop and lookup
	
	var Module = function () {
		this.id = Dr.generateId();
		
		this.parts = [];	//PixCorPart list
		
		
		//TODO:
		
		//physics data here
		//speed
		//inertia
		
		//motion will be applied from outside
	}
	
	//inhert method
	Module.prototype = Object.create(DataTreeNode.prototype);
	
	//add method
	Module.prototype.getId = function () {
		return this.id;
	};
	
	Module.prototype.applyData = function (model_data) {
		//data apply logic
	};
	
	
	Module.loadData = function (model_data, loaded_model) {
		var loaded_model = loaded_model || new Module();
		
		loaded_model.applyData(model_data);
		
		return loaded_model;
	};
	
	
	return Module;
});