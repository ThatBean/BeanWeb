Dr.Declare('PixelCamera', 'class');
Dr.Require('PixelCamera', 'Vector3');
Dr.Require('PixelCamera', 'Rotate4');
Dr.Require('PixelCamera', 'Matrix4');
Dr.Implement('PixelCamera', function (global, module_get) {
	
	var Vector3 = Dr.Get('Vector3');	//for position
	var Rotate4 = Dr.Get('Rotate4');	//for rotation
	var Matrix4 = Dr.Get('Matrix4');	//
	
	var Module = function () {
		this.position = new Vector3();
		this.target_position = new Vector3();
		this.view_matrix = null;
	}
	
	Module.prototype.getId = function () {
		return this.id;
	};
	
	Module.prototype.getViewMatrix = function () {
		if (!this.view_matrix) this.updateViewMatrix();
		return this.view_matrix;
	};
	
	Module.prototype.updateViewMatrix = function () {
		this.view_matrix = Matrix4.LookAtLH(this.position, this.target_position, Vector3.Up());
	};
	
	// Rotate Camera(Self) around Target
	Module.prototype.rotateAroundTarget = function (rotate_x, rotate_y, rotate_z) {
		var trans_matrix = Matrix.RotationYawPitchRoll(rotate_y, rotate_x, rotate_z);
		var forward_vector = this.target_position.subtract(this.position);
		forward_vector = Vector3.TransformCoordinates(forward_vector, trans_matrix);
		
		this.position = this.target_position.subtract(forward_vector);
	}
	
	// Rotate Target around Camera(Self)
	Module.prototype.rotateAroundSelf = function (rotate_x, rotate_y, rotate_z) {
		var trans_matrix = Matrix.RotationYawPitchRoll(rotate_y, rotate_x, rotate_z);
		var forward_vector = this.target_position.subtract(this.position);
		forward_vector = Vector3.TransformCoordinates(forward_vector, trans_matrix);
		
		this.target_position = this.position.add(forward_vector);
	}
	
	return Module;
});





