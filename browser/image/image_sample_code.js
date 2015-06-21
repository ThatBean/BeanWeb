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
	}, true);
	tag_log.Log("init log " + Dr.now()); 
	tag_log.listMax = 50; 
	
	Dr.UpdateLoop.add(function (delta_time) { 
		tag_log.Output(); 
		return true;
	})
	
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
	
	
	var ImageDataExt = Dr.Get("ImageDataExt");
	
	var image_data_image = new ImageDataExt;
	var image_data_canvas = new ImageDataExt;
	var image_data_canvas_image_data = new ImageDataExt;
	
	image_data_image.init('local', test_image_data, ImageDataExt.type.IMAGE_ELEMENT);
	image_data_canvas.init('local', test_canvas_data, ImageDataExt.type.CANVAS_ELEMENT);
	image_data_canvas_image_data.init('local', test_canvas_image_data, ImageDataExt.type.CANVAS_IMAGE_DATA);
	
	var loop_count = 1000;
	
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
	
	
	var log_list = ['Testing draw speed of <drawClip> (with bigger size error, seee Safari)', 'loop_count:', loop_count];
	tag_log.Log(log_list.join(' '));
	Dr.log(log_list.join(' '));
	
	
	var timer = Dr.now();
	for (var i = 0; i < loop_count; i++) image_data_image.drawClip(main_context, 0, 200, 50, 20, test_canvas_data.width, test_canvas_data.height);
	log_list = ['[End] image_data_image drawClip', 'time:', (Dr.now() - timer).toFixed(6), 'Hz:', (1 / (Dr.now() - timer)).toFixed(6)];
	tag_log.Log(log_list.join(' '));
	Dr.log(log_list.join(' '));
	
	var timer = Dr.now();
	for (var i = 0; i < loop_count; i++) image_data_canvas.drawClip(main_context, 0, 250, 50, 20, test_canvas_data.width, test_canvas_data.height);
	log_list = ['[End] image_data_canvas drawClip', 'time:', (Dr.now() - timer).toFixed(6), 'Hz:', (1 / (Dr.now() - timer)).toFixed(6)];
	tag_log.Log(log_list.join(' '));
	Dr.log(log_list.join(' '));
	
	var timer = Dr.now();
	for (var i = 0; i < loop_count; i++) image_data_canvas_image_data.drawClip(main_context, 0, 300, 50, 20, test_canvas_data.width, test_canvas_data.height);
	log_list = ['[End] image_data_canvas_image_data drawClip', 'time:', (Dr.now() - timer).toFixed(6), 'Hz:', (1 / (Dr.now() - timer)).toFixed(6)];
	tag_log.Log(log_list.join(' '));
	Dr.log(log_list.join(' '));
	
	
	var log_list = ['Testing draw speed of <drawClip>', 'loop_count:', loop_count];
	tag_log.Log(log_list.join(' '));
	Dr.log(log_list.join(' '));
	
	
	var timer = Dr.now();
	for (var i = 0; i < loop_count; i++) image_data_image.drawClip(main_context, 0, 400, 10, 20, test_canvas_data.width * 0.5, test_canvas_data.height * 0.3);
	log_list = ['[End] image_data_image drawClip', 'time:', (Dr.now() - timer).toFixed(6), 'Hz:', (1 / (Dr.now() - timer)).toFixed(6)];
	tag_log.Log(log_list.join(' '));
	Dr.log(log_list.join(' '));
	
	var timer = Dr.now();
	for (var i = 0; i < loop_count; i++) image_data_canvas.drawClip(main_context, 0, 450, 10, 20, test_canvas_data.width * 0.5, test_canvas_data.height * 0.3);
	log_list = ['[End] image_data_canvas drawClip', 'time:', (Dr.now() - timer).toFixed(6), 'Hz:', (1 / (Dr.now() - timer)).toFixed(6)];
	tag_log.Log(log_list.join(' '));
	Dr.log(log_list.join(' '));
	
	var timer = Dr.now();
	for (var i = 0; i < loop_count; i++) image_data_canvas_image_data.drawClip(main_context, 0, 500, 10, 20, test_canvas_data.width * 0.5, test_canvas_data.height * 0.3);
	log_list = ['[End] image_data_canvas_image_data drawClip', 'time:', (Dr.now() - timer).toFixed(6), 'Hz:', (1 / (Dr.now() - timer)).toFixed(6)];
	tag_log.Log(log_list.join(' '));
	Dr.log(log_list.join(' '));
	
	var i = 0;
	Dr.UpdateLoop.add(function (delta_time) { 
		i += delta_time * 120;
		//i += 1;
		
		function draw_func (looped_time) {
			
			var x = (i + looped_time) % main_canvas.width;
			
			var y1 = i % main_canvas.height;
			var y2 = (i + 100) % main_canvas.height;
			var y3 = (i + 200) % main_canvas.height;
			
			if (Dr.Toggle.Draw_Image) image_data_image.draw(main_context, x, y1);
			if (Dr.Toggle.Draw_Canvas) image_data_canvas.draw(main_context, x, y2);
			if (Dr.Toggle.Draw_CanvasImageData) image_data_canvas_image_data.draw(main_context, x, y3);
			
		}
		
		var loop_count = Dr.Toggle.Draw_Count || 1;
		
		Dr.loop(loop_count, draw_func);
		
		return true;
	})
	
	Dr.main_canvas = main_canvas;
	Dr.main_context = main_context;
	
	Dr.image_data_image = image_data_image;
	Dr.image_data_canvas = image_data_canvas;
	Dr.image_data_canvas_image_data = image_data_canvas_image_data;
	
	
	
	var CanvasExt = Dr.Get('CanvasExt');
	
	var test_canvas = new CanvasExt;
	
	test_canvas.init(main_canvas);
	
	var on_event_callback =  function (event_key, action) {
		var rad = 2;
		if (action.position_listener) {
			//if (Dr.devicePixelRatio >  1) 
				action.event.preventDefault();
			
			Dr.UpdateLoop.add(function (delta_time) { 
				test_canvas.getMainContext().fillRect(action.position_listener.x - rad, action.position_listener.y - rad, rad * 2, rad * 2);
				return false;	//once
			}, 'test_canvas_draw_touch_position')
			
			
			tag_log.Log([event_key, action.position_listener.x.toFixed(4), action.position_listener.y.toFixed(4)].join(' '));
		}
		else {
			tag_log.Log([event_key].join(' '));
		}
	};
	
	test_canvas.getEventCenter().addEventListener('action_move', on_event_callback);
	test_canvas.getEventCenter().addEventListener('action_start', on_event_callback);
	test_canvas.getEventCenter().addEventListener('action_end', on_event_callback);
	
	Dr.test_canvas = test_canvas;
	
	
	
	// Dr.image_data_canvas.drawPixelLine({x:1,y:3}, {x:150,y:45}, {r:200,g:30,b:0,a:100});
	// Dr.image_data_canvas.draw(Dr.main_context, 10, 10);
}

Dr.afterWindowLoaded(init);