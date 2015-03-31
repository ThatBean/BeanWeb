//Switch utility
//A switch that save and flip the value
Dr.Declare('Switch', 'class');
Dr.Implement('Switch', function (global, module_get) {
	var Switch = function () {
		Dr.log('[Switch] init');
	}
	
	Switch.prototype.Switch = function (key, value) {
		Dr.log('[Switch]', key, value);
		
		if (value == undefined)
			this[key] = !this[key];
		else
			this[key] = value;
	}
	return Switch;
});



//Log utility
//Maintain a log of recent 'listMax' number
//the log is updated to 'logTag'
Dr.Declare('TagLog', 'class');
Dr.Implement('TagLog', function (global, module_get) {
	var TagLog = function(output_func) {
		//record putput func, so you don't need to set it next time
		if (output_func) this.output_func = output_func;
		
		this.List = [];		//store history logs
		this.listMax = 10;			//max history to maintain
		this.lastTime = Dr.now();	//init time
		this.logSeperator = '<br />';	//usually '<br />' or '\n'
	}
	
	TagLog.prototype.Log = function (newLog, logTagId) {
		//generate this log
		var now = Dr.now();
		this.List.unshift('[+' + (now - this.lastTime) / 1000 + 'sec]' + newLog);	//add to head of the array
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
	return TagLog;
});



//FPS utility
//display the FPS or step to record
Dr.Declare('FPS', 'class');
Dr.Implement('FPS', function (global, module_get) {
	var FPS = function (output_func) {
		//record putput func, so you don't need to set it next time
		if (output_func) this.output_func = output_func;
		//output_func(averageFPS, currentFPS)
		this.lastTime = Dr.now();
		this.List = [];
		this.listMax = 20;			//max history to maintain
	}
	FPS.prototype.FPS = function (output_func) {
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
	FPS.prototype.step = function () {
		//get step
		var now = Dr.now();
		var step = (now - this.lastTime);
		this.lastTime = now;
		//get stepFPS
		var stepFPS = 1000 / step;
		//save to list
		this.List.unshift(stepFPS);
		if (this.List.length > this.listMax) this.List.length = this.listMax;
		return step;
	}
	return FPS;
});


Dr.Declare('Toolbox', 'function pack');
Dr.Implement('Toolbox', function (global, module_get) {
	var Toolbox = {}
	Toolbox.getPageSize = function () {
		var xScroll,yScroll;
		if (Dr.window.innerHeight && Dr.window.scrollMaxY) {
			xScroll = Dr.document.body.scrollWidth;
			yScroll = Dr.window.innerHeight + Dr.window.scrollMaxY;
		} else if (Dr.document.body.scrollHeight > Dr.document.body.offsetHeight) {
			xScroll = Dr.document.body.scrollWidth;
			yScroll = Dr.document.body.scrollHeight;
		} else {
			xScroll = Dr.document.body.offsetWidth;
			yScroll = Dr.document.body.offsetHeight;
		}
		var windowWidth,windowHeight;
		if (Dr.window.innerHeight) {
			windowWidth = Dr.window.innerWidth;
			windowHeight = Dr.window.innerHeight;
		} else if (Dr.document.documentElement && Dr.document.documentElement.clientHeight) {
			windowWidth = Dr.document.documentElement.clientWidth;
			windowHeight = Dr.document.documentElement.clientHeight;
		} else if (Dr.document.body) {
			windowWidth = Dr.document.body.clientWidth;
			windowHeight = Dr.document.body.clientHeight;
		}
		var pageWidth,pageHeight
		pageHeight = ( (yScroll < windowHeight) ? windowHeight : yScroll );
		pageWidth = ( (xScroll < windowWidth) ? windowWidth : xScroll );
		return {'pageX':pageWidth,'pageY':pageHeight,'winX':windowWidth,'winY':windowHeight};
	}
	Toolbox.setSize = function(element, width, height) {
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
	Toolbox.resizeEventListener = function(func) {
		var evt = 'onorientationchange' in Dr.window ? 'orientationchange' : 'resize';
		Dr.window.addEventListener(evt, func);
	}
	Toolbox.createElement = function (element_data) {
		var new_element= Dr.document.createElement(element_data.type);
		if (element_data.parent) element_data.parent.appendChild(new_element);
		if (element_data.id) new_element.id = element_data.id;
		if (element_data.name) new_element.name = element_data.name;
		return new_element;
	}
	return Toolbox;
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
	var _loader_text = function (src, callback) {
		Dr.createHttpRequest(src, null, function (xml_http, response_text) {
			callback(response_text);
		});
	};
	var _loader_image_text = function (image_src, text_src, callback) {
		_loader_image(image_src, function (image_element) {
			_loader_text(text_src, function (response_text) {
				callback(image_element, response_text);
			});
		});
	};
	
	Module._loader_list = {
		text: _loader_text,
		image: _loader_image,
		script: _loader_script,
		multi: _loader_image_text,
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
			case 'image_multi':
			case 'font_bitmap':
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



Dr.test_func = function () {
	var log_action = function(event) {
		event.preventDefault();
		var action = Dr.getActionFromEvent(event);
		var element = Dr.document.getElementById('frontBuffer');
		
		var position = Dr.getPositonInElementFromAction(action, element);
		//Dr.log(action, element, position);
		Dr.log(action.action_type, position);
	}
	
	Dr.document.addEventListener('mousedown', log_action);
	Dr.document.addEventListener('mousemove', log_action);
	Dr.document.addEventListener('mouseup', log_action);
	Dr.document.addEventListener('mouseout', log_action);
	
}

/*
Dr.Declare('InteractionCallback', 'class');
Dr.Implement('InteractionCallback', function (global, module_get) {
	
	var Module = function () {
		this.loaded_cache = {};
	}
	
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
			case 'image_multi':
			case 'font_bitmap':
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
	
	return Module;
});
*/
























Dr.LoadAll();