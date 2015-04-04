/** Advice 
 **** Dependency
 * Needs nothing
 * 
 **** Content
 * Advice
 * Source
 * 
 * 
 * 
 **/

//a higher logic strategy

/*

	The Flow
	
	AdvicePool - single in game will hold all advice, needed?
	
	AdviceBag - every Actor in game will hold one of these
		pick - pick a advice of some aspect, for how many times
			
			
		update - update picked advice
			
		
		 - update picked advice
*/

 
Dr.Declare('Advice_Opinion', 'class');
Dr.Implement('Advice_Opinion', function (global, module_get) {
	var Module = function () {
		//
	}
	
	Module.prototype.init = function (credit_total, favor_total, credit_count, favor_count) {
		this._credit_total = credit_total || 0.5;
		this._credit_count = credit_count || 1;
		this._favor_total = favor_total || 0.5;
		this._favor_count = favor_count || 1;
		
		this._origin = null;
	};
	
	Module.prototype.setOrigin = function (origin) { this._origin = origin; };
	Module.prototype.getOrigin = function () { return this._origin; };
	Module.prototype.getCredit = function () { return this._credit_total / this._credit_count; };
	Module.prototype.getFavor = function () { return this._favor_total / this._favor_count; };
	Module.prototype.addCredit = function (value) { this._credit_total += value; this._credit_count++; };
	Module.prototype.addFavor = function (value) { this._favor_total += value; this._favor_count++; };
	
	//for a bool result
	Module.prototype.decide = function (opinion) {
		//this.getCredit();	//other's opinion about you will not related to your consider
		///TODO: think a better way
		return (opinion.getCredit() + opinion.getFavor() * this.getFavor()) >= 0.5;
	};
	
	//for take in feedback of a decision
	Module.prototype.change = function (opinion, value) {
		opinion.getOrigin().addCredit(value);
		opinion.addCredit(value);
			
		opinion.addFavor(value);
		this.addFavor(value);
	};
	
	Module.prototype.copy = function () {
		var copy_instance = Module.create(this._credit_total, this._favor_total, this._credit_count, this._favor_count);
		copy_instance.setOrigin(this.origin);
		return copy_instance;
	};
	
	Module.create = function (credit_total, favor_total, credit_count, favor_count) {
		var instance = new Module;
		instance.init(credit_total, favor_total, credit_count, favor_count);
		return instance;
	};
	
	return Module;
});

Dr.Declare('Advice_Advice', 'class');
Dr.Require('Advice_Advice', 'Advice_Opinion');
Dr.Implement('Advice_Advice', function (global, module_get) {
	var Module = function () {
		//
	}
	
	Module.status = {
		PENDING: 'PENDING',
		ENTER: 'ENTER',
		ACTIVE: 'ACTIVE',
		EXIT: 'EXIT',
	};
	
	Module.prototype.init = function (tag, actor) {
		this._tag = tag;
		this._actor = actor;
		this._status = Module.status.PENDING;
	};
	
	Module.create = function (tag) {
		var instance = new Module;
		instance.init(tag);
		return instance;
	};
	
	return Module;
});

Dr.Declare('Advice_AdviceBag', 'class');
Dr.Require('Advice_AdviceBag', 'Advice_Advice');
Dr.Implement('Advice_AdviceBag', function (global, module_get) {
	var Module = function () {
		//
	}
	
	Module.status = {
		PENDING: 'PENDING',
		ENTER: 'ENTER',
		ACTIVE: 'ACTIVE',
		EXIT: 'EXIT',
	};
	
	Module.prototype.init = function (tag, actor) {
		this._tag = tag;
		this._actor = actor;
		this._status = Module.status.PENDING;
	};
	
	Module.create = function (tag) {
		var instance = new Module;
		instance.init(tag);
		return instance;
	};
	
	return Module;
});


Dr.Declare('ActorStatePool', 'class');
Dr.Require('ActorStatePool', '"ActorState"');
Dr.Implement('ActorStatePool', function (global, module_get) {
	
	var ActorState = module_get("ActorState");
	
	var Module = function () {
		//
	}
	
	Module.status = ActorState.status;
	
	Module.prototype.init = function (actor) {
		this._actor = actor;
		
		this.resetStatePool();
	};
	
	Module.prototype.update = function (delta_time) {
		var result_action_priority_list = [];
		
		//loop for control
		for (var state in this._active_state_list) {
			//update
			var action_priority_list = state.update(actor, delta_time);
			result_action_priority_list.concat(action_priority_list);
		};
		
		var result_action_priority_list = this.decideAction(result_action_priority_list);
		this.commitAction(result_action_priority_list);
	};
	
	Module.prototype.resetStatePool = function () {
		this._valid_state_list = {}; 
		this._active_state_list = {};
		this._marked = {}; 
	};
	Module.prototype.removeState = function (tag) { this._control_data[tag] = null; };
	Module.prototype.getState = function (tag) { return tag ? this._control_data[tag] : this._control_data; };
	Module.prototype.addState = function (tag, data) {
		if (!data || !data.update_func) {
			Dr.log('[addState] error! invalid data', data);
			return;
		};
		
		//add item
		data.actor = this._actor;
		data.tag = tag;
		data.status = Module.status.PENDING;
		
		this._control_data[tag].data = data; 
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
		
		this._actor.getActionPool().applyAction(action_priority_list);
	};
	
	Module.create = function (actor) {
		var instance = new Module;
		instance.init(actor);
		return instance;
	};
	
	return Module;
});
