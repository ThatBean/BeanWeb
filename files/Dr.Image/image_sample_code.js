function init() {
	Dr.LoadAll();
	Dr.UpdateLoop.start();
	
	var generateUUID = Dr.generateUUID;
	
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
	
	
	var main_canvas = document.getElementById('Dr.Canvas');
	var main_context = main_canvas.getContext('2d');
	
	var test_image_data = document.getElementById('test_image_data');
	
	var test_canvas_data = document.getElementById('test_canvas_data');
	var font_size = test_canvas_data.height;
	var ctx = test_canvas_data.getContext('2d');
	ctx.font = "bold " + font_size + "px monaco, consolas, monospace";
	ctx.textAlign = "left";
	ctx.textBaseline = "middle";
	ctx.fillStyle = "#500";
	ctx.fillText("TestCanvasData", 0, test_canvas_data.height * 0.5);
	
	
	
	var ImageData = Dr.Get("ImageData");
	
	var image_data_image = new ImageData;
	var image_data_canvas = new ImageData;
	var image_data_canvas_data = new ImageData;
	
	image_data_image.init('local', test_image_data, ImageData.type.IMAGE_ELEMENT);
	image_data_canvas.init('local', test_canvas_data, ImageData.type.CANVAS_ELEMENT);
	image_data_canvas_data.init('local', ctx.getImageData(0, 0, test_canvas_data.width, test_canvas_data.height), ImageData.type.CANVAS_IMAGE_DATA);
	
	var loop_count = 10000;
	
	var log_list = ['Testing draw speed', 'loop_count:', loop_count];
	tag_log.Log(log_list.join(' '));
	
	var timer = Dr.now();
	for (var i = 0; i < loop_count; i++) image_data_image.draw(main_context, 0, 0);
	log_list = ['[End] image_data_image', 'time:', Dr.now() - timer, 'Hz:', 1 / (Dr.now() - timer)];
	tag_log.Log(log_list.join(' '));
	
	var timer = Dr.now();
	for (var i = 0; i < loop_count; i++) image_data_canvas.draw(main_context, 0, 0);
	log_list = ['[End] image_data_canvas', 'time:', Dr.now() - timer, 'Hz:', 1 / (Dr.now() - timer)];
	tag_log.Log(log_list.join(' '));
	
	var timer = Dr.now();
	for (var i = 0; i < loop_count; i++) image_data_canvas_data.draw(main_context, 0, 0);
	log_list = ['[End] image_data_canvas_data', 'time:', Dr.now() - timer, 'Hz:', 1 / (Dr.now() - timer)];
	tag_log.Log(log_list.join(' '));
	
	
	var i = 0;
	Dr.UpdateLoop.add(function (delta_time) { 
		i += delta_time * 120;
		//i += 1;
		i = i % main_canvas.width;
		image_data_image.draw(main_context, i, 0 + i);
		image_data_canvas.draw(main_context, i, 100 + i);
		image_data_canvas_data.draw(main_context, i, 200 + i);
		return true;
	})
	
	
	Dr.main_canvas = main_canvas;
	Dr.main_context = main_context;
	
	Dr.image_data_image = image_data_image;
	Dr.image_data_canvas = image_data_canvas;
	Dr.image_data_canvas_data = image_data_canvas_data;
}

Dr.afterWindowLoaded(init);