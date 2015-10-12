/*
	This implements the most basic data/method for visible pixel shapes in PixCor,
	packed and managed under PixelModel for common "PixelObject"
	
	This is more of a data holder & method provider for 3d pixel visible,
	higher operation and hierarchy will be found in PixelModel
	
	This will be used for motion with bone
*/



// a pixel/block/square simple data
Dr.Declare('PixelPixel', 'class');
Dr.Require('PixelPixel', 'PixelVector3');
Dr.Require('PixelPixel', 'Color4');
Dr.Implement('PixelPixel', function (global, module_get) {
	
	var PixelVector3 = Dr.Get('PixelVector3');	//for position
	var Color4 = Dr.Get('Color4');	//for color
	
	var Module = function () {
		this.position = new PixelVector3();
		this.color = new Color4();
		// this.visible = true;
	}
	
	return Module;
});





Dr.Declare('PixelPart', 'class');
Dr.Require('PixelPart', 'PixelVector3');
Dr.Require('PixelPart', 'PixelRotate3');
Dr.Implement('PixelPart', function (global, module_get) {
	
	var PixelVector3 = Dr.Get('PixelVector3');	//for position
	var PixelRotate3 = Dr.Get('PixelRotate3');	//for rotation
	
	var Module = function () {
		this.position = new PixelVector3();
		this.rotation = new PixelVector3();
		
		this.pixels = [];	//PixelPixel list
		
		this.render_method = null;	//default = null(pixel), can set as block, block-frame a
	}
	
	Module.prototype.getId = function () {
		return this.id;
	};
	
	return Module;
});