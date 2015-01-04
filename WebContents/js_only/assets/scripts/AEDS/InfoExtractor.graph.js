/**
 * Info Extractor Graph JS
 * 
 * For canvas based graph, still lame
 * 
 * 
 * 
 * 
 * 
 **/
 
 
var GlobalDebug = GlobalDebug || {};	// for debug use(view in browser)
var InfoExtractor = InfoExtractor || {};

(function (InfoExtractor) {
	
	// a Graph has many slices
	var Graph = (function (Graph) {
		function Graph(canvas, width, height, textSize) {
			this.canvas = canvas;
			this.width = width;
			this.height = height;
			this.textSize = textSize || 12;
			this.ctx = canvas.getContext("2d");
			
			this.setSize();
		}
		
		Graph.prototype.clearGraph = function () {
			this.canvas.width = this.canvas.width;
		}
		
		Graph.prototype.setSize = function (width, height) {
			width = width || this.width || this.canvas.width || parseInt(this.canvas.style.width);
			height = height || this.height || this.canvas.height || parseInt(this.canvas.style.height);
			
			this.canvas.style.width = width + 'px';
			this.canvas.style.height = height + 'px';
			
			this.canvas.width = width;
			this.canvas.height = height;
			
			this.width = width;
			this.height = height;
			
			return;
		}
		
		Graph.prototype.autoWidth = function () {
			var Othis = this;
			//function ReSizeW() {
			var ReSizeW = function () {
				console.log('resize! '+Othis+'  '+Othis.canvas.parentElement.offsetWidth);
				if (!_checkLinkToDocumentBody(Othis.canvas)) {
					var evt = "onorientationchange" in window ? "orientationchange" : "resize";
					window.removeEventListener(evt,ReSizeW);
				}
				var upperWidth = Othis.canvas.parentElement.offsetWidth;
				Othis.setSize(upperWidth * 0.95 - 2, null);
				Othis.drawPlot();
			}
			//add onResize closure
			var evt = "onorientationchange" in window ? "orientationchange" : "resize";
			window.addEventListener(evt,ReSizeW);
			//resize
			ReSizeW();
			return;
		}
		
		function _checkLinkToDocumentBody(element) {
			while (element) {
				element = element.parentElement;
				if (element == document.body) return true;
			}
			return false;
		}
		
		Graph.prototype.initPlot = function (title, width, height, dataPack) {
			this.width = width || this.width || this.canvas.width || parseInt(this.canvas.style.width);
			this.height = height || this.height || this.canvas.height || parseInt(this.canvas.style.height);
			this.setSize();
			
			this.title = title || 'Plot';
			
			//reform data for sort use, add index field
			var reformed = _reformData(dataPack);
			
			this.dataPack = dataPack;	//should be distribution
			this.reformed = reformed;
			
			
			this.reformed.dataSortBy = '';
			
			return;
		}
		
		function _reformData(dataPack) {
			var size = 0;
			var dataLength = 0;
			for (var i in dataPack) {
				if (dataPack[i].data.length != 0) {
					size++;
					dataLength = dataPack[i].data.length;
				}
			}
			var index = new Array();
			for (var i = 0; i < dataLength; i++) {
				index.push(i);
			}
			
			var pickedDataObjArr = new Object();
			for (var i in dataPack) {
				if (dataPack[i].data.length != 0) pickedDataObjArr[i] = dataPack[i].data;
			}
			pickedDataObjArr.index = index;
			
			var reformedArrObj = _convertObjArrToArrObj(pickedDataObjArr);
			
			
			
			return {
				orgData: dataPack,
				data: reformedArrObj,
				size: size,
				length: index.length
			};
		}
		
		function _convertObjArrToArrObj(objArr) {
			var reformedArrObj = new Array();
			for (var i in objArr) {
				for (var j in objArr[i]) {
					reformedArrObj[j] = reformedArrObj[j] || new Object();
					reformedArrObj[j][i] = objArr[i][j];
				}
			}
			return reformedArrObj;
		}
		function _convertArrObjToObjArr(arrObj) {
			var reformedObjArr = new Object();
			for (var i in arrObj) {
				for (var j in arrObj[i]) {
					reformedObjArr[j] = reformedObjArr[j] || new Array();
					reformedObjArr[j][i] = arrObj[i][j];
				}
			}
			return reformedObjArr;
		}
		
		
		
		Graph.SortData = function (reformedData, sortMethod) {
			//[['key','desc'],['key','asc']]
			var sortMethod = sortMethod;
			var _sortFunction = function (a, b) {
				for (var i in sortMethod) {
					var key = sortMethod[i][0];
					if (a[key] != b[key]) {
						//console.log('key:'+key);
						var order = sortMethod[i][1];
						var compare = a[key] > b[key] ? -1 : 1;
						return (order == 'desc' ? compare : -compare);
					}
				}
				return 0;
			}
			reformedData.sort(_sortFunction);
			
			var resultObject = new Object();
			for (var i in reformedData) {
				for (var j in reformedData[i]) {
					
				}
			}
		}
		
		//input: margin and the centre of the plot
		Graph.prototype.drawPlot = function (margin, x, y) {
			this.clearGraph();
			
			this.margin = margin || this.margin || x * 0.1;
			this.x = x || this.width / 2;
			this.y = y || this.y || this.height / 2 + this.textSize;
			
			var margin = this.margin;
			var x = this.x;
			var y = this.y;
			
			var plotHalfWidth = this.width / 2 - margin;
			var plotHalfHeight = this.height / 2 - margin - this.textSize;
			
			var x1 = x - plotHalfWidth;
			var x2 = x + plotHalfWidth;
			var y1 = y - plotHalfHeight;
			var y2 = y + plotHalfHeight;
			
			//var x11 = x - plotHalfWidth + margin / 2;	//for plot items
			
			//data convert
			var converted = _convertArrObjToObjArr(this.reformed.data);
			//pick index and save some where else
			var index = converted.index;
			delete converted.index;
			
			var stepY = (y2 - y1) / this.reformed.size;
			var offsetY = 0;
			for (var i in converted) {
				var dataPack = {
					dataArray: converted[i],
					max: this.dataPack[i].max,
					min: this.dataPack[i].min,
				}
				
				//base line of this plot
				this.drawLine(x1, y1 + offsetY + stepY - this.textSize * 1.5, x2, y1 + offsetY + stepY - this.textSize * 1.5, '#AAAAAA', 1);
				//top line of this plot
				//this.drawLine(x1, y1 + offsetY, x2, y1 + offsetY, '#FFAAAA', 1);
				this.drawRect(x1, y1 + offsetY, x2, y1 + offsetY + stepY - this.textSize * 1.5, '#FAEEEE', 1, true);
				//plot the array to dot/line/bar
				this.drawArray(x1, y1 + offsetY, x2, y1 + offsetY + stepY - this.textSize * 1.5, dataPack, 3, defaultDataColorArray[i], true);
				//plot title
				this.drawText(i, x1 + margin / 2,  y1 + offsetY + stepY - this.textSize);
				offsetY += stepY;
			}
			
			//title
			this.drawText(this.title, x1, y1 - this.textSize * 1.2, this.textSize * 1.2);
			//x/y axis
			//this.drawLine(x1, y1, x1, y2, '#f00', 1);
			//this.drawLine(x1, y1, x1, y2 - this.textSize * 1.5, '#f22', 1);	//y axis
			//this.drawLine(x1, y2, x2, y2, '#f00', 1);	//x axis
			
			//debug border
			//this.drawLine(x1, y1, x2, y1, '#f0f', 1);
			//this.drawLine(x2, y1, x2, y2, '#f0f', 1);
			
			this.canvas.style.border = '1px solid #C8C8C8';
			
			return {
				index: index,
				converted: converted,
			};
		}
		
		
		var defaultDataColorArray = {
			smallerMix: '#aa0000',
			smallerSlice: '#00aa00',
			biggerMix: '#aa00aa',
			biggerSlice: '#00aaaa',
			fitMix: '#0000aa',
			unmatched: '#aaaa00',
			//'#ff00ff',
			//'#00ffff',
		};
		var defaultColorArray = [
			'#ff0000',
			'#00ff00',
			'#0000ff',
			'#ffff00',
			'#ff00ff',
			'#00ffff',
		];
		
		Graph.prototype.drawArray = function (x1, y1, x2, y2, dataPack, width, color, isFill) {
			var ctx = this.ctx;
			
			var dataArray = dataPack.dataArray;
			var max = dataPack.max;
			var min = dataPack.min;
			
			var step = (x2 - x1) / (dataArray.length - 1);
			//step = step > 30 ? 30 : step;	//limit max width
			/**/
			//draw Line
			ctx.strokeStyle = color || '#000000';
			ctx.lineWidth = width || 1;
			ctx.beginPath();
			ctx.moveTo(x1, y2);
			for (var i in dataArray) {
				var x = x1 + step * i;
				var y = y2 - (dataArray[i]) / (max) * (y2 - y1);
				ctx.lineTo(x, y);
			}
			ctx.stroke();
			/**/
			/**/
			//draw point
			for (var i in dataArray) {
				var x = x1 + step * i;
				var y = y2 - (dataArray[i]) / (max) * (y2 - y1);
				this.drawCircle(x, y, width, color, isFill)
			}
			/**/
			/*
			//draw bar
			ctx.fillStyle=color || "#000000";
			for (var i in dataArray) {
				var x = x1 + step * i;
				var y = y2 - (dataArray[i]) / (max) * (y2 - y1);
				
				ctx.rect(x, y, step, y2-y);
				if (isFill) ctx.fill();
				else ctx.stroke();
			}
			*/
		}
		Graph.prototype.drawCircle = function (x, y, radius, color, isFill) {
			var ctx = this.ctx;
			ctx.fillStyle=color || "#000000";
			ctx.beginPath();
			ctx.arc(x, y, radius, 0, Math.PI*2, true);
			ctx.closePath();
			if (isFill) ctx.fill();
			else ctx.stroke();
		}
		
		Graph.prototype.drawRect = function (sx, sy, ex, ey, color, lineWidth, isFill) {
			var ctx = this.ctx;
			ctx.strokeStyle = color || '#000000';
			ctx.fillStyle=color || "#000000";
			ctx.lineWidth = lineWidth || 1;
			ctx.rect(sx, sy, ex-sx, ey-sy);
			if (isFill) ctx.fill();
			else ctx.stroke();
		}
		
		Graph.prototype.drawLine = function (sx, sy, ex, ey, color, lineWidth) {
			var ctx = this.ctx;
			ctx.beginPath();
			ctx.strokeStyle = color || '#000000';
			ctx.lineWidth = lineWidth || 1;
			ctx.moveTo(sx, sy);
			ctx.lineTo(ex, ey);
			ctx.stroke();	//instead of close path
		}
		
		Graph.prototype.drawText = function (text, x, y, size, color) {
			var ctx = this.ctx;
			textSize = size || this.textSize;
			ctx.font= textSize + "px Verdana";
			ctx.fillStyle=color || "#000000";
			ctx.fillText(text, x, y + textSize / 2);
		}
		
		Graph.FromEnum = function (targetEnum) {
			if (targetEnum.Graph) return targetEnum.Graph;
			//reverse record enum
			return Graph;
		}
		
		return Graph;
	})();
	InfoExtractor.Graph = Graph;
		
	
})(InfoExtractor);