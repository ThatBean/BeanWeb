// shim layer with setTimeout fallback
window.requestAnimationFrame = (function () {
	return window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	function (callback) {
		window.setTimeout(callback, 1000 / 20);
	};
})();

//A switch that save and flip the value
var Switch = function (value) {
	Switch[value] = !Switch[value];
	return false;
}

var LastTime = Date.now();

//maintain a log of recent 20
var Log = function (newLog) {
	var Now = Date.now();
	Log.List.push("[+" + (Now - LastTime) / 1000 + "s]" + newLog);
	LastTime = Now;
	if (Log.List.length > 20) {
		Log.List.shift();
	}
	
	if (!Switch.Log) {
		var HTMLtext = "";
		for (var i=0;i<Log.List.length;i++) {
			HTMLtext = Log.List[i] +"<br />-----<br />"+ HTMLtext;
		}
		document.getElementById("Log").innerHTML = HTMLtext;
	}
}
Log.List = new Array();


var divCurrentFPS;
var divAverageFPS;
var previousDate = Date.now();
var lastFPSValues = new Array(60);

var PI = 3.141592653582746;

var canvas;
var canvas1;
var canvas2;
var canvas3;

var device;
var device1;
var device2;
var device3;

var data;
var mera;

var animation;

//Important:
//should always keep a 4 based size

var workingPixelWidth = 200;
var screenPixelWidth = 200
var screenPixelScale = 8;	//(how many pixel for one block in working pixel)
var ratio = workingPixelWidth / screenPixelWidth;	//draw pixel size / screen pixel size
var zoom = screenPixelScale / workingPixelWidth;
//when zoom == 0.05, the projected size is 20 x 20 (half blocks on the edge)
//when zoom == 0.005, the projected size is 200 x 200
var zoomTrigger=0.0005;


document.addEventListener("DOMContentLoaded", init, false);

