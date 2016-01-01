/*
	This implements the most basic data/method for visible pixel shapes in PixCor,
	packed and managed under PixelModel for common 'PixelObject'
	
	This is more of a data holder & method provider for 3d pixel visible,
	higher operation and hierarchy will be found in PixelModel
	
	This will be used for motion with bone
*/



// a pixel/block/square simple data
Dr.Declare('PixelPixel', 'class');
Dr.Require('PixelPixel', 'Vector3');
Dr.Require('PixelPixel', 'Color4');
Dr.Implement('PixelPixel', function (global, module_get) {
	
	var Vector3 = Dr.Get('Vector3');	//for position
	var Color4 = Dr.Get('Color4');	//for color
	
	var Module = function () {
		this.position = new Vector3();
		this.color = new Color4();
		// this.visible = true;
	}
	
	
	
	
	//data related
	/*
		sample_pixel_pixel_data = {
			'XYZ' : [0, 0, 0],
			'RGBA' : [0, 0, 0, 0],
		}
	*/
	
	Module.prototype.applyData = function (pixel_pixel_data) {
		//data apply logic
		this.position = Vector3.FromArray(pixel_pixel_data.XYZ);
		this.color = Color4.FromArray(pixel_pixel_data.RGBA);
	};
	
	
	Module.loadData = function (pixel_pixel_data, loaded_pixel_pixel) {
		var loaded_pixel_pixel = loaded_pixel_pixel || new Module();
		
		loaded_pixel_pixel.applyData(pixel_pixel_data);
		
		return loaded_pixel_pixel;
	};
	
	
	
	
	return Module;
});





Dr.Declare('PixelPart', 'class');
Dr.Require('PixelPart', 'Vector3');
Dr.Require('PixelPart', 'Rotate4');
Dr.Require('PixelPart', 'PixelPixel');
Dr.Implement('PixelPart', function (global, module_get) {
	
	var Vector3 = Dr.Get('Vector3');	//for position
	var Rotate4 = Dr.Get('Rotate4');	//for rotation
	var PixelPixel = Dr.Get('PixelPixel');	//
	
	var Module = function () {
		this.position = new Vector3();
		this.rotation = new Rotate4();
		
		this.name = '';	//PixelPart NAME
		this.pixels = [];	//PixelPixel list
		
		this.render_method = null;	//default = null(pixel), can set as block, block-frame a
	}
	
	Module.prototype.getId = function () {
		return this.id;
	};
	
	
	
	
	//data related
	/*
		sample_pixel_part_data = {
			'NAME' : "A",	//string, for PixelBone attaching
			'XYZ' : [0, 0, 0],
			'XYZR' : [0, 0, 0, 0],
			'pixel_pixel_list' : [
				<pixel_pixel_data>,	//check in PixelPixel
				<pixel_pixel_data>,	//check in PixelPixel
				<pixel_pixel_data>,	//check in PixelPixel
			],
		}
	*/
	
	Module.prototype.applyData = function (pixel_part_data) {
		//data apply logic
		this.name = pixel_part_data.NAME;
		this.position = Vector3.FromArray(pixel_part_data.XYZ);
		this.rotation = Rotate4.FromArray(pixel_part_data.XYZR);
		
		this.pixels = [];
		for (var index in pixel_part_data.pixel_pixel_list) {
			this.pixels.push(PixelPixel.loadData(pixel_part_data.pixel_pixel_list[index]));
		}
	};
	
	
	Module.loadData = function (pixel_part_data, loaded_pixel_part) {
		var loaded_pixel_part = loaded_pixel_part || new Module();
		
		loaded_pixel_part.applyData(pixel_part_data);
		
		return loaded_pixel_part;
	};
	
	
	
	return Module;
});