Dr.Declare('CanvasExt', 'class');
Dr.Require('CanvasExt', 'ImageDataExt');
Dr.Implement('CanvasExt', function (global, module_get) {
	
	var Module = function () {
		//
	}
	
	var ImageDataExt = Dr.Get('ImageDataExt');
	
	Module.event = {
		DRAW: 'DRAW',
		UPDATE: 'UPDATE',
	}
	
	Module.prototype.init = function (canvas, event_center) {
		this._main_canvas = canvas;
		this._main_context = canvas.getContext('2d');
		
		if (Dr.devicePixelRatio != 1) {
			Dr.log('Get Dr.devicePixelRatio:', Dr.devicePixelRatio);
		}
		
		if ((canvas.style.width && canvas.width != parseInt(canvas.style.width)) 
			|| (canvas.style.height && canvas.height != parseInt(canvas.style.height))) {
			Dr.log('Get canvas pixel style mismatch:', 'pixel:', canvas.width, canvas.height, 'style:', canvas.style.width, canvas.style.height);
		}
		
		
		this._width = canvas.width;
		this._height = canvas.height;
		//canvas.style.cursor = 'default';	//prevent selection
		
		this._buffer_list = [];
		
		//event
		this._event_center = event_center || Dr.GetNew('EventProto');
		
		var _this = this;
		Dr.applyActionListener(canvas, function (action) { _this.onAction(action); });
	}
	
	
	Module.prototype.onAction = function (action) {
		this._event_center.emit(action.action_type, action);
		//Dr.log('[CanvasExt][onAction] get', action.action_type, action);
	}
	
	Module.prototype.update = function (delta_time, buffer_index) {
		this._event_center.emit(Module.event.UPDATE);
		
		var buffer_index = buffer_index || 0;
		this.applyBuffer(buffer_index);
	}
	
	Module.prototype.getMainCanvas = function () {
		return this._main_canvas;
	}
	
	Module.prototype.getMainContext = function () {
		return this._main_context;
	}
	
	Module.prototype.drawImageData = function (image_data, x, y) {
		this._event_center.emit(Module.event.DRAW);
	}
	
	Module.prototype.getEventCenter = function () {
		return this._event_center;
	}
	
	// TODO: replace with ImageDataExt and separate
	//simple buffer canvas list, could be a separated class
	Module.prototype.createBuffer = function (buffer_index, buffer_canvas/* ... will pass to configBuffer */) {
		var buffer_index = buffer_index || this._buffer_list.length;
		
		this._buffer_list[buffer_index] = {
			index: buffer_index,
			canvas: buffer_canvas || Dr.document.createElement('canvas'),
		};
		
		//apply init config
		var args = Dr.getArgumentArray(arguments, 2);
		args[0] = buffer_index;
		this.configBuffer.apply(this, args);
		
		return this._buffer_list[buffer_index];
	}
	
	
	Module.prototype.configBuffer = function (buffer_index, buffer_width, buffer_height, x, y, clip_x, clip_y, clip_width, clip_height) {
		Dr.assert(this._buffer_list[buffer_index], '[configBuffer] error buffer_index not found:', buffer_index);
		
		var buffer = this._buffer_list[buffer_index];
		
		//keep buffer if we can
		if (buffer.canvas.width != buffer_width) buffer.canvas.width = (buffer_width != undefined ? buffer_width : this._width);
		if (buffer.canvas.height != buffer_height) buffer.canvas.height = (buffer_height != undefined ? buffer_height : this._height);
		
		this._buffer_list[buffer_index] = {
			index: buffer_index,
			
			canvas: buffer.canvas,
			context: buffer.canvas.getContext('2d'),
			
			// how this buffer apply to main canvas
			x: (x != undefined ? x : (buffer.x || 0)),
			y: (y != undefined ? y : (buffer.y || 0)),
			clip_x: (clip_x != undefined ? clip_x : (buffer.clip_x || 0)),
			clip_y: (clip_y != undefined ? clip_y : (buffer.clip_y || 0)),
			clip_width: (clip_width != undefined ? clip_width : (buffer.clip_width || this._width)),
			clip_height: (clip_height != undefined ? clip_height : (buffer.clip_height || this._height)),
		};
	}
	
	Module.prototype.getBuffer = function (buffer_index) {
		return this._buffer_list[buffer_index];
	}
	
	Module.prototype.applyBuffer = function (buffer_index) {
		Dr.assert(this._buffer_list[buffer_index], '[applyBuffer] error buffer_index not found:', buffer_index);
		
		var buffer = this._buffer_list[buffer_index];
		
		//context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
		this._main_context.drawImage(
			buffer.canvas, 
			buffer.clip_x, buffer.clip_y, 
			buffer.clip_width, buffer.clip_height, 
			buffer.x, buffer.y, 
			buffer.clip_width, buffer.clip_height
		);
	}
	
	return Module;
});



