//Switch utility
//A switch that save and flip the value
var Switch = function (value) {
	Switch[value] = !Switch[value];
}


//Log utility
//Maintain a log of recent 'listMax' number
//the log is updated to 'logTag'
var Log = function (newLog, logTagId) {
	//generate this log
	var now = Date.now();
	Log.List.unshift('[+' + (now - Log.lastTime) / 1000 + 's]' + newLog);	//add to head of the array
	Log.lastTime = now;
	//remove excessive log
	if (Log.List.length > Log.listMax) Log.List.length = Log.listMax;
	//record tag, so you don't need to set it next time
	if (logTagId) Log.logTag = document.getElementById(logTagId);
	//update tag object html
	if (Log.logTag) {
		var HTMLtext = Log.List.join(Log.logSeperator);
		Log.logTag.innerHTML = HTMLtext;
	}
}
Log.List = [];		//store history logs
Log.listMax = 10;			//max history to maintain
Log.lastTime = Date.now();	//init time
Log.logTag = undefined;	//define when use
Log.logSeperator = '<br />';	//usually '<br />' or '\n'


//FPS utility
//display the FPS or step to record
var FPS = function (tagCurrentId, tagAverageId) {
	var step = FPS.step();
	//record tag, so you don't need to set it next time
	if (tagCurrentId) FPS.tagCurrent = document.getElementById(tagCurrentId);
	if (tagAverageId) FPS.tagAverage = document.getElementById(tagAverageId);
	//get average
	var totalValues = 0;
	for (var i = 0; i < FPS.List.length; i++) totalValues += FPS.List[i];
	var averageFPS = totalValues / FPS.List.length;
	//display
	FPS.tagCurrent.innerHTML = FPS.List[0].toFixed(2);
	FPS.tagAverage.innerHTML = averageFPS.toFixed(2);
	return step;
}
FPS.step = function () {
	//get step
	var now = Date.now();
	var step = (now - FPS.lastTime);
	FPS.lastTime = now;
	//get stepFPS
	var stepFPS = 1000 / step;
	//save to list
	FPS.List.unshift(stepFPS);
	if (FPS.List.length > FPS.listMax) FPS.List.length = FPS.listMax;
	return step;
}
FPS.tagCurrent;
FPS.tagAverage;
FPS.lastTime = Date.now();
FPS.List = [];
FPS.listMax = 20;			//max history to maintain


// shim layer with setTimeout fallback
window.requestAnimationFrame = (function () {
	return window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	function (callback) {
		window.setTimeout(callback, 1000 / 20);
	};
})();


var B_Toolbox = B_Toolbox || {}

B_Toolbox.getPageSize = function () {
	var xScroll,yScroll;
	if (window.innerHeight && window.scrollMaxY) {
		xScroll = document.body.scrollWidth;
		yScroll = window.innerHeight + window.scrollMaxY;
	} else if (document.body.scrollHeight > document.body.offsetHeight) {
		xScroll = document.body.scrollWidth;
		yScroll = document.body.scrollHeight;
	} else {
		xScroll = document.body.offsetWidth;
		yScroll = document.body.offsetHeight;
	}
	var windowWidth,windowHeight;
	if (window.innerHeight) {
		windowWidth = window.innerWidth;
		windowHeight = window.innerHeight;
	} else if (document.documentElement && document.documentElement.clientHeight) {
		windowWidth = document.documentElement.clientWidth;
		windowHeight = document.documentElement.clientHeight;
	} else if (document.body) {
		windowWidth = document.body.clientWidth;
		windowHeight = document.body.clientHeight;
	}
	var pageWidth,pageHeight
	pageHeight = ( (yScroll < windowHeight) ? windowHeight : yScroll );
	pageWidth = ( (xScroll < windowWidth) ? windowWidth : xScroll );
	return {'pageX':pageWidth,'pageY':pageHeight,'winX':windowWidth,'winY':windowHeight};
}

B_Toolbox.setSize = function(element, width, height) {
	if (!element) {
		alert('[B_Toolbox.setSize] get null, ' + element);
		return;
	}
	console.log(element)
	element.width = width;
	element.style.width = width + 'px';
	element.style.minWidth = width + 'px';
	element.style.maxWidth = width + 'px';
	element.height = height;
	element.style.height = height + 'px';
	element.style.minHeight = height + 'px';
	element.style.maxHeight = height + 'px';
}

B_Toolbox.resizeEventListener = function(func) {
	var evt = 'onorientationchange' in window ? 'orientationchange' : 'resize';
	window.addEventListener(evt, func);
}

B_Toolbox.createElement = function (element_parent,element_type,element_id) {
	var new_element= document.createElement(element_type);
	new_element.id = element_id;
	element_parent.appendChild(new_element);
	return new_element;
}


/* Notes
it is said that the for ... in loop is much slower than just for 
and if we pick the length out of the condition check, it's faster
@: http://www.smashingmagazine.com/2012/11/05/writing-fast-memory-efficient-javascript/
*/