//image generator

Dr.Declare('Mine_ImageStore', 'class');
Dr.Require('Mine_ImageStore', 'ImageDataExt');
Dr.Require('Mine_ImageStore', 'GraphicOperation');
Dr.Require('Mine_ImageStore', 'Mine_Type');
Dr.Implement('Mine_ImageStore', function (global, module_get) {
	
	var Module = function () {
		//
	}
	
	var ImageDataExt = Dr.Get('ImageDataExt');
	var GraphicOperation = Dr.Get('GraphicOperation');
	var Mine_Type = Dr.Get('Mine_Type');
	
	Module.type = Mine_Type.type;
	
	Module.typeImage = {
		//image type
		IMAGE_TYPE_BOX: 'IMAGE_TYPE_BOX',
		IMAGE_TYPE_HEX: 'IMAGE_TYPE_HEX',
		IMAGE_TYPE_TRI_UP: 'IMAGE_TYPE_TRI_UP',
		IMAGE_TYPE_TRI_DOWN: 'IMAGE_TYPE_TRI_DOWN',
	}
	
	Module.typeImageVariant = {
		//image sub type
		VARIANT_TYPE_INDICATOR: 'VARIANT_TYPE_INDICATOR',
		VARIANT_TYPE_NORMAL: 'VARIANT_TYPE_NORMAL',
		VARIANT_TYPE_PRESSED: 'VARIANT_TYPE_PRESSED',
		VARIANT_TYPE_FLIPPED: 'VARIANT_TYPE_FLIPPED',
	}
	
	Module.typeCenterColor = {
		//color
		VARIANT_TYPE_INDICATOR: [255, 255, 0],
		VARIANT_TYPE_NORMAL: [200, 200, 200],
		VARIANT_TYPE_PRESSED: [160, 100, 100, 80],
		VARIANT_TYPE_FLIPPED: [0, 0, 0],
	}
	
	Module.typeBorderColor = {
		//color
		VARIANT_TYPE_INDICATOR: [50, 50, 50],
		VARIANT_TYPE_NORMAL: [50, 50, 50],
		VARIANT_TYPE_PRESSED: [255, 50, 50, 60],
		VARIANT_TYPE_FLIPPED: [50, 50, 50],
	}
	
	Module.sourceTagImage = {
		//image(tag image)
		TAG_IMAGE_NUMBER_1: 	'gAAAAMCAYAAABfnvydAAAAP0lEQVQYV2NkQALfGRj+g7icDAyMMGE4A1khMpsRWRdWEwgqwGU0VjcQdCRBBdisQ/EmQRMIKsBqBa5wgIkDAK7cGAOaCe0dAAAAAElFTkSuQmCC',
		TAG_IMAGE_NUMBER_2: 	'gAAAAMCAYAAABfnvydAAAAQElEQVQYV2P8zsDwn4GBgYGTgYERmQ0SAwFGGAMXjVMBzDTyFcDdgMuRcCsIKiDoC2x+R9aENXBQFJBkBTYHAwABKx3bUtOfLAAAAABJRU5ErkJggg==',
		TAG_IMAGE_NUMBER_3: 	'gAAAAMCAYAAABfnvydAAAAOElEQVQYV2P8zsDwn4GBgYGTgYERG5sRJIkP4FQAM418BTBrUUwg6EiCCrD5hnxHEvQm3BeEghoAH9UbveyX9S4AAAAASUVORK5CYII=',
		TAG_IMAGE_NUMBER_4: 	'gAAAAMCAYAAABfnvydAAAAQ0lEQVQYV2P8zsDwn4GBgYGTgYERRMMATBxFEFkBjM1I0ASCCrAZiyyGYgWyaXBHYhME+Yh4X+ByA0ETCCqABxQhKwDuwR29bm8/SAAAAABJRU5ErkJggg==',
		TAG_IMAGE_NUMBER_5: 	'gAAAAMCAYAAABfnvydAAAAPElEQVQYV2P8zsDwn4GBgYGTgYERG5sRJIkPoOjCppCwApKswOpIyn2Byw0wk3GGA0EFMJOxBi8o2GEKANiTHduKm9JEAAAAAElFTkSuQmCC',
		TAG_IMAGE_NUMBER_6: 	'gAAAAMCAYAAABfnvydAAAAOUlEQVQYV2NkQALfGRj+g7icDAyMMDYjsgJsbLhKkC7yFJBkBVZHYhOkji/g4YBsBbZAIy2gsDkYAJXnIdHZvL6kAAAAAElFTkSuQmCC',
		TAG_IMAGE_NUMBER_7: 	'gAAAAMCAYAAABfnvydAAAAMUlEQVQYV2P8zsDwn4GBgYGTgYERG5sRJIkP4FQAM418BTBrUUxAdiR5CrD5ZjBYAQAreRPvI30nqQAAAABJRU5ErkJggg==',
		TAG_IMAGE_NUMBER_8: 	'gAAAAMCAYAAABfnvydAAAALElEQVQYV2P8zsDwn4GBgYGTgYERG5sRJIkPoOhCVggzjbACkqzA6shh4QsADosnvdsrZicAAAAASUVORK5CYII=',
		TAG_IMAGE_NUMBER_9: 	'gAAAAMCAYAAABfnvydAAAAOklEQVQYV2P8zsDwn4GBgYGTgYERG5sRJIkPoOhCVggzjbACkqzA6kjKfYHLDXBfkK0AphFr8CIHOwBLDSO9aYo84QAAAABJRU5ErkJggg==',
		TAG_IMAGE_NUMBER_10: 	'wAAAAMCAYAAABWdVznAAAASklEQVQoU2NkgILvDAz/QUxOBgZGdDEYHyQHl4QJEqIZQSaDdKLbgItPugZCTkCXx/AgzNM4nYQrlAhqINZpg9FJ2CIOXQw5aQAA+1kz0c6VyYIAAAAASUVORK5CYII=',
		TAG_IMAGE_NUMBER_11: 	'wAAAAMCAYAAABWdVznAAAARUlEQVQoU2NkgILvDAz/QUxOBgZGmBiIRhdHkURWiIvNCDIBZCq6SbjESddAjDOQ1cD9QLKnSdZArNMGo5OwRRByAKCzAbz6LgOYcNLJAAAAAElFTkSuQmCC',
		TAG_IMAGE_NUMBER_12: 	'wAAAAMCAYAAABWdVznAAAAT0lEQVQoU2NkgILvDAz/QUxOBgZGEA3ig9jo4mBJUgDYBGwmYTMEpJZ0DaQ4B6QW7gdiPA12EimhhKKBWKcRtAHdIPI1EO0kbBGHHGLobADO8DPb86qTRgAAAABJRU5ErkJggg==',
		TAG_IMAGE_MARK_EMPTY: 	'wAAAAMCAYAAABWdVznAAAAT0lEQVQoU2OcycDwn4GBgSGdgYERROMCMHWMMAY+TchqwKbi04QuB3cGNk3YxFDcjawA2S/I/sPwKLom9MCgTANJTiLJ0yQFK8kRR2rSAACV6iZtj6T9ZgAAAABJRU5ErkJggg==',
		TAG_IMAGE_MARK_LOCK: 	'wAAAAOCAYAAAAbvf3sAAAAV0lEQVQoU2NkQAX/0fgwLiMGg4GB4f+rV6+wqhcTEwOJgzXBdIIVQyUwNCHJMWLTALceqhPZMDppwBUyWAMA5N7/6enpOEITVXjmzJngUBqZGogKIqgiAMTwPgfUTtJqAAAAAElFTkSuQmCC',
		TAG_IMAGE_MARK_FLAG: 	'sAAAAOCAYAAAD5YeaVAAAAVklEQVQoU8WSQRIAEAwD408e2Af6E9MDgpQjpwy7DmkT5qmUE+UR+bLCCmC5Px7CCTsaCBoOhBgWwh3ehDdMwgqrvoI+e8+yY3fUzx9h3ovruBUo96gBKbkaDbc3xaQAAAAASUVORK5CYII=',
		TAG_IMAGE_MARK_MINE: 	'4AAAAOCAYAAAAfSC3RAAAAc0lEQVQoU51SQQ7AIAirx/3/sTtqMKlB1rpETwq2lEKDOS/QH6C5/EyoTw7I+GLMH+OeK0VlxqhiAzpZjGfpWw+1UiWSwJO8KjveUmpmdipW00qWAl2ZE+QfIOd5cvbaVVkxD1g5XDfMrtzfKtoldkB6MAC9tTIFFrl5+AAAAABJRU5ErkJggg==',
		TAG_IMAGE_FACE_COOL: 	'4AAAALCAYAAABPhbxiAAAASUlEQVQoU2NkYGD4z0AGYMSjESQHAlgNHhiN2JwDcybM9+jOZURXQHQwUawR5BRiDQGrRVZMjGa4GmyBgMtmFIOxKcKVklDUAgBnsxAITW12JwAAAABJRU5ErkJggg==',
		TAG_IMAGE_FACE_SMILE: 	'wAAAAKCAYAAACALL/6AAAAPklEQVQYV2NkgID/UBpEMSKxMeRgkrTXgOYK3Fx09xLUSJYGkIeJ1fgfOZQIaQIbjKwIn01wOXyRhBwAcHUA1R0NCka+3DoAAAAASUVORK5CYII=',
		TAG_IMAGE_FACE_OOPS: 	'oAAAAKCAYAAACNMs+9AAAAQ0lEQVQYV2NkgID/DAwMjFA2OgWWA0mCGDCArhguB5MgykQcNqIKY3MXzDoUOWxuwuocZIXY3AkXI0shenii2EC0ZwD2gBAKYHntKQAAAABJRU5ErkJggg==',
		TAG_IMAGE_FACE_DIE: 	'wAAAALCAYAAABLcGxfAAAASElEQVQoU2NkYGD4z8DAwMiAAMh8DDmYQpgEugKQMShyuExGshDMhBtElg1k+QHdCTj5yH4gShPFGkD+wQbgBlMcrPj8AQ5NAHwFFwpuPDIVAAAAAElFTkSuQmCC',
	}
	
	
	Module.configImageGenerate = {
		//image type
		IMAGE_TYPE_BOX: {
			size: [22, 22],
			point_list: [
				[0, 2], [2, 0],
				[19, 0], [21, 2],
				[21, 19], [19, 21],
				[2, 21], [0, 19],
			],
		},
		IMAGE_TYPE_HEX: {
			size: [26, 24],
			point_list: [
				[6, 1], [7, 0],
				[18, 0], [19, 1],
				[25, 10], [25, 13],
				[19, 22], [18, 23],
				[7, 23], [6, 22],
				[0, 13], [0, 10],
			],
		},
		IMAGE_TYPE_TRI_UP: {
			size: [34, 30],
			point_list: [
				[15, 2], [18, 2],
				[31, 27], [30, 29],
				[3, 29], [2, 27],
			],
		},
		IMAGE_TYPE_TRI_DOWN: {
			size: [34, 30],
			point_list: [
				[18, 27], [15, 27],
				[2, 1], [3, 0],
				[30, 0], [31, 1],
			],
		},
	}
	
	Module.prototype.init = function (callback) {
		this._callback = callback;
		this._all_done = false;
		this._all_out = false;
		this._item_pending = 0;
		
		this.cached = {};
		
		this.generated = this.generateImageData();
		
		this._all_out = true;
		this.checkFinish();
	}
	
	Module.prototype.checkFinish = function () {
		if (this._all_out == true && this._item_pending == 0) {
			this._all_done = true;
			if (this._callback) this._callback(this);
		}
	}
	
	function approach (point, center, scalar) {
		var dx = center.x - point.x;
		var dy = center.y - point.y;
		var dist = Math.sqrt(dx * dx + dy * dy);
		if (dist == 0) return point;
		else return {
			x: point.x + dx / dist * scalar,
			y: point.y + dy / dist * scalar,
		};
	}
	function fade (color, target, ratio) {
		var calc = function (a, b, k) { return Math.round(a == b ? a : (a + (b - a) * k)); }
		return {
			r: calc(color.r, target.r, ratio), 
			g: calc(color.g, target.g, ratio), 
			b: calc(color.b, target.b, ratio), 
			a: calc(color.a, target.a, ratio), 
		};
	}
	
	function arrayToPoint (array) {
		return {
			x: array[0], 
			y: array[1],
		};
	}
	function arrayToSize (array) {
		return {
			width: array[0], 
			height: array[1],
		};
	}
	function arrayToColor (array) {
		return {
			r: array[0], 
			g: array[1],
			b: array[2],
			a: array[3] == undefined ? 255 : array[3],
		};
	}
	
	Module.prototype.generateImageData = function () {
		var generated = {};
		
		for (var image_type in Module.configImageGenerate) {
			var config = Module.configImageGenerate[image_type];
			generated[image_type] = {};
			
			//calc center point
			var center_point_x = 0, center_point_y = 0;
			for (var i in config.point_list) {
				center_point_x += config.point_list[i][0] / config.point_list.length;
				center_point_y += config.point_list[i][1] / config.point_list.length;
			}
			var center_point = {x: center_point_x, y: center_point_y};
			
			//process data
			var draw_process_data = [];
			var process_count = 4;
			
			for (var i = 0; i < process_count; i ++) {
				var point_list = [];
				for (var index in config.point_list) point_list.push(approach(arrayToPoint(config.point_list[index]), center_point, i));
				draw_process_data.push(point_list);
			}
			
			for (var variant_type in Module.typeImageVariant) {
				var center_color = arrayToColor(Module.typeCenterColor[variant_type]);
				var border_color = arrayToColor(Module.typeBorderColor[variant_type]);
				
				Dr.log('[generateImageData]', variant_type, center_color);
				var generated_image_data_ext = ImageDataExt.create(ImageDataExt.type.CANVAS_ELEMENT, config.size[0], config.size[1]);
				
				//record
				generated_image_data_ext.image_type = image_type;
				generated_image_data_ext.variant_type = variant_type;
				generated_image_data_ext.center_point = center_point;
				
				for (var index in draw_process_data) {
					var apply_color = fade(center_color, border_color, (process_count - index - 1) / process_count);
					var point_list = draw_process_data[index];
					
					generated_image_data_ext.toCanvasImageData();
					
					GraphicOperation.drawPixelLineList(generated_image_data_ext.data, point_list, apply_color, true);
					GraphicOperation.floodFill(generated_image_data_ext.data, center_point, apply_color);
				}
				
				//important! canvas will mix alpha 
				generated_image_data_ext.toCanvas();
				
				generated[image_type][variant_type] = generated_image_data_ext;
			}
		}
		
		//tag image
		for (var image_type in Module.sourceTagImage) {
			var image_source = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA' + Module.sourceTagImage[image_type];
			
			(function (_this) {
				var _image_source = image_source;
				var _image_type = image_type;
				_this._item_pending ++;
				Dr.loadImage(_image_source , function (image_element) {
					generated[_image_type] = new ImageDataExt;
					generated[_image_type].init('local', image_element, ImageDataExt.type.IMAGE_ELEMENT);
					
					_this._item_pending --;
					_this.checkFinish();
				});
			})(this);
		};
		
		return generated;
	}
	
	
	Module.prototype.getImageData = function (image_type, variant_type, tag_image_type, scale_ratio) {
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
	
	
	Module.prototype.getRandomImageData = function () {
		var getRandomKey = function (map) {
			var key_count = 0;
			var key_list = [];
			for (var key in map) { key_count++; key_list.push(key); }
			return key_list[Dr.getRandomInt(0, key_count - 1)];
		}
		return this.getImageData(
			getRandomKey(Module.typeImage), 
			getRandomKey(Module.typeImageVariant), 
			getRandomKey(Module.sourceTagImage), 
			Dr.getRandomInt(1, 5));
	}
	
	Module.prototype.getBlockImageSizeByType = function (block_type) {
		switch (block_type) {
			case Module.type.BOX:
				return arrayToSize(Module.configImageGenerate.IMAGE_TYPE_BOX.size);
				break;
			case Module.type.HEX:
				return arrayToSize(Module.configImageGenerate.IMAGE_TYPE_HEX.size);
				break;
			case Module.type.TRI:
				return arrayToSize(Module.configImageGenerate.IMAGE_TYPE_TRI_UP.size);
				break;
			default:
				Dr.assert(false, '[getBlockImageSizeByType] error type', block_type);
				break;
		}
	}
	
	return Module;
});