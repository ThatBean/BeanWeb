//Bean's Looop JS
	
	Object.prototype.Test=function (tgt) {
		alert("Test for ["+this+"] saying '"+tgt+"' !");
	};
	Array.prototype.FormatHTML=function (col, fix) {
		var res="";
		var total=0;
		var max=0;
		var min=9999;
		var n=0;
		for (i in this) 
			if (this[i].toFixed) {
				min=(min<this[i]?min:this[i]);
				max=(max>this[i]?max:this[i]);
				res+=this[i].toFixed(fix)+" | ";
				if (n%col == col-1) res+="<br/ >";
				total+=this[i];
				n++;
			}
		res+="Total="+total.toFixed(fix)+" Average="+(total/n).toFixed(fix)+" min="+min.toFixed(fix)+" max="+max.toFixed(fix)+" Element="+n;
		return res;
	};
	
(function (window, undefined) {	//Start of B_looop
	
	//data pack//global datapack
	window.B_looop = {
		"Author"	:"Bean",
		"Version"	:"0.01",
		"WebPage"	:"ThatBean.com",
		"Name"		:"Looop",
		
		"Datapack"	:{},
		
		"Add"		:function (name,obj) {this[name]=obj;return this[name];}
		
	};
	
	
	//init//set value
	window.B_looop["init"] = function () {
		window.B_timer.init();
		//
		return;
	}
	
	
	//run//run for main loop
	window.B_looop["run"] = function () {
		var id = window.B_looop["setLooop"](window.B_looop["mainLooop"]);
		window.B_looop.Datapack["mainLooopId"]=id;
		//
		//
		return id;
	}
	//stop//stop for main loop
	window.B_looop["stop"] = function () {
		window.B_looop["clearLooop"](window.B_looop.Datapack["mainLooopId"]);
		//
		//
		return;
	}
	
		
	//main loop
	window.B_looop["mainLooop"] = function () {
		//deal logic
		var FPS = 1 / window.B_timer.getDelta();
		
		if (window.B_looop.Datapack["FPSlist"] == undefined) {
			window.B_looop.Datapack["FPSlist"]=[];
		}
		
		window.B_looop.Datapack["FPSlist"].push(FPS);
		if (window.B_looop.Datapack["FPSlist"].length>30*10) window.B_looop.Datapack["FPSlist"].shift();
		
		
		var B_log = document.getElementById('B_log');
		B_log.innerHTML=window.B_looop.Datapack["FPSlist"].FormatHTML(10, 2);
		//catch mouse
		
		
		
		//update node list
		//update link list
		return;
	}
	
	//Function function code//
	
	//setLooop//clearLooop//
	if (window.requestAnimationFrame) {
		var nextId = 1, activeLooopId = {};
		window.B_looop["setLooop"] = function (callback) {
			var currentId = nextId++;
			activeLooopId[currentId] = true;
			var looopCallback = function () {
				if (!activeLooopId[currentId]) {
					return ;
				}
				window.requestAnimationFrame(looopCallback);
				callback();
			};
			window.requestAnimationFrame(looopCallback);
			return currentId;
		};
		window.B_looop["clearLooop"] = function (id) {
			delete activeLooopId[id];
		};
	}
	else {
		window.B_looop["setLooop"] = function (callback) {
			return window.setInterval(callback, 1000 / 60);
		};
		window.B_looop["clearLooop"] = function (id) {
			window.clearInterval(id);
		};
	}
	
	//Timer//
	window.B_timer = {
		"last": 0,
		"delta": 0,
		"scale": 1.0,
		
		"init": function () {
			this.last = Date.now();
		},
		
		"getDelta": function () {
			var current = Date.now();
			this.delta = (current - this.last) / 1000; //count in second(float)
			this.last = current;
			return (this.delta * this.scale);
		}
	};
	
	
	
	
	
	/*


	
	
	setDelegate: function (object)
  {
if (typeof(object.run) == 'function') {
 this.delegate = object;
this.startRunLoop();

}
else
{
 throw('System.setDelegate: No run() function in object');

}
  }
		
		
		
	startRunLoop: function ()
  {
this.stopRunLoop();
this.animationId = ig.setAnimation
 (this.run.bind(this), this.canvas);
this.running = true;

  }
	




	
	
run: function () {
	ig.Timer.step();
	this.tick = this.clock.tick();
	this.delegate.run();
	ig.input.clearPressed();
	if (this.newGameClass) {
		this.setGameNow(this.newGameClass);
		this.newGameClass = null;
	}
}
	
		*/
	
} (window))	//End of B_looop
	
/** /
ig.baked = true;
ig.module('impact.timer').defines(function () {
 "use strict";
ig.Timer = ig.Class.extend(
 {
  target: 0, base: 0, last: 0, pausedAt: 0, init: function (seconds)
  {
this.base = ig.Timer.time;
this.last = ig.Timer.time;
this.target =
 seconds || 0;

  }
  , set: function (seconds)
  {
this.target = seconds || 0;
this.base = ig.Timer.time;
 this.pausedAt = 0;

  }
  , reset: function ()
  {
this.base = ig.Timer.time;
this.pausedAt = 0;

  }
  , tick: function ()
  {
var delta = ig.Timer.time - this.last;
this.last = ig.Timer.time;
 return (this.pausedAt ? 0 : delta);

  }
  , delta: function ()
  {
return (this.pausedAt || ig.Timer.time) - this.base - this.target;

  }
  , pause: function ()
  {
if (!this.pausedAt) {
 this.pausedAt = ig.Timer.time;

}
  }
  , unpause: function ()
  {
if (this.pausedAt) {
 this.base += ig.Timer.time - this.pausedAt;
this.pausedAt = 0;

}
  }
 }
 );
ig.Timer._last = 0;
ig.Timer.time = Number.MIN_VALUE;
ig.Timer.timeScale
  = 1;
ig.Timer.maxStep = 0.05;
ig.Timer.step = function ()
 {
  var current = Date.now();
var delta = (current - ig.Timer._last) /
1000;
ig.Timer.time += Math.min(delta, ig.Timer.maxStep) *
ig.Timer.timeScale;
ig.Timer._last = current;

 };

}








  , module: function (name)
  {
if (ig._current) {
 throw("Module '" + ig._current.name + "' defines nothing");

}
if (ig.modules[name] && ig.modules[name].body) {
 throw("Module '" + name + "' is already defined");

}
ig._current = 
{
 name: name, requires: [], loaded: false, body: null
};
ig.modules[name] = ig._current;
ig._loadQueue.push(ig._current);
 return ig;

  }
  , requires: function ()
  {
ig._current.requires = Array.prototype.slice.call(arguments);
 return ig;

  }
  , defines: function (body)
  {
ig._current.body = body;
ig._current = null;
ig._initDOMReady();

  }
	
	
	
	
	
	
	
*/
	
	
	
	
	//##########################################################################
	function B_func_(inputVal) {
		return inputVal;
	}
	//##########################################################################