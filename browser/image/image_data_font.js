Dr.Declare('ImageDataFont', 'class');
Dr.Require('ImageDataFont', 'ImageDataExt');
Dr.Implement('ImageDataFont', function (global, module_get) {
	
	var Module = function () {
		//
	}
	
	var ImageDataExt = Dr.Get('ImageDataExt');
	
	Module.type = {
		IMAGE_ELEMENT: 'IMAGE_ELEMENT',	//fast, but not editable
		CANVAS_ELEMENT: 'CANVAS_ELEMENT',	//fast, with vector graph edit API(recommend to use)
		CANVAS_IMAGE_DATA: 'CANVAS_IMAGE_DATA',	//slow, but with pixel manipulation
	}
	
	Module.prototype.init = function () {
		this.cached = {};
		this.generated = {};
		
		this.setDefaultAttribute(50, 50, 'normal', 'monaco,consolas,monospace');
	}
	
	
	
	Module.prototype.setDefaultAttribute = function (font_size, line_height, font_style, font_family) {
		this._default_font_size = font_size;
		this._default_line_height = line_height;
		this._default_font_style = font_style; //normal, italic, oblique
		this._default_font_family = font_family;
		
		this._default_font_attribute = font_style + ' ' + font_size + 'px/' + line_height + 'px ' + font_family;
		
		this._default_font_config = this.getFontConfig();
	}
	
	
	Module.prototype.getFontConfig = function (font_size, line_height, font_style, font_family) {
		//check CSS font for usuage
		var font_size = font_size || this._default_font_size;
		var line_height = line_height || this._default_line_height;
		var font_style = font_style || this._default_font_style;
		var font_family = font_family || this._default_font_family;
		
		return {
			font_size: font_size,
			line_height: line_height,
			font_style: font_style,
			font_family: font_family,
			attribute: font_style + ' ' + font_size + 'px/' + line_height + 'px ' + font_family,
		}
	}
	
	
	Module.prototype.getTextMeasureData = function (text, font_config) {
		var quick_context = ImageDataExt.getQuickContext();
		quick_context.font = font_config.attribute;
		
		return {
			text: text,
			width: quick_context.measureText(text).width,
			font_config: font_config,
		};
	}
	
	//with cache, used for single character
	Module.prototype.generateTextImageData = function (text_measure_data) {
		var text = text_measure_data.text;
		var font_attribute = text_measure_data.font_config.attribute;
		
		Dr.log('[generateTextImageData]', text, font_attribute);
		
		//generate
		var generated_image_data_ext = ImageDataExt.create(ImageDataExt.type.CANVAS_ELEMENT, 
			text_measure_data.width, text_measure_data.font_config.line_height);
		
		var context = generated_image_data_ext.data.getContext('2d');
		context.font = font_attribute;
		context.textAlign = "left";
		context.textBaseline = "top";
		context.fillStyle = "#F00";
		context.fillText(text, 0, 0);
		
		this.generated[text] = this.generated[text] || {};
		this.generated[text][font_attribute] = generated_image_data_ext;
		
		
		generated_image_data_ext.floodFill({x:0, y:0}, {r:0, g:255, b:0, a:255});
		
		return generated_image_data_ext;
	}
	
	
	
	
	
	Module.prototype.getGeneratedTextImageData = function (text, font_config) {
		if (this.generated[text] && this.generated[text][font_config.attribute]) {
			return this.generated[text][font_config.attribute];
		}
		else {
			return this.generateTextImageData(this.getTextMeasureData(text, font_config));
		}
	}
	
	Module.prototype.getCachedTextImageData = function (text, scale_ratio) {
		var cache_key = text + '|' + this._default_font_attribute + '|' + scale_ratio;
		
		if (!this.cached[cache_key]) {
			Dr.debug(5, 'cache add', cache_key);
			var generated_symbol_image_data = this.getGeneratedTextImageData(text, this._default_font_config);
			var cache_image = ImageDataExt.copy(generated_symbol_image_data);
			cache_image.toCanvas();
			cache_image.scale(scale_ratio);
			this.cached[cache_key] = cache_image;
		}
		
		return this.cached[cache_key];
	}
	
	
	
	
	Module.prototype.getTextImageDataSize = function (text, scale_ratio, format_width) {
		var scale_ratio = scale_ratio || 1;
		var format_width = format_width || 0;
		
		var current_x = 0;
		var result_width = format_width > 0 ? format_width : 0;
		var result_height = this._default_line_height;
		
		//calculate size
		for (var i = 0; i < text.length; i++) {
			var symbol = text.charAt(i);
			var symbol_image_data = this.getCachedTextImageData(symbol, scale_ratio);
			
			if (format_width > 0) {	//limit width, height grow
				current_x += symbol_image_data.width;
				if (current_x > format_width) {
					current_x = 0;
					result_height += this._default_line_height;
				}
			}
			else {	//limit height, width grow
				result_width += symbol_image_data.width;
			}
		}
		
		return {
			width: result_width,
			height: result_height,
		}
	}
	
	
	
	
	//will use default_font_attribute
	Module.prototype.getTextImageData = function (text, scale_ratio, format_width) {
		var scale_ratio = scale_ratio || 1;
		var format_width = format_width || 0;
		
		var image_data_size = this.getTextImageDataSize(text, scale_ratio, format_width);
		
		var text_image_data_ext = ImageDataExt.create(ImageDataExt.type.CANVAS_ELEMENT, image_data_size.width, image_data_size.height);
		
		text_image_data_ext.floodFill({x:0, y:0}, {r:255, g:0, b:255, a:255});
		
		text_image_data_ext.toCanvas();
		
		var context = text_image_data_ext.data.getContext('2d');
		
		
		var current_x = 0;
		var current_y = 0;
		//get text image data
		for (var i = 0; i < text.length; i++) {
			var symbol = text.charAt(i);
			var symbol_image_data = this.getCachedTextImageData(symbol, scale_ratio);
			
			if (format_width > 0 && (current_x + symbol_image_data.width) > format_width) {
				current_x = 0;
				current_y += this._default_line_height;
			}
			
			symbol_image_data.draw(context, current_x, current_y);
			
			current_x += symbol_image_data.width;
		}
		
		
		
		return text_image_data_ext;
	}
	
	return Module;
});