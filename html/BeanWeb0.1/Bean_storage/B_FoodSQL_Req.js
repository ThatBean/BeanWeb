//##############################################################################
var xmlHttp;	//AJAX XHR link
var func_StateFinished;
var func_StateChanged;
//Save Text To File In Path
function AJAX_POST_SendRequest(url,message) {
	//alert(url+"|"+message);
	xmlHttp=GetXmlHttpObject();
	if (xmlHttp==null) {alert ("Browser does not support HTTP Request");return;} 
	xmlHttp.onreadystatechange=StateChanged;
	xmlHttp.open("POST",url,true);
	xmlHttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xmlHttp.send(message);
}
//func for "return"
function StateChanged() { 
	if (xmlHttp.readyState==4 || xmlHttp.readyState=="complete") {func_StateFinished();}
	else {func_StateChanged();}
}
//func for create xmlHttp
function GetXmlHttpObject() {
	var xmlHttp=null;
	try {xmlHttp=new XMLHttpRequest();}//Firefox, Opera 8.0+, Safari
	catch(e) {try {xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");}catch(e) {xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");}}//IE
	return xmlHttp;
}
//##############################################################################
function getPageSize() {
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
//##############################################################################
//##############################################################################







var msg_sp="||";	//message spliter
var sc_option;	//for StateChanged

//func for AJAX response
function FoodSQL_StateChanged() {
	return;
	document.getElementById("pStatus").innerHTML="Completing ["+xmlHttp.readyState+"] of [4]...";
}


function FoodSQL_StateFinished() { 
//do sth here
	if (xmlHttp.status!=200) return;
	var resultList = xmlHttp.responseText.split(msg_sp);
	var report="";
	//report+="logmsg="+resultList[0]+"<br />";
	report+="Type="+resultList[1]+"<br />";
	report+="Table="+resultList[2]+"<br />";
	//report+="logmsg="+resultList[3]+"<br />";
	report+="Result="+resultList[4]+"<br />";
	
	
	//report+="logmsg1="+resultList[0]+"<br />";
	report+="logmsg2="+resultList[3]+"<br />";

	report+="Org="+xmlHttp.responseText+"<br />";
	
	ReportDistributor[resultList[1]](resultList[2],resultList[4]);
	document.getElementById("pStatus").innerHTML=report;
}

func_StateFinished = FoodSQL_StateFinished;
func_StateChanged = FoodSQL_StateChanged;


var foodSQL_Table=Array(
	'FoodSet',
	'Food',
	'PlaceBld',
	'PlaceWin',
	'Comment',
	'F_S_Link',
	'F_W_Link',
	'W_B_Link',
	'C_Link',
	'User',
	'ViewFoodBld'
)
var foodSQL_Col={
	'FoodSet'	: Array("sID", "sINFO"),
	'Food'		: Array("fID", "fNAME", "fPRICE", "fINFO"),
	'PlaceBld'	: Array("bID", "bNAME", "bSITE", "bINFO"),
	'PlaceWin'	: Array("wID", "wNAME", "wSITE", "wINFO"),
	'Comment'	: Array("cID", "cINFO", "cTIME"),
	'F_S_Link'	: Array("fID", "sID"),
	'F_W_Link'	: Array("fID", "wID"),
	'W_B_Link'	: Array("wID", "bID"),
	'C_Link'	: Array("cID", "tID", "tTYPE", "uID"),
	'User'		: Array("uID", "uTYPE", "uNAME", "uPW"),
	'ViewFoodBld'	: Array("fID", "wID", "bID", "fNAME", "fPRICE", "fINFO"),
}
var foodSQL_reqDetail={
	'FoodSet'	: "sID,sINFO",
	'Food'		: "fID,fNAME,fPRICE,fINFO",
	'PlaceBld'	: "bID,bNAME,bSITE,bINFO",
	'PlaceWin'	: "wID,wNAME,wSITE,wINFO",
	'Comment'	: "cID,cINFO,cTIME",
	'F_S_Link'	: "fID,sID",
	'F_W_Link'	: "fID,wID",
	'W_B_Link'	: "wID,bID",
	'C_Link'	: "cID,tID,tTYPE,uID",
	'User'		: "uID,uTYPE,uNAME,uPW",
	'ViewFoodBld'	: "fID,wID,bID,fNAME,fPRICE,fINFO"
}
var foodSQL_UpperTable={
	'FoodSet'	: false,
	'Food'		: "PlaceWin",
	'PlaceBld'	: false,
	'PlaceWin'	: "PlaceBld",
	'Comment'	: false,
	'F_S_Link'	: false,
	'F_W_Link'	: false,
	'W_B_Link'	: false,
	'C_Link'	: false,
	'User'		: false,
	'ViewFoodBld'	: false
}
var foodSQL_UnderTable={
	'FoodSet'	: "Food",
	'Food'		: false,
	'PlaceBld'	: "PlaceWin",
	'PlaceWin'	: "Food",
	'Comment'	: false,
	'F_S_Link'	: false,
	'F_W_Link'	: false,
	'W_B_Link'	: false,
	'C_Link'	: false,
	'User'		: false,
	'ViewFoodBld'	: false
}
function MakeReq_AJAX_POST(message) {
	var url="B_FoodSQL_Req.php";
	//alert(message);
	AJAX_POST_SendRequest(url,message);
	return;
	//############################################################
	var m_file_path=document.getElementById("file_path").value;
	var m_file_text=encodeURIComponent(document.getElementById("file_text").value);
	var message="option="+fm_option+"&file_name="+m_file_name+"&file_path="+m_file_path+"&file_text="+m_file_text;
	//m_file_text=m_file_text.replace(/\%/g, "%25");
}
