/** Actor 
 **** Dependency
 * Needs nothing
 * 
 **** Content
 * Actor
 * Data
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
		function Actor() {
			this.r = r;
			this.g = g;
			this.b = b;
			this.a = a;
		}
		
		Actor.prototype.init = function () {
			this._actor_id = null;	//used mostly with stage
			
			this._is_active = false;
			this._is_pause = false;
			
			this._actor_stage = null;
			this._actor_data = new ActorData(this);
			this._actor_control = new ActorControl(this);
			this._actor_state = new ActorState(this);
			this._actor_action = new ActorAction(this);
		};
		
		Actor.prototype.getActorData = function () { return this._actor_data; };
		Actor.prototype.getActorId = function () { return this._actor_id; };
		
		Actor.prototype.setActorStage = function (actor_stage) { this._actor_stage = actor_stage; };
		Actor.prototype.getActorStage = function () { return this._actor_stage; };
		
		Actor.prototype.update = function (delta_time) {
			//
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
