Dr.Declare('ResourceLoader', 'class');
Dr.Implement('ResourceLoader', function (global, module_get) {
	
	var Module = function () {
		this.loaded_cache = {};
	}
	
	Module._loader_list = {
		'text': Dr.loadText,
		'image': Dr.loadImage,
		'script': Dr.loadScript,
	};
	
	Module.prototype.getLoaderList = function () {
		return Module._loader_list;
	};
	
	Module.prototype._add_loaded_cache = function (type, src, loaded) {
		this.loaded_cache[type] = this.loaded_cache[type] || {};
		this.loaded_cache[type][src] = loaded;	//overwrite
	};
	
	Module.prototype._check_loaded_cache = function (load_data) {
		if (this.loaded_cache[load_data.type] && this.loaded_cache[load_data.type][load_data.src]) {
			load_data.loaded = this.loaded_cache[load_data.type][load_data.src];
			return true;
		};
	};
	
	Module.prototype._load_resource = function (load_data) {
		var _this = this;
		Module._loader_list[load_data.type](load_data.src, function (loaded) {
			_this._add_loaded_cache(load_data.type, load_data.src, loaded);
			load_data.loaded = loaded;
			load_data.callback(load_data);
		});
	};
	
	Module.prototype._load = function (load_data) {
		//check cache if not force reload
		if (!load_data.is_force_reload && this._check_loaded_cache(load_data)) {
			load_data.callback(load_data);
		}
		else {
			this._load_resource(load_data);
		}
	};
	
	Module.prototype.load = function (type, src, is_force_reload, callback) {
		if (!Module._loader_list[type]) {
			Dr.assert(false, '[ResourceLoader] Error type', type);
		}
		
		var load_data = {
			callback: callback,	//will get load_data(with load_data.loaded)
			src: src,
			type: type,
			is_force_reload: is_force_reload
		}
		
		this._load(load_data);
	};
	
	Module.prototype.loadList = function (load_data_list, callback) {
		//load_data_list -- without callback(will be re-write)
		//callback -- will get load_data_list(with load_data(with load_data.loaded))
		var remain_data_count = load_data_list.length;
		
		var data_callback = function (load_data) {
			remain_data_count -= 1;
			if (remain_data_count == 0) callback(load_data_list);
		}
		
		for (var index in load_data_list) {
			var load_data = load_data_list[index];
			load_data.callback = data_callback;
			this._load(load_data);
		}
	};
	
	return Module;
});

/*
var resource_loader = Dr.GetNew('ResourceLoader');
resource_loader.load('text', 'http://thatbean.com:888', false, Dr.log);
resource_loader.load('image', 'http://thatbean.com/files/Dr.Image/BeanFont.png', false, Dr.log);
resource_loader.load('script', 'http://thatbean.com/files/Dr.Image/image.js', false, Dr.log);

resource_loader.loadList([
	{type: 'text', src: 'http://thatbean.com:888'},
	{type: 'image', src: 'http://thatbean.com/files/Dr.Image/BeanFont.png'},
	{type: 'script', src: 'http://thatbean.com/files/Dr.Image/image.js'},
], Dr.log);

resource_loader.loadList([
	{type: 'text', src: 'http://thatbean.com:888', is_force_reload: true},
	{type: 'image', src: 'http://thatbean.com/files/Dr.Image/BeanFont.png', is_force_reload: true},
	{type: 'script', src: 'http://thatbean.com/files/Dr.Image/image.js', is_force_reload: true},
], Dr.log);
*/