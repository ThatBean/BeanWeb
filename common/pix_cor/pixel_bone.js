
Dr.Declare('PixelBone', 'class');
Dr.Require('PixelBone', 'PixelVector3');
Dr.Require('PixelBone', 'PixelRotate3');
Dr.Implement('PixelBone', function (global, module_get) {
	
	var PixelVector3 = Dr.Get('PixelVector3');	//for position
	var PixelRotate3 = Dr.Get('PixelRotate3');	//for rotation
	
	var Module = function () {
		this.position = new PixelVector3();
		this.rotation = new PixelVector3();
		
		this.pixel_part = null;	//attaching PixelPart
		
		this.render_method = null;	//default = null(pixel), can set as block, block-frame
	}
	
	Module.prototype.getId = function () {
		return this.id;
	};
	
	return Module;
});