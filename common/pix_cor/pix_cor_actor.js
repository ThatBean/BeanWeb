

Dr.Declare('PixCorActor', 'class');
Dr.Require('PixCorActor', 'PixelModel');
Dr.Implement('PixCorActor', function (global, module_get) {
	
	var PixelModel = Dr.Get('PixelModel');	//basic pixel model
	
	var Module = function () {
		this.id = Dr.generateId();
		
		this.root_model = null;	//root PixelModel
		
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
	//Module.prototype = Object.create(PixelModel.prototype);
	
	//add method
	Module.prototype.getId = function () {
		return this.id;
	};
	
	return Module;
});