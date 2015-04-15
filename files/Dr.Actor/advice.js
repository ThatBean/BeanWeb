/** Advice 
 **** Dependency
 * Dr.js
 * state.js
 * 
 **** Content
 * Advice
 * AdviceBag
 * Opinion
 * ActorOpinionSource
 * 
 * 
 **/

//a higher logic strategy

/*

	The Flow
	
	AdvicePool - single in game will hold all advice, needed?
	
	AdviceBag - every Actor(owner) in game will hold one of these
		enter - pick a advice of some aspect, for how many times
			
			
		update - update picked advice
			
		
		exit - put back picked advice
	
	
	|                                                         |
	| Layer:        [Advice]  [Logic]   [Action]  [Animation] |
	| Data Barrier:                   +                       |
	|                                                         |
	
	
*/

 
Dr.Declare('ActorOpinion', 'class');
Dr.Implement('ActorOpinion', function (global, module_get) {
	var Module = function () {
		//
	};
	
	Module.prototype.init = function (credit_total, favor_total, credit_count, favor_count) {
		this._credit_total = credit_total || 0.5;
		this._credit_count = credit_count || 1;
		
		this._favor_total = favor_total || 0.5;
		this._favor_count = favor_count || 1;
		
		this._origin = null;
	};
	
	Module.prototype.isOrigin = function () { return (!this._origin); };
	Module.prototype.setOrigin = function (origin) { this._origin = origin; };
	Module.prototype.getOrigin = function () { return this._origin; };
	
	Module.prototype.getCredit = function () { return this._credit_total / this._credit_count; };
	Module.prototype.addCredit = function (value) { this._credit_total += value; this._credit_count++; };
	
	Module.prototype.getFavor = function () { return this._favor_total / this._favor_count; };
	Module.prototype.addFavor = function (value) { this._favor_total += value; this._favor_count++; };
	
	//for a agree possibility([0, 1] result), 'this' should be the actor's self evaluation, 'opinion' is the advice to be check with
	Module.prototype.considerOpinion = function (opinion) {
		//this.getCredit();	//other's opinion about you will not related to your consider
		///TODO: think a better way, add roll dice and more ??
		return (opinion.getCredit() + opinion.getFavor() * this.getFavor());
	};
	
	//for take in feedback of a decision
	Module.prototype.feedbackOpinion = function (value, is_change_credit) {
		if (is_change_credit) {
			if (this.getOrigin()) this.getOrigin().addCredit(value);
			this.addCredit(value);
		};
		
		this.addFavor(value);
	};
	
	Module.prototype.copy = function () {
		var copy_instance = Module.create(this._credit_total, this._favor_total, this._credit_count, this._favor_count);
		copy_instance.setOrigin(this._origin || this);
		return copy_instance;
	};
	
	Module.create = function (credit_total, favor_total, credit_count, favor_count) {
		var instance = new Module;
		instance.init(credit_total, favor_total, credit_count, favor_count);
		return instance;
	};
	
	return Module;
});



Dr.Declare('ActorOpinionSource', 'class');
Dr.Require('ActorOpinionSource', 'ActorOpinion');
Dr.Implement('ActorOpinionSource', function (global, module_get) {
	
	var ActorOpinion = module_get('ActorOpinion');
	
	var Module = function () {
		//
	};
	
	Module.prototype.init = function (tag, owner, opinion) {
		this._tag = tag;
		this._owner = owner;
		this._opinion = opinion || new ActorOpinion;
	};
	
	Module.prototype.getTag = function () { return this._tag; };
	Module.prototype.getOwner = function () { return this._owner; };
	Module.prototype.getOpinion = function () { return this._opinion; };
	
	Module.prototype.considerSource = function (source) {
		return this._opinion.considerOpinion(source.getOpinion());
	};
	
	//for take in feedback of a decision
	Module.prototype.feedbackSource = function (value, is_change_credit) {
		this._opinion.feedbackOpinion(value, is_change_credit);
	};
	
	Module.create = function (tag, owner, opinion) {
		var instance = new Module;
		instance.init(tag, owner, opinion);
		return instance;
	};
	
	return Module;
});



