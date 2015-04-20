//Bean's Fake Mouse for Good JS


function B_func_setDegree(){
	var key_transform;
	// will init upon first call
	return function (element, rotate_degree) {
		if (!key_transform) {
			if (element.style.webkitTransform != null) key_transform = 'webkitTransform';
			if (element.style.MozTransform != null) key_transform = 'MozTransform';
			if (element.style.msTransform != null) key_transform = 'msTransform';
			if (element.style.OTransform != null) key_transform = 'OTransform';
			if (element.style.transform != null) key_transform = 'transform';
		}
		element.style[key_transform] = 'rotate(' + rotate_degree + 'deg)';
	}
}

function B_func_setElementSize(element, size_x, size_y) {
	element.style.width = element.style.minWidth = element.style.maxWidth = size_x + "px";
	element.style.height = element.style.minHeight = element.style.maxHeight = size_y + "px";
	element.width = size_x;
	element.height = size_y;
}

function B_func_fakeMouseEvent(view, client_x, client_y, type){
	var element = Dr.getElementAtClient(view, client_x, client_y);
	if (element) {
		Dr.simulateClientClick(type, element, view, client_x, client_y);
	}
}



//creator func
function B_func_insertCss(cssElement,cssCode) {
	var newStyle = document.createElement('style');
	newStyle.type = 'text/css';
	if (newStyle.styleSheet) {	// IE
		newStyle.styleSheet.cssText = cssCode;
	} 
	else {	// Other browsers
		newStyle.innerHTML = cssCode;
	}
	cssElement.appendChild(newStyle);
	//document.getElementsByTagName("head")[0].appendChild( style );
}

function B_func_createEleNode(eleParent,eleType,eleId,eleText) {
	var newEleNode = document.createElement(eleType);
	if (eleText) {
		var newEleText = document.createTextNode(eleText);
		newEleNode.appendChild(newEleText);
	}
	newEleNode.id = eleId;
	eleParent.appendChild(newEleNode);
}


