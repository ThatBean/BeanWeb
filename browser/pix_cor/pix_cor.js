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
		return instance;
	};
	
	return Module;
});





var pix_cor_init = function () {
	//later...
	var PixCor = Dr.Get("PixCor");
	Dr.pix_cor_game = PixCor.create();
	
	
	
	
	//test model
	var sample_pixel_model_data = {
		'XYZ' : [0, 0, 0],
		'XYZR' : [0, 0, 0, 0],
		'pixel_part_list' : [
			{
				'NAME' : "A",
				'XYZ' : [0, 0, 0],
				'XYZR' : [0, 0, 0, 0],
				'pixel_pixel_list' : [
					{
						'XYZ' : [0, 0, 0],
						'RGBA' : [0, 0, 0, 0.5],
					},
					{
						'XYZ' : [0, 1, 0],
						'RGBA' : [0, 1, 0, 0.5],
					},
					{
						'XYZ' : [-3, -3, 0],
						'RGBA' : [0, 0, 1, 1],
					},
				],
			},
			{
				'NAME' : "B",
				'XYZ' : [1, 0, 0],
				'XYZR' : [0, 0, 0, 0],
				'pixel_pixel_list' : [
					{
						'XYZ' : [0, 0, 0],
						'RGBA' : [0, 0, 0, 0.5],
					},
					{
						'XYZ' : [0, 1, 0],
						'RGBA' : [0, 1, 0, 0.5],
					},
					{
						'XYZ' : [-3, -3, 0],
						'RGBA' : [0, 0, 1, 1],
					},
				],
			},
		],
	}
	
	var PixelModel = Dr.Get("PixelModel");
	Dr.pixel_model = PixelModel.loadData(sample_pixel_model_data);
	
	
	//test motion
	var sample_pixel_motion_data = {
		'FRAME_FPS' : 30,	//only for frame switching speed, not play FPS
		'pixel_frame_list' : [
			{
				'ID' : 0, // number, starts from 0
				'XYZ' : [0, 0, 0],
				'XYZR' : [0, 0, 0, 0],
				'pixel_bone_list' : [
					{
						'PART_NAME' : "A",	//string, attaching PixelPart NAME
						'XYZ' : [0, 0, 0],
						'XYZR' : [0, 0, 0, 0],
					},
					// {
						// 'PART_NAME' : "B",	//string, attaching PixelPart NAME
						// 'XYZ' : [2, 0, 0],
						// 'XYZR' : [0, 0, 0, 0],
					// },
				],
			},
			{
				'ID' : 100, // number, starts from 0
				'XYZ' : [0, 0, 0],
				'XYZR' : [0, 0, 0, 0],
				'pixel_bone_list' : [
					{
						'PART_NAME' : "A",	//string, attaching PixelPart NAME
						'XYZ' : [10, 10, 0],
						'XYZR' : [9, 9, 0, 0],
					},
					// {
						// 'PART_NAME' : "B",	//string, attaching PixelPart NAME
						// 'XYZ' : [2, 0, 0],
						// 'XYZR' : [0, 0, 0, 0],
					// },
				],
			},
			{
				'ID' : 300, // number, starts from 0
				'XYZ' : [0, 0, 0],
				'XYZR' : [0, 0, 0, 0],
				'pixel_bone_list' : [
					// {
						// 'PART_NAME' : "A",	//string, attaching PixelPart NAME
						// 'XYZ' : [0, 0, 0],
						// 'XYZR' : [0, 0, 0, 0],
					// },
					{
						'PART_NAME' : "B",	//string, attaching PixelPart NAME
						'XYZ' : [-2, 0, 0],
						'XYZR' : [0, 0, 0, 0],
					},
				],
			},
		],
	}
	
	var PixelMotion = Dr.Get("PixelMotion");
	Dr.pixel_motion = PixelMotion.loadData(sample_pixel_motion_data);
	Dr.pixel_motion.generateFrameInfo();
	
	
	//attach
	Dr.pixel_motion.attachModel(Dr.pixel_model);
	
	Dr.pixel_motion.start(true, 0);
	
	
	var PixelCamera = Dr.Get("PixelCamera");
	Dr.pixel_camera = new PixelCamera();
	
	var Vector3 = Dr.Get("Vector3");
	Dr.pixel_camera.position = new Vector3(0, 0, -100);
	Dr.pixel_camera.target_position = new Vector3(0, 0, 0);
	
	
	
	var PixelRender = Dr.Get("PixelRender");
	Dr.pixel_render = new PixelRender();
	
	var render_canvas = document.getElementById('Dr.Canvas');
	var pixel_scale = 10;
	var render_width = render_canvas.width;
	var render_height = render_canvas.height;
	Dr.pixel_render.init(
		render_canvas, 
		pixel_scale, 
		render_canvas.width, 
		render_canvas.height
	);
	
	
	
	var zoom = 1.0 * pixel_scale / render_width;
	var render_data = {
		// data_tree_root : Dr.pixel_model,
		data_tree_root : Dr.pixel_motion,
		global_light_pack : [],
		dot_light_pack : [],
	};
	var option_extra = undefined;
	
	
	
	
	Dr.UpdateLoop.add(function (delta_time) { 
		Dr.pixel_motion.update(delta_time);
		
		Dr.pixel_render.clearBuffer();
		
		Dr.pixel_render.render(
			zoom, 
			Dr.pixel_camera,
			render_data,
			option_extra
		);
		
		Dr.pixel_render.applyBuffer();
		return true;
	})
	
	
	
	var Action = Dr.Get("Action");
	Action.applyActionListener(render_canvas, function(action_event) {
		if (!action_event.positions.target) {
			return;
		}
		
		Dr.pixel_render.raytracing(
			zoom, 
			Dr.pixel_camera,
			render_data,
			action_event.positions.target.x, 
			action_event.positions.target.y, 
			100
		);
	});
	
	
	
	
}






Dr.afterWindowLoaded(function () {
	var __PATH_COMMON = '../common/';
	var __PATH_PIX_COR = './pix_cor/';
	var __PATH_GRAPHIC = './graphic/';
	
	Dr.loadScriptByList([
		__PATH_COMMON + 'data/tree_node.js',
		
		__PATH_COMMON + 'graphic/vector.js',
		__PATH_COMMON + 'graphic/rotate.js',
		__PATH_COMMON + 'graphic/matrix.js',
		__PATH_COMMON + 'graphic/color.js',
		__PATH_COMMON + 'graphic/ray.js',
		
		__PATH_PIX_COR + 'module/pixel/pixel_model.js',
		__PATH_PIX_COR + 'module/pixel/pixel_part.js',
		
		__PATH_PIX_COR + 'module/pixel/pixel_motion.js',
		__PATH_PIX_COR + 'module/pixel/pixel_frame.js',
		__PATH_PIX_COR + 'module/pixel/pixel_bone.js',
		__PATH_PIX_COR + 'module/pixel/pixel_mixer.js',
		
		__PATH_PIX_COR + 'module/pixel/pixel_render.js',
		
		__PATH_PIX_COR + 'module/pix_cor_actor.js',
		__PATH_PIX_COR + 'module/pix_cor_world.js',
		
		__PATH_GRAPHIC + 'action.js',
	], function () {
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
		
		
		//real logic
		pix_cor_init();
	})
});