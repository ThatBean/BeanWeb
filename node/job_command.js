require('./Dr.js');

var global_args = process.argv;

var node_exe = global_args[0];
var script_file = global_args[1];
var config_file = global_args[2];


var usuage = [
    '<node>',
    '<this_script>',
    '<config_json_file>',
].join(' + ');
var get_arg = [
    node_exe,
    script_file,
    (config_file || '<config json file>'),
].join(' + ');

if (global_args.length < 3) {
    Dr.log('[Usage]\n' + usuage);
    Dr.log('[Get]\n' + get_arg);
    Dr.log('[Error] required arguments missing!');
    process.exit(-1);
}


//check pass

var node_module_path = Dr.require('path');

Dr.loadLocalScript('./Dr.node.js', function () {
    Dr.loadScriptByList([
        './module/command.js',
        './module/job_center.js',
    ], function () {

        Dr.log("All script loaded");

        defineCommandJobModule();

        Dr.LoadAll();

        var job_config_list = loadJobConfig(config_file);
        //Dr.log(job_config_list);

        startJobCenter(job_config_list);
        //Dr.startREPL();
    });
});

//called above...

function defineCommandJobModule() {
    Dr.Declare('CommandJob', 'class');
    Dr.Require('CommandJob', 'JobBase');
    Dr.Require('CommandJob', 'Command');
    Dr.Implement('CommandJob', function (global, module_get) {
        var JobBase = module_get('JobBase');
        var Command = module_get('Command');

        var Module = function () {
            //
        };

        Module.status = JobBase.status;

        Module.prototype.init = function (job_config, callback) {
            this.job_config = job_config;
            this.callback = callback;
            this.id = Dr.generateId();

            if (!this.job_config.callbackOutput) {
                this.job_config.stdoutStream = this.job_config.stdoutStream || process.stdout;
                this.job_config.stderrStream = this.job_config.stderrStream || process.stdout;
            }

            var _this = this;
            this.job_config.callback = function (code, signal) {
                var status = (code == 0 ? Module.status.End : Module.status.Error);
                Dr.debug(5, '[CommandJob][callback] id:', _this.id, 'status:', status, code, signal);
                if (_this.job_config.sync) _this.callback(status, _this.id, code, signal);
            }
        }

        //Module.prototype = new JobBase;	//in fact not so useful
        Module.prototype.start = function () {
            Dr.log('[CommandJob][start] id:', this.id);
            Dr.log('--dir:', this.job_config.cwd);
            Dr.log('--command:', this.job_config.command);
            Command.run(this.job_config.command, this.job_config);
            if (!this.job_config.sync) this.callback(Module.status.End, this.id, 'sync == false');
        }

        return Module;
    });
}

function startJobCenter(job_config_list) {
    var JobCenter = Dr.Get('JobCenter');
    var CommandJob = Dr.Get('CommandJob');

    var job_create_func = function (data, callback) {
        var job = new CommandJob;
        job.init(data, callback);
        return job;
    }

    var common_callback = function (status) {
        Dr.log('[common_callback] status:', status, 'arguments:', arguments);
        if (status == JobCenter.status.Error) {
            Dr.log('[Error] get error! stop execution...');
            return false;
        }
        if (status == JobCenter.status.Finish) {
            Dr.log('[Finish] all finished...');
        }
    }

    var job_center = new JobCenter;
    job_center.init(job_config_list, job_create_func, common_callback);
    job_center.start();
}

function loadJobConfig(config_file) {
    Dr.debug(5, '[loadJobConfig] config_file:', config_file);
    var config_src = Dr.loadJsonFile(config_file);

    var global_config = {
        dir: config_src.dir || process.cwd(),
        env: Dr.combine(config_src.env || process.env, config_src.env_append || {}),
        sync: (config_src.sync != undefined ? config_src.sync : true),
    };

    var job_config_src_list = config_src.job_list;
    var job_config_list = [];

    //apply global config to each job config
    for (var index in job_config_src_list) {
        var job_config_src = job_config_src_list[index];

        combineConfig(global_config, job_config_src);

        var job_config = {
            cwd: job_config_src.dir || process.cwd(),
            env: Dr.combine(job_config_src.env || process.env, job_config_src.env_append || {}),
            sync: (job_config_src.sync != undefined ? job_config_src.sync : true),
            command: job_config_src.command,
        };

        if (!job_config.command) throw new Error('job_config.command undefined');
        else job_config_list.push(job_config);
    }
    return job_config_list;
}

function combineConfig(global_config, job_config) {
    for (var key in global_config) {
        var global_config_value = global_config[key];	//global_config
        var job_config_value = job_config[key];	//job_config

        if (job_config_value != undefined) {
            switch (key) {
                case 'dir':
                    job_config[key] = node_module_path.resolve(global_config_value, job_config_value);
                    break;
                case 'sync':
                case 'env':
                    job_config[key] = job_config_value;	//job first
                    break;
                default:
                    Dr.log('[Error] Unsupported global_config key:', key);
                    break;
            }
        }
        else {
            job_config[key] = global_config_value;	//just overwrite
        }
    }
}