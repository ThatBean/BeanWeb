// Tree
// merge multiple accessible image holder class
// provide common operation function

Dr.Declare('GraphicNode2D', 'class');
Dr.Require('GraphicNode2D', 'DataTreeNode');
Dr.Require('GraphicNode2D', 'EventProto');
Dr.Require('GraphicNode2D', 'ImageDataExt');
Dr.Implement('GraphicNode2D', function (global, module_get) {
	
	var ImageDataExt = Dr.Get('ImageDataExt');
	var DataTreeNode = Dr.Get('DataTreeNode');
	
	var Module = function () {
		//
	}
	
	Module.type = {
		UPDATE: "UPDATE",
	};
	
	Module.proto = DataTreeNode;
	Module.prototype = new DataTreeNode;
	Module.prototype.proto_init = DataTreeNode.prototype.init;
	
	Module.prototype.init = function (width, height) {
		this.proto_init();
		
		//ImageDataExt
		this._data = ImageDataExt.create(ImageDataExt.type.CANVAS_ELEMENT, width, height);
		
		//EventProto
		this._event_center = event_center || Dr.GetNew('EventProto');
		
		//position
		this._position = {
			x: 0, 
			y: 0,
		};
	}
	
	
	Module.prototype.getEventCenter = function () { return this._event_center; }
	Module.prototype.getImageDataExt = function () { return this._data; }
	
	Module.prototype.update = function (delta_time) {
		this._event_center.emit(UPDATE);
		
		traverseDirectChild(function (child_node) {
			child_node.update(delta_time);
		});
	}
	
	Module.prototype.onAction = function (event_key, action, action_data) {
		this._event_center.emit(event_key, action, action_data);
		
		traverseDirectChild(function (child_node) {
			child_node.onAction(event_key, action, action_data);
		});
	}
	
	return Module;
});