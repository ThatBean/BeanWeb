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
		this._image_store.init(this._scale);
		
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
		VARIANT_TYPE_BLOCK_EMPTY: [150, 0, 0],
	}
	
	Module.typeTagImage = {
		//image(tag image)
		TAG_IMAGE_NUMBER_1: 'TAG_IMAGE_NUMBER_1',
		TAG_IMAGE_NUMBER_2: 'TAG_IMAGE_NUMBER_2',
		TAG_IMAGE_NUMBER_3: 'TAG_IMAGE_NUMBER_3',
		TAG_IMAGE_NUMBER_4: 'TAG_IMAGE_NUMBER_4',
		TAG_IMAGE_NUMBER_5: 'TAG_IMAGE_NUMBER_5',
		TAG_IMAGE_NUMBER_6: 'TAG_IMAGE_NUMBER_6',
		TAG_IMAGE_NUMBER_7: 'TAG_IMAGE_NUMBER_7',
		TAG_IMAGE_NUMBER_8: 'TAG_IMAGE_NUMBER_8',
		TAG_IMAGE_NUMBER_9: 'TAG_IMAGE_NUMBER_9',
		TAG_IMAGE_NUMBER_10: 'TAG_IMAGE_NUMBER_10',
		TAG_IMAGE_NUMBER_11: 'TAG_IMAGE_NUMBER_11',
		TAG_IMAGE_NUMBER_12: 'TAG_IMAGE_NUMBER_12',
		TAG_IMAGE_MARK_EMPTY: 'TAG_IMAGE_MARK_EMPTY',
		TAG_IMAGE_MARK_LOCK: 'TAG_IMAGE_MARK_LOCK',
		TAG_IMAGE_MARK_FLAG: 'TAG_IMAGE_MARK_FLAG',
		TAG_IMAGE_FACE_COOL: 'TAG_IMAGE_FACE_COOL',
		TAG_IMAGE_FACE_SMILE: 'TAG_IMAGE_FACE_SMILE',
		TAG_IMAGE_FACE_OOPS: 'TAG_IMAGE_FACE_OOPS',
		TAG_IMAGE_FACE_DIE: 'TAG_IMAGE_FACE_DIE',
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
			tag_image_center: [11, 11],	// for tag image location
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
			tag_image_center: [13, 12],	// for tag image location
		},
		IMAGE_TYPE_TRI_UP: {
			size: [30, 28],
			point_list: [
				[13, 0], [16, 0],
				[29, 25], [28, 27],
				[1, 27], [0, 25],
			],
			tag_image_center: [15, 5],	// for tag image location
		},
		IMAGE_TYPE_TRI_DOWN: {
			size: [30, 28],
			point_list: [
				[16, 27], [13, 27],
				[0, 1], [1, 0],
				[28, 0], [29, 1],
			],
			tag_image_center: [15, 22],	// for tag image location
		},
	}
	
	Module.prototype.init = function (scale) {
		this._scale = scale || 1;
		
		this.generated_image_data_tree = this.generateImageData();
	}
	
	function approach (point, center, dist) {
		var calc = function (a, b, k) { return Math.round(a == b ? a : (a + (b - a) / Math.abs(b - a) * k)); }
		return {
			x: calc(point.x, center.x, dist),
			y: calc(point.y, center.y, dist),
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
		var canvas_element = Dr.document.createElement('canvas');
		var canvas_context = canvas_element.getContext('2d');
		
		var generated_image_data_tree = {};
		
		for (var image_type in Module.configImageGenerate) {
			var config = Module.configImageGenerate[image_type];
			generated_image_data_tree[image_type] = {};
			
			var center_point = ImageDataExt.arrayToPoint(config.tag_image_center);
			
			var generated_point_list = [];
			for (var i in config.point_list) generated_point_list.push(ImageDataExt.arrayToPoint(config.point_list[i]));
			
			var generated_point_list_1 = [];
			for (var i in config.point_list) generated_point_list_1.push(approach(ImageDataExt.arrayToPoint(config.point_list[i]), center_point, 0.5));
			
			var generated_point_list_2 = [];
			for (var i in config.point_list) generated_point_list_2.push(approach(ImageDataExt.arrayToPoint(config.point_list[i]), center_point, 1.5));
			
			for (var variant_type in Module.typeImageVariant) {
				var background = Module.typeBackground[variant_type];
				var color = ImageDataExt.arrayToColor(Module.typeColor[variant_type]);
				var target_color = {r: 50, g: 50, b: 50, a: 255};
				
				Dr.log('[generateImageData]', background, color);
				var generated_image_data = new ImageDataExt;
				//generated_image_data.init('local', canvas_context.createImageData(config.size[0], config.size[1]), ImageDataExt.type.CANVAS_IMAGE_DATA);
				generated_image_data.init('local', Dr.createOffscreenCanvas(config.size[0], config.size[1]), ImageDataExt.type.CANVAS_ELEMENT);
				
				var apply_color = fade(color, target_color, 0.5);
				generated_image_data.drawPixelLineList(generated_point_list, apply_color, true);
				generated_image_data.floodFill(ImageDataExt.arrayToPoint(config.tag_image_center), apply_color);
				
				var apply_color = fade(color, target_color, 0.3);
				generated_image_data.drawPixelLineList(generated_point_list_1, apply_color, true);
				generated_image_data.floodFill(ImageDataExt.arrayToPoint(config.tag_image_center), apply_color);
				
				var apply_color = fade(color, target_color, 0.1);
				generated_image_data.drawPixelLineList(generated_point_list_2, apply_color, true);
				generated_image_data.floodFill(ImageDataExt.arrayToPoint(config.tag_image_center), apply_color);
				
				generated_image_data.scale(this._scale);
				
				//important! canvas keep 
				generated_image_data.toCanvas();
				
				generated_image_data_tree[image_type][variant_type] = generated_image_data;
			}
		}
		
		return generated_image_data_tree;
	}
	
	
	Module.prototype.getImageData = function (image_type, background_type, color_type, tag_image) {
		// TODO
		// TODO
		// TODO
		// TODO
		// TODO
	}
	
	return Module;
});