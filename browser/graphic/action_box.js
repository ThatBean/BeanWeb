var sample_box_data = {
	x: 0,
	y: 0,
	width: 0,
	height: 0,
	z: 0,
	//callback: function (box_data) {};	//you can add
	box_tag: 'tag',
}


Dr.Declare('ActionBox', 'class');
Dr.Implement('ActionBox', function (global, module_get) {
	
	var Module = function () {
		this.box_list = [];
	}
	
	Module.prototype.addBox = function (box_tag, box_data) {
		var box_tag = box_tag || this.box_list.length;
		this.box_list.box_tag = this.box_list.box_tag || box_tag;
		this.box_list[box_tag] = box_data;
	};
	
	Module.prototype.removeBox = function (box_tag) {
		this.box_list[box_tag] = null;
	};
	
	Module.prototype.removeAllBox = function () {
		this.box_list = [];
	};
	
	Module.prototype.testPoint = function (position) {
		var res_box_list;
		var max_z = Number.NEGATIVE_INFINITY;
		for (var box_tag in this.box_list) {
			var box_data = this.box_list[box_tag];
			if (
				position.x >= box_data.x
				&& position.y >= box_data.y
				&& position.x <= box_data.width
				&& position.y <= box_data.height
			) {
				if (max_z < box_data.z) {
					res_box_list = [];	//clear previous
					max_z = box_data.z; 
				}
				res_box_list.push(box_data);
			}
		}
		return res_box_list;
	};
	
	return Module;
});

	
	
var ActionBoxTestFunc = function () {
	var box_data_a= {
		x: 0,
		y: 0,
		width: 10,
		height: 10,
		z: 0,
		//callback: function (box_data) {};	//you can add
		box_tag: 'tag_a',
	}
	var box_data_b = {
		x: 10,
		y: 10,
		width: 10,
		height: 10,
		z: 0,
		//callback: function (box_data) {};	//you can add
		box_tag: 'tag_b',
	}
	var box_data_c = {
		x: 10,
		y: 10,
		width: 10,
		height: 10,
		z: 10,
		//callback: function (box_data) {};	//you can add
		box_tag: 'tag_c',
	}
	
	var ActionBox = Dr.Get('ActionBox');
	var action_box = new ActionBox;
	
	action_box.addBox('tag_a', box_data_a);
	Dr.log('nothing at (-1, 5)', action_box.testPoint({x: -1, y: 5}));
	Dr.log('tag_a at (5, 5)', action_box.testPoint({x: 5, y: 5}));
	Dr.log('tag_a at (10, 10)', action_box.testPoint({x: 10, y: 10}));
	action_box.addBox('tag_b', box_data_b);
	Dr.log('nothing at (-1, 5)', action_box.testPoint({x: -1, y: 5}));
	Dr.log('tag_a at (5, 5)', action_box.testPoint({x: 5, y: 5}));
	Dr.log('tag_a, tag_b at (10, 10)', action_box.testPoint({x: 10, y: 10}));
	action_box.addBox('tag_c', box_data_c);
	Dr.log('nothing at (-1, 5)', action_box.testPoint({x: -1, y: 5}));
	Dr.log('tag_a at (5, 5)', action_box.testPoint({x: 5, y: 5}));
	Dr.log('tag_a, tag_b, tag_c at (10, 10), but tag_c has max z', action_box.testPoint({x: 10, y: 10}));
};
		