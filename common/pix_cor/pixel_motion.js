/*
	A state (key frame) for all PixelBone in a PixelMotion,
	frames between PixelKeyFrame are auto generated (slop + time)
*/
Dr.Declare('PixelKeyFrame', 'class');
Dr.Require('PixelKeyFrame', 'PixelVector3');
Dr.Require('PixelKeyFrame', 'PixelRotate3');
Dr.Implement('PixelKeyFrame', function (global, module_get) {
	
	var PixelVector3 = Dr.Get('PixelVector3');	//for position
	var PixelRotate3 = Dr.Get('PixelRotate3');	//for rotation
	
	var Module = function () {
		this.position = new PixelVector3();
		this.rotation = new PixelVector3();
		
		this.pixel_part = null;	//attaching PixelPart
		
		this.render_method = null;	//default = null(pixel), can set as block, block-frame a
	}
	
	Module.prototype.getId = function () {
		return this.id;
	};
	
	return Module;
});

/*
	Interpolation of many data type:
		Vector
		Number
		Color
		Rotation
	For auto generate key frame between PixelKeyFrame.
	Interpolation(from_data, to_data, ratio_progress)
*/
Dr.Declare('PixelInterpolation', 'class');
Dr.Require('PixelInterpolation', 'PixelVector3');
Dr.Require('PixelInterpolation', 'PixelRotate3');
Dr.Implement('PixelInterpolation', function (global, module_get) {
	
	var PixelVector3 = Dr.Get('PixelVector3');	//for position
	var PixelRotate3 = Dr.Get('PixelRotate3');	//for rotation
	
	var Module = function () {
		this.position = new PixelVector3();
		this.rotation = new PixelVector3();
		
		this.pixel_part = null;	//attaching PixelPart
		
		this.render_method = null;	//default = null(pixel), can set as block, block-frame a
	}
	
	Module.prototype.getId = function () {
		return this.id;
	};
	
	return Module;
});


/*
	Combine PixelBone - PixelPart and PixelKeyFrame data, 
	receive delta_time and generate corresponding PixelModel(Different Morph for PixelParts)
	
	For game purpose, will add some physics related logic to Frame Generation
*/

Dr.Declare('PixelMotion', 'class');
Dr.Require('PixelMotion', 'PixelVector3');
Dr.Require('PixelMotion', 'PixelRotate3');
Dr.Implement('PixelMotion', function (global, module_get) {
	
	var PixelVector3 = Dr.Get('PixelVector3');	//for position
	var PixelRotate3 = Dr.Get('PixelRotate3');	//for rotation
	
	var Module = function () {
		this.position = new PixelVector3();
		this.rotation = new PixelVector3();
		
		this.pixel_part = null;	//attaching PixelPart
		
		this.render_method = null;	//default = null(pixel), can set as block, block-frame a
	}
	
	Module.prototype.getId = function () {
		return this.id;
	};
	
	
	return Module;
});