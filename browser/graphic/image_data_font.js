Dr.Declare('ImageDataFont', 'class');
Dr.Require('ImageDataFont', 'ImageDataExt');
Dr.Implement('ImageDataFont', function (global, module_get) {
	
	var Module = function () {
		//
	}
	
	var ImageDataExt = Dr.Get('ImageDataExt');
	var GraphicOperation = Dr.Get('GraphicOperation');
	
	Module.prototype.init = function () {
		this.cached = {};
		this.generated = {};
		this.setDefaultAttribute(8, 15, 'normal', 'consolas,monaco,monospace', '#000000');
	}
	
	Module.prototype.setDefaultAttribute = function (font_size, line_height, font_style, font_family, fill_style) {
		this._default_font_size = font_size;
		this._default_line_height = line_height;
		this._default_font_style = font_style; //normal, italic, oblique
		this._default_font_family = font_family;
		this._default_fill_style = fill_style;	//color
		
		//generated
		this._default_font_attribute = font_style + ' ' + font_size + 'px/' + line_height + 'px ' + font_family;
		
		this._default_font_config = this.getFontConfig();
	}
	
	
	Module.prototype.getFontConfig = function (font_size, line_height, font_style, font_family, fill_style) {
		//check CSS font for usage
		var font_size = font_size || this._default_font_size;
		var line_height = line_height || this._default_line_height;
		var font_style = font_style || this._default_font_style;
		var font_family = font_family || this._default_font_family;
		var fill_style = fill_style || this._default_fill_style;
		
		return {
			font_size: font_size,
			line_height: line_height,
			font_style: font_style,
			font_family: font_family,
			fill_style: fill_style,
			attribute: font_style + ' ' + font_size + 'px/' + line_height + 'px ' + font_family,
			
			cache_tag: font_style + '|' + font_size + '|' + line_height + '|' + font_family + '|' + fill_style,
		}
	}
	
	
	Module.prototype.getTextMeasureData = function (text, font_config) {
		var quick_context = GraphicOperation.getQuickContext();
		quick_context.font = font_config.attribute;
		var measured_width = quick_context.measureText(text).width;
		
		//Dr.log('[getTextMeasureData] measured_width', measured_width, font_config);
		
		return {
			text: text,
			width: measured_width,
			font_config: font_config,
		};
	}
	
	//with generated cache, intended to be used for single character
	Module.prototype.generateTextImageData = function (text_measure_data) {
		var text = text_measure_data.text;
		var font_attribute = text_measure_data.font_config.attribute;
		var font_fill_style = text_measure_data.font_config.fill_style;
		
		//Dr.log('[generateTextImageData]', text, font_attribute);
		
		//generate
		var generated_image_data_ext = ImageDataExt.create(ImageDataExt.type.CANVAS_ELEMENT, 
			text_measure_data.width, text_measure_data.font_config.line_height);
		
		var context = generated_image_data_ext.data.getContext('2d');
		context.font = font_attribute;
		context.textAlign = "start";
		context.textBaseline = "middle"; // better than 'top'
		context.fillStyle = font_fill_style;
		context.fillText(text, 0, text_measure_data.font_config.line_height * 0.5);
		
		this.generated[text] = this.generated[text] || {};
		this.generated[text][font_attribute] = generated_image_data_ext;
		
		//generated_image_data_ext.floodFill({x:0, y:0}, {r:0, g:255, b:0, a:255});
		
		return generated_image_data_ext;
	}
	
	
	
	
	
	Module.prototype.getGeneratedTextImageData = function (text, font_config) {
		if (this.generated[text] && this.generated[text][font_config.cache_tag]) {
			return this.generated[text][font_config.cache_tag];
		}
		else {
			return this.generateTextImageData(this.getTextMeasureData(text, font_config));
		}
	}
	
	Module.prototype.getCachedTextImageData = function (text, scale_ratio, font_config) {
		var font_config = font_config || this._default_font_config;
		var cache_key = text + '|' + font_config.cache_tag + '|' + scale_ratio;
		
		if (!this.cached[cache_key]) {
			Dr.debug(5, 'cache add', cache_key);
			var generated_symbol_image_data = this.getGeneratedTextImageData(text, font_config);
			var cache_image = ImageDataExt.copy(generated_symbol_image_data);
			cache_image.toCanvas();
			cache_image.scale(scale_ratio);
			this.cached[cache_key] = cache_image;
		}
		
		return this.cached[cache_key];
	}
	
	
	
	
	Module.prototype.forEachSymbol = function (text, scale_ratio, callback) {
		for (var index = 0; index < text.length; index++) {
			var symbol = text.charAt(index);
			var symbol_image_data = this.getCachedTextImageData(symbol, scale_ratio, font_config);
			callback(index, symbol, symbol_image_data);
		}
	}
	
	Module.prototype.autoMapping = function (text, scale_ratio, format_width, font_config, callback) {
		var scale_ratio = scale_ratio || 1;
		var format_width = format_width || 0;
		var font_config = font_config || this._default_font_config;
		var line_height = font_config.line_height * scale_ratio;
		
		var current_x = 0;
		var current_y = 0;
		var auto_increase_position = (function () {
			if (format_width > 0) return function (increase_x) { //limit width, height grow
				current_x += increase_x;
				if (current_x > format_width) {	//line break
					current_x = 0;
					current_y += line_height;
				}
			}
			else return function (increase_x) { //limit height, width grow ('\n' will cause height increase)
				current_x += increase_x;
			}
		})();
		
		
		for (var index = 0; index < text.length; index++) {
			var symbol = text.charAt(index);
			var symbol_image_data = this.getCachedTextImageData(symbol, scale_ratio, font_config);
			
			//send current position
			callback(index, symbol, symbol_image_data, current_x, current_y);
			
			//increase position
			switch (symbol) {
				case '\n':
				case '\r':
					current_x = 0;
					current_y += line_height;
					break;
				case '\t':
					auto_increase_position(symbol_image_data.width * 4);
					break;
				default:
					auto_increase_position(symbol_image_data.width);
					break;
			}
		}
		
		//stops at
		return {
			x: current_x,
			y: current_y,
		};
	}
	
	
	Module.prototype.getTextImageDataSize = function (text, scale_ratio, format_width, font_config) {
		var scale_ratio = scale_ratio || 1;
		var format_width = format_width || 0;
		var font_config = font_config || this._default_font_config;
		var line_height = font_config.line_height * scale_ratio;
		
		var result_width = 0;
		var result_height = 0;
		
		//calculate size
		this.autoMapping(text, scale_ratio, format_width, font_config, function (index, symbol, symbol_image_data, current_x, current_y) {
			result_width = Math.max(current_x + symbol_image_data.width, result_width);
			result_height = Math.max(current_y + line_height, result_height);
		})
		
		return {
			width: result_width,
			height: result_height,
		}
	}
	
	
	Module.prototype.getTextImageData = function (text, scale_ratio, format_width, font_config) {
		var scale_ratio = scale_ratio || 1;
		var format_width = format_width || 0;
		var font_config = font_config || this._default_font_config;
		var image_data_size = this.getTextImageDataSize(text, scale_ratio, format_width, font_config);
		
		var text_image_data_ext = ImageDataExt.create(ImageDataExt.type.CANVAS_ELEMENT, image_data_size.width, image_data_size.height);
		// text_image_data_ext.floodFill({x:0, y:0}, {r:255, g:0, b:255, a:255});
		// text_image_data_ext.toCanvas();
		var context = text_image_data_ext.data.getContext('2d');
		
		//draw symbol
		text_image_data_ext.text_end_position = this.autoMapping(text, scale_ratio, format_width, font_config, function (index, symbol, symbol_image_data, current_x, current_y) {
			symbol_image_data.draw(context, current_x, current_y);
		})
		
		return text_image_data_ext;
	}
	
	return Module;
});