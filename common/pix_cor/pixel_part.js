/*
	This implements the most basic data/method for visible pixel shapes in PixCor,
	packed and managed under PixCorModel for common "PixelObject"
	
	This is more of a data holder & method provider for 3d pixel visible,
	higher operation and hierarchy will be found in PixCorModel
	
	This will be used for motion with bone
*/



// a pixel/block/square simple data
Dr.Declare('PixCorPixel', 'class');
Dr.Require('PixCorPixel', 'PixelVector3');
Dr.Require('PixCorPixel', 'Color4');
Dr.Implement('PixCorPixel', function (global, module_get) {
	
	var PixelVector3 = Dr.Get('PixelVector3');	//for position
	var Color4 = Dr.Get('Color4');	//for color
	
	var Module = function () {
		this.position = new PixelVector3();
		this.color = new Color4();
		// this.visible = true;
	}
	
	return Module;
});





Dr.Declare('PixCorPart', 'class');
Dr.Require('PixCorPart', 'PixelVector3');
Dr.Require('PixCorPart', 'PixelRotate3');
Dr.Implement('PixCorPart', function (global, module_get) {
	
	var PixelVector3 = Dr.Get('PixelVector3');	//for position
	var PixelRotate3 = Dr.Get('PixelRotate3');	//for rotation
	
	var Module = function () {
		this.position = new PixelVector3();
		this.rotation = new PixelVector3();
		
		this.pixels = [];	//PixCorPixel list
		
		this.render_method = null;	//default = null(pixel), can set as block, block-frame a
	}
	
	Module.prototype.getId = function () {
		return this.id;
	};
	
	return Module;
});