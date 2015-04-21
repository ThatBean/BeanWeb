//Switch utility
//A switch that save and flip the value
Dr.Declare('Switch', 'class');
Dr.Implement('Switch', function (global, module_get) {
	var Module = function () {
		Dr.log('[Switch] init');
	}
	
	Module.prototype.Switch = function (key, value) {
		if (value == undefined)
			this[key] = !this[key];
		else
			this[key] = value;
		
		Dr.log('[Switch]', key, value, this[key]);
	}
	return Module;
});




//Log utility
//Maintain a log of recent 'listMax' number
//the log is updated to 'logTag'
Dr.Declare('TagLog', 'class');
Dr.Implement('TagLog', function (global, module_get) {
	var Module = function(output_func) {
		//record putput func, so you don't need to set it next time
		if (output_func) this.output_func = output_func;
		
		this.List = [];		//store history logs
		this.listMax = 10;			//max history to maintain
		this.lastTime = Dr.now();	//init time
		this.logSeperator = '<br />';	//usually '<br />' or '\n'
	}
	
	Module.prototype.Log = function (newLog, logTagId) {
		//generate this log
		var now = Dr.now();
		this.List.unshift('[+' + (now - this.lastTime).toFixed(4) + 'sec]' + newLog);	//add to head of the array
		this.lastTime = now;
		//remove excessive log
		if (this.List.length > this.listMax) this.List.length = this.listMax;
		//record tag, so you don't need to set it next time
		if (logTagId) this.logTag = Dr.document.getElementById(logTagId);
		//update tag object html
		if (this.output_func) {
			var log_text = this.List.join(this.logSeperator);
			this.output_func(log_text);
		}
	}
	return Module;
});



//FPS utility
//display the FPS or step to record
Dr.Declare('FPS', 'class');
Dr.Implement('FPS', function (global, module_get) {
	var Module = function (output_func) {
		//record putput func, so you don't need to set it next time
		if (output_func) this.output_func = output_func;
		//output_func(averageFPS, currentFPS)
		this.lastTime = Dr.now();
		this.List = [];
		this.listMax = 20;			//max history to maintain
	}
	Module.prototype.FPS = function (output_func) {
		var step = this.step();
		//record tag, so you don't need to set it next time
		if (output_func) this.output_func = output_func;
		//get average
		var totalValues = 0;
		for (var i = 0; i < this.List.length; i++) totalValues += this.List[i];
		var averageFPS = totalValues / this.List.length;
		//display
		if (this.output_func) this.output_func(averageFPS, this.List[0]);
		return step;
	}
	Module.prototype.step = function () {
		//get step
		var now = Dr.now();
		var step = (now - this.lastTime);
		this.lastTime = now;
		//get stepFPS
		var stepFPS = 1 / step;
		//save to list
		this.List.unshift(stepFPS);
		if (this.List.length > this.listMax) this.List.length = this.listMax;
		return step;
	}
	return Module;
});


Dr.Declare('Toolbox', 'function_pack');
Dr.Implement('Toolbox', function (global, module_get) {
	var Module = {};
	
	Module.setSize = function(element, width, height) {
		if (!element) {
			alert('[Toolbox.setSize] get null, ' + element);
			return;
		}
		Dr.log(element)
		element.width = width;
		element.style.width = width + 'px';
		element.style.minWidth = width + 'px';
		element.style.maxWidth = width + 'px';
		element.height = height;
		element.style.height = height + 'px';
		element.style.minHeight = height + 'px';
		element.style.maxHeight = height + 'px';
	}
	Module.createElement = function (element_data) {
		var new_element= Dr.document.createElement(element_data.type);
		if (element_data.parent) element_data.parent.appendChild(new_element);
		if (element_data.id) new_element.id = element_data.id;
		if (element_data.name) new_element.name = element_data.name;
		return new_element;
	}
	return Module;
});




//resource_loader

//var res = ""; for (var i = 0; i < 97; i++) { res += '[' + i * 6 + ', 0, 6, 13],\n'; }
var image_load_data = {
	src: 'Pic.png',
	type: 'image',
	callback: function (image_load_data) {},
};

var image_multi_load_data = {
	image_src: 'Pic.png',
	text_src: 'Pic.png',
	type: 'multi',
	callback: function (image_multi_load_data) {},
};

