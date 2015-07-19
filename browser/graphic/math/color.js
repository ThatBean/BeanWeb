Dr.Declare('Color4', 'class');
Dr.Implement('Color4', function (global, module_get) {
	
	var Module = function (r, g, b, a) {
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
	}
	
	Module.prototype.toString = function () {
		return "{R: " + this.r 
			+ " G:" + this.g 
			+ " B:" + this.b 
			+ " A:" + this.a + "}";
	};
	Module.prototype.toArray = function () {
		return [this.r, this.g, this.b, this.a];
	};
	Module.prototype.copy = function () {
		return new Module(this.r, this.g, this.b, this.a);
	};
	
	Module.FromArray = function (array, offset) {
		if (!offset) {
			offset = 0;
		}
		return new Module(array[offset], array[offset + 1], array[offset + 2], array[offset + 3]);
	};
	Module.Random = function Random (alpha) {
		var a = (alpha ? alpha : Math.random());
		return new Module(Math.random(), Math.random(), Math.random(), a);
	};
	Module.Blend = function Blend (base_color, apply_color) {
		var r, g, b, a;
		var aa = apply_color.a;
		//normal blend
		r = base_color.r * (1 - aa) + apply_color.r * aa;
		g = base_color.g * (1 - aa) + apply_color.g * aa;
		b = base_color.b * (1 - aa) + apply_color.b * aa;
		a = 1 - (1 - base_color.a) * (1 - aa);
		return new Module(r, g, b, a);
	};
	Module.MethodBlend = function MethodBlend (base_color, apply_color, method, intensity) {
		var r, g, b, a;
		var ba = base_color.a;
		var aa = apply_color.a;
		//blend
		if (method == "L") {	//lighting
			if (intensity <= 0) {	//no need to blend
				return new Module(base_color.r, base_color.g, base_color.b, base_color.a);
			}
			if (intensity > 1) {
				Dr.log("[MethodBlend|warning] intensity > 1 | intensity = "+intensity);
				intensity = 1;
			}//aa = (apply_color.r + apply_color.g + apply_color.b) / 255 / 3 * aa * intensity;
			aa *= intensity;
			r = Math.max(base_color.r * ba, apply_color.r * aa);
			g = Math.max(base_color.g * ba, apply_color.g * aa);
			b = Math.max(base_color.b * ba, apply_color.b * aa);
			a = 1 - (1 - ba) * (1 - aa);
		}
		
		if (method == "F") {	//face + lighting
			/*
			r = base_color.r * (1 - apply_color.r) * aa;
			g = base_color.g * (1 - apply_color.g) * aa;
			b = base_color.b * (1 - apply_color.b) * aa;
			*/
			aa = aa / (aa + ba);
			r = base_color.r * (1 - aa) + (apply_color.r * aa);
			g = base_color.g * (1 - aa) + (apply_color.g * aa);
			b = base_color.b * (1 - aa) + (apply_color.b * aa);
			a = ba;
		}
		
		/*
		Dr.log("Method:"+method+"<br />"
		+"intensity:"+intensity+"<br />"
		+"Base:"+base_color+"<br />"
		+"Apply:"+apply_color+"<br />"
		+"Get:"+new Module(r, g, b, a)+"<br />");
		*/
		
		return new Module(r, g, b, a);
	};
	
	return Module;
});
