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
		this._canvas = canvas;
		this._context = canvas.getContext('2d');
		
		this._width = canvas.width;
		this._height = canvas.height;
		//canvas.style.cursor = 'default';	//prevent selection
		
		//event
		this._event_center = event_center || Dr.GetNew('EventProto');
		
		var _this = this;
		Dr.applyActionListener(canvas, function (action) { _this.onAction(action); });
	}
	
	
	Module.prototype.onAction = function (action) {
		this._event_center.emit(action.action_type, action);
		//Dr.log('[Canvas][onAction] get', action.action_type, action);
	}
	
	Module.prototype.update = function (delta_time) {
		this._event_center.emit(Module.event.UPDATE);
	}
	
	Module.prototype.getCanvas = function () {
		return this._canvas;
	}
	
	Module.prototype.getContext = function () {
		return this._context;
	}
	
	Module.prototype.drawImageData = function (image_data, x, y) {
		this._event_center.emit(Module.event.DRAW);
	}
	
	Module.prototype.getEventCenter = function () {
		return this._event_center;
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
				return;
				break;
			default:
				Dr.log('[ImageData][toCanvas] error type:', this.type, this._source);
				break;
		}
	}
	
	//canvas only
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
	
	return Module;
});