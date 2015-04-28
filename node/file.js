//console.log("ok");

var Assert = require('assert')

var Os = require('os')
var Path = require('path')
var ChildProcess = require('child_process')
var Fs = require('fs')
var Spawn = require('child_process').spawn;

console.log(process.argv)


var PathContent = (function () {
	var Fs = require('fs');
	var Path = require('path');
	
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
	
	Module.prototype.walk = function (callback) {
		for (var type in this.content) {
			var list = this.content[type];
			for (var index in list) {
				if (type == 'Directory') {
					list[index].walk(callback);
				}
				else {
					var name = list[index];
					callback(this.path, name, type);
				}
			}
		}
	}
	
	Module.create = function (path) {
		var instance = new Module;
		instance.init(path);
		return instance;
	};
	
	return Module;
})();

var test_path = process.argv[2];

var test = PathContent.create(test_path);
test.walk(function (path, name, type) {
	console.log('Get', ' - ', path, ' - ', name, ' - ', type);
})

//console.log(PathContent.create(destination_dir));