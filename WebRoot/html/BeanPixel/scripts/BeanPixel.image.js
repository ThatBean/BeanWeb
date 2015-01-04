var image = (function () {
	var image = {};
	
	image.src_dir = 'images/';
	image.src_suffex = '.png';
	
	//only after loaded DOM
	var font_map = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';
	var font_width = 6;
	var font_height = 13;
	var font_src_image = 'BeanFont.png';
	
	image.loadFont = function (callback) {
		//console.log(document);
		//console.log(document.body);
		//console.log(document.getElementsByTagName('body')[0]);
		//console.log(document.getElementById('BeanMainCanvas'));
		var font_canvas = document.getElementById('B_font_canvas') || B_Toolbox.createElement(document.body, 'canvas', 'B_font_canvas');
		//font_canvas.style.display = 'none';
		font_canvas.style.position = 'fixed';
		font_canvas.style.top = '200px';
		font_canvas.style.right = '0px';
		font_canvas.style.backgroundColor = '#BBBBBB';
		font_canvas.style.order = 99;
		
		B_Toolbox.setSize(font_canvas, font_width * font_map.length, font_height);
		
		var path = image.src_dir + font_src_image;
		var font_img = new Image();
		//font_img.src = path;
		//font_img.src = 'images/BeanFont.png';
		
		font_img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAjoAAAANCAYAAACgqMT8AAAFoElEQVR4Xu1c0bLVQAjT//9o9TizynATErrbnusVn7RlKYQQaM+M37/Nn0FgEBgEBoFBYBAYBL4oAt+/aF6T1iAwCAwCg8AgMAgMAt/cRefHL6yi7evfrz+va/Hvr2vLNp+J9xzos991hl2PPqsYVIxObKdsEEanfI8fjMDiz+Jv5pVzPfrYsc9+ck/FDFb/ofhRf1b2qweW/2ib+3z1ONIK9txuPKfwrPLKbEB5Md244zqKh3GR6QTjcvTjanxHn3d1q3PesXVsHD1UftR95xlj4yGA5ny1h5Re3SY4sehUYpaDjM/rJleJLFqGPNjPW7G88uBkAnRlYGdxZ4O2OzCYfXX9PKLaY3cwP22vBlQ3nqv+MufUoM0vPFmk7lgUnIVMaUEXz1P2ld5V/c70GtWHYV51iTvIXTv2LPf8KbuKv4hHu3FrJXqPhYvne6L7+1S3Xkrf/njcWXTQWyAbnN2mU/a7QLAl4ckCq2Uuv5FXDakGSRTP6rmMOArv7gB4Eudquc24ZV5081I4ZXxde9XQ3YGu6qz8sTwQnnG53sVT8VwJucqr6x/1kptjVVOUR5WbyrvTb44vx+bJhWo3HtVf7v0Ozu+wPYXT3bGf0sXtRcchMWr4dY4NcWcIO89Wb0zsrekpQleCu4ats9ioeJFwOxg7DVH5cQbGK/a8aKPcnVoiTqgccvwrnhjD+nv0H79eID53f+LJvhc32XXUOyxOlx/RjtWlyostODEX9VORyjf2bM4X/azu5OEuJYrPXZyfsj8xkCLW6OfQjDOyV5zOfZTtVX0dPjhaE+vs8ifqRn75Z1rO5qDCIcZUcVL56f5Urfh/pY8yN6sXe6dfEA//1PzqF52qgRgoWajQ525EFCSQ7PnuJljFGOM8IRTIhyJGtQhlfyjn3GBsKWECUQkHI11H4NhCoxadKldHmFTsFScRf7O/u/mneFPl113AnE/6bMHpxnkFN1Rv1Ruqr1xBR3aO7qn4HEF36nhKt3br6OLp8rYbTxfPSjfRXKj47y4l6gWA9SFboqqZfor/CNeqJ6o6ME3v8Fzx4oe76LiNkwck27JcwLtLhyuY1aLENk22sHTsWT6sYbqNyoSULTqOfdXgrkCpPBx+sdqqs865iP/yd0WAXP5VQ7HivGro3Xownuzm1R14bIFUfaIWiSu6gzBRcajnKF2rONsZDKo31P0u367wJMaAvro4X7YV3p241sxycK4WHRT3Lp6OjscZfBrPXd6rOqk54dYxcur3mdOLTmzgXBRG6Dxk8oBxBtWHxMKF7nk22FcDKHFY55k9a6Bo7xDCyStjW4kKq90di85qRudzclXbiDXC28Goyu+UMLl+uo2ehcdddLrnXIFRfndwYCJfib/qo+o+yqU72Nx6qAXN6YE7tTxrWu7fTt3jWdWfqj5sKVF1V3Wp9KlaYDo4ZL1F+o9mKPvZCc0lhYPjH/WX0xtZVxlnnLi7uvjBp9scipCoEdEZl7iosdxYq4HtLCl3LjrdgaEaUgmkqoE7eDoN4yxMlZCwBVGRXWHhDItl4/yGHf1l8UN+kP3CId+r+i2eUXHGPsq4Km4gIVZxKqFn8Tj5xhcgR0cQj1jOuV4V1yqRd/uV1T2eZzGxurj6iPhT6SJaTCIGiFcoduSn4ifS4Wjv8oH5YTqvfrJFgz/XvctPB0/3A4CqL4pt1VDpPNN2J99cr8w556W3ir3isP3/6JRO/pObnWXvCiSMoGywMaJcJborWEqAOn4QTnfjfKU2c2YQGASeR0BpgbqvIt49r/y79904XDv3uU/bvS1+9y3gaUA+2/PeVqDPBsTN8QzONwM87geBfwgB9YVhVy92z5+C0o3DtTsV164fVb9d//b5WXRsqMZwEBgEBoFB4CEE2FBXX6zd8D7T0uDG4tq5GDxhd6peW7H+BJpngDoKyzbXAAAAAElFTkSuQmCC';
		
		//console.log(path);
		
		var font_canvas = document.getElementById('B_font_canvas');
		var font_ctx = font_canvas.getContext('2d');
		
		
		image.res_font_obj = {};
		font_img.onload = function () {
			font_ctx.drawImage(font_img,0,0);
		
			/*
			//to transparent
			var temp_image_data = font_ctx.getImageData(0, 0, font_width * font_map.length, font_height);
			var temp_image_data_data = temp_image_data.data
			for (var i = 0; i < temp_image_data_data.length; i += 4) {
				if ((temp_image_data_data[i] + temp_image_data_data[i + 1] + temp_image_data_data[i + 2]) / 3 <= 128) {
					temp_image_data_data[i] = 0;
					temp_image_data_data[i + 1] = 0;
					temp_image_data_data[i + 2] = 0;
					temp_image_data_data[i + 3] = 255;
				}
				else {
					temp_image_data_data[i] = 255;
					temp_image_data_data[i + 1] = 255;
					temp_image_data_data[i + 2] = 255;
					temp_image_data_data[i + 3] = 0;
				}
			}
			font_ctx.putImageData(temp_image_data, 0, 0);
			*/
			image.converted = font_ctx.canvas.toDataURL();
			
			
			//font_ctx.drawImage(font_img, 0, 0);
			
			for (var i in font_map) {
				var image_data = font_ctx.getImageData(i * font_width, 0, font_width, font_height);
				image.res_font_obj[font_map[i]] = image_data;
				//console.log(i, "get", font_map[i], i * font_width, 0, font_width, font_height)
				
			}
			
			if (callback) {
				callback();
			}
		
		}
		//console.log(image.res_font_obj);
		
		//image.test_idata =  font_ctx.getImageData(0, 0, font_width * font_map.length, font_height);
		
		return image.res_font_obj;
	}
	
	image.getFontString= function (tgt_string, line_width) {
		if (image.font_string_canvas) {
			return image.font_string_canvas;
		}
		image.loadFont(function () {
			
			var font_string_canvas = document.getElementById('B_font_string_canvas') || B_Toolbox.createElement(document.body, 'canvas', 'B_font_string_canvas');
			//font_string_canvas.style.display = 'none';
			font_string_canvas.style.position = 'fixed';
			font_string_canvas.style.top = '300px';
			font_string_canvas.style.right = '0px';
			font_string_canvas.style.backgroundColor = '';//'#BBBBBB';
			font_string_canvas.style.order = 99;
			//image.res_font_obj;
			
			var str_length = tgt_string.length;
			var data_x = str_length < line_width ? str_length : line_width;
			var data_y = Math.floor(str_length / line_width + 1);
			B_Toolbox.setSize(font_string_canvas, data_x * font_width, data_y * font_height);
			
			console.log(data_y * font_height);
			
			var font_string_canvas = document.getElementById('B_font_string_canvas');
			var font_string_ctx = font_string_canvas.getContext('2d');
			
			for (var i in tgt_string) {
				var tgt_char = tgt_string[i];
				var tgt_x = i % line_width;
				var tgt_y = Math.floor(i / line_width);
				console.log(i, tgt_x, tgt_y);
				font_string_ctx.putImageData(image.res_font_obj[tgt_char], tgt_x * font_width, tgt_y * font_height);
			}
			image.font_string_canvas = font_string_canvas;
		});
		return image.font_string_canvas;
	}
	
	return image;
})()

