Dr.Declare('Vector2', 'class');
Dr.Implement('Vector2', function (global, module_get) {
	var Module = function (x, y) {
		this.x = x;
		this.y = y;
	}
	Module.prototype.toString = function () {
		return "{X: " + this.x + " Y:" + this.y + "}";
	};
	Module.prototype.add = function (vector) {
		return new Module(this.x + vector.x, this.y + vector.y);
	};
	Module.prototype.subtract = function (vector) {
		return new Module(this.x - vector.x, this.y - vector.y);
	};
	Module.prototype.negate = function () {
		return new Module(-this.x, -this.y);
	};
	Module.prototype.scale = function (scale) {
		return new Module(this.x * scale, this.y * scale);
	};
	Module.prototype.equals = function (vector) {
		return this.x === vector.x && this.y === vector.y;
	};
	Module.prototype.length = function () {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	};
	Module.prototype.lengthSquared = function () {
		return (this.x * this.x + this.y * this.y);
	};
	Module.prototype.normalize = function () {
		var len = this.length();
		if (len === 0) {
			return;
		}
		var num = 1.0 / len;
		this.x *= num;
		this.y *= num;
	};
	Module.Zero = function () {
		return new Module(0, 0);
	};
	Module.Copy = function (source) {
		return new Module(source.x, source.y);
	};
	Module.Normalize = function (vector) {
		var newVector = Module.Copy(vector);
		newVector.normalize();
		return newVector;
	};
	Module.Minimize = function (left, right) {
		var x = (left.x < right.x) ? left.x : right.x;
		var y = (left.y < right.y) ? left.y : right.y;
		return new Module(x, y);
	};
	Module.Maximize = function (left, right) {
		var x = (left.x > right.x) ? left.x : right.x;
		var y = (left.y > right.y) ? left.y : right.y;
		return new Module(x, y);
	};
	Module.Transform = function (vector, transformation) {
		var x = (vector.x * transformation.m[0]) + (vector.y * transformation.m[4]);
		var y = (vector.x * transformation.m[1]) + (vector.y * transformation.m[5]);
		return new Module(x, y);
	};
	Module.Distance = function (value1, value2) {
		return Math.sqrt(Module.DistanceSquared(value1, value2));
	};
	Module.DistanceSquared = function (value1, value2) {
		var x = value1.x - value2.x;
		var y = value1.y - value2.y;
		return (x * x) + (y * y);
	};
	
	return Module;
});
	
	
	
	
 
