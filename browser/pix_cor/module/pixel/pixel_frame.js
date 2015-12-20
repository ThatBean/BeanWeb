/*
	A state (key frame) for all PixelBone in a PixelMotion,
	frames between PixelKeyFrame are auto generated (slop + time)
*/
Dr.Declare('PixelKeyFrame', 'class');
Dr.Require('PixelKeyFrame', 'PixelVector3');
Dr.Require('PixelKeyFrame', 'PixelRotate4');
Dr.Require('PixelKeyFrame', 'PixelBone');
Dr.Implement('PixelKeyFrame', function (global, module_get) {
	
	var PixelVector3 = Dr.Get('PixelVector3');	//for position
	var PixelRotate4 = Dr.Get('PixelRotate4');	//for rotation
	var PixelBone = Dr.Get('PixelBone');	//
	
	var Module = function () {
		this.position = new PixelVector3();
		this.rotation = new PixelVector3();
		
		this.frame_id = 0;	//id for play
		this.frame_count = 0;
		
		this.frame_index = 0;	//index in motion.frames array
		this.next_frame = null;
		
		
		this.pixel_model = null;
		this.bones = [];	//attaching PixelPart
	}
	
	Module.prototype.getId = function () {
		return this.id;
	};
	
	
	Module.prototype.getRenderPixelPartMap = function () {
		var render_pixel_part_map = {};
		for (var index in this.bones) {
			var pixel_part = this.bones[index].getRenderPixelPart();
			render_pixel_part_map[pixel_part.name] = pixel_part;
		}
		return render_pixel_part_map;
	};
	
	
	
	
	Module.prototype.attachModel = function (pixel_model) {
		this.pixel_model = pixel_model;
		
		for (var index in this.bones) {
			this.bones[index].attachModel(pixel_model);
		}
	};
	
	Module.prototype.detachModel = function () {
		this.pixel_model = null;
		
		for (var index in this.bones) {
			this.bones[index].detachModel();
		}
	};
	
	
	
	//data related
	/*
		sample_pixel_frame_data = {
			'ID' : 0, // number, starts from 0
			'XYZ' : [0, 0, 0],
			'XYZR' : [0, 0, 0, 0],
			'pixel_bone_list' : [
				<pixel_bone_data>,	//check in PixelBone
				<pixel_bone_data>,	//check in PixelBone
				<pixel_bone_data>,	//check in PixelBone
			],
		}
	*/
	
	Module.prototype.applyData = function (pixel_frame_data) {
		//data apply logic
		this.frame_id = pixel_frame_data.ID;
		this.position = PixelVector3.FromArray(pixel_frame_data.XYZ);
		this.rotation = PixelRotate4.FromArray(pixel_frame_data.XYZR);
		
		this.bones = [];
		for (var index in pixel_frame_data.pixel_bone_list) {
			this.bones.push(PixelBone.loadData(pixel_frame_data.pixel_bone_list[index]));
		}
	};
	
	
	Module.loadData = function (pixel_frame_data, loaded_pixel_frame) {
		var loaded_pixel_frame = loaded_pixel_frame || new Module();
		
		loaded_pixel_frame.applyData(pixel_frame_data);
		
		return loaded_pixel_frame;
	};
	
	
	
	
	return Module;
});








/*
	A state (key frame) for all PixelBone in a PixelMotion,
	frames between PixelKeyFrame, auto generated (slop + time), check PixelFrameMixer
*/
Dr.Declare('PixelAutoFrame', 'class');
Dr.Require('PixelAutoFrame', 'PixelVector3');
Dr.Require('PixelAutoFrame', 'PixelRotate4');
Dr.Require('PixelAutoFrame', 'PixelBone');
Dr.Implement('PixelAutoFrame', function (global, module_get) {
	
	var PixelVector3 = Dr.Get('PixelVector3');	//for position
	var PixelRotate4 = Dr.Get('PixelRotate4');	//for rotation
	var PixelBone = Dr.Get('PixelBone');	//
	
	var Module = function () {
		this.position = new PixelVector3();
		this.rotation = new PixelVector3();
		
		this.frame_id = 0;	//id for play
		this.frame_count = 0;
		
		this.frame_index = 0;	//index in motion.frames array
		this.next_frame = null;
		
		
		this.pixel_model = null;
		this.bones = [];	//attaching PixelPart
	}
	
	Module.prototype.getId = function () {
		return this.id;
	};
	
	
	
	return Module;
});