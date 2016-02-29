require('../Dr.js');

Dr.loadLocalScript('../../common/data/auto_parser.js', function () {
	Dr.log("All script loaded");
	Dr.LoadAll();

	var auto_parser = Dr.GetNew('AutoParser');
    //var result = auto_parser.parse(Dr.Get('AutoParser').parse_config_map.enum_parse_config, 'enum eItemSubType \
    //{\
    //    kItemSubTypeMoney                = 1,\
    //    kItemSubTypeGoods                = 2,\
    //    kItemSubTypeBoxRand              = 3,\
    //    kItemSubTypeBox                  = 4,\
    //};');


	var result = auto_parser.parse(Dr.Get('AutoParser').parse_config_map.enum_parse_config, '\
		\n\
		enum eActorAttributeType  //independent float value //from 1 to 9999\n\
		{\n\
		kActorAttributeInvalid = 0, //min\n\
		\n\
		//basic\n\
		kActorAttributeTimeActive,\n\
		\n\
		//Health & Energy\n\
		kActorAttributeHealthMax,  //normal\n\
		kActorAttributeHealthCurrent,  //battle only\n\
		kActorAttributeHealthRecover,  //recover per second, dispense by 0.2sec\n\
		\n\
		kActorAttributeEnergyMax,\n\
		kActorAttributeEnergyCurrent,\n\
		kActorAttributeEnergyRecover,\n\
		\n\
		//Factor\n\
		kActorAttributeFactorCritical,\n\
		kActorAttributeFactorCriticalResist,\n\
		kActorAttributeFactorCriticalExtra,\n\
		\n\
		kActorAttributeFactorHit,\n\
		\n\
		kActorAttributeFactorDodge,\n\
		kActorAttributeFactorDodgeExtra,\n\
		\n\
		kActorAttributeFactorDamageAdjust,\n\
		kActorAttributeFactorDamageAdjustResist,\n\
		kActorAttributeFactorDamageAdjustExtra,\n\
		\n\
		kActorAttributeFactorSkillDamage,\n\
		kActorAttributeFactorSkillDamageResist,\n\
		\n\
		//Speed\n\
		kActorAttributeSpeedAttack,\n\
		kActorAttributeSpeedMove,\n\
		\n\
		//Damage Related\n\
		kActorAttributeAttackPhysical,\n\
		kActorAttributeAttackMagical,\n\
		kActorAttributeAttackCritical,\n\
		\n\
		kActorAttributeDefensePhysical,\n\
		kActorAttributeDefenseMagical,\n\
		kActorAttributeDefenseCritical,\n\
		\n\
		//Trigger Related\n\
		kActorAttributeTriggerSizeScaleAttack,\n\
		kActorAttributeTriggerSizeScaleGuard,\n\
		\n\
		kActorAttributeAttackAreaRadius, //by the number of grid, not pixel\n\
		kActorAttributeAttackAreaWidth, //by the number of grid, not pixel\n\
		kActorAttributeAttackAreaHeight, //by the number of grid, not pixel\n\
		\n\
		kActorAttributeGuardAreaRadius, //by the number of grid, not pixel\n\
		kActorAttributeGuardAreaWidth, //by the number of grid, not pixel\n\
		kActorAttributeGuardAreaHeight, //by the number of grid, not pixel\n\
		\n\
		//kActorAttributeDamage,\n\
		kActorAttributeDamageAddition,  //for all kinds, applied last\n\
		kActorAttributeDamageAdditionPhysical,\n\
		kActorAttributeDamageAdditionMagical,\n\
		kActorAttributeDamageAdditionCritical,\n\
		kActorAttributeDamageAdditionHealth,\n\
		kActorAttributeDamageAdditionEnergy,\n\
		\n\
		kActorAttributeDamageReduction, //for all kinds, applied last\n\
		kActorAttributeDamageReductionPhysical,\n\
		kActorAttributeDamageReductionMagical,\n\
		kActorAttributeDamageReductionCritical,\n\
		kActorAttributeDamageReductionHealth,\n\
		kActorAttributeDamageReductionEnergy,\n\
		\n\
		\n\
		//Statistic Related\n\
		kActorAttributeKillCount,\n\
		\n\
		kActorAttributeAttackCount,\n\
		kActorAttributeAttackNormalCount,\n\
		kActorAttributeAttackPowerCount,\n\
		kActorAttributeAttackSpecialCount,\n\
		\n\
		\n\
		kActorAttributeLogicInvalid = 1000,\n\
		\n\
		kActorAttributeMotionInvalid = 2000,\n\
		\n\
		kActorAttributeControlInvalid = 3000,\n\
		\n\
		kActorAttributeBuffInvalid = 4000,\n\
		\n\
		kActorAttributeSkillInvalid = 5000,\n\
		\n\
		kActorAttributeAnimationInvalid = 6000,\n\
		kActorAttributeAnimationScale,\n\
		\n\
		kActorAttributeSpecifiedInvalid = 7000,\n\
		\n\
		kActorAttribute = 9999  //max\n\
		};\n\
	').result;

    Dr.log(result);

	//Dr.startREPL();
});