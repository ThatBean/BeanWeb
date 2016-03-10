Dr.Declare('Directory', 'class');
Dr.Implement('Directory', function (global, module_get) {
    var node_module_fs = Dr.require('fs');
    var node_module_path = Dr.require('path');

    var Module = function () {
        //
    };

    Module.type = {
        File: 'File',
        Directory: 'Directory',
        SymbolicLink: 'SymbolicLink', // tricky

        Other: 'Other',
        Error: 'Error',
    };


    Module.getPathType = function (path) {
        var path_type;
        try {
            var stat = node_module_fs.lstatSync(path);

            if (stat.isDirectory()) path_type = Module.type.Directory;
            else if (stat.isFile()) path_type = Module.type.File;
            else if (stat.isSymbolicLink()) path_type = Module.type.SymbolicLink;
            else path_type = Module.type.Other;
        }
        catch (error) {
            path_type = Module.type.Error;
        }
        ;
        return path_type;
    }

    Module._create_dir_recursive = function (dir_path) {
        var dir_path = node_module_path.resolve(dir_path);
        var upper_dir_path = node_module_path.dirname(dir_path);
        if (Module.getPathType(upper_dir_path) != Module.type.Directory) Module._create_dir_recursive(upper_dir_path);
        if (Module.getPathType(dir_path) != Module.type.Directory) node_module_fs.mkdirSync(dir_path);
    };

    Module._copy_file_sync = function (from_file_path, to_file_path) {
        var fd_from = node_module_fs.openSync(from_file_path, 'r');
        var stat = node_module_fs.fstatSync(fd_from);
        var bytes_read = stat.size;
        var pos = 0;

        var fd_to = node_module_fs.openSync(to_file_path, 'w', stat.mode);

        var BUFFER_LENGTH = 64 * 1024;
        var buffer = new Buffer(BUFFER_LENGTH);

        while (bytes_read > 0) {
            bytes_read = node_module_fs.readSync(fd_from, buffer, 0, BUFFER_LENGTH, pos);
            node_module_fs.writeSync(fd_to, buffer, 0, bytes_read);
            pos += bytes_read;
        }

        node_module_fs.closeSync(fd_from);
        node_module_fs.closeSync(fd_to);
    }

    Module._delete = function (path_type, path) {
        Dr.debug(5, '[_delete]', arguments);
        if (Module.getPathType(path) === Module.type.Error) {
            Dr.log('[_delete] non-exist, skipped');
            return;
        }
        switch (path_type) {
            case Module.type.File:
            case Module.type.SymbolicLink:
                return node_module_fs.unlinkSync(path);
            case Module.type.Directory:
                return node_module_fs.rmdirSync(path);
            default:
                Dr.log('[deleteContent] strange path type', path_type);
                return false;
        }
    }

    Module._move = function (path_type, from_path, to_path) {
        Dr.debug(5, '[_move]', arguments);
        if (Module.getPathType(to_path) === path_type) {
            Dr.log('[_move] exist, skipped');
            return;
        }
        switch (path_type) {
            case Module.type.File:
            case Module.type.SymbolicLink:
            case Module.type.Directory:
                return node_module_fs.renameSync(from_path, to_path);
            default:
                Dr.log('[moveContent] strange path type', path_type);
                return false;
        }
    }

    Module._copy = function (path_type, from_path, to_path) {
        Dr.debug(5, '[_copy]', arguments);
        if (Module.getPathType(to_path) === path_type) {
            Dr.log('[_copy] exist, skipped');
            return;
        }
        switch (path_type) {
            case Module.type.File:
            case Module.type.SymbolicLink:
                return Module._copy_file_sync(from_path, to_path);
            case Module.type.Directory:
                return node_module_fs.mkdirSync(to_path);
            default:
                Dr.log('[copyContent] strange path type', path_type);
                return false;
        }
    }


    Module.create = function (path) {
        var instance = new Module;
        instance.init(path);
        return instance;
    };

    Module.modify = function (operation, type, from_path, to_path) {
        var type = type || Module.getPathType(from_path);

        switch (operation) {
            case 'copy':
            case 'delete':
            case 'move':
                break;
            default:
                Dr.log('[modify] Error operation', operation);
                return;
                break;
        }

        if (type == Module.type.File) {
            Module['_' + operation](type, from_path, to_path);
            return;
        }
        if (type == Module.type.Directory) {
            Module.create(from_path).modify(operation, to_path);
            if (operation == 'delete' || operation == 'move') Module._delete(Module.type.Directory, from_path);
            return;
        }
        Dr.log('[modify] Error type', type);
        return;
    };


    /*
     * @{param} target_file_ext '.ext'
     * */
    Module.getFileList = function (path, target_file_ext, output_file_prefix) {
        Dr.debug(10, '[getFileList]', path, target_file_ext, output_file_prefix);

        var file_list = [];

        var get_file_path_data = function (file_path, file_name) {
            if (!file_path || !file_name || (target_file_ext && (target_file_ext != node_module_path.extname(file_name)))) {
                return null;
            }
            var source_file_path = node_module_path.join(file_path, file_name);
            var result_file_path = output_file_prefix
                ? node_module_path.join(file_path, output_file_prefix + file_name)
                : source_file_path;
            return [source_file_path, result_file_path];
        }

        switch (Module.getPathType(path)) {
            case Module.type.File:
                var result = get_file_path_data(node_module_path.dirname(path), node_module_path.basename(path));
                if (result) file_list.push(result);
                break;
            case Module.type.Directory:
                var instance = Module.create(path);
                instance.walk(function (file_path, file_name, type) {
                    var result = get_file_path_data(file_path, file_name);
                    if (result) file_list.push(result);
                });
                break;
        }

        return file_list;
    };


    Module.prototype.init = function (dir_path) {
        if (Module.getPathType(dir_path) !== Module.type.Directory) {
            Dr.log('[init] Error! path not Directory', dir_path);
            return;
        }

        this.path = dir_path;
        this.content = {
            'Directory': {}, //dir name - sub_module

            'File': [], //file name
            'SymbolicLink': [], //link name
            'Other': [], //name
        };

        this.init_content();
    };

    Module.prototype.init_content = function () {
        Dr.debug(5, 'init_content', this.path);
        var content = node_module_fs.readdirSync(this.path);
        for (var index in content) {
            var name = content[index];
            var sub_path = node_module_path.join(this.path, name);
            var path_type = Module.getPathType(sub_path);
            switch (path_type) {
                case Module.type.File:
                case Module.type.SymbolicLink:
                    this.content[path_type].push(name);
                    break;
                case Module.type.Directory:
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
                var name;
                if (type == Module.type.Directory) name = index;
                else name = list[index];

                if (type == Module.type.Directory && !is_call_before_walk) {
                    list[index].walk(callback, is_call_before_walk);
                }

                var option = callback(this.path, name, type);

                if (option == 'continue') continue;	//skip current (should be sub Directory + is_call_before_walk == false)
                if (option == 'break') break;	//skip current content type
                if (option == 'return') return;	//skip the rest of content

                if (type == Module.type.Directory && is_call_before_walk) {
                    list[index].walk(callback, is_call_before_walk);
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
                Module._create_dir_recursive(to_path_root);
                break;
            case 'delete':
                callback_name = '_delete';
                is_call_before_walk = false;
                break;
            case 'move':
                callback_name = '_move';
                is_call_before_walk = true;
                Module._create_dir_recursive(to_path_root);
                break;
            default:
                Dr.log('[modify] Error operation', operation);
                break;
        }

        var callback = function (path, name, type) {
            Dr.debug(1, path, name, type);
            var from_path = node_module_path.join(path, name);
            if (to_path_root) {
                to_path_list[from_path] = node_module_path.join(to_path_list[path], name);
                return Module[callback_name](type, from_path, to_path_list[from_path]);
            }
            else {
                return Module[callback_name](type, from_path);
            }
        };

        this.walk(callback, is_call_before_walk);
    };

    return Module;
});