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
	
	
	var main_canvas = document.getElementById('Dr.Canvas');
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
					var image_data_ext = new ImageDataExt;
					image_data_ext.create(ImageDataExt.type.CANVAS_IMAGE_DATA, 10, 10);
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
	
	
	var Mine_ImageStore = Dr.Get('Mine_ImageStore');
	var a = new Mine_ImageStore;
	a.init();
	
	a.generated_image_data_tree.IMAGE_TYPE_BOX.VARIANT_TYPE_INDICATOR.draw(Dr.main_context, 50, 200);
	a.generated_image_data_tree.IMAGE_TYPE_BOX.VARIANT_TYPE_BLOCK_NORMAL.draw(Dr.main_context, 50, 300);
	a.generated_image_data_tree.IMAGE_TYPE_BOX.VARIANT_TYPE_BLOCK_PRESSED.draw(Dr.main_context, 50, 400);
	a.generated_image_data_tree.IMAGE_TYPE_BOX.VARIANT_TYPE_BLOCK_EMPTY.draw(Dr.main_context, 50, 500);
	
	a.generated_image_data_tree.IMAGE_TYPE_HEX.VARIANT_TYPE_INDICATOR.draw(Dr.main_context, 100, 200);
	a.generated_image_data_tree.IMAGE_TYPE_HEX.VARIANT_TYPE_BLOCK_NORMAL.draw(Dr.main_context, 100, 300);
	a.generated_image_data_tree.IMAGE_TYPE_HEX.VARIANT_TYPE_BLOCK_PRESSED.draw(Dr.main_context, 100, 400);
	a.generated_image_data_tree.IMAGE_TYPE_HEX.VARIANT_TYPE_BLOCK_EMPTY.draw(Dr.main_context, 100, 500);
	
	a.generated_image_data_tree.IMAGE_TYPE_TRI_UP.VARIANT_TYPE_INDICATOR.draw(Dr.main_context, 150, 200);
	a.generated_image_data_tree.IMAGE_TYPE_TRI_UP.VARIANT_TYPE_BLOCK_NORMAL.draw(Dr.main_context, 150, 300);
	a.generated_image_data_tree.IMAGE_TYPE_TRI_UP.VARIANT_TYPE_BLOCK_PRESSED.draw(Dr.main_context, 150, 400);
	a.generated_image_data_tree.IMAGE_TYPE_TRI_UP.VARIANT_TYPE_BLOCK_EMPTY.draw(Dr.main_context, 150, 500);
	
	a.generated_image_data_tree.IMAGE_TYPE_TRI_DOWN.VARIANT_TYPE_INDICATOR.draw(Dr.main_context, 200, 200);
	a.generated_image_data_tree.IMAGE_TYPE_TRI_DOWN.VARIANT_TYPE_BLOCK_NORMAL.draw(Dr.main_context, 200, 300);
	a.generated_image_data_tree.IMAGE_TYPE_TRI_DOWN.VARIANT_TYPE_BLOCK_PRESSED.draw(Dr.main_context, 200, 400);
	a.generated_image_data_tree.IMAGE_TYPE_TRI_DOWN.VARIANT_TYPE_BLOCK_EMPTY.draw(Dr.main_context, 200, 500);
}

Dr.afterWindowLoaded(init);