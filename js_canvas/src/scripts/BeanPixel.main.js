var PI = Math.PI;

var canvas;
var ctx;
var img_data;

//document.addEventListener('DOMContentLoaded', init, false);
window.addEventListener('load', init, false);




function init() {
	//init FPS
	FPS('currentFPS', 'averageFPS');
	//init Log
	Log('inited', 'Log');
	
	
	canvas = document.getElementById('BeanMainCanvas');
	
	var pageSize = B_Toolbox.getPageSize();
	//{'pageX':pageWidth,'pageY':pageHeight,'winX':windowWidth,'winY':windowHeight};
	console.log(pageSize);
	
	B_Toolbox.setSize(canvas, pageSize.winX - 0, pageSize.winY);
	B_Toolbox.setSize(document.body, pageSize.winX - 0, pageSize.winY);
	ctx = canvas.getContext('2d');
	
	var font_img = new Image();
	font_img.src = 'images/BeanFont.png';
	
	font_img.onload = function () {
		ctx.drawImage(font_img,0,100);
	}
	
	//img_data = image.load_image();
	img_data = image.loadFont();
	
	//read canvas size
	var target_canvas_size = {
		width: canvas.width,
		height: canvas.height
	}
	var target_canvas_style_size = {
		width: parseInt(canvas.style.width),
		height: parseInt(canvas.style.height)
	}
	
	var pixel_ratio = window.devicePixelRatio
	
	requestAnimationFrame(drawingLoop);
}
/*
function loadJSONCompleted(meshesLoaded) {
	meshes = meshesLoaded;

	requestAnimationFrame(drawingLoop);
}
*/

function drawingLoop() {
	//switch
	if (Switch.Loop) {
		FPS.step();	//don't update
		requestAnimationFrame(drawingLoop);
		return;
	}
	
	//update fps
	var step = FPS();
	
	
	
	var font_img = new Image();
	font_img.src = 'images/BeanFont.png';
	ctx.drawImage(font_img,0,0);
	ctx.drawImage(font_img,10,20);
	ctx.drawImage(font_img,20,40);
	ctx.drawImage(font_img,30,60);
	ctx.drawImage(font_img,40,80);

	
	//ctx.putImageData(image.test_idata, 0, 50);
	//console.log(img_data['G']);
	
	//ctx.putImageData(img_data['1'],100,100);
	
	//ctx.drawImage(img_data['G'],0,0);
	//ctx.drawImage(img_data['3'],0,0);
	/**/
	for (var ii = 0; ii < 10; ii ++) {
		for (var i = 1; i < 10; i ++) {
			//ctx.drawImage(img_data['' + i],0 + 10 * i + ii, 0 + ii);
			if (img_data['' + i]) {
				ctx.putImageData(img_data['' + i],0 + 10 * i + ii, 0 + ii);
			}
		}
	}
	/**/
	
	
	
	requestAnimationFrame(drawingLoop);
}