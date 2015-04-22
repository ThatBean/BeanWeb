//Bean's Fake Mouse for Good JS



Dr.Declare('OverlayMouse', 'class');
Dr.Implement('OverlayMouse', function (global, module_get) {
	var Module = function () {
		//
	};
	
	//Module.status = Dr.combine(ActorSlotPool.status, ActorState.status);
	Module.state_status = ActorState.status;
	Module.slot_status = ActorSlotPool.status;
	
	Module.prototype.init = function (owner) {
		this._owner = owner;
		this._state_data = {};	//map: tag - state, all available state
		this._slot_pool = ActorSlotPool.create();	//slot for state exclude (priority & slot)
		this._upper_slot_pool = null;
		this.reset();
	};
	
	Module.prototype.getSlotPool = function () { return this._slot_pool; };
	Module.prototype.setUpperSlotPool = function (upper_slot_pool) { this._upper_slot_pool = upper_slot_pool; };
	Module.prototype.getUpperSlotPool = function () { return this._upper_slot_pool; };
	
	return Module;
});











function quickSetElementSize(element, size_x, size_y) {
	element.style.width = element.style.minWidth = element.style.maxWidth = size_x + "px";
	element.style.height = element.style.minHeight = element.style.maxHeight = size_y + "px";
	element.width = size_x;
	element.height = size_y;
}
function quickCreateElement(eleParent,eleType,eleId,eleText) {
	var newEleNode = document.createElement(eleType);
	if (eleText) {
		var newEleText = document.createTextNode(eleText);
		newEleNode.appendChild(newEleText);
	}
	newEleNode.id = eleId;
	eleParent.appendChild(newEleNode);
}

function quickCreateCssText(config, config) {
	var css_text_array = [,
		'#Bean_Cursor {',
			'position:fixed; margin:0; padding:0;',
			'right:',config.CursorMargin+'px;',
			'bottom:',config.CursorMargin+'px;',
			'z-index:2090;',
			
			'font-size:',config.CursorFont+'px;',
			'line-height:',config.CursorRad+'px;',
			'font-weight:bold;',
			'text-align:center;',
			'color:#FFF;',
			
			'width:',config.CursorRad+'px;',
			'height:',config.CursorRad+'px;',
			//+'border:5px solid;',
			'border-radius:',config.CursorRad+'px;',
			'border-style:none;',
			
			'border:#427AC7;',
			'background-color: #5091E9;',
		'}',
		
		'#Bean_Cursor:hover {',
			'cursor:pointer;',
			'border:#427AC7;',
			'background-color:#436EEE;',
		'}',
		
		'#Bean_Cursor_bg {',
			'position:fixed; margin:0; padding:0;',
			'right:',(config.CursorMargin-(config.CursorBgRad-config.CursorRad)/2)+'px;',
			'bottom:',(config.CursorMargin-(config.CursorBgRad-config.CursorRad)/2)+'px;',
			'z-index:2080;',
			
			'font-size:',config.CursorBgFont+'px;',
			'line-height:',config.CursorBgRad+'px;',
			'font-weight:bold;',
			'text-align:center;',
			'color:#FFF;',
			
			'width:',config.CursorBgRad+'px;',
			'height:',config.CursorBgRad+'px;',
			'border-radius:',config.CursorBgRad+'px ',config.CursorBgRad+'px ',config.CursorBgRadR/*right corner*/+'px ',config.CursorBgRadL/*left corner*/+'px;',
			'border-style:none;',
			
			'background-color: #505050;',
		'}',
		
		'#Bean_Cursor_Marker {',
			'position:fixed; margin:0; padding:0;',
			'display:none;',
			'z-index:2100;',
			'width:',config.MarkerRad+'px;',
			'height:',config.MarkerRad+'px;',
			'border-radius:',config.MarkerRad+'px;',
			'border:',config.MarkerBorder+'px solid ',config.MarkerColor,';',
		'}',
		
		'#Bean_Menu {',
			'position:fixed; padding:0;',
			'display:none;',
			'z-index:2080;',
			'overflow-x:auto;',
			
			'font-size:',config.MenuFont+'px;',
			'line-height:',config.MenuFontHeight+'px;',
			'text-align:center;',
			'color:#FFF;',
			
			'left:50%;',
			'top:50%;',
			
			'filter:alpha(opacity=90);',
			'opacity:0.9;',
			
			'width:',config.MenuX+'px;',
			'height:',config.MenuY+'px;',
			'margin-left:',-config.MenuX/2+'px;',
			'margin-top:',-config.MenuY/2+'px;',
			
			'border-radius:',config.MenuRad+'px;',
			'border:',config.MenuBorder+'px solid ',config.MenuBorderColor,';',
			'background-color:',config.MenuBgColor,';',
		'}'
	];
	
	var css_text = css_text_array.join(' ');
	Dr.log(css_text);
	return css_text;
}


