Dr.Declare('PathContent', 'class');
Dr.Implement('PathContent', function (global, module_get) {
	var Fs = Dr.require('fs');
	var Path = Dr.require('path');
	var Assert = Dr.require('assert')
	
	var Module = function () {
		//
	};
	
	Module.status = {
		//OFF: 'OFF',
		CONNECT: 'CONNECT',
		ALLCONNECT: 'ALLCONNECT',
		DISCONNECT: 'DISCONNECT',
		//RECONNECT: 'RECONNECT',
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


	Module.getDirContent = function (dir_path) {
		var content = Fs.readdirSync(dir_path);
		return content;
	}
	
	
	Module._delete = function (path_type, path) {
		switch (path_type) {
			case 'File':
			case 'SymbolicLink':
				return Fs.unlinkSync(path);
				break;
			case 'Directory':
				return Fs.rmdirSync(path);
				break;
			default:
				console.log('[deleteContent] strange path type', path_type);
				return false;
				break;
		}
	}
	
	Module._move = function (path_type, from_path, to_path) {
		switch (path_type) {
			case 'File':
			case 'SymbolicLink':
			case 'Directory':
				return Fs.renameSync(from_path, to_path);
				break;
			default:
				console.log('[moveContent] strange path type', path_type);
				return false;
				break;
		}
	}
	
	
	Module._copy = function (path_type, from_path, to_path) {
		switch (path_type) {
			case 'File':
			case 'SymbolicLink':
				return Module.copyFileSync(from_path, to_path);
				break;
			case 'Directory':
				return Fs.mkdirSync(to_path);
				break;
			default:
				console.log('[copyContent] strange path type', path_type);
				return false;
				break;
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
	
	
	Module.prototype.init = function (path) {
		//for ActorSlot
		this.content = {
			'Directory': {},
			'File': [],
			'SymbolicLink': [],
			'Other': [],
		};
		this.path = path;
		
		this.init_content();
	};
	
	Module.prototype.init_content = function () {
		console.log('init_content', Path.dirname(this.path));
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
	
	Module.prototype.modify = function (operation, to_path) {
		var callback;
		var is_call_before_walk;
		
		switch (operation) {
			case 'copy':
				callback = function (path, name, type)  {
					var from_path = Path.join(path, name);
					return Module._copy(type, from_path, to_path);
				};
				is_call_before_walk = true;
				break
			case 'delete':
				callback = function (path, name, type)  {
					var path = Path.join(path, name);
					return Module._delete(type, path);
				};
				is_call_before_walk = false;
				break
			case 'move':
				callback = function (path, name, type)  {
					var from_path = Path.join(path, name);
					return Module._move(type, from_path, to_path);
				};
				is_call_before_walk = true;
				break
		}
		
		this.walk(callback, is_call_before_walk);
	}
	Module.create = function (path) {
		var instance = new Module;
		instance.init(path);
		return instance;
	};
	
	return Module;
});

/*
var test_path = process.argv[2];
var test = PathContent.create(test_path);
test.walk(function (path, name, type) {
	console.log('Get', ' - ', path, ' - ', name, ' - ', type);
})
*/