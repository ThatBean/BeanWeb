require('./Dr.js');

var global_args = process.argv;

var node_exe = global_args[0];
var script_file = global_args[1];
var luac_exe_path = global_args[2];
var target_dir = global_args[3];
//optional
var regexp_selector_string = global_args[4] || '.lua';
var addon_extension = global_args[5] || '';
var luac_addon_option = global_args[6] || '';

var usuage = [
    '<node>',
    '<this_script>',
    '<target_dir>',
    '[optional]',
    '<regexp_selector_string>',
    '<addon_extension>',
    '<luac_addon_option>',
].join(' + ');
var get_arg = [
    node_exe,
    script_file,
    (target_dir || '<target_dir>'),
    '[optional]',
    (regexp_selector_string || '<regexp_selector_string>'),
    (addon_extension || '<addon_extension>'),
    (luac_addon_option || '<luac_addon_option>'),
].join(' + ');

if (global_args.length < 4) {
    Dr.log('[Usage]\n' + usuage);
    Dr.log('[Get]\n' + get_arg);
    Dr.log('[Error] required arguments missing!');
    process.exit(-1);
}

var regexp_selector = RegExp(regexp_selector_string);

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


//check pass

var Path = Dr.require('path');

Dr.loadLocalScript('./Dr.node.js', function () {
    Dr.loadScriptByList([
        './module/command.js',
        './module/file.js',
    ], function () {
        Dr.log("All script loaded");

        Dr.LoadAll();

        var Command = Dr.Get('Command');
        var File = Dr.Get('File');

        var directory = File.create(target_dir);

        directory.walk(function (path, name, type) {
            if (type == 'File' && name.match(regexp_selector)) {
                var current_path = Path.join(path, name);

                var luac_command = ([
                    luac_exe_path,		//luac
                    '-o ' + current_path + addon_extension, //output file
                    current_path, //input file
                    luac_addon_option
                ]).join(' ');

                var command_config = {
                    cwd: process.cwd(),
                    stdoutStream: process.stdout,
                    stderrStream: process.stdout,
                };

                job_func_list.push(function (callback) {
                    console.log('[Command] luac_command:', luac_command);
                    command_config.callback = function (code, signal) {
                        if (code == 0) {
                            callback();
                        }
                        else {
                            Dr.log('[Error] code:', code, signal);
                            process.exit(-1);
                        }
                    };
                    Command.run(luac_command, command_config);
                })
            }
            else {
                console.log('[Skipped]', ' - ', path, ' - ', name, ' - ', type);
            }
        }, true);

        //run each func
        run_job_func();

        //Dr.startREPL();
    });
});