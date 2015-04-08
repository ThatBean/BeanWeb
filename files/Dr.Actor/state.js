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
			enter State queue
				State
					enter
						check_mark
						check_priority
						check_re_enter
						check_other_condition
						check_...
						do init
						to update or exit
			
			active State queue
				State
					update
						to update or exit
			
			exit State queue
				State
					exit
						gather follow-up State-Priority List
						(the priority will not get bigger, usually keep the same)
			
		
*/


//one way, two slot, simple callback
Dr.Declare('ActorSlot', 'class');
Dr.Implement('ActorSlot', function (global, module_get) {
	var Module = function () {
		//
	};
	
	Module.capacity = 2;
	
	Module.status = {
		OFF: 'OFF',
		CONNECT: 'CONNECT',
		DISCONNECT: 'DISCONNECT',
		ALLCONNECT: 'ALLCONNECT',
		//RECONNECT: 'RECONNECT',
	};
	
	Module.prototype.init = function (tag) {
		this._tag = tag;
		//this._status = {};	//for both OFF status and callback
		//this._priority = {};	//only same or above allowed to replace, 0 when OFF
		this.reset();
	};
	
	Module.prototype.reset = function () {
		this._status = {};
		this._priority = {};
		for (var slot = 0; slot < Module.capacity; slot++) {
			this._status[slot] = Module.status.OFF;
			this._priority[slot] = 0;
		}
	};
	
	Module.prototype.plug = function (slot, status_callback, priority) {
		var priority = priority || 0;
		if (!this._status[slot]) {
			Dr.assert(false, 'error slot', slot, this._capacity);
			return false;
		};
		
		if (!this.checkValid(slot, priority)) {	//not valid
			//status_callback(this._tag, Module.status.DISCONNECT);	//not now
			return false;
		}
		else {
			Dr.log('[ActorSlot] plug', slot, priority);
			this.pull(slot);	//pull what ever
			//record new
			this._status[slot] = status_callback;
			this._priority[slot] = priority;
			
			this._status[slot](this._tag, Module.status.CONNECT);
			this.check_all_connect();
			
			return true;
		}
	};
	
	Module.prototype.check_all_connect = function () {
		var is_all_connect = true;
		for (var slot = 0; slot < Module.capacity; slot++) {
			is_all_connect = is_all_connect && (this._status[slot] && this._status[slot] != Module.status.OFF);
		}
		if (is_all_connect) {
			for (var slot = 0; slot < Module.capacity; slot++) {
				this._status[slot](this._tag, Module.status.ALLCONNECT);
			}
		}
	};
	
	Module.prototype.checkValid = function (slot, priority) {
		var priority = priority || 0;
		return (
			this._status[slot] == Module.status.OFF 
			|| priority >= this._priority[slot]
		);
	};
	
	Module.prototype.pull = function (slot) {
		if (this._status[slot] != Module.status.OFF) {
			Dr.log('[ActorSlot] pull', slot);
			this._status[slot](this._tag, Module.status.DISCONNECT);
			this._status[slot] = Module.status.OFF;
			this._priority[slot] = 0;
		}
	};
	
	Module.prototype.pullAll = function () {
		for (var slot = 0; slot < Module.capacity; slot++) {
			this.pull(slot);
		}
	};
	
	Module.create = function (tag) {
		var instance = new Module;
		instance.init(tag);
		return instance;
	};
	
	return Module;
});


Dr.Declare('ActorSlotPool', 'class');
Dr.Require('ActorSlotPool', 'ActorSlot');
Dr.Implement('ActorSlotPool', function (global, module_get) {
	var ActorSlot = module_get('ActorSlot');
	
	var Module = function () {
		//
	};
	
	Module.status = ActorSlot.status;
	
	Module.prototype.init = function () {
		//this._slot_data = {};
		this.reset();
	};
	
	Module.prototype.reset = function () {
		this._slot_data = {};
	};
	
	Module.prototype.get_slot = function (tag) {
		this._slot_data[tag] = this._slot_data[tag] || ActorSlot.create(tag);
		return this._slot_data[tag];
	};
	
	Module.prototype.plug = function (tag_list, slot, status_callback, priority) {
		var is_valid = true;
		for (var index in tag_list) {
			var tag = tag_list[index];
			is_valid = is_valid && this.get_slot(tag).checkValid(slot, priority);
		}
		
		if (is_valid) {
			Dr.log('[ActorSlotPool] plug', tag_list, slot, priority);
			for (var index in tag_list) {
				var tag = tag_list[index];
				this.get_slot(tag).plug(slot, status_callback, priority);
			}
		}
		
		return is_valid;
	};
	
	Module.prototype.pull = function (tag_list) {
		Dr.log('[ActorSlotPool] pull', tag_list);
		for (var index in tag_list) {
			var tag = tag_list[index];
			this.get_slot(tag).pullAll();
		};
	};
	
	Module.create = function () {
		var instance = new Module;
		instance.init();
		return instance;
	};
	
	return Module;
});



