/*
 basic page object needed
 */

//For debug access
var GlobalDebug = GlobalDebug || {};

var WinObj = WinObj || {};

(function (WinObj) {
	//test code new WinObj.Window('test' + Date.now(), 'Title' + Date.now(), document.body)
	var Window = (function (Window) {
		function Window(id, title, parentElement, createdElement) {
			if (Window._idList[id]) {
				console.log('duplicat WinObj.Window! id:'+id);
				Window._idList[id].close();
			}
			this.id = id;
			this.parentElement = parentElement;
			
			if (!createdElement) {
				var HTMLtext = ''
					+ '<div class=\'win-head\'>'
						+ '<span>' + title + '</span>'
						+ '<button onClick=\'WinObj.toggleWin(this, "close")\'>X</button>'
						+ '<button onClick=\'WinObj.toggleWin(this, "minimize")\'>-</button>'
					+ '</div>'
					+ '<div class=\'win-body\'></div>';
				this.element = _createEleNode(parentElement, 'div', HTMLtext, id, 'win');
			}
			else this.element = createdElement;
			this.winTitle = this.element.getElementsByTagName('span')[0];
			this.winBody = this.element.getElementsByClassName('win-body')[0];
			
			//add back link
			this.element.Window = this;
			Window._idList[id] = this;
		}
		
		function _createEleNode(eleParent,eleType,eleHTMLtext,eleId,eleClassName) {
			var newEleNode = document.createElement(eleType);
			if (eleHTMLtext) {
				newEleNode.innerHTML = eleHTMLtext;
			}
			newEleNode.id = eleId;
			newEleNode.className = eleClassName;
			eleParent.appendChild(newEleNode);	//add = append
			//eleParent.insertBefore(newEleNode, eleParent.firstElementChild || eleParent.children[0] || null);	// add = first
			return newEleNode;
		}
		
		Window._idList = new Object();	//for collection id
		Window.getFromIdList = function (id) {
			return Window._idList[id];
		}
		
		Window.prototype.addContent = function (contentHTML) {
			this.winBody.innerHTML = contentHTML;
		}
		
		Window.prototype.setProtect = function (type, isProtect) {
			this[type + 'Protected'] = isProtect;
		}
		
		Window.prototype.addCloseClosure = function (closure) {
			this.closeClosure = closure;
		}
		
		Window.prototype.close = function () {
			if (this.closeProtected) return this.toggle('hide', 'none');
			delete Window._idList[this.id];
			this.parentElement.removeChild(this.element);	//remove from dom
			this.parentElement = undefined;
			this.element.Window = undefined;
			this.element = undefined;
			this.winTitle = undefined;
			this.winBody = undefined;
			/*
			if (this.closeClosure) {
				var closeClosure = this.closeClosure;
				this.closeClosure = undefined;
				return closeClosure();
			}
			*/
			this.closeClosure = undefined;
			//self delete
		}
		
		Window.prototype.toggle = function (command, setValue) {
			if (command == 'close') {
				if (this.closeClosure) this.closeClosure();	//trigger here
				return this.close();
			}
			if (command == 'hide') {
				_toggleDisplay(this.element, setValue);
			}
			if (command == 'minimize') {
				_toggleDisplay(this.winBody, setValue);
			}
		}
		
		function _toggleDisplay(obj, setValue) {
			if (setValue != undefined) obj.style.display = setValue;
			else obj.style.display = obj.style.display ? '' : 'none';
		}
		
		Window.FromCreated = function (id) {
			var createdElement = document.getElementById(id);
			var title = createdElement.getElementsByTagName('span')[0].innerHTML;
			var parentElement = createdElement.parentElement;
			return new Window(id, title, parentElement, createdElement);
		}
		
		return Window;
	})();
	WinObj.Window = Window;
	
	//for a global accessible func to toggle
	WinObj.toggleWin = function (obj, command) {
		var layer = 0;
		while (obj.parentElement) {
			obj = obj.parentElement;
			if (obj.Window) {
				return obj.Window.toggle(command);
			}
			layer++;
			if (layer > 2) return alert('No win object found to ' + command);
		}
	}
	
	///#############################################################################################
	///#############################################################################################
	///#############################################################################################
	
	function closureAlert(msg) {return function () {alert(msg);}}
	WinObj.closureAlert = closureAlert;
	
	//use:	var cTest = WinObj.createClosure(console, console.log, 'good');
	//		cTest(); //will show log 'good' now
	function createClosure(oThis, func/*add arguments after func*/) {
		var args = Array.prototype.slice.call(arguments, 2);
		return function () {
			func.apply(oThis, args);
		}
	}
	WinObj.createClosure = createClosure;
	
	
	
	///#############################################################################################
	///#############################################################################################
	///#############################################################################################
	
	var ScrollTable = (function (ScrollTable) {
		function ScrollTable(id, title, parentElement) {
			this.id = id;
			this.parentElement = parentElement;
			this.parentElement.innerHTML = _createScrollTableHTML(id, title);
			
			this.element = document.getElementById(id);
			
			//four part in this table, add the same time
			this.topleft = this.element.getElementsByClassName('scrolltable-topleft')[0];
			this.col = this.element.getElementsByClassName('scrolltable-col')[0];
			this.row = this.element.getElementsByClassName('scrolltable-row')[0];
			this.main = this.element.getElementsByClassName('scrolltable-main')[0];
			
			this.addSyncScroll();
		}
		
		ScrollTable.prototype.addSyncScroll = function () {
			function _syncScroll(srcEle, tgtEle, syncScroll) {
				tgtEle[syncScroll] = srcEle[syncScroll];
			}
			
			//create 'up values'
			var main = this.main;
			var col = this.col;
			var row = this.row;
			
			this.main.addEventListener('scroll', function () {
				//console.log("get"+main+col+row);
				_syncScroll(main, col, 'scrollLeft');
				_syncScroll(main, row, 'scrollTop');
			})
		}
		
		ScrollTable.prototype.resetScroll = function () {
			this.main.scrollLeft = 0;
			this.main.scrollTop = 0;
			this.col.scrollLeft = 0;
			this.row.scrollTop = 0;
		}
		
		function _createScrollTableHTML(id, title) {
			var HTML = '<table id="' + id + '" class="scrolltable">'
				+ '<tr>'
				+ 	'<td style="width:20%;"><div class="scrolltable-topleft""><b>' + title + '</b></div></td>'
				+	'<td><div class="scrolltable-col"></div></td>'
				+ '</tr>'
				+ '<tr>'
				+	'<td><div class="scrolltable-row"></div>'
				+	'<td><div class="scrolltable-main"></div></td>'
				+ '</tr>'
				+ '</table>';
			return HTML;
		}
		
		ScrollTable.prototype.addContent = function (tgtMark, contentHTML) {
			if (this[tgtMark]) this[tgtMark].innerHTML = contentHTML;
		}
		
		
		
		ScrollTable.prototype.addContentFromArray = function (mainInfoMatrix, mainSiteMatrix, colInfoArray, colSiteArray, rowArray, colCheckBox, rowCheckBox) {
			if (colCheckBox) {
				var colInfoHTML = _collectArray('<td><div class="array array-wide"><b><input type="checkbox"/>', colInfoArray, '</b></div></td>', '', true);
				var colSiteHTML = _collectArray('<td><div class="array"><b><input type="checkbox"/>', colSiteArray, '</b></div></td>', '', true);
			}
			else {
				var colInfoHTML = _collectArray('<td><div class="array array-wide"><b>', colInfoArray, '</b></div></td>', '', true);
				var colSiteHTML = _collectArray('<td><div class="array"><b>', colSiteArray, '</b></div></td>', '', true);
			}
			var colScrollCompensateHTML = '<td><div class="array array-wide"></div></td>';
			if (colInfoHTML || colSiteHTML) {
				var colHTML = '<table><tr>' 
							+ (colInfoHTML || '') + (colSiteHTML || '')
							+ colScrollCompensateHTML + colScrollCompensateHTML 
							+ '</tr></table>';
				this.addContent('col', colHTML);
			}
			else {
				this.addContent('col', 'no data collected');
			}
			
			if (rowCheckBox) {
				var rowHTML = _collectArray('<span><input type="checkbox"/>', rowArray, '</span>', '', true);
			}
			else {
				var rowHTML = _collectArray('<span>', rowArray, '</span>', '', true);
			}
			var rowScrollCompensateHTML = '<span></span>';
			if (rowHTML) {
				var rowHTML = '<div class="array array-title">' 
							+ rowHTML 
							+ rowScrollCompensateHTML  
							+ '</div>';
				this.addContent('row', rowHTML);
			}
			//jide/unhide topleft and row title
			if (rowHTML) {
				this.topleft.parentElement.style.width = '20%';
				this.row.style.height = 'auto';
			}
			else {
				this.topleft.parentElement.style.width = '0%';
				this.row.style.height = '0px';
			}
			
			var mainInfoHTML = _collectArrayArray('<td><div class="array array-wide">', '<span>', mainInfoMatrix, '</span>', '</div></td>');
			var mainSiteHTML = _collectArrayArray('<td><div class="array">', '<span>', mainSiteMatrix, '</span>', '</div></td>');
			if (mainInfoHTML || mainSiteHTML) {
				var mainHTML = '<table><tr>' 
							+ (mainInfoHTML || '') + (mainSiteHTML || '')
							+ '</tr></table>';
				this.addContent('main', mainHTML);
			}
			else {
				this.addContent('main', 'no data collected');
			}
		}
		
		function _collectArrayArray(prepreHTML, preHTML, midHTMLarrayarray, postHTML, postpostHTML, joinjoinSplitter, joinSplitter) {
			var collector = new Array();
			var postpostHTML = postpostHTML || '';
			var joinjoinSplitter = joinjoinSplitter || '';
			for (var i = 0; i < midHTMLarrayarray.length; i++) {
				collector.push(prepreHTML + (_collectArray(preHTML, midHTMLarrayarray[i], postHTML, joinSplitter) || '') + postpostHTML);
			}
			return collector.join(joinjoinSplitter);
		}
		function _collectArray(preHTML, midHTMLarray, postHTML, joinSplitter, toAbbr) {
			if (!midHTMLarray || !midHTMLarray.length) return;
			var collector = new Array();
			var postHTML = postHTML || '';
			var joinSplitter = joinSplitter || '';
			for (var i = 0; i < midHTMLarray.length; i++) {
				if (toAbbr) collector.push(preHTML + _toAbbrTitle(midHTMLarray[i] || '', i) + postHTML);
				else collector.push(preHTML + (midHTMLarray[i] || '') + postHTML);
			}
			return collector.join(joinSplitter);
		}
		
		function _toAbbrTitle(orgTitleString, index) {
			var titleArray = orgTitleString.split('|');
			if (titleArray.length == 2) {
				return '<abbr title="' + titleArray[0] + ' - ' + titleArray[1] + '">' + titleArray[0] + '-' + titleArray[1].slice(0,3) + '</abbr>';
			}
			else {
				return '<abbr title="' + index + ' - ' + orgTitleString + '">' + orgTitleString + '</abbr>';
			}
		}
		
		return ScrollTable;
	})();
	WinObj.ScrollTable = ScrollTable;
	
})(WinObj);