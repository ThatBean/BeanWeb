Dr.Declare('Matrix4', 'class');
Dr.Require('Matrix4', 'Vector3');
Dr.Implement('Matrix4', function (global, module_get) {
	
	var Vector3 = Dr.Get('Vector3');	//
	
	var Module = function () {
		this.m = [];
	}
	Module.prototype.isIdentity = function () {
		if (this.m[0] != 1.0 || this.m[5] != 1.0 || this.m[10] != 1.0 || this.m[15] != 1.0) {
			return false;
		}
		if (this.m[12] != 0.0 || this.m[13] != 0.0 || this.m[14] != 0.0 || this.m[4] != 0.0 || this.m[6] != 0.0 || this.m[7] != 0.0 || this.m[8] != 0.0 || this.m[9] != 0.0 || this.m[11] != 0.0 || this.m[12] != 0.0 || this.m[13] != 0.0 || this.m[14] != 0.0) {
			return false;
		}
		return true;
	};
	Module.prototype.determinant = function () {
		var temp1 = (this.m[10] * this.m[15]) - (this.m[11] * this.m[14]);
		var temp2 = (this.m[9] * this.m[15]) - (this.m[11] * this.m[13]);
		var temp3 = (this.m[9] * this.m[14]) - (this.m[10] * this.m[13]);
		var temp4 = (this.m[8] * this.m[15]) - (this.m[11] * this.m[12]);
		var temp5 = (this.m[8] * this.m[14]) - (this.m[10] * this.m[12]);
		var temp6 = (this.m[8] * this.m[13]) - (this.m[9] * this.m[12]);
		return ((((this.m[0] * (((this.m[5] * temp1) - (this.m[6] * temp2)) + (this.m[7] * temp3))) - (this.m[1] * (((this.m[4] * temp1) - (this.m[6] * temp4)) + (this.m[7] * temp5)))) + (this.m[2] * (((this.m[4] * temp2) - (this.m[5] * temp4)) + (this.m[7] * temp6)))) - (this.m[3] * (((this.m[4] * temp3) - (this.m[5] * temp5)) + (this.m[6] * temp6))));
	};
	Module.prototype.toArray = function () {
		return this.m;
	};
	Module.prototype.invert = function () {
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
	Module.prototype.multiply = function (other) {
		var result = new Module();
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
	Module.prototype.equals = function (value) {
		return (this.m[0] === value.m[0] && this.m[1] === value.m[1] && this.m[2] === value.m[2] && this.m[3] === value.m[3] && this.m[4] === value.m[4] && this.m[5] === value.m[5] && this.m[6] === value.m[6] && this.m[7] === value.m[7] && this.m[8] === value.m[8] && this.m[9] === value.m[9] && this.m[10] === value.m[10] && this.m[11] === value.m[11] && this.m[12] === value.m[12] && this.m[13] === value.m[13] && this.m[14] === value.m[14] && this.m[15] === value.m[15]);
	};
	Module.prototype.copy = function () {
		return Module.FromArray(this.m);
	};
	Module.FromValues = function (m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
		var result = new Module();
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
	Module.FromArray = function (matrix_array) {
		var result = new Module();
		result.m = matrix_array.slice(0);
		return result;
	};
	Module.Identity = function () {
		return Module.FromValues(1.0, 0, 0, 0, 0, 1.0, 0, 0, 0, 0, 1.0, 0, 0, 0, 0, 1.0);
	};
	Module.Zero = function () {
		return Module.FromValues(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
	};
	Module.Copy = function (source) {
		return Module.FromValues(source.m[0], source.m[1], source.m[2], source.m[3], source.m[4], source.m[5], source.m[6], source.m[7], source.m[8], source.m[9], source.m[10], source.m[11], source.m[12], source.m[13], source.m[14], source.m[15]);
	};
	Module.RotationX = function (angle) {
		var result = Module.Zero();
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
	Module.RotationY = function (angle) {
		var result = Module.Zero();
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
	Module.RotationZ = function (angle) {
		var result = Module.Zero();
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
	Module.RotationAxis = function (axis, angle) {
		var s = Math.sin(-angle);
		var c = Math.cos(-angle);
		var c1 = 1 - c;
		axis.normalize();
		var result = Module.Zero();
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
	Module.RotationYawPitchRoll = function (yaw, pitch, roll) {
		return Module.RotationZ(roll).multiply(Module.RotationX(pitch)).multiply(Module.RotationY(yaw));
	};
	Module.Scaling = function (x, y, z) {
		var result = Module.Zero();
		result.m[0] = x;
		result.m[5] = y;
		result.m[10] = z;
		result.m[15] = 1.0;
		return result;
	};
	Module.Translation = function (x, y, z) {
		var result = Module.Identity();
		result.m[12] = x;
		result.m[13] = y;
		result.m[14] = z;
		return result;
	};
	Module.LookAtLH = function (eye, target, up) {
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
		return Module.FromValues(x_axis.x, yAxis.x, z_axis.x, 0, x_axis.y, yAxis.y, z_axis.y, 0, x_axis.z, yAxis.z, z_axis.z, 0, ex, ey, ez, 1);
	};
	/*
	Module.PerspectiveLH = function (width, height, znear, zfar) {
		var matrix = Module.Zero();
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
	Module.PerspectiveFovLH = function (fov, aspect, znear, zfar) {
		var matrix = Module.Zero();
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
	Module.OrthographicLH = function (width, height, zoom) {
		var matrix = Module.Zero();
		var wh = zoom * Math.sqrt(width * height);
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
	Module.Transpose = function (matrix) {
		var result = new Module();
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
	
	return Module;
});
