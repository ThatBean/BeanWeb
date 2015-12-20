//pixel rotate 3D

// with axis and rotate value (right handed, in Radians (Pi, not 180))

Dr.Declare('PixelRotate4', 'class');
Dr.Implement('PixelRotate4', function (global, module_get) {
	
	var Module = function (x, y, z, r) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.r = r;
	}
	
	Module.prototype.toString = function () {
		return "{X: " + this.x 
			+ " Y:" + this.y 
			+ " Z:" + this.z 
			+ " R:" + this.r + "}";
	};
	
	Module.prototype.toArray = function () {
		return [this.x, this.y, this.z, this.r];
	};
	
	Module.prototype.copy = function () {
		return new Module(this.x, this.y, this.z, this.r);
	};
	
	Module.FromArray = function (array, offset) {
		if (!offset) {
			offset = 0;
		}
		return new Module(array[offset], array[offset + 1], array[offset + 2], array[offset + 3]);
	};
	
	return Module;
});
