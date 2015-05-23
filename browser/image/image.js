Dr.Declare('Canvas', 'class');
Dr.Require('Canvas', 'ImageData');
Dr.Implement('Canvas', function (global, module_get) {
	
	var Module = function () {
		//
	}
	
	var ImageData = Dr.Get('ImageData');
	
	Module.event = {
		DRAW: 'DRAW',
		UPDATE: 'UPDATE',
	}
	
	Module.prototype.init = function (canvas, event_center) {
		this._main_canvas = canvas;
		this._main_context = canvas.getContext('2d');
		
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
		//Dr.log('[Canvas][onAction] get', action.action_type, action);
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



Dr.Declare('ImageData', 'class');
Dr.Implement('ImageData', function (global, module_get) {
	
	var Module = function () {
		//
	}
	
	Module.type = {
		IMAGE_ELEMENT: 'IMAGE_ELEMENT',	//fast, but not editable
		CANVAS_ELEMENT: 'CANVAS_ELEMENT',	//fast, with vector graph edit API(recommend to use)
		CANVAS_IMAGE_DATA: 'CANVAS_IMAGE_DATA',	//slow, but with pixel manipulation
	}
	
	Module.prototype.create = function (type, width, height) {
		switch (type) {
			case Module.type.CANVAS_ELEMENT:
				var canvas_element = Dr.document.createElement('canvas');
				canvas_element.width = width;
				canvas_element.height = height;
				this.init('create', canvas_element, Module.type.CANVAS_ELEMENT);
				break;
			case Module.type.IMAGE_ELEMENT:
			case Module.type.CANVAS_IMAGE_DATA:
			default:
				Dr.log('[ImageData][create] error type:', type);
				break;
		}
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
				Dr.log('[ImageData][init] error type:', type, source);
				break;
		}
		
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
				Dr.log('[ImageData][toCanvas] error type:', this.type, this._source);
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
				Dr.log('[ImageData][toCanvasImageData] error type:', this.type, this._source);
				break;
		}
	}
	
	
	//CANVAS_ELEMENT only
	//CANVAS_ELEMENT only
	Module.prototype.scale = function (scale_x, scale_y) {
		this.toCanvas();
		
		var scale_x = scale_x;
		var scale_y = scale_y || scale_x;
		var canvas_element = this.data;
		
		Dr.log('scale:', scale_x, scale_y);
		
		//get source
		var source_canvas_image_data = canvas_element.getContext('2d').getImageData(0, 0, canvas_element.width, canvas_element.height);
		var source_pixel_array = source_canvas_image_data.data;
		var source_pixel_width = canvas_element.width;
		Dr.log('source canvas_element size:', canvas_element.width, canvas_element.height);
		
		//scale canvas
		canvas_element.width = this.width * scale_x;
		canvas_element.height = this.height * scale_y;
		
		//get target
		var target_canvas_image_data = canvas_element.getContext('2d').getImageData(0, 0, canvas_element.width, canvas_element.height);
		var target_pixel_array = target_canvas_image_data.data;
		var target_pixel_width = canvas_element.width;
		Dr.log('source canvas_element size:', canvas_element.width, canvas_element.height);
		
		var target_pixel_count = canvas_element.width * canvas_element.height;
		for (var target_pixel_index = 0; target_pixel_index < target_pixel_count; target_pixel_index++) {
			var target_x = target_pixel_index % target_pixel_width;
			var target_y = Math.floor(target_pixel_index / target_pixel_width);
			
			var source_x = Math.round(target_x / scale_x);
			var source_y = Math.round(target_y / scale_y);
			
			var target_pixel_array_index = target_pixel_index * 4;
			var source_pixel_array_index = (source_x + source_y * source_pixel_width) * 4;
			
			target_pixel_array[target_pixel_array_index] = source_pixel_array[source_pixel_array_index];
			target_pixel_array[target_pixel_array_index + 1] = source_pixel_array[source_pixel_array_index + 1];
			target_pixel_array[target_pixel_array_index + 2] = source_pixel_array[source_pixel_array_index + 2];
			target_pixel_array[target_pixel_array_index + 3] = source_pixel_array[source_pixel_array_index + 3];
		}
		
		canvas_element.getContext('2d').putImageData(target_canvas_image_data, 0, 0);
		
		//Dr.target_canvas_image_data = target_canvas_image_data;
		
		this.init(this._source, canvas_element, Module.type.CANVAS_ELEMENT);
	}
	
	
	
	
	//CANVAS_IMAGE_DATA only
	//CANVAS_IMAGE_DATA only
	Module.prototype.drawPixel = function (x, y, color) {
		this.toCanvasImageData();
		
		var index = Math.round(x) + Math.round(y) * this.width;
		var index4 = index * 4;
		var data = this._data.data;
		
		data[index4] = color.r * 255;
		data[index4 + 1] = color.g * 255;
		data[index4 + 2] = color.b * 255;
		data[index4 + 3] = color.a * 255;
	};
	
	Module.prototype.drawPixelLine = function (point0, point1, color) {
		this.toCanvasImageData();
		
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
	
	
	return Module;
});


// TODO:
/*


	Module.seperate = function (combined_image_data, combined_info) {
		
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