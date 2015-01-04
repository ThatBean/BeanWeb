//Bean's Fake Mouse for Good JS
	//var location="";
	function B_func_getPageSize() {
		var xScroll,yScroll;
		if (window.innerHeight && window.scrollMaxY) {
			xScroll = document.body.scrollWidth;
			yScroll = window.innerHeight + window.scrollMaxY;
		} else if (document.body.scrollHeight > document.body.offsetHeight) {
			xScroll = document.body.scrollWidth;
			yScroll = document.body.scrollHeight;
		} else {
			xScroll = document.body.offsetWidth;
			yScroll = document.body.offsetHeight;
		}

		var windowWidth,windowHeight;
		if (self.innerHeight) {
			windowWidth = self.innerWidth;
			windowHeight = self.innerHeight;
		} else if (document.documentElement && document.documentElement.clientHeight) {
			windowWidth = document.documentElement.clientWidth;
			windowHeight = document.documentElement.clientHeight;
		} else if (document.body) {
			windowWidth = document.body.clientWidth;
			windowHeight = document.body.clientHeight;
		}

		var pageWidth,pageHeight
		pageHeight = ( (yScroll < windowHeight) ? windowHeight : yScroll );
		pageWidth = ( (xScroll < windowWidth) ? windowWidth : xScroll );

		return {"pageX":pageWidth,"pageY":pageHeight,"winX":windowWidth,"winY":windowHeight};
	}
	
	function B_func_setDegree(obj,deg){  
		obj.style.webkitTransform="rotate("+deg+"deg)";
		obj.style.MozTransform="rotate("+deg+"deg)";
		obj.style.msTransform="rotate("+deg+"deg)";
		obj.style.OTransform="rotate("+deg+"deg)";
		obj.style.transform="rotate("+deg+"deg)";
	}
	
	function B_func_setSizePX(obj,sizeX,sizeY){
		obj.width=obj.style.minWidth=obj.style.maxWidth=sizeX+"px";
		obj.height=obj.style.minHeight=obj.style.maxHeight=sizeY+"px";
	}
	
	function B_func_fakeMouseEvent(B_contentWin,iClientX,iClientY,mouseEvent){
		//if in iframes
		//var B_contentWin = window.frames["contentFrame"];
		var getObject=B_contentWin.document.elementFromPoint(iClientX, iClientY);
		//same window frame
		//var getObject=document.elementFromPoint(iClientX, iClientY);
		if (!getObject) return;
		//if (mouseEvent=="click") alert("[B_func_fakeMouseEvent] GET:"+iClientX+"|"+iClientY+"|"+mouseEvent);
		if (document.createEventObject) { //For IE
			oEvent = document.createEventObject();
			oEvent.clientX = iClientX;
			oEvent.clientY = iClientY;
			getObject.fireEvent("on"+mouseEvent, oEvent);    
		} else {
			oEvent = document.createEvent("MouseEvents");
			oEvent.initMouseEvent(mouseEvent, true, true, document.defaultView, 0, 0, 0, iClientX, iClientY, false, false, false, false, 0, null); 
			getObject.dispatchEvent(oEvent);
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
	
	
	function B_func_createCssText(B_size) {
		var B_thatCss= ""
		+"#Bean_Cursor {"
		+"	position:fixed;"
		+"	right:"+B_size.CursorMargin+"px;"
		+"	bottom:"+B_size.CursorMargin+"px;"
		+"	z-index:90;"
		
		+"	margin:0;"
		+"	padding:0;"
		
		+"	font-size:"+B_size.CursorFont+"px;"
		+"	line-height:"+B_size.Cursor+"px;"
		+"	font-weight:bold;"
		+"	text-align: center;"
		
		+"	width:"+B_size.Cursor+"px;"
		+"	height:"+B_size.Cursor+"px;"
		//+"	border:5px solid;"
		+"	border-radius:"+B_size.Cursor+"px;"
		+"	border-style: none;"
		
		+"	color: #FFF;"
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
		+"	z-index:80;"
		
		+"	margin:0;"
		+"	padding:0;"
		
		+"	font-size:"+B_size.CursorBgFont+"px;"
		+"	line-height:"+B_size.CursorBg+"px;"
		+"	font-weight:bold;"
		+"	text-align: center;"
		
		+"	width:"+B_size.CursorBg+"px;"
		+"	height:"+B_size.CursorBg+"px;"
		+"	border-radius: "+B_size.CursorBg+"px "+B_size.CursorBg+"px "
		+B_size.CursorBgRadR/*right corner*/+"px "+B_size.CursorBgRadL/*left corner*/+"px;"
		+"	border-style: none;"
		
		+"	color: #FFF;"
		+"	background-color: #505050;"
		+"}"
		
		+"#Bean_Cursor_Marker {"
		+"	position:fixed;"
		+"	display:none;"
		+"	z-index:100;"
		+"	margin:0;"
		+"	padding:0;"
		+"	width:"+B_size.Marker+"px;"
		+"	height:"+B_size.Marker+"px;"
		+"	border-radius:"+B_size.Marker+"px;"
		+((B_size.MarkerBorder!=0)?("	border:"+B_size.MarkerBorder+"px solid "+B_size.MarkerColor+";"):("	border-style: none;"+"	background-color: "+B_size.MarkerColor+";"))
		+"}";
		
		return B_thatCss;
	}
	
	
	window.addEventListener('load',function(){
		//create CSS
		var B_size;
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
			"MarkerColor":"#FF0000",
			
			"MoveDet":40
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
			"MarkerColor":"#FF0000",
			
			"MoveDet":20
			};
		}
		B_func_insertCss(document.body,B_func_createCssText(B_size));
		//create Element
		B_func_createEleNode(document.body,"div","Bean_Cursor","MENU");
		B_func_createEleNode(document.body,"div","Bean_Cursor_bg","Bean's");
		B_func_createEleNode(document.body,"div","Bean_Cursor_Marker");
		
		//the cursor offset
		//var B_Cursor = document.getElementById('Bean_Cursor');
		var B_cursor = document.getElementById('Bean_Cursor');
		var B_marker = document.getElementById('Bean_Cursor_Marker');
		
		var B_contentWin = window;	//.frames["contentFrame"];
		
		var triggered=false;
		
		B_marker.style.display="block";
		var B_cursor_Hwidth=B_cursor.offsetWidth/2;
		var B_marker_Hwidth=B_marker.offsetWidth/2;
		B_marker.style.display="none";
		
		pageinfo = B_func_getPageSize();
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
					alert("Menu, please!");
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
		var drawer = {
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
		var lastX=1;
		var lastY=1;
		function draw(event){
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
			else drawer[event.type](coors);
		}
		
		// attach the touchstart, touchmove, touchend event listeners.
	    B_cursor.addEventListener('touchstart',draw, false);
	    document.body.addEventListener('touchmove',draw, false);
	    document.body.addEventListener('touchend',draw, false);
	    document.body.addEventListener('touchcancel',draw, false);
		
	    B_cursor.addEventListener('mousedown',draw, false);
		document.body.addEventListener('mousemove',draw, false);
	    document.body.addEventListener('mouseup',draw, false);
		//document.body.addEventListener('mouseout',draw, false);	//cause error...
		
	},false);	// end window.onLoad
	
	//test if multiple onload can be processed()stupid huh?
	window.addEventListener('load',function(){alert("Bean's Fake Mouse for Good loaded")},false);