Dr.Declare('Vector3', 'class');
Dr.Implement('Vector3', function (global, module_get) {
	var Module = function (x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
	Module.prototype.toString = function () {
		return "{X: " + this.x + " Y:" + this.y + " Z:" + this.z + "}";
	};
	Module.prototype.toArray = function () {
		return [this.x, this.y, this.z];
	};
	Module.prototype.toInt = function () {
		// TODO: consider using Math.floor, messy for value like -1.5
		this.x = this.x >> 0;
		this.y = this.y >> 0;
		this.z = this.z >> 0;
	};
	Module.prototype.add = function (vector) {
		return new Module(this.x + vector.x, this.y + vector.y, this.z + vector.z);
	};
	Module.prototype.subtract = function (vector) {
		return new Module(this.x - vector.x, this.y - vector.y, this.z - vector.z);
	};
	Module.prototype.negate = function () {
		return new Module(-this.x, -this.y, -this.z);
	};
	Module.prototype.scale = function (scale) {
		return new Module(this.x * scale, this.y * scale, this.z * scale);
	};
	Module.prototype.equals = function (vector) {
		return this.x === vector.x && this.y === vector.y && this.z === vector.z;
	};
	Module.prototype.multiply = function (vector) {
		return new Module(this.x * vector.x, this.y * vector.y, this.z * vector.z);
	};
	Module.prototype.divide = function (vector) {
		return new Module(this.x / vector.x, this.y / vector.y, this.z / vector.z);
	};
	Module.prototype.length = function () {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	};
	Module.prototype.lengthSquared = function () {
		return (this.x * this.x + this.y * this.y + this.z * this.z);
	};
	Module.prototype.normalize = function () {
		var len = this.length();
		if (len === 0) {
			return;
		}
		var num = 1.0 / len;
		this.x *= num;
		this.y *= num;
		this.z *= num;
	};
	Module.prototype.copy = function () {
		return new Module(this.x, this.y, this.z);
	};
	
	
	Module.prototype.pixelize = function () {
		return new Module(Math.round(this.x), Math.round(this.y), Math.round(this.z));
	};
	
	
	/*
		the pixel rotate coordinate system
		
		y (yaw)
		^
		|   z (roll)
		|  /
		| /
		|/
		/-----------> x (pitch)
		
		ccw_0, ccw_1 -- the centered coordinate(pick two from x, y, z), in order of right hand rotate
	*/
	
	var _pixel_rotate_by_axis = function (rotate_ratio, ccw_0, ccw_1) {
		//var dist = Math.max(Math.abs(Math.round(ccw_0)), Math.abs(Math.round(ccw_1)));
		var edge_dist = Math.max(Math.abs(ccw_0), Math.abs(ccw_1));
		var dist = Math.round(edge_dist);
		
		if (rotate_ratio === 0 || dist === 0) {
			return [ccw_0, ccw_1];
		}
		
		var current_total_pixel;
		if (ccw_0 === edge_dist) {
			current_total_pixel = (0 + 1) * dist + ccw_1;
		}
		else if (ccw_1 === edge_dist) {
			current_total_pixel = (2 + 1) * dist - ccw_0;
		}
		else if (ccw_0 === -edge_dist) {
			current_total_pixel = (4 + 1) * dist - ccw_1;
		}
		else if (ccw_1 === -edge_dist) {
			current_total_pixel = (6 + 1) * dist + ccw_0;
		}
		else {
			debugger;
			return [ccw_0, ccw_1];
		}
		//Dr.log('current_total_pixel', current_total_pixel);
		
		//rotate_ratio range is [0, 4)
		var rotate_pixel = Math.round(rotate_ratio * 2 * dist);
		//Dr.log('rotate_pixel', rotate_pixel);
		
		var result_total_pixel = (current_total_pixel + rotate_pixel) % (8 * dist);
		
		var result_edge = Math.floor(result_total_pixel / (2 * dist));
		var result_pixel = result_total_pixel - result_edge * 2 * dist - dist;
		
		//Dr.log('result_total_pixel', result_total_pixel);
		//Dr.log('result_edge', result_edge);
		//Dr.log('result_pixel', result_pixel);
		
		switch (result_edge) {
			case 0:
				ccw_0 = dist;
				ccw_1 = result_pixel;
				break;
			case 1:
				ccw_0 = -result_pixel;
				ccw_1 = dist;
				break;
			case 2:
				ccw_0 = -dist;
				ccw_1 = -result_pixel;
				break;
			case 3:
				ccw_0 = result_pixel;
				ccw_1 = -dist;
				break;
		}
		/*
		if (isNaN(ccw_0) || isNaN(ccw_1)) { debugger; }
		*/
		return [ccw_0, ccw_1];
	};
	
	Module.prototype.pixelRotate = function (center_vec, rotate_vec) {
		var dx = this.x - center_vec.x;
		var dy = this.y - center_vec.y;
		var dz = this.z - center_vec.z;
		
		//var dist = Math.max(Math.abs(dx), Math.abs(dy), Math.abs(dz));
		
		//should be z-x-y (performs the roll first, then the pitch, and finally the yaw)
		
		//Dr.log('start', dx, dy, dz, 'next', rotate_vec.z, dy, dx);
		
		//z axis (roll)
		var res = _pixel_rotate_by_axis(rotate_vec.z, dy, dx);
		dy = res[0];
		dx = res[1];
		
		//Dr.log('step', dx, dy, dz, 'next', rotate_vec.x, dz, dy);
		
		//x axis (pitch)
		var res = _pixel_rotate_by_axis(rotate_vec.x, dz, dy);
		dz = res[0];
		dy = res[1];
		
		//Dr.log('step', dx, dy, dz, 'next', rotate_vec.y, dx, dz);
		
		//y axis (yaw)
		var res = _pixel_rotate_by_axis(rotate_vec.y, dx, dz);
		dx = res[0];
		dz = res[1];
		
		//Dr.log('step', dx, dy, dz);
		
		var x = (center_vec.x + dx);
		var y = (center_vec.y + dy);
		var z = (center_vec.z + dz);
		
		//Dr.log('get', x, y, z);
		
		return new Module(Math.round(x), Math.round(y), Math.round(z));
	};
	
	/*
	Dr.log('should get [5, 5]', _pixel_rotate_by_axis(0.5, 5, 5, 0));
	Dr.log('should get [5, -5]', _pixel_rotate_by_axis(-0.5, 5, 5, 0));
	Dr.log('should get [5, 0]', _pixel_rotate_by_axis(4, 5, 5, 0));
	Dr.log('should get [-1, 5]', _pixel_rotate_by_axis(1.1, 5, 5, 0));
	
	var Pixel3D_Math = Dr.Get("Pixel3D_Math");
	var Module = Pixel3D_Math.Module;
	var test_1 = new Module(2, -1, -4);
	var test_2 = new Module(2, 0, -4);
	var center_vec = new Module(0, 0, 0);
	var rotate_vec = new Module(0, 2.455199999999994, 2.455199999999994);
	Dr.log('test_1', test_1.pixelRotate(center_vec, rotate_vec));
	Dr.log('test_2', test_2.pixelRotate(center_vec, rotate_vec));
	
	*/
	Module.FromArray = function (array, offset) {
		if (!offset) {
			offset = 0;
		}
		return new Module(array[offset], array[offset + 1], array[offset + 2]);
	};
	Module.Zero = function () {
		return new Module(0, 0, 0);
	};
	Module.Up = function () {
		return new Module(0, 1.0, 0);
	};
	Module.Copy = function (source) {
		return new Module(source.x, source.y, source.z);
	};
	Module.Dot = function (left, right) {
		return (left.x * right.x + left.y * right.y + left.z * right.z);
	};
	Module.Cross = function (left, right) {
		var x = left.y * right.z - left.z * right.y;
		var y = left.z * right.x - left.x * right.z;
		var z = left.x * right.y - left.y * right.x;
		return new Module(x, y, z);
	};
	Module.Normalize = function (vector) {
		var newVector = Module.Copy(vector);
		newVector.normalize();
		return newVector;
	};
	Module.Distance = function (value1, value2) {
		return Math.sqrt(Module.DistanceSquared(value1, value2));
	};
	Module.DistanceSquared = function (value1, value2) {
		var x = value1.x - value2.x;
		var y = value1.y - value2.y;
		var z = value1.z - value2.z;
		return (x * x) + (y * y) + (z * z);
	};
	//check matrix
	Module.TransformCoordinates = function (vector, transformation) {
		var x = (vector.x * transformation.m[0]) + (vector.y * transformation.m[4]) + (vector.z * transformation.m[8]) + transformation.m[12];
		var y = (vector.x * transformation.m[1]) + (vector.y * transformation.m[5]) + (vector.z * transformation.m[9]) + transformation.m[13];
		var z = (vector.x * transformation.m[2]) + (vector.y * transformation.m[6]) + (vector.z * transformation.m[10]) + transformation.m[14];
		var w = (vector.x * transformation.m[3]) + (vector.y * transformation.m[7]) + (vector.z * transformation.m[11]) + transformation.m[15];
		return new Module(x / w, y / w, z / w);
	};
	Module.TransformNormal = function (vector, transformation) {
		var x = (vector.x * transformation.m[0]) + (vector.y * transformation.m[4]) + (vector.z * transformation.m[8]);
		var y = (vector.x * transformation.m[1]) + (vector.y * transformation.m[5]) + (vector.z * transformation.m[9]);
		var z = (vector.x * transformation.m[2]) + (vector.y * transformation.m[6]) + (vector.z * transformation.m[10]);
		return new Module(x, y, z);
	};
	return Module;
});







Dr.Declare('PixelVector3', 'class');
Dr.Implement('PixelVector3', function (global, module_get) {
	var Module = function (x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
	Module.prototype.toString = function () {
		return "{X: " + this.x + " Y:" + this.y + " Z:" + this.z + "}";
	};
	Module.prototype.toArray = function () {
		return [this.x, this.y, this.z];
	};
	Module.prototype.toInt = function () {
		this.x = Math.floor(this.x);
		this.y = Math.floor(this.y);
		this.z = Math.floor(this.z);
	};
	Module.prototype.add = function (vector) {
		return new Module(this.x + vector.x, this.y + vector.y, this.z + vector.z);
	};
	Module.prototype.subtract = function (vector) {
		return new Module(this.x - vector.x, this.y - vector.y, this.z - vector.z);
	};
	Module.prototype.negate = function () {
		return new Module(-this.x, -this.y, -this.z);
	};
	Module.prototype.scale = function (scale) {
		return new Module(this.x * scale, this.y * scale, this.z * scale);
	};
	Module.prototype.equals = function (vector) {
		return this.x === vector.x && this.y === vector.y && this.z === vector.z;
	};
	Module.prototype.multiply = function (vector) {
		return new Module(this.x * vector.x, this.y * vector.y, this.z * vector.z);
	};
	Module.prototype.divide = function (vector) {
		return new Module(this.x / vector.x, this.y / vector.y, this.z / vector.z);
	};
	Module.prototype.length = function () {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	};
	Module.prototype.lengthSquared = function () {
		return (this.x * this.x + this.y * this.y + this.z * this.z);
	};
	Module.prototype.normalize = function () {
		var len = this.length();
		if (len === 0) {
			return;
		}
		var num = 1.0 / len;
		this.x *= num;
		this.y *= num;
		this.z *= num;
	};
	Module.prototype.copy = function () {
		return new Module(this.x, this.y, this.z);
	};
	
	
	Module.FromArray = function (array, offset) {
		if (!offset) {
			offset = 0;
		}
		return new Module(array[offset], array[offset + 1], array[offset + 2]);
	};
	Module.Zero = function () {
		return new Module(0, 0, 0);
	};
	Module.Up = function () {
		return new Module(0, 1.0, 0);
	};
	Module.Copy = function (source) {
		return new Module(source.x, source.y, source.z);
	};
	Module.Dot = function (left, right) {
		return (left.x * right.x + left.y * right.y + left.z * right.z);
	};
	Module.Cross = function (left, right) {
		var x = left.y * right.z - left.z * right.y;
		var y = left.z * right.x - left.x * right.z;
		var z = left.x * right.y - left.y * right.x;
		return new Module(x, y, z);
	};
	Module.Normalize = function (vector) {
		var newVector = Module.Copy(vector);
		newVector.normalize();
		return newVector;
	};
	Module.Distance = function (value1, value2) {
		return Math.sqrt(Module.DistanceSquared(value1, value2));
	};
	Module.DistanceSquared = function (value1, value2) {
		var x = value1.x - value2.x;
		var y = value1.y - value2.y;
		var z = value1.z - value2.z;
		return (x * x) + (y * y) + (z * z);
	};
	//check matrix
	Module.TransformCoordinates = function (vector, transformation) {
		var x = (vector.x * transformation.m[0]) + (vector.y * transformation.m[4]) + (vector.z * transformation.m[8]) + transformation.m[12];
		var y = (vector.x * transformation.m[1]) + (vector.y * transformation.m[5]) + (vector.z * transformation.m[9]) + transformation.m[13];
		var z = (vector.x * transformation.m[2]) + (vector.y * transformation.m[6]) + (vector.z * transformation.m[10]) + transformation.m[14];
		var w = (vector.x * transformation.m[3]) + (vector.y * transformation.m[7]) + (vector.z * transformation.m[11]) + transformation.m[15];
		return new Module(x / w, y / w, z / w);
	};
	Module.TransformNormal = function (vector, transformation) {
		var x = (vector.x * transformation.m[0]) + (vector.y * transformation.m[4]) + (vector.z * transformation.m[8]);
		var y = (vector.x * transformation.m[1]) + (vector.y * transformation.m[5]) + (vector.z * transformation.m[9]);
		var z = (vector.x * transformation.m[2]) + (vector.y * transformation.m[6]) + (vector.z * transformation.m[10]);
		return new Module(x, y, z);
	};
	
	
	
	
	
	
	/*
		the pixel rotate coordinate system
		
		y (yaw)
		^
		|   z (roll)
		|  /
		| /
		|/
		/-----------> x (pitch)
		
		ccw_0, ccw_1 -- the centered coordinate(pick two from x, y, z), in order of right hand rotate
	*/
	
	var _pixel_rotate_by_axis = function (rotate_ratio, ccw_0, ccw_1) {
		//var dist = Math.max(Math.abs(Math.round(ccw_0)), Math.abs(Math.round(ccw_1)));
		var edge_dist = Math.max(Math.abs(ccw_0), Math.abs(ccw_1));
		var dist = Math.round(edge_dist);
		
		if (rotate_ratio === 0 || dist === 0) {
			return [ccw_0, ccw_1];
		}
		
		var current_total_pixel;
		if (ccw_0 === edge_dist) {
			current_total_pixel = (0 + 1) * dist + ccw_1;
		}
		else if (ccw_1 === edge_dist) {
			current_total_pixel = (2 + 1) * dist - ccw_0;
		}
		else if (ccw_0 === -edge_dist) {
			current_total_pixel = (4 + 1) * dist - ccw_1;
		}
		else if (ccw_1 === -edge_dist) {
			current_total_pixel = (6 + 1) * dist + ccw_0;
		}
		else {
			debugger;
			return [ccw_0, ccw_1];
		}
		//Dr.log('current_total_pixel', current_total_pixel);
		
		//rotate_ratio range is [0, 4)
		var rotate_pixel = Math.round(rotate_ratio * 2 * dist);
		//Dr.log('rotate_pixel', rotate_pixel);
		
		var result_total_pixel = (current_total_pixel + rotate_pixel) % (8 * dist);
		
		var result_edge = Math.floor(result_total_pixel / (2 * dist));
		var result_pixel = result_total_pixel - result_edge * 2 * dist - dist;
		
		//Dr.log('result_total_pixel', result_total_pixel);
		//Dr.log('result_edge', result_edge);
		//Dr.log('result_pixel', result_pixel);
		
		switch (result_edge) {
			case 0:
				ccw_0 = dist;
				ccw_1 = result_pixel;
				break;
			case 1:
				ccw_0 = -result_pixel;
				ccw_1 = dist;
				break;
			case 2:
				ccw_0 = -dist;
				ccw_1 = -result_pixel;
				break;
			case 3:
				ccw_0 = result_pixel;
				ccw_1 = -dist;
				break;
		}
		/*
		if (isNaN(ccw_0) || isNaN(ccw_1)) { debugger; }
		*/
		return [ccw_0, ccw_1];
	};
	
	Module.prototype.pixelRotate = function (center_vec, rotate_vec) {
		var dx = this.x - center_vec.x;
		var dy = this.y - center_vec.y;
		var dz = this.z - center_vec.z;
		
		//var dist = Math.max(Math.abs(dx), Math.abs(dy), Math.abs(dz));
		
		//should be z-x-y (performs the roll first, then the pitch, and finally the yaw)
		
		//Dr.log('start', dx, dy, dz, 'next', rotate_vec.z, dy, dx);
		
		//z axis (roll)
		var res = _pixel_rotate_by_axis(rotate_vec.z, dy, dx);
		dy = res[0];
		dx = res[1];
		
		//Dr.log('step', dx, dy, dz, 'next', rotate_vec.x, dz, dy);
		
		//x axis (pitch)
		var res = _pixel_rotate_by_axis(rotate_vec.x, dz, dy);
		dz = res[0];
		dy = res[1];
		
		//Dr.log('step', dx, dy, dz, 'next', rotate_vec.y, dx, dz);
		
		//y axis (yaw)
		var res = _pixel_rotate_by_axis(rotate_vec.y, dx, dz);
		dx = res[0];
		dz = res[1];
		
		//Dr.log('step', dx, dy, dz);
		
		var x = (center_vec.x + dx);
		var y = (center_vec.y + dy);
		var z = (center_vec.z + dz);
		
		//Dr.log('get', x, y, z);
		
		return new Module(Math.round(x), Math.round(y), Math.round(z));
	};
	
	Module.prototype.pixelize = function () {
		return new Module(Math.round(this.x), Math.round(this.y), Math.round(this.z));
	};
	
	/*
	Dr.log('should get [5, 5]', _pixel_rotate_by_axis(0.5, 5, 5, 0));
	Dr.log('should get [5, -5]', _pixel_rotate_by_axis(-0.5, 5, 5, 0));
	Dr.log('should get [5, 0]', _pixel_rotate_by_axis(4, 5, 5, 0));
	Dr.log('should get [-1, 5]', _pixel_rotate_by_axis(1.1, 5, 5, 0));
	
	var Pixel3D_Math = Dr.Get("Pixel3D_Math");
	var Module = Pixel3D_Math.Module;
	var test_1 = new Module(2, -1, -4);
	var test_2 = new Module(2, 0, -4);
	var center_vec = new Module(0, 0, 0);
	var rotate_vec = new Module(0, 2.455199999999994, 2.455199999999994);
	Dr.log('test_1', test_1.pixelRotate(center_vec, rotate_vec));
	Dr.log('test_2', test_2.pixelRotate(center_vec, rotate_vec));
	
	*/
	
	
	return Module;
});
