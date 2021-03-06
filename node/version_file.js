require('./Dr.js');

//Dr.debugLogLevel = 1;

var global_args = process.argv;

var node_exe = global_args[0];
var script_file = global_args[1];
var config_file = global_args[2];
//optional
var target_dir = global_args[3];
var target_version = global_args[4];


var usuage = [
	'<node>',
	'<this_script>',
	'<config_file>',
	'[optional]',
	'<target_dir>',
	'<target_version>',
].join(' + ');
var get_arg = [
	node_exe,
	script_file,
	(config_file || '<config_file>'),
	'[optional]',
	(target_dir || '<target_dir>'),
	(target_version || '<target_version>'),
].join(' + ');

if (global_args.length < 3) {
	Dr.log('[Usage]\n' + usuage);
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

		Dr.log('[Dr] version file config_file:', config_file);
		var version_config = Dr.loadJsonFile(config_file);

		var VersionCenter = Dr.Get('VersionCenter');

		var version_center = new VersionCenter;
		version_center.init(version_config);

		version_center.getVersionedList(target_dir || version_config.target_dir || '.');

		version_center.switchVersion(target_version || version_config.target_version);

		//Dr.startREPL();
	});
});


//called above...

function defineVersionCenterModule () {
	Dr.Declare('VersionCenter', 'class');
	Dr.Require('VersionCenter', 'File');
	Dr.Implement('VersionCenter', function (global, module_get) {
		var File = module_get('File');

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
			if (File.getPathType(target_dir) != File.type.Directory) {
				Dr.log('[VersionCenter] target_dir not valid directory! target_dir:', target_dir, File.getPathType(target_dir));
			}

			Dr.debug(5, '[VersionCenter] target_dir:', target_dir);
			this.target_dir = target_dir;
			this.verisoned_list = [];

			var directory = File.create(target_dir);

			var _this = this;
			directory.walk(function (path, name, type) {
				//console.log('Get', ' - ', path, ' - ', name, ' - ', type);

				if (type != File.type.Directory' && type != File.type.File) {
					Dr.log('[VersionCenter] Skipped unknown type', type, path, name);
					return;
				}

				if (name[0] == '.') {
					Dr.log('[VersionCenter] Skipped hidden file', type, path, name);
					return 'continue';
				}

				var result = _this.checkVersionSuffix(name);
				if (result.is_versioned) {
					Dr.log('[VersionCenter] Get versioned:', type, path, result.name_versioned, result.name_unversioned);

					_this.verisoned_list.push({
						path: path,
						type: type,
						version: result.version_suffix,
						name_versioned: result.name_versioned,
						name_unversioned: result.name_unversioned,
					})

					//skip versioned directory content
					if (type == File.type.Directory) return 'continue';
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

			Dr.log('[VersionCenter] target_version:', target_version);
			this.target_version = target_version;

			Dr.log(this.verisoned_list);

			var delete_list = [];
			var rename_list = [];

			//sort versioned list
			for (var index in this.verisoned_list) {
				var versioned_info = this.verisoned_list[index];
				if (versioned_info.version == target_version) {
					rename_list.push([
						versioned_info.type,
						versioned_info.path,
						versioned_info.name_versioned,
						versioned_info.name_unversioned
					]);
					delete_list.push([
						versioned_info.type,
						versioned_info.path,
						versioned_info.name_unversioned
					]);
				}
				else {
					delete_list.push([
						versioned_info.type,
						versioned_info.path,
						versioned_info.name_versioned
					]);
				}
			}

			Dr.log('delete_list', delete_list);
			Dr.log('rename_list', rename_list);

			//delete first
			for (var index in delete_list) {
				var type = delete_list[index][0];
				var path = delete_list[index][1];
				var name = delete_list[index][2];

				File.modify('delete', type, Path.join(path, name));
			}

			//then rename
			for (var index in rename_list) {
				var type = rename_list[index][0];
				var path = rename_list[index][1];
				var name = rename_list[index][2];
				var name_to = rename_list[index][3];

				File.modify('move', type, Path.join(path, name), Path.join(path, name_to));
			}

			//callback
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