

//Switch utility
//A switch that save and flip the value
Dr.ModuleManager.declare('Switch', 'class');
Dr.ModuleManager.implement('Switch', function (global, module_get) {
	var Switch = function () {
		
	}
	
	Switch.prototype.Switch = function (key, value) {
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
Dr.ModuleManager.declare('TagLog', 'class');
Dr.ModuleManager.implement('TagLog', function (global, module_get) {
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
Dr.ModuleManager.declare('FPS', 'class');
Dr.ModuleManager.implement('FPS', function (global, module_get) {
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


Dr.ModuleManager.declare('Toolbox', 'function pack');
Dr.ModuleManager.implement('Toolbox', function (global, module_get) {
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

Dr.ModuleManager.loop_load();