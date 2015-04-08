/** Advice 
 **** Dependency
 * Dr.js
 * 
 **** Content
 * Advice
 * AdviceBag
 * Opinion
 * OpinionSource
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

 
Dr.Declare('Advice_Opinion', 'class');
Dr.Implement('Advice_Opinion', function (global, module_get) {
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



Dr.Declare('Advice_OpinionSource', 'class');
Dr.Require('Advice_OpinionSource', 'Advice_Opinion');
Dr.Implement('Advice_OpinionSource', function (global, module_get) {
	
	var Advice_Opinion = module_get('Advice_Opinion');
	
	var Module = function () {
		//
	};
	
	Module.prototype.init = function (tag, owner, opinion) {
		this._tag = tag;
		this._owner = owner;
		this._opinion = opinion || new Advice_Opinion;
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



Dr.Declare('Advice_Advice', 'class');
Dr.Require('Advice_Advice', 'Advice_Opinion');
Dr.Implement('Advice_Advice', function (global, module_get) {
	
	var Advice_Opinion = module_get('Advice_Opinion');
	
	var Module = function () {
		//
	};
	
	Module.prototype.init = function (tag, config_data) {
		this._tag = tag;
		
		this._aspect = config_data.aspect || [];	//aspect key list
		this._condition = config_data.condition || [];	//check function list
		this._slot = config_data.slot || [];	//occupy slot to prevent advice conflict
		this._action = config_data.action || function (owner, advice) { return is_action_finished; };	//function to run(return true to keep update, or will be collected)
		this._source_tag_list = config_data.source_tag_list || [];	//list: name only
		this._opinion = config_data.opinion || new Advice_Opinion;	//advice holder's opinion to this advice
	};
	
	Module.prototype.getTag = function () { return this._tag; };
	Module.prototype.getAspect = function () { return this._aspect; };
	//Module.prototype.getCondition = function () { return this._condition; };
	//Module.prototype.getSlot = function () { return this._slot; };
	//Module.prototype.getAction = function () { return this._action; };
	Module.prototype.getSourceTagList = function () { return this._source_tag_list; };
	Module.prototype.getOpinion = function () { return this._opinion; };
	
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





Dr.Declare('Advice_AdviceBag', 'class');
//Dr.Require('Advice_AdviceBag', 'Advice_Opinion');
Dr.Require('Advice_AdviceBag', 'Advice_OpinionSource');
Dr.Implement('Advice_AdviceBag', function (global, module_get) {
	
	var Advice_OpinionSource = module_get('Advice_OpinionSource');
	
	var Module = function () {
		//
	};
	
	Module.prototype = new Advice_OpinionSource;
	Module.prototype.proto_init = Module.prototype.init;
	
	Module.prototype.init = function (tag, owner, opinion) {
		this.proto_init(tag, owner, opinion);
		
		this._advice_data = {};	//where all advice is hold
		this._source_data = {};	//where all known source is hold
		
		this._slot = [];	//occupied slot (to prevent advice conflict)
		
		//for advice holding & update(pending -> enter -> active -> exit -> pending)
		this._pending_list = [];
		this._enter_list = [];	//transition state
		this._active_list = [];
		this._exit_list = [];	//transition state
	};
	
	Module.prototype.getTag = function () { return this._tag; };
	Module.prototype.getOwner = function () { return this._owner; };
	Module.prototype.getSlot = function () { return this._slot; };
	Module.prototype.getSourceData = function () { return this._source_data; };
	
	Module.prototype.considerAdvice = function (advice) {
		var source_tag_list = advice.getSourceTagList();
		var source_total = 0;
		
		for (var index in source_tag_list) {
			var source = this._source_data[source_tag_list[index]];
			if (source) {
				source_total += this.considerSource(source);
			};
		};
		
		var source_result = source_total / source_tag_list.length;
		var advice_result = this.getOpinion().considerOpinion(advice.getOpinion());
		
		return (advice_result + source_result) * 100 >= Dr.rollDice();	///TODO: fake an algorithm?
	};
	
	//for take in feedback of a decision
	Module.prototype.feedbackAdvice = function (advice, value) {
		//self is blind, add only favor
		this.getOpinion().feedbackOpinion(value, false);
		
		//add credit and favor
		advice.getOpinion().feedbackOpinion(value, true);
		var source_tag_list = advice.getSourceTagList();
		for (var index in source_list) {
			var source = this._source_data[source_tag_list[index]];
			if (source) {
				source.feedbackSource(value, true);
			};
		};
	};
	
	
	Module.prototype.reset = function () {
		this._pending_list = [];
		this._enter_list = [];	//transition state
		this._active_list = [];
		this._exit_list = [];	//transition state
		
		for (var tag in this._advice_data) {
			this._pending_list.push(tag);
		};
	};
	
	Module.prototype.update = function (delta_time) {
		this.update_transition();
		this.update_active(delta_time);
	};
	
	Module.prototype.update_transition = function () {
		//enter -> active
		for (var index in this._enter_list) {
			var tag = this._enter_list[index];
			var advice = this._advice_data[tag];
			if (advice) {
				if (advice.checkSlot(this._slot)) {
					advice.applySlot(this._slot, true);
					this._active_list.push(tag);	//to active
				}
				else {
					this._pending_list.push(tag);	//slot full, drop
				}
			}
		}
		this._enter_list = [];	//clear
		//exit -> pending
		for (var index in this._exit_list) {
			var tag = this._exit_list[index];
			var advice = this._advice_data[tag];
			if (advice) {
				advice.applySlot(this._slot, false);
				this._pending_list.push(tag);
			};
		}
		this._exit_list = [];	//clear
	};
	
	Module.prototype.update_active = function (delta_time) {
		var active_list = [];
		for (var index in this._active_list) {
			var tag = this._active_list[index];
			var advice = this._advice_data[tag];
			if (advice) {
				if (!advice.applyAction(this._owner, delta_time)) {
					this._exit_list.push(tag);	//this advice is finished
				}
				else {
					active_list.push(tag);
				};
			};
		}
		this._active_list = active_list;
	};
	
	
	Module.prototype.pickAdvice = function (aspect) {
		//pending -> enter
		var pending_list = [];
		for (var index in this._pending_list) {
			var tag = this._pending_list[index];
			var advice = this._advice_data[tag];
			if (advice) {
				if (advice.checkCondition(this._owner)) {
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