function init() {
    divCurrentFPS = document.getElementById("currentFPS");
    divAverageFPS = document.getElementById("averageFPS");
    canvas = document.getElementById("frontBuffer");
    canvas1 = document.getElementById("frontBuffer1");
    canvas2 = document.getElementById("frontBuffer2");
    canvas3 = document.getElementById("frontBuffer3");
    device = new BlockEngine.Device(canvas, ratio);
    device1 = new BlockEngine.Device(canvas1, ratio);
    device2 = new BlockEngine.Device(canvas2, ratio);
    device3 = new BlockEngine.Device(canvas3, ratio);
	
	

	//Camera position: to Z+(blocks behind will not be shown)
	
    mera = new BlockEngine.Camera();
    mera.Position = new BlockMath.Vector3(0, 0, -100);
    mera.Target = new BlockMath.Vector3(0, 0, 0);
	
    mera1 = new BlockEngine.Camera();
    mera1.Position = new BlockMath.Vector3(100, 0, 0);
    mera1.Target = new BlockMath.Vector3(0, 0, 0);
    
	mera2 = new BlockEngine.Camera();
    mera2.Position = new BlockMath.Vector3(0, -100, 0);
    mera2.Target = new BlockMath.Vector3(0, 0, 0);
    
	mera3 = new BlockEngine.Camera();
    mera3.Position = new BlockMath.Vector3(100, 100, -100);
    mera3.Target = new BlockMath.Vector3(0, 0, 0);

	// TODO: load func
	// TODO: 
	
    //device.LoadJSONFileAsync("monkey.BlockMath", loadJSONCompleted);
	
	
	data = new BlockData.Data();
	var meshes = data.meshes;
	var lightsGlobal = data.lightsGlobal;
	var lightsDot = data.lightsDot;
	
	/** /
	
	var rTime = 1000;
	var rX = 100;
	var rY = rX;
	var rZ = rX;
	
	var rand = function (range) {return ((Math.random()-0.5)*range) >> 0;}
	
	var mesh= new BlockData.BlockMesh("Cube", rTime);
	for (var i = 0; i < rTime; i++) {
		mesh.Blocks[i] = new BlockData.Block(
			new BlockMath.Vector3(rand(rX), rand(rY), rand(rZ)),
			new BlockMath.Color4.Random(1)
		)
	}
	mesh.removeInvisible();	//mark invisible faces
	meshes.push(mesh);
	/**/
	
	/** /
	mesh= new BlockData.BlockMesh("Cube", 12); 
	for (var i = 0; i < 3; i++) {
		for (var j = 1; j <= 4; j++) {
			mesh.Blocks[i*4+j-1] = new Block(
				new BlockMath.Vector3(j*(i==0?1:0), j*(i==1?1:0), j*(i==2?1:0)),
				new BlockMath.Color4(1*(i==0?1:0), 1*(i==1?1:0), 1*(i==2?1:0), 1)
			);
			if (j!=3) mesh.Blocks[i*4+j-1].Color = new BlockMath.Color4(1, 1, 1, 1);
		}
	}
	meshes.push(mesh);
	/**/
	
	/**/
	
	//The bean logo
	//0:nothing |8:#111111(0, 0, 0) |1:#FFAE63(255, 174, 99)
	
	var BEAN_LOGO = [    // |Center total 18
	0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 
	0, 0, 0, 0, 8, 0, 0, 8, 8, 0, 0, 8, 0, 0, 8, 0, 0, 0, 
	0, 0, 0, 0, 0, 8, 8, 8, 8, 8, 8, 8, 0, 8, 0, 0, 0, 0, 
	0, 8, 0, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 0, 0, 0, 
	0, 0, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 0, 8, //4
	0, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 0, 0, 
	8, 8, 8, 8, 8, 8, 8, 1, 1, 8, 1, 1, 8, 8, 8, 8, 8, 0, 
	0, 8, 8, 8, 8, 1, 1, 1, 1, 1, 1, 1, 1, 8, 8, 8, 8, 0, 
	8, 8, 8, 1, 8, 8, 1, 1, 1, 1, 1, 1, 1, 1, 8, 8, 0, 0, 
	0, 8, 8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 8, 8, 8, 0, //9
	0, 8, 8, 1, 8, 8, 8, 1, 1, 1, 8, 8, 8, 1, 8, 8, 0, 0, //Brow
	8, 1, 8, 1, 1, 1, 1, 1, 8, 1, 1, 1, 1, 1, 8, 8, 8, 0, 
	8, 1, 8, 1, 1, 8, 1, 1, 8, 1, 1, 8, 1, 1, 8, 1, 8, 0, //Eye
	8, 1, 8, 1, 1, 1, 1, 8, 1, 1, 1, 1, 1, 1, 8, 1, 8, 0, 
	0, 8, 8, 1, 1, 1, 8, 8, 1, 1, 1, 1, 1, 1, 8, 8, 0, 0, //14
	0, 0, 8, 1, 1, 1, 1, 8, 8, 1, 1, 1, 1, 1, 8, 0, 0, 0, 
	0, 0, 8, 1, 1, 8, 1, 1, 1, 1, 1, 8, 1, 1, 8, 0, 0, 0, 
	0, 0, 0, 8, 1, 1, 8, 8, 8, 8, 8, 1, 1, 8, 0, 0, 0, 0, //mouse
	0, 0, 0, 8, 8, 1, 1, 1, 1, 1, 1, 1, 8, 8, 0, 0, 0, 0, 
	0, 0, 0, 0, 8, 8, 1, 1, 1, 1, 1, 8, 8, 0, 0, 0, 0, 0, //19
	0, 0, 0, 0, 0, 0, 8, 8, 8, 8, 8, 0, 0, 0, 0, 0, 0, 0, 
	
	0]
	
	var mesh= new BlockData.BlockMesh("Bean Logo", 0); 
	var tempBlock;
	for (var i = 0; i < BEAN_LOGO.length; i++) {
		if (BEAN_LOGO[i] != 0) {
			tempBlock = new BlockData.Block(
				new BlockMath.Vector3(i%18-8, -Math.floor(i/18)+10, 0),
				(BEAN_LOGO[i]==8 ? new BlockMath.Color4(0, 0, 0, 1) : new BlockMath.Color4(255/255, 174/255, 99/255, 1))
			)
			mesh.Blocks.push(tempBlock);
			/** /
			if (BEAN_LOGO[i] == 8) {
				tempBlock = new Block(
					new BlockMath.Vector3(i%18-8, -Math.floor(i/18)+10, -1),
					(BEAN_LOGO[i]==8 ? new BlockMath.Color4(0, 0, 0, 1) : new BlockMath.Color4(255/255, 174/255, 99/255, 1))
				)
				mesh.Blocks.push(tempBlock);
				tempBlock = new Block(
					new BlockMath.Vector3(i%18-8, -Math.floor(i/18)+10, 1),
					(BEAN_LOGO[i]==8 ? new BlockMath.Color4(0, 0, 0, 1) : new BlockMath.Color4(255/255, 174/255, 99/255, 1))
				)
				mesh.Blocks.push(tempBlock);
			}
			/**/
		}
	}
	mesh.removeInvisible();	//mark invisible faces
	meshes.push(mesh);
	
	/**/
	
	
	/**/
	//The Light block(indicates where the Global light from)
	var cube_dis = 15;
	
	mesh= new BlockData.BlockMesh("CubeLeftBlue", 1);
	mesh.Blocks[0] = new BlockData.Block(
		new BlockMath.Vector3(-cube_dis, 0, 0),
		new BlockMath.Color4(0, 0, 1, 1)
	);
	meshes.push(mesh);
	
	mesh= new BlockData.BlockMesh("CubeRightRed", 1);
	mesh.Blocks[0] = new BlockData.Block(
		new BlockMath.Vector3(cube_dis, 0, 0),
		new BlockMath.Color4(1, 0, 0, 1)
	);
	meshes.push(mesh);
	
	mesh= new BlockData.BlockMesh("CubeUpGreen", 1);
	mesh.Blocks[0] = new BlockData.Block(
		new BlockMath.Vector3(0, cube_dis, 0),
		new BlockMath.Color4(0, 1, 0, 1)
	);
	meshes.push(mesh);
	
	
	/**/
	
	
	lightsGlobal.push(new BlockData.Light(
		new BlockMath.Vector3(1, 0, 0),
		new BlockMath.Color4(0, 0, 1, 1),
		"Blue"
	));
	lightsGlobal.push(new BlockData.Light(
		new BlockMath.Vector3(-1, 0, 0),
		new BlockMath.Color4(1, 0, 0, 1),
		"Red"
	));
	lightsGlobal.push(new BlockData.Light(
		new BlockMath.Vector3(0, -1, 0),
		new BlockMath.Color4(0, 1, 0, 1),
		"Green"
	));
	
	
	lightsDot.push(new BlockData.Light(
		new BlockMath.Vector3(0, 0, 0),
		new BlockMath.Color4(1, 0, 1, 1),
		"RedD"
	));
	
	
	
	/** /
	//save to JSON
	var jsonObj = data.saveToJSON();
	var jsonString = JSON.stringify(jsonObj);
	/**/
	/** /
	data.empty();
	var jsonString = '{"meshes":[{"colorList":[[0,0,0,1],[1,0.6823529411764706,0.38823529411764707,1]],"points":[[[1,10,0],0],[[-4,9,0],0],[[-1,9,0],0],[[0,9,0],0],[[3,9,0],0],[[6,9,0],0],[[-3,8,0],0],[[-2,8,0],0],[[-1,8,0],0],[[0,8,0],0],[[1,8,0],0],[[2,8,0],0],[[3,8,0],0],[[5,8,0],0],[[-7,7,0],0],[[-5,7,0],0],[[-4,7,0],0],[[-3,7,0],0],[[-2,7,0],0],[[-1,7,0],0],[[0,7,0],0],[[1,7,0],0],[[2,7,0],0],[[3,7,0],0],[[4,7,0],0],[[5,7,0],0],[[6,7,0],0],[[-6,6,0],0],[[-5,6,0],0],[[-4,6,0],0],[[-3,6,0],0],[[-2,6,0],0],[[-1,6,0],0],[[0,6,0],0],[[1,6,0],0],[[2,6,0],0],[[3,6,0],0],[[4,6,0],0],[[5,6,0],0],[[6,6,0],0],[[7,6,0],0],[[9,6,0],0],[[-7,5,0],0],[[-6,5,0],0],[[-5,5,0],0],[[-4,5,0],0],[[-3,5,0],0],[[-2,5,0],0],[[-1,5,0],0],[[0,5,0],0],[[1,5,0],0],[[2,5,0],0],[[3,5,0],0],[[4,5,0],0],[[5,5,0],0],[[6,5,0],0],[[7,5,0],0],[[-8,4,0],0],[[-7,4,0],0],[[-6,4,0],0],[[-5,4,0],0],[[-4,4,0],0],[[-3,4,0],0],[[-2,4,0],0],[[-1,4,0],1],[[0,4,0],1],[[1,4,0],0],[[2,4,0],1],[[3,4,0],1],[[4,4,0],0],[[5,4,0],0],[[6,4,0],0],[[7,4,0],0],[[8,4,0],0],[[-7,3,0],0],[[-6,3,0],0],[[-5,3,0],0],[[-4,3,0],0],[[-3,3,0],1],[[-2,3,0],1],[[-1,3,0],1],[[0,3,0],1],[[1,3,0],1],[[2,3,0],1],[[3,3,0],1],[[4,3,0],1],[[5,3,0],0],[[6,3,0],0],[[7,3,0],0],[[8,3,0],0],[[-8,2,0],0],[[-7,2,0],0],[[-6,2,0],0],[[-5,2,0],1],[[-4,2,0],0],[[-3,2,0],0],[[-2,2,0],1],[[-1,2,0],1],[[0,2,0],1],[[1,2,0],1],[[2,2,0],1],[[3,2,0],1],[[4,2,0],1],[[5,2,0],1],[[6,2,0],0],[[7,2,0],0],[[-7,1,0],0],[[-6,1,0],0],[[-5,1,0],1],[[-4,1,0],1],[[-3,1,0],1],[[-2,1,0],1],[[-1,1,0],1],[[0,1,0],1],[[1,1,0],1],[[2,1,0],1],[[3,1,0],1],[[4,1,0],1],[[5,1,0],1],[[6,1,0],0],[[7,1,0],0],[[8,1,0],0],[[-7,0,0],0],[[-6,0,0],0],[[-5,0,0],1],[[-4,0,0],0],[[-3,0,0],0],[[-2,0,0],0],[[-1,0,0],1],[[0,0,0],1],[[1,0,0],1],[[2,0,0],0],[[3,0,0],0],[[4,0,0],0],[[5,0,0],1],[[6,0,0],0],[[7,0,0],0],[[-8,-1,0],0],[[-7,-1,0],1],[[-6,-1,0],0],[[-5,-1,0],1],[[-4,-1,0],1],[[-3,-1,0],1],[[-2,-1,0],1],[[-1,-1,0],1],[[0,-1,0],0],[[1,-1,0],1],[[2,-1,0],1],[[3,-1,0],1],[[4,-1,0],1],[[5,-1,0],1],[[6,-1,0],0],[[7,-1,0],0],[[8,-1,0],0],[[-8,-2,0],0],[[-7,-2,0],1],[[-6,-2,0],0],[[-5,-2,0],1],[[-4,-2,0],1],[[-3,-2,0],0],[[-2,-2,0],1],[[-1,-2,0],1],[[0,-2,0],0],[[1,-2,0],1],[[2,-2,0],1],[[3,-2,0],0],[[4,-2,0],1],[[5,-2,0],1],[[6,-2,0],0],[[7,-2,0],1],[[8,-2,0],0],[[-8,-3,0],0],[[-7,-3,0],1],[[-6,-3,0],0],[[-5,-3,0],1],[[-4,-3,0],1],[[-3,-3,0],1],[[-2,-3,0],1],[[-1,-3,0],0],[[0,-3,0],1],[[1,-3,0],1],[[2,-3,0],1],[[3,-3,0],1],[[4,-3,0],1],[[5,-3,0],1],[[6,-3,0],0],[[7,-3,0],1],[[8,-3,0],0],[[-7,-4,0],0],[[-6,-4,0],0],[[-5,-4,0],1],[[-4,-4,0],1],[[-3,-4,0],1],[[-2,-4,0],0],[[-1,-4,0],0],[[0,-4,0],1],[[1,-4,0],1],[[2,-4,0],1],[[3,-4,0],1],[[4,-4,0],1],[[5,-4,0],1],[[6,-4,0],0],[[7,-4,0],0],[[-6,-5,0],0],[[-5,-5,0],1],[[-4,-5,0],1],[[-3,-5,0],1],[[-2,-5,0],1],[[-1,-5,0],0],[[0,-5,0],0],[[1,-5,0],1],[[2,-5,0],1],[[3,-5,0],1],[[4,-5,0],1],[[5,-5,0],1],[[6,-5,0],0],[[-6,-6,0],0],[[-5,-6,0],1],[[-4,-6,0],1],[[-3,-6,0],0],[[-2,-6,0],1],[[-1,-6,0],1],[[0,-6,0],1],[[1,-6,0],1],[[2,-6,0],1],[[3,-6,0],0],[[4,-6,0],1],[[5,-6,0],1],[[6,-6,0],0],[[-5,-7,0],0],[[-4,-7,0],1],[[-3,-7,0],1],[[-2,-7,0],0],[[-1,-7,0],0],[[0,-7,0],0],[[1,-7,0],0],[[2,-7,0],0],[[3,-7,0],1],[[4,-7,0],1],[[5,-7,0],0],[[-5,-8,0],0],[[-4,-8,0],0],[[-3,-8,0],1],[[-2,-8,0],1],[[-1,-8,0],1],[[0,-8,0],1],[[1,-8,0],1],[[2,-8,0],1],[[3,-8,0],1],[[4,-8,0],0],[[5,-8,0],0],[[-4,-9,0],0],[[-3,-9,0],0],[[-2,-9,0],1],[[-1,-9,0],1],[[0,-9,0],1],[[1,-9,0],1],[[2,-9,0],1],[[3,-9,0],0],[[4,-9,0],0],[[-2,-10,0],0],[[-1,-10,0],0],[[0,-10,0],0],[[1,-10,0],0],[[2,-10,0],0]],"position":[0,0,0],"rotation":[0,0,0],"name":"Bean Logo"},{"colorList":[[0,0,1,1]],"points":[[[-15,0,0],0]],"position":[0,0,0],"rotation":[0,0,0],"name":"CubeLeftBlue"},{"colorList":[[1,0,0,1]],"points":[[[15,0,0],0]],"position":[0,0,0],"rotation":[0,0,0],"name":"CubeRightRed"},{"colorList":[[0,1,0,1]],"points":[[[0,15,0],0]],"position":[0,0,0],"rotation":[0,0,0],"name":"CubeUpGreen"}],"lightsGlobal":[{"position":[1,0,0],"color":[0,0,1,1],"name":"Blue"},{"position":[-1,0,0],"color":[1,0,0,1],"name":"Red"},{"position":[0,-1,0],"color":[0,1,0,1],"name":"Green"}],"lightsDot":[]}';
	var jsonObjBack = JSON.parse(jsonString);
	
	//Load from JSON
	data.loadFromJSON(jsonObjBack);
	/**/
	
	
	///Animation################################################################
	
	animation = new BlockAnimation.Animation(zoom);
	
	//load current data
	animation.loadData(data);
	
	var frame = new BlockAnimation.Frame(100);
	var tempModify;
	
	tempModify = {
		Position: new BlockMath.Vector3(0, -5, -5),
		Rotation: new BlockMath.Vector3(0, 0, 0),
		PositionChange: new BlockMath.Vector3(0, 10, 10),
		RotationChange: new BlockMath.Vector3(PI, 0, 0)
	};
	
	frame.modElement("Add", meshes[0].Name, "Mesh", tempModify);
	
	
	animation.Frames.push(frame);
	
	
	frame = new BlockAnimation.Frame(50);
	var tempModify;
	
	tempModify = {
		Position: new BlockMath.Vector3(0, 5, 0),
		Rotation: new BlockMath.Vector3(0, 2, 0),
		PositionChange: new BlockMath.Vector3(10, 0, 0),
		RotationChange: new BlockMath.Vector3(PI, 0, 0)
	};
	
	frame.modElement("Add", meshes[0].Name, "Mesh", tempModify);
	
	tempModify = {
		Position: new BlockMath.Vector3(0, 5, 0),
		Rotation: new BlockMath.Vector3(0, 2, 0),
		PositionChange: new BlockMath.Vector3(1, 0, 0),
		RotationChange: new BlockMath.Vector3(PI, 0, 0)
	};
	
	frame.modElement("Add", lightsGlobal[2].Name, "Global", tempModify);
	
	animation.Frames.push(frame);
	
	frame = new BlockAnimation.Frame(200);
	var tempModify;
	
	tempModify = {
		Position: new BlockMath.Vector3(0, 0, 0),
		Rotation: new BlockMath.Vector3(0, 0, 0),
		PositionChange: new BlockMath.Vector3(0, 0, 0),
		//PositionChange: new BlockMath.Vector3(40, 0, 0),
		RotationChange: new BlockMath.Vector3(10*PI, 4*PI, 0)
	};
	
	frame.modElement("Add", meshes[0].Name, "Mesh", tempModify);
	
	tempModify = {	//global is currently constant
		//Position: new BlockMath.Vector3(0, 5, 0),
		//Rotation: new BlockMath.Vector3(0, 0, 0),
		//PositionChange: new BlockMath.Vector3(1, 0, 0),
		//RotationChange: new BlockMath.Vector3(PI, 0, 0)
	};
	
	frame.modElement("Add", lightsGlobal[2].Name, "Global", tempModify);
	
	tempModify = {	//global is currently constant
		Position: new BlockMath.Vector3(0, 0, -5),
		Rotation: new BlockMath.Vector3(0, 0, 0),
		PositionChange: new BlockMath.Vector3(0, 1000, 0),
		RotationChange: new BlockMath.Vector3(0, 0, 0)
	};
	
	frame.modElement("Add", lightsDot[0].Name, "Dot", tempModify);
	
	animation.Frames.push(frame);
	
	
	frame = new BlockAnimation.Frame(200);
	var tempModify;
	
	tempModify = {
		Position: new BlockMath.Vector3(0, 0, 0),
		Rotation: new BlockMath.Vector3(0, 0, 0),
		PositionChange: new BlockMath.Vector3(0, 0, 0),
		RotationChange: new BlockMath.Vector3(0, 0, 0)
	};
	
	frame.modElement("Add", meshes[0].Name, "Mesh", tempModify);
	
	animation.Frames.push(frame);
	
	
	
	frame = new BlockAnimation.Frame(200);
	var tempModify;
	
	tempModify = {
		Position: new BlockMath.Vector3(0, 0, 0),
		Rotation: new BlockMath.Vector3(0, PI/2, 0),
		PositionChange: new BlockMath.Vector3(0, 0, 0),
		RotationChange: new BlockMath.Vector3(0, 0, 0)
	};
	
	frame.modElement("Add", meshes[0].Name, "Mesh", tempModify);
	
	animation.Frames.push(frame);
	
	
	
	frame = new BlockAnimation.Frame(200);
	var tempModify;
	
	tempModify = {
		Position: new BlockMath.Vector3(0, 0, 0),
		Rotation: new BlockMath.Vector3(PI/2, 0, 0),
		PositionChange: new BlockMath.Vector3(0, 0, 0),
		RotationChange: new BlockMath.Vector3(0, 0, 0)
	};
	
	frame.modElement("Add", meshes[0].Name, "Mesh", tempModify);
	
	animation.Frames.push(frame);
	
	
	
	/** /
	var tjs = animation.toJSON();
	
	stjs = '{"zoom":0.0125,"speed":16.666666666666668,"frames":[{"duration":100,"zoomScale":1,"zoomScaleChange":0,"requiredMeshes":[["Bean Logo",[0,-5,-5],[0,10,10],[0,0,0],[3.141592653582746,0,0]]],"requiredLightsGlobal":[],"requiredLightsDot":[["RedD",[0,5,0],[1,0,0]]]},{"duration":50,"zoomScale":1,"zoomScaleChange":0,"requiredMeshes":[["Bean Logo",[0,5,0],[10,0,0],[0,2,0],[3.141592653582746,0,0]]],"requiredLightsGlobal":[["Green"]],"requiredLightsDot":[]},{"duration":200,"zoomScale":5,"zoomScaleChange":-4,"requiredMeshes":[["Bean Logo",[-20,5,0],[40,0,0],[0,0,0],[31.41592653582746,12.566370614330983,0]]],"requiredLightsGlobal":[["Green"]],"requiredLightsDot":[["RedD",[0,0,0],[0,0,0]]]}]}';
	
	tjs = JSON.parse(stjs);
	
	var fjs = BlockAnimation.Animation.FromJSON(tjs);
	
	fjs.loadData(data);
	
	animation = fjs;
	/**/
	requestAnimationFrame(drawingLoop);
}
/*
function loadJSONCompleted(meshesLoaded) {
    meshes = meshesLoaded;

    requestAnimationFrame(drawingLoop);
}
*/

