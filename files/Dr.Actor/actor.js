/** Actor 
 **** Dependency
 * ActorControl
 * ActorLogicPool
 * -- ActorLogic
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

Dr.Declare('Actor', 'class');
//Dr.Require('Actor', 'ActorData');
//Dr.Require('Actor', 'ActorControl');
//Dr.Require('Actor', 'ActorLogicPool');
//Dr.Require('Actor', 'ActorActionPool');
Dr.Implement('Actor', function (global, module_get) {
	
	var ActorData = module_get("ActorData");
	var ActorControl = module_get("ActorControl");
	var ActorLogicPool = module_get("ActorLogicPool");
	var ActorActionPool = module_get("ActorActionPool");
	
	var Module = function () {
		//
	}
	
	Module.prototype.init = function () {
		this._id = null;	//used mostly with stage
		this._stage = null;	//the outer environment for this actor(or ActorManager, sort of)
		this._is_active = false;
		this._is_pause = false;
		
		this._data = new ActorData(this);		//data stored by this actor
		this._control = new ActorControl(this);	//superior to basic logic flow, process manual/auto/scripted-auto control
		this._logic_pool = new ActorLogicPool(this);	//There are several kind of logics for actor(idle, dead, move, attack, etc.), there can be more than 1 active logic in pool
		this._action_pool = new ActorActionPool(this);	//There are several kind of actions for actor
	};
	
	Module.prototype.update = function (delta_time) {	//delta time should be in seconds
		if (this._is_active === true) {
			//update
			this._data.update(delta_time);
			this._control.update(delta_time);
			
			if (this._is_pause === false) {
				this._logic_pool.update(delta_time);
				this._action_pool.update(delta_time);
			};
		};
	};
	
	Module.prototype.setId = function (id) { this._id = _id; };
	Module.prototype.getId = function () { return this._id; };
	
	Module.prototype.setStage = function (stage) { this._stage = stage; };
	Module.prototype.getStage = function () { return this._stage; };
	
	Module.prototype.setActive = function (is_active) { this._is_active = is_active; };
	Module.prototype.getActive = function () { return this._is_active; };
	
	Module.prototype.setPause = function (is_pause) { this._is_pause = is_pause; };
	Module.prototype.getPause = function () { return this._is_pause; };
	
	Module.prototype.getData = function () { return this._data; };
	Module.prototype.getControl = function () { return this._control; };
	Module.prototype.getLogicPool = function () { return this._logic_pool; };
	Module.prototype.getAction = function () { return this._action; };
	
	Module.create = function () {
		var instance = new Module;
		instance.init();
		return instance;
	};
	
	return Module;
});



Dr.Declare('ActorData', 'class');
Dr.Implement('ActorData', function (global, module_get) {
	var Module = function () {
		//
	}
	
	Module.prototype.init = function (actor) {
		this._actor = actor;
		this._created_time = Dr.now();
		this._active_time = 0;
		
		this.resetData();
	};
	
	Module.prototype.update = function (delta_time) {
		this._active_time += delta_time;
	};
	
	Module.prototype.getActiveTime = function () { return this._active_time; };
	Module.prototype.getData = function () { return this._data; };
	Module.prototype.resetData = function () { this._data = {}; };
	
	Module.create = function (actor) {
		var instance = new Module;
		instance.init(actor);
		return instance;
	};
	
	return Module;
});