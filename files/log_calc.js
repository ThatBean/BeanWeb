
var line_array = theClipBoardData.split('\n')

var start_time = Date.parse('4/17/2015 18:00:00') / 1000
var end_time = Date.parse('4/17/2015 23:59:00') / 1000
var target_cmd = 3;

var res = {};

for (var i in line_array) { 
	var match_res = line_array[i].match(/\[ (.+) \].*\"cmd\":(\d+).*\"userid\":\"(\d+)/); 
	
	if (match_res) {
		var time_string = match_res[1];
		var cmd = match_res[2];
		var user_id = match_res[3];
		
		var time_array = time_string.match(/(\d+)-(\d+)-(\d+) (\d+):(\d+):(\d+)/);
		if (!time_array) {
			alert("error time", time_array, time_string, match_res);
			console.log(time_array, time_string, match_res);
		}
		
		var year = time_array[1];
		var month = time_array[2];
		var day = time_array[3];
		var hour = time_array[4];
		var minute = time_array[5];
		var second = time_array[6];
		
		var time = Date.parse(([month, '/', day, '/', year, ' ', hour, ':', minute, ':', day]).join('')) / 1000;
		
		if(start_time <= time && end_time >= time && (target_cmd == cmd || (cmd == 32 && line_array[i].search('"step":100100')))) {
			//res.push([time, cmd, user_id]);
			res[user_id] = res[user_id] || {};
			res[user_id][time] = line_array[i];
			res[user_id][cmd] = true;
		}
	}
}


var id_list = [];
var id_map = {};

for (var i in res) {
	if (res[i][3] && res[i][32]) {
		id_list.push(i);
		id_map[i] = true;
	}
}


var id_list_1 = id_list;
var id_map_1 = id_map;



















var line_array = theClipBoardData.split('\n')

var start_time = Date.parse('4/18/2015 00:00:00') / 1000
var end_time = Date.parse('4/18/2015 23:59:00') / 1000

var res = {};

for (var i in line_array) { 
	var match_res = line_array[i].match(/\[ (.+) \].*\"cmd\":(\d+).*\"userid\":\"(\d+)/); 
	
	if (match_res) {
		var time_string = match_res[1];
		var cmd = match_res[2];
		var user_id = match_res[3];
		
		var time_array = time_string.match(/(\d+)-(\d+)-(\d+) (\d+):(\d+):(\d+)/);
		if (!time_array) {
			alert("error time", time_array, time_string, match_res);
			console.log(time_array, time_string, match_res);
		}
		
		var year = time_array[1];
		var month = time_array[2];
		var day = time_array[3];
		var hour = time_array[4];
		var minute = time_array[5];
		var second = time_array[6];
		
		var time = Date.parse(([month, '/', day, '/', year, ' ', hour, ':', minute, ':', day]).join('')) / 1000;
		
		if(start_time <= time && end_time >= time) {
			//res.push([time, cmd, user_id]);
			res[user_id] = res[user_id] || {};
			res[user_id][time] = line_array[i];
		}
	}
}


var id_list = [];
var id_map = {};

for (var i in res) {
	id_list.push(i);
	id_map[i] = true;
}

var id_list_2 = id_list;
var id_map_2 = id_map;





var id_list_3 = [];
for (var i in id_list_1) {
	var user_id = id_list_1[i];
	
	if (id_map_2[user_id]) {
		id_list_3.push(user_id);
	}
}


