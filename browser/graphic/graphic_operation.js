Dr.Declare('GraphicOperation', 'class');
Dr.Implement('GraphicOperation', function (global, module_get) {
	
	var Module = function () {
		//
	}
	
	Module.type = {
		IMAGE_ELEMENT: 'IMAGE_ELEMENT',	//fast, but not editable
		CANVAS_ELEMENT: 'CANVAS_ELEMENT',	//fast, with vector graph edit API(recommend to use)
		CANVAS_IMAGE_DATA: 'CANVAS_IMAGE_DATA',	//slow, but with pixel manipulation
	}
	
	Module.getQuickCanvas = function () {
		Module._quick_canvas = Module._quick_canvas || document.createElement('canvas');
		return Module._quick_canvas;
	}
	Module.getQuickContext = function () {
		Module._quick_context = Module._quick_context || Module.getQuickCanvas().getContext("2d");
		return Module._quick_context;
	}
	
	Module.createData = function  (type, width, height) {
		var data;
		switch (type) {
			case Module.type.IMAGE_ELEMENT: 
				data = Dr.document.createElement('img');
				break;
			case Module.type.CANVAS_ELEMENT: 
				data = Dr.document.createElement('canvas');
				break;
			case Module.type.CANVAS_IMAGE_DATA: 
				data = Module.getQuickContext().createImageData(width, height);
				break;
			default:
				Dr.log('[GraphicOperation][createData] error type:', type, 'canvas used instead');
				data = document.createElement('canvas');
				break;
		}
		data.width = width;
		data.height = height;
		return data;
	}
	
	//transform type
	Module.imageToCanvas = function (image_element) {
		var canvas_element = Dr.document.createElement('canvas');
		canvas_element.width = image_element.width;
		canvas_element.height = image_element.height;
		canvas_element.getContext('2d').drawImage(image_element, 0, 0);
		return canvas_element;
	}
	Module.canvasImageDataToCanvas = function (canvas_image_data) {
		var canvas_element = Dr.document.createElement('canvas');
		canvas_element.width = canvas_image_data.width;
		canvas_element.height = canvas_image_data.height;
		canvas_element.getContext('2d').putImageData(canvas_image_data, 0, 0);
		return canvas_element;
	}
	Module.canvasToCanvasImageData = function (canvas_element) {
		return canvas_element.getContext('2d').getImageData(0, 0, canvas_element.width, canvas_element.height);
	}
	Module.imageToCanvasImageData = function (image_element) {
		return Module.canvasToCanvasImageData(Module.imageToCanvas(image_element));
	}
	
	
	Module.scaleCanvas = function (canvas_element, scale_x, scale_y) {
		var scale_y = scale_y || scale_x;
		Dr.debug(5, 'scale:', scale_x, scale_y);
		
		if (canvas_element.width == 0 || canvas_element.height == 0) {
			//nothing to process
			canvas_element.width *= scale_x;
			canvas_element.height *= scale_y;
			return canvas_element;
		}
		
		var source_image_data = Module.canvasToCanvasImageData(canvas_element);
		var scaled_image_data = Module.scaleImageData(source_image_data, scale_x, scale_y);
		
		canvas_element.width = scaled_image_data.width;
		canvas_element.height = scaled_image_data.height;
		canvas_element.getContext('2d').putImageData(scaled_image_data, 0, 0); //put back
		
		return canvas_element;
	}
	
	Module.scaleImageData = function (image_data, scale_x, scale_y) {
		var scale_y = scale_y || scale_x;
		
		//get source
		var source_image_data = image_data;
		var source_pixel_array = source_image_data.data;
		var source_pixel_width = source_image_data.width;
		Dr.debug(5, 'source_image_data size:', source_image_data.width, source_image_data.height);
		
		//get target
		var target_image_data = Module.getQuickContext().getImageData(0, 0, source_image_data.width * scale_x, source_image_data.height * scale_y);
		var target_pixel_array = target_image_data.data;
		var target_pixel_width = target_image_data.width;
		Dr.debug(5, 'target_image_data size:', target_image_data.width, target_image_data.height);
		
		var target_pixel_count = target_image_data.width * target_image_data.height;
		for (var target_pixel_index = 0; target_pixel_index < target_pixel_count; target_pixel_index++) {
			var target_x = target_pixel_index % target_pixel_width;
			var target_y = Math.floor(target_pixel_index / target_pixel_width);
			
			var source_x = Math.floor(target_x / scale_x);
			var source_y = Math.floor(target_y / scale_y);
			
			var target_pixel_array_index = target_pixel_index * 4;
			var source_pixel_array_index = (source_x + source_y * source_pixel_width) * 4;
			
			target_pixel_array[target_pixel_array_index] = source_pixel_array[source_pixel_array_index];
			target_pixel_array[target_pixel_array_index + 1] = source_pixel_array[source_pixel_array_index + 1];
			target_pixel_array[target_pixel_array_index + 2] = source_pixel_array[source_pixel_array_index + 2];
			target_pixel_array[target_pixel_array_index + 3] = source_pixel_array[source_pixel_array_index + 3];
		}
		
		return target_image_data;
	}
	
	Module.cropCanvas = function (canvas_element, crop_func) {
		//get source
		var source_image_data = canvas_element.getContext('2d').getImageData(0, 0, canvas_element.width, canvas_element.height);
		var source_pixel_array = source_image_data.data;
		
		Dr.debug(5, '[crop] size before', canvas_element.width, canvas_element.height);
		
		var x_min = canvas_element.width - 1;
		var x_max = 0;
		var y_min = canvas_element.height - 1;
		var y_max = 0;
		
		for (var y = 0; y < canvas_element.height; y++) {
			for (var x = 0; x < canvas_element.width; x++) {
				var index = (y * canvas_element.width + x) * 4;
				var is_crop = crop_func(
					source_pixel_array[index], 
					source_pixel_array[index + 1], 
					source_pixel_array[index + 2], 
					source_pixel_array[index + 3]);
				if (!is_crop) {
					//Dr.log('[crop] check');
					x_min = Math.min(x_min, x);
					x_max = Math.max(x_max, x);
					y_min = Math.min(y_min, y);
					y_max = Math.max(y_max, y);
				}
			}
		}
		
		Dr.debug(5, '[crop] size result', x_min, y_min, x_max - x_min, y_max - y_min);
		
		if (x_max == 0 && y_max == 0) return canvas_element;	//nothing changed
		
		//resize
		canvas_element.width = x_max - x_min + 1;
		canvas_element.height = y_max - y_min + 1;
		Dr.debug(5, '[crop] size after', canvas_element.width, canvas_element.height);
		
		//context.putImageData(imgData,x,y,dirtyX,dirtyY,dirtyWidth,dirtyHeight);
		canvas_element.getContext('2d').putImageData(source_image_data, 0 - x_min, 0 - y_min, x_min, y_min, x_max - x_min + 1, y_max - y_min + 1);
		
		return canvas_element;
	};
	
	
	
	
	
	
	
	
	
	
	
	
	
	Module.getPixelColor = function (image_data, x, y) {
		var index = x + y * image_data.width;
		var index4 = index * 4;
		var data = image_data.data;
		
		return {
			r: data[index4],
			g: data[index4 + 1],
			b: data[index4 + 2],
			a: data[index4 + 3],
		}
	};
	
	Module.drawPixel = function (image_data, x, y, color) {
		var index = x + y * image_data.width;
		var index4 = index * 4;
		var data = image_data.data;
		
		data[index4] = color.r;
		data[index4 + 1] = color.g;
		data[index4 + 2] = color.b;
		data[index4 + 3] = color.a;
	};
	
	Module.drawPixelLine = function (image_data, point0, point1, color) {
		var x0 = Math.round(point0.x);
		var y0 = Math.round(point0.y);
		//var z0 = point0.z;
		
		var x1 = Math.round(point1.x);
		var y1 = Math.round(point1.y);
		//var z1 = point1.z;
		
		var dx = Math.abs(x1 - x0);
		var dy = Math.abs(y1 - y0);
		//var dz = Math.abs(z1 - z0) / Math.sqrt(dx*dx + dy*dy);
		
		var sx = (x0 < x1) ? 1 : -1;
		var sy = (y0 < y1) ? 1 : -1;
		//var sz = (z0 < z1) ? dz : -dz;
		
		var err = dx - dy;
		
		while(true) {
			Module.drawPixel(image_data, x0, y0, color);
			//this.drawPoint4(x0, y0, z0, color);
			if((x0 == x1) && (y0 == y1)) break;
			var e2 = 2 * err;
			if(e2 > -dy) { err -= dy; x0 += sx; }
			if(e2 < dx) { err += dx; y0 += sy; }
			//z0 += sz;
		}
	};
	
	Module.drawPixelLineList = function (image_data, point_list, color, is_loop) {
		Dr.assert(point_list.length >= 2, '[drawPixelLineList] check length');
		
		var from_point;
		var point_index;
		
		if (is_loop) {
			from_point = point_list[point_list.length - 1];
			point_index = 0;
		}
		else {
			from_point = point_list[0];
			point_index = 1;
		}
		
		while(point_index < point_list.length) {
			Module.drawPixelLine(image_data, from_point, point_list[point_index], color)
			from_point = point_list[point_index];
			point_index++;
		}
	};
	
	Module.floodFill = function (image_data, start_point, fill_color) {
		start_point.x = Math.round(start_point.x);
		start_point.y = Math.round(start_point.y);
		
		var width = image_data.width;
		var height = image_data.height;
		var data = image_data.data;
		var from_color = Module.getPixelColor(image_data, start_point.x, start_point.y);
		var to_color = fill_color;
		
		var mark_point_array = [];
		
		var put_color = function (x, y, color) {
			var index = (y * width + x) * 4;
			data[index] = color.r;
			data[index + 1] = color.g;
			data[index + 2] = color.b;
			data[index + 3] = color.a;
		}
		
		var check_color = function (x, y, color) {
			var index = (y * width + x) * 4;
			return data[index] == color.r
				&& data[index + 1] == color.g
				&& data[index + 2] == color.b
				&& data[index + 3] == color.a;
		}
		
		var combo_push = function (x_left, x_right, check_y) {
			var check_x = x_left + 1;
			var is_combo = false;
			while(check_x < x_right) {
				if (check_color(check_x, check_y, from_color)) {
					if (!is_combo) {
						is_combo = true;
						mark_point_array.push({x:check_x, y:check_y});
					}
				}
				else {
					is_combo = false;
				}
				check_x++;
			}
		}
		
		//check initial point
		if (!check_color(start_point.x, start_point.y, to_color)) mark_point_array.push(start_point);
		else return;
		
		//stack loop
		while(mark_point_array.length) {	//loop marked points
			var init_point = mark_point_array.pop();
			
			var x_left = init_point.x - 1;
			var x_right = init_point.x + 1;
			
			var current_y = init_point.y;
			
			if (check_color(init_point.x, init_point.y, from_color)) {
				//paint current point
				put_color(init_point.x, init_point.y, to_color);
				
				//left expand
				while(x_left >= 0 && check_color(x_left, current_y, from_color)) {
					put_color(x_left, current_y, to_color);
					x_left--;
				}
				//right expand
				while(x_right < width && check_color(x_right, current_y, from_color)) {
					put_color(x_right, current_y, to_color);
					x_right++;
				}
				
				//up check
				if (current_y - 1 >= 0) combo_push(x_left, x_right, current_y - 1);
				//down check
				if (current_y + 1 < height) combo_push(x_left, x_right, current_y + 1);
			}
		}
	};
	
	Module.replaceColor = function (image_data, replacer_func) {
		var data = image_data.data;
		
		for (var y = 0; y < image_data.height; y++) {
			for (var x = 0; x < image_data.width; x++) {
				var index = (y * image_data.width + x) * 4;
				var replace_color = replacer_func(
					data[index], 
					data[index + 1], 
					data[index + 2], 
					data[index + 3]);
				
				if (replace_color) {
					//Dr.log('[replaceColor] check');
					data[index] = replace_color.r;
					data[index + 1] = replace_color.g;
					data[index + 2] = replace_color.b;
					data[index + 3] = replace_color.a;
				}
			}
		}
	};
	
	return Module;
});