Dr.Declare('PixelRender', 'class');
Dr.Require('PixelRender', 'PixelModel');
Dr.Require('PixelRender', 'PixelMotion');
Dr.Require('PixelCamera', 'Vector3');
Dr.Require('PixelCamera', 'Color4');
Dr.Require('PixelCamera', 'Matrix4');
Dr.Require('PixelCamera', 'Ray');
Dr.Implement('PixelRender', function (global, module_get) {
	
	var PixelModel = Dr.Get('PixelModel');	//
	var PixelMotion = Dr.Get('PixelMotion');	//
	var Vector3 = Dr.Get('Vector3');	//
	var Color4 = Dr.Get('Color4');	//
	var Matrix4 = Dr.Get('Matrix4');	//
	var Ray = Dr.Get('Ray');	//
	
	
	var Module = function () {
		this.canvas = null;
		this.canvas_context = null;
		
		//the scale for transfering working pixel to output pixel
		// a 2.0 pixel_scale meaning a 2 x 2 box for 1 working pixel
		// a 0.5 pixel_scale meaning a 1 x 1 box for 4 working pixel, resulting in pixel merging
		this.pixel_scale = 1;	
		
		//the output buffer(same size as canvas)
		this.output_width = 0;
		this.output_height = 0;
		this.output_image_buffer = null;
		
		//the working buffer(used for rendering)
		this.working_width = 0;
		this.working_height = 0;
		this.working_image_buffer = null;
		this.working_depth_buffer = [];	//for overlap decision(Z buffer)
		
		//pre calculated mapper for output pixel index -> working pixel index
		this.quick_output_working_index_map = [];
	}
	
	Module.prototype.getId = function () {
		return this.id;
	};
	
	Module.prototype.init = function (canvas, pixel_scale, width, height) {
		this.canvas = canvas;
		this.canvas_context = this.canvas.getContext("2d");
		
		//calculate output/working buffer
		this.resize(pixel_scale, width, height);
		
		//Dr.log output
		Dr.log("[PixelRender][Init] pixel_scale: " + this.pixel_scale
			+ " | output_size: " + this.output_width + " x " + this.output_height
			+ " | working_size: " + this.working_width + " x " + this.working_height
		);
	};
	
	var _reset_canvas_size = function (canvas, width, height) {
		canvas.style.width = width + 'px';
		canvas.style.height = height + 'px';
		canvas.width = width;
		canvas.height = height;
	}
	
	//resize is a bit slow, don't do that often, also used in initialize
	Module.prototype.resize = function (pixel_scale, width, height) {
		this.pixel_scale = pixel_scale || this.pixel_scale;
		
		//output
		this.output_width = width || this.canvas.width;
		this.output_height = height || this.canvas.height;
		this.output_image_buffer = this.canvas_context.getImageData(0, 0, this.output_width, this.output_height);
		_reset_canvas_size(this.canvas, this.output_width, this.output_height);	
		
		//working
		this.working_width = Math.floor(this.output_width / this.pixel_scale);
		this.working_height = Math.floor(this.output_height / this.pixel_scale);
		this.working_image_buffer = this.canvas_context.createImageData(this.working_width, this.working_height);
		this.working_depth_buffer = new Array(this.working_width * this.working_height);
		
		//pre calculate the index mapper
		this.quick_output_working_index_map = new Array(this.output_width * this.output_height);
		var trans_ratio = (1 / this.output_width) / this.pixel_scale;
		for (var i = 0; i < (this.output_width * this.output_height); i++) {
			this.quick_output_working_index_map[i] = (Math.floor(i * trans_ratio) * this.working_width + (i % this.output_width) / this.pixel_scale) << 2;
		}
	}
	
	
	
	Module.prototype.clearBuffer = function () {
		//clear the back buffer and the Z index
		var working_depth_buffer = this.working_depth_buffer;
		var working_image_buffer = this.working_image_buffer;
		var working_image_buffer_data = working_image_buffer.data;
		for (var i = 0; i < working_depth_buffer.length; i++) {
			working_depth_buffer[i] = Infinity; //Number.POSITIVE_INFINITY;
			// working_image_buffer_data[(i << 2) + 0] = 0;	//R
			// working_image_buffer_data[(i << 2) + 1] = 0;	//G
			// working_image_buffer_data[(i << 2) + 2] = 0;	//B
			working_image_buffer_data[(i << 2) + 3] = 0;	//A, reset alpha only
		}
	};
	
	
	
	Module.prototype.applyBuffer = function () {
		// TODO: Uint8ClampedArray is only fond of 2 based size or ratio
		if (this.pixel_scale == 1) {	//directly
			this.canvas_context.putImageData(this.working_image_buffer, 0, 0);
			return;
		}
		else {
			//TO PIXEL!!! re-sample the data for pixel_scale(or the browser may blur it)
			var output_image_buffer_data = this.output_image_buffer.data;
			var working_image_buffer_data = this.working_image_buffer.data;
			var quick_output_working_index_map = this.quick_output_working_index_map;
			var loop_count = this.output_width * this.output_height;
			var index_i = 0;
			var index_j = 0;
			for (var i = 0; i < loop_count; i++) {
				index_i = i << 2;
				index_j = quick_output_working_index_map[i];
				output_image_buffer_data[index_i    ] = working_image_buffer_data[index_j    ];
				output_image_buffer_data[index_i + 1] = working_image_buffer_data[index_j + 1];
				output_image_buffer_data[index_i + 2] = working_image_buffer_data[index_j + 2];
				output_image_buffer_data[index_i + 3] = working_image_buffer_data[index_j + 3];
			};
			this.canvas_context.putImageData(this.output_image_buffer, 0, 0);
		}
	};
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	


	Module.prototype.putPixel = function (x, y, z, color) {
		//check out of buffer
		if (x < 0 || y < 0 || x >= this.working_width || y >= this.working_height) return;
		
		//get index in data array
		var index = (Math.round(x) + Math.round(y) * this.working_width);
		
		//check depth for over lap
		if (this.working_depth_buffer[index] < z) return;
		else this.working_depth_buffer[index] = z;
		
		var working_image_buffer_data = this.working_image_buffer.data;
		var index4 = index << 2;
		
		///transparent method
		/// TODO: not good, should consider Z/*
		// var a = color.a * (255 - working_image_buffer_data[index4 + 3]);
		// var aa = (1-color.a) * working_image_buffer_data[index4 + 3] / 255;
		// working_image_buffer_data[index4] = working_image_buffer_data[index4] * aa + color.r * a;
		// working_image_buffer_data[index4 + 1] = working_image_buffer_data[index4 + 1] * aa + color.g * a;
		// working_image_buffer_data[index4 + 2] = working_image_buffer_data[index4 + 2] * aa + color.b * a;
		// working_image_buffer_data[index4 + 3] = working_image_buffer_data[index4 + 3] * aa + color.b * a;
		
		///non-transparent
		working_image_buffer_data[index4    ] = color.r * 255;
		working_image_buffer_data[index4 + 1] = color.g * 255;
		working_image_buffer_data[index4 + 2] = color.b * 255;
		working_image_buffer_data[index4 + 3] = color.a * 255;
	};
	
	
	Module.prototype.drawBline = function (point0, point1, color) {
		var x0 = Math.floor(point0.x);
		var y0 = Math.floor(point0.y);
		var z0 = point0.z;
		
		var x1 = Math.floor(point1.x);
		var y1 = Math.floor(point1.y);
		var z1 = point1.z;
		
		var dx = Math.abs(x1 - x0);
		var dy = Math.abs(y1 - y0);
		var dz = Math.abs(z1 - z0) / Math.sqrt(dx * dx + dy * dy);
		
		var sx = (x0 < x1) ? 1 : -1;
		var sy = (y0 < y1) ? 1 : -1;
		var sz = (z0 < z1) ? dz : -dz;
		
		var err = dx - dy;
		
		while(true) {
			this.putPixel(x0, y0, z0, color);
			
			if((x0 == x1) && (y0 == y1)) break;
			var e2 = 2 * err;
			if(e2 > -dy) { err -= dy; x0 += sx; }
			if(e2 < dx) { err += dx; y0 += sy; }
			z0 += sz;
		}
	};
	
	
	var clamp = function (value, min, max) {
		if (min === undefined) { min = 0; }
		if (max === undefined) { max = 1; }
		return Math.max(min, Math.min(value, max));
	};
	
	
	var interpolate = function (min, max, gradient) {
		return min + (max - min) * (Math.max(0, Math.min(gradient, 1)));
	};
	
	Module.prototype.processScanLine = function (scan_y, pa, pb, pc, pd, color) {
		var gradient1 = (pa.y != pb.y ? (scan_y - pa.y) / (pb.y - pa.y) : 1);
		var gradient2 = (pc.y != pd.y ? (scan_y - pc.y) / (pd.y - pc.y) : 1);

		///var sx = interpolate(pa.x, pb.x, gradient1) - 0.90000 / 2 >> 0;	/// TODO: gap problem?
		///var ex = interpolate(pc.x, pd.x, gradient2) + 0.90000 / 2 >> 0;	/// TODO: gap problem?
		var sx = Math.round(interpolate(pa.x, pb.x, gradient1));// + 0.49999 >> 0;	/// TODO: gap problem?
		var ex = Math.round(interpolate(pc.x, pd.x, gradient2));// + 0.49999 >> 0;	/// TODO: gap problem?

		var z1 = interpolate(pa.z, pb.z, gradient1);
		var z2 = interpolate(pc.z, pd.z, gradient2);

		//clipping X, useless if block too small
		sx = sx < 0 ? 0 : sx;
		ex = ex > this.working_width ? this.working_width : ex;
		
		var block_z = (z1 + z2) * 0.5;
		
		for (var x = sx; x < ex; x++) {
			this.putPixel(x, scan_y, block_z, color);
		}
	};








	Module.prototype.drawPixelPixel = function (pixel_pixel, center_vector, dot_light_pack, global_light_color, option_extra) {
		//check if out of screen or Hidden
		//note the coord in 2D is [0,X], not [-X/2,X/2]
		
		var draw_position = center_vector;
		
		if (
			draw_position.z < 0 ||	//if behind camera
			(Math.abs(draw_position.x - this.working_width * 0.5) > (this.working_width * 0.5)) ||
			(Math.abs(draw_position.y - this.working_height * 0.5) > (this.working_height * 0.5))
		) {
			return;
		}
		
		//draw Skeletons
		if (option_extra == "skeleton") {
			this.putPixel(draw_position.x, draw_position.y, draw_position.z, pixel_pixel.color);
			return;
		}
		
		//draw with light
		var light_color = new Color4(0, 0, 0, 0);
		for (var index = 0; index < dot_light_pack.length; index++) {
			//calc Dot light intensity (0~1)
			var light_direction = modelBlock.WorldCenterVertex.Coord.subtract(dot_light_pack[index].Coord);
			light_direction.normalize();
			var intensity = - Vector3.Dot(Vector3.Up(), light_direction);
			//Blending
			light_color = Color4.MethodBlend(light_color, dot_light_pack[index].Color, "L", intensity);
		}
		light_color = Color4.MethodBlend(light_color, global_light_color, "L", 1);
		var draw_color = Color4.MethodBlend(pixel_pixel.color, light_color, "F");
		
		this.putPixel(draw_position.x, draw_position.y, draw_position.z, draw_color);
	};
	

	Module.prototype.render = function (zoom, camera, render_data, option_extra) {
		//calculate View, Projection Matrix
		//process: Model --> World --> View(Camera) --> Projection(3D->2D)
		var view_matrix = camera.getViewMatrix();
		var projection_matrix = Matrix4.OrthographicLH(this.working_width, this.working_height, zoom); //Matrix4.PerspectiveFovLH(0.78, this.working_width / this.working_height, 0.01, 1.0);
		
		var view_projection_matrix = view_matrix.multiply(projection_matrix);
		
		var data_tree_root = render_data.data_tree_root;
		var global_light_pack = render_data.global_light_pack || [];
		var dot_light_pack = render_data.dot_light_pack || [];
		
		
		var global_light_color = new Color4(0, 0, 0, 0); //black & transparent
		//for each global light:
		for (var index = 0; index < global_light_pack.length; index++) {
			//calc angle intensity (0~1)
			var intensity = - Vector3.Dot(
				Vector3.Up(),
				global_light_pack[index].direction
			);
			//Blending
			global_light_color = Color4.MethodBlend(
				global_light_color,
				global_light_pack[index].color,
				"L", 
				intensity
			);
		}
		
		var _this = this;
		
		//render each node(PixelModel or PixelMotion)
		data_tree_root.traverseDown(function (node) {
			
			var node_position = node.position; //node.CalcRenderPosition();
			var node_rotation = node.rotation; //node.CalcRenderRotation();
			
			//draw PixelPart
			var pixel_part_map = node.getRenderPixelPartMap();
			for (var name_pixel_part in pixel_part_map) {
				var pixel_part = pixel_part_map[name_pixel_part];
				
				var part_position = node_position.add(pixel_part.position);
				var part_rotation = pixel_part.rotation; //node_rotation.add(pixel_part.rotation);
				
				//Calc Model to World matrix
				var world_matrix = Matrix4.RotationYawPitchRoll(
					part_rotation.y, part_rotation.x, part_rotation.z
				).multiply(
					Matrix4.Translation(
						part_position.x, part_position.y, part_position.z
					)
				);
				
				//Calc applys World+View+Projection in order
				var transform_matrix = world_matrix.multiply(view_projection_matrix);
				
				//draw PixelPixel
				var pixel_pixel_list = pixel_part.pixels;
				for (var index_pixel_pixel = 0; index_pixel_pixel < pixel_pixel_list.length; index_pixel_pixel++) {
					var pixel_pixel = pixel_pixel_list[index_pixel_pixel];
					
					var pixel_position = pixel_pixel.position;
					// pixel_position = pixel_position.pixelRotate(part_position, part_rotation);
					
					//local_position + transform_matrix = screen position
					var canter_vector = Vector3.TransformCoordinates(pixel_position, transform_matrix);
					
					
					_this.drawPixelPixel(
						pixel_pixel,
						canter_vector,
						dot_light_pack,
						global_light_color,
						option_extra
					);
				
				}
			}
		});
	};
	
	
	
	
	
	
	// TODO: simple tracing by point, not ray yet
	Module.prototype.raytracing = function (zoom, camera, render_data, screen_x, screen_y, depth) {
		var output_index = Math.floor(screen_y) * this.output_width + Math.floor(screen_x);
		var working_index = this.quick_output_working_index_map[output_index] >> 2;
		
		var working_x = working_index % this.working_width; // - this.working_width * 0.5;
		var working_y = Math.floor(working_index / this.working_width); // - this.working_height * 0.5;
		var working_z = depth;
		
		var ray_origin = new Vector3(working_x, working_y, working_z);
		var ray_direction = new Vector3(0, 0, 1);
		var target_ray = new Ray(ray_origin, ray_direction);
		
		var min_distance_sqrt = Infinity; //Number.POSITIVE_INFINITY;
		var result_node = null;
		var result_part = null;
		var result_pixel = null;
		
		//calculate View, Projection Matrix
		//process: Model --> World --> View(Camera) --> Projection(3D->2D)
		var view_matrix = camera.getViewMatrix();
		var projection_matrix = Matrix4.OrthographicLH(this.working_width, this.working_height, zoom); //Matrix4.PerspectiveFovLH(0.78, this.working_width / this.working_height, 0.01, 1.0);
		
		var view_projection_matrix = view_matrix.multiply(projection_matrix);
		
		var data_tree_root = render_data.data_tree_root;
		
		var _this = this;
		
		//render each node(PixelModel or PixelMotion)
		data_tree_root.traverseDown(function (node) {
			
			var node_position = node.position; //node.CalcRenderPosition();
			var node_rotation = node.rotation; //node.CalcRenderRotation();
			
			//draw PixelPart
			var pixel_part_map = node.getRenderPixelPartMap();
			for (var name_pixel_part in pixel_part_map) {
				var pixel_part = pixel_part_map[name_pixel_part];
				
				var part_position = node_position.add(pixel_part.position);
				var part_rotation = pixel_part.rotation; //node_rotation.add(pixel_part.rotation);
				
				//Calc Model to World matrix
				var world_matrix = Matrix4.RotationYawPitchRoll(
					part_rotation.y, part_rotation.x, part_rotation.z
				).multiply(
					Matrix4.Translation(
						part_position.x, part_position.y, part_position.z
					)
				);
				
				//Calc applys World+View+Projection in order
				var transform_matrix = world_matrix.multiply(view_projection_matrix);
				
				//get inverted projection transform matrix
				var invert_transform_matrix = transform_matrix.copy().invert();
				
				var working_position = Vector3.TransformCoordinates(ray_origin, invert_transform_matrix);
				
				
				//draw PixelPixel
				var pixel_pixel_list = pixel_part.pixels;
				for (var index_pixel_pixel = 0; index_pixel_pixel < pixel_pixel_list.length; index_pixel_pixel++) {
					var pixel_pixel = pixel_pixel_list[index_pixel_pixel];
					
					var pixel_position = pixel_pixel.position;
					
					var distance_sqrt = Vector3.DistanceSquared(pixel_position, working_position);
					
					if (distance_sqrt < min_distance_sqrt) {
						min_distance_sqrt = distance_sqrt;
						
						result_node = node;
						result_part = pixel_part;
						result_pixel = pixel_pixel;
					}
				}
			}
		});
		
		// Dr.log(min_distance_sqrt, result_node, result_part, result_pixel);
		if (result_pixel) { result_pixel.color = Color4.Random(255); }
		// if (result_pixel) { result_pixel.color = new Color4(255, 0, 0, 255); }
	};
	
	
	
	
	
	
	
	return Module;
});