function B_func_createCssText(B_size, B_color) {
	var B_thatCss= ""
	+"#Bean_Cursor {"
	+"	position:fixed;"
	+"	right:"+B_size.CursorMargin+"px;"
	+"	bottom:"+B_size.CursorMargin+"px;"
	+"	z-index:2090;"
	
	+"	margin:0;"
	+"	padding:0;"
	
	+"	font-size:"+B_size.CursorFont+"px;"
	+"	line-height:"+B_size.Cursor+"px;"
	+"	font-weight:bold;"
	+"	text-align: center;"
	+"	color: #FFF;"
	
	+"	width:"+B_size.Cursor+"px;"
	+"	height:"+B_size.Cursor+"px;"
	//+"	border:5px solid;"
	+"	border-radius:"+B_size.Cursor+"px;"
	+"	border-style: none;"
	
	+"	border: #427AC7;"
	+"	background-color: #5091E9;"
	+"}"
	
	+"#Bean_Cursor:hover {"
	+"	cursor:pointer;"
	+"	border:#427AC7;"
	+"	background-color:#436EEE;"
	+"}"
	
	+"#Bean_Cursor_bg {"
	+"	position:fixed;"
	+"	right:"+(B_size.CursorMargin-(B_size.CursorBg-B_size.Cursor)/2)+"px;"
	+"	bottom:"+(B_size.CursorMargin-(B_size.CursorBg-B_size.Cursor)/2)+"px;"
	+"	z-index:2080;"
	
	+"	margin:0;"
	+"	padding:0;"
	
	+"	font-size:"+B_size.CursorBgFont+"px;"
	+"	line-height:"+B_size.CursorBg+"px;"
	+"	font-weight:bold;"
	+"	text-align: center;"
	+"	color: #FFF;"
	
	+"	width:"+B_size.CursorBg+"px;"
	+"	height:"+B_size.CursorBg+"px;"
	+"	border-radius: "+B_size.CursorBg+"px "+B_size.CursorBg+"px "
	+B_size.CursorBgRadR/*right corner*/+"px "+B_size.CursorBgRadL/*left corner*/+"px;"
	+"	border-style: none;"
	
	+"	background-color: #505050;"
	+"}"
	
	+"#Bean_Cursor_Marker {"
	+"	position:fixed;"
	+"	display:none;"
	+"	z-index:2100;"
	+"	margin:0;"
	+"	padding:0;"
	+"	width:"+B_size.Marker+"px;"
	+"	height:"+B_size.Marker+"px;"
	+"	border-radius:"+B_size.Marker+"px;"
	+((B_size.MarkerBorder!=0)?("	border:"+B_size.MarkerBorder+"px solid "+B_color.MarkerColor+";"):("	border-style: none;"+"	background-color: "+B_color.MarkerColor+";"))
	+"}"
	
	+"#Bean_Menu {"
	+"	position:fixed;"
	+"	display:none;"
	+"	z-index:2080;"
	+"	padding:0;"
	
	
	+"	font-size:"+B_size.MenuFont+"px;"
	+"	line-height:"+B_size.MenuFontHeight+"px;"
	//+"	font-weight:bold;"
	+"	text-align: center;"
	+"	color: #FFF;"
	
	+"	left:50%;"
	+"	top:50%;"
	
	+"	filter:alpha(opacity=80);"
	+"	opacity:0.8;"
	
	+"	width:"+B_size.MenuX+"px;"
	+"	height:"+B_size.MenuY+"px;"
	+"	margin-left:-"+B_size.MenuX/2+"px;"
	+"	margin-top:-"+B_size.MenuY/2+"px;"
	
	+"	border-radius:"+B_size.MenuRad+"px;"
	+"	border:"+B_size.MenuBorder+"px solid "+B_color.MenuBorderColor+";"
	+"	background-color: "+B_color.MenuBgColor+";"
	+"}";
	
	return B_thatCss;
}