window.addEventListener('load',function(){
	var viewport_size = Dr.getViewportSize();
	
	//create CSS
	var config = {
		"CursorRad":80,
		"CursorFont":20,
		"CursorMargin":15,
		
		"CursorBgFont":18,
		"CursorBgRad":100,
		"CursorBgRadL":100,
		"CursorBgRadR":30,
		"CursorOffset":10,
		
		"MarkerRad":6,
		"MarkerOffset":5,
		"MarkerBorder":3,
		
		"MoveDet":20,
		
		"MenuX":Math.min(500, viewport_size.width * 0.8),
		"MenuY":Math.min(500, viewport_size.height * 0.8),
		"MenuRad":10,
		"MenuBorder":5,
		"MenuFont":20,
		"MenuFontHeight":30,
		
		//color
		
		"MarkerColor":"#FF0000",
		"MenuBorderColor":"#436EEE",
		"MenuBgColor":"#222222",
	};
	
	Dr.createStyle(quickCreateCssText(config, config));
	
	var body = Dr.getBody();
	//create Cursor Element
	quickCreateElement(body,"div","Bean_Cursor","MENU");
	quickCreateElement(body,"div","Bean_Cursor_bg","Bean's");
	quickCreateElement(body,"div","Bean_Cursor_Marker");
	//create Menu Element 
	quickCreateElement(body,"div","Bean_Menu");
	
	//the cursor offset
	var B_cursor = document.getElementById('Bean_Cursor');
	var B_marker = document.getElementById('Bean_Cursor_Marker');
	var B_cursor_bg = document.getElementById('Bean_Cursor_bg');
	var B_menu = document.getElementById('Bean_Menu');
	
	B_menu.innerHTML="<br /><b>Bean's Fake Mouse for Good</b>"
	+"<br />"
	+"<br />[To Click]<br />Drag&Release"
	+"<br />[To Cancel]<br />Drag&Drag Back&Release"
	+"<br />[To Menu]<br />Just Click(You know)"
	+"<br />"
	+"<br /><button>Exit</button>"
	+"<br />"
	+"<br />Mostly for Idea Showing<br />"
	+"<br /><b>ThatBean.com</b><sup>ver 6.0</sup>"
	+"<br />";
	
	var triggered=false;
	
	var B_cursor_width=config.CursorRad/2;
	var B_marker_width=config.MarkerRad/2;
	
																			//document.getElementById("pageinfo_1").innerHTML="page:"+pageinfo.pageX+"x"+pageinfo.pageY+" | win:"+pageinfo.winX+"x"+pageinfo.winY+" | DPR:"+window.devicePixelRatio+" | devDPI:"+screen.deviceXDPI+"/"+screen.deviceYDPI+" | logDPI:"+screen.logicalXDPI+"/"+screen.logicalYDPI;
																			//document.getElementById("pageinfo_2").innerHTML=navigator.userAgent;
	var B_cur_max_deg=0.1;
																			//document.getElementById("pageinfo_1").innerHTML+="|MX/MY:"+B_cur_max_X+"-"+B_cur_min_X+"|"+B_cur_max_Y+"-"+B_cur_min_Y+"|"+B_cursor_width;
	var R_offset=config.CursorOffset;
	var R_offset_M=B_cursor_width*Math.SQRT2+B_marker_width+config.MarkerOffset;
		
																			//document.getElementById("pageinfo_2").innerHTML+="|x/y org="+X_org+"|"+Y_org;
	var B_cur_max_X,
		B_cur_min_X,
		B_cur_max_Y,
		B_cur_min_Y,
		X_org,
		Y_org;
	
	function win_resize(){
		//get page size info
		viewport_size = Dr.getViewportSize();
		//B_cur_max_X=B_cursor.offsetLeft+B_cursor.offsetWidth-2*B_cursor_width;
		//B_cur_min_X=viewport_size.width-B_cur_max_X-2*B_cursor_width;
		//B_cur_max_Y=B_cursor.offsetTop+B_cursor.offsetWidth-2*B_cursor_width;
		//B_cur_min_Y=viewport_size.height-B_cur_max_Y-2*B_cursor_width;
		B_cur_max_X=B_cursor.offsetLeft+B_cursor_width;
		B_cur_min_X=viewport_size.width-B_cur_max_X-2*B_cursor_width;
		B_cur_max_Y=B_cursor.offsetTop+B_cursor.offsetWidth//-2*B_cursor_width;
		B_cur_min_Y=viewport_size.height-B_cur_max_Y//-2*B_cursor_width;
		X_org=B_cursor.offsetLeft+B_cursor.offsetWidth/2;
		Y_org=B_cursor.offsetTop+B_cursor.offsetHeight/2;
	}
	
	win_resize();
	//window.addEventListener('resize',win_resize,false);
	//window.addEventListener('orientationchange',win_resize,false);

	
	
	
	function cur_update(coors,mouseEvent){
		var tempA=Math.atan2((coors.y-Y_org),(coors.x-X_org));
		
		var R_offsetX=Math.cos(tempA);
		var R_offsetY=Math.sin(tempA);
		
		Dr.log(tempA, R_offsetX, R_offsetY);
		
		B_cursor.style.left=Math.min(Math.max(coors.x-B_cursor_width+R_offset*R_offsetX,B_cur_min_X),B_cur_max_X)+"px";
		B_cursor.style.top=Math.min(Math.max(coors.y-B_cursor_width+R_offset*R_offsetY,B_cur_min_Y),B_cur_max_Y)+"px";
		
		//B_marker
		B_marker.style.left=parseInt(B_cursor.style.left)+B_cursor_width-B_marker_width+R_offset_M*Math.cos(tempA)+"px";
		B_marker.style.top=parseInt(B_cursor.style.top)+B_cursor_width-B_marker_width+R_offset_M*Math.sin(tempA)+"px";
		
		if (mouseEvent && mouseEvent != "") {
			var type = mouseEvent;
			var view = Dr.window;
			var client_x = parseInt(B_marker.style.left)+B_marker_width;
			var client_y = parseInt(B_marker.style.top)+B_marker_width;
			
			B_marker.style.display="none";
			var element = Dr.getElementAtClient(view, client_x, client_y);
			B_marker.style.display="block";
			if (element) {
				Dr.simulateClientClick(type, element, view, client_x, client_y);
			}
		}
		Dr.setStyleTransformDegree(B_cursor,(tempA*180/Math.PI + 180 - 45));
	}
	
	var touch_orgX, touch_orgY;
	var away;
	function cur_draw(coors){
		event.preventDefault();
		event.stopPropagation();
		
		if (!triggered) {
			//set reigger
			triggered=true;
			//show && move
			win_resize();
			touch_orgX=coors.x;
			touch_orgY=coors.y;
			away=0;
		}
		//cur_update(coors,"");
		//cur_update(coors,"mouseover");
	}
	
	function cur_redraw(coors){
		//check "swipe"
		if (!triggered) return;
		event.preventDefault();
		event.stopPropagation();
		if ((touch_orgX-coors.x)<config.MoveDet && (touch_orgY-coors.y)<config.MoveDet) {
			B_marker.style.display="none";
			B_cursor.style.left="";//B_cursor_org_left;
			B_cursor.style.top="";//B_cursor_org_top;
			B_cursor.innerHTML=(away==1?"Cancel":"MENU");
			return;
		}
		else {
			away=1;
			B_cursor.innerHTML="Click";
		}
		//show && move
		B_marker.style.display="block";
		cur_update(coors,"");
		//cur_update(coors,"mouseover");
	}
	
	function cur_hide(coors){
		//clear trigger
		if (triggered) {
			event.preventDefault();
			event.stopPropagation();
			triggered=false;
			
			if (away==0) {
				//alert("Menu, please!");
				B_menu.style.display="block";
			}
			else {
				if ((touch_orgX-coors.x)<config.MoveDet && (touch_orgY-coors.y)<config.MoveDet) {
					//do nothing
				}
				else {
					cur_update(coors,"click");
				}
			}
			
			//clear
			B_marker.style.display="none";
			//B_cursor.style.display="block";
			//reset Cursor
			B_cursor.style.left="";//B_cursor_org_left;
			B_cursor.style.top="";//B_cursor_org_top;
			Dr.setStyleTransformDegree(B_cursor,0);
			B_cursor.innerHTML="MENU";
																			//document.getElementById("xycoordinates").innerHTML="try swipe/drag from the \"Cursor\" button";
		}
	}
	
	// create a drawer which tracks touch movements
	var Bean_cursorEventDispenser = {
		touchstart: cur_draw,
		mousedown: cur_draw,
		touchmove: cur_redraw,
		mousemove: cur_redraw,
		touchend: cur_hide,
		touchcancel: cur_hide,
		//mouseout: cur_hide,	//cause error...
		mouseup: cur_hide
	};
	// create a function to pass touch events and coordinates to drawer
	var lastX, lastY;
	function Bean_func_cursorEvent(event){
		// get the touch coordinates
																			//document.getElementById("pageinfo_2").innerHTML=event.type;
		var coors;
		if (event.type=="touchend" || event.type=="mouseup") {
			coors = {
				x: lastX,
				y: lastY
			}
		}
		else if (event.targetTouches) {
			coors = {
				x: event.targetTouches[0].clientX,
				y: event.targetTouches[0].clientY
			}
		}
		else {
			coors = {
				x: event.clientX,
				y: event.clientY
			}
		}
		// pass the coordinates to the appropriate handler
		lastX=coors.x;
		lastY=coors.y;
		if(!lastX && !lastY) ;//alert(event.type+" coor error "+event.target+"|"+event.currentTarget);
		else Bean_cursorEventDispenser[event.type](coors);
	}
	
	function Bean_func_menuEvent(event){
		event.preventDefault();
		event.stopPropagation();
		B_menu.style.display="none";
	}
	var body = Dr.getBody();
	// attach the touchstart, touchmove, touchend event listeners.
	B_cursor.addEventListener('touchstart',Bean_func_cursorEvent, false);
	body.addEventListener('touchmove',Bean_func_cursorEvent, false);
	body.addEventListener('touchend',Bean_func_cursorEvent, false);
	body.addEventListener('touchcancel',Bean_func_cursorEvent, false);
	
	B_cursor.addEventListener('mousedown',Bean_func_cursorEvent, false);
	body.addEventListener('mousemove',Bean_func_cursorEvent, false);
	body.addEventListener('mouseup',Bean_func_cursorEvent, false);
	//body.addEventListener('mouseout',Bean_func_cursorEvent, false);	//cause error...
	
	B_menu.addEventListener('click',Bean_func_menuEvent, false);
	B_menu.addEventListener('touchend',Bean_func_menuEvent, false);
	B_menu.addEventListener('mouseup',Bean_func_menuEvent, false);
},false);	// end window.onLoad

//test if multiple onload can be processed()stupid huh?
//window.addEventListener('load',function(){alert("Bean's Fake Mouse for Good loaded")},false);