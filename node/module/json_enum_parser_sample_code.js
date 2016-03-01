require('../../Dr.js');
require('../../Dr.node.js');


Dr.loadScriptByList([
	'../../common/data/auto_parser.js',
	'../../common/data/auto_composer.js',
], function () {
	Dr.log("All script loaded");
	Dr.LoadAll();

	var AutoParser = Dr.Get('AutoParser');
	var AutoComposer = Dr.Get('AutoComposer');

	var auto_parser = new AutoParser;
	var auto_composer = new AutoComposer;

	//var result = auto_parser.parse(AutoParser.parse_config_map.enum_parse_config, 'enum eItemSubType \
	//{\
	//    kItemSubTypeMoney                = 1,\
	//    kItemSubTypeGoods                = 2,\
	//    kItemSubTypeBoxRand              = 3,\
	//    kItemSubTypeBox                  = 4,\
	//};');

	var cpp_enum_source = '\
                \n\
                enum eActorAttributeType  //independent float value //from 1 to 9999\n\
                //[common_prefix] kActorAttribute  \n\
                //[default_enum_key] kActorAttribute \n\
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
                kActorAttribute = 9999,  //max\n\
                };\n\
            ';

	Dr.parse_result = auto_parser.parse(AutoParser.parse_config_map.enum_parse_config, cpp_enum_source).result;


	Dr.log(Dr.parse_result);
//            Dr.log(JSON.stringify(Dr.parse_result, null, "\t"));


	Dr.cpp_enum_compose_result = auto_composer.compose(AutoComposer.compose_config_map.cpp_enum_compose_config, Dr.parse_result).join('');

	Dr.string_to_enum_compose_result = auto_composer.compose(AutoComposer.compose_config_map.cpp_convert_string_to_enum_compose_config, Dr.parse_result).join('');

	Dr.enum_to_string_compose_result = auto_composer.compose(AutoComposer.compose_config_map.cpp_convert_enum_to_string_compose_config, Dr.parse_result).join('');


	Dr.log(Dr.parse_result);
	Dr.log(Dr.cpp_enum_compose_result);
	Dr.log(Dr.string_to_enum_compose_result);
	Dr.log(Dr.enum_to_string_compose_result);


	var json_again = auto_parser.parse(AutoParser.parse_config_map.enum_parse_config, Dr.cpp_enum_compose_result).result;
	var text_again = auto_composer.compose(AutoComposer.compose_config_map.cpp_enum_compose_config, json_again).join('');
	for (var index in text_again) {
		if (text_again[index] != Dr.cpp_enum_compose_result[index]) {
			Dr.log('diff at:', index);

			Dr.log(text_again.charCodeAt(index))
			Dr.log(Dr.cpp_enum_compose_result.charCodeAt(index))

			Dr.log(text_again.substr(index));
			Dr.log(Dr.cpp_enum_compose_result.substr(index));
			break;
		}
	}
	Dr.assert(text_again == Dr.cpp_enum_compose_result);
	Dr.log(text_again);


	//Dr.startREPL();
});