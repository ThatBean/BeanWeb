/** Actor 
 **** Dependency
 * ActorStage
 * ActorStatePool
 * -- ActorState
 * ActorActionPool
 * -- ActorAction
 * 
 **** Content
 * Actor
 * ActorData
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
			this._id = null;	//used mostly with stage
			this._stage = null;	//the outer environment for this actor(or ActorManager, sort of)
			this._is_active = false;
			this._is_pause = false;
		}
		
		Actor.prototype.init = function () {
			this._data = new ActorData(this);		//data stored by this actor
			this._control = new ActorControl(this);	//superior to basic state flow, process manual/auto/scripted-auto control
			this._state_pool = new ActorStatePool(this);	//There are several kind of states for actor(idle, dead, move, attack, etc.), there can be more than 1 active state in pool
			this._action_pool = new ActorActionPool(this);	//There are several kind of actions for actor
		};
		
		Actor.prototype.update = function (delta_time) {
			if (this._is_active === true) {
				//update
				this._data.update(delta_time);
				this._control.update(delta_time);
				
				if (this._is_pause === false) {
					this._state_pool.update(delta_time);
					this._action_pool.update(delta_time);
				};
			};
		};
		
		Actor.prototype.setId = function (id) { this._id = _id; };
		Actor.prototype.getId = function () { return this._id; };
		
		Actor.prototype.setStage = function (stage) { this._stage = stage; };
		Actor.prototype.getStage = function () { return this._stage; };
		
		Actor.prototype.setActive = function (is_active) { this._is_active = is_active; };
		Actor.prototype.getActive = function () { return this._is_active; };
		
		Actor.prototype.setPause = function (is_pause) { this._is_pause = is_pause; };
		Actor.prototype.getPause = function () { return this._is_pause; };
		
		Actor.prototype.getData = function () { return this._data; };
		Actor.prototype.getControl = function () { return this._control; };
		Actor.prototype.getStatePool = function () { return this._state_pool; };
		Actor.prototype.getAction = function () { return this._action; };
		
		Actor.create = function () {
			var actor = new Actor;
			actor.init();
			return actor;
		};
		return Actor;
	})();
	Module.Actor = Actor;
	
	
	var ActorData = (function () {
		function ActorData(actor) {
			this._actor = actor;
			this._data = {};
		}
		
		ActorData.prototype.init = function () {
			this._data = {};
			this._created_time = Dr.now();
		};
		
		ActorData.prototype.update = function (delta_time) {
			if (this._is_active === true) {
				//update
				this._data.update(delta_time);
				this._control.update(delta_time);
				
				if (this._is_pause === false) {
					this._state_pool.update(delta_time);
					this._action_pool.update(delta_time);
				};
			};
		};
		
		ActorData.prototype.setId = function (id) { this._id = _id; };
		ActorData.prototype.getId = function () { return this._id; };
		
		ActorData.prototype.setStage = function (stage) { this._stage = stage; };
		ActorData.prototype.getStage = function () { return this._stage; };
		
		ActorData.create = function () {
			var actor_data = new ActorData;
			actor_data.init();
			return actor_data;
		};
		return ActorData;
	})();
	Module.ActorData = ActorData;
	
	return Module;
});
