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
}

Dr.afterWindowLoaded(init);