Dr.Declare('ActorAdvice', 'class');
Dr.Require('ActorAdvice', 'ActorState');
Dr.Require('ActorAdvice', 'ActorOpinion');
Dr.Implement('ActorAdvice', function (global, module_get) {
	
	var ActorState = module_get('ActorState');
	var ActorOpinion = module_get('ActorOpinion');
	
	var Module = function () {
		//
	};
	
	Module.prototype = new ActorState;
	Module.prototype.proto_init = ActorState.prototype.init;
	
	Module.prototype.init = function (tag, config_data) {
		this.proto_init(tag, owner, slot_list, priority);
		//initialized in proto_init
		//this._slot_list = slot_list || [];
		//this._priority = priority || 0;
		//this._slot_staus = Module.status.DISCONNECT;
		//this._tag = tag;
		//this._owner = owner;
		//this._status = Module.status.PENDING;
		
		//redefine anyway
		
		this._tag = tag;
		
		this._aspect = config_data.aspect || [];	//aspect key list
		this._condition = config_data.condition || [];	//check function list
		this._slot = config_data.slot || [];	//occupy slot to prevent advice conflict
		this._action = config_data.action || function (owner, advice) { return is_action_finished; };	//function to run(return true to keep update, or will be collected)
		this._source_tag_list = config_data.source_tag_list || [];	//list: name only
		this._opinion = config_data.opinion || new ActorOpinion;	//advice holder's opinion to this advice
	};
	
	Module.prototype.getTag = function () { return this._tag; };
	Module.prototype.getAspect = function () { return this._aspect; };
	//Module.prototype.getCondition = function () { return this._condition; };
	//Module.prototype.getSlot = function () { return this._slot; };
	//Module.prototype.getAction = function () { return this._action; };
	Module.prototype.getSourceTagList = function () { return this._source_tag_list; };
	Module.prototype.getOpinion = function () { return this._opinion; };
	
	Module.prototype.checkAspect = function (aspect) {
		for (var index in this._aspect) {
			if (aspect == this._aspect[index]) return true;
		}
		return false;
	};
	
	Module.prototype.checkCondition = function (owner) {
		return this._condition(owner, this);
	};
	
	Module.prototype.checkSlot = function (slot) {
		var is_all_slot_vacant = true;
		for (var index in this._slot) {
			is_all_slot_vacant = is_all_slot_vacant && (!slot[this._slot[index]]);
		}
		return is_all_slot_vacant;
	};
	
	Module.prototype.applySlot = function (slot, value) {
		for (var index in this._slot) {
			slot[this._slot[index]] = value;
		}
	};
	
	Module.prototype.applyAction = function (owner, delta_time) {
		return this._action(owner, delta_time, this); 
	};
	
	Module.prototype.getCopyData = function () {
		return {
			aspect: this._aspect,
			condition: this._condition,
			slot: this._slot,
			action: this._action,
			source_tag_list: Dr.arrayCopy(this._source_tag_list),
			opinion: this._opinion.copy(),
		}; 
	};
	
	
	Module.prototype.copy = function (tag) {
		var copy_data = this.getCopyData();
		var copy_instance = Module.create(tag || this._tag, copy_data);
		return copy_instance;
	};
	
	Module.create = function (tag, config_data) {
		var instance = new Module;
		instance.init(tag, config_data);
		return instance;
	};
	
	return Module;
});





