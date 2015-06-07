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
					test_canvas.getMainContext().fillRect(
						action.position_listener.x - rad, 
						action.position_listener.y - rad, 
						rad * 2, 
						rad * 2);
					return false;	//once
				}, 'test_canvas_draw_touch_position')
				
			}
			
			tag_log.Log([event_key, action.position_listener.x.toFixed(4), action.position_listener.y.toFixed(4)].join(' '));
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
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	var ImageData = Dr.Get("ImageData");
	
	var image_data_canvas = new ImageData;
	
	image_data_canvas.init('local', main_canvas, ImageData.type.CANVAS_ELEMENT);
	
	Dr.image_data_canvas = image_data_canvas;
	
	Dr.image_data_canvas.drawPixelLine({x:1,y:3}, {x:150,y:45}, {r:200,g:30,b:0,a:100});
	Dr.image_data_canvas.drawPixelLine({x:100,y:3}, {x:15,y:45}, {r:200,g:30,b:0,a:100});
	Dr.image_data_canvas.drawPixelLine({x:100,y:30}, {x:15,y:45}, {r:200,g:30,b:0,a:100});
	
	Dr.image_data_canvas.draw(Dr.main_context, 0, 0);
	
	Dr.image_data_canvas.floodFill({x:65,y:30}, {r:20,g:50,b:100,a:255})
	Dr.image_data_canvas.floodFill({x:200,y:200}, {r:200,g:50,b:100,a:255})
	
	Dr.image_data_canvas.draw(Dr.main_context, 0, 0);
}

Dr.afterWindowLoaded(init);