var font_load_data = {
	image_src: 'Font.png',
	text_src: 'Font.font',
	type: 'multi',
	callback: function (font_load_data) {},
};

var script_load_data = {
	src: 'dr.js',
	type: 'script',
	callback: function (script_load_data) {},
};


var text_load_data = {
	src: 'dr.txt',
	type: 'text',
	callback: function (text_load_data) {},
};




//Dr.Get("ResourceLoader").getLoaderList().text('math.js', function (a) {Dr.debug_a = a; Dr.log(a);})
//Dr.Get("ResourceLoader").getLoaderList().multi('BeanFont.png', 'math.js', function (a, b) {Dr.debug_a = a; Dr.debug_b = b; Dr.log(a, b);})

Dr.Declare('ResourceLoader', 'single_instance');
Dr.Implement('ResourceLoader', function (global, module_get) {
	
	var Module = function () {
		this.loaded_cache = {};
	}
	
	var _loader_image = Dr.loadImage;
	var _loader_script =Dr.loadScript;
	var _loader_text = Dr.loadText;
	
	Module._loader_list = {
		'text': _loader_text,
		'image': _loader_image,
		'script': _loader_script,
	};
	
	Module.prototype.getLoaderList = function () {
		return Module._loader_list;
	};
	
	Module.prototype._add_loaded_cache = function (type, src, loaded) {
		this.loaded_cache[type] = this.loaded_cache[type] || {};
		this.loaded_cache[type][src] = loaded;
	};
	
	Module.prototype._check_loaded_cache = function (load_data) {
		if (load_data.is_multi == false) {
			if (
				this.loaded_cache[load_data.type] 
				&& this.loaded_cache[load_data.type][load_data.src]
			) {
				load_data.loaded = this.loaded_cache[load_data.type][load_data.src];
				return true;
			};
		}	
		else {
			if (
				this.loaded_cache[load_data.image] 
				&& this.loaded_cache[load_data.text] 
				&& this.loaded_cache[load_data.image][load_data.image_src]
				&& this.loaded_cache[load_data.text][load_data.text_src]
			) {
				load_data.loaded_image = this.loaded_cache[load_data.type][load_data.image_src];
				load_data.loaded_text = this.loaded_cache[load_data.type][load_data.text_src];
				return true;
			};
		};
	};
	
	Module.prototype._check_data = function (load_data) {
		switch (load_data.type) {
			case 'text':
			case 'image':
			case 'script':
				load_data.is_multi = false;
				break;
			case 'multi':
				load_data.is_multi = true;
				break;
			default:
				Dr.log('[loadResource] Error type', load_data.type);
				return;
				break;
		};
		return load_data;
	};
	
	Module.prototype._load_resource = function (load_data) {
		if (load_data.is_multi == false) {
			Module._loader_list[load_data.type](load_data.src, function (loaded) {
				this._add_loaded_cache(load_data.type, load_data.src, loaded);
				load_data.loaded = loaded;
				load_data.callback(load_data);
			});
		}
		else {
			Module._loader_list['multi'](load_data.src, function (loaded_image, loaded_text) {
				this._add_loaded_cache('image', load_data.image_src, loaded_image);
				this._add_loaded_cache('text', load_data.text_src, loaded_text);
				load_data.loaded_image = loaded_image;
				load_data.loaded_text = loaded_text;
				load_data.callback(load_data);
			});
		};
	};
	
	Module.prototype.load = function (load_data, is_force_reload) {
		var load_data = this._check_data(load_data);
		
		if (!load_data) {
			return;
		};
		
		//check cache if not force reload
		if (!is_force_reload && this._check_loaded_cache(load_data)) {
			load_data.callback(load_data);
			return load_data;
		};
		
		this._load_resource(load_data);
		return load_data;
	};
	
	return new Module;
});




var sample_box_data = {
	x: 0,
	y: 0,
	width: 0,
	height: 0,
	z: 0,
	//callback: function (box_data) {};	//you can add
	box_tag: 'tag',
}


