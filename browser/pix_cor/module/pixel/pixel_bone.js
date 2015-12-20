
Dr.Declare('PixelBone', 'class');
Dr.Require('PixelBone', 'PixelVector3');
Dr.Require('PixelBone', 'PixelRotate4');
Dr.Require('PixelBone', 'PixelPart');
Dr.Implement('PixelBone', function (global, module_get) {
	
	var PixelVector3 = Dr.Get('PixelVector3');	//for position
	var PixelRotate4 = Dr.Get('PixelRotate4');	//for rotation
	var PixelPart = Dr.Get('PixelPart');	//for rotation
	
	var Module = function () {
		this.position = new PixelVector3();
		this.rotation = new PixelVector3();
		
		this.pixel_part_name = null;	//attaching PixelPart NAME
		this.pixel_part = null;	//attaching PixelPart
		
		this.render_pixel_part = new PixelPart;
	}
	
	Module.prototype.getId = function () {
		return this.id;
	};
	
	Module.prototype.getRenderPixelPart = function () {
		this.render_pixel_part.pixels = this.pixel_part.pixels;
		this.render_pixel_part.name = this.pixel_part_name;
		
		this.render_pixel_part.position = this.position;
		this.render_pixel_part.rotation = this.rotation;
		
		return this.render_pixel_part;
	};
	
	
	
	Module.prototype.attachModel = function (pixel_model) {
		this.pixel_part = pixel_model.parts[this.pixel_part_name];
	};
	
	Module.prototype.detachModel = function () {
		this.pixel_part = null;
	};
	
	
	
	
	//data related
	/*
		sample_pixel_bone_data = {
			'PART_NAME' : "A",	//string, attaching PixelPart NAME
			'XYZ' : [0, 0, 0],
			'XYZR' : [0, 0, 0, 0],
		}
	*/
	
	Module.prototype.applyData = function (pixel_bone_data) {
		//data apply logic
		this.pixel_part_name = pixel_bone_data.PART_NAME;
		this.position = PixelVector3.FromArray(pixel_bone_data.XYZ);
		this.rotation = PixelRotate4.FromArray(pixel_bone_data.XYZR);
	};
	
	
	Module.loadData = function (pixel_bone_data, loaded_pixel_bone) {
		var loaded_pixel_bone = loaded_pixel_bone || new Module();
		
		loaded_pixel_bone.applyData(pixel_bone_data);
		
		return loaded_pixel_bone;
	};
	
	
	return Module;
});