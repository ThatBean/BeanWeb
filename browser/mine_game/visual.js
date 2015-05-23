//the map for drawing

Dr.Declare('Mine_GridCanvas', 'class');
Dr.Require('Mine_GridCanvas', 'Mine_Type');
Dr.Require('Mine_GridCanvas', 'Canvas');
Dr.Implement('Mine_GridCanvas', function (global, module_get) {
	
	var Module = function () {
		//
	}
	
	var Mine_Type = Dr.Get('Mine_Type');
	var Canvas = Dr.Get('Canvas');
	
	Module.type = Mine_Type.type;
	
	
	Module.prototype.init = function (canvas) {
		this._canvas = canvas;
	}
	
	Module.prototype.initImageData = function () {
		// TODO
		// TODO
		// TODO
		// TODO
		// TODO
	}
	
	Module.prototype.drawBlock = function (block) {
		
	}
	
	Module.prototype.onAction = function (action) {
		
	}
	
	return Module;
});



//image generator

Dr.Declare('Mine_ImageStore', 'class');
Dr.Require('Mine_ImageStore', 'Mine_Type');
Dr.Require('Mine_ImageStore', 'ImageData');
Dr.Implement('Mine_ImageStore', function (global, module_get) {
	
	var Module = function () {
		//
	}
	
	var Mine_Type = Dr.Get('Mine_Type');
	var ImageData = Dr.Get('ImageData');
	
	Module.type = Mine_Type.type;
	
	
	Module.image_type = {
		//image type
		IMAGE_TYPE_BOX: 'IMAGE_TYPE_BOX',
		IMAGE_TYPE_HEX: 'IMAGE_TYPE_HEX',
		IMAGE_TYPE_TRI_UP: 'IMAGE_TYPE_TRI_UP',
		IMAGE_TYPE_TRI_DOWN: 'IMAGE_TYPE_TRI_DOWN',
		
		//background type
		BACKGROUND_TYPE_INDICATOR: 'BACKGROUND_TYPE_INDICATOR',
		BACKGROUND_TYPE_BLOCK_NORMAL: 'BACKGROUND_TYPE_BLOCK_NORMAL',
		BACKGROUND_TYPE_BLOCK_PRESSED: 'BACKGROUND_TYPE_BLOCK_PRESSED',
		BACKGROUND_TYPE_BLOCK_EMPTY: 'BACKGROUND_TYPE_BLOCK_EMPTY',
		
		//color
		COLOR_TYPE_INDICATOR: [255, 255, 0],
		COLOR_TYPE_BLOCK_NORMAL: [200, 200, 200],
		COLOR_TYPE_BLOCK_PRESSED: [160, 160, 160],
		COLOR_TYPE_BLOCK_EMPTY: [150, 0, 0],
		
		//image
		IMAGE_NUMBER_1: 'IMAGE_NUMBER_1',
		IMAGE_NUMBER_2: 'IMAGE_NUMBER_2',
		IMAGE_NUMBER_3: 'IMAGE_NUMBER_3',
		IMAGE_NUMBER_4: 'IMAGE_NUMBER_4',
		IMAGE_NUMBER_5: 'IMAGE_NUMBER_5',
		IMAGE_NUMBER_6: 'IMAGE_NUMBER_6',
		IMAGE_NUMBER_7: 'IMAGE_NUMBER_7',
		IMAGE_NUMBER_8: 'IMAGE_NUMBER_8',
		IMAGE_NUMBER_9: 'IMAGE_NUMBER_9',
		IMAGE_NUMBER_10: 'IMAGE_NUMBER_10',
		IMAGE_NUMBER_11: 'IMAGE_NUMBER_11',
		IMAGE_NUMBER_12: 'IMAGE_NUMBER_12',
		IMAGE_MARK_EMPTY: 'IMAGE_MARK_EMPTY',
		IMAGE_MARK_LOCK: 'IMAGE_MARK_LOCK',
		IMAGE_MARK_FLAG: 'IMAGE_MARK_FLAG',
		IMAGE_FACE_COOL: 'IMAGE_FACE_COOL',
		IMAGE_FACE_SMILE: 'IMAGE_FACE_SMILE',
		IMAGE_FACE_OOPS: 'IMAGE_FACE_OOPS',
		IMAGE_FACE_DIE: 'IMAGE_FACE_DIE',
	}
	
	
	Module.image_generate_config = {
		//image type
		IMAGE_TYPE_BOX: {
			size: [10, 10],
			vertex_list: [
				[2, 0],
				[7, 0],
				[9, 2],
				[9, 7],
				[7, 9],
				[2, 9],
				[0, 7],
				[0, 2],
			],
			center_point: [4, 4],
		},
		IMAGE_TYPE_HEX: 'IMAGE_TYPE_HEX',
		IMAGE_TYPE_TRI_UP: 'IMAGE_TYPE_TRI_UP',
		IMAGE_TYPE_TRI_DOWN: 'IMAGE_TYPE_TRI_DOWN',
	}
	
	
	
	Module.prototype.init = function (canvas) {
		this._canvas = canvas;
	}
	
	Module.prototype.generateImageData = function () {
		
		
	}
	
	
	Module.prototype.initImageData = function () {
		// TODO
		// TODO
		// TODO
		// TODO
		// TODO
	}
	
	return Module;
});