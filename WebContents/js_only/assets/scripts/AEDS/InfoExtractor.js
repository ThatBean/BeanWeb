/**
 * Info Extractor JS
 * 
 * This will gather all useful information, formate and make them analysis ready
 * 
 * 
 * 
 * 
 * 
 **/
 
 
var GlobalDebug = GlobalDebug || {};	// for debug use(view in browser)
var GlobalLog = GlobalLog || {
	set: function (HTML) {document.getElementById('log').innerHTML = HTML;},
	add: function (HTML) {document.getElementById('log').innerHTML += HTML+'<br/>';},
}

/// TODO: add clipboard hijacking
/*
var theClipBoardData = undefined;
document.addEventListener("paste", function(e) {
    e.preventDefault();
    if (e.clipboardData) {
        content = (e.originalEvent || e).clipboardData.getData('text/plain');
        //document.execCommand('insertText', false, content);
    }
    else if (window.clipboardData) {
        content = window.clipboardData.getData('Text');
        //document.selection.createRange().pasteHTML(content);
    }
	theClipBoardData = content;
	alert("get Pasted ClipBoard Data!");
	
	var appendInfo = "[All Data is here]";
	
	if (theClipBoardData.length > 200) {appendInfo = "[Displayed only part of data for speed]"}
	
	document.getElementById('DataFunData').value = "[Data from ClipBoard] \n" + theClipBoardData.slice(0, 200) + "\n" + appendInfo;
});
*/

var InfoExtractor = InfoExtractor || {};