Dr.Declare('ActorState', 'class');
Dr.Require('ActorState', 'ActorSlotPool');
Dr.Implement('ActorState', function (global, module_get) {
	
	var ActorSlotPool = module_get('ActorSlotPool');
	
	var Module = function () {
		//
	};
	
	Module.status = {
		PENDING: 'PENDING',
		ENTER: 'ENTER',
		ACTIVE: 'ACTIVE',
		EXIT: 'EXIT',
	};
	Module.slot_status = ActorSlotPool.status;
	
	Module.prototype.init = function (tag, owner, slot_list, priority) {
		this._tag = tag;
		this._owner = owner;
		
		this._status = Module.status.PENDING;
		
		//for ActorSlot
		this._slot_list = slot_list || [];
		this._priority = priority || 0;
	};
	
	Module.prototype.getTag = function () { return this._tag; };
	Module.prototype.setStatus = function (status) { this._status = status; };
	Module.prototype.getStatus = function () { return this._status; };
	Module.prototype.getSlotList = function () { return this._slot_list; };
	Module.prototype.setPriority = function (priority) { this._priority = priority; };
	Module.prototype.getPriority = function () { return this._priority; };
	
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
	
	Module.prototype.getSlotStatusCallback = function () {
		var _this = this;
		this._slot_status_callback = this._slot_status_callback || function (tag, status) {
			if (status == Module.slot_status.DISCONNECT) {
				_this.setStatus(Module.status.EXIT);
			};	
		};
		return this._slot_status_callback;
	};
	
	Module.create = function (tag, owner, slot_list, priority) {
		var instance = new Module;
		instance.init(tag, owner, slot_list, priority);
		return instance;
	};
	
	/*
	//for state extending
	Module._instance_list = {};
	Module.registerState = function (tag, instance) {
		Module._instance_list[tag] = instance;
	};
	Module.getState = function (tag) {
		return Module._instance_list[tag];
	};
	*/
	return Module;
});

//a parallel state machine with slot & priority
Dr.Declare('ActorStatePool', 'class');
Dr.Require('ActorStatePool', 'ActorState');
Dr.Require('ActorStatePool', 'ActorSlotPool');
Dr.Implement('ActorStatePool', function (global, module_get) {
	
	var ActorState = module_get('ActorState');
	var ActorSlotPool = module_get('ActorSlotPool');
	
	var Module = function () {
		//
	};
	
	//Module.status = Dr.combine(ActorSlotPool.status, ActorState.status);
	Module.state_status = ActorState.status;
	Module.slot_status = ActorSlotPool.status;
	
	Module.prototype.init = function (owner) {
		this._owner = owner;
		this._state_data = {};	//map: tag - state, all available state
		this._slot_pool = ActorSlotPool.create();	//slot for state exclude (priority & slot)
		this._upper_slot_pool = null;
		this.reset();
	};
	
	Module.prototype.getSlotPool = function () { return this._slot_pool; };
	Module.prototype.setUpperSlotPool = function (upper_slot_pool) { this._upper_slot_pool = upper_slot_pool; };
	Module.prototype.getUpperSlotPool = function () { return this._upper_slot_pool; };
	
	Module.prototype.reset = function () {
		//for state holding & update(pending -> [check] -> enter -> [reg] -> active -> [self/interrupt] -> exit -> [unreg] -> pending)
		this._pending_list = [];
		this._enter_list = [];	//transition state
		this._active_list = [];
		this._exit_list = [];	//transition state
		//only tag is stored here
		for (var tag in this._state_data) {
			this._pending_list.push(tag);
		};
		//reset slot connection
		this._slot_pool.reset();
		if (this._upper_slot_pool) this._upper_slot_pool.reset();
	};
	
	
	Module.prototype.update = function (delta_time) {
		this.update_transition();
		this.update_active(delta_time);
	};
	
	Module.prototype.update_transition = function () {
		//enter -> active
		for (var index in this._enter_list) {
			var tag = this._enter_list[index];
			var state = this._state_data[tag];
			if (state) {
				if (this._slot_pool.plug(
					state.getSlotList(), 
					0, 
					state.getSlotStatusCallback(), 
					state.getPriority()
				)) {
					Dr.log('[update_transition] enter', state.getTag(), state.getStatus());
					state.enter();
					this._active_list.push(tag);	//to active
					if (this._upper_slot_pool) this._upper_slot_pool.plug(
						[tag], 
						1, 
						state.getSlotStatusCallback(), 
						state.getPriority()
					);
				}
				else {
					Dr.log('[update_transition] rejected', state.getTag(), state.getStatus());
					this._pending_list.push(tag);
				}
			}
		}
		this._enter_list = [];	//clear
		//exit -> pending
		for (var index in this._exit_list) {
			var tag = this._exit_list[index];
			var state = this._state_data[tag];
			if (state) {
				Dr.log('[update_transition] exit', state.getTag(), state.getStatus());
				state.exit();
				this._slot_pool.pull(state.getSlotList());
				if (this._upper_slot_pool) this._upper_slot_pool.pull([tag]);
				this._pending_list.push(tag);
			};
		}
		this._exit_list = [];	//clear
	};
	
	Module.prototype.update_active = function (delta_time) {
		var active_list = [];
		for (var index in this._active_list) {
			var tag = this._active_list[index];
			var state = this._state_data[tag];
			if (state) {
				if (
					state.getStatus() == Module.state_status.ACTIVE
					|| state.getStatus() == Module.state_status.ENTER
				) {
					state.update(delta_time);
				};
				if (state.getStatus() != Module.state_status.ACTIVE) {
					Dr.log('[update_active] inactive', state.getTag(), state.getStatus());
					Dr.assert(state.getStatus() == Module.state_status.EXIT, 'error state status', state.getStatus(), state);
					this._exit_list.push(tag);	//this state is finished
				}
				else {
					active_list.push(tag);
				};
			};
		}
		this._active_list = active_list;
	};
	
	Module.prototype.addState = function (state) {
		Dr.log('[addState]', state);
		var tag = state.getTag();
		this._pending_list.push(tag);
		this._state_data[tag] = state;
	}
	
	Module.prototype.getStateByTag = function (tag) {
		return this._state_data[tag];
	}
	
	Module.prototype.removeStateByTag = function (tag) {
		Dr.log('[removeStateByTag]', tag);
		this._state_data[tag] = null;
	}
	
	
	Module.prototype.activateStateByTag = function (state_tag) {
		Dr.log('[activateStateByTag]', state_tag);
		if (this._state_data[state_tag]) {
			for (var index in this._pending_list) {
				var tag = this._pending_list[index];
				if (tag == state_tag) {
					this._pending_list.splice(index, 1);
					this._enter_list.push(tag);
					return true;
				};
			};	
			Dr.log('[activateStateByTag] state not pending', state_tag);
			return false;
		}
		else {
			Dr.log('[activateStateByTag] state not found', state_tag);
			return false;
		}
	};
	
	Module.create = function (owner) {
		var instance = new Module;
		instance.init(owner);
		return instance;
	};
	
	return Module;
});



