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
	
	
	var main_canvas = document.getElementById('Dr.TestCanvas');
	var main_context = main_canvas.getContext('2d');
	
	Dr.main_canvas = main_canvas;
	Dr.main_context = main_context;
	
	// Dr.UpdateLoop.add(function (delta_time) { 
		// return true;
	// })
	
	
	
	
	var Mine_Map = Dr.Get("Mine_Map");
	
	
	test_map = new Mine_Map;
	
	//test_map.init(block_type, row, col, mine_block_count, empty_block_count, lock_block_count)
	test_map.init('TRI', 20, 30, 5, 10, 10);
	
	
	Dr.test_map = test_map;
	
	
	Dr.test_map.print();
	
	Dr.log(Dr.Get('Mine_Type').getSurroundList('BOX', 2, 3));
	Dr.log(Dr.Get('Mine_Type').getSurroundList('HEX', 2, 3));
	Dr.log(Dr.Get('Mine_Type').getSurroundList('TRI', 2, 3));
	
	
	
	var CanvasExt = Dr.Get('CanvasExt');
	var test_canvas = new CanvasExt;
	test_canvas.init(main_canvas);
	
	
	var is_active = false;
	var on_event_callback =  function (event_key, action) {
		switch(event_key) {
			case 'action_start':
				is_active = true;
				break;
			case 'action_end':
			case 'action_cancel':
				is_active = false;
				break;
		}
		
		var rad = 2;
		if (action.position_listener) {
			//if (Dr.devicePixelRatio >  1) 
			action.event.preventDefault();
			
			if (is_active) {
				
				Dr.UpdateLoop.add(function (delta_time) { 
					// test_canvas.getMainContext().fillRect(
						// action.position_listener.x - rad, 
						// action.position_listener.y - rad, 
						// rad * 2, 
						// rad * 2);
					
					var ImageDataExt = Dr.Get("ImageDataExt");
					var image_data_ext = ImageDataExt.create(ImageDataExt.type.CANVAS_IMAGE_DATA, 10, 10);
					image_data_ext.drawPixelLineList([
						{x:2,y:0},
						{x:7,y:0},
						{x:9,y:2},
						{x:9,y:7},
						{x:7,y:9},
						{x:2,y:9},
						{x:0,y:7},
						{x:0,y:2},
					], {r:0,g:30,b:0,a:100}, true);
					//image_data_ext.floodFill({x:0,y:0}, {r:0,g:0,b:0,a:0})
					image_data_ext.toCanvas();
					image_data_ext.scale(4);
					image_data_ext.draw(
						Dr.main_context, 
						action.position_listener.x - image_data_ext.width * 0.5, 
						action.position_listener.y - image_data_ext.height * 0.5);
						
					// for (var i = 0; i <= 10; i += 0.1) {
					// for (var j = 0; j <= 1; j += 0.1) {
						// image_data_ext.draw(
							// Dr.main_context, 
							// action.position_listener.x - image_data_ext.width * i, 
							// action.position_listener.y - image_data_ext.height * j);
					// }
					// }
					return false;	//once
				}, 'test_canvas_draw_touch_position')
				
			}
			
		}
		else {
			tag_log.Log([event_key].join(' '));
		}
	};
	
	test_canvas.getEventCenter().addEventListener('action_move', on_event_callback);
	test_canvas.getEventCenter().addEventListener('action_start', on_event_callback);
	test_canvas.getEventCenter().addEventListener('action_end', on_event_callback);
	test_canvas.getEventCenter().addEventListener('action_cancel', on_event_callback);
	
	Dr.test_canvas = test_canvas;
	
	
	
	
	
	
	var ImageDataExt = Dr.Get("ImageDataExt");
	
	var image_data_canvas = new ImageDataExt;
	
	image_data_canvas.init('local', main_canvas, ImageDataExt.type.CANVAS_ELEMENT);
	
	Dr.image_data_canvas = image_data_canvas;
	
	Dr.image_data_canvas.drawPixelLine({x:50,y:3}, {x:120,y:45}, {r:200,g:30,b:0,a:100});
	Dr.image_data_canvas.drawPixelLine({x:100,y:3}, {x:15,y:45}, {r:200,g:30,b:0,a:100});
	Dr.image_data_canvas.drawPixelLine({x:100,y:30}, {x:15,y:45}, {r:200,g:30,b:0,a:100});
	
	
	Dr.image_data_canvas.floodFill({x:65,y:30}, {r:20,g:50,b:100,a:255})
	Dr.image_data_canvas.floodFill({x:200,y:200}, {r:200,g:50,b:100,a:255})
	
	Dr.image_data_canvas.draw(Dr.main_context, 0, 0);
	
	
	Dr.test_draw = function (image_store) {
		
		var image_store = image_store || Dr.image_store;
		
		var image_type_list = [
			'IMAGE_TYPE_BOX',
			'IMAGE_TYPE_HEX',
			'IMAGE_TYPE_TRI_UP',
			'IMAGE_TYPE_TRI_DOWN',
		];
		var variant_type_list = [
			'VARIANT_TYPE_INDICATOR',
			'VARIANT_TYPE_BLOCK_NORMAL',
			'VARIANT_TYPE_BLOCK_PRESSED',
			'VARIANT_TYPE_BLOCK_EMPTY',
		];
		var tag_image_type_list = [
			'TAG_IMAGE_NUMBER_12',
			'TAG_IMAGE_FACE_COOL',
			'TAG_IMAGE_MARK_FLAG',
			'TAG_IMAGE_MARK_EMPTY',
		];
		
		
		
		var test_canvas = document.getElementById('Dr.TestCanvas');
		var text_context = test_canvas.getContext('2d');
			
		var main_canvas = document.getElementById('Dr.Canvas');
		var main_context = main_canvas.getContext('2d');
		
		for (var loop = 9; loop >= 0; loop --) {
			var scale = loop % 5 + 1;
			var is_redraw = loop < 5;
			var draw_context = !is_redraw ? main_context : text_context;
			
			var start_time = Dr.now();
			Dr.log('Start time', start_time);
			
			var x = 0;
			for (var i in image_type_list) {
				var y = 0;
				for (var j in variant_type_list) {
					for (var k in tag_image_type_list) {
						var image_data_ext = image_store.getImageData(image_type_list[i], variant_type_list[j], tag_image_type_list[k], scale);
						image_data_ext.draw(draw_context, x, y);
						y += 1.0 * image_data_ext.height;
					}
				}
				x += 75;
			}
			
			var end_time = Dr.now();
			var delta_time = end_time - start_time;
			Dr.log('End time', end_time);
			Dr.log('Delta time', delta_time);
			tag_log.Log('scale:' + scale + ' redraw:' + is_redraw + ' time: ' + delta_time.toFixed(3) + ' fps: ' + (delta_time == 0 ? 'max' : (1 / delta_time).toFixed(2)));
		}
		
		
		Dr.image_store = image_store;
	};
	
	var Mine_ImageStore = Dr.Get('Mine_ImageStore');
	var image_store = new Mine_ImageStore;
	image_store.init(Dr.test_draw);
	
	
	
	
	
	var CanvasExt = Dr.Get('CanvasExt');
	var Mine_Map = Dr.Get("Mine_Map");
	var Mine_Grid = Dr.Get('Mine_Grid');
	
	var test_canvas = new CanvasExt;
	var test_map = new Mine_Map;
	var test_grid = new Mine_Grid;
	
		//test_map.init(block_type, row, col, mine_block_count, empty_block_count, lock_block_count)
	test_canvas.init(document.getElementById('Dr.Canvas'));
	test_map.init('TRI', 20, 30, 5, 10, 10);
	test_grid.init(test_canvas, test_map);
}

Dr.afterWindowLoaded(init);