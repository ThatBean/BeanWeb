/** Actor 
 **** Dependency
 * ActorStage
 * ActorData
 * ActorStatePool
 * -- ActorState
 * ActorActionPool
 * -- ActorAction
 * 
 **** Content
 * Actor
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
			this._status = 'un_inited';
		}
		
		Actor.prototype.init = function () {
			this._id = null;	//used mostly with stage
			
			this._is_active = false;
			this._is_pause = false;
			
			this._stage = null;	//the outer environment for this actor(or ActorManager, sort of)
			
			this._data = new ActorData(this);		//data stored by this actor
			this._control = new ActorControl(this);	//superior to basic state flow, process manual/auto/scripted-auto control
			this._state_pool = new ActorStatePool(this);	//There are several kind of states for actor(idle, dead, move, attack, etc.), there can be more than 1 active state in pool
			this._action_pool = new ActorActionPool(this);	//There are several kind of actions for actor
		};
		
		
		Actor.prototype.setId = function (id) { this._id = _id; };
		Actor.prototype.getId = function () { return this._id; };
		
		Actor.prototype.setStage = function (stage) { this._stage = stage; };
		Actor.prototype.getStage = function () { return this._stage; };
		
		Actor.prototype.getData = function () { return this._data; };
		//private
		//Actor.prototype.getControl = function () { return this._control; };
		//Actor.prototype.getStatePool = function () { return this._state_pool; };
		//Actor.prototype.getAction = function () { return this._action; };
		
		
		Actor.prototype.update = function (delta_time) {
			//
			if (this._is_pause === false && this._is_active === true) {
				//update
				
				this._data.update(delta_time);
				this._control.update(delta_time);
				this._state_pool.update(delta_time);
				this._action_pool.update(delta_time);
				
				
			}
			
			
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