Dr.Declare('ImageDataExt', 'class');
Dr.Implement('ImageDataExt', function (global, module_get) {
	
	var Module = function () {
		//
	}
	
	Module.type = {
		IMAGE_ELEMENT: 'IMAGE_ELEMENT',	//fast, but not editable
		CANVAS_ELEMENT: 'CANVAS_ELEMENT',	//fast, with vector graph edit API(recommend to use)
		CANVAS_IMAGE_DATA: 'CANVAS_IMAGE_DATA',	//slow, but with pixel manipulation
	}
	
	Module.getQuickCancas = function () {
		Module._quick_canvas = Module._quick_canvas || document.createElement('canvas');
		return Module._quick_canvas;
	}
	Module.getQuickContext = function () {
		Module._quick_context = Module._quick_context || Module.getQuickCancas().getContext("2d");
		return Module._quick_context;
	}
	
	function create_data (type, width, height) {
		var data;
		switch (type) {
			case Module.type.IMAGE_ELEMENT: 
				data = document.createElement('img');
				break;
			case Module.type.CANVAS_ELEMENT: 
				data = document.createElement('canvas');
				break;
			case Module.type.CANVAS_IMAGE_DATA: 
				data = Module.getQuickContext().createImageData(width, height);
				break;
			default:
				Dr.log('[ImageDataExt][create] error type:', type, 'canvas used instead');
				data = document.createElement('canvas');
				break;
		}
		data.width = width;
		data.height = height;
		return data;
	}
	
	Module.create = function (type, width, height) {
		var data = create_data(type, width, height);
		
		var instance = new Module;
		instance.init('create', data, type);
		return instance;
	}
	
	Module.copy = function (image_data_ext) {
		var data = create_data(Module.type.CANVAS_ELEMENT, image_data_ext.width, image_data_ext.height);
		image_data_ext.draw(data.getContext('2d'), 0, 0);
		
		var instance = new Module;
		instance.init('copy', data, Module.type.CANVAS_ELEMENT);
		return instance;
	}
	
	Module.prototype.init = function (source, data, type) {
		switch (type) {
			case Module.type.IMAGE_ELEMENT:
				this._editable = false;
				this.draw = this.drawImage;
				this.drawClip = this.drawImageClip;
				break;
			case Module.type.CANVAS_ELEMENT:
				this._editable = true;
				this.draw = this.drawImage;
				this.drawClip = this.drawImageClip;
				break;
			case Module.type.CANVAS_IMAGE_DATA:
				this._editable = true;
				this.draw = this.drawImageData;
				this.drawClip = this.drawImageDataClip;
				break;
			default:
				Dr.log('[ImageDataExt][init] error type:', type, source);
				break;
		}
		
		//var data = data || Module.CreateImageData(type);
		
		//all directly accessible(public)
		this.type = type;
		this.data = this._editable ? data : null;
		
		this.width = data.width;
		this.height = data.height;
		
		//should not access(private)
		this._source = source;
		this._data = data;
	}
	
	Module.prototype.drawImage = function (context, x, y) {
		//for IMAGE_ELEMENT, CANVAS_ELEMENT
		context.drawImage(this._data, x, y);
	}
	
	Module.prototype.drawImageData = function (context, x, y) {
		//for CANVAS_IMAGE_DATA
		context.putImageData(this._data, x, y);
	}
	
	Module.prototype.drawImageClip = function (context, x, y, clip_x, clip_y, clip_width, clip_height) {
		//for IMAGE_ELEMENT, CANVAS_ELEMENT
		//context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
		context.drawImage(this._data, clip_x, clip_y, clip_width, clip_height, x, y, clip_width, clip_height);
	}
	
	Module.prototype.drawImageDataClip = function (context, x, y, clip_x, clip_y, clip_width, clip_height) {
		//for CANVAS_IMAGE_DATA
		//(the dirty rect only mute other color, leaving blank space around, so the origin will be adjusted)
		//context.putImageData(imgData,x,y,dirtyX,dirtyY,dirtyWidth,dirtyHeight);
		context.putImageData(this._data, clip_x ? x - clip_x : x, clip_y ? y - clip_y : y, clip_x, clip_y, clip_width, clip_height);
	}
	
	Module.prototype.toCanvas = function () {
		switch (this.type) {
			case Module.type.IMAGE_ELEMENT:
			case Module.type.CANVAS_IMAGE_DATA:
				var canvas_element = Dr.document.createElement('canvas');
				canvas_element.width = this.width;
				canvas_element.height = this.height;
				this.draw(canvas_element.getContext('2d'), 0, 0);
				this.init(this._source, canvas_element, Module.type.CANVAS_ELEMENT);
				break;
			case Module.type.CANVAS_ELEMENT:
				break;
			default:
				Dr.log('[ImageDataExt][toCanvas] error type:', this.type, this._source);
				break;
		}
	}
	
	Module.prototype.toCanvasImageData = function () {
		switch (this.type) {
			case Module.type.IMAGE_ELEMENT:
				var canvas_element = Dr.document.createElement('canvas');
				canvas_element.width = this.width;
				canvas_element.height = this.height;
				var canvas_context = canvas_element.getContext('2d');
				this.draw(canvas_context, 0, 0);
				var canvas_image_data = canvas_context.getImageData(0, 0, canvas_element.width, canvas_element.height);
				this.init(this._source, canvas_image_data, Module.type.CANVAS_IMAGE_DATA);
				break;
			case Module.type.CANVAS_ELEMENT:
				var canvas_element = this._data;
				var canvas_context = canvas_element.getContext('2d');
				var canvas_image_data = canvas_context.getImageData(0, 0, canvas_element.width, canvas_element.height);
				this.init(this._source, canvas_image_data, Module.type.CANVAS_IMAGE_DATA);
				break;
			case Module.type.CANVAS_IMAGE_DATA:
				break;
			default:
				Dr.log('[ImageDataExt][toCanvasImageData] error type:', this.type, this._source);
				break;
		}
	}
	
	
	//CANVAS_ELEMENT only
	//CANVAS_ELEMENT only
	Module.prototype.scale = function (scale_x, scale_y) {
		this.toCanvas();
		var canvas_element = canvas_scale(this._data, scale_x, scale_y);
		this.init(this._source, canvas_element, Module.type.CANVAS_ELEMENT);
	}
	
	var canvas_scale = function (canvas_element, scale_x, scale_y) {
		var scale_y = scale_y || scale_x;
		Dr.debug(5, 'scale:', scale_x, scale_y);
		
		//get source
		var source_canvas_image_data = canvas_element.getContext('2d').getImageData(0, 0, canvas_element.width, canvas_element.height);
		var source_pixel_array = source_canvas_image_data.data;
		var source_pixel_width = canvas_element.width;
		Dr.debug(5, 'source canvas_element size:', canvas_element.width, canvas_element.height);
		
		//scale canvas
		canvas_element.width = canvas_element.width * scale_x;
		canvas_element.height = canvas_element.height * scale_y;
		
		//get target
		var target_canvas_image_data = canvas_element.getContext('2d').getImageData(0, 0, canvas_element.width, canvas_element.height);
		var target_pixel_array = target_canvas_image_data.data;
		var target_pixel_width = canvas_element.width;
		Dr.debug(5, 'source canvas_element size:', canvas_element.width, canvas_element.height);
		
		var target_pixel_count = canvas_element.width * canvas_element.height;
		for (var target_pixel_index = 0; target_pixel_index < target_pixel_count; target_pixel_index++) {
			var target_x = target_pixel_index % target_pixel_width;
			var target_y = Math.floor(target_pixel_index / target_pixel_width);
			
			var source_x = Math.floor(target_x / scale_x);
			var source_y = Math.floor(target_y / scale_y);
			
			var target_pixel_array_index = target_pixel_index * 4;
			var source_pixel_array_index = (source_x + source_y * source_pixel_width) * 4;
			
			target_pixel_array[target_pixel_array_index] = source_pixel_array[source_pixel_array_index];
			target_pixel_array[target_pixel_array_index + 1] = source_pixel_array[source_pixel_array_index + 1];
			target_pixel_array[target_pixel_array_index + 2] = source_pixel_array[source_pixel_array_index + 2];
			target_pixel_array[target_pixel_array_index + 3] = source_pixel_array[source_pixel_array_index + 3];
		}
		
		canvas_element.getContext('2d').putImageData(target_canvas_image_data, 0, 0); //put back
		return canvas_element;
	}
	
	
	//CANVAS_IMAGE_DATA only
	//CANVAS_IMAGE_DATA only
	Module.prototype.getPixelColor = function (x, y) {
		this.toCanvasImageData();
		
		var index = x + y * this.width;
		var index4 = index * 4;
		var data = this._data.data;
		
		return {
			r: data[index4],
			g: data[index4 + 1],
			b: data[index4 + 2],
			a: data[index4 + 3],
		}
	};
	
	Module.prototype.drawPixel = function (x, y, color) {
		this.toCanvasImageData();
		
		var index = x + y * this.width;
		var index4 = index * 4;
		var data = this._data.data;
		
		data[index4] = color.r;
		data[index4 + 1] = color.g;
		data[index4 + 2] = color.b;
		data[index4 + 3] = color.a;
	};
	
	Module.prototype.drawPixelLine = function (point0, point1, color) {
		this.toCanvasImageData();
		
		Dr.debug(5, 'drawPixelLine');
		
		var x0 = Math.round(point0.x);
		var y0 = Math.round(point0.y);
		//var z0 = point0.z;
		
		var x1 = Math.round(point1.x);
		var y1 = Math.round(point1.y);
		//var z1 = point1.z;
		
		var dx = Math.abs(x1 - x0);
		var dy = Math.abs(y1 - y0);
		//var dz = Math.abs(z1 - z0) / Math.sqrt(dx*dx + dy*dy);
		
		var sx = (x0 < x1) ? 1 : -1;
		var sy = (y0 < y1) ? 1 : -1;
		//var sz = (z0 < z1) ? dz : -dz;
		
		var err = dx - dy;
		
		while(true) {
			this.drawPixel(x0, y0, color);
			//this.drawPoint4(x0, y0, z0, color);
			if((x0 == x1) && (y0 == y1)) break;
			var e2 = 2 * err;
			if(e2 > -dy) { err -= dy; x0 += sx; }
			if(e2 < dx) { err += dx; y0 += sy; }
			//z0 += sz;
		}
	};
	
	Module.prototype.drawPixelLineList = function (point_list, color, is_loop) {
		this.toCanvasImageData();
		
		Dr.debug(5, 'drawPixelLineList');
		
		Dr.assert(point_list.length >= 2, '[drawPixelLineList] check length');
		
		var from_point;
		var point_index;
		
		if (is_loop) {
			from_point = point_list[point_list.length - 1];
			point_index = 0;
		}
		else {
			from_point = point_list[0];
			point_index = 1;
		}
		
		while(point_index < point_list.length) {
			this.drawPixelLine(from_point, point_list[point_index], color)
			from_point = point_list[point_index];
			point_index++;
		}
	};
	
	Module.prototype.floodFill = function (start_point, fill_color) {
		this.toCanvasImageData();
		
		start_point.x = Math.round(start_point.x);
		start_point.y = Math.round(start_point.y);
		
		var width = this.width;
		var height = this.height;
		var data = this._data.data;
		var from_color = this.getPixelColor(start_point.x, start_point.y);
		var to_color = fill_color;
		
		var mark_point_array = [];
		
		var put_color = function (x, y, color) {
			var index = (y * width + x) * 4;
			data[index] = color.r;
			data[index + 1] = color.g;
			data[index + 2] = color.b;
			data[index + 3] = color.a;
		}
		
		var check_color = function (x, y, color) {
			var index = (y * width + x) * 4;
			return data[index] == color.r
				&& data[index + 1] == color.g
				&& data[index + 2] == color.b
				&& data[index + 3] == color.a;
		}
		
		var combo_push = function (x_left, x_right, check_y) {
			var check_x = x_left + 1;
			var is_combo = false;
			while(check_x < x_right) {
				if (check_color(check_x, check_y, from_color)) {
					if (!is_combo) {
						is_combo = true;
						mark_point_array.push({x:check_x, y:check_y});
					}
				}
				else {
					is_combo = false;
				}
				check_x++;
			}
		}
		
		//check initial point
		if (!check_color(start_point.x, start_point.y, to_color)) mark_point_array.push(start_point);
		else return;
		
		//stack loop
		while(mark_point_array.length) {	//loop marked points
			var init_point = mark_point_array.pop();
			
			var x_left = init_point.x - 1;
			var x_right = init_point.x + 1;
			
			var current_y = init_point.y;
			
			if (check_color(init_point.x, init_point.y, from_color)) {
				//paint current point
				put_color(init_point.x, init_point.y, to_color);
				
				//left expand
				while(x_left >= 0 && check_color(x_left, current_y, from_color)) {
					put_color(x_left, current_y, to_color);
					x_left--;
				}
				//right expand
				while(x_right < width && check_color(x_right, current_y, from_color)) {
					put_color(x_right, current_y, to_color);
					x_right++;
				}
				
				//up check
				if (current_y - 1 >= 0) combo_push(x_left, x_right, current_y - 1);
				//down check
				if (current_y + 1 < height) combo_push(x_left, x_right, current_y + 1);
			}
		}
	};
	
	//Module.prototype.crop = function (crop_color) {
	Module.prototype.crop = function (crop_func) {
		this.toCanvasImageData();
		
		var data = this._data.data;
		
		Dr.debug(5, '[crop] size before', this.width, this.height);
		
		var x_min = this.width - 1;
		var x_max = 0;
		var y_min = this.height - 1;
		var y_max = 0;
		
		for (var y = 0; y < this.height; y++) {
			for (var x = 0; x < this.width; x++) {
				var index = (y * this.width + x) * 4;
				var is_crop = crop_func(
					data[index], 
					data[index + 1], 
					data[index + 2], 
					data[index + 3]);
				if (!is_crop) {
					//Dr.log('[crop] check');
					x_min = Math.min(x_min, x);
					x_max = Math.max(x_max, x);
					y_min = Math.min(y_min, y);
					y_max = Math.max(y_max, y);
				}
			}
		}
		
		Dr.debug(5, '[crop] size result', x_min, y_min, x_max - x_min, y_max - y_min);
		
		if (x_max == 0 && y_max == 0) return;	//nothing changed
		
		var canvas_image_data = this._data;	// keep data source
		
		//to canvas and resize
		this.toCanvas();
		this._data.width = x_max - x_min + 1;
		this._data.height = y_max - y_min + 1;
		//context.putImageData(imgData,x,y,dirtyX,dirtyY,dirtyWidth,dirtyHeight);
		this._data.getContext('2d').putImageData(canvas_image_data, 0 - x_min, 0 - y_min, x_min, y_min, x_max - x_min + 1, y_max - y_min + 1);
		//reset size
		this.init(this._source, this._data, Module.type.CANVAS_ELEMENT);
		
		Dr.debug(5, '[crop] size after', this.width, this.height);
	};
	
	//Module.prototype.replaceColor = function (target_color, replace_color) {
	Module.prototype.replaceColor = function (replacer_func) {
		this.toCanvasImageData();
		
		var data = this._data.data;
		
		for (var y = 0; y < this.height; y++) {
			for (var x = 0; x < this.width; x++) {
				var index = (y * this.width + x) * 4;
				var replace_color = replacer_func(
					data[index], 
					data[index + 1], 
					data[index + 2], 
					data[index + 3]);
				
				if (replace_color) {
					//Dr.log('[replaceColor] check');
					data[index] = replace_color.r;
					data[index + 1] = replace_color.g;
					data[index + 2] = replace_color.b;
					data[index + 3] = replace_color.a;
				}
			}
		}
	};
	
	
	Module.arrayToPoint = function (array) {
		return {
			x: array[0], 
			y: array[1],
		};
	}
	Module.arrayToSize = function (array) {
		return {
			width: array[0], 
			height: array[1],
		};
	}
	Module.arrayToColor = function (array) {
		return {
			r: array[0], 
			g: array[1],
			b: array[2],
			a: array[3] == undefined ? 255 : array[3],
		};
	}
	
	return Module;
});


// TODO:
/*


	Module.separate = function (combined_image_data, combined_info) {
		
		return image_data_list;
	}
	
	Module.combine = function (image_data_list) {
		
		//should be JSON string convertible
		var combined_info = {
			type: 'combined_image',
			size: [w, h],
			image_count: count,
			content: [
				{
					name: '',
					size: [w, h],
					location: [x, y],
					//rotate_left: false,
					//scale_9: [x1, y1, x2, y2],
				}
			],
		};
		
		return {
			combined_image_data: combined_image_data,
			combined_info: combined_info,
		}
	}
	

*/