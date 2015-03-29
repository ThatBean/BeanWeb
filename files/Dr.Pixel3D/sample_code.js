var PI = Math.PI;

var canvas;

var device;		//the engine, the stage
var camera;		//the camera-view point-eye
var model_data;	//the model
var model_data2;	//the model 2
var model_data3;	//the model 3
var animation;	//the animation object

///The concept of size and ratio in this engine
/*
	a pixel --zoom--> a block --inside--> a working canvas --ratio--> screen canvas
	The initial block size is 1 pixel on the working canvas
	with 'zoom' we can change the block size on the working canvas
	The initial working canvas pixel size will be the same as the screen canvas
	with 'ratio' we can change the pixel to more a bigger square (ratio > 1), or better quality (ratio < 1)
*/





//Important:
//should always keep a 4 based size
///set these value
var screenPixelWidth = 400;		//the width of on-screen canvas
var blockScale = 10;	//(how many pixel for one block in working pixel)
var workingPixelScale = 4;	//(how many pixel on screen for one pixel in working pixel)


//auto calculated and used
//var workingPixelWidth = screenPixelWidth / workingPixelScale;	//the width of rendered 'canvas', not used but good to remember
var ratio = 1 / workingPixelScale;
var zoom = blockScale * workingPixelScale / screenPixelWidth;
//		when zoom == 0.05, the projected size is 20 x 20 (half blocks on the edge)
//		when zoom == 0.005, the projected size is 200 x 200

var _zoom_modifier = 1.0;
var _zoom_modify_speed = 0.5;



var Switch = new (Dr.Get("Switch"));
Dr.log(Switch);
Switch.Switch("Test");



//document.addEventListener("DOMContentLoaded", init, false);

