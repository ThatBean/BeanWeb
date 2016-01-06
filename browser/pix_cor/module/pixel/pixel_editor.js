Dr.Declare('PixelEditor', 'class');
Dr.Require('PixelEditor', 'PixelRender');
Dr.Require('PixelEditor', 'PixelCamera');
Dr.Require('PixelEditor', 'Action');
Dr.Require('PixelEditor', 'Vector3');
Dr.Require('PixelEditor', 'Rotate4');
Dr.Require('PixelEditor', 'Matrix4');
Dr.Implement('PixelEditor', function (global, module_get) {
	
	var PixelRender = Dr.Get("PixelRender");
	var PixelCamera = Dr.Get("PixelCamera");
	var Action = Dr.Get("Action");
	var Vector3 = Dr.Get('Vector3');	//for position
	var Rotate4 = Dr.Get('Rotate4');	//for rotation
	var Matrix4 = Dr.Get('Matrix4');	//
	
	
	var Module = function () {
		this.edit_data = {
			// model
				// part
			
			// motion
				// frame
					// bone
		};
		
		this.editor_config = {
			pixel_scale = 10,
			render_method = "default",
		};
	}
	
	Module.prototype.init = function (canvas) {
		this.canvas = canvas;
		
		this.pixel_camera = new PixelCamera();
		this.pixel_camera.position = new Vector3(0, 0, -100);
		this.pixel_camera.target_position = new Vector3(0, 0, 0);
		
		this.pixel_render = new PixelRender();
		this.pixel_render.init(
			this.canvas, 
			10, //pixel_scale, 
			this.canvas.width, 
			this.canvas.height
		);
		
		var _this = this;
	
		Dr.UpdateLoop.add(function (delta_time) { 
			_this.update(delta_time);
			return true;
		})
		
		Action.applyActionListener(this.canvas, function(action_event) {
			_this.on_action(action_event);
		});
	};
	
	Module.prototype.getId = function () {
		return this.id;
	};
	
	Module.prototype.update = function (delta_time) {
		// this.pixel_motion.update(delta_time);
		// this.pixel_render.clearBuffer();
		// this.pixel_render.render(
			// zoom, 
			// this.pixel_camera,
			// render_data,
			// option_extra
		// );
		// this.pixel_render.applyBuffer();
	};
	Module.prototype.on_action = function (action_event) {
		// Dr.pixel_render.raytracing(
			// zoom, 
			// Dr.pixel_camera,
			// render_data,
			// action_event.positions.target.x, 
			// action_event.positions.target.y, 
			// 100
		// );
	};
	
	
	return Module;
});
