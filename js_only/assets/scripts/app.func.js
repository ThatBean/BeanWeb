/*
 basic page function needed
 */

//For debug access
var GlobalDebug = GlobalDebug || {};
var GlobalLog = GlobalLog || {
	set: function (HTML) {document.getElementById('log').innerHTML = HTML;},
	add: function (HTML) {document.getElementById('log').innerHTML += HTML+'<br/>';},
}
//check for fun
if (!window.addEventListener) alert("please upgrade your browser?");

var GlobalSave = GlobalSave || {};

//All in one
var B = {
	_onload: function () {
		function _getElementByIdList(tgt, list) {for (var i in list) tgt[list[i]] = document.getElementById(list[i]);}
		_getElementByIdList(B, B._loadIdList);
		//B.BtnClickA();
		
		B.log_win = WinObj.Window.FromCreated('win-log');
		B.log_win.setProtect('close', true);
		B.log_win.toggle('minimize');
		
		B.step00_win = WinObj.Window.FromCreated('step00-Extract');
		B.step01_win = WinObj.Window.FromCreated('step01-Pick');
		B.step02_win = WinObj.Window.FromCreated('step02-Analysis');
		
		//B.step00_win.toggle('minimize');
		//B.step01_win.toggle('minimize');
		//B.step02_win.toggle('minimize');
		
		//B.step00_win.toggle('hide', 'none');
		B.step01_win.toggle('hide', 'none');
		B.step02_win.toggle('hide', 'none');
		
		B.step00_win.setProtect('close', true);
		B.step01_win.setProtect('close', true);
		B.step02_win.setProtect('close', true);
		
		//B.step00_win.addCloseClosure(B.step00_btn_Close_click);
		B.step01_win.addCloseClosure(B.step01_btn_Close_click);
		B.step02_win.addCloseClosure(B.step02_btn_Close_click);
		
		B.step01_win_option_info = WinObj.Window.FromCreated('step01-pick-option-info');
		B.step01_win_option_site = WinObj.Window.FromCreated('step01-pick-option-site');
		B.step01_win_option_info.toggle('minimize');
		B.step01_win_option_site.toggle('minimize');
		
		
		B.step00_btn_Start.addEventListener('click',B.step00_btn_Start_click, false);
		B.step00_btn_Clear.addEventListener('click',B.step00_btn_Clear_click, false);
		B.step00_btn_Close.addEventListener('click',B.step00_btn_Close_click, false);
		
		B.step01_btn_st_Array.addEventListener('click',B.step01_btn_st_Array_click, false);
		B.step01_btn_st_Enum.addEventListener('click',B.step01_btn_st_Enum_click, false);
		
		B.step01_btn_Start.addEventListener('click',B.step01_btn_Start_click, false);
		B.step01_btn_Clear.addEventListener('click',B.step01_btn_Clear_click, false);
		B.step01_btn_Close.addEventListener('click',B.step01_btn_Close_click, false);
		
		
		B.step02_btn_st_Array.addEventListener('click',B.step02_btn_st_Array_click, false);
		B.step02_btn_st_Enum.addEventListener('click',B.step02_btn_st_Enum_click, false);
		
		B.step02_btn_Start.addEventListener('click',B.step02_btn_Start_click, false);
		//B.step02_btn_Clear.addEventListener('click',B.step02_btn_Clear_click, false);	//no button
		B.step02_btn_Close.addEventListener('click',B.step02_btn_Close_click, false);
		
		
		
		/*going to add storage
		*/
		
		B.test_btn_00.addEventListener('click',B.test_btn_00_click, false);
		B.test_btn_01.addEventListener('click',B.test_btn_01_click, false);
	},
	
	_loadIdList: [
		'log',
		
		//options
		'step00_Data',
		'step00_Spiltter',
		'step00_Mapper',
		'step00_Compress',
		
		//for next-step buttons
		'step00_btn_Start',
		'step00_btn_Clear',
		'step00_btn_Close',
		
		//for scrolltable
		'step01_scrolltable_container',
		'step01_btn_st_Array',
		'step01_btn_st_Enum',
		
		//option packs inside mini windows
		'step01_pick_option_info',
		'step01_pick_option_site',
		
		//for next-step buttons
		'step01_btn_Start',
		'step01_btn_Clear',
		'step01_btn_Close',
		
		//for scrolltable
		'step02_scrolltable_container',
		'step02_btn_st_Array',
		'step02_btn_st_Enum',
		
		//for next-step buttons
		'step02_btn_Start',
		//'step02_btn_Clear',
		'step02_btn_Close',
		
		//Tempate HTML pool
		'template_analysis_divide',
		
		
		
		//test use
		'test_btn_00',
		'test_btn_01',
		
		null
	],
	
	step00_btn_Start_click: function () {
		B.step00_result = extract(
			B.step00_Data.value, //fastaString
			B.step00_Spiltter.value, //splitter
			B.step00_Compress.checked, //compress
			B.step00_Mapper.value, //keyMapString
			B.step00_Spiltter.value //mapSplitter
		);
		//show next window
		B.step01_win_Show();
		B.step00_win.toggle('minimize', 'none');
	},
	step00_btn_Clear_click: function () {
		B.step00_Data.value = '';
		B.step00_Spiltter.value = '';
		B.step00_Compress.checked = false;
		B.step00_Mapper.value = '';
		B.step00_Spiltter.value = '';
		
	},
	step00_btn_Close_click: function () {
		//clear produced result
		delete B.step00_result;
		//clear
		//B.step00_btn_Clear_click();
		//hide/close next window, and for chain close
		B.step01_btn_Close_click();
		//close/hide this win(depends on this win is pre created or not)
		//B.step00_win.toggle('hide', 'none');
	},
	
	step01_win_Show: function () {
		B.step01_win.toggle('minimize', '');
		//get 00 result
		var lastResult = B.step00_result;
		if (!lastResult) return;
		var analysisAnalyser = analysisInit(lastResult.extractedData);
		
		B.step01_result = {
			analysisAnalyser: analysisAnalyser,
		};
		
		//show in table create if not have one yet
		B.step01_scrolltable_object = B.step01_scrolltable_object || new WinObj.ScrollTable('step01_scrolltable','Extacted Data', B.step01_scrolltable_container);
		
		//create the init table
		B._step01_st_changeDisplay('Redraw');
		
		//show window
		B.step01_win.toggle('hide', '');
	},
	
	step01_btn_st_Array_click: function () {
		B._step01_st_changeDisplay('Array');
	},
	step01_btn_st_Enum_click: function () {
		B._step01_st_changeDisplay('Enum');
	},
	_step01_st_changeDisplay: function (display) {
		if (!B.step01_scrolltable_display) {
			B.step01_scrolltable_display = 'not yet';
		}
		if (B.step01_scrolltable_display != display) {
			if (display == 'Redraw') display = '';
			B.step01_scrolltable_display = display;
			//var stPack = B.step01_result.analysisAnalyser.collectScrolltablePack(display);
			var analyser = B.step01_result.analysisAnalyser;
			var stPack = B._collectScrolltablePack(display, analyser.DataEnum.ExtraInfo, analyser.DataEnum.Sequence, analyser.DataDes);
			
			B.step01_scrolltable_object.addContentFromArray(stPack.mainInfo, stPack.mainSite, stPack.colInfo, stPack.colSite, stPack.row/*No use for now!!!, true, true*/);
			B.step01_scrolltable_object.resetScroll();
		}
	},
	
	step01_btn_Start_click: function () {
		var queryStringPack_info = B._step01_option_getQueryStringPack('_info');
		var queryStringPack_site = B._step01_option_getQueryStringPack('_site');
		var queryStringPack = {
			info: queryStringPack_info,
			site: queryStringPack_site
		};
		B.step01_queryStringPack = queryStringPack;
		var pickPack =  B.step01_result.analysisAnalyser.pickQuery(queryStringPack, 'quantity');
		B.step01_result.pickPack = pickPack;
		
		//show next window
		B.step02_win_Show();
		B.step01_win.toggle('minimize', 'none');
	},
	step01_btn_Clear_click: function () {
		B._step01_option_clear('_info');
		B._step01_option_clear('_site');
	},
	step01_btn_Close_click: function () {
		//clear produced result
		delete B.step01_result;
		//clear
		B.step01_btn_Clear_click();
		//hide/close next window, and for chain close
		B.step02_btn_Close_click();
		//close/hide this win(depends on this win is pre created or not)
		B.step01_win.toggle('hide', 'none');
	},
	
	_step01_option_clear: function (mark) {
		document.getElementById('step01_range' + mark).value = '';
		document.getElementById('step01_merge' + mark).value = '';
		document.getElementById('step01_specified' + mark).value = '';
		document.getElementById('step01_mix_none_radio' + mark).checked = true;
		document.getElementById('step01_mix_selected' + mark).value = '';
		document.getElementById('step01_mix_min' + mark).value = '';
		document.getElementById('step01_mix_max' + mark).value = '';
		
	},
	_step01_option_getQueryStringPack: function (mark) {
		/*var IdList = [
			'step01_range',
			'step01_mix_none_radio',
			'step01_mix_selected_radio',
			'step01_mix_selected',
			'step01_mix_all_radio',
			'step01_mix_min',
			'step01_mix_max',
			'step01_merge',
			'step01_specified'
		];*/
		var step01_range = document.getElementById('step01_range' + mark).value;
		var step01_merge = document.getElementById('step01_merge' + mark).value;
		var step01_specified = document.getElementById('step01_specified' + mark).value;
		
		var step01_mix_none_radio = document.getElementById('step01_mix_none_radio' + mark).checked;
		var step01_mix_selected_radio = document.getElementById('step01_mix_selected_radio' + mark).checked;
		var step01_mix_all_radio = document.getElementById('step01_mix_all_radio' + mark).checked;
		
		var step01_mix_selected = document.getElementById('step01_mix_selected' + mark).value;
		var step01_mix_min = document.getElementById('step01_mix_min' + mark).value;
		var step01_mix_max = document.getElementById('step01_mix_max' + mark).value;
		
		var queryStringPack = new Object();
		if (step01_range) queryStringPack.range = step01_range;
		if (step01_merge) queryStringPack.merge = step01_merge;
		if (step01_specified) queryStringPack.specified = step01_specified;
		
		if (!step01_mix_none_radio) {
			if (step01_mix_selected_radio) {
				queryStringPack.mixSelected = step01_mix_selected;
			}
			if (step01_mix_all_radio) {
				queryStringPack.minMix = step01_mix_min;
				queryStringPack.maxMix = step01_mix_max;
			}
		}
		return queryStringPack;
	},
	
	
	
	
	
	
	
	step02_win_Show: function () {
		//get 01 result
		var lastResult = B.step01_result;
		if (!lastResult) return;
		
		B.step02_result = {
			analysisAnalyser: lastResult.analysisAnalyser,
			pickPack: lastResult.pickPack,
			filterPack: lastResult.pickPack._03_filterPack,
		};
		
		//show in table
		B.step02_scrolltable_object = B.step02_scrolltable_object || new WinObj.ScrollTable('step02_scrolltable','Picked Data', B.step02_scrolltable_container);
		
		//create the init table
		B._step02_st_changeDisplay('Redraw');
		
		//show window
		B.step02_win.toggle('hide', '');
		B.step02_win.toggle('minimize', '');
	},
	
	
	step02_btn_st_Array_click: function () {
		B._step02_st_changeDisplay('Array');
	},
	step02_btn_st_Enum_click: function () {
		B._step02_st_changeDisplay('Enum');
	},
	_step02_st_changeDisplay: function (display) {
		if (!B.step02_scrolltable_display) {
			B.step02_scrolltable_display = 'not yet';
		}
		if (B.step02_scrolltable_display != display) {
			if (display == 'Redraw') display = '';
			B.step02_scrolltable_display = display;
			
			var filterPack = B.step02_result.filterPack;
			var stPack = B._collectScrolltablePack(display, filterPack.infoPickTotal, filterPack.sitePickTotal, filterPack.pickDes);
			
			B.step02_scrolltable_object.addContentFromArray(stPack.mainInfo, stPack.mainSite, stPack.colInfo, stPack.colSite, stPack.row/*No use for now!!!, true, true*/);
			B.step02_scrolltable_object.resetScroll();
		}
	},
	
	_collectScrolltablePack: function (type, infoEnumArray, siteEnumArray, rowDesArray) {
		var type = type || 'Array';
		if (type == 'Array') {
			var mainInfo = _collectFromEnumArray(infoEnumArray, 'EnumArray');
			var mainSite = _collectFromEnumArray(siteEnumArray, 'EnumArray');
			var row = rowDesArray;
		}
		if (type == 'Enum') {
			var mainInfo = _reformElements(_collectFromEnumArray(infoEnumArray, 'Elements'));
			var mainSite = _reformElements(_collectFromEnumArray(siteEnumArray, 'Elements'));
			var row = null;
		}
		var colInfo = _collectFromEnumArray(infoEnumArray, 'title');
		var colSite = _collectFromEnumArray(siteEnumArray, 'title');
		
		//pack up
		var scrolltablePack = {
			mainInfo: mainInfo,
			mainSite: mainSite,
			colInfo: colInfo,
			colSite: colSite,
			row: row
		};
		return scrolltablePack;
		//###############################################################
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
	},
	
	step02_btn_Start_click: function () {
		var step02_method_divide_radio = document.getElementById('step02_method_divide_radio').checked;
		var step02_method_table_radio = document.getElementById('step02_method_table_radio').checked;
		
		if (step02_method_divide_radio) {
			//show next window
			///B.analysis_win_Show('divide');
			
			var dataPack = {
				infoEnumArray: B.step02_result.filterPack.infoPickTotal,
				siteEnumArray: B.step02_result.filterPack.sitePickTotal,
				desArray: B.step02_result.filterPack.pickDes,
				desMapper: B.step02_result.filterPack.data_pick_mapper,
			};
			
			B._createAnalysisDivideWindow(dataPack);
			
		}
		if (step02_method_table_radio) {
			//show next window
			///B.analysis_win_Show('table');
		}
		
		B.step02_win.toggle('minimize', 'none');
	},
	step02_btn_Clear_click: function () {
		//Nothing to clear
	},
	step02_btn_Close_click: function () {
		//clear produced result
		delete B.step02_result;
		//clear
		//B.step02_btn_Clear_click();
		//hide/close next window, and for chain close
		//need not to close the next window
		///B.step02_btn_Close_click();
		//close/hide this win(depends on this win is pre created or not)
		B.step02_win.toggle('hide', 'none');
	},	
	
	
	
	
	
	
	
	
	
	
	
	//################################################################################################
	//################################################################################################
	
	
	
	test_btn_00_click: function () {
		//auto finish
		
		B.step00_btn_Start_click();
		
		B.step01_btn_Clear_click();
		//document.getElementById('step01_specified' + '_info').value = '1=2014';
		B.step01_btn_Start_click();
		
		B.step02_btn_Start_click();
	},
	test_btn_01_click: function () {
		//auto finish
		
		B.step00_btn_Start_click();
		
		B.step01_btn_Clear_click();
		document.getElementById('step01_specified' + '_info').value = '1=2014';
		B.step01_btn_Start_click();
		
		B.step02_btn_Start_click();
	},
	
	//################################################################################################
	//################################################################################################
	
	
	
	
	
	_createWinObj: function (id, title, HTMLcontent, parentElement, isProtected, closeClosure) {
		var win = new WinObj.Window(id, title, parentElement);
		
		win.addContent(HTMLcontent);
		
		//win.toggle('minimize');
		//win.toggle('hide', 'none');
		if (isProtected) win.setProtect('close', true);
		if (closeClosure) win.addCloseClosure(closeClosure);
		//var win = new WinObj.Window('testWin001', 'titles!!!!', document.body);
			//win.addCloseClosure(WinObj.createClosure(null,alert,'closed!!'));
		return win;
	},
	
	
	
	
	_createAnalysisDivideWindow: function (dataPack) {
		var id = 'analysis_divide_'+Date.now();
		var HTMLcontent = B.template_analysis_divide.innerHTML;	//get from pre edited HTML
		HTMLcontent = HTMLcontent.replace(/\[template\]/g, id);	//replace '[template]' with id
		var win = B._createWinObj(id, '[Analysis] Divide & Slice', HTMLcontent, document.body);
		//add onClose self-destruction
		win.addCloseClosure(WinObj.createClosure(null, B._windowDeleteOnClose, B, id));
		
		var scrolltable_container = document.getElementById(id + '_scrolltable_container');
		
		//change slice pool
		InfoExtractor.Slice.NewPool();
		
		//add data to Divide
		dataPack.infoDivideArray = B._analysis_enumArrayToDivideArray(dataPack.infoEnumArray);
		dataPack.siteDivideArray = B._analysis_enumArrayToDivideArray(dataPack.siteEnumArray);
		
		//show in table
		scrolltable = new WinObj.ScrollTable(id + '_scrolltable','Divided Data', scrolltable_container);
		
		//save this window
		B[id] = {
			win: win,
			scrolltable: scrolltable,
			dataPack: dataPack,
		};
		
		//create the init table
		B._template_divide_st_changeDisplay(id, 'Divide');
		
		///link to buttons
		var st_changeDisplay_closure_divide = WinObj.createClosure(null, B._template_divide_st_changeDisplay, id, 'Divide');
		var st_changeDisplay_closure_array = WinObj.createClosure(null, B._template_divide_st_changeDisplay, id, 'Array');
		var st_changeDisplay_closure_enum = WinObj.createClosure(null, B._template_divide_st_changeDisplay, id, 'Enum');
		
		document.getElementById(id + '_btn_st_Divide').addEventListener('click', st_changeDisplay_closure_divide, false);
		document.getElementById(id + '_btn_st_Array').addEventListener('click', st_changeDisplay_closure_array, false);
		document.getElementById(id + '_btn_st_Enum').addEventListener('click', st_changeDisplay_closure_enum, false);
		
	},
	
	_windowDeleteOnClose: function (tgtObj, id) {
		delete tgtObj[id];
		console.log('OnClose deleted '+id+' in '+tgtObj);
	},
	
	_analysis_enumArrayToDivideArray: function (enumArray) {
		var divideArray = new Array();
		for (var i in enumArray) {
			var selectedEnum = enumArray[i];
			divideArray.push(InfoExtractor.Divide.FromEnum(selectedEnum));
		}
		return divideArray;
	},
	
	_template_divide_st_changeDisplay: function (id, display) {
		var scrolltable = B[id].scrolltable;
		var dataPack = B[id].dataPack;
		
		if (!scrolltable.scrolltable_display) {
			scrolltable.scrolltable_display = 'not yet';
		}
		if (scrolltable.scrolltable_display != display) {
			scrolltable.scrolltable_display = display;
			
			if (display != 'Divide') {
				var stPack = B._collectScrolltablePack(display, dataPack.infoEnumArray, dataPack.siteEnumArray, dataPack.desArray);
			}
			else {
				var stPack = B._collectScrolltableDividePack(id, dataPack.infoDivideArray, dataPack.siteDivideArray, dataPack.infoEnumArray, dataPack.siteEnumArray, dataPack.desArray);
			}
			scrolltable.addContentFromArray(stPack.mainInfo, stPack.mainSite, stPack.colInfo, stPack.colSite, stPack.row/*No use for now!!!, true, true*/);
			scrolltable.resetScroll();
		}
	},
	
	_collectScrolltableDividePack: function (id, infoDivideArray, siteDivideArray, infoEnumArray, siteEnumArray, rowDesArray) {
		//var row = rowDesArray;
		var mainInfo = _toClickable(infoDivideArray, id, 'infoDivideArray');
		var mainSite = _toClickable(siteDivideArray, id, 'siteDivideArray');
		var row = null;
		var colInfo = _collectFromEnumArray(infoEnumArray, 'title');
		var colSite = _collectFromEnumArray(siteEnumArray, 'title');
		
		//pack up
		var scrolltablePack = {
			mainInfo: mainInfo,
			mainSite: mainSite,
			colInfo: colInfo,
			colSite: colSite,
			row: row
		};
		return scrolltablePack;
		//###############################################################
		function _collectFromEnumArray(tgtEnumArray, mark) {
			var collector = new Array();
			for (var i in tgtEnumArray) {
				collector.push(tgtEnumArray[i][mark]);
			}
			return collector;
		}
		function _toClickable(divideArray, id, divideArrayMark) {
			var collector = new Array();
			for (var i in divideArray) {
				var subCollector = new Array();
				for (var j in divideArray[i].Slices) {
					//var tempSliceObject = divideArray[i].Slices[j];
					subCollector.push('<button onclick="B._analysis_slice(' + __Q(id) + ', ' + __Q(divideArrayMark) + ', ' + i + ', ' + __Q(j) + ')">' + j + '</button>');
				}
				collector.push(subCollector);
			}
			return collector;
			function __Q(str) {
				return '\'' + str + '\'';
			}
		}
	},
	
	
	_analysis_slice: function (id, divideArrayMark, divideNum, sliceKey) {
		var divide = B[id].dataPack[divideArrayMark][divideNum];
		var slice = divide.Slices[sliceKey];
		console.log(divide);
		console.log(slice);
		
		
		var method_divide_quantity = document.getElementById(id + '_method_divide_quantity_radio');
		var method_divide_quality = document.getElementById(id + '_method_divide_quality_radio');
		var divide_match_ratio_fit = document.getElementById(id + '_divide_match_ratio_fit').value;
		var divide_match_mix_max = document.getElementById(id + '_divide_match_mix_max').value;
		divide_match_mix_max = divide_match_mix_max >= 1 ? divide_match_mix_max : 1;
		
		if (method_divide_quantity.ckecked) {
			console.log('method = quantity');
			divide_match_ratio_fit = divide_match_ratio_fit > 0 ? divide_match_ratio_fit : 0.0001;
			divide_match_ratio_fit = divide_match_ratio_fit <= 1 ? divide_match_ratio_fit : 1;
		}
		else if (method_divide_quality.ckecked) {
			console.log('method = quality');
			divide_match_ratio_fit = 0;	// 0 mismatch ratio for quality
		}
		
		/*
		var get = {
			divide_match_ratio_fit: divide_match_ratio_fit,
			divide_match_mix_max: divide_match_mix_max,
			method_divide_quantity: method_divide_quantity,
			method_divide_quality: method_divide_quality,
		}
		console.log(get);
		*/
		
		//actual match
		var result = InfoExtractor.SliceMatch.MatchFromPool(slice, divide_match_mix_max, divide_match_ratio_fit);
		///var result = InfoExtractor.SliceMatch.MatchFromPool(slice, 2, 0.00001);
		GlobalDebug.MatchSliceResult = result;
		InfoExtractor.SliceMatch.AnalysisMatchResult(result);
		
		var resultObj = document.getElementById(id + '_result_container');
		resultObj.innerHTML = 'divide: '+divide.title+' | slice: '+sliceKey+' | BinaryID: '+slice.BinaryID;
		resultObj.innerHTML += '<hr />';
		//resultObj.innerHTML += result.targetSlice.BinaryID + '<hr />';
		resultObj.innerHTML += result.ReportHTML.summary + '<hr />';
		resultObj.innerHTML += result.ReportHTML.fit + '<hr />';
		resultObj.innerHTML += result.ReportHTML.smaller + '<hr />';
		resultObj.innerHTML += result.ReportHTML.bigger;
		
		
		
		var canvas = document.getElementById(id + '_canvas');
		var g = new InfoExtractor.Graph(canvas, 0, 0, 15);
		GlobalDebug.g = g;
		g.canvas.style.display = '';
		
		//var methodSort = [['containMix', 'desc'],['containSlice', 'desc'],['unmatched', 'desc'],['fitMix', 'desc']];
		var methodSort = [['smallerMix', 'desc'],['smallerSlice', 'desc'],['biggerMix', 'desc'],['biggerSlice', 'desc'],['unmatched', 'desc'],['fitMix', 'desc']];
		var methodNameCollector = new Array();
		for (var i in methodSort) methodNameCollector.push(methodSort[i].join('-'));
		//g.initPlot('Normalized Plot sort by ' + methodNameCollector.join(' '), 10, 400, result.Distribution);
		g.initPlot('Sorted Normalized Plot', 10, 400, result.Distribution);
		var data = g.reformed.data;
		InfoExtractor.Graph.SortData(data, methodSort);
		g.drawData = g.drawPlot(10);
		g.autoWidth();
		
		
		
		
		
		
		var packedSeries = new Array();
		for (var i in g.drawData.converted) {
			packedSeries.push({
				name: i,
				data: g.drawData.converted[i]
			});
		}
		
		
		Highcharts.theme = {
		   colors: ["#7cb5ec", "#f7a35c", "#90ee7e", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
			  "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
		   chart: {
			  backgroundColor: null
		   },
		   // General
		   background2: '#F0F0EA'
		};
		// Apply the theme
		Highcharts.setOptions(Highcharts.theme);
		
		document.getElementById(id+'_chart_div').style.display = '';
		
		$('#'+id+'_chart_div').highcharts({
			chart: {
				type: 'line'
			},
			title: {
				text: 'Sorted Plot(original)'
			},
			xAxis: {
				type: 'linear'
			},
			yAxis: {
				title: {
					text: 'Normalized'
				}
			},
			tooltip: {
                shared: true,
                crosshairs: true,
				headerFormat: 'Result #{point.key}. click for details<br />'
            },
			series: packedSeries,
			plotOptions: {
				series: {
					cursor: 'pointer',
					point: {
						events: {
							click: function (e) {
								//console.log(this.series.name);
								//console.log(this.x);
								//console.log(this.y);
								//console.log(this);
								
								
								
								//console.log(g.drawData.index[this.x]);						//sample in picked
								//console.log(B[id].dataPack.desArray[g.drawData.index[this.x]]);	//sample name
								//console.log(B[id].dataPack.desMapper[g.drawData.index[this.x]]);	//sample in input seq
								//console.log(result.resultMemberPool[g.drawData.index[this.x]]);
								
								
								var sampleName = B[id].dataPack.desArray[g.drawData.index[this.x]];
								var sampleIndex = B[id].dataPack.desMapper[g.drawData.index[this.x]];
								
								var message = 'No.' + this.x + ' is: Sample #' + sampleIndex + ' ' + sampleName;
								
								
								GlobalLog.add(message);
								alert(message);
								//this.series.name
								//this.x
								//this.y
							}
						}
					},
					marker: {
						lineWidth: 1
					}
				}
			},
		});
	},
	
	"" :	null	//take a space
};

window.addEventListener('load', B._onload, false);