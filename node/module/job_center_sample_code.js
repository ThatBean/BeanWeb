require('../Dr.js');

Dr.loadLocalScript('./job_center.js', function () {
    Dr.log("All script loaded");
    Dr.LoadAll();

    var JobCenter = Dr.Get('JobCenter');
    var JobBase = Dr.Get('JobBase');

    var job_center = new JobCenter;
    var job_create_func = function (data, callback) {
        var job_base = new JobBase;
        job_base.init(data, callback);
        job_base.id = Dr.generateId();
        Dr.log('job_base', data, job_base.id);


        job_base.start = function () {
            var job_id = this.id;
            Dr.log('job_base', job_id);
            setTimeout(function () {
                callback('Error', data, job_id);
            }, 1000);
        };

        return job_base;
    };

    var job_data_list = [1, 2, 3, 4, 5, 6, 7, 8];
    var common_callback = function (status) {
        Dr.log('[common_callback] status:', status, 'arguments:', arguments);

        if (status == 'Error') {
            Dr.log('get error!!! omit');
            return true;
        }
    };

    job_center.init(job_data_list, job_create_func, common_callback);

    job_center.start();

    //Dr.startREPL();
});