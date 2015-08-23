Dr.Declare('Math', 'function_pack');
Dr.Implement('Math', function (global, module_get) {
	var Module = Module || {};
	
	Module.clamp = function (x, a, b) {
		return (x < a) ? a : ((x > b) ? b : x);
	};

	Module.smoothstep = function (x, min, max) {
		if ( x <= min ) return 0;
		if ( x >= max ) return 1;
		x = ( x - min ) / ( max - min );
		return x * x * ( 3 - 2 * x );
	};

	Module.degToRad = function () {
		var degreeToRadiansFactor = Math.PI / 180;
		return function (degrees) {
			return degrees * degreeToRadiansFactor;
		};
	}();

	Module.radToDeg = function () {
		var radianToDegreesFactor = 180 / Math.PI;
		return function (radians) {
			return radians * radianToDegreesFactor;
		};
	}();
	
	return Module;
});