function drawingLoop() {
    var now = Date.now();
	var step = (now - previousDate);
    var currentFPS = 1000 / step;
    previousDate = now;

    divCurrentFPS.textContent = currentFPS.toFixed(2);

    if (lastFPSValues.length < 60) {
        lastFPSValues.push(currentFPS);
    } else {
        lastFPSValues.shift();
        lastFPSValues.push(currentFPS);
        var totalValues = 0;
        for (var i = 0; i < lastFPSValues.length; i++) {
            totalValues += lastFPSValues[i];
        }

        var averageFPS = totalValues / lastFPSValues.length;
        divAverageFPS.textContent = averageFPS.toFixed(2);
    }
	
	//Log("Loop" + now);
	
	if (Switch.Loop) {
		requestAnimationFrame(drawingLoop);
		return;
	}
	
    device.clear();
    device1.clear();
    device2.clear();
    device3.clear();

	var meshes = data.meshes;
	if (Switch.Rotate) {
		/** /
		meshes[0].Rotation.y += 0.001*step;
		meshes[0].Rotation.x += 0.0002*step;
		meshes[0].Rotation.z += 0.0005*step;
		/**/
		/** /
		
		for (var i = 0; i < meshes.length; i++) {
			meshes[i].Rotation.y += 0.001*step;
			meshes[i].Rotation.x += 0.0002*step;
		}
		/**/
		//mera.rotatePosition(0.001*step, 0, 0.0005*step);
		//mera.rotateTarget(0, 0.001*step, 0, 0);
	}
	/** /
	if (Switch.Zoom) {	
		zoom += zoom*step*zoomTrigger;
		if (zoom>0.5) {
			zoomTrigger=-zoomTrigger;
			zoom=0.5;
		}
		if (zoom<0.005) {
			zoomTrigger=-zoomTrigger;
			zoom=0.005;
		}
    }
	/**/
	
	var renderData = animation.getRenderData(step);
	var renderZoom = animation.currentZoom;
	device.render(renderZoom, mera, renderData, "skeleton");
	device1.render(renderZoom, mera1, renderData, "skeleton");
	device2.render(renderZoom, mera2, renderData, "skeleton");
	device3.render(renderZoom, mera3, renderData);
	//device.render(zoom, mera, data);

	// TODO: Add Editor Marking
	//BlockEditor.editorMark(device, renderZoom, mera, renderData, "skeleton");
	// or add a mesh?
	
    device.present();
    device1.present();
    device2.present();
    device3.present();

    requestAnimationFrame(drawingLoop);
}