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
	}
	
	
	
	Module.prototype.getTextFontAttributeData = function (text, font_size, font_style, font_family) {
		//check CSS font for usuage
		
		// var font_size = 8;
		// var font_style = 'bold';
		// var font_family = 'monaco, consolas, monospace';
		
		var font_attribute = font_style + ' ' + font_size + 'px ' + font_family;
		
		var quick_context = ImageDataExt.getQuickContext();
		quick_context.font = font_attribute;
		// quick_context.textAlign = "right";
		// quick_context.textBaseline = "top";
		// quick_context.fillStyle = "#000";
		
		return {
			attribute: font_attribute,
			height: font_size,
			width: quick_context.measureText(text).width,
		};
	}
	
	
	
	Module.prototype.generateSymbolImageData = function (symbol, font_size, font_attribute_data) {
		
		Dr.log('[generateImageData]', variant_type, center_color);
		
		var quick_context = ImageDataExt.getQuickContext();
		
		quick_context.font = font_attribute_data.attribute;
		quick_context.textAlign = "right";
		quick_context.textBaseline = "top";
		quick_context.fillStyle = "#000";
		
		var symbol_height = font_size;
		var symbol_width = quick_context.measureText(symbol).width;
		
		//generate
		var generated_image_data_ext = ImageDataExt.create(ImageDataExt.type.CANVAS_ELEMENT, font_attribute_data.height, font_attribute_data.width);
		
		var context = generated_image_data_ext.data.getContext('2d');
		context.font = font_attribute;
		context.textAlign = "right";
		context.textBaseline = "top";
		context.fillStyle = "#000";
		context.fillText(symbol, 0, 0);
		
		//record
		generated_image_data_ext.symbol = symbol;
		generated_image_data_ext.variant_type = variant_type;
		generated_image_data_ext.center_point = center_point;
		
		//important! canvas will mix alpha 
		generated_image_data_ext.toCanvas();
		
		this.generated[symbol] = this.generated[symbol] || {};
		this.generated[symbol][font_attribute] = generated_image_data_ext;
		
		return generated_image_data_ext;
	}
	
	
	Module.prototype.getTextImageData = function (image_type, variant_type, tag_image_type, scale_ratio) {
		var scale_ratio = scale_ratio || 1;
		var cache_key = image_type + '|' + variant_type + '|' + tag_image_type + '|' + scale_ratio;
		if (!this.cached[cache_key]) {
			Dr.debug(5, 'cache add', image_type, variant_type, tag_image_type);
			
			var base_image_data_ext = this.generated[image_type][variant_type];
			var cache_image = ImageDataExt.copy(base_image_data_ext);
			cache_image.toCanvas();
			
			if (tag_image_type) {
				var tag_image_data_ext = this.generated[tag_image_type];
				//Dr.assert(tag_image_data_ext, 'Error tag_image_type', tag_image_type);
				tag_image_data_ext.draw(
					cache_image.data.getContext('2d'), 
					base_image_data_ext.center_point.x - tag_image_data_ext.width * 0.5, 
					base_image_data_ext.center_point.y - tag_image_data_ext.height * 0.5);
			}
			
			cache_image.scale(scale_ratio);
			
			this.cached[cache_key] = cache_image;
		}
		
		return this.cached[cache_key];
	}
	
	Module.prototype.getSymbolImageData = function (symbol, variant_type, tag_image_type,  ) {
		var scale_ratio = scale_ratio || 1;
		var cache_key = image_type + '|' + variant_type + '|' + tag_image_type + '|' + scale_ratio;
		if (!this.cached[cache_key]) {
			Dr.debug(5, 'cache add', image_type, variant_type, tag_image_type);
			
			var base_image_data_ext = this.generated[image_type][variant_type];
			var cache_image = ImageDataExt.copy(base_image_data_ext);
			cache_image.toCanvas();
			
			if (tag_image_type) {
				var tag_image_data_ext = this.generated[tag_image_type];
				//Dr.assert(tag_image_data_ext, 'Error tag_image_type', tag_image_type);
				tag_image_data_ext.draw(
					cache_image.data.getContext('2d'), 
					base_image_data_ext.center_point.x - tag_image_data_ext.width * 0.5, 
					base_image_data_ext.center_point.y - tag_image_data_ext.height * 0.5);
			}
			
			cache_image.scale(scale_ratio);
			
			this.cached[cache_key] = cache_image;
		}
		
		return this.cached[cache_key];
	}
	
	return Module;
});