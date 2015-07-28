Dr.Declare('DataHashMap', 'class');
Dr.Implement('DataHashMap', function (global, module_get) {
	
	var Module = function () {
		this._map = Object.create(null);
	}
	
	Module.prototype.checkKey = function (key) {
		return Object.hasOwnProperty.call(this._map, key);
	};
	
	Module.prototype.getMap = function () {
		return this._map;
	};
	
	return Module;
});