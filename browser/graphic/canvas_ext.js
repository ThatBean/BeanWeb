// Extended Canvas
// make it more like a screen

Dr.Declare('CanvasExt', 'class');
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
		
		
		this.width = canvas.width;
		this.height = canvas.height;
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
	
	Module.prototype.getMainCanvas = function () { return this._main_canvas; }
	Module.prototype.getMainContext = function () { return this._main_context; }
	Module.prototype.getEventCenter = function () { return this._event_center; }
	
	Module.prototype.clearCanvas = function () { this._main_canvas.width += 0; }
	//Module.prototype.drawImageData = function (image_data, x, y) { this._event_center.emit(Module.event.DRAW); }
	
	
	
	
	
	
	
	
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
		if (buffer.canvas.width != buffer_width) buffer.canvas.width = (buffer_width != undefined ? buffer_width : this.width);
		if (buffer.canvas.height != buffer_height) buffer.canvas.height = (buffer_height != undefined ? buffer_height : this.height);
		
		this._buffer_list[buffer_index] = {
			index: buffer_index,
			
			canvas: buffer.canvas,
			context: buffer.canvas.getContext('2d'),
			
			// how this buffer apply to main canvas
			x: (x != undefined ? x : (buffer.x || 0)),
			y: (y != undefined ? y : (buffer.y || 0)),
			clip_x: (clip_x != undefined ? clip_x : (buffer.clip_x || 0)),
			clip_y: (clip_y != undefined ? clip_y : (buffer.clip_y || 0)),
			clip_width: (clip_width != undefined ? clip_width : (buffer.clip_width || this.width)),
			clip_height: (clip_height != undefined ? clip_height : (buffer.clip_height || this.height)),
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