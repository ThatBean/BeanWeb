Dr.Declare('Job', 'class');
Dr.Implement('Job', function (global, module_get) {
	var Http = Dr.require('http');
	
	var Module = function () {
		//
	};
	
	Module.prototype.init = function (callback, method, message, port, host_name) {
		this.callback = callback;
		this.method = method;
		this.message = message;
		this.port = port;
		this.host_name = host_name;
		
		this.is_active = false;
	};
	
	Module.prototype.start = function () {
		if (this.is_active) return;
		
		var options = {
			method: this.method,
			port: this.port,
			hostname: this.host_name,
		};
		
		var _this = this;
		var request = Http.request(options, function (response) {
			_this.onRespond(request, response);
		});
		
		request.on('error', function(error) {
			Dr.log('problem with request: ' + error.message);
		});
		
		if (this.method == 'POST') request.write(this.message || '');
		request.end();
		
		this.request = request;
		
		this.is_active = true;
		Dr.log('Request started at port', this.port, 'host_name', this.host_name);
	};
	
	Module.prototype.stop = function () {
		if (!this.is_active) return;
		this.request.abort();
		this.is_active = false;
		Dr.log('Request stopped');
	};
	
	Module.prototype.onRespond = function (request, response) {
		Dr.log('STATUS: ' + respond.statusCode);
		Dr.log('HEADERS: ' + JSON.stringify(respond.headers));
		
		var buffer = '';
		var _this = this;
		respond.addListener('data', function(chunk){
			//console.log('Get data', arguments);
			buffer += chunk;
		});
		respond.addListener('end', function(){
			//console.log('Get message', buffer.toString());
			_this.onRespondEnd(request, response, buffer);
		});
	};
	
	Module.prototype.onRespondEnd = function (request, response, buffer) {
		if (this.callback) {
			this.callback(request, response, buffer);
		}
		else {
			Dr.log(request, response, buffer.toString());
		}
	};
		
	Module.create = function (callback, port, host_name) {
		var instance = new Module;
		instance.init(callback, port, host_name);
		return instance;
	};
	
	return Module;
});









/// Job = {
///     
///     //will be read and deleted by job
///     sync:         true,
///     cwd:          '../../',
///     
///     env:          process.env,   
///     env_append:   {}, 
///       //json env like: {Path: 'aaa/bbb;ddd/kkk', OS: 'linux'}
///     
///     command:      'ls',
///     
///     //will generate and filled by job
///     //cwd: process.cwd(),
///     //env: process.env,
///     //exitFunc: function() {},  //callback for exit
///     
/// }

	
Dr.Declare('Job', 'class');
Dr.Require('Job', 'Command');
Dr.Implement('Job', function (global, module_get) {
	
	function Job(optionJson, callback) {
		var _Option = _shallowCopy(optionJson);

		this.Cmd = _getAndDelete(_Option, 'command');
		//get and delete
		this.Sync = _getAndDelete(_Option, 'sync') || false; ///use callback when: 1.ASync-started 2.Sync-ended
		var _Cwd = _getAndDelete(_Option, 'cwd') || process.cwd();
		var _Env = _getAndDelete(_Option, 'env') || process.env;
		var _Env_Append = _getAndDelete(_Option, 'env_append') || {};

		//deal Env
		_Env = _mergeObj(_shallowCopy(_Env), _Env_Append);

		//add to option
		_Option.cwd = _Cwd;
		_Option.env = _Env;
		if (this.Sync == true) _Option.exitFunc = callback; ///sync

		this.Option = _Option;

		if (this.Sync == false) this.asyncFunc = callback; ///async
		//if something else
	}

	function _getAndDelete(tgtObj, key) {
		if (tgtObj[key]) {
			var temp = tgtObj[key];
			delete tgtObj[key];
			return temp;
		}
	}

	Job.prototype.start = function () {
		console.warn('[job start]');
		if (this.asyncFunc) {
			this.asyncFunc();
		}
		this.SubProcess = spawnShellSubProcess (this.Cmd, this.Option);
		return this.SubProcess;
	}

	
	
/// JobPack = {
///     job_wd:        '/user/',
///     sync:         true,
///     env:          process.env,
///     env_append:        {},
///     job_list:      [<Job>, <Job>],
/// }
	
	
Dr.Declare('JobCenter', 'class');
Dr.Require('JobCenter', 'Job');
Dr.Implement('JobCenter', function (global, module_get) {
	
	var Module = function () {
		//
	};
	
	function init(jobPack, callback) {
		this.JobPack = jobPack;
		this.FinalCallback = callback;
		this.JobList = [];  //job to run
		//if something else
		this.unpackJobToList();
	}

	Module.prototype.unpackJobToList = function () {
		this.JobWorkingDir = this.JobPack.job_wd || process.cwd();
		this.Sync = (this.JobPack.sync != undefined) ? this.JobPack.sync : true;

		var _Env =  this.JobPack.env || process.env;
		var _Env_append =  this.JobPack.env_append || {};

		this.Env = _mergeObj(_shallowCopy(_Env), _Env_append);

		for (var i in this.JobPack.job_list) {
			var jobOption = this.JobPack.job_list[i];
			///override job default
			jobOption.sync = jobOption.sync != undefined ? jobOption.sync : this.Sync;
			jobOption.cwd = jobOption.cwd ? path.join(this.JobWorkingDir, jobOption.cwd) : this.JobWorkingDir;
			jobOption.env = jobOption.env ? _mergeObj(_shallowCopy(this.Env), jobOption.env) : this.Env;

			//console.warn('[Override]', jobOption.env);
			///ready to work
			this.JobList.push(new Job(jobOption, this.CallbackCenter()));
		}
		return;
	}

	Module.prototype.start = function () {
		var firstJob = this.JobList.shift();
		if (firstJob) firstJob.start();
		else {
			this.FinalCallback();
			console.warn('[Job Center] no job to dispatch');
		}
		return;
	}

	///run next job
	Module.prototype.CallbackCenter = function () {
		var self = this;
		return function (code, signal) {
			if (code != 0) {
				Dr.log('[Error] code: ' + code);
				Dr.log('[Error] signal: ' + signal);
				process.exit(1);
			}
			var nextJob = self.JobList.shift();
			if (nextJob) nextJob.start();
			else {
				self.FinalCallback(code, signal);
				console.warn('[Job Center] all job dispatched');
			}
		};
	}