Dr.Declare('JobBase', 'class');
Dr.Implement('JobBase', function (global, module_get) {
    var Module = function () {

    };

    Module.prototype.init = function (data, callback) {
        this.data = data;
        this.callback = callback;
    };

    Module.status = {
        Error: 'Error',
        Start: 'Start',
        End: 'End',		//end of a job
        Finish: 'Finish',	//end of all job
    };

    Module.prototype.start = function () {
        Dr.debug(5, '[job start]');
        return this.callback(Module.status.End);
    };

    return Module;
});


Dr.Declare('JobCenter', 'class');
Dr.Require('JobCenter', 'JobBase');
Dr.Implement('JobCenter', function (global, module_get) {
    var JobBase = Dr.Get('JobBase');

    var Module = function () {
        //
    };

    Module.status = JobBase.status;

    Module.prototype.init = function (job_data_list, job_create_func, callback) {
        this.job_data_list = job_data_list;
        this.job_create_func = job_create_func;
        this.callback = callback;

        this.job_list = [];  //job to run
        this.initJob();
    };

    Module.prototype.initJob = function () {
        for (var i in this.job_data_list) {
            var job_data = this.job_data_list[i];
            var job = this.job_create_func(job_data, this.getJobCallback());
            this.job_list.push(job);
        }
        Dr.debug(5, 'inited', this.job_list.length, 'Job');
    };

    Module.prototype.start = function () {
        var next_job = this.job_list.shift();
        if (next_job) {
            Dr.debug(5, 'start next job, left:', this.job_list.length);
            next_job.start();
        }
        else {
            Dr.debug(10, '[JobCenter] all job finished');
            this.callback(Module.status.Finish);
        }
    };

    ///run next job
    Module.prototype.getJobCallback = function () {
        if (!this.job_callback) {
            var _this = this;
            this.job_callback = function (status) {
                var is_continue = true;

                if (status == Module.status.Error) {
                    Dr.log('[Error] arguments:', arguments);
                    is_continue = _this.callback.apply(_this, arguments);
                }

                if (is_continue) {
                    _this.start();
                }
                else {
                    Dr.log('[JobCenter] stopped with status:', status);
                    _this.callback.apply(_this, arguments);
                }
            };
        }

        return this.job_callback;
    };

    return Module;
});