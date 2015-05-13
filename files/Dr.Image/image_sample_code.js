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
	tag_log.listMax = 50; 
	
	
	var main_canvas = document.getElementById('Dr.Canvas');
	var main_context = main_canvas.getContext('2d');
	
	var test_image_data = document.getElementById('test_image_data');
	var test_canvas_data = document.getElementById('test_canvas_data');
	var test_canvas_image_data = test_canvas_data.getContext('2d').getImageData(0, 0, test_canvas_data.width, test_canvas_data.height);
	
	var font_size = test_canvas_data.height;
	var ctx = test_canvas_data.getContext('2d');
	test_canvas_data.width = test_canvas_data.width;
	ctx.font = "bold " + font_size + "px monaco, consolas, monospace";
	ctx.textAlign = "left";
	ctx.textBaseline = "middle";
	ctx.fillStyle = "#005";
	ctx.fillText("TestCanvasData", 0, test_canvas_data.height * 0.5);
	
	
	var ImageData = Dr.Get("ImageData");
	
	var image_data_image = new ImageData;
	var image_data_canvas = new ImageData;
	var image_data_canvas_image_data = new ImageData;
	
	image_data_image.init('local', test_image_data, ImageData.type.IMAGE_ELEMENT);
	image_data_canvas.init('local', test_canvas_data, ImageData.type.CANVAS_ELEMENT);
	image_data_canvas_image_data.init('local', test_canvas_image_data, ImageData.type.CANVAS_IMAGE_DATA);
	
	var loop_count = 10000;
	
	var log_list = ['Testing draw speed of <draw>', 'loop_count:', loop_count];
	tag_log.Log(log_list.join(' '));
	Dr.log(log_list.join(' '));
	
	var timer = Dr.now();
	for (var i = 0; i < loop_count; i++) image_data_image.draw(main_context, 0, 0);
	log_list = ['[End] image_data_image draw', 'time:', (Dr.now() - timer).toFixed(6), 'Hz:', (1 / (Dr.now() - timer)).toFixed(6)];
	tag_log.Log(log_list.join(' '));
	Dr.log(log_list.join(' '));
	
	var timer = Dr.now();
	for (var i = 0; i < loop_count; i++) image_data_canvas.draw(main_context, 0, 50);
	log_list = ['[End] image_data_canvas draw', 'time:', (Dr.now() - timer).toFixed(6), 'Hz:', (1 / (Dr.now() - timer)).toFixed(6)];
	tag_log.Log(log_list.join(' '));
	Dr.log(log_list.join(' '));
	
	var timer = Dr.now();
	for (var i = 0; i < loop_count; i++) image_data_canvas_image_data.draw(main_context, 0, 100);
	log_list = ['[End] image_data_canvas_image_data draw', 'time:', (Dr.now() - timer).toFixed(6), 'Hz:', (1 / (Dr.now() - timer)).toFixed(6)];
	tag_log.Log(log_list.join(' '));
	Dr.log(log_list.join(' '));
	
	
	var log_list = ['Testing draw speed of <drawClip>', 'loop_count:', loop_count];
	tag_log.Log(log_list.join(' '));
	Dr.log(log_list.join(' '));
	
	
	var timer = Dr.now();
	for (var i = 0; i < loop_count; i++) image_data_image.drawClip(main_context, 0, 200, 50, 20, 400, 50);
	log_list = ['[End] image_data_image drawClip', 'time:', (Dr.now() - timer).toFixed(6), 'Hz:', (1 / (Dr.now() - timer)).toFixed(6)];
	tag_log.Log(log_list.join(' '));
	Dr.log(log_list.join(' '));
	
	var timer = Dr.now();
	for (var i = 0; i < loop_count; i++) image_data_canvas.drawClip(main_context, 0, 250, 50, 20, 400, 50);
	log_list = ['[End] image_data_canvas drawClip', 'time:', (Dr.now() - timer).toFixed(6), 'Hz:', (1 / (Dr.now() - timer)).toFixed(6)];
	tag_log.Log(log_list.join(' '));
	Dr.log(log_list.join(' '));
	
	var timer = Dr.now();
	for (var i = 0; i < loop_count; i++) image_data_canvas_image_data.drawClip(main_context, 0, 300, 50, 20, 400, 50);
	log_list = ['[End] image_data_canvas_image_data drawClip', 'time:', (Dr.now() - timer).toFixed(6), 'Hz:', (1 / (Dr.now() - timer)).toFixed(6)];
	tag_log.Log(log_list.join(' '));
	Dr.log(log_list.join(' '));
	
	
	var log_list = ['Testing draw speed of <drawClip>', 'loop_count:', loop_count];
	tag_log.Log(log_list.join(' '));
	Dr.log(log_list.join(' '));
	
	
	var timer = Dr.now();
	for (var i = 0; i < loop_count; i++) image_data_image.drawClip(main_context, 0, 400, 10, 20, 40, 20);
	log_list = ['[End] image_data_image drawClip', 'time:', (Dr.now() - timer).toFixed(6), 'Hz:', (1 / (Dr.now() - timer)).toFixed(6)];
	tag_log.Log(log_list.join(' '));
	Dr.log(log_list.join(' '));
	
	var timer = Dr.now();
	for (var i = 0; i < loop_count; i++) image_data_canvas.drawClip(main_context, 0, 450, 10, 20, 40, 20);
	log_list = ['[End] image_data_canvas drawClip', 'time:', (Dr.now() - timer).toFixed(6), 'Hz:', (1 / (Dr.now() - timer)).toFixed(6)];
	tag_log.Log(log_list.join(' '));
	Dr.log(log_list.join(' '));
	
	var timer = Dr.now();
	for (var i = 0; i < loop_count; i++) image_data_canvas_image_data.drawClip(main_context, 0, 500, 10, 20, 40, 20);
	log_list = ['[End] image_data_canvas_image_data drawClip', 'time:', (Dr.now() - timer).toFixed(6), 'Hz:', (1 / (Dr.now() - timer)).toFixed(6)];
	tag_log.Log(log_list.join(' '));
	Dr.log(log_list.join(' '));
	
	var i = 0;
	Dr.UpdateLoop.add(function (delta_time) { 
		i += delta_time * 120;
		//i += 1;
		
		var x = i % main_canvas.width;
		
		var y1 = i % main_canvas.height;
		var y2 = (i + 100) % main_canvas.height;
		var y3 = (i + 200) % main_canvas.height;
		
		image_data_image.draw(main_context, x, y1);
		image_data_canvas.draw(main_context, x, y2);
		image_data_canvas_image_data.draw(main_context, x, y3);
		
		return true;
	})
	
	Dr.main_canvas = main_canvas;
	Dr.main_context = main_context;
	
	Dr.image_data_image = image_data_image;
	Dr.image_data_canvas = image_data_canvas;
	Dr.image_data_canvas_image_data = image_data_canvas_image_data;
	
	
	
	var Canvas = Dr.Get('Canvas');
	
	var test_canvas = new Canvas;
	
	test_canvas.init(main_canvas);
	
	test_canvas.getEventCenter().addEventListener('action_move', function (event_key, action) {
		var rad = 1;
		test_canvas.getContext().fillRect(action.position_listener.x - rad, action.position_listener.y - rad, rad * 2, rad * 2);
	})
	
	Dr.test_canvas = test_canvas;
}

Dr.afterWindowLoaded(init);