(function (InfoExtractor) {
	//data to store information: seq + extra
	
	var Data = (function (Data) {
		function Data(type, des) {
			this.Type = type;
			this.Des = des;	//description
			if (type === Data.typeFasta) {
				this.Sequence = arguments[2] || "";
				this.ExtraInfo = arguments[3] || [];
			}
			else {
				this.Sequence = arguments[2] || "";
				this.ExtraInfo = arguments[3] || [];
			}
			//if something else
		}
		
		Data.typeFasta = "fasta";
		
		Data.prototype.toString = function (splitter, showType, showRaw) {
			var tempString = "";
			splitter = splitter || "\t";
			if (showType) {
				tempString += "Type:" + this.Type + splitter;
			}
			
			if (showRaw) {
				tempString += "Raw:" + this.Des + '\n' + this.Sequence + splitter;
			}
			
			if (this.Type === Data.typeFasta) {
				tempString += "ExtraInfo:" + this.ExtraInfo + splitter;
				tempString += "Sequence:" + this.Sequence + splitter;
			}
			return tempString;
		}
		return Data;
	})();
	InfoExtractor.Data = Data;
	
	
	
	
	var Extractor = (function () {
        function Extractor() {
			//this.ExtractedData = new Array();	//All data inside
			//if something else
        }
		
		//Extract fasta data
        Extractor.prototype.addFastaRule = function (splitter, compress, keyMapString, mapSplitter) {
			this.Splitter = splitter || "|";
            this.Compress = compress || true;
            this.KeyMap = this.getKeyMap(keyMapString, mapSplitter) || [];
			console.log('KeyMap: ' + this.KeyMap);
        }
		
        Extractor.prototype.getKeyMap = function (keyMapString, mapSplitter) {
			if (!keyMapString) return;
			if (!mapSplitter) mapSplitter = this.Splitter;
			return keyMapString.replace(/[ \n\t]/g,"").split(mapSplitter);
        }
		
		/** function getExtraInfo: Info Extraction description line
		 * Key-Value mapping rule:
		 * Suppose the infoString is like:
		 *     "> (0) | (1) | (2) | (3) | (4) | (5)"
		 * --the value is represented by (0)~(5)
		 * 
		 * Then suppose the KeyMap is like:
		 *     [ null , <3> , <1> , null , <0> , <2> ]
		 * --the mapped res will be:
		 *     [ (4) , (2) , (5) , (1) ]
		 * ----the selected info will be placed in selected order
		 * 
		 * Edit: Added convert to Year for 'dd/mm/yyyy':
		 * ---Simply use '-2' for '2' in KeyMap
		 **/
		Extractor.prototype.getExtraInfo = function (infoString) {
			var res=[];
			var infoArray=infoString.split(this.Splitter);
			
			for (var i = 0; i < this.KeyMap.length; i++) {
				if (this.KeyMap[i]) {	//if there's a key
					if (this.KeyMap[i][0] == '-') {//convert Date to Year
						var dateArray = infoArray[i].replace(/\D/g, '/').split('/');
						var year = parseInt(dateArray.pop());
						res[- this.KeyMap[i]] = year;
					}
					else if (this.Compress && infoArray[i]) {
						res[this.KeyMap[i]] = compress(infoArray[i]);
					}
					else {
						res[this.KeyMap[i]] = infoArray[i];
					}
				}
			}
			
			return res;
		}
			//used above
			compress = function (strTgt) {
				var a=strTgt.search(/[^ _\t]/);
				var b=strTgt.search(/[ _\t]*$/);
				return (a==-1?undefined:strTgt.slice(a,b));
			}
		
		
        Extractor.prototype.extractFasta = function (fastaString) {
			if (!fastaString) return;
			var res=[];
			
			/** find the first ">" in the fastaString
			* -1  no ">" found, no complete seq-info-pack
			* 0   starts with ">", the first "arrInfo.shift()" will be empty(null)
			* >0  has junk info before the first ">", need to dispose the first "arrInfo.shift()"
			**/
			
			//sheck if there's at least one ">"
			var firstTitle=fastaString.search(/>/);
			if (firstTitle==-1) return;
			
			var arrInfo=fastaString.split(">");
			arrInfo.shift();//throw first line of junk or null
			
			/** The extraction process:
			 * split with ">", get each seq-info-pack
			 *     split with "\n", get each line
			 *          the first line will be the Info(description)
			 *          the following line will be the sequence segment
			 *              combine and remove useless char
			 *     save Fasta Data Pack to res
			 **/
			
			var tempFastaRaw;
			var tempFastaArray;
			var tempFastaInfo;
			var tempFastaSeq;
			//extract each fasta seq-info-pack
			while(tempFastaRaw = arrInfo.shift()) {
				tempFastaArray = tempFastaRaw.split("\n");
				
				tempFastaInfo = tempFastaArray.shift();	//ectract the ">" line (description line)
				if (undefined == tempFastaInfo || tempFastaArray.length == 0) continue;	//no info line or sequence
				
				tempFastaSeq = "";
				var tempSeqSegment;
				while(tempSeqSegment=tempFastaArray.shift()) {	//rest are split sequence
					tempFastaSeq+=tempSeqSegment.replace(/[0-9 \t\n]/g, "");  //remove: [0-9] [ ] [\t] [\n]
				}
				
				if (!tempFastaSeq) continue;	//nothing useful
				
				tempFastaSeq=tempFastaSeq.toLowerCase();	//clean
				//
				var tempExtraInfoArray = this.getExtraInfo(tempFastaInfo);
				//if (!tempExtraInfoArray)
				
				//save as Data pack for easy extraction
				res.push(new Data(
					Data.typeFasta, 
					tempFastaInfo, 
					tempFastaSeq, 
					tempExtraInfoArray
				));
			}
			
			//res is an Array of Fasta-typed Data
			return res;
        }
		
        return Extractor;
    })();
    InfoExtractor.Extractor = Extractor;
	
})(InfoExtractor);


function getFastaExtractor(splitter, compress, keyMapString, mapSplitter) {
	var fastaExtractor = new InfoExtractor.Extractor();
	fastaExtractor.addFastaRule(splitter, compress, keyMapString, mapSplitter);
	return fastaExtractor;
}
//
function extractFasta(fastaExtractor, fastaString) {
	var res = fastaExtractor.extractFasta(fastaString);
	GlobalDebug.extractFasta = res;
	return res;
}

function extract(fastaString, splitter, compress, keyMapString, mapSplitter) {
	GlobalLog.add('started Extract..');
	var fastaExtractor = getFastaExtractor(splitter, compress, keyMapString, mapSplitter);
	var extractedData = extractFasta(fastaExtractor, fastaString);
	
	GlobalLog.add('finished Extract..');
	if (extractedData) return {
		fastaExtractor: fastaExtractor,
		extractedData: extractedData
	};
}

/* test code
a="A/pigeon/Shanghai/S1421/2013 | EPI_ISL_142903 | A / H7N9 |      | E1 |    	          |  | NA | 6 | A/pigeon/Shanghai/S1421/2013NA | 457636 | "
b="                             |5               |1         |      |    |3                |  |    |5  |                                |7       |0||||||||||||||||2"
packRule01=ie_func_newPackRule("|",b,false);
packRule02=ie_func_newPackRule("|",b,true);
res01=ie_FASTA_des(a,packRule01);
res02=ie_FASTA_des(a,packRule02);
*/
