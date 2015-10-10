

Dr.Declare('PixCorWorld', 'class');
Dr.Require('PixCorWorld', 'PixCorModel');
Dr.Implement('PixCorWorld', function (global, module_get) {
	
	var PixCorModel = Dr.Get('PixCorModel');	//basic pixel model
	
	var Module = function () {
		this.id = Dr.generateId();
		
		this.root_model = null;
		
		this.actors = [];
		
		
		
		//TODO:
		
		//event here
	}
	
	//inhert method
	//Module.prototype = Object.create(PixCorModel.prototype);
	
	//add method
	Module.prototype.getId = function () {
		return this.id;
	};
	
	return Module;
});