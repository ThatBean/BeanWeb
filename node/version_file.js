require('./Dr.js');

var global_args = process.argv;

var node_exe = global_args[0];
var script_file = global_args[1];
var config_file = global_args[2];
//optional
var target_dir = global_args[3];
var target_version = global_args[4];

var usuage = '' 
	+ '<node>' 
	+ ' + ' + '<this_script>' 
	+ ' + ' + '<config_file>'
	+ ' [optional:'
	+ ' + ' + '<target_dir>'
	+ ' + ' + '<target_version>'
	+ ' ]';
var get_arg = '' 
	+ node_exe 
	+ ' + ' + script_file 
	+ ' + ' + (config_file || '<config_file>')
	+ ' [optional: '
	+ ' + ' + (target_dir || '<target_dir>')
	+ ' + ' + (target_version || '<target_version>')
	+ ' ]';

if (global_args.length < 3) {
	Dr.log('[Usuage]\n' + usuage);
	Dr.log('[Get]\n' + get_arg);
	Dr.log('[Error] required arguments missing!');
	process.exit(-1);
}

/*
var job_func_list = [];
var run_job_func = function () {
	var next_job_func = job_func_list.shift();
	if (next_job_func) {
		next_job_func(run_job_func);
	}
	else {
		Dr.log('All job finished...');
	}
}
*/

//check pass

var Path = Dr.require('path');

Dr.loadLocalScript('./Dr.node.js', function () {
	Dr.loadScriptByList([
		'./module/file.js',
	], function () {
		Dr.log("All script loaded");
		
		defineVersionCenterModule();
		
		Dr.LoadAll();
		
		var version_config = Dr.loadJsonFile(config_file);
		
		var VersionCenter = Dr.Get('VersionCenter');
		
		version_center = new VersionCenter;
		version_center.init(version_config);
		
		version_center.getVersionedList(target_dir || version_config.target_dir || '.');
		
		version_center.switchVersion(target_version || version_config.target_version);
		
		//Dr.startREPL();
	});
});


//called above...

function defineVersionCenterModule () {
	Dr.Declare('VersionCenter', 'class');
	Dr.Require('VersionCenter', 'Directory');
	Dr.Implement('VersionCenter', function (global, module_get) {
		var Directory = module_get('Directory');
		
		var Module = function () {
			//
		};
		
		Module.prototype.init = function (version_config) {
			this.version_suffix_list = version_config.version_suffix_list;
			this.version_suffix_seperator = version_config.version_suffix_seperator;
			this.version_suffix_map = Dr.reverseKeyValue(this.version_suffix_list, true);
			
			this.verisoned_list = null;
		}
		
		Module.prototype.getVersionedList = function (target_dir) {
			if (Directory.getPathType(target_dir) != 'Directory') {
				Dr.log('[VersionCenter] target_dir not valid directory! target_dir:', target_dir, Directory.getPathType(target_dir));
			}
			
			this.target_dir = target_dir;
			this.verisoned_list = [];
			
			var directory = Directory.create(target_dir);
			
			var _this = this;
			directory.walk(function (path, name, type) {
				//console.log('Get', ' - ', path, ' - ', name, ' - ', type);
				
				if (type != 'Directory' && type != 'File') {
					Dr.log('[VersionCenter] Skipped unknown type', path, name, type);
					return;
				}
				
				if (name[0] == '.') {
					Dr.log('[VersionCenter] Skipped hidden file', path, name, type);
					return 'continue';
				}
				
				var result = _this.checkVersionSuffix(name);
				if (result.is_versioned) {
					Dr.log('[VersionCenter] Get versioned:', type, path, result.name_versioned, result.name_unversioned);
					
					_this.verisoned_list.push({
						path: path,
						type: type,
						name_versioned: result.name_versioned,
						name_unversioned: result.name_unversioned,
					})
					
					//skip versioned directory content
					if (type == 'Directory') return 'continue';
				}
			}, true);
		}
		
		Module.prototype.switchVersion = function (target_version, callback) {
			if (!this.verisoned_list) {
				Dr.log('[VersionCenter] verisoned_list not defined, run getVersionedList first');
				return;
			}
			if (this.verisoned_list.length == 0) {
				Dr.log('[VersionCenter] no versioned file in verisoned_list:', this.verisoned_list);
				return;
			}
			if (!this.version_suffix_map[target_version] && target_version !== 'DEFAULT') {
				Dr.log('[VersionCenter] target_version not in verisoned_list:', target_version);
				return;
			}
			
			this.target_version = target_version;
			
			Dr.log(this.verisoned_list);
			
			if (callback) callback();
		}
		
		Module.prototype.checkVersionSuffix = function (file_name) {
			var name_segments = file_name.split('.');
			var name_base = name_segments.shift();
			var name_ext = name_segments.length == 0 ? '' : ('.' + name_segments.join('.'));
			
			var name_base_segments = name_base.split(this.version_suffix_seperator);
			var version_suffix = name_base_segments.pop();
			var is_versioned = this.version_suffix_map[version_suffix] || false;
			
			var name_versioned;
			var name_unversioned;
			if (is_versioned) {
				name_versioned = file_name;
				name_unversioned = name_base_segments.join(this.version_suffix_seperator) + name_ext;
			}
			else {
				version_suffix = '';
				name_unversioned = file_name;
			}
			
			return {
				is_versioned: is_versioned,
				version_suffix: version_suffix,
				
				name_versioned: name_versioned,
				name_unversioned: name_unversioned,
				
				name_base: name_base,
				name_ext: name_ext,
			};
		}
		
		return Module;
	});
}