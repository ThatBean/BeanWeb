Dr.Declare('DataTreeNode', 'class');
Dr.Implement('DataTreeNode', function (global, module_get) {
	
	var Module = function () {
		//
	}
	
	Module.prototype.init = function () {
		this.parent = null;
		this.children = [];
	};
	
	Module.prototype.setParent = function (node) {
		this.parent = node;
		
		//event
	};
	
	Module.prototype.getParent = function () {
		return this.parent;
	};
	
	Module.prototype.addChild = function (node, id) {
		node.id = id || node.id || Dr.generateId();
		
		this.removeChildById(node.id);
		
		this.children[node.id] = node;
		node.setParent(this);
	};
	
	Module.prototype.removeChildById = function (id) {
		var node = this.children[id];
		
		if (node) {
			node.setParent(null);
			this.children[id] = null;
			
			//event
		}
	};
	
	Module.prototype.removeChild = function (node) {
		for (var id in this.children) {
			if (node == this.children[id]) {
				this.removeChildById(id);
				//break;	//will not break for multi remove
			}
		}
	};
	
	Module.prototype.removeChildByProperty = function (property, target_value) {
		for (var id in this.children) {
			if (this.children[id][property] == target_value) {
				this.removeChildById(id);
				//break;	//will not break for multi remove
			}
		}
	};
	
	Module.prototype.traverseDirectChild = function (callback) {
		for (var i = 0, l = this.children.length; i < l; i ++) {
			callback(this.children[i]);
		}
	};
	
	Module.prototype.traverseDown = function (callback) {
		callback(this);	//self included
		
		for (var i = 0, l = this.children.length; i < l; i ++) {
			this.children[i].traverseDown(callback);
		}
	};
	
	Module.prototype.traverseUp = function (callback) {
		if (this.parent) {
			callback(this.parent);	//self not included
			
			this.parent.traverseUp(callback);
		}
	};
	
	return Module;
});