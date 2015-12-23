/*
	Combine PixelBone - PixelPart and PixelFrame data, 
	receive delta_time and generate corresponding PixelModel(Different Morph for PixelParts)
	
	For game purpose, will add some physics related logic to Frame Generation
*/

Dr.Declare('PixelMotion', 'class');
Dr.Require('PixelMotion', 'DataTreeNode');
Dr.Require('PixelMotion', 'PixelModel');
Dr.Require('PixelMotion', 'PixelFrame');
Dr.Require('PixelMotion', 'PixelMixer');
Dr.Require('PixelMotion', 'PixelFrameMixerBuffer');
Dr.Implement('PixelMotion', function (global, module_get) {
	
	var DataTreeNode = Dr.Get('DataTreeNode');	//
	var PixelModel = Dr.Get('PixelModel');	//
	var PixelFrame = Dr.Get('PixelFrame');	//
	var PixelMixer = Dr.Get('PixelMixer');	//
	var PixelFrameMixerBuffer = Dr.Get('PixelFrameMixerBuffer');	//
	
	
	var Module = function () {
		this.proto.call(this);
		
		this.frame_fps = 30;
		this.frame_duration = 1.0 / this.frame_fps;
		
		this.key_frames = [];	//all key_frames here
		this.total_frame_count = 0;
		
		this.pixel_mixer = new PixelMixer(new PixelFrameMixerBuffer);
		
		this.pixel_model = null;	//attached model
		this.position = null;
		this.rotation = null;
		
		this.is_active = false;
		this.is_loop = false;
		
		this.current_frame_id = 0;
		this.current_frame_duration = 0;
		this.current_frame = null;
	}
	
	
	//inhert method
	Module.prototype = Object.create(DataTreeNode.prototype);
	Module.prototype.proto = DataTreeNode;
	
	
	Module.prototype.getId = function () {
		return this.id;
	};
	
	
	
	
	Module.prototype.start = function (is_loop, start_frame_id) {
		this.is_active = true;
		this.is_loop = is_loop || false;
		
		this.reset();
		
		this.current_frame_id = start_frame_id || 0;
	};
	
	Module.prototype.reset = function () {
		this.current_frame_id = 0;
		this.current_frame_duration = 0;
		this.current_frame = null;
	};
	
	Module.prototype.stop = function () {
		this.is_active = false;
	};
	
	Module.prototype.update = function (delta_time) {
		if (this.is_active) {
			this.current_frame_duration += delta_time;
			
			while(this.current_frame_duration > this.frame_duration) {
				this.current_frame_duration -= this.frame_duration;
				this.current_frame_id ++;
				
				if (this.current_frame_id < this.total_frame_count) {
					this.nextFrame();
				}
				else {
					if (this.is_loop) this.reset();
					else this.stop();
					break;
				}
			}
		}
	};
	
	
	Module.prototype.nextFrame = function () {
		this.current_frame = this.pixel_mixer.next(1);	//generate next frame, null if current mix ended
		
		if (!this.current_frame) {
			this.current_frame = this.getKeyFrame(this.current_frame_id);
			this.pixel_mixer.setMixBuffer(this.current_frame, this.current_frame.next_frame, this.current_frame.frame_count);
		}
	};
	
	Module.prototype.getKeyFrame = function (frame_id) {
		var key_frame_index = 0;
		for (var index in this.key_frames) {
			if (index <= frame_id) key_frame_index = index;
			else break;
		}
		return this.key_frames[key_frame_index];
	};
	
	
	Module.prototype.getRenderPixelPartMap = function () {
		if (this.current_frame) {
			return this.current_frame.getRenderPixelPartMap();
		}
	};
	
	
	
	
	
	
	
	
	
	
	
	Module.prototype.generateFrameInfo = function () {
		this.total_frame_count = 0;
		
		for (var index = 0; index < this.key_frames.length; index ++) {
			var key_frame = this.key_frames[index];
			var next_key_frame = this.key_frames[index + 1] || null;
			
			key_frame.frame_index = index;	//index in motion.frames array
			key_frame.frame_count = (next_key_frame ? next_key_frame.frame_id - key_frame.frame_id : 1);
			key_frame.next_frame = next_key_frame;
			
			this.total_frame_count += key_frame.frame_count;
		}
	};
	
	
	Module.prototype.attachModel = function (pixel_model) {
		this.pixel_model = pixel_model;
		this.position = pixel_model.position;
		this.rotation = pixel_model.rotation;
		
		for (var index in this.key_frames) {
			this.key_frames[index].attachModel(pixel_model);
		}
	};
	
	Module.prototype.detachModel = function () {
		this.pixel_model = null;
		this.position = null;
		this.rotation = null;
		
		for (var index in this.key_frames) {
			this.key_frames[index].detachModel();
		}
	};
	
	
	
	//data related
	/*
		sample_pixel_motion_data = {
			'FRAME_FPS' : 30,	//only for frame switching speed, not play FPS
			'pixel_frame_list' : [
				<pixel_frame_data>,	//check in PixelFrame
				<pixel_frame_data>,	//check in PixelFrame
				<pixel_frame_data>,	//check in PixelFrame
			],
		}
	*/
	
	Module.prototype.applyData = function (pixel_motion_data) {
		//data apply logic
		this.frame_fps = pixel_motion_data.FRAME_FPS;
		
		this.key_frames = [];
		for (var index = 0; index < pixel_motion_data.pixel_frame_list.length; index ++) {
			this.key_frames.push(PixelFrame.loadData(pixel_motion_data.pixel_frame_list[index]));
		}
	};
	
	
	Module.loadData = function (pixel_motion_data, loaded_pixel_motion) {
		var loaded_pixel_motion = loaded_pixel_motion || new Module();
		
		loaded_pixel_motion.applyData(pixel_motion_data);
		
		return loaded_pixel_motion;
	};
	
	
	return Module;
});