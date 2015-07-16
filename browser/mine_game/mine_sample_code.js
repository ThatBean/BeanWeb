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
	
	
	
	// Dr.UpdateLoop.add(function (delta_time) { 
		// return true;
	// })
	
	
	/*
	
	var main_canvas = document.getElementById('Dr.Canvas');
	var main_context = main_canvas.getContext('2d');
	
	Dr.main_canvas = main_canvas;
	Dr.main_context = main_context;
	
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
			action.event.preventDefault();
			if (is_active) {
				Dr.UpdateLoop.add(function (delta_time) {
					if (Dr.image_store) {
						var image_data_ext = Dr.image_store.getRandomImageData();
						image_data_ext.draw(Dr.main_context, 
							action.position_listener.x - image_data_ext.width * 0.5, 
							action.position_listener.y - image_data_ext.height * 0.5);
					}
					return false;	//once
				}, 'test_canvas_draw_touch_position')
			}
		}
	};
	
	test_canvas.getEventCenter().addEventListener('action_move', on_event_callback);
	test_canvas.getEventCenter().addEventListener('action_start', on_event_callback);
	test_canvas.getEventCenter().addEventListener('action_end', on_event_callback);
	test_canvas.getEventCenter().addEventListener('action_cancel', on_event_callback);
	
	Dr.test_canvas = test_canvas;
	
	
	var image_type_list = [
		'IMAGE_TYPE_BOX',
		'IMAGE_TYPE_HEX',
		'IMAGE_TYPE_TRI_UP',
		'IMAGE_TYPE_TRI_DOWN',
	];
	var variant_type_list = [
		'VARIANT_TYPE_INDICATOR',
		'VARIANT_TYPE_NORMAL',
		'VARIANT_TYPE_PRESSED',
		'VARIANT_TYPE_FLIPPED',
	];
	var tag_image_type_list = [
		'TAG_IMAGE_NUMBER_12',
		'TAG_IMAGE_FACE_COOL',
		'TAG_IMAGE_MARK_FLAG',
		'TAG_IMAGE_MARK_EMPTY',
	];
	
	Dr.test_draw = function (image_store) {
		var image_store = image_store || Dr.image_store;
		
		for (var loop = 9; loop >= 0; loop --) {
			var scale = loop % 5 + 1;
			var is_redraw = loop < 5;
			
			var start_time = Dr.now();
			
			var x = 0;
			for (var i in image_type_list) {
				var y = 0;
				for (var j in variant_type_list) {
					for (var k in tag_image_type_list) {
						var image_data_ext = image_store.getImageData(image_type_list[i], variant_type_list[j], tag_image_type_list[k], scale);
						image_data_ext.draw(Dr.main_context, x, y);
						y += 1.0 * image_data_ext.height;
					}
				}
				x += 75;
			}
			
			var end_time = Dr.now();
			var delta_time = end_time - start_time;
			tag_log.Log('scale:' + scale + ' redraw:' + is_redraw + ' time: ' + delta_time.toFixed(3) + ' fps: ' + (delta_time == 0 ? 'max' : (1 / delta_time).toFixed(2)));
		}
	};
	
	var Mine_ImageStore = Dr.Get('Mine_ImageStore');
	var image_store = new Mine_ImageStore;
	Dr.image_store = image_store;
	image_store.init(Dr.test_draw);
	Dr.image_store = image_store;
	*/
	
	
	
	Dr.ResetMineType = function (
		block_type, 
		width, height, 
		mine_block_count, 
		empty_block_count, 
		lock_block_count
	) {
		var Mine_Map = Dr.Get("Mine_Map");
		var Mine_Grid = Dr.Get('Mine_Grid');
		var test_map = new Mine_Map;
		var test_grid = new Mine_Grid;
		
		//test_map.init(block_type, width, height, mine_block_count, empty_block_count, lock_block_count)
		test_map.init(
			block_type, 
			width, height, 
			mine_block_count, 
			empty_block_count, 
			lock_block_count);
		test_grid.init(document.getElementById('Dr.Canvas'), test_map, 1);
		
		Dr.test_grid = test_grid;
		Dr.test_map = test_map;
	}
	Dr.ResetMineGridScale = function (scale) { Dr.test_grid.resetScale(scale); }
	
	
	Dr.ResetMineType('TRI', 20, 60, 50, 10, 10);
	
	Dr.test_map.print();
	
	
	Dr.log(Dr.Get('Mine_Type').getSurroundList('BOX', 2, 3));
	Dr.log(Dr.Get('Mine_Type').getSurroundList('HEX', 2, 3));
	Dr.log(Dr.Get('Mine_Type').getSurroundList('TRI', 2, 3));
	
	
	
	
	var d = Dr.Get('ImageDataFont');
	var dd = new d;
	dd.init();
	var ddd = dd.getTextImageData('AfyQtest');
	ddd.draw(document.getElementById('Dr.Canvas2').getContext('2d'), 100, 100);
}

Dr.afterWindowLoaded(init);