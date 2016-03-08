/*
	This implements pixel model hierarchy(tree) in PixCor,
	a basic 'PixelObject'
	
	This is packs graphical data & method for physics, animation, and game logic
	
	This will not be used directly in game,
	need to pack at least once more (for actor/world/ui)
*/


Dr.Declare('PixelModel', 'class');
Dr.Require('PixelModel', 'DataTreeNode');
Dr.Require('PixelModel', 'Vector3');
Dr.Require('PixelModel', 'Rotate4');
Dr.Require('PixelModel', 'PixelPart');
Dr.Implement('PixelModel', function (global, module_get) {
	
	var DataTreeNode = Dr.Get('DataTreeNode');	//for loop and lookup
	var Vector3 = Dr.Get('Vector3');	//for position
	var Rotate4 = Dr.Get('Rotate4');	//for rotation
	var PixelPart = Dr.Get('PixelPart');
	
	var Module = function () {
		this.proto.call(this);
		
		this.id = Dr.generateId();
		
		this.position = new Vector3();
		this.rotation = new Rotate4();
		
		this.parts = {};	//PixelPart map
		
		//motion will be applied from outside
	}
	
	//inherit method
	Module.prototype = Object.create(DataTreeNode.prototype);
	Module.prototype.proto = DataTreeNode;
	
	//add method
	Module.prototype.getId = function () {
		return this.id;
	};
	
	Module.prototype.getRenderPixelPartMap = function () {
		return this.parts;
	};
	
	
	
	
	
	
	//data related
	/*
		sample_pixel_model_data = {
			'XYZ' : [0, 0, 0],
			'XYZR' : [0, 0, 0, 0],
			'pixel_part_list' : [
				<pixel_part_data>,	//check in PixelPart
				<pixel_part_data>,	//check in PixelPart
				<pixel_part_data>,	//check in PixelPart
			],
		}
	*/
	
	Module.prototype.applyData = function (pixel_model_data) {
		//data apply logic
		this.position = Vector3.FromArray(pixel_model_data.XYZ);
		this.rotation = Rotate4.FromArray(pixel_model_data.XYZR);
		
		this.parts = {};
		for (var index in pixel_model_data.pixel_part_list) {
			var pixel_part = PixelPart.loadData(pixel_model_data.pixel_part_list[index]);
			this.parts[pixel_part.name] = pixel_part;
		}
	};
	
	
	Module.loadData = function (pixel_model_data, loaded_pixel_model) {
		var loaded_pixel_model = loaded_pixel_model || new Module();
		
		loaded_pixel_model.applyData(pixel_model_data);
		
		return loaded_pixel_model;
	};
	
	
	return Module;
});