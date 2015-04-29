

function init() {
	Dr.LoadAll();
	Dr.UpdateLoop.start();
	
	var generateUUID = Dr.generateUUID;
	
	var FPS = Dr.Get("FPS")
	var fps = new FPS(function (averageFPS, currentFPS) {
		document.getElementById("FPS").innerHTML = "AvgFPS:" + averageFPS.toFixed(2) + ", CurFPS:" + currentFPS.toFixed(2);
	})
	Dr.UpdateLoop.add(function (delta_time) { 
		fps.FPS(); 
		return true;
	})

	var TagLog = Dr.Get("TagLog")
	var tag_log = new TagLog(function (log_text) {
		document.getElementById("Log").innerHTML = log_text;
	})
	tag_log.Log("init log " + Dr.now()); 
	/*Dr.UpdateLoop.add(function (delta_time) { 
		if (!Dr.Toggle.Log) {
			tag_log.Log(generateUUID() + "update log " + Dr.now()); 
		}
		return true;
	})*/
	
	
	
	
	
	// var Pixel3D_Engine = Dr.Get("Pixel3D_Engine");
	// var Pixel3D_Math = Dr.Get("Pixel3D_Math");
	// var Pixel3D_Data = Dr.Get("Pixel3D_Data");
	// var Pixel3D_Animation = Dr.Get("Pixel3D_Animation");
	
	
	var adjust_func = function (event_key, event, K_def) {
		var target_model_data;
		
		if (Dr.Toggle.Model) {
			switch (Dr.Toggle.Model_Type) {
				case 4:
					target_model_data = model_data4;
					break;
				case 3:
					target_model_data = model_data3;
					break;
				case 2:
					target_model_data = model_data2;
					break;
				default:
					target_model_data = model_data;
					break;
			}
		}
		else {
			return;
		}
		
		var meshes = target_model_data.meshes;
		var prevent_default = false;
		
		Dr.log('==================', K_def);
		if (K_def == 'K_LEFT') {
			for (var i = 0; i < meshes.length; i++) {
				meshes[i].Position.x -= 1;
				prevent_default = true;
			}
		}
		if (K_def == 'K_RIGHT') {
			for (var i = 0; i < meshes.length; i++) {
				meshes[i].Position.x += 1;
				prevent_default = true;
			}
		}
		if (K_def == 'K_UP') {
			for (var i = 0; i < meshes.length; i++) {
				meshes[i].Position.y += 1;
				prevent_default = true;
			}
		}
		if (K_def == 'K_DOWN') {
			for (var i = 0; i < meshes.length; i++) {
				meshes[i].Position.y -= 1;
				prevent_default = true;
			}
		}
		
		if (event && prevent_default) {
			event.preventDefault();
		}
	};
	
	Dr.Event.subscribe('KEY_UP', adjust_func);
	Dr.Event.subscribe('KEY_DOWN', adjust_func);
	
	Dr.UpdateLoop.add(drawingLoop);
}

function drawingLoop(delta_time) {
	//Dr.log("drawingLoop", delta_time);
	
	
	if (!Dr.Toggle.Render) {
		
	}
	
	return true;
}

init();