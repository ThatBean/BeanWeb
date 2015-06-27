//the map for drawing

Dr.Declare('Mine_Grid', 'class');
Dr.Require('Mine_Grid', 'Mine_Type');
//Dr.Require('Mine_Grid', 'Mine_Map');
Dr.Require('Mine_Grid', 'CanvasExt');
Dr.Require('Mine_Grid', 'Mine_ImageStore');
Dr.Implement('Mine_Grid', function (global, module_get) {
	
	var Module = function () {
		//
	}
	
	var Mine_Type = Dr.Get('Mine_Type');
	//var Mine_Map = Dr.Get('Mine_Map');
	var CanvasExt = Dr.Get('CanvasExt');
	var Mine_ImageStore = Dr.Get('Mine_ImageStore');
	
	Module.type = Mine_Type.type;
	
	
	Module.prototype.init = function (canvas_ext, map, scale) {
		this._canvas_ext = canvas_ext;
		this._map = map;
		this._scale = scale || 1;
		
		this._block_type = map.block_type;
		this._map_row_count = map.row_count;
		this._map_col_count = map.col_count;
		
		this._visible_width = canvas_ext.width;
		this._visible_height = canvas_ext.height;
		
		// top left == (0 ,0), for scroll
		this._visible_offset_top = 0;
		this._visible_offset_left = 0;
		
		var _this = this;
		var on_event_callback =  function (event_key, action) { _this.onAction(event_key, action); };
		this._canvas_ext.getEventCenter().addEventListener('action_move', on_event_callback);
		this._canvas_ext.getEventCenter().addEventListener('action_start', on_event_callback);
		this._canvas_ext.getEventCenter().addEventListener('action_end', on_event_callback);
		this._canvas_ext.getEventCenter().addEventListener('action_cancel', on_event_callback);
		
		this.initImageData();
	}
	
	Module.prototype.initImageData = function () {
		// TODO
		// TODO
		this._image_store = new Mine_ImageStore;
		this._image_store.init();
		
		this._block_width = 10;//image_store.width;
		this._block_height = 10;//image_store.height;
		
		//calculated value
		this._total_width = (this._block_width / Mine_Type.fragSizeBlock[this._block_type][0] * Mine_Type.fragSizeCondensedBlock[this._block_type][0]) 
				* (this._map_row_count * Mine_Type.sizeAdjustment[this._block_type].row[0] + Mine_Type.sizeAdjustment[this._block_type].row[1]);
		this._total_height = (this._block_height / Mine_Type.fragSizeBlock[this._block_type][1] * Mine_Type.fragSizeCondensedBlock[this._block_type][1]) 
				* (this._map_col_count * Mine_Type.sizeAdjustment[this._block_type].col[0] + Mine_Type.sizeAdjustment[this._block_type].col[1]);
		
		// TODO
		// TODO
		// TODO
	}
	
	Module.prototype.drawBlock = function (block) {
		
	}
	
	Module.prototype.onAction = function (event_key, action) {
		
		action.event.preventDefault();
		
		Dr.UpdateLoop.add(function (delta_time) { 
			Dr.log('Get', event_key, action.position_listener.x, action.position_listener.y);
		});
	}
	
	return Module;
});



//image generator

