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




function init() {
	Dr.LoadAll();
	Dr.UpdateLoop.start();
	
	
	var FPS = Dr.Get("FPS");
	var fps = new FPS(function (averageFPS, currentFPS) {
		document.getElementById("FPS").innerHTML = "AvgFPS:" + averageFPS.toFixed(2) + ", CurFPS:" + currentFPS.toFixed(2);
	})
	Dr.UpdateLoop.add(function (delta_time) { 
		fps.FPS(); 
		return true;
	})

	var TagLog = Dr.Get("TagLog");
	var tag_log = new TagLog(function (log_text) {
		document.getElementById("Log").innerHTML = log_text;
	})
	tag_log.Log("init log " + Dr.now()); 
	tag_log.listMax = 50; 
}

Dr.afterWindowLoaded(init);