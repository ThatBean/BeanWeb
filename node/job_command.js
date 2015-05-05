require('../Dr.js');

var Path = Dr.require('path');

var global_args = process.argv;

//var node_exe = global_args[0];
//var script_file = global_args[1];
var config_file = global_args[2];

Dr.loadLocalScript('../Dr.node.js', function () {
	Dr.loadScriptByList([
		'./command.js',
		'./job_center.js',
	], function () {
		Dr.log("All script loaded");
		
		Dr.Declare('CommandJob', 'class');
		Dr.Require('CommandJob', 'JobBase');
		Dr.Implement('CommandJob', function (global, module_get) {
			var JobBase = Dr.Get('JobBase');
			
			var Module = function (job_config, callback) {
				this.job_config = job_config;
				
				job_config.callback = callback;
				job_config.callbackOutput: function (event, from, data) {
					Dr.log(arguments);
					if (data) Dr.log(data.toString());
				};
			}
			
			Module.status = JobBase.status;
			
			Module.prototype = new JobBase;	//in fact not so useful
			
			Module.prototype.start = function () {
				console.warn('[job start]');
				return Command.run(job_config.command, job_config);
			}

			return Module;
		});
		
		Dr.LoadAll();
		
		var Command = Dr.Get('Command');
		var JobCenter = Dr.Get('JobCenter');
		var CommandJob = Dr.Get('CommandJob');
		
		var job_config_list = loadJobConfig(config_file);
		
		
		/*
		
		var job_center = new JobCenter;
		var job_create_func = function (data, callback) {
			var job_base = new JobBase(data, callback);
			job_base.id = Dr.generateId();
			Dr.log('job_base', data, job_base.id);
		
		
			job_base.start = function () {
				var job_id = this.id;
				Dr.log('job_base', job_id);
				setTimeout(function () {
					callback('Error', data, job_id);
				}, 1000);
			}
			
			return job_base;
		}
		
		var job_data_list = [1,2,3,4,5,6,7,8];
		var common_callback = function (status) {
			Dr.log('[common_callback] status:', status, 'arguments:', arguments);
			
			if (status == 'Error') {
				Dr.log('get error!!! omit');
				return true;
			}
		}
		
		job_center.init(job_data_list, job_create_func, common_callback);
		
		job_center.start();
		*/
		
		//Dr.startREPL();
	});
});



function loadJobConfig (config_file) {
	var config_src = Dr.loadJsonFile(config_file);
	
	var global_config = {
		dir: config_src.dir || process.cwd(),
		env: Dr.combine(config_src.env || process.env, config_src.env_append || {}),
		sync: (config_src.sync != undefined ? config_src.sync : true),
	};
	
	var job_config_src_list = config_src.job_list;
	var job_config_list = [];
	
	//apply global config to each job config
	for (var index in job_config_src_list) {
		var job_config_src = job_config_src_list[index];
		
		combineConfig(global_config, job_config_src);
		
		var job_config = {
			cwd: job_config_src.dir || process.cwd(),
			env: Dr.combine(job_config_src.env || process.env, job_config_src.env_append || {}),
			sync: (job_config_src.sync != undefined ? job_config_src.sync : true),
			command: job_config_src.command,
		};
		
		if (!job_config.command) {
			throw new Error('job_config.command undefined');
		}
		else {
			job_config_list.push(job_config);
		}
	}
	
	return job_config_list;
}



function combineConfig (global_config, job_config) {
	for (var key in global_config) {
		var global_config_value = global_config[key];	//global_config
		var job_config_value = job_config[key];	//job_config
		
		if (job_config_value != undefined) {
			switch(key) {
				case 'dir':
					job_config[key] = Path.resolve(global_config_value, job_config_value);
					break;
				case 'sync':
				case 'env':
					job_config[key] = job_config_value;	//job first
					break;
				default:
					Dr.log('[Error] Unsupported global_config key:', key);
					break;
			}
		}
		else {
			job_config[key] = global_config_value;	//just overwrite
		}
	}
}