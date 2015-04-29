Dr.Declare('Directory', 'class');
Dr.Implement('Directory', function (global, module_get) {
	var Fs = Dr.require('fs');
	var Path = Dr.require('path');
	var Assert = Dr.require('assert')
	
	var Module = function () {
		//
	};
	
	Module.getPathType = function (path) {
		var path_type;
		try {
			var stat = Fs.lstatSync(path);
			if (stat.isDirectory()) path_type = 'Directory';
			else if (stat.isFile()) path_type = 'File';
			else if (stat.isSymbolicLink()) path_type = 'SymbolicLink';
			else path_type = 'Other';
		}
		catch (error) {
			path_type = 'Error';
		};
		return path_type;
	}


	Module.getDirContent = function (dir_path) { return Fs.readdirSync(dir_path); }
	
	Module.createDirRecursive = function (dir_path) {
		var dir_path = Path.resolve(dir_path);
		var upper_dir_path = Path.dirname(dir_path);
		if (Module.getPathType(upper_dir_path) != 'Directory') Module.createDirRecursive(upper_dir_path);
		if (Module.getPathType(dir_path) != 'Directory') Fs.mkdirSync(dir_path);
	};
	
	
	Module._delete = function (path_type, path) {
		Dr.log('[_delete]', arguments);
		if (Module.getPathType(path) === 'Error') {
			Dr.log('[_delete] non-exist, skipped');
			return;
		}
		switch (path_type) {
			case 'File':
			case 'SymbolicLink':
				return Fs.unlinkSync(path);
			case 'Directory':
				return Fs.rmdirSync(path);
			default:
				Dr.log('[deleteContent] strange path type', path_type);
				return false;
		}
	}
	
	Module._move = function (path_type, from_path, to_path) {
		Dr.log('[_move]', arguments);
		if (Module.getPathType(to_path) === path_type) {
			Dr.log('[_move] exist, skipped');
			return;
		}
		switch (path_type) {
			case 'File':
			case 'SymbolicLink':
			case 'Directory':
				return Fs.renameSync(from_path, to_path);
			default:
				Dr.log('[moveContent] strange path type', path_type);
				return false;
		}
	}
	
	
	Module._copy = function (path_type, from_path, to_path) {
		Dr.log('[_copy]', arguments);
		if (Module.getPathType(to_path) === path_type) {
			Dr.log('[_copy] exist, skipped');
			return;
		}
		switch (path_type) {
			case 'File':
			case 'SymbolicLink':
				return Module.copyFileSync(from_path, to_path);
			case 'Directory':
				return Fs.mkdirSync(to_path);
			default:
				Dr.log('[copyContent] strange path type', path_type);
				return false;
		}
	}
	
	Module.copyFileSync = function (from_file_path, to_file_path) {
		var fd_from	= Fs.openSync(from_file_path, 'r');
		var stat = Fs.fstatSync(fd_from);
		var fd_to = Fs.openSync(to_file_path, 'w', stat.mode);
		var bytes_read = stat.size;
		var pos = 0;
		
		var BUFFER_LENGTH = 64 * 1024;
		var buffer = new Buffer(BUFFER_LENGTH);
		
		while (bytes_read > 0) {
			bytes_read = Fs.readSync(fd_from, buffer, 0, BUFFER_LENGTH, pos);
			Fs.writeSync(fd_to, buffer, 0, bytes_read);
			pos += bytes_read;
		}

		Fs.closeSync(fd_from);
		Fs.closeSync(fd_to);
	}
	
	
	Module.prototype.init = function (dir_path) {
		if (Module.getPathType(dir_path) !== 'Directory') {
			Dr.log('[init] Error! path not Directory', dir_path);
			return;
		}
		
		this.path = dir_path;
		this.content = {
			'Directory': {},
			'File': [],
			'SymbolicLink': [],
			'Other': [],
		};
		
		this.init_content();
	};
	
	Module.prototype.init_content = function () {
		Dr.log('init_content', Path.dirname(this.path));
		var content = Module.getDirContent(this.path);
		for (var index in content) {
			var name = content[index];
			var sub_path = Path.join(this.path, name);
			var path_type = Module.getPathType(sub_path);
			switch (path_type) {
				case 'File':
				case 'SymbolicLink':
					this.content[path_type].push(name);
					break;
				case 'Directory':
					this.content.Directory[name] = Module.create(sub_path);
					break;
				default:
					this.content.Other.push(name);
					break;
			}
		}
	}
	
	Module.prototype.walk = function (callback, is_call_before_walk) {
		for (var type in this.content) {
			var list = this.content[type];
			for (var index in list) {
				if (type == 'Directory') {
					var name = index;
					if (is_call_before_walk) {
						callback(this.path, name, type);
						list[index].walk(callback, is_call_before_walk);
					}
					else {
						list[index].walk(callback, is_call_before_walk);
						callback(this.path, name, type);
					}
				}
				else {
					var name = list[index];
					callback(this.path, name, type);
				}
			}
		}
	}
	
	Module.prototype.modify = function (operation, to_path_root) {
		var callback_name;
		var is_call_before_walk;
		var to_path_list = {};
		
		if (to_path_root) to_path_list[this.path] = to_path_root;
		
		switch (operation) {
			case 'copy':
				callback_name = '_copy';
				is_call_before_walk = true;
				Module.createDirRecursive(to_path_root);
				break;
			case 'delete':
				callback_name = '_delete';
				is_call_before_walk = false;
				break;
			case 'move':
				callback_name = '_move';
				is_call_before_walk = true;
				Module.createDirRecursive(to_path_root);
				break;
			default:
				Dr.log('[modify] Error operation', operation);
				break;
		}
		
		var callback = function (path, name, type)  {
			Dr.log(path, name, type);
			var from_path = Path.join(path, name);
			if (to_path_root) {
				to_path_list[from_path] = Path.join(to_path_list[path], name);
				return Module[callback_name](type, from_path, to_path_list[from_path]);
			}
			else {
				return Module[callback_name](type, from_path);
			}
		};
		
		this.walk(callback, is_call_before_walk);
	};
	
	Module.create = function (path) {
		var instance = new Module;
		instance.init(path);
		return instance;
	};
	
	return Module;
});