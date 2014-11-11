var image = (function () {
	var image = {};
	
	image.src_dir = 'images/';
	image.src_suffex = '.png';
	
	//only after loaded DOM
	var font_map = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';
	var font_width = 6;
	var font_height = 13;
	var font_src_image = 'BeanFont.png';
	
	image.loadFont = function () {
		//console.log(document);
		//console.log(document.body);
		//console.log(document.getElementsByTagName('body')[0]);
		//console.log(document.getElementById('BeanMainCanvas'));
		var font_canvas = document.getElementById('B_font_canvas') || B_Toolbox.createElement(document.body, 'canvas', 'B_font_canvas');
		font_canvas.style.display = 'none';
		font_canvas.style.position = 'fixed';
		font_canvas.style.top = '200px';
		font_canvas.style.right = '0px';
		font_canvas.style.backgroundColor = '#BBBBBB';
		font_canvas.style.order = 99;
		
		B_Toolbox.setSize(font_canvas, font_width * font_map.length, font_height);
		
		var path = image.src_dir + font_src_image;
		var font_img = new Image();
		//font_img.src = path;
		font_img.src = 'images/BeanFont.png';
		//console.log(path);
		
		var font_canvas = document.getElementById('B_font_canvas');
		var font_ctx = font_canvas.getContext('2d');
		
		
		image.res_font_obj = {};
		font_img.onload = function () {
			font_ctx.drawImage(font_img,0,0);
		
			//font_ctx.drawImage(font_img, 0, 0);
			
			
			for (var i in font_map) {
				var image_data = font_ctx.getImageData(i * font_width, 0, font_width, font_height);
				image.res_font_obj[font_map[i]] = image_data;
				console.log(i, "get", font_map[i], i * font_width, 0, font_width, font_height)
				
			}
		
		}
		console.log(image.res_font_obj);
		
		//image.test_idata =  font_ctx.getImageData(0, 0, font_width * font_map.length, font_height);
		
		return image.res_font_obj;
	}
	
	image.getFontString= function (tgt_string, line_width) {
		image.loadFont();
		
		var font_canvas = document.getElementById('B_font_canvas');
		var font_ctx = font_canvas.getContext('2d');
		
		//image.res_font_obj;
		
		var str_length = tgt_string.length;
		var data_width = str_length < line_width ? str_length : line_width;
		var data_height = Math.floor(str_length / line_width + 1);
		
		var image_data = font_ctx.createImageData(data_width * font_width, data_height * font_height);
		
		for (var i in tgt_string) {
			
			
			
			var image_data = font_ctx.getImageData(i * font_width, 0, font_width, font_height);
			
			
			
			image.res_font_obj[font_map[i]] = image_data;
			console.log(i, "get", font_map[i], i * font_width, 0, font_width, font_height)
			
		}
		
		console.log(image.res_font_obj);
		
		//image.test_idata =  font_ctx.getImageData(0, 0, font_width * font_map.length, font_height);
		
		return image.res_font_obj;
	}
	
	return image;
})()

