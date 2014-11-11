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
	//font_img.src = 'images/BeanFont.png';
	font_img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAjoAAAANCAYAAACgqMT8AAAFoElEQVR4Xu1c0bLVQAjT//9o9TizynATErrbnusVn7RlKYQQaM+M37/Nn0FgEBgEBoFBYBAYBL4oAt+/aF6T1iAwCAwCg8AgMAgMAt/cRefHL6yi7evfrz+va/Hvr2vLNp+J9xzos991hl2PPqsYVIxObKdsEEanfI8fjMDiz+Jv5pVzPfrYsc9+ck/FDFb/ofhRf1b2qweW/2ib+3z1ONIK9txuPKfwrPLKbEB5Md244zqKh3GR6QTjcvTjanxHn3d1q3PesXVsHD1UftR95xlj4yGA5ny1h5Re3SY4sehUYpaDjM/rJleJLFqGPNjPW7G88uBkAnRlYGdxZ4O2OzCYfXX9PKLaY3cwP22vBlQ3nqv+MufUoM0vPFmk7lgUnIVMaUEXz1P2ld5V/c70GtWHYV51iTvIXTv2LPf8KbuKv4hHu3FrJXqPhYvne6L7+1S3Xkrf/njcWXTQWyAbnN2mU/a7QLAl4ckCq2Uuv5FXDakGSRTP6rmMOArv7gB4Eudquc24ZV5081I4ZXxde9XQ3YGu6qz8sTwQnnG53sVT8VwJucqr6x/1kptjVVOUR5WbyrvTb44vx+bJhWo3HtVf7v0Ozu+wPYXT3bGf0sXtRcchMWr4dY4NcWcIO89Wb0zsrekpQleCu4ats9ioeJFwOxg7DVH5cQbGK/a8aKPcnVoiTqgccvwrnhjD+nv0H79eID53f+LJvhc32XXUOyxOlx/RjtWlyostODEX9VORyjf2bM4X/azu5OEuJYrPXZyfsj8xkCLW6OfQjDOyV5zOfZTtVX0dPjhaE+vs8ifqRn75Z1rO5qDCIcZUcVL56f5Urfh/pY8yN6sXe6dfEA//1PzqF52qgRgoWajQ525EFCSQ7PnuJljFGOM8IRTIhyJGtQhlfyjn3GBsKWECUQkHI11H4NhCoxadKldHmFTsFScRf7O/u/mneFPl113AnE/6bMHpxnkFN1Rv1Ruqr1xBR3aO7qn4HEF36nhKt3br6OLp8rYbTxfPSjfRXKj47y4l6gWA9SFboqqZfor/CNeqJ6o6ME3v8Fzx4oe76LiNkwck27JcwLtLhyuY1aLENk22sHTsWT6sYbqNyoSULTqOfdXgrkCpPBx+sdqqs865iP/yd0WAXP5VQ7HivGro3Xownuzm1R14bIFUfaIWiSu6gzBRcajnKF2rONsZDKo31P0u367wJMaAvro4X7YV3p241sxycK4WHRT3Lp6OjscZfBrPXd6rOqk54dYxcur3mdOLTmzgXBRG6Dxk8oBxBtWHxMKF7nk22FcDKHFY55k9a6Bo7xDCyStjW4kKq90di85qRudzclXbiDXC28Goyu+UMLl+uo2ehcdddLrnXIFRfndwYCJfib/qo+o+yqU72Nx6qAXN6YE7tTxrWu7fTt3jWdWfqj5sKVF1V3Wp9KlaYDo4ZL1F+o9mKPvZCc0lhYPjH/WX0xtZVxlnnLi7uvjBp9scipCoEdEZl7iosdxYq4HtLCl3LjrdgaEaUgmkqoE7eDoN4yxMlZCwBVGRXWHhDItl4/yGHf1l8UN+kP3CId+r+i2eUXHGPsq4Km4gIVZxKqFn8Tj5xhcgR0cQj1jOuV4V1yqRd/uV1T2eZzGxurj6iPhT6SJaTCIGiFcoduSn4ifS4Wjv8oH5YTqvfrJFgz/XvctPB0/3A4CqL4pt1VDpPNN2J99cr8w556W3ir3isP3/6JRO/pObnWXvCiSMoGywMaJcJborWEqAOn4QTnfjfKU2c2YQGASeR0BpgbqvIt49r/y79904XDv3uU/bvS1+9y3gaUA+2/PeVqDPBsTN8QzONwM87geBfwgB9YVhVy92z5+C0o3DtTsV164fVb9d//b5WXRsqMZwEBgEBoFB4CEE2FBXX6zd8D7T0uDG4tq5GDxhd6peW7H+BJpngDoKyzbXAAAAAElFTkSuQmCC';
		
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
	//font_img.src = 'images/BeanFont.png';
	font_img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAjoAAAANCAYAAACgqMT8AAAFoElEQVR4Xu1c0bLVQAjT//9o9TizynATErrbnusVn7RlKYQQaM+M37/Nn0FgEBgEBoFBYBAYBL4oAt+/aF6T1iAwCAwCg8AgMAgMAt/cRefHL6yi7evfrz+va/Hvr2vLNp+J9xzos991hl2PPqsYVIxObKdsEEanfI8fjMDiz+Jv5pVzPfrYsc9+ck/FDFb/ofhRf1b2qweW/2ib+3z1ONIK9txuPKfwrPLKbEB5Md244zqKh3GR6QTjcvTjanxHn3d1q3PesXVsHD1UftR95xlj4yGA5ny1h5Re3SY4sehUYpaDjM/rJleJLFqGPNjPW7G88uBkAnRlYGdxZ4O2OzCYfXX9PKLaY3cwP22vBlQ3nqv+MufUoM0vPFmk7lgUnIVMaUEXz1P2ld5V/c70GtWHYV51iTvIXTv2LPf8KbuKv4hHu3FrJXqPhYvne6L7+1S3Xkrf/njcWXTQWyAbnN2mU/a7QLAl4ckCq2Uuv5FXDakGSRTP6rmMOArv7gB4Eudquc24ZV5081I4ZXxde9XQ3YGu6qz8sTwQnnG53sVT8VwJucqr6x/1kptjVVOUR5WbyrvTb44vx+bJhWo3HtVf7v0Ozu+wPYXT3bGf0sXtRcchMWr4dY4NcWcIO89Wb0zsrekpQleCu4ats9ioeJFwOxg7DVH5cQbGK/a8aKPcnVoiTqgccvwrnhjD+nv0H79eID53f+LJvhc32XXUOyxOlx/RjtWlyostODEX9VORyjf2bM4X/azu5OEuJYrPXZyfsj8xkCLW6OfQjDOyV5zOfZTtVX0dPjhaE+vs8ifqRn75Z1rO5qDCIcZUcVL56f5Urfh/pY8yN6sXe6dfEA//1PzqF52qgRgoWajQ525EFCSQ7PnuJljFGOM8IRTIhyJGtQhlfyjn3GBsKWECUQkHI11H4NhCoxadKldHmFTsFScRf7O/u/mneFPl113AnE/6bMHpxnkFN1Rv1Ruqr1xBR3aO7qn4HEF36nhKt3br6OLp8rYbTxfPSjfRXKj47y4l6gWA9SFboqqZfor/CNeqJ6o6ME3v8Fzx4oe76LiNkwck27JcwLtLhyuY1aLENk22sHTsWT6sYbqNyoSULTqOfdXgrkCpPBx+sdqqs865iP/yd0WAXP5VQ7HivGro3Xownuzm1R14bIFUfaIWiSu6gzBRcajnKF2rONsZDKo31P0u367wJMaAvro4X7YV3p241sxycK4WHRT3Lp6OjscZfBrPXd6rOqk54dYxcur3mdOLTmzgXBRG6Dxk8oBxBtWHxMKF7nk22FcDKHFY55k9a6Bo7xDCyStjW4kKq90di85qRudzclXbiDXC28Goyu+UMLl+uo2ehcdddLrnXIFRfndwYCJfib/qo+o+yqU72Nx6qAXN6YE7tTxrWu7fTt3jWdWfqj5sKVF1V3Wp9KlaYDo4ZL1F+o9mKPvZCc0lhYPjH/WX0xtZVxlnnLi7uvjBp9scipCoEdEZl7iosdxYq4HtLCl3LjrdgaEaUgmkqoE7eDoN4yxMlZCwBVGRXWHhDItl4/yGHf1l8UN+kP3CId+r+i2eUXHGPsq4Km4gIVZxKqFn8Tj5xhcgR0cQj1jOuV4V1yqRd/uV1T2eZzGxurj6iPhT6SJaTCIGiFcoduSn4ifS4Wjv8oH5YTqvfrJFgz/XvctPB0/3A4CqL4pt1VDpPNN2J99cr8w556W3ir3isP3/6JRO/pObnWXvCiSMoGywMaJcJborWEqAOn4QTnfjfKU2c2YQGASeR0BpgbqvIt49r/y79904XDv3uU/bvS1+9y3gaUA+2/PeVqDPBsTN8QzONwM87geBfwgB9YVhVy92z5+C0o3DtTsV164fVb9d//b5WXRsqMZwEBgEBoFB4CEE2FBXX6zd8D7T0uDG4tq5GDxhd6peW7H+BJpngDoKyzbXAAAAAElFTkSuQmCC';
		
	ctx.drawImage(font_img,0,0);
	ctx.drawImage(font_img,10,20);
	ctx.drawImage(font_img,20,40);
	ctx.drawImage(font_img,30,60);
	ctx.drawImage(font_img,40,80);

	var font_string_canvas = image.getFontString('fgfgfgfgfgrrrrhhTTTRFEGFEFWSF', 8);
	if (font_string_canvas) {
		ctx.drawImage(font_string_canvas, 200, 200);
	}
	
	
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