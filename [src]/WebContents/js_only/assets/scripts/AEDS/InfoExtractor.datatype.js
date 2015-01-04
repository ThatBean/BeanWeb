/**
 * Info Extractor JS
 * 
 * This will gather all useful information, formate and make them SQL ready
 * 
 * 
 * 
 * 
 * 
 **/
 
 
var GlobalDebug = GlobalDebug || {};	// for debug use(view in browser)

var InfoExtractor = InfoExtractor || {};

(function (InfoExtractor) {
	//enum for analysis
	//save key-value(how many key) pairs
	var Enum = (function (Enum) {
		function Enum(enumArray, title, level) {
			this.EnumArray = enumArray;
			this.size = enumArray.length;
			
			this.title = title || 'untitled';
			this.level = level || 1;//how many Enum combined
			//if something else
			
			//this.Elements = new Object();
			//this.countElement();
		}
		
		//count EnumArray and save key-value pair to the Elements
		Enum.prototype.countElement = function () {
			this.Elements = new Object();
			for (var i in this.EnumArray) {
				var key = this.EnumArray[i];
				this.Elements[key] = (this.Elements[key] || 0) + 1;
			}
			return;
		}
		
		Enum.prototype.checkValuable = function (portion) {
			var valuable = 0;
			for (var key in this.Elements) {
				if ((this.Elements[key] / this.size) > portion) {
					valuable++;
				}
			}
			return valuable;
		}
		
		Enum.prototype.checkNotSingleSize = function () {
			var size = 0;
			for (var key in this.Elements) {
				if (this.Elements[key] > 1) {
					size++;
				}
			}
			return size;
		}
		
		Enum.prototype.getElementSize = function () {
			var size = 0;
			for (var key in this.Elements) {
				size++;
			}
			return size;
		}
		
		//to array in array
		Enum.prototype.toArray = function () {
			var tempArray = new Array();
			for (var key in this.Elements) {
				tempArray.push([key, this.Elements[key]]);
			}
			return tempArray;
		}
		//to key array
		Enum.prototype.toKeyArray = function () {
			var tempArray = new Array();
			for (var key in this.Elements) {
				tempArray.push(key);
			}
			return tempArray;
		}
		//to key array
		Enum.prototype.toKeyMap = function () {
			var tempMap = new Object();
			var tempIndex = 0;
			for (var key in this.Elements) {
				tempMap[key] = tempIndex;
				tempIndex++;
			}
			return tempMap;
		}
		//mix two Enum, the size must be same. The mixing order matters
		Enum.Mix = function (enum1, enum2, seperator) {
			if (enum1.size != enum2.size) alert('Error: size mismatch for Enum Mixing!');
			var seperator = seperator || '\t';
			var newEnumArray = new Array();
			for (var i in enum1.EnumArray) {
				newEnumArray.push(enum1.EnumArray[i] + seperator + enum2.EnumArray[i]);
			}
			var mixedTitle = enum1.title + '|' + enum2.title;
			var mixedEnum = new Enum(newEnumArray, mixedTitle, enum1.level + enum2.level);
			return mixedEnum;
		}
		//mix a list of Enum, the size must be same. The mixing order matters
		Enum.MixList = function (enumListArray, seperator) {
			//if (enum1.size != enum2.size) alert('Error: size mismatch for Enum Mixing!');
			var seperator = seperator || '\t';
			var newEnumArray = new Array();
			var mixedTitle;
			var mixedLevel = 0;
			for (var i in enumListArray) {
				for (var j in enumListArray[i].EnumArray) {
					newEnumArray[j] = (newEnumArray[j] ? newEnumArray[j] + seperator : '') + enumListArray[i].EnumArray[j];
				}
				mixedTitle = (mixedTitle ? mixedTitle + '|' : '') + enumListArray[i].title;
				mixedLevel = mixedLevel + enumListArray[i].level;
			}
			var mixedEnum = new Enum(newEnumArray, mixedTitle, mixedLevel);
			return mixedEnum;
		}
		//merge elements in Enum, mergeObject['orgElement'] = 'mergeElement'
		Enum.MergeElement = function (orgEnum, mergeObject) {
			var newEnumArray = new Array();
			for (var i in orgEnum.EnumArray) {
				newEnumArray.push(mergeObject[orgEnum.EnumArray[i]] || orgEnum.EnumArray[i]);
			}
			var mergedEnum = new Enum(newEnumArray, orgEnum.title, orgEnum.level);
			return mergedEnum;
		}
		
		Enum.Filter = function (orgEnum, filterArray) {
			//filter/remove the marked == true index in filterArray
			var newEnumArray = new Array();
			for (var i in orgEnum.EnumArray) {
				if (!filterArray[i]) {
					newEnumArray.push(orgEnum.EnumArray[i]);
				}
			}
			var newEnum = new Enum(newEnumArray, orgEnum.title, orgEnum.level);
			return newEnum;
		}
		return Enum;
	})();
	InfoExtractor.Enum = Enum;
	
	
	//Table for analysis
	var Table = (function (Table) {
		function Table(tableWidth, data, rowTitle, colTitle) {
			this.TableWidth = tableWidth >> 0;
			this.TableData = data || new Array();//number data, stored row-by-row, like imageData
			this.RowTitle = rowTitle || new Array();
			this.ColTitle = colTitle || new Array();
			//this.Title = title || 'Untitled Table';
			//if something else
		}
		
		Table.prototype.getData = function (row, col) {
			return this.TableData[row * this.TableWidth + (col >> 0)];
		}
		
		Table.prototype.getRow = function (index) {
			return index / this.TableWidth >> 0;
		}
		Table.prototype.getCol = function (index) {
			return index % this.TableWidth;
		}
		Table.prototype.getRowCol = function (index) {
			return [
				index / this.TableWidth >> 0, 
				index % this.TableWidth
			];
		}
		
		//calculate sum of row/col
		Table.prototype.calcSum = function () {
			var rowSum = new Array();
			var colSum = new Array();
			var sum = 0;
			
			for (var i in this.TableData) {
				var data = (this.TableData[i] || 0);
				var row = i / this.TableWidth >> 0;
				var col = i % this.TableWidth;
				
				rowSum[row] = (rowSum[row] || 0) + data;
				colSum[col] = (colSum[col] || 0) + data;
				sum += data;
			}
			
			this.RowSum = rowSum;
			this.ColSum = colSum;
			this.Sum = sum;
			return;
		}
		
		//create selected sub-table
		Table.prototype.getSubTable = function (rowSelection, colSelection) {
			var rowTitle = _pickArray(this.RowTitle, rowSelection);
			var colTitle = _pickArray(this.ColTitle, colSelection);
			var tableData = _pickTable(this.TableData, this.TableWidth, rowSelection, colSelection);
			var tableWidth = colTitle.length;
			return new Table(tableWidth, tableData, rowTitle, colTitle);
		}
		
		//mark selected elements with true/1
		function _pickArray(tgtArray, selArray) {
			var resArray = new Array();
			for (var i = 0; i < tgtArray.length; i++) {
				if (selArray[i]) {
					resArray.push(tgtArray[i]);
				}
			}
			return resArray;
		}
		function _pickTable(tgtTableArray, tableWidth, rowSelArray, colSelArray) {
			var resTableArray = new Array();
			for (var i = 0; i < tgtTableArray.length; i++) {
				var row = (i / tableWidth) >> 0;
				var col = i % tableWidth;
				//console.log('scan '+tgtTableArray[i]+" at "+row+"|"+col);
				if (rowSelArray[row] && colSelArray[col]) {
					resTableArray.push(tgtTableArray[i]);
					//console.log('added '+tgtTableArray[i]+" at "+row+"|"+col);
				}
			}
			return resTableArray;
		}
		
		// TODO:
		///toHTML
		Table.prototype.toHTML = function (tableTitle) {
			//header
			var headerHTML = '';
			for (var i in this.ColTitle) {
				headerHTML += '<th>' + this.ColTitle[i] + '</th>';
			}
			if (this.Sum) headerHTML += '<th>Row Sum</th>';	///
			headerHTML = '<thead><tr><th></th>' + headerHTML + '</tr></thead>';
			
			//footer
			var footerHTML = '';
			for (var i in this.ColTitle) {
				if (this.Sum) footerHTML += '<td>' + this.ColSum[i] + '</td>';	///
				else footerHTML += '<td>' + this.ColTitle[i] + '</td>';
			}
			if (this.Sum) footerHTML = '<tfoot><tr><td>Col Sum</td>' + footerHTML + '<td>' + this.Sum + '</td></tr></tfoot>';	///
			else footerHTML = '<tfoot><tr><td></td>' + footerHTML + '</tr></tfoot>';
			
			//body
			var bodyHTML = '';
			for (var i in this.RowTitle) {
				bodyHTML += '<tr><td>' + this.RowTitle[i] + '</td>';
				for (var j in this.ColTitle) {
					//console.log(i+"|"+j+"|"+typeof(i)+"|"+typeof(j)+"|"+i * this.TableWidth + j);
					bodyHTML += '<td>' + (this.getData(i,j) || 0) + '</td>';
				}
				if (this.Sum) bodyHTML += '<td>' + this.RowSum[i] + '</td>';	///
				bodyHTML += '</tr>';
			}
			bodyHTML = '<tbody>' + bodyHTML + '</tbody>';
			
			var HTMLstring = '<table  border="1">';
			if (tableTitle) HTMLstring += '<caption>' + tableTitle + '</caption>';
			HTMLstring += headerHTML + footerHTML + bodyHTML;
			HTMLstring += '</table>';
			
			return HTMLstring;
		}
		
		/// testing use only
		Table.prototype.showT = function (tableTitle) {
			document.getElementById('B_LogA').innerHTML += this.toHTML(tableTitle);
		}
		/// testing use only
		
		//add tableData, Rule: rowArray.length == colArray.length
		Table.fromEnum = function (rowEnum, colEnum) {
			var rowArray = rowEnum.EnumArray;
			var colArray = colEnum.EnumArray;
			//titles
			var rowTitle = rowEnum.toKeyArray();
			var colTitle = colEnum.toKeyArray();
			//temp mapping
			var tempRowMap = rowEnum.toKeyMap();
			var tempColMap = colEnum.toKeyMap();
			//tableWidth
			var tableWidth = colTitle.length;
			//data
			var tableData = new Array();
			
			//var count = 0;
			
			for (var i in rowArray) {
					var index = tempRowMap[rowArray[i]] * tableWidth + tempColMap[colArray[i]];
					tableData[index] = (tableData[index] || 0) + 1;
					//count ++;
			}
			//console.log(count);
			return new Table(tableWidth, tableData, rowTitle, colTitle);
		}
		
		return Table;
	})();
	InfoExtractor.Table = Table;
	
	// a Divide has many slices
	var Divide = (function (Divide) {
		function Divide() {	//the member array
			this.Slices = new Object();	//key - slice
			this.size = 0;
		}
		
		Divide.prototype.addSlice = function (slice, sliceKey) {
			this.Slices[sliceKey] = slice;	//key - slice
			slice.markDivide(this);
			this.size++;
			return;
		}
		
		Divide.prototype.getKeyFromBinaryID = function (binaryID) {
			for (var i in this.Slices) {
				if (this.Slices[i].BinaryID == binaryID) {
					return i;
				}
			}
			return;
		}
		
		function _getObjectLength(tgtObj) {
			var tgtLength = 0;
			for (var i in tgtObj) {tgtLength++;}
			return tgtLength;
		}
		
		///Match Divide
		
		
		Divide.FromEnum = function (targetEnum) {
			if (targetEnum.divide) return targetEnum.divide;
			var totalLength = targetEnum.EnumArray.length;
			//collect the position of each key(or element for enum) in arrays
			var slicesMemberArrays = new Object();
			for (var i in targetEnum.EnumArray) {
				var key = targetEnum.EnumArray[i];
				slicesMemberArrays[key] = slicesMemberArrays[key] || new Array();
				slicesMemberArrays[key].push(i);
			}
			//var slices = new Object();
			var divide = new Divide();
			for (var i in slicesMemberArrays) {
				//slices[i] = new Slice(slicesMemberArrays[i], totalLength);
				var slice = new Slice(slicesMemberArrays[i], totalLength);
				divide.addSlice(slice, i);
			}
			divide.formEnum = targetEnum;	//record enum
			divide.title = targetEnum.title;	//record enum title
			targetEnum.divide = divide;	//reverse record enum
			return divide;
		}
		
		//Get the total count
		Divide.prototype.test = function () {
			return '';
		}
		
		return Divide;
	})();
	InfoExtractor.Divide = Divide;
	
	
	
	// the element inside of Divide
	var Slice = (function (Slice) {
		function Slice(memberArray, totalLength) {	//the member array
			this.BinaryID = _toBinaryArray(memberArray, totalLength).join('');
			
			//check if already has this type of slice
			if (Slice._SlicePool[this.BinaryID]) {
				return Slice._SlicePool[this.BinaryID];
			}
			else {	//new One!
				Slice._SlicePool[this.BinaryID] = this;
				this.length = totalLength;
				this.Members = memberArray;
				this.size = memberArray.length;
				this.markMember();
				
				//link to current pool
				this.pool = Slice._SlicePool;
				this.memberPool = Slice._SliceMemberPool;
			}
		}
		
		Slice._SlicePool = new Object();	//static for slice, store all the slices
		Slice._SliceMemberPool = new Array();	//static for slice, store all the member - slices
		
		//create a new pool for following slices
		Slice.NewPool = function () {
			Slice._SlicePool = new Object();
			Slice._SliceMemberPool = new Array();
		}
		
		function _toBinaryArray(numberedArray, totalLength) {
			var binaryArray = new Array(totalLength);
			for (var i = 0; i < totalLength; i++) {
				binaryArray[i] = 0;
			}
			for (var i in numberedArray) {
				binaryArray[numberedArray[i]] = 1;
			}
			return binaryArray;
		}
		
		
		//Mark which divide this slice in
		Slice.prototype.markDivide = function (upperDivide) {
			this.UpperDivide = this.UpperDivide || new Array();
			this.UpperDivide.push(upperDivide);
			return;
		}
		//Mark which member this slice has
		Slice.prototype.markMember = function () {
			for (var i in this.Members) {
				index = this.Members[i];
				Slice._SliceMemberPool[index] = Slice._SliceMemberPool[index] || new Array();
				Slice._SliceMemberPool[index].push(this);
			}
			return;
		}
		//Get the UpperDivide Title List
		Slice.prototype.getUpperDivideTitleList = function () {
			var titleArray = new Array();
			for (var i in this.UpperDivide) {
				titleArray.push(this.UpperDivide[i].title);
			}
			return titleArray;
		}
		//Get the UpperDivide Title and Key List
		Slice.prototype.getUpperDivideTitleKeyList = function () {
			var titleArray = new Array();
			for (var i in this.UpperDivide) {
				var title = this.UpperDivide[i].title;
				var key = this.UpperDivide[i].getKeyFromBinaryID(this.BinaryID);
				titleArray.push(title + '(' + key + ')');
			}
			return titleArray;
		}
		//Get the UpperDivide Title and Key and Count List
		Slice.prototype.getUpperDivideTitleKeyCountList = function () {
			var titleArray = new Array();
			for (var i in this.UpperDivide) {
				var title = this.UpperDivide[i].title;
				var key = this.UpperDivide[i].getKeyFromBinaryID(this.BinaryID);
				var count = this.size;
				titleArray.push(title + '(' + key + ': ' + count +')');
			}
			return titleArray;
		}
		
		//check if there's a contain relation
		Slice.CheckContain = function (slice1, slice2) {
			//if (slice1 == slice2) return 'equal';
			var combinedBinarySize =  _orMixBinarySize(slice1.BinaryID, slice2.BinaryID);
			if (combinedBinarySize <= slice1.size) return slice1;
			if (combinedBinarySize <= slice2.size) return slice2;
			return;
		}
		
		return Slice;
	})();
	InfoExtractor.Slice = Slice;
	
})(InfoExtractor);
