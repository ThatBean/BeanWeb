
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
		this._source = source;
		
		switch (type) {
			case Module.type.IMAGE_ELEMENT:
			case Module.type.CANVAS_ELEMENT:
			case Module.type.CANVAS_IMAGE_DATA:
				this._width = data.width;
				this._height = data.height;
				break;
			default:
				Dr.log('[ImageData] error type:', type, source);
				break;
		}
		
		this._type = type;
		this._data = data;
	}
	
	Module.prototype.load = function (font_data) {
		if (
			!font_data.font_src
			|| !font_data.font_map
			|| !(
				(font_data.font_width && font_data.font_height) || font_data.font_size
			)
		) {
			Dr.log("[loadFontData] error font_data", font_data);
			return;
		}
		
		this.font_data = font_data;
		this.font_map = font_data.font_map;
		this.font_map = font_data.font_map;
		
		
		Dr.loadImage(font_data.font_src, function (image_element) {
			Dr.log("[loadFontData] loaded font_src", font_data.font_src);
			this._init(image_element);
		});
	}
	
	return Module;
});