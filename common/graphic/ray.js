Dr.Declare('Ray', 'class');
Dr.Require('Ray', 'Vector3');
Dr.Implement('Ray', function (global, module_get) {
	
	var Vector3 = Dr.Get('Vector3');	//for position
	
	var Module = function (origin, direction) {
		this.origin = origin.copy() || new Vector3(0, 0, 0);
		this.direction = direction.copy() || new Vector3(1, 0, 0);
	}
	Module.prototype.toString = function () {
		return "{origin: " + this.origin.toString() + " direction:" + this.direction.toString() + "}";
	};
	
	Module.prototype.closestPointToPoint = function (point) {
		var result = point.subtract(this.origin);
		var direction_distance = result.dot(this.direction);
		if (direction_distance < 0) {
			return this.origin.copy();
		}
		return this.direction.scale(direction_distance).add(this.origin);
	};
	
	Module.prototype.distanceToPoint = function (point) {
		var direction_distance = point.subtract(this.origin).dot(this.direction);
		// point behind the ray
		if (direction_distance < 0) {
			return this.origin.length(point);
		}
		return this.direction.scale(direction_distance).add(this.origin).length(point);
	};
		
	Module.Copy = function (source) {
		return new Module(source.origin, source.direction);
	};
	
	return Module;
});
