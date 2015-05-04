Dr.Declare('JobBase', 'class');
Dr.Implement('JobBase', function (global, module_get) {
	var Module = function (data, callback) {
		this.data = data;
		this.callback = callback;
	}
	
	Module.status = {
		Error: 'Error',
		Start: 'Start',
		Finish: 'Finish',
	}
	
	Module.prototype.start = function () {
		console.warn('[job start]');
		return this.callback();
	}

	return Module;
});


Dr.Declare('JobCenter', 'class');
Dr.Implement('JobCenter', function (global, module_get) {
	
	var Module = function () {
		//
	};
	
	Module.prototype.init = function (job_data_list, job_create_func, callback) {
		this.job_data_list = job_data_list;
		this.job_create_func = job_create_func;
		this.callback = callback;
		
		this.job_list = [];  //job to run
		this.initJob();
	}

	Module.prototype.initJob = function () {
		for (var i in this.job_data_list) {
			var job_data = this.job_data_list[i];
			var job = this.job_create_func(job_data, this.getJobCallback());
			this.job_list.push(job);
		}
		Dr.log('inited', this.job_list.length, 'Job');
	}

	Module.prototype.start = function () {
		Dr.log('start next job...', this.job_list.length);
		var next_job = this.job_list.shift();
		if (next_job) {
			next_job.start();
			console.warn('[JobCenter] start next job');
		}
		else {
			console.warn('[JobCenter] all job finished');
			this.callback('Finish');
		}
	}

	///run next job
	Module.prototype.getJobCallback = function () {
		if (!this.job_callback) {
			var _this = this;
			this.job_callback = function (status) {
				var is_continue = true;
				
				if (status == 'Error') {
					Dr.log('[Error] arguments:', arguments);
					is_continue = _this.callback.apply(_this, arguments);
				};
				
				if (is_continue) {
					_this.start();
				}
				else {
					console.warn('[JobCenter] stopped with status:', status);
					_this.callback.apply(_this, arguments);
				}
			};
		};
		return this.job_callback;
	}
	
	return Module;
});