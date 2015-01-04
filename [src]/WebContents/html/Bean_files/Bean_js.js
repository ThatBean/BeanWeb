// Js Bean
var Author="Bean"
function Annoying(){
	alert("this is made by: "+Author);
}

//web01
function CheckIn(label_id){
	document.getElementById(label_id).style.visibility='hidden';
}

function CheckOut(target_input,label_id){
	//alert("Get: "+target_input.value);
	if(!target_input.value)
		document.getElementById(label_id).style.visibility='visible';
	else
		document.getElementById(label_id).style.visibility='hidden';
}

//tab01
function setTab(n,tmenu,tmain){
	//alert("Get: "+tmenu+"  "+tmain);
	var tli=document.getElementById(tmenu).getElementsByTagName("li");
	var mli=document.getElementById(tmain).getElementsByTagName("ul");
	for(i=0;i<tli.length;i++){
		//alert("get"+i);
		if(tmenu=="tabmenu")tli[i].className=i==n?("hover"+n):"";
		mli[i].style.display=i==n?"block":"none";
	}
}


//web02
function web02init(){
	added=new Array(0,0,0);
	btnName="c02_btn";
	listName="c02_det";
	getName="c02_get";
	rtCssOrg=120;
	
	stUL=document.getElementById(listName).getElementsByTagName("ul");
	rtUL=document.getElementById(getName).getElementsByTagName("ul");
}

function checkNum(obj,nmin,nmax){
	obj.value.replace(/\D/gi,'');
	num=obj.value;
	num=num<=nmax?num:nmax;
	num=num>=nmin?num:nmin;
	obj.value=num;
}

function chBtnDisp(n){
	//alert("good rec:"+btnName+","+n);
	document.getElementById(btnName+n).innerHTML=added[n]?"修改此食物信息":"添加此食物信息";
}

function switchTo(n){
	//alert("good rec:"+listName+","+n);
	for(i=0;i<stUL.length;i++){
		stUL[i].style.display=i==n?"":"none";
	}
	if (n>=0) chBtnDisp(n);
	else  stUL[stUL.length-1].style.display="";
}

function recTo(n,deRec){
	//alert("good rec:"+getName+","+n);
	var stINPUT=stUL[n].getElementsByTagName("input");
	var rtINPUT=rtUL[n].getElementsByTagName("input");
	slowly(rtUL[n],deRec?0:rtCssOrg,deRec?-2:2,10);
	for(i=0;i<stINPUT.length;i++){
		rtINPUT[i].value=deRec?"":stINPUT[i].value;
	}
	added[n]=deRec?0:1;
	document.getElementById("c02_jssel_val_"+n).value=deRec?0:1;
	chBtnDisp(n);
	//switchTo(-1);
}

function showOption(btn,option,detail){ 
	btnObj=document.getElementById(btn);
	optionObj=document.getElementById(option);
	objList=optionObj.getElementsByTagName("div");
	
	optionObj.style.display=(optionObj.style.display==""?"none":"");
	optionObj.onblur=function () {
		optionObj.style.display="none";
	}
   
	for (var i=0;i<objList.length;i++){
		//if (i==1) alert("i="+i+"now  total="+objList.length);
		objList[i].num=i;
		optionObj.focus();
		objList[i].onmouseover=function (){
			this.className="c02_jssel_opt_over";
		}
		objList[i].onmouseout=function (){
			this.className="c02_jssel_opt_out";
		}
		objList[i].onclick=function () {
			//valueObj.value=this.innerHTML; //Operation here
			optionObj.blur();
			optionObj.style.display="none";
			//if (i==1) alert("i="+i+"now  total="+objList.length);
			switchTo(this.num,detail);
		}
	}
}

function slowlyRep(itvId){
	itvlDic[itvId].tempHeight=itvlDic[itvId].repTo-itvlDic[itvId].itemGet.offsetHeight;
	//alert("tempHeight="+itvlDic[itvId].tempHeight+" \n get "+itvlDic[itvId].itemGet+" and it's "+itvlDic[itvId].itemGet.offsetHeight+"px tall, it will be set to '"+(itvlDic[itvId].itemGet.offsetHeight+itvlDic[itvId].iter)+"px' \n"+"slowlyRep("+itvlDic[itvId].repTo+","+itvlDic[itvId].iter+","+itvlDic[itvId].iterT+")");
	if (itvlDic[itvId].tempHeight*itvlDic[itvId].iter>0){
		itvlDic[itvId].itemGet.style.minHeight=itvlDic[itvId].itemGet.style.maxHeight=(itvlDic[itvId].itemGet.offsetHeight+itvlDic[itvId].iter)+"px";
	}
	else{
		if (!itvlDic[itvId].repTo){
			itvlDic[itvId].itemGet.style.display="none";
			itvlDic[itvId].itemGet.style.overflow="";
			itvlDic[itvId].itemGet.style.minHeight="";
			itvlDic[itvId].itemGet.style.maxHeight="";
		}
		clearInterval(itvlDic[itvId].itvlS);
		itvlDic[itvId].itemGet.style.minHeight=itvlDic[itvId].itemGet.style.maxHeight=itvlDic[itvId].repTo+"px";
		//alert("get "+itemGet+" and it's "+itemGet.offsetHeight+"px tall, now ended | id="+itvId);
		delete itvlDic[itvId];
	}
}

