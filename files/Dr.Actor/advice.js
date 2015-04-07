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
		pick - pick a advice of some aspect, for how many times
			
			
		update - update picked advice
			
		
		collect - put back picked advice
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
		
		this._advice_list = {};	//where all advice is hold
		this._source_list = {};	//where all known source is hold
		
		this._slot = [];	//occupied slot (to prevent advice conflict)
		
		//for advice holding & update(vacant -> pick -> active -> collect -> vacant)
		this._vacant_list = [];
		this._pick_list = [];	//transition state
		this._active_list = [];
		this._collect_list = [];	//transition state
	};
	
	Module.prototype.getTag = function () { return this._tag; };
	Module.prototype.getOwner = function () { return this._owner; };
	Module.prototype.getSlot = function () { return this._slot; };
	Module.prototype.getSourceList = function () { return this._source_list; };
	
	Module.prototype.considerAdvice = function (advice) {
		var source_tag_list = advice.getSourceTagList();
		var source_total = 0;
		
		for (var index in source_tag_list) {
			var source = this._source_list[source_tag_list[index]];
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
			var source = this._source_list[source_tag_list[index]];
			if (source) {
				source.feedbackSource(value, true);
			};
		};
	};
	
	
	Module.prototype.update = function (delta_time) {
		this.update_transition();
		this.update_active(delta_time);
	};
	
	Module.prototype.update_transition = function () {
		//pick -> active
		for (var index in this._pick_list) {
			var advice = this._pick_list[index];
			if (advice.checkSlot(this._slot)) {
				advice.applySlot(this._slot, true);
				this._active_list.push(advice);	//to active
			}
			else {
				this._vacant_list.push(advice);	//slot full, drop
			}
		}
		this._pick_list = [];	//clear
		//collect -> vacant
		for (var index in this._collect_list) {
			var advice = this._collect_list[index];
			advice.applySlot(this._slot, false);
			this._vacant_list.push(advice);
		}
		this._collect_list = [];	//clear
	};
	
	Module.prototype.update_active = function (delta_time) {
		var active_list = [];
		for (var index in this._active_list) {
			var advice = this._active_list[index];
			if (!advice.applyAction(this._owner, delta_time)) {
				this._collect_list.push(advice);	//this advice is finished
			}
			else {
				active_list.push(advice);
			}
		}
		this._active_list = active_list;
	};
	
	
	Module.prototype.pickAdvice = function (aspect) {
		//vacant -> pick
		var vacant_list = [];
		for (var index in this._vacant_list) {
			var advice = this._vacant_list[index];
			if (advice.checkCondition(this._owner)) {
				//this advice is finished
				this._pick_list.push(advice);
			}
			else {
				vacant_list.push(advice);
			}
		}
		this._vacant_list = vacant_list;
	}
	
	Module.prototype.addAdvice = function (advice) {
		var tag = advice.getTag();
		if (!this._advice_list[tag]) {
			this._vacant_list.push(advice);
			this._advice_list[tag] = advice;
		}
		else {
			//already has this advice
			//update new source_tag to this._advice_list[tag].getSourceTagList()
			Dr.arrayDeduplication(
				this._advice_list[tag].getSourceTagList(), 
				advice.getSourceTagList());
		}
	}
	
	Module.prototype.addSource = function (source) {
		var tag = source.getTag();
		if (!this._source_list[tag]) {
			this._source_list[tag] = source;
		}
		else {
			//already has this source
		}
	}
	
	Module.create = function (tag, owner, opinion) {
		var instance = new Module;
		instance.init(tag, owner, opinion);
		return instance;
	};
	
	return Module;
});