Dr.Declare('Mine_ImageStore', 'class');
Dr.Require('Mine_ImageStore', 'Mine_Type');
Dr.Require('Mine_ImageStore', 'ImageDataExt');
Dr.Implement('Mine_ImageStore', function (global, module_get) {
	
	var Module = function () {
		//
	}
	
	var Mine_Type = Dr.Get('Mine_Type');
	var ImageDataExt = Dr.Get('ImageDataExt');
	
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
		VARIANT_TYPE_BLOCK_NORMAL: 'VARIANT_TYPE_BLOCK_NORMAL',
		VARIANT_TYPE_BLOCK_PRESSED: 'VARIANT_TYPE_BLOCK_PRESSED',
		VARIANT_TYPE_BLOCK_EMPTY: 'VARIANT_TYPE_BLOCK_EMPTY',
	}
	
	Module.typeBackground = {
		//background type
		VARIANT_TYPE_INDICATOR: 'BACKGROUND_TYPE_INDICATOR',
		VARIANT_TYPE_BLOCK_NORMAL: 'BACKGROUND_TYPE_BLOCK_NORMAL',
		VARIANT_TYPE_BLOCK_PRESSED: 'BACKGROUND_TYPE_BLOCK_PRESSED',
		VARIANT_TYPE_BLOCK_EMPTY: 'BACKGROUND_TYPE_BLOCK_EMPTY',
	}
	
	Module.typeColor = {
		//color
		VARIANT_TYPE_INDICATOR: [255, 255, 0],
		VARIANT_TYPE_BLOCK_NORMAL: [200, 200, 200],
		VARIANT_TYPE_BLOCK_PRESSED: [160, 160, 160],
		VARIANT_TYPE_BLOCK_EMPTY: [120, 0, 0],
	}
	
	Module.sourceTagImage = {
		//image(tag image)
		TAG_IMAGE_NUMBER_1: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAMCAYAAABfnvydAAAAP0lEQVQYV2NkQALfGRj+g7icDAyMMGE4A1khMpsRWRdWEwgqwGU0VjcQdCRBBdisQ/EmQRMIKsBqBa5wgIkDAK7cGAOaCe0dAAAAAElFTkSuQmCC',
		TAG_IMAGE_NUMBER_2: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAMCAYAAABfnvydAAAAQElEQVQYV2P8zsDwn4GBgYGTgYERmQ0SAwFGGAMXjVMBzDTyFcDdgMuRcCsIKiDoC2x+R9aENXBQFJBkBTYHAwABKx3bUtOfLAAAAABJRU5ErkJggg==',
		TAG_IMAGE_NUMBER_3: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAMCAYAAABfnvydAAAAOElEQVQYV2P8zsDwn4GBgYGTgYERG5sRJIkP4FQAM418BTBrUUwg6EiCCrD5hnxHEvQm3BeEghoAH9UbveyX9S4AAAAASUVORK5CYII=',
		TAG_IMAGE_NUMBER_4: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAMCAYAAABfnvydAAAAQ0lEQVQYV2P8zsDwn4GBgYGTgYERRMMATBxFEFkBjM1I0ASCCrAZiyyGYgWyaXBHYhME+Yh4X+ByA0ETCCqABxQhKwDuwR29bm8/SAAAAABJRU5ErkJggg==',
		TAG_IMAGE_NUMBER_5: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAMCAYAAABfnvydAAAAPElEQVQYV2P8zsDwn4GBgYGTgYERG5sRJIkPoOjCppCwApKswOpIyn2Byw0wk3GGA0EFMJOxBi8o2GEKANiTHduKm9JEAAAAAElFTkSuQmCC',
		TAG_IMAGE_NUMBER_6: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAMCAYAAABfnvydAAAAOUlEQVQYV2NkQALfGRj+g7icDAyMMDYjsgJsbLhKkC7yFJBkBVZHYhOkji/g4YBsBbZAIy2gsDkYAJXnIdHZvL6kAAAAAElFTkSuQmCC',
		TAG_IMAGE_NUMBER_7: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAMCAYAAABfnvydAAAAMUlEQVQYV2P8zsDwn4GBgYGTgYERG5sRJIkP4FQAM418BTBrUUxAdiR5CrD5ZjBYAQAreRPvI30nqQAAAABJRU5ErkJggg==',
		TAG_IMAGE_NUMBER_8: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAMCAYAAABfnvydAAAALElEQVQYV2P8zsDwn4GBgYGTgYERG5sRJIkPoOhCVggzjbACkqzA6shh4QsADosnvdsrZicAAAAASUVORK5CYII=',
		TAG_IMAGE_NUMBER_9: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAMCAYAAABfnvydAAAAOklEQVQYV2P8zsDwn4GBgYGTgYERG5sRJIkPoOhCVggzjbACkqzA6kjKfYHLDXBfkK0AphFr8CIHOwBLDSO9aYo84QAAAABJRU5ErkJggg==',
		TAG_IMAGE_NUMBER_10: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAASklEQVQoU2NkgILvDAz/QUxOBgZGdDEYHyQHl4QJEqIZQSaDdKLbgItPugZCTkCXx/AgzNM4nYQrlAhqINZpg9FJ2CIOXQw5aQAA+1kz0c6VyYIAAAAASUVORK5CYII=',
		TAG_IMAGE_NUMBER_11: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAARUlEQVQoU2NkgILvDAz/QUxOBgZGmBiIRhdHkURWiIvNCDIBZCq6SbjESddAjDOQ1cD9QLKnSdZArNMGo5OwRRByAKCzAbz6LgOYcNLJAAAAAElFTkSuQmCC',
		TAG_IMAGE_NUMBER_12: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAT0lEQVQoU2NkgILvDAz/QUxOBgZGEA3ig9jo4mBJUgDYBGwmYTMEpJZ0DaQ4B6QW7gdiPA12EimhhKKBWKcRtAHdIPI1EO0kbBGHHGLobADO8DPb86qTRgAAAABJRU5ErkJggg==',
		TAG_IMAGE_MARK_EMPTY: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAT0lEQVQoU2OcycDwn4GBgSGdgYERROMCMHWMMAY+TchqwKbi04QuB3cGNk3YxFDcjawA2S/I/sPwKLom9MCgTANJTiLJ0yQFK8kRR2rSAACV6iZtj6T9ZgAAAABJRU5ErkJggg==',
		TAG_IMAGE_MARK_LOCK: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAOCAYAAAAbvf3sAAAAV0lEQVQoU2NkQAX/0fgwLiMGg4GB4f+rV6+wqhcTEwOJgzXBdIIVQyUwNCHJMWLTALceqhPZMDppwBUyWAMA5N7/6enpOEITVXjmzJngUBqZGogKIqgiAMTwPgfUTtJqAAAAAElFTkSuQmCC',
		TAG_IMAGE_MARK_FLAG: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAOCAYAAAD5YeaVAAAAVklEQVQoU8WSQRIAEAwD408e2Af6E9MDgpQjpwy7DmkT5qmUE+UR+bLCCmC5Px7CCTsaCBoOhBgWwh3ehDdMwgqrvoI+e8+yY3fUzx9h3ovruBUo96gBKbkaDbc3xaQAAAAASUVORK5CYII=',
		TAG_IMAGE_FACE_COOL: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAALCAYAAABPhbxiAAAASUlEQVQoU2NkYGD4z0AGYMSjESQHAlgNHhiN2JwDcybM9+jOZURXQHQwUawR5BRiDQGrRVZMjGa4GmyBgMtmFIOxKcKVklDUAgBnsxAITW12JwAAAABJRU5ErkJggg==',
		TAG_IMAGE_FACE_SMILE: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAKCAYAAACALL/6AAAAPklEQVQYV2NkgID/UBpEMSKxMeRgkrTXgOYK3Fx09xLUSJYGkIeJ1fgfOZQIaQIbjKwIn01wOXyRhBwAcHUA1R0NCka+3DoAAAAASUVORK5CYII=',
		TAG_IMAGE_FACE_OOPS: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAQ0lEQVQYV2NkgID/DAwMjFA2OgWWA0mCGDCArhguB5MgykQcNqIKY3MXzDoUOWxuwuocZIXY3AkXI0shenii2EC0ZwD2gBAKYHntKQAAAABJRU5ErkJggg==',
		TAG_IMAGE_FACE_DIE: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAALCAYAAABLcGxfAAAASElEQVQoU2NkYGD4z8DAwMiAAMh8DDmYQpgEugKQMShyuExGshDMhBtElg1k+QHdCTj5yH4gShPFGkD+wQbgBlMcrPj8AQ5NAHwFFwpuPDIVAAAAAElFTkSuQmCC',
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
			size: [30, 28],
			point_list: [
				[13, 0], [16, 0],
				[29, 25], [28, 27],
				[1, 27], [0, 25],
			],
		},
		IMAGE_TYPE_TRI_DOWN: {
			size: [30, 28],
			point_list: [
				[16, 27], [13, 27],
				[0, 1], [1, 0],
				[28, 0], [29, 1],
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
	
	Module.prototype.generateImageData = function () {
		var generated = {};
		
		for (var image_type in Module.configImageGenerate) {
			var config = Module.configImageGenerate[image_type];
			generated[image_type] = {};
			
			var center_point_x = 0, center_point_y = 0;
			for (var i in config.point_list) {
				center_point_x += config.point_list[i][0] / config.point_list.length;
				center_point_y += config.point_list[i][1] / config.point_list.length;
			}
			var center_point = {x: center_point_x, y: center_point_y};
			
			var generated_point_list = [];
			for (var i in config.point_list) generated_point_list.push(ImageDataExt.arrayToPoint(config.point_list[i]));
			
			var generated_point_list_1 = [];
			for (var i in config.point_list) generated_point_list_1.push(approach(ImageDataExt.arrayToPoint(config.point_list[i]), center_point, 1));
			
			var generated_point_list_2 = [];
			for (var i in config.point_list) generated_point_list_2.push(approach(ImageDataExt.arrayToPoint(config.point_list[i]), center_point, 2));
			
			for (var variant_type in Module.typeImageVariant) {
				var background = Module.typeBackground[variant_type];
				var color = ImageDataExt.arrayToColor(Module.typeColor[variant_type]);
				var target_color = {r: 50, g: 50, b: 50, a: 255};
				
				Dr.log('[generateImageData]', background, color);
				var generated_image_data_ext = ImageDataExt.create(ImageDataExt.type.CANVAS_ELEMENT, config.size[0], config.size[1]);
				
				//record
				generated_image_data_ext.image_type = image_type;
				generated_image_data_ext.variant_type = variant_type;
				generated_image_data_ext.center_point = center_point;
				
				var apply_color = fade(color, target_color, 0.5);
				generated_image_data_ext.drawPixelLineList(generated_point_list, apply_color, true);
				generated_image_data_ext.floodFill(center_point, apply_color);
				
				var apply_color = fade(color, target_color, 0.3);
				generated_image_data_ext.drawPixelLineList(generated_point_list_1, apply_color, true);
				generated_image_data_ext.floodFill(center_point, apply_color);
				
				var apply_color = fade(color, target_color, 0.1);
				generated_image_data_ext.drawPixelLineList(generated_point_list_2, apply_color, true);
				generated_image_data_ext.floodFill(center_point, apply_color);
				
				//important! canvas will mix alpha 
				generated_image_data_ext.toCanvas();
				
				generated[image_type][variant_type] = generated_image_data_ext;
			}
		}
		
		//tag image
		for (var image_type in Module.sourceTagImage) {
			var image_source = Module.sourceTagImage[image_type];
			
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
			var base_image_data_ext = this.generated[image_type][variant_type];
			var tag_image_data_ext = this.generated[tag_image_type];
			
			Dr.debug(5, 'cache add', image_type, variant_type, tag_image_type);
			
			var cache_image = ImageDataExt.copy(base_image_data_ext);
			cache_image.toCanvas();
			
			tag_image_data_ext.draw(cache_image.data.getContext('2d'), 
				base_image_data_ext.center_point.x - tag_image_data_ext.width * 0.5, 
				base_image_data_ext.center_point.y - tag_image_data_ext.height * 0.5);
			
			cache_image.scale(scale_ratio);
			
			this.cached[cache_key] = cache_image;
		}
		
		return this.cached[cache_key];
		
		image_store.generated.IMAGE_TYPE_BOX.VARIANT_TYPE_INDICATOR.draw(Dr.main_context, 50, 200);
	}
	
	return Module;
});