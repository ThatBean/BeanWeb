/*
	Mix(Interpolation) of many data type:
		Vector
		Number
		Color
		Rotation
	For auto generate key frame between PixelFrame.
	Interpolation(from_data, to_data, ratio_progress)
*/
Dr.Declare('PixelMixer', 'class');
Dr.Require('PixelMixer', 'Vector3');
Dr.Require('PixelMixer', 'Rotate4');
Dr.Require('PixelMixer', 'PixelMixerBuffer');
Dr.Implement('PixelMixer', function (global, module_get) {
	
	var Vector3 = Dr.Get('Vector3');	//for position
	var Rotate4 = Dr.Get('Rotate4');	//for rotation
	var PixelMixerBuffer = Dr.Get('PixelMixerBuffer');	//for rotation
	
	var Module = function (mix_buffer) {
		this.mix_data_from = null;	//mix
		this.mix_data_to = null;	//mix
		this.mix_buffer = mix_buffer;
		
		this.mix_progress = 0;
		this.mix_progress_total = 0;
	}
	
	Module.prototype.clear = function () {
		this.mix_data_from = null;	//mix
		this.mix_data_to = null;	//mix
		this.mix_buffer.clear();	//mix
		
		this.mix_progress = 0;
		this.mix_progress_total = 0;
	};
	
	Module.prototype.setMixBuffer = function (mix_data_from, mix_data_to, mix_progress_total) {
		this.mix_data_from = mix_data_from;
		this.mix_data_to = mix_data_to || mix_data_from;
		this.mix_buffer.setMixData(this.mix_data_from, this.mix_data_to);
		
		this.mix_progress = 0;
		this.mix_progress_total = mix_progress_total;
	};
	
	Module.prototype.next = function (delta_progress) {
		this.mix_progress += delta_progress;
		
		if (this.mix_progress >= this.mix_progress_total) {
			this.clear();
			return null;
		}
		else {
			var mix_progress = this.mix_progress / this.mix_progress_total;
			return this.mix(mix_progress);
		}
	};
	
	Module.prototype.mix = function (mix_progress) {
		if (mix_progress <= 0) {
			return this.mix_data_from;
		}
		else if (mix_progress >= 1) {
			return this.mix_data_to;
		}
		else {
			this.mix_buffer.mix(mix_progress);
			return this.mix_buffer.getMixedData();
		}
	};
	
	return Module;
});






// just a sample, mark all key method
Dr.Declare('PixelMixerBuffer', 'class');
Dr.Implement('PixelMixerBuffer', function (global, module_get) {
	
	var Module = function () {
		this.mix_data_from = null;	//
		this.mix_data_to = null;	//
	}
	
	Module.prototype.clear = function () {
		this.mix_data_from = null;	//
		this.mix_data_to = null;	//
	};
	
	Module.prototype.setMixData = function (mix_data_from, mix_data_to) {
		this.mix_data_from = mix_data_from;
		this.mix_data_to = mix_data_to;
	};
	
	Module.prototype.getMixedData = function () {
		return this.mix_data_from;
	};
	
	Module.prototype.mix = function (mix_progress) {
		//should implement mix logic here
	};
	
	
	return Module;
});



// just a sample, mark all key method
Dr.Declare('PixelMixMethod', 'function_pack');
Dr.Implement('PixelMixMethod', function (global, module_get) {
	
	var Module = function () {
		Dr.assert(false, 'this is a function pack');
	}
	
	//getMixed___ use 3 arguments: from, to, mix_progress
	Module.getMixedNumber = function (from, to, mix_progress) {
		return (from + (to - from) * mix_progress);
	};
	
	
	//mix___ use 4 arguments: result, from, to, mix_progress
	// note result must be an object or the argument is passed by value
	Module.mixVector3 = function (result, from, to, mix_progress) {
		result.x = Module.getMixedNumber(from.x, to.x, mix_progress);
		result.y = Module.getMixedNumber(from.y, to.y, mix_progress);
		result.z = Module.getMixedNumber(from.z, to.z, mix_progress);
	};
	
	Module.mixPixelRotation4 = function (result, from, to, mix_progress) {
		result.x = Module.getMixedNumber(from.x, to.x, mix_progress);
		result.y = Module.getMixedNumber(from.y, to.y, mix_progress);
		result.z = Module.getMixedNumber(from.z, to.z, mix_progress);
		result.r = Module.getMixedNumber(from.r, to.r, mix_progress);
	};
	
	Module.mixPixelColor4 = function (result, from, to, mix_progress) {
		result.r = Module.getMixedNumber(from.r, to.r, mix_progress);
		result.g = Module.getMixedNumber(from.g, to.g, mix_progress);
		result.b = Module.getMixedNumber(from.b, to.b, mix_progress);
		result.a = Module.getMixedNumber(from.a, to.a, mix_progress);
	};
	
	return Module;
});
