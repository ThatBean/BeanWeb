/** Actor 
 **** Dependency
 * Needs nothing
 * 
 **** Content
 * ActorState
 * ActorStatePool
 * 
 * 
 **/

//template for Logic and Action

/*

	The State Flow
	
	StatePool
		update loop
			activate State queue
				State
					enter
						check_mark
						check_priority
						check_re_enter
						check_other_condition
						check_...
						do init
						to update or exit
			
			update State queue
				State
					update
						to update or exit
			
			deactivate State queue
				State
					exit
						gather follow-up State-Priority List
						(the priority will not get bigger, usually keep the same)
			
		
*/



Dr.Declare('ActorExcludeArray', 'class');
Dr.Implement('ActorExcludeArray', function (global, module_get) {
	var Module = {};
	
	Module.prototype.init = function () {
		this._data_list = {};
		this._slot_status = {};
		this._priority = 0;
	};
	
	Module.prototype.add = function (data) {
		var tag = data.tag;
		var slot = data.slot;
		var priority = data.priority;
		
		//duplication
		if (this._data_list[tag]) return;
		if (this.check_exclude(slot, priority)) return;
		
		var res_data_list;
		if (priority < this._priority) {
			res_data_list = this._data_list;
			this._data_list = {};
			this._priority = priority;
		}
		
		for (var index in slot) {
			this._slot_status[slot[index]] = true;
		}
		this._data_list[tag] = data;
		
		return res_data_list;
	};
	
	Module.prototype.check_exclude = function (slot, priority) {
		if (priority < this._priority) return true;
		for (var index in slot) {
			if (this._slot_status[slot[index]]) return true;
		}
		return false;
	};
	
	Module.prototype.clear = function () {
		this._data_list = {};
		this._slot_status = {};
		this._priority = 0;
	};
	
	Module.create = function () {
		var instance = new Module;
		instance.init();
		return instance;
	};
	
	return Module;
});


Dr.Declare('ActorState', 'class');
Dr.Implement('ActorState', function (global, module_get) {
	var Module = {};
	
	Module.status = {
		PENDING: 'PENDING',
		ENTER: 'ENTER',
		ACTIVE: 'ACTIVE',
		EXIT: 'EXIT',
	};
	
	Module.prototype.init = function (tag, owner) {
		this._tag = tag;
		this._owner = owner;
		this._status = Module.status.PENDING;
	};
	
	Module.prototype.getTag = function () { return this._tag; };
	
	Module.prototype.enter = function (delta_time) {
		Dr.log('[enter]', this._tag);
		this._status = Module.status.ENTER;
	};
	
	Module.prototype.exit = function (delta_time) {
		Dr.log('[exit]', this._tag);
		this._status = Module.status.EXIT;
	};
	
	Module.prototype.update = function (delta_time) {
		Dr.log('[update]', this._tag);
		this._status = Module.status.ACTIVE;
	};
	
	Module.create = function (tag) {
		var instance = new Module;
		instance.init(tag);
		return instance;
	};
	
	//for state extending
	Module._instance_list = {};
	Module.registerState = function (tag, instance) {
		Module._instance_list[tag] = instance;
	};
	Module.getState = function (tag) {
		return Module._instance_list[tag];
	};
	
	return Module;
});


Dr.Declare('ActorStatePool', 'class');
Dr.Require('ActorStatePool', 'ActorState');
Dr.Implement('ActorStatePool', function (global, module_get) {
	
	var ActorState = module_get('ActorState');
	
	var Module = {};
	Module.status = ActorState.status;
	
	Module.prototype.init = function (owner) {
		this._owner = owner;
		this._state_data = {};	//map: tag - state, all available state
		
		this.resetStatePool();
	};
	
	Module.prototype.resetStatePool = function () {
		//for state holding & update(pending -> [check] -> enter -> [reg] -> active -> [self/interrupt] -> exit -> [unreg] -> pending)
		this._pending_list = [];
		this._enter_list = [];	//transition state
		this._active_list = [];
		this._exit_list = [];	//transition state
		//only tag is stored here
	};
	
	Module.prototype.update = function (delta_time) {
		var result_action_priority_list = [];
		
		//loop for control
		for (var state in this._active_state_list) {
			//update
			var action_priority_list = state.update(owner, delta_time);
			result_action_priority_list.concat(action_priority_list);
		};
		
		var result_action_priority_list = this.decideAction(result_action_priority_list);
		this.commitAction(result_action_priority_list);
	};
	
	Module.prototype.addState = function (state, slot, priority) {
		var tag = state.getTag();
		
		this._state_data
	};
	
	Module.prototype.removeStatebyTag = function (tag) {
		var tag = state.getTag();
		
		this._state_data
	};
	
	Module.prototype.applyState = function (state_priority_list) {
		
		
	};
	
	Module.prototype.decideAction = function (action_priority_list) {
		var max_priority = -1;
		var result_action_priority_list;
		
		for (var i in action_priority_list) {
			var state = action_priority_list[i][0];
			var priority = action_priority_list[i][1];
			
			if (priority >= max_priority) {
				if (priority > max_priority) {
					result_action_priority_list = [];
					max_priority = priority;
				}
				result_action_priority_list.push([state, priority]);
			};
		};
		
		return result_action_priority_list;
	};
	
	Module.prototype.commitAction = function (action_priority_list) {
		if (!action_priority_list || action_priority_list.length === 0) {
			return;
		};
		
		Dr.log('[commitAction]', action_priority_list);
		
		this._owner.getActionPool().applyAction(action_priority_list);
	};
	
	Module.create = function (owner) {
		var instance = new Module;
		instance.init(owner);
		return instance;
	};
	
	return Module;
});
