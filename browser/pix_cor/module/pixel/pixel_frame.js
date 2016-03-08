/*
	A state (key frame) for all PixelBone in a PixelMotion,
	frames between PixelFrame are auto generated (slop + time)
*/
Dr.Declare('PixelFrame', 'class');
Dr.Require('PixelFrame', 'Vector3');
Dr.Require('PixelFrame', 'Rotate4');
Dr.Require('PixelFrame', 'PixelBone');
Dr.Implement('PixelFrame', function (global, module_get) {

	var Vector3 = Dr.Get('Vector3');	//for position
	var Rotate4 = Dr.Get('Rotate4');	//for rotation
	var PixelBone = Dr.Get('PixelBone');	//

	var Module = function () {
		this.position = new Vector3();
		this.rotation = new Rotate4();

		this.frame_id = 0;	//id for play
		this.frame_count = 0;

		this.frame_index = 0;	//index in motion.frames array
		this.next_frame = null;


		this.pixel_model = null;
		this.bones = [];	//attaching PixelPart
	};

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
		this.position = Vector3.FromArray(pixel_frame_data.XYZ);
		this.rotation = Rotate4.FromArray(pixel_frame_data.XYZR);

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








Dr.Declare('PixelFrameMixerBuffer', 'class');
Dr.Require('PixelFrameMixerBuffer', 'PixelMixMethod');
Dr.Require('PixelFrameMixerBuffer', 'PixelFrame');
Dr.Require('PixelFrameMixerBuffer', 'PixelBoneMixerBuffer');
Dr.Implement('PixelFrameMixerBuffer', function (global, module_get) {

	var PixelMixMethod = Dr.Get('PixelMixMethod');	//
	var PixelFrame = Dr.Get('PixelFrame');	//
	var PixelBoneMixerBuffer = Dr.Get('PixelBoneMixerBuffer');	//

	var Module = function () {
		this.mix_data_from = null;	//
		this.mix_data_to = null;	//

		this.mix_buffer_frame = null;
		this.sub_mix_buffer_bone_list = [];
	}

	Module.prototype.clear = function () {
		this.mix_data_from = null;	//
		this.mix_data_to = null;	//

		this.mix_buffer_frame = null;
		this.sub_mix_buffer_bone_list = [];
	};

	Module.prototype.setMixData = function (mix_data_from, mix_data_to) {
		this.mix_data_from = mix_data_from;
		this.mix_data_to = mix_data_to;

		this.mix_buffer_frame = new PixelFrame;

		//copy key data
		this.mix_buffer_frame.frame_count = this.mix_data_from.frame_count;
		this.mix_buffer_frame.next_frame = this.mix_data_from.next_frame;


		this.sub_mix_buffer_bone_list = [];
		for (var index in this.mix_data_from.bones) {
			var mix_buffer_bone = new PixelBoneMixerBuffer;
			mix_buffer_bone.setMixData(this.mix_data_from.bones[index], this.mix_data_to.bones[index]);
			this.sub_mix_buffer_bone_list[index] = mix_buffer_bone;
		}
	};

	Module.prototype.getMixedData = function () {
		var bones = [];

		for (var index in this.sub_mix_buffer_bone_list) {
			var mix_buffer_bone = this.sub_mix_buffer_bone_list[index];
			bones[index] = mix_buffer_bone.getMixedData();
		}

		this.mix_buffer_frame.bones = bones;

		return this.mix_buffer_frame;
	};

	Module.prototype.mix = function (mix_progress) {
		//should implement mix logic here

		PixelMixMethod.mixVector3(this.mix_buffer_frame.position, this.mix_data_from.position, this.mix_data_to.position, mix_progress);
		PixelMixMethod.mixPixelRotation4(this.mix_buffer_frame.rotation, this.mix_data_from.rotation, this.mix_data_to.rotation, mix_progress);

		//bones
		for (var index in this.sub_mix_buffer_bone_list) {
			this.sub_mix_buffer_bone_list[index].mix(mix_progress);
		}
	};

	return Module;
});

