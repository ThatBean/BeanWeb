/** Pixel3D_Math 
 **** Dependency
 * Needs nothing
 * 
 **** Content
 * Color4
 * Vector3
 * Matrix
 * 
 **/

Dr.Declare('Pixel3D_Math', 'class');
Dr.Implement('Pixel3D_Math', function (global, module_get) {
	var Module = Module || {};
	
	var Color4 = (function () {
		function Color4(r, g, b, a) {
			this.r = r;
			this.g = g;
			this.b = b;
			this.a = a;
		}
		Color4.prototype.toString = function () {
			return "{R: " + this.r + " G:" + this.g + " B:" + this.b + " A:" + this.a + "}";
		};
		Color4.prototype.toArray = function () {
			return [this.r, this.g, this.b, this.a];
		};
		Color4.prototype.copy = function () {
			return new Color4(this.r, this.g, this.b, this.a);
		};
		
		Color4.FromArray = function (array, offset) {
			if (!offset) {
				offset = 0;
			}
			return new Color4(array[offset], array[offset + 1], array[offset + 2], array[offset + 3]);
		};
		Color4.Random = function Random (alpha) {
			var a = (alpha ? alpha : Math.random());
			return new Color4(Math.random(), Math.random(), Math.random(), a);
		};
		Color4.Blend = function Blend (base_color, apply_color) {
			var r, g, b, a;
			var aa = apply_color.a;
			//normal blend
			r = base_color.r * (1 - aa) + apply_color.r * aa;
			g = base_color.g * (1 - aa) + apply_color.g * aa;
			b = base_color.b * (1 - aa) + apply_color.b * aa;
			a = 1 - (1 - base_color.a) * (1 - aa);
			return new Color4(r, g, b, a);
		};
		Color4.MethodBlend = function MethodBlend (base_color, apply_color, method, intensity) {
			var r, g, b, a;
			var ba = base_color.a;
			var aa = apply_color.a;
			//blend
			if (method == "L") {	//lighting
				if (intensity <= 0) {	//no need to blend
					return new Color4(base_color.r, base_color.g, base_color.b, base_color.a);
				}
				if (intensity > 1) {
					Dr.log("[MethodBlend|warning] intensity > 1 | intensity = "+intensity);
					intensity = 1;
				}//aa = (apply_color.r + apply_color.g + apply_color.b) / 255 / 3 * aa * intensity;
				aa *= intensity;
				r = Math.max(base_color.r * ba, apply_color.r * aa);
				g = Math.max(base_color.g * ba, apply_color.g * aa);
				b = Math.max(base_color.b * ba, apply_color.b * aa);
				a = 1 - (1 - ba) * (1 - aa);
			}
			
			if (method == "F") {	//face + lighting
				/*
				r = base_color.r * (1 - apply_color.r) * aa;
				g = base_color.g * (1 - apply_color.g) * aa;
				b = base_color.b * (1 - apply_color.b) * aa;
				*/
				aa = aa / (aa + ba);
				r = base_color.r * (1 - aa) + (apply_color.r * aa);
				g = base_color.g * (1 - aa) + (apply_color.g * aa);
				b = base_color.b * (1 - aa) + (apply_color.b * aa);
				a = ba;
			}
			
			/*
			Dr.log("Method:"+method+"<br />"
			+"intensity:"+intensity+"<br />"
			+"Base:"+base_color+"<br />"
			+"Apply:"+apply_color+"<br />"
			+"Get:"+new Color4(r, g, b, a)+"<br />");
			*/
			
			return new Color4(r, g, b, a);
		};
		return Color4;
	})();
	Module.Color4 = Color4;
/*Not used
	var Vector2 = (function () {
		function Vector2(x, y) {
			this.x = x;
			this.y = y;
		}
		Vector2.prototype.toString = function () {
			return "{X: " + this.x + " Y:" + this.y + "}";
		};
		Vector2.prototype.add = function (vector) {
			return new Vector2(this.x + vector.x, this.y + vector.y);
		};
		Vector2.prototype.subtract = function (vector) {
			return new Vector2(this.x - vector.x, this.y - vector.y);
		};
		Vector2.prototype.negate = function () {
			return new Vector2(-this.x, -this.y);
		};
		Vector2.prototype.scale = function (scale) {
			return new Vector2(this.x * scale, this.y * scale);
		};
		Vector2.prototype.equals = function (vector) {
			return this.x === vector.x && this.y === vector.y;
		};
		Vector2.prototype.length = function () {
			return Math.sqrt(this.x * this.x + this.y * this.y);
		};
		Vector2.prototype.lengthSquared = function () {
			return (this.x * this.x + this.y * this.y);
		};
		Vector2.prototype.normalize = function () {
			var len = this.length();
			if (len === 0) {
				return;
			}
			var num = 1.0 / len;
			this.x *= num;
			this.y *= num;
		};
		Vector2.Zero = function () {
			return new Vector2(0, 0);
		};
		Vector2.Copy = function (source) {
			return new Vector2(source.x, source.y);
		};
		Vector2.Normalize = function (vector) {
			var newVector = Vector2.Copy(vector);
			newVector.normalize();
			return newVector;
		};
		Vector2.Minimize = function (left, right) {
			var x = (left.x < right.x) ? left.x : right.x;
			var y = (left.y < right.y) ? left.y : right.y;
			return new Vector2(x, y);
		};
		Vector2.Maximize = function (left, right) {
			var x = (left.x > right.x) ? left.x : right.x;
			var y = (left.y > right.y) ? left.y : right.y;
			return new Vector2(x, y);
		};
		Vector2.Transform = function (vector, transformation) {
			var x = (vector.x * transformation.m[0]) + (vector.y * transformation.m[4]);
			var y = (vector.x * transformation.m[1]) + (vector.y * transformation.m[5]);
			return new Vector2(x, y);
		};
		Vector2.Distance = function (value1, value2) {
			return Math.sqrt(Vector2.DistanceSquared(value1, value2));
		};
		Vector2.DistanceSquared = function (value1, value2) {
			var x = value1.x - value2.x;
			var y = value1.y - value2.y;
			return (x * x) + (y * y);
		};
		return Vector2;
	})();
	Module.Vector2 = Vector2;
	*/
	var Vector3 = (function () {
		function Vector3(initialX, initialY, initialZ) {
			this.x = initialX;
			this.y = initialY;
			this.z = initialZ;
		}
		Vector3.prototype.toString = function () {
			return "{X: " + this.x + " Y:" + this.y + " Z:" + this.z + "}";
		};
		Vector3.prototype.toArray = function () {
			return [this.x, this.y, this.z];
		};
		Vector3.prototype.add = function (vector) {
			return new Vector3(this.x + vector.x, this.y + vector.y, this.z + vector.z);
		};
		Vector3.prototype.subtract = function (vector) {
			return new Vector3(this.x - vector.x, this.y - vector.y, this.z - vector.z);
		};
		Vector3.prototype.negate = function () {
			return new Vector3(-this.x, -this.y, -this.z);
		};
		Vector3.prototype.scale = function (scale) {
			return new Vector3(this.x * scale, this.y * scale, this.z * scale);
		};
		Vector3.prototype.equals = function (vector) {
			return this.x === vector.x && this.y === vector.y && this.z === vector.z;
		};
		Vector3.prototype.multiply = function (vector) {
			return new Vector3(this.x * vector.x, this.y * vector.y, this.z * vector.z);
		};
		Vector3.prototype.divide = function (vector) {
			return new Vector3(this.x / vector.x, this.y / vector.y, this.z / vector.z);
		};
		Vector3.prototype.length = function () {
			return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
		};
		Vector3.prototype.lengthSquared = function () {
			return (this.x * this.x + this.y * this.y + this.z * this.z);
		};
		Vector3.prototype.normalize = function () {
			var len = this.length();
			if (len === 0) {
				return;
			}
			var num = 1.0 / len;
			this.x *= num;
			this.y *= num;
			this.z *= num;
		};
		Vector3.prototype.toInt = function () {
			this.x = this.x >> 0;
			this.y = this.y >> 0;
			this.z = this.z >> 0;
		};
		Vector3.prototype.copy = function () {
			return new Vector3(this.x, this.y, this.z);
		};
		
		
		Vector3.prototype.pixelize = function () {
			return new Vector3(Math.round(this.x), Math.round(this.y), Math.round(this.z));
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
			if (isNaN(ccw_0) || isNaN(ccw_1)) {
				debugger;
			}
			*/
			return [ccw_0, ccw_1];
		};
		
		Vector3.prototype.pixelRotate = function (center_vec, rotate_vec) {
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
			
			return new Vector3(Math.round(x), Math.round(y), Math.round(z));
		};
		
		/*
		Dr.log('should get [5, 5]', _pixel_rotate_by_axis(0.5, 5, 5, 0));
		Dr.log('should get [5, -5]', _pixel_rotate_by_axis(-0.5, 5, 5, 0));
		Dr.log('should get [5, 0]', _pixel_rotate_by_axis(4, 5, 5, 0));
		Dr.log('should get [-1, 5]', _pixel_rotate_by_axis(1.1, 5, 5, 0));
		
		var Pixel3D_Math = Dr.Get("Pixel3D_Math");
		var Vector3 = Pixel3D_Math.Vector3;
		var test_1 = new Vector3(2, -1, -4);
		var test_2 = new Vector3(2, 0, -4);
		var center_vec = new Vector3(0, 0, 0);
		var rotate_vec = new Vector3(0, 2.455199999999994, 2.455199999999994);
		Dr.log('test_1', test_1.pixelRotate(center_vec, rotate_vec));
		Dr.log('test_2', test_2.pixelRotate(center_vec, rotate_vec));
		
		*/
		Vector3.FromArray = function (array, offset) {
			if (!offset) {
				offset = 0;
			}
			return new Vector3(array[offset], array[offset + 1], array[offset + 2]);
		};
		Vector3.Zero = function () {
			return new Vector3(0, 0, 0);
		};
		Vector3.Up = function () {
			return new Vector3(0, 1.0, 0);
		};
		Vector3.Copy = function (source) {
			return new Vector3(source.x, source.y, source.z);
		};
		Vector3.TransformCoordinates = function (vector, transformation) {
			var x = (vector.x * transformation.m[0]) + (vector.y * transformation.m[4]) + (vector.z * transformation.m[8]) + transformation.m[12];
			var y = (vector.x * transformation.m[1]) + (vector.y * transformation.m[5]) + (vector.z * transformation.m[9]) + transformation.m[13];
			var z = (vector.x * transformation.m[2]) + (vector.y * transformation.m[6]) + (vector.z * transformation.m[10]) + transformation.m[14];
			var w = (vector.x * transformation.m[3]) + (vector.y * transformation.m[7]) + (vector.z * transformation.m[11]) + transformation.m[15];
			return new Vector3(x / w, y / w, z / w);
		};
		Vector3.TransformNormal = function (vector, transformation) {
			var x = (vector.x * transformation.m[0]) + (vector.y * transformation.m[4]) + (vector.z * transformation.m[8]);
			var y = (vector.x * transformation.m[1]) + (vector.y * transformation.m[5]) + (vector.z * transformation.m[9]);
			var z = (vector.x * transformation.m[2]) + (vector.y * transformation.m[6]) + (vector.z * transformation.m[10]);
			return new Vector3(x, y, z);
		};
		Vector3.Dot = function (left, right) {
			return (left.x * right.x + left.y * right.y + left.z * right.z);
		};
		Vector3.Cross = function (left, right) {
			var x = left.y * right.z - left.z * right.y;
			var y = left.z * right.x - left.x * right.z;
			var z = left.x * right.y - left.y * right.x;
			return new Vector3(x, y, z);
		};
		Vector3.Normalize = function (vector) {
			var newVector = Vector3.Copy(vector);
			newVector.normalize();
			return newVector;
		};
		Vector3.Distance = function (value1, value2) {
			return Math.sqrt(Vector3.DistanceSquared(value1, value2));
		};
		Vector3.DistanceSquared = function (value1, value2) {
			var x = value1.x - value2.x;
			var y = value1.y - value2.y;
			var z = value1.z - value2.z;
			return (x * x) + (y * y) + (z * z);
		};
		return Vector3;
	})();
	Module.Vector3 = Vector3;

	var Matrix = (function () {
		function Matrix() {
			this.m = [];
		}
		Matrix.prototype.isIdentity = function () {
			if (this.m[0] != 1.0 || this.m[5] != 1.0 || this.m[10] != 1.0 || this.m[15] != 1.0) {
				return false;
			}
			if (this.m[12] != 0.0 || this.m[13] != 0.0 || this.m[14] != 0.0 || this.m[4] != 0.0 || this.m[6] != 0.0 || this.m[7] != 0.0 || this.m[8] != 0.0 || this.m[9] != 0.0 || this.m[11] != 0.0 || this.m[12] != 0.0 || this.m[13] != 0.0 || this.m[14] != 0.0) {
				return false;
			}
			return true;
		};
		Matrix.prototype.determinant = function () {
			var temp1 = (this.m[10] * this.m[15]) - (this.m[11] * this.m[14]);
			var temp2 = (this.m[9] * this.m[15]) - (this.m[11] * this.m[13]);
			var temp3 = (this.m[9] * this.m[14]) - (this.m[10] * this.m[13]);
			var temp4 = (this.m[8] * this.m[15]) - (this.m[11] * this.m[12]);
			var temp5 = (this.m[8] * this.m[14]) - (this.m[10] * this.m[12]);
			var temp6 = (this.m[8] * this.m[13]) - (this.m[9] * this.m[12]);
			return ((((this.m[0] * (((this.m[5] * temp1) - (this.m[6] * temp2)) + (this.m[7] * temp3))) - (this.m[1] * (((this.m[4] * temp1) - (this.m[6] * temp4)) + (this.m[7] * temp5)))) + (this.m[2] * (((this.m[4] * temp2) - (this.m[5] * temp4)) + (this.m[7] * temp6)))) - (this.m[3] * (((this.m[4] * temp3) - (this.m[5] * temp5)) + (this.m[6] * temp6))));
		};
		Matrix.prototype.toArray = function () {
			return this.m;
		};
		Matrix.prototype.invert = function () {
			var l1 = this.m[0];
			var l2 = this.m[1];
			var l3 = this.m[2];
			var l4 = this.m[3];
			var l5 = this.m[4];
			var l6 = this.m[5];
			var l7 = this.m[6];
			var l8 = this.m[7];
			var l9 = this.m[8];
			var l10 = this.m[9];
			var l11 = this.m[10];
			var l12 = this.m[11];
			var l13 = this.m[12];
			var l14 = this.m[13];
			var l15 = this.m[14];
			var l16 = this.m[15];
			var l17 = (l11 * l16) - (l12 * l15);
			var l18 = (l10 * l16) - (l12 * l14);
			var l19 = (l10 * l15) - (l11 * l14);
			var l20 = (l9 * l16) - (l12 * l13);
			var l21 = (l9 * l15) - (l11 * l13);
			var l22 = (l9 * l14) - (l10 * l13);
			var l23 = ((l6 * l17) - (l7 * l18)) + (l8 * l19);
			var l24 = -(((l5 * l17) - (l7 * l20)) + (l8 * l21));
			var l25 = ((l5 * l18) - (l6 * l20)) + (l8 * l22);
			var l26 = -(((l5 * l19) - (l6 * l21)) + (l7 * l22));
			var l27 = 1.0 / ((((l1 * l23) + (l2 * l24)) + (l3 * l25)) + (l4 * l26));
			var l28 = (l7 * l16) - (l8 * l15);
			var l29 = (l6 * l16) - (l8 * l14);
			var l30 = (l6 * l15) - (l7 * l14);
			var l31 = (l5 * l16) - (l8 * l13);
			var l32 = (l5 * l15) - (l7 * l13);
			var l33 = (l5 * l14) - (l6 * l13);
			var l34 = (l7 * l12) - (l8 * l11);
			var l35 = (l6 * l12) - (l8 * l10);
			var l36 = (l6 * l11) - (l7 * l10);
			var l37 = (l5 * l12) - (l8 * l9);
			var l38 = (l5 * l11) - (l7 * l9);
			var l39 = (l5 * l10) - (l6 * l9);
			this.m[0] = l23 * l27;
			this.m[4] = l24 * l27;
			this.m[8] = l25 * l27;
			this.m[12] = l26 * l27;
			this.m[1] = -(((l2 * l17) - (l3 * l18)) + (l4 * l19)) * l27;
			this.m[5] = (((l1 * l17) - (l3 * l20)) + (l4 * l21)) * l27;
			this.m[9] = -(((l1 * l18) - (l2 * l20)) + (l4 * l22)) * l27;
			this.m[13] = (((l1 * l19) - (l2 * l21)) + (l3 * l22)) * l27;
			this.m[2] = (((l2 * l28) - (l3 * l29)) + (l4 * l30)) * l27;
			this.m[6] = -(((l1 * l28) - (l3 * l31)) + (l4 * l32)) * l27;
			this.m[10] = (((l1 * l29) - (l2 * l31)) + (l4 * l33)) * l27;
			this.m[14] = -(((l1 * l30) - (l2 * l32)) + (l3 * l33)) * l27;
			this.m[3] = -(((l2 * l34) - (l3 * l35)) + (l4 * l36)) * l27;
			this.m[7] = (((l1 * l34) - (l3 * l37)) + (l4 * l38)) * l27;
			this.m[11] = -(((l1 * l35) - (l2 * l37)) + (l4 * l39)) * l27;
			this.m[15] = (((l1 * l36) - (l2 * l38)) + (l3 * l39)) * l27;
			return this;
		};
		Matrix.prototype.multiply = function (other) {
			var result = new Matrix();
			result.m[0] = this.m[0] * other.m[0] + this.m[1] * other.m[4] + this.m[2] * other.m[8] + this.m[3] * other.m[12];
			result.m[1] = this.m[0] * other.m[1] + this.m[1] * other.m[5] + this.m[2] * other.m[9] + this.m[3] * other.m[13];
			result.m[2] = this.m[0] * other.m[2] + this.m[1] * other.m[6] + this.m[2] * other.m[10] + this.m[3] * other.m[14];
			result.m[3] = this.m[0] * other.m[3] + this.m[1] * other.m[7] + this.m[2] * other.m[11] + this.m[3] * other.m[15];
			result.m[4] = this.m[4] * other.m[0] + this.m[5] * other.m[4] + this.m[6] * other.m[8] + this.m[7] * other.m[12];
			result.m[5] = this.m[4] * other.m[1] + this.m[5] * other.m[5] + this.m[6] * other.m[9] + this.m[7] * other.m[13];
			result.m[6] = this.m[4] * other.m[2] + this.m[5] * other.m[6] + this.m[6] * other.m[10] + this.m[7] * other.m[14];
			result.m[7] = this.m[4] * other.m[3] + this.m[5] * other.m[7] + this.m[6] * other.m[11] + this.m[7] * other.m[15];
			result.m[8] = this.m[8] * other.m[0] + this.m[9] * other.m[4] + this.m[10] * other.m[8] + this.m[11] * other.m[12];
			result.m[9] = this.m[8] * other.m[1] + this.m[9] * other.m[5] + this.m[10] * other.m[9] + this.m[11] * other.m[13];
			result.m[10] = this.m[8] * other.m[2] + this.m[9] * other.m[6] + this.m[10] * other.m[10] + this.m[11] * other.m[14];
			result.m[11] = this.m[8] * other.m[3] + this.m[9] * other.m[7] + this.m[10] * other.m[11] + this.m[11] * other.m[15];
			result.m[12] = this.m[12] * other.m[0] + this.m[13] * other.m[4] + this.m[14] * other.m[8] + this.m[15] * other.m[12];
			result.m[13] = this.m[12] * other.m[1] + this.m[13] * other.m[5] + this.m[14] * other.m[9] + this.m[15] * other.m[13];
			result.m[14] = this.m[12] * other.m[2] + this.m[13] * other.m[6] + this.m[14] * other.m[10] + this.m[15] * other.m[14];
			result.m[15] = this.m[12] * other.m[3] + this.m[13] * other.m[7] + this.m[14] * other.m[11] + this.m[15] * other.m[15];
			return result;
		};
		Matrix.prototype.equals = function (value) {
			return (this.m[0] === value.m[0] && this.m[1] === value.m[1] && this.m[2] === value.m[2] && this.m[3] === value.m[3] && this.m[4] === value.m[4] && this.m[5] === value.m[5] && this.m[6] === value.m[6] && this.m[7] === value.m[7] && this.m[8] === value.m[8] && this.m[9] === value.m[9] && this.m[10] === value.m[10] && this.m[11] === value.m[11] && this.m[12] === value.m[12] && this.m[13] === value.m[13] && this.m[14] === value.m[14] && this.m[15] === value.m[15]);
		};
		Matrix.prototype.copy = function () {
			return Matrix.FromArray(this.m);
		};
		Matrix.FromValues = function (m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
			var result = new Matrix();
			result.m[0] = m11;
			result.m[1] = m12;
			result.m[2] = m13;
			result.m[3] = m14;
			result.m[4] = m21;
			result.m[5] = m22;
			result.m[6] = m23;
			result.m[7] = m24;
			result.m[8] = m31;
			result.m[9] = m32;
			result.m[10] = m33;
			result.m[11] = m34;
			result.m[12] = m41;
			result.m[13] = m42;
			result.m[14] = m43;
			result.m[15] = m44;
			return result;
		};
		Matrix.FromArray = function (matrix_array) {
			var result = new Matrix();
			result.m = matrix_array.slice(0);
			return result;
		};
		Matrix.Identity = function () {
			return Matrix.FromValues(1.0, 0, 0, 0, 0, 1.0, 0, 0, 0, 0, 1.0, 0, 0, 0, 0, 1.0);
		};
		Matrix.Zero = function () {
			return Matrix.FromValues(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
		};
		Matrix.Copy = function (source) {
			return Matrix.FromValues(source.m[0], source.m[1], source.m[2], source.m[3], source.m[4], source.m[5], source.m[6], source.m[7], source.m[8], source.m[9], source.m[10], source.m[11], source.m[12], source.m[13], source.m[14], source.m[15]);
		};
		Matrix.RotationX = function (angle) {
			var result = Matrix.Zero();
			var s = Math.sin(angle);
			var c = Math.cos(angle);
			result.m[0] = 1.0;
			result.m[15] = 1.0;
			result.m[5] = c;
			result.m[10] = c;
			result.m[9] = -s;
			result.m[6] = s;
			return result;
		};
		Matrix.RotationY = function (angle) {
			var result = Matrix.Zero();
			var s = Math.sin(angle);
			var c = Math.cos(angle);
			result.m[5] = 1.0;
			result.m[15] = 1.0;
			result.m[0] = c;
			result.m[2] = -s;
			result.m[8] = s;
			result.m[10] = c;
			return result;
		};
		Matrix.RotationZ = function (angle) {
			var result = Matrix.Zero();
			var s = Math.sin(angle);
			var c = Math.cos(angle);
			result.m[10] = 1.0;
			result.m[15] = 1.0;
			result.m[0] = c;
			result.m[1] = s;
			result.m[4] = -s;
			result.m[5] = c;
			return result;
		};
		Matrix.RotationAxis = function (axis, angle) {
			var s = Math.sin(-angle);
			var c = Math.cos(-angle);
			var c1 = 1 - c;
			axis.normalize();
			var result = Matrix.Zero();
			result.m[0] = (axis.x * axis.x) * c1 + c;
			result.m[1] = (axis.x * axis.y) * c1 - (axis.z * s);
			result.m[2] = (axis.x * axis.z) * c1 + (axis.y * s);
			result.m[3] = 0.0;
			result.m[4] = (axis.y * axis.x) * c1 + (axis.z * s);
			result.m[5] = (axis.y * axis.y) * c1 + c;
			result.m[6] = (axis.y * axis.z) * c1 - (axis.x * s);
			result.m[7] = 0.0;
			result.m[8] = (axis.z * axis.x) * c1 - (axis.y * s);
			result.m[9] = (axis.z * axis.y) * c1 + (axis.x * s);
			result.m[10] = (axis.z * axis.z) * c1 + c;
			result.m[11] = 0.0;
			result.m[15] = 1.0;
			return result;
		};
		Matrix.RotationYawPitchRoll = function (yaw, pitch, roll) {
			return Matrix.RotationZ(roll).multiply(Matrix.RotationX(pitch)).multiply(Matrix.RotationY(yaw));
		};
		Matrix.Scaling = function (x, y, z) {
			var result = Matrix.Zero();
			result.m[0] = x;
			result.m[5] = y;
			result.m[10] = z;
			result.m[15] = 1.0;
			return result;
		};
		Matrix.Translation = function (x, y, z) {
			var result = Matrix.Identity();
			result.m[12] = x;
			result.m[13] = y;
			result.m[14] = z;
			return result;
		};
		Matrix.LookAtLH = function (eye, target, up) {
			var z_axis = target.subtract(eye);
			z_axis.normalize();
			var x_axis = Vector3.Cross(up, z_axis);
			x_axis.normalize();
			if (x_axis.x ==0 && x_axis.y ==0 && x_axis.z ==0) {
				x_axis = new Vector3(1, 0, 0);
			}
			var yAxis = Vector3.Cross(z_axis, x_axis);
			yAxis.normalize();
			var ex = -Vector3.Dot(x_axis, eye);
			var ey = -Vector3.Dot(yAxis, eye);
			var ez = -Vector3.Dot(z_axis, eye);
			return Matrix.FromValues(x_axis.x, yAxis.x, z_axis.x, 0, x_axis.y, yAxis.y, z_axis.y, 0, x_axis.z, yAxis.z, z_axis.z, 0, ex, ey, ez, 1);
		};
		/*
		Matrix.PerspectiveLH = function (width, height, znear, zfar) {
			var matrix = Matrix.Zero();
			matrix.m[0] = (2.0 * znear) / width;
			matrix.m[1] = matrix.m[2] = matrix.m[3] = 0.0;
			matrix.m[5] = (2.0 * znear) / height;
			matrix.m[4] = matrix.m[6] = matrix.m[7] = 0.0;
			matrix.m[10] = -zfar / (znear - zfar);
			matrix.m[8] = matrix.m[9] = 0.0;
			matrix.m[11] = 1.0;
			matrix.m[12] = matrix.m[13] = matrix.m[15] = 0.0;
			matrix.m[14] = (znear * zfar) / (znear - zfar);
			return matrix;
		};
		Matrix.PerspectiveFovLH = function (fov, aspect, znear, zfar) {
			var matrix = Matrix.Zero();
			var tan = 1.0 / (Math.tan(fov * 0.5));
			matrix.m[0] = tan / aspect;
			matrix.m[1] = matrix.m[2] = matrix.m[3] = 0.0;
			matrix.m[5] = tan;
			matrix.m[4] = matrix.m[6] = matrix.m[7] = 0.0;
			matrix.m[8] = matrix.m[9] = 0.0;
			matrix.m[10] = -zfar / (znear - zfar);
			matrix.m[11] = 1.0;
			matrix.m[12] = matrix.m[13] = matrix.m[15] = 0.0;
			matrix.m[14] = (znear * zfar) / (znear - zfar);
			return matrix;
		};
		*/
		Matrix.OrthographicLH = function (width, height, zoom) {
			var matrix = Matrix.Zero();
			var wh=zoom * Math.sqrt(width * height);
			matrix.m[0] = wh / width;
			matrix.m[5] = wh / height;
			matrix.m[10] = 1;
			/*
			00 01 02 03
			04 05 06 07
			08 09 10 11
			12 13 14 15
			
			matrix.m[0] = (2.0 * near) / (right-left);
			matrix.m[5] = (2.0 * near) / (top-bottom);
			matrix.m[10] = -far / (near - far);

			matrix.m[0] = 2.0 / (right-left);
			matrix.m[5] = 2.0 / (top-bottom);
			matrix.m[10] = 2.0 / (far-near);
			matrix.m[12] = -(right+left) / (right-left);
			matrix.m[13] = -(top+bottom) / (top-bottom);
			matrix.m[14] = -(far+near) / (far-near);
			*/
			matrix.m[15] = 1;
			return matrix;
		};
		Matrix.Transpose = function (matrix) {
			var result = new Matrix();
			result.m[0] = matrix.m[0];
			result.m[1] = matrix.m[4];
			result.m[2] = matrix.m[8];
			result.m[3] = matrix.m[12];
			result.m[4] = matrix.m[1];
			result.m[5] = matrix.m[5];
			result.m[6] = matrix.m[9];
			result.m[7] = matrix.m[13];
			result.m[8] = matrix.m[2];
			result.m[9] = matrix.m[6];
			result.m[10] = matrix.m[10];
			result.m[11] = matrix.m[14];
			result.m[12] = matrix.m[3];
			result.m[13] = matrix.m[7];
			result.m[14] = matrix.m[11];
			result.m[15] = matrix.m[15];
			return result;
		};
		return Matrix;
	})();
	Module.Matrix = Matrix;
	
	return Module;
});