function slowlyId(itemId,repTo,iter,iterT,itvId){
	itemGet=document.getElementById(itemId);
	slowly(itemGet,repTo,iter,iterT,itvId)
}
function slowly(itemGetV,repTo,iter,iterT,itvId){
	itvlDic[itvId]=new Object();
	itvlDic[itvId].itemGet=itemGetV;
	itvlDic[itvId].repTo=repTo;
	itvlDic[itvId].iter=iter;
	itvlDic[itvId].itemGet.style.overflow="hidden";
	if (repTo){
		itvlDic[itvId].itemGet.style.minHeight=itvlDic[itvId].itemGet.style.maxHeight="0px";
		itvlDic[itvId].itemGet.style.display='';
	}
	clearInterval(itvlDic[itvId].itvlS);
	itvlDic[itvId].itvlS=setInterval("slowlyRep("+itvId+")",iterT);
	//alert("get "+itemGet+" and it's "+itemGet.offsetHeight+"px tall, now started | id="+itvId);
}

//dic value
	itvlDic=[];
	trggrDic=[];
	

//web03
function barChartize(objId,maxHeight,gap,wid,tgtTopSpace,tgtFontSize,itvId){
	//alert("get "+objId+maxHeight+gap);
	barSet=document.getElementById(objId).getElementsByTagName("div");
	for(i=0;i<barSet.length;i++){
		t_barheight=(100-barSet[i].getAttribute("psnt"))*maxHeight/100+tgtTopSpace;
		barSet[i].style.fontSize=tgtFontSize+"px";
		//alert(parseInt(barSet[i].style.fontSize));
		
		barSet[i].style.minHeight=barSet[i].style.maxHeight=t_barheight+"px";
		//barSet[i].style.left=parseInt(barSet[i].style.left)+(parseInt(barSet[i].style.width)+gap)*i+"px";
		
		t_lineheight=(t_barheight*2-parseInt(barSet[i].style.fontSize)-5);
		if (t_lineheight>0) {
			barSet[i].style.lineHeight=t_lineheight+"px";
		}
		else {
			barSet[i].style.lineHeight="0px";
		}
		//alert((t_barheight-parseInt(barSet[i].style.fontSize)+maxHeight/100));
		
		barSet[i].style.left=(wid+gap)*i+"px";
		barSet[i].style.width=wid+"px";
		//alert(barSet[i]+barSet[i].style.left+barSet[i].style.width);
		if (t_barheight>=1) {
			slowly(barSet[i],t_barheight,2,10,itvId*100+i);
		}
		
		barSet[i].innerHTML=barSet[i].getAttribute("psnt")+"%";
		
	}
}

function barDispSet(tgtId,tgtHeight,tgtGap,tgtWidth,tgtTopSpace,tgtFontSize,itvId){
	//alert("get "+tgtId);
	slowlyId(tgtId,tgtHeight+tgtTopSpace,2,10,itvId*10000);
	
	setTimeout("barChartize('"+tgtId+"',"+tgtHeight+","+tgtGap+","+tgtWidth+","+tgtTopSpace+","+tgtFontSize+","+itvId+")",tgtHeight*10/2+20)
}

function triggerOnce(tCmd,tId,tTime){
	if (!trggrDic[tId]){
		trggrDic[tId]=true;
		setTimeout(tCmd,tTime);
	}
}	



//window.onload=Annoying;

//document.getElementById("")
/*
window.onload=function(){
	document.getElementById('B_name').onfocus=function(){CheckIn('label_B_name');};
	document.getElementById('B_name').onblur=function(){CheckOut(this,'label_B_name');};
	document.getElementById('B_email').onclick = function(){CheckIn('label_B_email');};
	document.getElementById('B_email').onblur = function(){CheckOut(this,'label_B_email');};
}
*/