function init() {
	Dr.LoadAll();
	Dr.UpdateLoop.start();
	
	
	var FPS = Dr.Get("FPS")
	var fps = new FPS(function (averageFPS, currentFPS) {
		document.getElementById("FPS").innerHTML = "AvgFPS:" + averageFPS.toFixed(2) + ", CurFPS:" + currentFPS.toFixed(2);
	})
	Dr.UpdateLoop.add(function (delta_time) { 
		fps.FPS(); 
		return true;
	})

	var TagLog = Dr.Get("TagLog")
	var tag_log = new TagLog(function (log_text) {
		document.getElementById("Log").innerHTML = log_text;
	})
	Dr.UpdateLoop.add(function (delta_time) { 
		if (!Switch.Log) {
			tag_log.Log("update log " + Dr.now()); 
		}
		return true;
	})
	
	
	
	
	
	var Pixel3D_Engine = Dr.Get("Pixel3D_Engine");
	var Pixel3D_Math = Dr.Get("Pixel3D_Math");
	var Pixel3D_Data = Dr.Get("Pixel3D_Data");
	var Pixel3D_Animation = Dr.Get("Pixel3D_Animation");
	
	
	
	
	
	
	canvas = document.getElementById("frontBuffer");
	device = new Pixel3D_Engine.Device(canvas, ratio);
	
	

	//Camera position: to Z+(blocks behind will not be shown)
	
	camera = new Pixel3D_Data.Camera();
	camera.Position = new Pixel3D_Math.Vector3(0, 0, -100);
	camera.Target = new Pixel3D_Math.Vector3(0, 0, 0);

	// TODO: load func
	// TODO: 
	
	//device.LoadJSONFileAsync("monkey.Pixel3D_Math", loadJSONCompleted);
	
	
	
	
	/**/
	model_data2 = new Pixel3D_Data.Data();
	var meshes = model_data2.meshes;
	var lightsGlobal = model_data2.lightsGlobal;
	var lightsDot = model_data2.lightsDot;
	
	var rTime = 1000;
	var rX = 100;
	var rY = rX;
	var rZ = rX;
	
	var rand = function (range) {return ((Math.random()-0.5)*range) >> 0;}
	
	var mesh= new Pixel3D_Data.BlockMesh("Cube", rTime);
	for (var i = 0; i < rTime; i++) {
		mesh.Blocks[i] = new Pixel3D_Data.Block(
			new Pixel3D_Math.Vector3(rand(rX), rand(rY), rand(rZ)),
			new Pixel3D_Math.Color4.Random(1)
		)
	}
	mesh.removeInvisible();	//mark invisible faces
	meshes.push(mesh);
	
	
	lightsGlobal.push(new Pixel3D_Data.Light(
		new Pixel3D_Math.Vector3(1, 0, 0),
		new Pixel3D_Math.Color4(0, 0, 1, 1),
		"Blue"
	));
	lightsGlobal.push(new Pixel3D_Data.Light(
		new Pixel3D_Math.Vector3(-1, 0, 0),
		new Pixel3D_Math.Color4(1, 0, 0, 1),
		"Red"
	));
	lightsGlobal.push(new Pixel3D_Data.Light(
		new Pixel3D_Math.Vector3(0, -1, 0),
		new Pixel3D_Math.Color4(0, 1, 0, 1),
		"Green"
	));
	
	/**/
	
	
	
	
	
	
	/**/
	model_data3 = new Pixel3D_Data.Data();
	var meshes = model_data3.meshes;
	var lightsGlobal = model_data3.lightsGlobal;
	var lightsDot = model_data3.lightsDot;
	
	mesh= new Pixel3D_Data.BlockMesh("Cube", 12); 
	for (var i = 0; i < 3; i++) {
		for (var j = 1; j <= 4; j++) {
			mesh.Blocks[i*4+j-1] = new Pixel3D_Data.Block(
				new Pixel3D_Math.Vector3(j*(i==0?1:0), j*(i==1?1:0), j*(i==2?1:0)),
				new Pixel3D_Math.Color4(1*(i==0?1:0), 1*(i==1?1:0), 1*(i==2?1:0), 1)
			);
			if (j!=3) mesh.Blocks[i*4+j-1].Color = new Pixel3D_Math.Color4(1, 1, 1, 1);
		}
	}
	meshes.push(mesh);
	
	
	lightsGlobal.push(new Pixel3D_Data.Light(
		new Pixel3D_Math.Vector3(1, 0, 0),
		new Pixel3D_Math.Color4(0, 0, 1, 1),
		"Blue"
	));
	lightsGlobal.push(new Pixel3D_Data.Light(
		new Pixel3D_Math.Vector3(-1, 0, 0),
		new Pixel3D_Math.Color4(1, 0, 0, 1),
		"Red"
	));
	lightsGlobal.push(new Pixel3D_Data.Light(
		new Pixel3D_Math.Vector3(0, -1, 0),
		new Pixel3D_Math.Color4(0, 1, 0, 1),
		"Green"
	));
	
	
	lightsDot.push(new Pixel3D_Data.Light(
		new Pixel3D_Math.Vector3(0, 0, 0),
		new Pixel3D_Math.Color4(1, 0, 1, 1),
		"RedD"
	));
	/**/
	
	/**/
	
	
	
	
	
	
	
	
	
	
	
	
	
	model_data = new Pixel3D_Data.Data();
	var meshes = model_data.meshes;
	var lightsGlobal = model_data.lightsGlobal;
	var lightsDot = model_data.lightsDot;
	
	
	//The bean logo
	//0:nothing |8:#111111(0, 0, 0) |1:#FFAE63(255, 174, 99)
	
	var BEAN_LOGO = [	// |Center total 18
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
	
	var mesh= new Pixel3D_Data.BlockMesh("Bean Logo", 0); 
	var tempBlock;
	for (var i = 0; i < BEAN_LOGO.length; i++) {
		if (BEAN_LOGO[i] != 0) {
			tempBlock = new Pixel3D_Data.Block(
				new Pixel3D_Math.Vector3(i%18-8, -Math.floor(i/18)+10, 0),
				(BEAN_LOGO[i]==8 ? new Pixel3D_Math.Color4(0, 0, 0, 1) : new Pixel3D_Math.Color4(255/255, 174/255, 99/255, 1))
			)
			mesh.Blocks.push(tempBlock);
			/** /
			if (BEAN_LOGO[i] == 8) {
				tempBlock = new Block(
					new Pixel3D_Math.Vector3(i%18-8, -Math.floor(i/18)+10, -1),
					(BEAN_LOGO[i]==8 ? new Pixel3D_Math.Color4(0, 0, 0, 1) : new Pixel3D_Math.Color4(255/255, 174/255, 99/255, 1))
				)
				mesh.Blocks.push(tempBlock);
				tempBlock = new Block(
					new Pixel3D_Math.Vector3(i%18-8, -Math.floor(i/18)+10, 1),
					(BEAN_LOGO[i]==8 ? new Pixel3D_Math.Color4(0, 0, 0, 1) : new Pixel3D_Math.Color4(255/255, 174/255, 99/255, 1))
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
	
	mesh= new Pixel3D_Data.BlockMesh("CubeLeftBlue", 1);
	mesh.Blocks[0] = new Pixel3D_Data.Block(
		new Pixel3D_Math.Vector3(-cube_dis, 0, 0),
		new Pixel3D_Math.Color4(0, 0, 1, 1)
	);
	meshes.push(mesh);
	
	mesh= new Pixel3D_Data.BlockMesh("CubeRightRed", 1);
	mesh.Blocks[0] = new Pixel3D_Data.Block(
		new Pixel3D_Math.Vector3(cube_dis, 0, 0),
		new Pixel3D_Math.Color4(1, 0, 0, 1)
	);
	meshes.push(mesh);
	
	mesh= new Pixel3D_Data.BlockMesh("CubeUpGreen", 1);
	mesh.Blocks[0] = new Pixel3D_Data.Block(
		new Pixel3D_Math.Vector3(0, cube_dis, 0),
		new Pixel3D_Math.Color4(0, 1, 0, 1)
	);
	meshes.push(mesh);
	
	
	/**/
	
	
	lightsGlobal.push(new Pixel3D_Data.Light(
		new Pixel3D_Math.Vector3(1, 0, 0),
		new Pixel3D_Math.Color4(0, 0, 1, 1),
		"Blue"
	));
	lightsGlobal.push(new Pixel3D_Data.Light(
		new Pixel3D_Math.Vector3(-1, 0, 0),
		new Pixel3D_Math.Color4(1, 0, 0, 1),
		"Red"
	));
	lightsGlobal.push(new Pixel3D_Data.Light(
		new Pixel3D_Math.Vector3(0, -1, 0),
		new Pixel3D_Math.Color4(0, 1, 0, 1),
		"Green"
	));
	
	
	lightsDot.push(new Pixel3D_Data.Light(
		new Pixel3D_Math.Vector3(0, 0, 0),
		new Pixel3D_Math.Color4(1, 0, 1, 1),
		"RedD"
	));
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	/** /
	//save to JSON
	var jsonObj = model_data.saveToJSON();
	var jsonString = JSON.stringify(jsonObj);
	/**/
	/** /
	model_data.empty();
	var jsonString = '{"meshes":[{"colorList":[[0,0,0,1],[1,0.6823529411764706,0.38823529411764707,1]],"points":[[[1,10,0],0],[[-4,9,0],0],[[-1,9,0],0],[[0,9,0],0],[[3,9,0],0],[[6,9,0],0],[[-3,8,0],0],[[-2,8,0],0],[[-1,8,0],0],[[0,8,0],0],[[1,8,0],0],[[2,8,0],0],[[3,8,0],0],[[5,8,0],0],[[-7,7,0],0],[[-5,7,0],0],[[-4,7,0],0],[[-3,7,0],0],[[-2,7,0],0],[[-1,7,0],0],[[0,7,0],0],[[1,7,0],0],[[2,7,0],0],[[3,7,0],0],[[4,7,0],0],[[5,7,0],0],[[6,7,0],0],[[-6,6,0],0],[[-5,6,0],0],[[-4,6,0],0],[[-3,6,0],0],[[-2,6,0],0],[[-1,6,0],0],[[0,6,0],0],[[1,6,0],0],[[2,6,0],0],[[3,6,0],0],[[4,6,0],0],[[5,6,0],0],[[6,6,0],0],[[7,6,0],0],[[9,6,0],0],[[-7,5,0],0],[[-6,5,0],0],[[-5,5,0],0],[[-4,5,0],0],[[-3,5,0],0],[[-2,5,0],0],[[-1,5,0],0],[[0,5,0],0],[[1,5,0],0],[[2,5,0],0],[[3,5,0],0],[[4,5,0],0],[[5,5,0],0],[[6,5,0],0],[[7,5,0],0],[[-8,4,0],0],[[-7,4,0],0],[[-6,4,0],0],[[-5,4,0],0],[[-4,4,0],0],[[-3,4,0],0],[[-2,4,0],0],[[-1,4,0],1],[[0,4,0],1],[[1,4,0],0],[[2,4,0],1],[[3,4,0],1],[[4,4,0],0],[[5,4,0],0],[[6,4,0],0],[[7,4,0],0],[[8,4,0],0],[[-7,3,0],0],[[-6,3,0],0],[[-5,3,0],0],[[-4,3,0],0],[[-3,3,0],1],[[-2,3,0],1],[[-1,3,0],1],[[0,3,0],1],[[1,3,0],1],[[2,3,0],1],[[3,3,0],1],[[4,3,0],1],[[5,3,0],0],[[6,3,0],0],[[7,3,0],0],[[8,3,0],0],[[-8,2,0],0],[[-7,2,0],0],[[-6,2,0],0],[[-5,2,0],1],[[-4,2,0],0],[[-3,2,0],0],[[-2,2,0],1],[[-1,2,0],1],[[0,2,0],1],[[1,2,0],1],[[2,2,0],1],[[3,2,0],1],[[4,2,0],1],[[5,2,0],1],[[6,2,0],0],[[7,2,0],0],[[-7,1,0],0],[[-6,1,0],0],[[-5,1,0],1],[[-4,1,0],1],[[-3,1,0],1],[[-2,1,0],1],[[-1,1,0],1],[[0,1,0],1],[[1,1,0],1],[[2,1,0],1],[[3,1,0],1],[[4,1,0],1],[[5,1,0],1],[[6,1,0],0],[[7,1,0],0],[[8,1,0],0],[[-7,0,0],0],[[-6,0,0],0],[[-5,0,0],1],[[-4,0,0],0],[[-3,0,0],0],[[-2,0,0],0],[[-1,0,0],1],[[0,0,0],1],[[1,0,0],1],[[2,0,0],0],[[3,0,0],0],[[4,0,0],0],[[5,0,0],1],[[6,0,0],0],[[7,0,0],0],[[-8,-1,0],0],[[-7,-1,0],1],[[-6,-1,0],0],[[-5,-1,0],1],[[-4,-1,0],1],[[-3,-1,0],1],[[-2,-1,0],1],[[-1,-1,0],1],[[0,-1,0],0],[[1,-1,0],1],[[2,-1,0],1],[[3,-1,0],1],[[4,-1,0],1],[[5,-1,0],1],[[6,-1,0],0],[[7,-1,0],0],[[8,-1,0],0],[[-8,-2,0],0],[[-7,-2,0],1],[[-6,-2,0],0],[[-5,-2,0],1],[[-4,-2,0],1],[[-3,-2,0],0],[[-2,-2,0],1],[[-1,-2,0],1],[[0,-2,0],0],[[1,-2,0],1],[[2,-2,0],1],[[3,-2,0],0],[[4,-2,0],1],[[5,-2,0],1],[[6,-2,0],0],[[7,-2,0],1],[[8,-2,0],0],[[-8,-3,0],0],[[-7,-3,0],1],[[-6,-3,0],0],[[-5,-3,0],1],[[-4,-3,0],1],[[-3,-3,0],1],[[-2,-3,0],1],[[-1,-3,0],0],[[0,-3,0],1],[[1,-3,0],1],[[2,-3,0],1],[[3,-3,0],1],[[4,-3,0],1],[[5,-3,0],1],[[6,-3,0],0],[[7,-3,0],1],[[8,-3,0],0],[[-7,-4,0],0],[[-6,-4,0],0],[[-5,-4,0],1],[[-4,-4,0],1],[[-3,-4,0],1],[[-2,-4,0],0],[[-1,-4,0],0],[[0,-4,0],1],[[1,-4,0],1],[[2,-4,0],1],[[3,-4,0],1],[[4,-4,0],1],[[5,-4,0],1],[[6,-4,0],0],[[7,-4,0],0],[[-6,-5,0],0],[[-5,-5,0],1],[[-4,-5,0],1],[[-3,-5,0],1],[[-2,-5,0],1],[[-1,-5,0],0],[[0,-5,0],0],[[1,-5,0],1],[[2,-5,0],1],[[3,-5,0],1],[[4,-5,0],1],[[5,-5,0],1],[[6,-5,0],0],[[-6,-6,0],0],[[-5,-6,0],1],[[-4,-6,0],1],[[-3,-6,0],0],[[-2,-6,0],1],[[-1,-6,0],1],[[0,-6,0],1],[[1,-6,0],1],[[2,-6,0],1],[[3,-6,0],0],[[4,-6,0],1],[[5,-6,0],1],[[6,-6,0],0],[[-5,-7,0],0],[[-4,-7,0],1],[[-3,-7,0],1],[[-2,-7,0],0],[[-1,-7,0],0],[[0,-7,0],0],[[1,-7,0],0],[[2,-7,0],0],[[3,-7,0],1],[[4,-7,0],1],[[5,-7,0],0],[[-5,-8,0],0],[[-4,-8,0],0],[[-3,-8,0],1],[[-2,-8,0],1],[[-1,-8,0],1],[[0,-8,0],1],[[1,-8,0],1],[[2,-8,0],1],[[3,-8,0],1],[[4,-8,0],0],[[5,-8,0],0],[[-4,-9,0],0],[[-3,-9,0],0],[[-2,-9,0],1],[[-1,-9,0],1],[[0,-9,0],1],[[1,-9,0],1],[[2,-9,0],1],[[3,-9,0],0],[[4,-9,0],0],[[-2,-10,0],0],[[-1,-10,0],0],[[0,-10,0],0],[[1,-10,0],0],[[2,-10,0],0]],"position":[0,0,0],"rotation":[0,0,0],"name":"Bean Logo"},{"colorList":[[0,0,1,1]],"points":[[[-15,0,0],0]],"position":[0,0,0],"rotation":[0,0,0],"name":"CubeLeftBlue"},{"colorList":[[1,0,0,1]],"points":[[[15,0,0],0]],"position":[0,0,0],"rotation":[0,0,0],"name":"CubeRightRed"},{"colorList":[[0,1,0,1]],"points":[[[0,15,0],0]],"position":[0,0,0],"rotation":[0,0,0],"name":"CubeUpGreen"}],"lightsGlobal":[{"position":[1,0,0],"color":[0,0,1,1],"name":"Blue"},{"position":[-1,0,0],"color":[1,0,0,1],"name":"Red"},{"position":[0,-1,0],"color":[0,1,0,1],"name":"Green"}],"lightsDot":[]}';
	var jsonObjBack = JSON.parse(jsonString);
	
	//Load from JSON
	model_data.loadFromJSON(jsonObjBack);
	/**/
	
	
	///Animation################################################################
	
	animation = new Pixel3D_Animation.Animation(zoom);
	
	//load current model_data
	animation.loadData(model_data);
	
	var frame = new Pixel3D_Animation.Frame(100);
	var tempModify;
	
	tempModify = {
		Position: new Pixel3D_Math.Vector3(0, -5, -5),
		Rotation: new Pixel3D_Math.Vector3(0, 0, 0),
		PositionChange: new Pixel3D_Math.Vector3(0, 10, 10),
		RotationChange: new Pixel3D_Math.Vector3(PI, 0, 0)
	};
	
	frame.modElement("Add", meshes[0].Name, "Mesh", tempModify);
	
	
	animation.Frames.push(frame);
	
	
	frame = new Pixel3D_Animation.Frame(50);
	var tempModify;
	
	tempModify = {
		Position: new Pixel3D_Math.Vector3(0, 5, 0),
		Rotation: new Pixel3D_Math.Vector3(0, 2, 0),
		PositionChange: new Pixel3D_Math.Vector3(10, 0, 0),
		RotationChange: new Pixel3D_Math.Vector3(PI, 0, 0)
	};
	
	frame.modElement("Add", meshes[0].Name, "Mesh", tempModify);
	
	tempModify = {
		Position: new Pixel3D_Math.Vector3(0, 5, 0),
		Rotation: new Pixel3D_Math.Vector3(0, 2, 0),
		PositionChange: new Pixel3D_Math.Vector3(1, 0, 0),
		RotationChange: new Pixel3D_Math.Vector3(PI, 0, 0)
	};
	
	frame.modElement("Add", lightsGlobal[2].Name, "Global", tempModify);
	
	animation.Frames.push(frame);
	
	frame = new Pixel3D_Animation.Frame(2000);
	var tempModify;
	
	tempModify = {
		Position: new Pixel3D_Math.Vector3(0, 0, 0),
		Rotation: new Pixel3D_Math.Vector3(0, 0, 0),
		PositionChange: new Pixel3D_Math.Vector3(0, 0, 0),
		//PositionChange: new Pixel3D_Math.Vector3(40, 0, 0),
		RotationChange: new Pixel3D_Math.Vector3(10*PI, 4*PI, 20*PI)
	};
	
	frame.modElement("Add", meshes[0].Name, "Mesh", tempModify);
	
	tempModify = {	//global is currently constant
		//Position: new Pixel3D_Math.Vector3(0, 5, 0),
		//Rotation: new Pixel3D_Math.Vector3(0, 0, 0),
		//PositionChange: new Pixel3D_Math.Vector3(1, 0, 0),
		//RotationChange: new Pixel3D_Math.Vector3(PI, 0, 0)
	};
	
	frame.modElement("Add", lightsGlobal[2].Name, "Global", tempModify);
	
	tempModify = {	//global is currently constant
		Position: new Pixel3D_Math.Vector3(0, 0, -5),
		Rotation: new Pixel3D_Math.Vector3(0, 0, 0),
		PositionChange: new Pixel3D_Math.Vector3(0, 1000, 0),
		RotationChange: new Pixel3D_Math.Vector3(0, 0, 0)
	};
	
	frame.modElement("Add", lightsDot[0].Name, "Dot", tempModify);
	
	animation.Frames.push(frame);
	
	
	frame = new Pixel3D_Animation.Frame(200);
	var tempModify;
	
	tempModify = {
		Position: new Pixel3D_Math.Vector3(0, 0, 0),
		Rotation: new Pixel3D_Math.Vector3(0, 0, 0),
		PositionChange: new Pixel3D_Math.Vector3(0, 0, 0),
		RotationChange: new Pixel3D_Math.Vector3(0, 0, 0)
	};
	
	frame.modElement("Add", meshes[0].Name, "Mesh", tempModify);
	
	animation.Frames.push(frame);
	
	
	
	frame = new Pixel3D_Animation.Frame(200);
	var tempModify;
	
	tempModify = {
		Position: new Pixel3D_Math.Vector3(0, 0, 0),
		Rotation: new Pixel3D_Math.Vector3(0, PI/2, 0),
		PositionChange: new Pixel3D_Math.Vector3(0, 0, 0),
		RotationChange: new Pixel3D_Math.Vector3(0, 0, 0)
	};
	
	frame.modElement("Add", meshes[0].Name, "Mesh", tempModify);
	
	animation.Frames.push(frame);
	
	
	
	frame = new Pixel3D_Animation.Frame(200);
	var tempModify;
	
	tempModify = {
		Position: new Pixel3D_Math.Vector3(0, 0, 0),
		Rotation: new Pixel3D_Math.Vector3(PI/2, 0, 0),
		PositionChange: new Pixel3D_Math.Vector3(0, 0, 0),
		RotationChange: new Pixel3D_Math.Vector3(0, 0, 0)
	};
	
	frame.modElement("Add", meshes[0].Name, "Mesh", tempModify);
	
	animation.Frames.push(frame);
	
	var adjust_func = function (event_key, event, K_def) {
		var target_model_data;
		
		if (Switch.Model) {
			switch (Switch.Model_Type) {
				case 3:
					target_model_data = model_data3;
					break;
				case 2:
					target_model_data = model_data2;
					break;
				default:
					target_model_data = model_data;
					break;
			}
		}
		else {
			return;
		}
		
		var meshes = target_model_data.meshes;
		
		Dr.log('==================', K_def);
		if (K_def == 'K_LEFT') {
			for (var i = 0; i < meshes.length; i++) {
				meshes[i].Position.x -= 1;
			}
		}
		if (K_def == 'K_RIGHT') {
			for (var i = 0; i < meshes.length; i++) {
				meshes[i].Position.x += 1;
			}
		}
		if (K_def == 'K_UP') {
			for (var i = 0; i < meshes.length; i++) {
				meshes[i].Position.y += 1;
			}
		}
		if (K_def == 'K_DOWN') {
			for (var i = 0; i < meshes.length; i++) {
				meshes[i].Position.y -= 1;
			}
		}
		
		if (event) {
			event.preventDefault();
		}
	};
	
	Dr.Event.subscribe('KEY_UP', adjust_func);
	Dr.Event.subscribe('KEY_DOWN', adjust_func);
	
	/** /
	var tjs = animation.toJSON();
	
	stjs = '{"zoom":0.0125,"speed":16.666666666666668,"frames":[{"duration":100,"zoomScale":1,"zoomScaleChange":0,"requiredMeshes":[["Bean Logo",[0,-5,-5],[0,10,10],[0,0,0],[3.141592653582746,0,0]]],"requiredLightsGlobal":[],"requiredLightsDot":[["RedD",[0,5,0],[1,0,0]]]},{"duration":50,"zoomScale":1,"zoomScaleChange":0,"requiredMeshes":[["Bean Logo",[0,5,0],[10,0,0],[0,2,0],[3.141592653582746,0,0]]],"requiredLightsGlobal":[["Green"]],"requiredLightsDot":[]},{"duration":200,"zoomScale":5,"zoomScaleChange":-4,"requiredMeshes":[["Bean Logo",[-20,5,0],[40,0,0],[0,0,0],[31.41592653582746,12.566370614330983,0]]],"requiredLightsGlobal":[["Green"]],"requiredLightsDot":[["RedD",[0,0,0],[0,0,0]]]}]}';
	
	tjs = JSON.parse(stjs);
	
	var fjs = Pixel3D_Animation.Animation.FromJSON(tjs);
	
	fjs.loadData(model_data);
	
	animation = fjs;
	/**/
	
	Dr.UpdateLoop.add(drawingLoop);
}
/*
function loadJSONCompleted(meshesLoaded) {
	meshes = meshesLoaded;

	Dr.UpdateLoop.add(drawingLoop);
}
*/

function drawingLoop(delta_time) {
	//Dr.log("drawingLoop", delta_time);
	
	device.clear();
	
	
	if (!Switch.Render) {
		
		var target_zoom;
		var target_model_data;
		
		if (Switch.Model) {
			switch (Switch.Model_Type) {
				case 3:
					target_model_data = model_data3;
					break;
				case 2:
					target_model_data = model_data2;
					break;
				default:
					target_model_data = model_data;
					break;
			}
			target_zoom = zoom;
		}
		else {
			var renderData = animation.getRenderData(delta_time * 1000);
			var renderZoom = animation.currentZoom;
			target_model_data = renderData;
			target_zoom = renderZoom;
		}
		
		
		
		var meshes = target_model_data.meshes;
		if (Switch.Rotate) {
			/** /
			meshes[0].Rotation.y += 0.001*delta_time;
			meshes[0].Rotation.x += 0.0002*delta_time;
			meshes[0].Rotation.z += 0.0005*delta_time;
			/**/
			/**/
			
			for (var i = 0; i < meshes.length; i++) {
				meshes[i].Rotation.y += 1 * delta_time;
				meshes[i].Rotation.x += 0.2 * delta_time;
			}
			/**/
			//camera.rotatePosition(0.001*delta_time, 0, 0.0005*delta_time);
			//camera.rotateTarget(0, 0.001*delta_time, 0, 0);
		}
		
		if (Switch.Zoom) {	
			_zoom_modifier += _zoom_modifier * delta_time * _zoom_modify_speed;
			if (_zoom_modifier > 10) {
				_zoom_modify_speed = -_zoom_modify_speed;
				_zoom_modifier = 10;
			}
			if (_zoom_modifier < 0.1) {
				_zoom_modify_speed = -_zoom_modify_speed;
				_zoom_modifier = 0.1;
			}
		}
		
		
		
		
		
		
		
		
		
		
		
		
		device.render(
			target_zoom * _zoom_modifier, 
			camera, 
			target_model_data, 
			(Switch.Skeleton ? "skeleton" : null)
		);
		
		// TODO: Add Editor Marking
		//BlockEditor.editorMark(device, renderZoom, camera, renderData, "skeleton");
		// or add a mesh?
		
		device.present();
	}
	
	return true;
}

init();