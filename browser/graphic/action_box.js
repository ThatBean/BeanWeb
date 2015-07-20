var sample_box_data = {
	x: 0, y: 0,	//top left origin
	width: 0, height: 0,	//size
	z: 0,
	//callback: function (box_data) {};	//you can add
	
	//generated
	//box_tag: 'tag',
	//x_max, y_max,	//bottom right origin
}


Dr.Declare('ActionBox', 'class');
Dr.Implement('ActionBox', function (global, module_get) {
	
	var Module = function () {
		this.box_list = [];
	}
	
	Module.prototype.addBox = function (box_tag, box_data) {
		var box_tag = box_tag || this.box_list.length;
		box_data.box_tag = box_tag;
		box_data.x_max = box_data.x + box_data.width;
		box_data.y_max = box_data.y + box_data.height;
		this.box_list[box_tag] = box_data;
	};
	
	Module.prototype.removeBox = function (box_tag) {
		this.box_list[box_tag] = null;
	};
	
	Module.prototype.removeAllBox = function () {
		this.box_list = [];
	};
	
	Module.prototype.checkPoint = function (point) {
		var res_box_list;
		var max_z = Number.NEGATIVE_INFINITY;
		for (var box_tag in this.box_list) {
			var box_data = this.box_list[box_tag];
			if (
				point.x >= box_data.x
				&& point.y >= box_data.y
				&& point.x <= box_data.x_max
				&& point.y <= box_data.y_max
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
	
	Module.prototype.checkAction = function (action) {
		if (action.position_listener) {
			var res_box_list = this.checkPoint(action.position_listener);
			for (var index in res_box_list) {
				var box_data = res_box_list[index];
				if (box_data.callback) box_data.callback(action, {
					x: action.position_listener.x - box_data.x, 
					y: action.position_listener.y - box_data.y,
				});
			}
		}
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
	Dr.log('nothing at (-1, 5)', action_box.checkPoint({x: -1, y: 5}));
	Dr.log('tag_a at (5, 5)', action_box.checkPoint({x: 5, y: 5}));
	Dr.log('tag_a at (10, 10)', action_box.checkPoint({x: 10, y: 10}));
	action_box.addBox('tag_b', box_data_b);
	Dr.log('nothing at (-1, 5)', action_box.checkPoint({x: -1, y: 5}));
	Dr.log('tag_a at (5, 5)', action_box.checkPoint({x: 5, y: 5}));
	Dr.log('tag_a, tag_b at (10, 10)', action_box.checkPoint({x: 10, y: 10}));
	action_box.addBox('tag_c', box_data_c);
	Dr.log('nothing at (-1, 5)', action_box.checkPoint({x: -1, y: 5}));
	Dr.log('tag_a at (5, 5)', action_box.checkPoint({x: 5, y: 5}));
	Dr.log('tag_a, tag_b, tag_c at (10, 10), but tag_c has max z', action_box.checkPoint({x: 10, y: 10}));
};
		