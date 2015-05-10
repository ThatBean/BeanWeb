
Dr.Declare('ImageData', 'class');
Dr.Implement('ImageData', function (global, module_get) {
	
	var Module = function () {
		//
	}
	
	Module.type = {
		IMAGE_ELEMENT: 'IMAGE_ELEMENT',
		CANVAS_ELEMENT: 'CANVAS_ELEMENT',
		CANVAS_IMAGE_DATA: 'CANVAS_IMAGE_DATA',
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
		context.putImageData(this._data, x, y, clip_x, clip_y, clip_width, clip_height);
	}
	
	return Module;
});