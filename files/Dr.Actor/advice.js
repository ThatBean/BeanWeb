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
	
	AdviceBag - every Actor(owner) in game will hold one of these
		pick - pick a advice of some aspect, for how many times
			
			
		update - update picked advice
			
		
		collect - put back picked advice
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
		
		this._origin = this;
	};
	
	Module.prototype.isOrigin = function () { return (this._origin === this); };
	Module.prototype.setOrigin = function (origin) { this._origin = origin; };
	Module.prototype.getOrigin = function () { return this._origin; };
	
	Module.prototype.getCredit = function () { return this._credit_total / this._credit_count; };
	Module.prototype.addCredit = function (value) { this._credit_total += value; this._credit_count++; };
	
	Module.prototype.getFavor = function () { return this._favor_total / this._favor_count; };
	Module.prototype.addFavor = function (value) { this._favor_total += value; this._favor_count++; };
	
	//for a bool result, 'this' should be the actor's self evaluation, 'opinion' is the advice to be check with
	Module.prototype.decide = function (opinion) {
		//this.getCredit();	//other's opinion about you will not related to your consider
		///TODO: think a better way, add roll dice and more ??
		return (opinion.getCredit() + opinion.getFavor() * this.getFavor()) * 100 >= Dr.rollDice();
	};
	
	//for take in feedback of a decision
	Module.prototype.feedback = function (value, is_change_credit, is_change_favor) {
		if (is_change_credit) {
			this.getOrigin().addCredit(value);
			this.addCredit(value);
		}
		if (is_change_favor) {
			this.addFavor(value);
		}
	};
	
	Module.prototype.copy = function () {
		var copy_instance = Module.create(this._credit_total, this._favor_total, this._credit_count, this._favor_count);
		copy_instance.setOrigin(this._origin);
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
//Dr.Require('Advice_Advice', 'Advice_Opinion');
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
	
	Module.prototype.init = function (tag, source, opinion) {
		this._tag = tag;
		
		this._aspect = [];
		this._condition = [];
		this._slot = [];
		this._action = [];
		this._source = source;	//list: name
		this._opinion = opinion;
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
	
	Module.prototype.init = function (tag, owner) {
		this._advice_bag = {};
		this._owner = owner;
		this._source = {};	//map: name - opinion
	};
	
	Module.create = function (tag) {
		var instance = new Module;
		instance.init(tag);
		return instance;
	};
	
	return Module;
});