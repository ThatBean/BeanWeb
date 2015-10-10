

Dr.Declare('PixCorActor', 'class');
Dr.Require('PixCorActor', 'PixCorModel');
Dr.Implement('PixCorActor', function (global, module_get) {
	
	var PixCorModel = Dr.Get('PixCorModel');	//basic pixel model
	
	var Module = function () {
		this.id = Dr.generateId();
		
		this.root_model = null;
		
		//TODO:
		
		//physics data here
		//speed
		//inertia
		
		//event here
		
		//logic here
		//advice(AI)
		//item
		//skill
		//attribute
		
	}
	
	//inhert method
	//Module.prototype = Object.create(PixCorModel.prototype);
	
	//add method
	Module.prototype.getId = function () {
		return this.id;
	};
	
	return Module;
});