Dr.Declare('ActorAdviceBag', 'class');
//Dr.Require('ActorAdviceBag', 'ActorOpinion');
Dr.Require('ActorAdviceBag', 'ActorStatePool');
Dr.Require('ActorAdviceBag', 'ActorOpinionSource');
Dr.Implement('ActorAdviceBag', function (global, module_get) {
	
	var ActorStatePool = module_get('ActorStatePool');
	var ActorOpinionSource = module_get('ActorOpinionSource');
	
	var Module = function () {
		//
	};
	
	Module.prototype.init = function (tag, owner, opinion) {
		this._tag = tag;
		this._owner = owner;
		
		this._advice_data = {};	//where all advice is hold
		this._source_data = {};	//where all known source is hold
		
		this._opinion_source = ActorOpinionSource.create(tag, owner, opinion);
		this._advice_state_pool = new ActorStatePool.create(owner);
	};
	
	Module.prototype.getTag = function () { return this._tag; };
	Module.prototype.getOwner = function () { return this._owner; };
	Module.prototype.getAdviceData = function () { return this._advice_data; };
	Module.prototype.getSourceData = function () { return this._source_data; };
	Module.prototype.getOpinionSource = function () { return this._opinion_source; };
	Module.prototype.getAdviceStatePool = function () { return this._advice_state_pool; };
	
	
	Module.prototype.considerAdvice = function (advice) {
		var source_tag_list = advice.getSourceTagList();
		var source_total = 0;
		
		for (var index in source_tag_list) {
			var source = this._source_data[source_tag_list[index]];
			if (source) {
				source_total += this.getOpinionSource().considerSource(source);
			};
		};
		
		var source_result = source_total / source_tag_list.length;
		var advice_result = this.getOpinionSource().getOpinion().considerOpinion(advice.getOpinion());
		
		return (advice_result + source_result) * 100 >= Dr.rollDice();	///TODO: fake an algorithm?
	};
	
	//for take in feedback of a decision
	Module.prototype.feedbackAdvice = function (advice, value) {
		//self is blind, add only favor
		this.getOpinionSource().getOpinion().feedbackOpinion(value, false);
		
		//add credit and favor
		advice.getOpinion().feedbackOpinion(value, true);
		var source_tag_list = advice.getSourceTagList();
		for (var index in source_list) {
			var source = this._source_data[source_tag_list[index]];
			if (source) {
				source.getOpinionSource().feedbackSource(value, true);
			};
		};
	};
	
	Module.prototype.reset = function () {
		this._advice_state_pool.reset();
	};
	
	Module.prototype.update = function (delta_time) {
		this._advice_state_pool.update(delta_time);
	};
	
	Module.prototype.pickAdvice = function (aspect) {
		//pending -> enter
		var pending_list = [];
		for (var index in this._pending_list) {
			var tag = this._pending_list[index];
			var advice = this._advice_data[tag];
			if (advice) {
				if (advice.checkAspect(aspect) && advice.checkCondition(this._owner)) {
					//this advice is finished
					this._enter_list.push(tag);
				}
				else {
					pending_list.push(tag);
				};
			};
		}
		this._pending_list = pending_list;
	}
	
	Module.prototype.addAdvice = function (advice) {
		var tag = advice.getTag();
		if (!this._advice_data[tag]) {
			this._pending_list.push(tag);
			this._advice_data[tag] = advice;
		}
		else {
			//already has this advice
			//update new source_tag to this._advice_data[tag].getSourceTagList()
			Dr.arrayDeduplication(
				this._advice_data[tag].getSourceTagList(), 
				advice.getSourceTagList());
		}
	}
	
	Module.prototype.removeAdviceByTag = function (tag) {
		this._advice_data[tag] = null;
	}
	
	Module.prototype.addSource = function (source) {
		var tag = source.getTag();
		this._source_data[tag] = source;
	}
	Module.prototype.removeSourceByTag = function (tag) {
		this._source_data[tag] = null;
	}
	
	Module.create = function (tag, owner, opinion) {
		var instance = new Module;
		instance.init(tag, owner, opinion);
		return instance;
	};
	
	return Module;
});





Dr.test_actor_advice = {
	basic: function () {
		var ActorAdvice = Dr.Get('ActorAdvice');
		var ActorAdviceBag = Dr.Get('ActorAdviceBag');
		var ActorOpinion = Dr.Get('ActorOpinion');
		var ActorOpinionSource = Dr.Get('ActorOpinionSource');
		
		var test_advice_slot_list = [
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
		
		
		
		var advice_bag = ActorAdviceBag.create('test_ab', 'owner object', new ActorOpinion);
		
		
		
		
		for (var index = 0; index < 10; index++) {
			var state = ActorAdvice.create('advice_' + index, {
				a: test_state_slot_list[index]
			});
			
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
			advice_bag.update(delta_time);
			return true;
		})
		
		Dr.test_advice_bag = advice_bag;
		return advice_bag;
	},
}