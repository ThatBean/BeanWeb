/** Actor 
 **** Dependency
 * Needs nothing
 * 
 **** Content
 * Actor
 * Logic
 * Action
 * 
 * 
 * 
 * 
 **/

Dr.Declare('Actor', 'class_pack');
Dr.Implement('Actor', function (global, module_get) {
	var Module = Module || {};
	
	var Actor = (function () {
		function Actor(r, g, b, a) {
			this.r = r;
			this.g = g;
			this.b = b;
			this.a = a;
		}
		
		Actor.prototype.toString = function () {
			return "{R: " + this.r + " G:" + this.g + " B:" + this.b + " A:" + this.a + "}";
		};
		Actor.prototype.toArray = function () {
			return [this.r, this.g, this.b, this.a];
		};
		
		Actor.Random = function Random (alpha) {
			var a = (alpha ? alpha : Math.random());
			return new Actor(Math.random(), Math.random(), Math.random(), a);
		};
		return Actor;
	})();
	Module.Actor = Actor;
	
	return Module;
});
