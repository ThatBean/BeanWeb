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
	//Query: process string query, and store the easier to use query
	//	Find Site-value combination to Uniqueness
	var Query = (function (Query) {
		function Query(title) {
			this.title = title || 'info/site';
			//something else will be added later using following functions
		}
		
		//find all possible unique in given range
		Query.prototype.queryRange = function (rangeString) {
			if (!rangeString) return;
			this.hasRange = 'range'; //
			//index-selectedNumber
			//value-is selected
			this.Range = _toRange(rangeString);
			return;
		}
		
		//Set a range of selected array(column)
		Query.prototype.queryMix = function (mixString, maxMix, minMix) {
			if (mixString) {
				this.hasMixSelected = 'mixSelected'; //
				//index-
				//value-mix array / or check all mix
				this.MixSelected = _toMixSelected(mixString);
			}
			if (maxMix) {
				this.hasMixAll = 'mixAll'; //
				this.maxMix = maxMix || 3; //
				this.minMix = minMix || 2; //
			}
			return;
		}
		
		//Merge some elements in some EnumArray
		Query.prototype.queryMerge = function (mergeString) {
			if (!mergeString) return;
			this.hasMerge = 'merge'; //
			//index-selectedNumber
			//value-mergeObject
			this.Merge = _toMerge(mergeString);
			return;
		}
		
		//Only select sequences(rows) which match specified values at specified locations
		Query.prototype.querySpecified = function (specifiedString) {
			if (!specifiedString) return;
			this.hasSpecified = 'specified'; //
			//index-selectedNumber
			//value-specified value Array
			this.Specified = _toSpecified(specifiedString);
			return;
		}
		
		//sample: "1,4,56-80,200,1356"
		function _toRange(strTgt) {
			if (!strTgt) return;
			var resArray = new Array();
			var arrTgt = strTgt.split(',');
			for (var i in arrTgt) {
				var isRange = (arrTgt[i].search(/-/) != -1);
				if (isRange) {
					var range = arrTgt[i].split('-');
					var rangeFrom = parseInt(range[0]);
					var rangeTo = parseInt(range[1]);
					for (var j = rangeFrom; j <= rangeTo; j++) {
						resArray[j] = true;
					}
				}
				else {
					var single = parseInt(arrTgt[i]);
					resArray[single] = true;
				}
			}
			return resArray;
		}
		//sample: "2|23|45,12|32,23|1|2"
		//sample: "" <-- no mix
		function _toMixSelected(strTgt) {
			if (!strTgt) return;
			var resArray = new Array();
			var arrTgt = strTgt.split(',');
			for (var i in arrTgt) {
				var mix = arrTgt[i].split('|');
				for (var j in mix) {
					mix[j] = parseInt(mix[j]);
				}
				resArray.push(mix);
			}
			return resArray;
		}
		//sample: "10>Aaa>Aaa|Aab|Aac,10>Bbb>Bbb|bb|BB,15>CCC>ccc|CCC"
		function _toMerge(strTgt) {
			if (!strTgt) return;
			var resArray = new Array();
			var arrTgt = strTgt.split(',');
			for (var i in arrTgt) {
				var mergeArray = arrTgt[i].split('>');
				//get components
				var mergeLocate = parseInt(mergeArray[0]);
				var mergeTgtElement = _compress(mergeArray[1]);
				var mergeOrgElementArray = mergeArray[2].split('|');
				//check if has object in array at location
				resArray[mergeLocate] = resArray[mergeLocate] || new Object();
				//add merge rules
				for (var j in mergeOrgElementArray) {
					resArray[mergeLocate][_compress(mergeOrgElementArray[j])] = mergeTgtElement;
				}
			}
			return resArray;
		}
		//sample: "124=j,12=k|r|t,234=e"
		//sample: "0=human,2=2001|2002,3=N9"
		function _toSpecified(strTgt) {
			if (!strTgt) return;
			var resArray = new Array();
			var arrTgt = strTgt.split(',');
			for (var i in arrTgt) {
				var pair = arrTgt[i].split('=');
				var pairLocate = parseInt(pair[0]);
				var pairValueArray = pair[1].split('|');
				for (var j in pairValueArray) {
					pairValueArray[j] = _compress(pairValueArray[j]);
				}
				resArray[pairLocate] = pairValueArray;
			}
			return resArray;
		}
		
		//slice useless ' ', '\t' and '\n' at both sides of stringTarget
		function _compress(strTgt) {
			var a = strTgt.search(/[^ \t\n]/);
			var b = strTgt.search(/[ \t\n]*$/);
			return (a == -1 ? undefined : strTgt.slice(a,b));
		}
		
		return Query;
	})();
	InfoExtractor.Query = Query;
	
	
	
	///#########################################################################################
	///#########################################################################################
	///#########################################################################################
	///#########################################################################################
	
	// load an array of data for analysis
	var AnalyserII = (function (AnalyserII) {
		function AnalyserII(DataPack, ratioTooMuchElements, filterSingle) {
			this.DataPack = DataPack;// || new Array();//must have
			this.ratioTooMuchElements = ratioTooMuchElements || 0.75;
			this.filterSingle = filterSingle || true;
			//reform to get
			this.DataEnum = {
				Sequence: _reformData('Sequence', DataPack),
				ExtraInfo: _reformData('ExtraInfo', DataPack)
			};
			
			/// TODO: remove all-the-same and all-not-same
			this.DataEnumFilter = {
				Sequence: _filterDataEnum(this.DataEnum.Sequence, this.ratioTooMuchElements, this.filterSingle),
				ExtraInfo: _filterDataEnum(this.DataEnum.ExtraInfo, this.ratioTooMuchElements, this.filterSingle)
			}
			
			this.DataDes = _getDataDes(DataPack);
			//if something else
		}
		
		//private function, first step, reform DataPack and convert to Enum
		function _reformData(targetPackMark, DataPack) {
			var resultArray = new Array();
			//init array in array
			for (var i in DataPack[0][targetPackMark]) {
				resultArray.push(new Array());
			}
			//loop and reform
			for (var i in DataPack) {
				var targetArray = DataPack[i][targetPackMark];
				for (var j in targetArray) {
					resultArray[j].push(targetArray[j]);
				}
			}
			//to Enum
			var resultEnum = new Array();
			for (var i in resultArray) {
				//resultEnum.push(new InfoExtractor.Enum(resultArray[i], i + '_' + targetPackMark));
				resultEnum.push(new InfoExtractor.Enum(resultArray[i], i + '|' + targetPackMark));
			}
			return resultEnum;
		}
		//replace all-the-same Enum with null, and record a simple string/character in the filtered array
		function _filterDataEnum(enumArray, ratioTooMuchElements, filterSingle) {
			var filteredArray = new Array();
			var totalElement = enumArray[0].EnumArray.length;
			var tooMuchElement = totalElement * ratioTooMuchElements;
			var tooMuchNotice = ' different element, too much for ratio = ' 
					+ tooMuchElement + '/' + totalElement 
					+ ' = ' + ratioTooMuchElements;
			console.log('tooMuchElement = '+tooMuchElement);
			for (var i in enumArray) {
				enumArray[i].countElement();
				if (filterSingle) {
					var enumSize = enumArray[i].checkNotSingleSize();
				}
				else {
					var enumSize = enumArray[i].getElementSize();
				}
				if (enumSize == 1) {
					//mark null(delete) and record filtered
					filteredArray[i] = enumArray[i].EnumArray[0];
					//enumArray[i] = undefined;
					delete enumArray[i];
				}
				else if (enumSize >= tooMuchElement) {
					//record filtered
					console.log('found');
					filteredArray[i] = enumSize + tooMuchNotice;
					//enumArray[i] = undefined;
					//delete enumArray[i];
				}
			}
			return filteredArray;
		}
		//get the description line in data
		function _getDataDes(DataPack) {
			var resultArray = new Array();
			//loop and reform
			for (var i in DataPack) resultArray.push(DataPack[i].Des);
			return resultArray;
		}
		///#########################################################################################
		///#########################################################################################
		//Get a Query
		AnalyserII.prototype.querylize = function (queryStringPack) {
			//convert String to Query
			var infoQuery = _querylize('info', queryStringPack.info);
			var siteQuery = _querylize('site', queryStringPack.site);
			
			//pack up
			var querylizePack = {
				infoQuery: infoQuery,
				siteQuery: siteQuery
			};
			return querylizePack;
		}
		
		function _querylize(queryTitle, stringPack) {
			var resQuery = new Query(queryTitle);
			
			resQuery.queryRange(stringPack.range);
			resQuery.queryMix(stringPack.mixSelected, stringPack.maxMix, stringPack.minMix);
			resQuery.queryMerge(stringPack.merge);
			resQuery.querySpecified(stringPack.specified);
			
			return resQuery;
		}
		
		///#########################################################################################
		///#########################################################################################
		//Pick the Query selected Data
		AnalyserII.prototype.pick = function (querylizePack) {
			//pick for info and site
			var infoPick = _pick(this.DataEnum.ExtraInfo, this.DataEnumFilter.ExtraInfo, querylizePack.infoQuery);
			var sitePick = _pick(this.DataEnum.Sequence, this.DataEnumFilter.Sequence, querylizePack.siteQuery);
			//select query data
			var pickPack = {
				infoPick: infoPick,
				sitePick: sitePick
			};
			return pickPack;
		}
		///#
		function _pick(enumArray, filterArray, query) {
			//Query picked data will be stored in these packs
			//the un-merged array/Enum will be reference
			//Merged and Mixed Enum will be newly-created, single-use
			var tempEnumArray = enumArray.slice(0);//simple copy to apply merge
			var enumPicked = new Array();
			var enumMixed = new Array();
			//Merge Elements In Enum
			//Need to create new Enum to replace the reference in tempEnumArray
			if (query.hasMerge) {
				for (var i in query.Merge) {
					if (tempEnumArray[i] && !filterArray[i]) {
						var mergedEnum = InfoExtractor.Enum.MergeElement(tempEnumArray[i], query.Merge[i]);
						tempEnumArray[i] = mergedEnum;
					}
				}
			}
			
			//Range check
			if (query.hasRange) {
				for (var i in query.Range) {
					if (tempEnumArray[i] && !filterArray[i]) {
						query.Range[i] = enumPicked.length;
						enumPicked.push(tempEnumArray[i]);
					}
				}
			}
			else {
				for (var i in tempEnumArray) {	//pick all unfiltered array
					if (!filterArray[i]) {
						enumPicked.push(tempEnumArray[i]);
					}
				}
			}
			
			
			//Specified check(select rows)
			var filteredSpecified = new Array();
			if (query.hasSpecified) {
				for (var i in query.Specified) {
					if (tempEnumArray[i]  && !filterArray[i]) {
						console.log('filtering '+i);
						_pick_CheckSpecified(
							filteredSpecified, 
							query.Specified[i], //specified values for this 
							tempEnumArray[i].EnumArray	//value array in Enum to check
						);
					}
				}
				//apply filter(remove rows) only to enumPicked(no need to tempEnumArray)
				//apply later, after merged filters
			}
			
			//Mix recipe or mix all
			///enumMixed///
			if (query.hasMixSelected) {
				//mix selected in tempEnumArray
				for (var i in query.MixSelected) {
					var newEnumMixed = _pick_MixSelected(tempEnumArray, query.MixSelected[i]);
					if (newEnumMixed) enumMixed.push(newEnumMixed);
					//this is enum in array
				}
			}
			
			var _pickPack = {
				enumPicked: enumPicked,
				enumMixed: enumMixed,
				filteredSpecified: filteredSpecified
			};
			return _pickPack;
		}
		
		function _pick_CheckSpecified(filtered, specifiedArray, enumDataArray) {
			//mark all unspecified locate in filtered
			var isSpecified;
			for (var j in enumDataArray) {
				isSpecified = false;
				for (var k in specifiedArray) {
					if (enumDataArray[j] == specifiedArray[k]) {
						isSpecified = true;
						break;
					}
				}
				if (isSpecified === false) {
					//console.log('filtered '+j);
					filtered[j] = 'filtered';
				}
			}
			return;
		}
		
				
		///#########
		
					//mix all in enumPicked
					/// Later to mix, after the select the un divided Enum
					/*
					for (var i = query.minMix; i <= query.maxMix; i++) {
						var newEnumMixedArray = _pick_MixAll(enumPicked, i);
						if (newEnumMixedArray) enumMixed = enumMixed.concat(newEnumMixedArray);
						//this is array in array
					}
					*/
					
		function _pick_MixAll(enumArray, mixSize, startAt, preMixedEnum) {
			//enumArray.length = 4;
			if (enumArray.length < mixSize + startAt) return;	//not enough for mix
			var mixedEnumArray = new Array();
			startAt = startAt || 0;
			//console.log('===MixAll-Size: '+mixSize+' startAt: '+startAt);
			for (var i = startAt; i < enumArray.length; i++) {
				if (mixSize != 1) {
					//pick and combine to pre mix
					var newPreMixedEnum = preMixedEnum ? InfoExtractor.Enum.Mix(preMixedEnum, enumArray[i]) : enumArray[i];
					//console.log('go down at '+i+' enumTitle='+newPreMixedEnum.title);
					//go down
					var newEnumArray = _pick_MixAll(enumArray, mixSize - 1, i + 1, newPreMixedEnum);
					//collect
					if (newEnumArray) mixedEnumArray = mixedEnumArray.concat(newEnumArray);
				}
				else {
					var mixedEnum = InfoExtractor.Enum.Mix(preMixedEnum, enumArray[i]);
					//console.log('End at '+i+' mixedEnumTitle='+mixedEnum.title);
					mixedEnumArray.push(mixedEnum);
				}
			}
			return mixedEnumArray;
		}
		///#########
		
		
		
		function _pick_MixSelected(enumArray, mixList) {
			var enumList = new Array();
			//pick Enum
			for (var i in mixList) {
				if (enumArray[mixList[i]]) enumList.push(enumArray[mixList[i]]);
			}
			if (enumList.length < 2) return;
			return InfoExtractor.Enum.MixList(enumList);
		}
		
		//
		//now usable: picked EnumArray
		///#########################################################################################
		///#########################################################################################
		
		//apply some query, filter All-the-Same, All-but-one and All-different
		AnalyserII.prototype.filter = function (pickPack) {
			//
			//combine
			var infoPickTotal = pickPack.infoPick.enumPicked.concat(pickPack.infoPick.enumMixed);
			var sitePickTotal = pickPack.sitePick.enumPicked.concat(pickPack.sitePick.enumMixed);
			//
			var infoFilterSpecified = pickPack.infoPick.filteredSpecified;
			var siteFilterSpecified = pickPack.sitePick.filteredSpecified;
			
			//combine specified filter
			var filterSpecified = _filter_MixFilter(infoFilterSpecified, siteFilterSpecified);
			
			var data_pick_mapper = _toMapper(filterSpecified, this.DataDes.length);
			
			//apply filter of rows
			if (filterSpecified) {
				_filter_ApplyFilter(filterSpecified, infoPickTotal);
				_filter_ApplyFilter(filterSpecified, sitePickTotal);
				//filter the description also
				var pickDes = _filter_ApplyFilterDes(filterSpecified, this.DataDes);
			}
			
			
			//reFilter the All-the-Same, All-but-one and All-different(not likely to have)
			var infoReFilter = _filterDataEnum(infoPickTotal, this.ratioTooMuchElements);
			var siteReFilter = _filterDataEnum(sitePickTotal, this.ratioTooMuchElements);
			
			
			var filterPack = {
				infoPickTotal: infoPickTotal,
				sitePickTotal: sitePickTotal,
				infoReFilter: infoReFilter,
				siteReFilter: siteReFilter,
				pickDes: pickDes || this.DataDes,
				filterSpecified: filterSpecified,
				data_pick_mapper: data_pick_mapper
			};
			return filterPack;
		}
		
		function _toMapper(filterArray, orgLength) {
			var index = 0;
			var mapper = new Array();
			for (var i = 0; i < orgLength; i++) 
				if (!filterArray || !filterArray[i]){
					mapper[index] = i;
					index++;
				}
			return mapper;
		}
		
		function _filter_MixFilter(filter1, filter2) {
			var fLength = (filter1.length > filter2.length) ? filter1.length : filter2.length;
			var mixedFilter = new Array();
			var hasFilter = false;
			for (var i = 0; i < fLength; i++) {
				var isFiltered = filter1[i] || filter2[i];
				mixedFilter[i] = isFiltered;
				hasFilter = isFiltered || hasFilter;
			}
			if (hasFilter == false) {
				return;//no actual filter
			}
			return mixedFilter;
		}
		
		//using Enum.filter to create a filtered Enum and return
		function _filter_ApplyFilter(filtered, enumArray) {
			for (var i in enumArray) {
				enumArray[i] = InfoExtractor.Enum.Filter(enumArray[i], filtered);
			}
		}
		function _filter_ApplyFilterDes(filtered, desArray) {
			var filteredDesArray = new Array();
			for (var i in desArray) {
				if (!filtered[i]) filteredDesArray.push(desArray[i]);
			}
			return filteredDesArray;
		}
		///#########################################################################################
		///#########################################################################################
		
		//Tablelize the picked Data, pair by pair
		AnalyserII.prototype.tablelize = function (filterPack) {
			//tablelize pair
			//Table
			
			var infoPickTotal = filterPack.infoPickTotal;
			var sitePickTotal = filterPack.sitePickTotal;
			
			//create the tables(size: m*n);
			var tables = _tablelize(infoPickTotal, sitePickTotal);
			
			var tablelizePack = {
				tables: tables
			};
			return tablelizePack;
		}
		
		function _tablelize(infoEnumArray, siteEnumArray) {
			var tables = new Array();
			for (var i in infoEnumArray) {
				var tempArray = new Array();
				infoEnumArray[i].countElement();	//for title
				for (var j in siteEnumArray) {
					siteEnumArray[j].countElement();
					var tempTable = InfoExtractor.Table.fromEnum(infoEnumArray[i], siteEnumArray[j]);
					tempTable.infoEnum = infoEnumArray[i];
					tempTable.siteEnum = siteEnumArray[j];
					tempArray.push(tempTable);
				}
				tables.push(tempArray);
			}
			return tables;
		}
		
		//Analysis the tablelized data
		AnalyserII.prototype.analysis = function (tablelizePack, analysisMethod) {
			//run analysis
			//Analysis
			var tables = tablelizePack.tables;
			var results = new Array();
			var reportHTMLs = new Array();
			
			//Marked infoEnum value by siteEnum value
			var MarkedPartially = new Array();	//A in B
			var MarkedTotally = new Array();	//A = B
			//Grouped infoEnum value by siteEnum value
			var Grouped = new Array();	//A,B,C in D
			
			for (var i in tables) {
				var tempArray = new Array();
				for (var j in tables[i]) {
					//save some info back to SITE Enum Object(orgEnum2)
					//Enum.Marked(#info-value)
					//Enum.Grouped(#info array-value)
					//return pack of result
					
					var table = tables[i][j];
					var infoEnum = table.infoEnum;
					var siteEnum = table.siteEnum;
					var title = 'Analysis of ' + infoEnum.title + ' and '+ siteEnum.title;
					
					var analysis = new Analysis(table, infoEnum, siteEnum, title);
					analysis.run(analysisMethod);
					if (analysis.getReportHTML()) {
						reportHTMLs.push(analysis.getReportHTML());
						tempArray.push(analysis);
						
						//collect marked and grouped
						//reverse record in Enum
						MarkedPartially = MarkedPartially.concat(_collectMarkedGrouped('MarkedPartially', analysis, infoEnum, siteEnum));
						MarkedTotally = MarkedTotally.concat(_collectMarkedGrouped('MarkedTotally', analysis, infoEnum, siteEnum));
						Grouped = Grouped.concat(_collectMarkedGrouped('Grouped', analysis, infoEnum, siteEnum));
					}
				}
				results.push(tempArray);
			}
			
			var analysisPack = {
				results: results,
				reportHTMLs: reportHTMLs,
				MarkedPartially: MarkedPartially,
				MarkedTotally: MarkedTotally,
				Grouped: Grouped,
			}
			return analysisPack;
		}
		
		function _collectMarkedGrouped(targetMark, analysis, infoEnum, siteEnum) {
			var resArray = new Array();
			var targetArray = analysis[targetMark];
			var prefixArray = [infoEnum.title, siteEnum.title];
			for (var i in targetArray) {
				resArray.push(prefixArray.concat(targetArray[i]));
				//siteEnum[targetArray[i][0]] = siteEnum[targetArray[i][0]] || new Array();
				//siteEnum[targetArray[i][0]].push(infoEnum.title + targetMark);
				//infoEnum[targetArray[i][1]] = infoEnum[targetArray[i][1]] || new Array();
				//infoEnum[targetArray[i][1]].push(siteEnum.title + targetMark);
				
				_reverseCollect(targetMark, targetArray[i], siteEnum, infoEnum);
			}
			return resArray;
		}
		
		function _reverseCollect(markMark, markElementArray, Enum0, Enum1) {
			Enum0[markMark] = Enum0[markMark] || new Object();
			Enum0[markMark][markElementArray[0]] = Enum0[markMark][markElementArray[0]] || new Array();
			Enum0[markMark][markElementArray[0]].push([markElementArray[1], Enum1.title]);
			
			Enum1[markMark] = Enum1[markMark] || new Object();
			Enum1[markMark][markElementArray[1]] = Enum1[markMark][markElementArray[1]] || new Array();
			Enum1[markMark][markElementArray[1]].push([markElementArray[0], Enum0.title]);
		}
		///#########################################################################################
		///#########################################################################################
		///#########################################################################################
		//the whole trip
		///not used any more, only the data picking part
		/*
		AnalyserII.prototype.run = function (queryStringPack, analysisMethod) {
			
			//is the analysis be based on:
			//		quality:	has or hasn't
			//		quantity:	much or few
			analysisMethod = analysisMethod || 'quantity|quality';
			
			var querylizePack = this.querylize(queryStringPack);
			var pickPack = this.pick(querylizePack);
			var filterPack = this.filter(pickPack);
			var tablelizePack = this.tablelize(filterPack);
			var analysisPack = this.analysis(tablelizePack, analysisMethod);
			
			var reportHTML = analysisPack.reportHTMLs.join('');
			
			
			
			//pack up
			var analyserPack = {
				_00_queryStringPack: queryStringPack,
				_01_querylizePack: querylizePack,
				_02_pickPack: pickPack,
				_03_filterPack: filterPack,
				_04_tablelizePack: tablelizePack,
				_05_analysisPack: analysisPack,
				reportHTML: reportHTML
			};
			return analyserPack;
		}
		*/
		//only picking data
		AnalyserII.prototype.pickQuery = function (queryStringPack) {
			var querylizePack = this.querylize(queryStringPack);
			var pickPack = this.pick(querylizePack);
			var filterPack = this.filter(pickPack);
			//pack up
			var analyserPack = {
				_00_queryStringPack: queryStringPack,
				_01_querylizePack: querylizePack,
				_02_pickPack: pickPack,
				_03_filterPack: filterPack
			};
			return analyserPack;
		}
		
		AnalyserII.prototype.collectScrolltablePack = function (type) {
			var type = type || 'Array';
			if (type == 'Array') {
				var mainInfo = _collectFromEnumArray(this.DataEnum.ExtraInfo, 'EnumArray');
				var mainSite = _collectFromEnumArray(this.DataEnum.Sequence, 'EnumArray');
				var row = this.DataDes;
			}
			if (type == 'Enum') {
				var mainInfo = _reformElements(_collectFromEnumArray(this.DataEnum.ExtraInfo, 'Elements'));
				var mainSite = _reformElements(_collectFromEnumArray(this.DataEnum.Sequence, 'Elements'));
				var row = null;
			}
			var colInfo = _collectFromEnumArray(this.DataEnum.ExtraInfo, 'title');
			var colSite = _collectFromEnumArray(this.DataEnum.Sequence, 'title');
			
			
			//pack up
			var scrolltablePack = {
				mainInfo: mainInfo,
				mainSite: mainSite,
				colInfo: colInfo,
				colSite: colSite,
				row: row
			};
			return scrolltablePack;
		}
		
		function _collectFromEnumArray(tgtEnumArray, mark) {
			var collector = new Array();
			for (var i in tgtEnumArray) {
				collector.push(tgtEnumArray[i][mark]);
			}
			return collector;
		}
		function _reformElements(elementsArray) {
			var collector = new Array();
			for (var i in elementsArray) {
				collector.push(_elementsToCellHTML(elementsArray[i]));
			}
			return collector;
		}
		function _elementsToCellHTML(elements) {
			var collector = new Array();
			for (var i in elements) {
				collector.push(elements[i] + ': ' + i);
			}
			return collector;
		}	
		
		return AnalyserII;
	})();
	InfoExtractor.AnalyserII = AnalyserII;
	
	
})(InfoExtractor);


function analysisInit(extractedData) {
	//create an analyser
	var analyserII = new InfoExtractor.AnalyserII(extractedData);
	GlobalLog.add('created new Analyser from extracted data..');
	return analyserII;
}


function analysisPickQuery(analyserII, queryStringPack) {
	/*
	var queryStringPack = {
		info: {
			//specified: '1=H7N9',
			//mixSelected: '0|2|3,0|2,2|3',
			//merge: '3>2048>NaN|2013|2001',
			//minMix: 2,
			//maxMix: 2,
		},
		site: {
			//range: '2,5,10-40',
			//mixSelected: '5|7|8,3|40',
			//minMix: 2,
			//maxMix: 2,
			//specified: '291=i',
		}
	}
			resQuery.queryRange(stringPack.range);
			resQuery.queryMix(stringPack.mixSelected, stringPack.maxMix, stringPack.minMix);
			resQuery.queryMerge(stringPack.merge);
			resQuery.querySpecified(stringPack.specified);
	*/
	
	
	GlobalLog.add('picking data from extracted data..');
	var result =  analyserII.pickQuery(queryStringPack);
	GlobalLog.add('get data from extracted data..');
	return result;
}