Dr.Declare('ActionBox', 'class');
Dr.Implement('ActionBox', function (global, module_get) {
	
	var Module = function () {
		this.box_list = [];
	}
	
	Module.prototype.addBox = function (box_tag, box_data) {
		var box_tag = box_tag || this.box_list.length;
		this.box_list.box_tag = this.box_list.box_tag || box_tag;
		this.box_list[box_tag] = box_data;
	};
	
	Module.prototype.removeBox = function (box_tag) {
		this.box_list[box_tag] = null;
	};
	
	Module.prototype.removeAllBox = function () {
		this.box_list = [];
	};
	
	Module.prototype.testPoint = function (position) {
		var res_box_list;
		var max_z = Number.NEGATIVE_INFINITY;
		for (var box_tag in this.box_list) {
			var box_data = this.box_list[box_tag];
			if (
				position.x >= box_data.x
				&& position.y >= box_data.y
				&& position.x <= box_data.width
				&& position.y <= box_data.height
			) {
				if (max_z < box_data.z) {
					res_box_list = [];	//clear previous
					max_z = box_data.z; 
				}
				res_box_list.push(box_data);
			}
		}
		return res_box_list;
	};
	
	return Module;
});



Dr.test_func_list = {
	ActionElement: function () {
		var log_action = function(event) {
			event.preventDefault();
			var action = Dr.getActionFromEvent(event);
			var element = Dr.document.getElementById('Dr.Canvas');
			
			var position = Dr.getPositonInElementFromAction(action, element);
			//Dr.log(action, element, position);
			Dr.log(action.action_type, position);
		}
		
		Dr.document.addEventListener('mousedown', log_action);
		Dr.document.addEventListener('mousemove', log_action);
		Dr.document.addEventListener('mouseup', log_action);
		Dr.document.addEventListener('mouseout', log_action);
	},
	
	ActionBox: function () {
		var box_data_a= {
			x: 0,
			y: 0,
			width: 10,
			height: 10,
			z: 0,
			//callback: function (box_data) {};	//you can add
			box_tag: 'tag_a',
		}
		var box_data_b = {
			x: 10,
			y: 10,
			width: 10,
			height: 10,
			z: 0,
			//callback: function (box_data) {};	//you can add
			box_tag: 'tag_b',
		}
		var box_data_c = {
			x: 10,
			y: 10,
			width: 10,
			height: 10,
			z: 10,
			//callback: function (box_data) {};	//you can add
			box_tag: 'tag_c',
		}
		
		var ActionBox = Dr.Get('ActionBox');
		var action_box = new ActionBox;
		
		action_box.addBox('tag_a', box_data_a);
		Dr.log('nothing at (-1, 5)', action_box.testPoint({x: -1, y: 5}));
		Dr.log('tag_a at (5, 5)', action_box.testPoint({x: 5, y: 5}));
		Dr.log('tag_a at (10, 10)', action_box.testPoint({x: 10, y: 10}));
		action_box.addBox('tag_b', box_data_b);
		Dr.log('nothing at (-1, 5)', action_box.testPoint({x: -1, y: 5}));
		Dr.log('tag_a at (5, 5)', action_box.testPoint({x: 5, y: 5}));
		Dr.log('tag_a, tag_b at (10, 10)', action_box.testPoint({x: 10, y: 10}));
		action_box.addBox('tag_c', box_data_c);
		Dr.log('nothing at (-1, 5)', action_box.testPoint({x: -1, y: 5}));
		Dr.log('tag_a at (5, 5)', action_box.testPoint({x: 5, y: 5}));
		Dr.log('tag_a, tag_b, tag_c at (10, 10), but tag_c has max z', action_box.testPoint({x: 10, y: 10}));
	},
	
	loopRollDice: function () {
		var res = [];
		var loop_time = 1000000;
		
		Dr.log('[loopRollDice]', 'loop_time', loop_time);
		
		Dr.loop(loop_time, function() {
			var index = Dr.rollDice();
			res[index] = (res[index] || 0) + 1;
		});
		
		Dr.log('[loopRollDice]', 'res', res);
		
		var min = [-1, loop_time];
		var max = [-1, 0];
		
		for (var index in res) {
			var count = res[index];
			if (count < min[1]) min = [index, count, count / loop_time];
			if (count > max[1]) max = [index, count, count / loop_time];
		}
		Dr.log('[loopRollDice]', 'min', min, 'max', max);
		},
}
















Dr.LoadAll();

var Switch = Dr.Get("Switch");
Dr.Switch = new Switch;
//Dr.Switch.Switch("Test");