window.addEventListener('load',function(){
	//create CSS
	var B_size, B_color;
	if (window.devicePixelRatio>1) { //DPR=2/1.5
		B_size = {
		"Cursor":160,
		"CursorFont":40,
		"CursorMargin":25,
		
		"CursorBg":200,
		"CursorBgFont":35,
		"CursorBgRadL":200,
		"CursorBgRadR":50,
		
		"CursorOffset":30,
		
		"Marker":10,
		"MarkerOffset":20,
		"MarkerBorder":5,
		
		"MoveDet":40,
		
		"MenuX":500,
		"MenuY":500,
		"MenuRad":40,
		"MenuBorder":5,
		"MenuFont":25,
		"MenuFontHeight":30
		};
	}
	else {	//DPR=1
		B_size = {
		"Cursor":80,
		"CursorFont":20,
		"CursorMargin":15,
		
		"CursorBg":100,
		"CursorBgFont":18,
		"CursorBgRadL":100,
		"CursorBgRadR":30,
		
		"CursorOffset":10,
		
		"Marker":6,
		"MarkerOffset":5,
		"MarkerBorder":3,
		
		"MoveDet":20,
		
		"MenuX":500,
		"MenuY":500,
		"MenuRad":10,
		"MenuBorder":5,
		"MenuFont":20,
		"MenuFontHeight":30
		};
	}
	B_color = {
		"MarkerColor":"#FF0000",
		"MenuBorderColor":"#436EEE",
		"MenuBgColor":"#222222"
		};
		
	B_func_insertCss(document.body,B_func_createCssText(B_size,B_color));
	//create Cursor Element
	B_func_createEleNode(document.body,"div","Bean_Cursor","MENU");
	B_func_createEleNode(document.body,"div","Bean_Cursor_bg","Bean's");
	B_func_createEleNode(document.body,"div","Bean_Cursor_Marker");
	//create Menu Element 
	B_func_createEleNode(document.body,"div","Bean_Menu");
	
	//the cursor offset
	var B_cursor = document.getElementById('Bean_Cursor');
	var B_marker = document.getElementById('Bean_Cursor_Marker');
	
	var B_menu = document.getElementById('Bean_Menu');
	
	B_menu.innerHTML="<br /><b>Bean's Fake Mouse for Good</b>"
	+"<br />"
	+"<br />[To Click]<br />Drag&Release"
	+"<br />[To Cancel]<br />Drag&Drag Back&Release"
	+"<br />[To Menu]<br />Just Click(You know)"
	+"<br />"
	+"<br /><button>Exit</button>"
	+"<br />"
	+"<br />Mostly for Idea Showing<br />ver 6.0"
	+"<br /><b>ThatBean.com</b>";
	
	var B_contentWin = window;	//.frames["contentFrame"];
	
	var triggered=false;
	
	B_marker.style.display="block";
	var B_cursor_Hwidth=B_cursor.offsetWidth/2;
	var B_marker_Hwidth=B_marker.offsetWidth/2;
	B_marker.style.display="none";
	
	var pageinfo = B_func_getPageSize();
																			//document.getElementById("pageinfo_1").innerHTML="page:"+pageinfo.pageX+"x"+pageinfo.pageY+" | win:"+pageinfo.winX+"x"+pageinfo.winY+" | DPR:"+window.devicePixelRatio+" | devDPI:"+screen.deviceXDPI+"/"+screen.deviceYDPI+" | logDPI:"+screen.logicalXDPI+"/"+screen.logicalYDPI;
																			//document.getElementById("pageinfo_2").innerHTML=navigator.userAgent;
	var B_cur_max_deg=0.1;
	var B_cur_max_X=B_cursor.offsetLeft+B_cursor.offsetWidth-2*B_cursor_Hwidth;
	var B_cur_min_X=pageinfo.winX-B_cur_max_X-2*B_cursor_Hwidth;
	var B_cur_max_Y=B_cursor.offsetTop+B_cursor.offsetWidth-2*B_cursor_Hwidth;
	var B_cur_min_Y=pageinfo.winY-B_cur_max_Y-2*B_cursor_Hwidth;
																			//document.getElementById("pageinfo_1").innerHTML+="|MX/MY:"+B_cur_max_X+"-"+B_cur_min_X+"|"+B_cur_max_Y+"-"+B_cur_min_Y+"|"+B_cursor_Hwidth;
	var R_offset=B_size.CursorOffset;
	var R_offset_M=B_cursor_Hwidth*Math.SQRT2+B_marker_Hwidth+B_size.MarkerOffset;
		
	var X_org=B_cursor.offsetLeft+B_cursor.offsetWidth/2;
	var Y_org=B_cursor.offsetTop+B_cursor.offsetHeight/2;
																			//document.getElementById("pageinfo_2").innerHTML+="|x/y org="+X_org+"|"+Y_org;
	function win_resize(){
		//get page size info
		pageinfo = B_func_getPageSize();
		B_cur_max_X=B_cursor.offsetLeft+B_cursor.offsetWidth-2*B_cursor_Hwidth;
		B_cur_min_X=pageinfo.winX-B_cur_max_X-2*B_cursor_Hwidth;
		B_cur_max_Y=B_cursor.offsetTop+B_cursor.offsetWidth-2*B_cursor_Hwidth;
		B_cur_min_Y=pageinfo.winY-B_cur_max_Y-2*B_cursor_Hwidth;
		X_org=B_cursor.offsetLeft+B_cursor.offsetWidth/2;
		Y_org=B_cursor.offsetTop+B_cursor.offsetHeight/2;
	}
	
	//win_resize();
	//window.addEventListener('resize',win_resize,false);
	//window.addEventListener('orientationchange',win_resize,false);

	function cur_update(coors,mouseEvent){
		var tempA=Math.atan2((coors.y-Y_org),(coors.x-X_org));
		var R_offsetX=Math.min(Math.cos(tempA),B_cur_max_deg);
		var R_offsetY=Math.min(Math.sin(tempA),B_cur_max_deg);
		
		B_cursor.style.left=Math.min(Math.max(coors.x-B_cursor_Hwidth+R_offset*R_offsetX,B_cur_min_X),B_cur_max_X)+"px";
		B_cursor.style.top=Math.min(Math.max(coors.y-B_cursor_Hwidth+R_offset*R_offsetY,B_cur_min_Y),B_cur_max_Y)+"px";
		
		//B_marker
		B_marker.style.left=parseInt(B_cursor.style.left)+B_cursor_Hwidth-B_marker_Hwidth+R_offset_M*Math.cos(tempA)+"px";
		B_marker.style.top=parseInt(B_cursor.style.top)+B_cursor_Hwidth-B_marker_Hwidth+R_offset_M*Math.sin(tempA)+"px";
		
		if (mouseEvent!="") B_func_fakeMouseEvent(B_contentWin,parseInt(B_marker.style.left)+B_marker_Hwidth,parseInt(B_marker.style.top)+B_marker_Hwidth,mouseEvent);
		
		B_func_setDegree(B_cursor,(tempA*180/Math.PI+135));
																			//document.getElementById("xycoordinates").innerHTML="RealCur: (" + coors.x + "," + coors.y + ")"+"|A:"+tempA.toFixed(3)+"|"+(tempA*180/Math.PI).toFixed(3)+"|Cur:"+parseInt(B_cursor.style.left)+"|"+parseInt(B_cursor.style.top);
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
		if ((touch_orgX-coors.x)<B_size.MoveDet && (touch_orgY-coors.y)<B_size.MoveDet) {
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
			//clear
			//B_cursor.style.display="none";
			B_marker.style.display="none";
			
			if (away==0) {
				//alert("Menu, please!");
				B_menu.style.display="block";
			}
			else {
				if ((touch_orgX-coors.x)<B_size.MoveDet && (touch_orgY-coors.y)<B_size.MoveDet) {
					//do nothing
				}
				else {
					cur_update(coors,"click");
				}
			}
			//reset Cursor
			B_cursor.style.left="";//B_cursor_org_left;
			B_cursor.style.top="";//B_cursor_org_top;
			B_func_setDegree(B_cursor,0);
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
		if(!lastX && !lastX) ;//alert(event.type+" coor error "+event.target+"|"+event.currentTarget);
		else Bean_cursorEventDispenser[event.type](coors);
	}
	
	function Bean_func_menuEvent(event){
		event.preventDefault();
		event.stopPropagation();
		B_menu.style.display="none";
	}
	
	// attach the touchstart, touchmove, touchend event listeners.
	B_cursor.addEventListener('touchstart',Bean_func_cursorEvent, false);
	document.body.addEventListener('touchmove',Bean_func_cursorEvent, false);
	document.body.addEventListener('touchend',Bean_func_cursorEvent, false);
	document.body.addEventListener('touchcancel',Bean_func_cursorEvent, false);
	
	B_cursor.addEventListener('mousedown',Bean_func_cursorEvent, false);
	document.body.addEventListener('mousemove',Bean_func_cursorEvent, false);
	document.body.addEventListener('mouseup',Bean_func_cursorEvent, false);
	//document.body.addEventListener('mouseout',Bean_func_cursorEvent, false);	//cause error...
	
	B_menu.addEventListener('click',Bean_func_menuEvent, false);
	B_menu.addEventListener('touchend',Bean_func_menuEvent, false);
	B_menu.addEventListener('mouseup',Bean_func_menuEvent, false);
},false);	// end window.onLoad

//test if multiple onload can be processed()stupid huh?
//window.addEventListener('load',function(){alert("Bean's Fake Mouse for Good loaded")},false);