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
	
	Module.prototype.init = function (canvas) {
		this._canvas = canvas;
		this._context = canvas.getContext('2d');
		
		this._width = canvas.width;
		this._height = canvas.height;
		
		this._event_center = Dr.GetNew('EventProto');
		
		var _this = this;
		Dr.applyActionListener(canvas, function (action) {
			_this.onAction(action);
		});
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
		CANVAS_ELEMENT: 'CANVAS_ELEMENT',	//fast, with vector graph edit API
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
				Dr.log('[ImageData] error type:', type, source);
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
		context.drawImage(this._data, x, y);
	}
	
	Module.prototype.drawImageData = function (context, x, y) {
		context.putImageData(this._data, x, y);
	}
	
	Module.prototype.drawImageClip = function (context, x, y, clip_x, clip_y, clip_width, clip_height) {
		//context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
		context.drawImage(this._data, clip_x, clip_y, clip_width, clip_height, x, y, clip_width, clip_height);
	}
	
	Module.prototype.drawImageDataClip = function (context, x, y, clip_x, clip_y, clip_width, clip_height) {
		//context.putImageData(imgData,x,y,dirtyX,dirtyY,dirtyWidth,dirtyHeight);
		context.putImageData(this._data, clip_x ? x - clip_x : x, clip_y ? y - clip_y : y, clip_x, clip_y, clip_width, clip_height);
	}
	
	return Module;
});