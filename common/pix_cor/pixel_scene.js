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
	
	return Module;
});