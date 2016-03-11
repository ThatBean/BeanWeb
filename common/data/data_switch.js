/* Data Switch
 * for data generate - collection pipeline
 *
 * - basic idea: each operation is a job
 * - - a job need a job_name
 * - - a job an be in a group by group_name
 * - - group run by defined order
 * - - jobs in group run in added order
 *
 *
 * - - data, data, data... -> text
 * - - data, data, data... -> text
 * - - data, data, data... -> text
 *
 * - - text, text, text -> result_text
 *
 * - job input format: (operation_data, previous_data)
 * - job result success: {}
 * - job result failed: null
 * */

Dr.Declare('DataSwitch', 'class');
Dr.Implement('DataSwitch', function (global, module_get) {

    var Module = function () {
        this.job_closure_map = {}; // job_name - job_closure
        this.job_result_data_map = {}; // job_name - result_data

        this.group_job_map = {}; // group_name - job_list
        this.group_order_list = {}; // group_name
    };

    Module.prototype.addJob = function (job_closure, job_name, group_name) {
        Dr.assert(this.job_closure_map[job_name];

        this.job_closure_map[job_name] = job_closure;

        this.addGroup(group_name);
    };
    Module.prototype.addGroup = function (group_name) {
        if (!this.group_job_map[group_name]) {
            this.group_job_map[group_name] = {};
        }
    };
    Module.prototype.setGroupOrder = function (group_order_list) {
        this.group_order_list = group_order_list;

        for (var index in this.group_order_list) {
            this.addGroup(this.group_order_list[index]);
        }
    };

    Module.prototype.getJobResultData = function (job_name) {
        return this.job_result_data_map[job_name];
    };

    Module.prototype.run = function (init_data) {

    };


    Module.prototype.runJob = function (job_name, data) {

    };

    Module.prototype.runGroup = function (group_name, data) {

    };

    return Module;
});