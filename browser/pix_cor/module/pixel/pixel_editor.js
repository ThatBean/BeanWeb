Dr.Declare('PixelEditor', 'class');
Dr.Require('PixelEditor', 'PixelEditorData');
Dr.Require('PixelEditor', 'PixelRender');
Dr.Require('PixelEditor', 'PixelCamera');
Dr.Require('PixelEditor', 'Action');
Dr.Implement('PixelEditor', function (global, module_get) {
	
	var PixelEditorData = Dr.Get("PixelEditorData");
	var PixelRender = Dr.Get("PixelRender");
	var PixelCamera = Dr.Get("PixelCamera");
	var Action = Dr.Get("Action");
	var Vector3 = Dr.Get('Vector3');	//for position
	var Rotate4 = Dr.Get('Rotate4');	//for rotation
	var Matrix4 = Dr.Get('Matrix4');	//
	
	var Module = function () {
		this.editor_data_map = {
			//name - PixelEditorData
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
			_this.onAction(action_event);
		});
	};
	
	Module.prototype.getId = function () {
		return this.id;
	};
	
	Module.prototype.update = function (delta_time) {
		this.pixel_render.clearBuffer();
		
		for (i in this.editor_data_map) {
			var editor_data = this.editor_data_map[i];
			
			editor_data.update(delta_time);
			
			var render_data = editor_data.getRenderData();
			
			this.pixel_render.render(
				this.editor_config.zoom, 
				this.pixel_camera,
				render_data,
				this.editor_config.option_extra
			);
		}
		
		this.pixel_render.applyBuffer();
	};
	
	Module.prototype.onAction = function (action_event) {
		if (!action_event.positions.target) {
			return;
		}
		
		for (i in this.editor_data_map) {
			var editor_data = this.editor_data_map[i];
			
			var render_data = editor_data.getRenderData();
			
			var is_hit = this.pixel_render.raytracing(
				this.editor_config.zoom, 
				this.pixel_camera,
				render_data,
				action_event.positions.target.x, 
				action_event.positions.target.y, 
				100	//z
			);
			
			if (is_hit) {
				editor_data.onAction(action_event);
			}
		}
		
	};
	
	
	return Module;
});

Dr.Declare('PixelEditorData', 'class');
Dr.Require('PixelEditorData', 'PixelRender');
Dr.Require('PixelEditorData', 'Vector3');
Dr.Require('PixelEditorData', 'Rotate4');
Dr.Require('PixelEditorData', 'Matrix4');
Dr.Implement('PixelEditorData', function (global, module_get) {
	
	var PixelRender = Dr.Get("PixelRender");
	var Vector3 = Dr.Get('Vector3');	//for position
	var Rotate4 = Dr.Get('Rotate4');	//for rotation
	var Matrix4 = Dr.Get('Matrix4');	//
	
	
	var Module = function () {
		this.data = {
			//name - PixelEditorData
		};
		
		this.data_config = {
			type = "model",
			// model // part
			// motion // frame // bone
		};
	}
	
	Module.prototype.init = function (type, data) {
		this.data_config,type = type;
		this.data = data;
	};
	
	Module.prototype.getRenderData = function () {
		return this.data;
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
	
	Module.prototype.onAction = function (action_event) {
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
