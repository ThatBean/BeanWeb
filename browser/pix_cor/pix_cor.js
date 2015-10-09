//Dr.Pix-Cor
// by Bean/Dr.Eames
// start at 2015.10.09

/*
	Pixel Core Client main entry script
	
		
	
	
*/

//to use
//Dr.Get('PixCor').create();

Dr.Declare('PixCor', 'class');
Dr.Implement('PixCor', function (global, module_get) {
	var Module = function () {
		//
	};
	
	Module.prototype.init = function (config_data) {
		//
	};
	
	Module.prototype.clear = function () {
		//
	};
	
	Module.create = function () {
		var instance = new Module;
		instance.init();
		//Dr.afterWindowLoaded(function () { instance.init(); });
		return instance;
	};
	
	return Module;
});