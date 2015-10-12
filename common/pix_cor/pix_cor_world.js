

Dr.Declare('PixCorWorld', 'class');
Dr.Require('PixCorWorld', 'PixelModel');
Dr.Implement('PixCorWorld', function (global, module_get) {
	
	var PixelModel = Dr.Get('PixelModel');	//basic pixel model
	
	var Module = function () {
		this.id = Dr.generateId();
		
		this.root_model = null;
		
		this.actors = [];
		
		
		
		//TODO:
		
		//event here
	}
	
	//inhert method
	//Module.prototype = Object.create(PixelModel.prototype);
	
	//add method
	Module.prototype.getId = function () {
		return this.id;
	};
	
	return Module;
});