Dr.test_actor_state = {
	basic: function () {
		var ActorStatePool = Dr.Get('ActorStatePool');
		var ActorState = Dr.Get('ActorState');
		
		var state_pool = ActorStatePool.create('owner object');
		
		var test_state_slot_list = [
			[1],
			[1, 2],
			[1, 2, 3],
			[1, 2, 3, 4],
			[2],
			[2, 3],
			[2, 3, 4],
			[3],
			[3, 4],
			[4]
		];
		
		for (var index = 0; index < 10; index++) {
			var state = ActorState.create('state_' + index, 'owner object', test_state_slot_list[index], index);
			
			state.update = function (delta_time) {
				Dr.log('[update]', this._tag);
				
				this._status = 'ACTIVE';
				
				this._test_count = (this._test_count || 0) + 1;
				if (this._test_count > 10) {
					Dr.log('[update]', this._tag, 'test end');
					this._status = 'EXIT';
				}
			};
			
			
			state_pool.addState(state);
		}
		
		
		Dr.UpdateLoop.add(function (delta_time) { 
			state_pool.update(delta_time);
			return true;
		})
		
		Dr.test_state_pool = state_pool;
		return state_pool;
	},
	activateStateByTag: function () {
		for (var index = 0; index < 15; index++) {
			Dr.test_state_pool.activateStateByTag('state_' + index);
		}
	},
	activateStateByTag2: function () {
		for (var index = 0; index < 15; index++) {
			Dr.test_state_pool.activateStateByTag('state_' + (9 - index));
		}
	},
	test: function () {
		Dr.test_actor_state.basic();
		Dr.test_actor_state.activateStateByTag();
		Dr.test_actor_state.activateStateByTag2();
	},
	test_slot: function () {
		var ActorSlotPool = Dr.Get('ActorSlotPool');
		
		Dr.test_actor_state.basic();
		Dr.test_actor_state.activateStateByTag();
		
		Dr.test_state_pool.setUpperSlotPool(ActorSlotPool.create());
		Dr.test_state_pool.getSlotPool().plug(
			[1,2,3,4,5], 
			1, 
			function (tag, status) { Dr.log('[====test_slot====]', tag, status); }, 
			10
		);
	},
}