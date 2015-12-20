/*
	Mix(Interpolation) of many data type:
		Vector
		Number
		Color
		Rotation
	For auto generate key frame between PixelKeyFrame.
	Interpolation(from_data, to_data, ratio_progress)
*/
Dr.Declare('PixelFrameMixer', 'class');
Dr.Require('PixelFrameMixer', 'PixelVector3');
Dr.Require('PixelFrameMixer', 'PixelRotate4');
Dr.Require('PixelFrameMixer', 'PixelKeyFrame');
Dr.Require('PixelFrameMixer', 'PixelAutoFrame');
Dr.Implement('PixelFrameMixer', function (global, module_get) {
	
	var PixelVector3 = Dr.Get('PixelVector3');	//for position
	var PixelRotate4 = Dr.Get('PixelRotate4');	//for rotation
	var PixelKeyFrame = Dr.Get('PixelKeyFrame');	//for rotation
	var PixelAutoFrame = Dr.Get('PixelAutoFrame');	//for rotation
	
	var Module = function () {
		this.frame_from = null;	//mix
		this.frame_to = null;	//mix
		this.frame_auto = null;
		
		this.current_frame_id = 0;
		this.mix_frame_count = 0;
	}
	
	Module.prototype.getId = function () {
		return this.id;
	};
	
	Module.prototype.clear = function () {
		this.frame_from = null;	//mix
		this.frame_to = null;	//mix
		this.frame_auto = null;	//mix
		
		this.current_frame_id = 0;
		this.mix_frame_count = 0;
	};
	
	Module.prototype.setMixFrame = function (frame_from, frame_to) {
		this.frame_from = frame_from;
		this.frame_to = frame_to || frame_from;
		this.frame_auto = new PixelAutoFrame(this.frame_from);
		
		this.current_frame_id = 0;
		this.mix_frame_count = this.frame_from.frame_count;
	};
	
	Module.prototype.nextFrame = function () {
		this.current_frame_id ++;
		
		if (this.current_frame_id >= this.mix_frame_count) {
			this.clear();
			return null;
		}
		else {
			var mix_progress = this.current_frame_id / this.mix_frame_count;
			return this.mixFrame(mix_progress);
		}
	};
	
	Module.prototype.mixFrame = function (mix_progress) {
		if (mix_progress <= 0) {
			return this.frame_from;
		}
		else if (mix_progress >= 1) {
			return this.frame_to;
		}
		else {
			return this.frame_from;
			
			//mix_progress;
			
			// return this.frame_auto;
		}
	};
	
	return Module;
});
