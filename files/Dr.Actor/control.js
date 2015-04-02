/** Actor 
 **** Dependency
 * Needs nothing
 * 
 **** Content
 * ActorControl
 * 
 * 
 * 
 * 
 **/

Dr.Declare('ActorControl', 'class');
Dr.Implement('ActorControl', function (global, module_get) {
	var Module = {};
	
	Module.prototype.init = function (actor) {
		this._actor = actor;
		
		this.resetControl();
	};
	
	Module.prototype.update = function (delta_time) {
		var result_state_priority_list = [];
		
		//loop for control
		for (var tag in this._control_data) {
			var data = this._control_data[tag];
			var update_func = data.update_func;
			
			//update
			var state_priority_list = update_func(data, delta_time);
			result_state_priority_list.concat(state_priority_list);
		};
		
		var result_state_priority_list = this.decideState(result_state_priority_list);
		this.commitState(result_state_priority_list);
	};
	
	Module.prototype.removeControl = function (tag) { this._control_data[tag] = null; };
	Module.prototype.resetControl = function () { this._control_data = {}; };
	Module.prototype.getControl = function (tag) { return tag ? this._control_data[tag] : this._control_data; };
	Module.prototype.addControl = function (tag, data) {
		if (!data || !data.update_func) {
			Dr.log('[addControl] error! invalid data', data);
			return;
		};
		
		//add item
		data.actor = this._actor;
		data.tag = tag;
		
		this._control_data[tag].data = data; 
	};
	
	Module.prototype.decideState = function (state_priority_list) {
		var max_priority = -1;
		var result_state_priority_list;
		
		for (var i in state_priority_list) {
			var state = state_priority_list[i][0];
			var priority = state_priority_list[i][1];
			
			if (priority >= max_priority) {
				if (priority > max_priority) {
					result_state_priority_list = [];
					max_priority = priority;
				}
				result_state_priority_list.push([state, priority]);
			};
		};
		
		return result_state_priority_list;
	};
	
	Module.prototype.commitState = function (state_priority_list) {
		if (!state_priority_list || state_priority_list.length === 0) {
			return;
		};
		
		Dr.log('[commitState]', state_priority_list);
		
		this._actor.getStatePool().applyState(state_priority_list);
	};
	
	Module.create = function (actor) {
		var instance = new Module;
		instance.init(actor);
		return instance;
	};
	
	return Module;
});
