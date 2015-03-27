//Module utility
//display the Module or step to record
Dr.Declare('BitmapFont', 'class');
Dr.Implement('BitmapFont', function (global, module_get) {
	var Module = function (output_func) {
		var font_map = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';
		var font_width = 6;
		var font_height = 13;
		var font_src_image = 'BeanFont.png';
		
		this.font_data = {
			font_map: "ABC",
			font_width: 5,
			font_height: 5,
			
			font_src:{
				image: 'font.png',
				data: 'data:image/png;base64,iVBORw0K',
			},
		}
		
		this.font_canvas = Dr.createOffscreenCanvas(width, height);
		this.font_canvas.toDataURL();
	}
	Module.prototype.Module = function (output_func) {
		var step = this.step();
		//record tag, so you don't need to set it next time
		if (output_func) this.output_func = output_func;
		//get average
		var totalValues = 0;
		for (var i = 0; i < this.List.length; i++) totalValues += this.List[i];
		var averageModule = totalValues / this.List.length;
		//display
		if (this.output_func) this.output_func(averageModule, this.List[0]);
		return step;
	}
	Module.prototype.step = function () {
		//get step
		var now = Dr.now();
		var step = (now - this.lastTime);
		this.lastTime = now;
		//get stepModule
		var stepModule = 1000 / step;
		//save to list
		this.List.unshift(stepModule);
		if (this.List.length > this.listMax) this.List.length = this.listMax;
		return step;
	}
	return Module;
});