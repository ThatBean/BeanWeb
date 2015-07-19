// Extended ImageData
// merge multiple accessible image holder class
// provide common operation function

Dr.Declare('ImageDataExt', 'class');
Dr.Require('ImageDataExt', 'GraphicOperation');
Dr.Implement('ImageDataExt', function (global, module_get) {
	
	var GraphicOperation = Dr.Get('GraphicOperation');
	
	var Module = function () {
		//
	}
	
	Module.type = GraphicOperation.type;
	
	Module.create = function (type, width, height) {
		var data = GraphicOperation.createData(type, width, height);
		
		var instance = new Module;
		instance.init('create', data, type);
		return instance;
	}
	
	Module.copy = function (image_data_ext) {
		var data = GraphicOperation.createData(Module.type.CANVAS_ELEMENT, image_data_ext.width, image_data_ext.height);
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
		
		//all directly accessible(public)
		this.type = type;
		this.data = this._editable ? data : null;
		
		this.width = data.width;
		this.height = data.height;
		
		//should not access(private)
		this._source = source;
		this._data = data;
	}
	
	//for IMAGE_ELEMENT, CANVAS_ELEMENT
	Module.prototype.drawImage = function (context, x, y) {
		context.drawImage(this._data, x, y);
	}
	Module.prototype.drawImageClip = function (context, x, y, clip_x, clip_y, clip_width, clip_height) {
		//context.drawImage(image, dx, dy);
		//context.drawImage(image, dx, dy, dWidth, dHeight);
		//context.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
		//this function is capable of scale as well, but 
		var source_width = Math.min(clip_width, this.width - clip_x);
		var source_height = Math.min(clip_height, this.height - clip_y);
		context.drawImage(this._data, clip_x, clip_y, source_width, source_height, x, y, clip_width, clip_height);
	}
	
	//for CANVAS_IMAGE_DATA
	Module.prototype.drawImageData = function (context, x, y) {
		context.putImageData(this._data, x, y);
	}
	Module.prototype.drawImageDataClip = function (context, x, y, clip_x, clip_y, clip_width, clip_height) {
		// context.putImageData(imagedata, dx, dy);
		// context.putImageData(imagedata, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight);
		var x = clip_x ? x - clip_x : x;	// adjust the dirty rect origin to (0, 0)
		var y = clip_y ? y - clip_y : y;
		var dirty_width = Math.min(clip_width, this.width - clip_x);
		var dirty_height = Math.min(clip_height, this.height - clip_y);
		context.putImageData(this._data, x, y, clip_x, clip_y, dirty_width, dirty_height);
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
	
	
	//link to GraphicOperation
	Module.prototype.scale = function (scale_x, scale_y) {
		this.toCanvas();
		var canvas_element = GraphicOperation.scaleCanvas(this._data, scale_x, scale_y);
		this.init(this._source, canvas_element, Module.type.CANVAS_ELEMENT);
		return this;
	}
	
	Module.prototype.crop = function (crop_func) {
		this.toCanvas();
		var canvas_element = GraphicOperation.cropCanvas(this._data, crop_func);
		this.init(this._source, canvas_element, Module.type.CANVAS_ELEMENT);
		return this;
	};
	
	Module.prototype.floodFill = function (start_point, fill_color) {
		this.toCanvasImageData();
		GraphicOperation.floodFill(this._data, start_point, fill_color);
		this.toCanvas();
		return this;
	};
	
	
	return Module;
});