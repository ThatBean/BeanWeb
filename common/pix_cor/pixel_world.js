

Dr.Declare('PixCorWorld', 'class');
Dr.Require('PixCorWorld', 'PixCorModel');
Dr.Implement('PixCorWorld', function (global, module_get) {
	
	var PixCorModel = Dr.Get('PixCorModel');	//basic pixel model
	
	var Module = function () {
		this.id = Dr.generateId();
		
		this.root_model = null;
		
		this.actors = [];
		
		
		
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
	
	return Module;
});