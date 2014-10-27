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
	var SliceMatch = (function (SliceMatch) {
		function SliceMatch() {	
			return 'match the slice';
		}
		///Match Slice
		//match fit or contain slice from the pool or mixed
		SliceMatch.MatchFromPool = function (targetSlice, maxMix, ratioFit) {
			maxMix = maxMix || 3;
			ratioFit = ratioFit || 0.25;
			var fit = new Array();
			var smaller = new Array();
			var bigger = new Array();
			var poolSizeChange = new Array();
			//collect all related Slices according to member
			var slicePool = new Object();
			for (var i in targetSlice.Members) {
				var memberRelatedSlices = targetSlice.memberPool[targetSlice.Members[i]];	//multi-pool
				//var memberRelatedSlices = Slice._SliceMemberPool[targetSlice.Members[i]];	//mono-pool version
				for (var j in memberRelatedSlices) {
					var relatedSliceID = memberRelatedSlices[j].BinaryID;
					slicePool[relatedSliceID] = memberRelatedSlices[j];
				}
			}
			//Match from 1 to maxMix
			for (var i = 1; i <= maxMix; i++) {
				var res = _matchPool(targetSlice, slicePool, i, ratioFit);
				fit = fit.concat(res._fit);
				smaller = smaller.concat(res._smaller);
				bigger = bigger.concat(res._bigger);
				poolSizeChange.push(res.MatchPoolSize);
				console.log('=MatchFromPool-res: '+fit.length+'/'+smaller.length+'/'+bigger.length);
			}
			
			//fit, contain, slicePool
			
			return {
				targetSlice: targetSlice,
				maxMix: maxMix,
				ratioFit: ratioFit,
				fit: fit,
				smaller: smaller,
				bigger: bigger,
				slicePool: slicePool,	//what's left is unmatched
				poolSizeChange: poolSizeChange
			};
		}
		
		function _matchPool(targetSlice, slicePool, mixNum, ratioFit) {
			var sliceArray = new Array();
			var _fit = new Array();
			var _smaller = new Array();
			var _bigger = new Array();
			for (var i in slicePool) sliceArray.push(slicePool[i]);
			console.log('===_matchPool Size: '+mixNum+' PoolSize:'+sliceArray.length);
			_matchMixLoop(targetSlice, sliceArray, mixNum, 0, null, null, _fit, _smaller, _bigger, ratioFit);
			//remove from pool
			_removeMatched(slicePool, _fit);
			_removeMatched(slicePool, _smaller);
			_removeMatched(slicePool, _bigger);
			
			GlobalDebug.slicePool = slicePool;//check what's left
			//save result
			return {
				_fit: _fit,
				_smaller: _smaller,
				_bigger: _bigger,
				MatchPoolSize: sliceArray.length
			};
		}
		
		function _matchMixLoop(targetSlice, sliceArray, mixSize, startAt, preMixedBinaryID, preMixedSlices, fit, smaller, bigger, ratioFit) {
			if (sliceArray.length < mixSize + startAt) return;	//not enough for mix
			startAt = startAt || 0;
			preMixedSlices = preMixedSlices || new Array();
			//var AllMixBinaryID;
			//AllMixBinaryID = AllMixBinaryID ? _andMixBinaryID(preMixedBinaryID, AllMixBinaryID) : sliceArray[i].BinaryID;
			//console.log('=====_matchMixLoop-Size: '+mixSize+' startAt: '+startAt+'/'+sliceArray.length);
			for (var i = startAt; i < sliceArray.length; i++) {
				if (mixSize != 1) {
					//pick and combine to pre mix
					var newPreMixedBinaryID = preMixedBinaryID ? _andMixBinaryID(preMixedBinaryID, sliceArray[i].BinaryID) : sliceArray[i].BinaryID;
					var mixMethod = preMixedBinaryID ? 'and' : '';
					//if = 0 try add up not break down...
					if (newPreMixedBinaryID == 0) {
						newPreMixedBinaryID = _orMixBinaryID(preMixedBinaryID, sliceArray[i].BinaryID);
						console.log('=====try or');
						mixMethod = 'or';
					}
					var newPreMixedSlices = preMixedSlices.slice(0);
					newPreMixedSlices.push([sliceArray[i], mixMethod]);
					//console.log('go down at '+i+' MixedID='+newPreMixedBinaryID);
					//go down
					if (newPreMixedBinaryID != 0) {
						_matchMixLoop(targetSlice, sliceArray, mixSize - 1, i + 1, newPreMixedBinaryID, newPreMixedSlices, fit, smaller, bigger, ratioFit);
					}
				}
				else {
					var mixedBinaryID = preMixedBinaryID ? _andMixBinaryID(preMixedBinaryID, sliceArray[i].BinaryID) : sliceArray[i].BinaryID;
					var mixMethod = preMixedBinaryID ? 'and' : '';
					//if = 0 try add up not break down...
					if (mixedBinaryID == 0) {
						mixedBinaryID = _orMixBinaryID(preMixedBinaryID, sliceArray[i].BinaryID);
						mixMethod = 'or';	// the or method mostly for the same site value
					}
					var newPreMixedSlices = preMixedSlices.slice(0);
					newPreMixedSlices.push([sliceArray[i], mixMethod]);
					//console.log('stopped, MixedID='+mixedBinaryID+'\nTsrgetID='+targetSlice.BinaryID);
					
					var diff = _diffBinaryID(targetSlice.BinaryID, mixedBinaryID);
					//the bit-wise-minus result between targetSlice.BinaryID, mixedBinaryID
					//fit: difference < ratio
					//var checkFit = (((diff['10'] || 0) + (diff['01'] || 0)) / targetSlice.size)  <= ratioFit;
					var checkFit = (((diff['10'] || 0) + (diff['01'] || 0)))  <= ratioFit;
					var checkSmaller = !diff['01'] && (diff['10'] > 0);
					var checkBigger = !diff['10'] && (((diff['11'] || 0) + (diff['01'] || 0)) / targetSlice.size <= 1.5 * ratioFit + 1);
					//there is no no-cross relation
					//in Range or fit Range
					if ((checkFit || checkSmaller || checkBigger) && diff['11']) {
						var resPack = {
							matchedArray: newPreMixedSlices,
							matchedFrom: newPreMixedSlices.length,
							matchedDiff: diff,
							checkFit: ((diff['10'] || 0) + (diff['01'] || 0)) / targetSlice.size,
							mixedBinaryID: mixedBinaryID
						};
						if (checkFit) {
							fit.push(resPack);
						}
						else {
							if (checkSmaller) {
								smaller.push(resPack);
							}
							else if (checkBigger) {
								bigger.push(resPack);
							}
						}
					}
					/*old way
					
					//fit: difference < ratio
					var checkFit = ((diff['10'] || 0) + (diff['01'] || 0)) / targetSlice.size;
					//contain: no '01'
					var checkSmaller = !diff['01'] && (!diff['10'] || diff['10'] > 0);
					var checkBigger = !diff['10'] && (!diff['01'] || diff['01'] > 0);
					//there is no no-cross relation
					//in Range or fit Range
					if (checkFit <= ratioFit || checkContain) {
						var resPack = {
							matchedArray: newPreMixedSlices,
							matchedFrom: newPreMixedSlices.length,
							matchedDiff: diff,
							checkFit: checkFit,
							mixedBinaryID: mixedBinaryID
						};
						if (checkFit <= ratioFit) {
							fit.push(resPack);
						}
						else {
							smaller.push(resPack);
						}
						/// add bigger
							bigger.push(resPack);
					}
					///###################
					
					var checkFit = ((diff['1'] || 0) + (diff['-1'] || 0)) / targetSlice.size;
					var checkContain = !diff['1'] && (!diff['-1'] || diff['-1'] < targetSlice.size);
					
					//in Range or fit Range
					if (checkFit <= ratioFit || checkContain) {
						var resPack = {
							matchedArray: newPreMixedSlices,
							matchedFrom: newPreMixedSlices.length,
							matchedDiff: diff,
							checkFit: checkFit,
							mixedBinaryID: mixedBinaryID
						};
						if (checkFit <= ratioFit) {
							fit.push(resPack);
						}
						else {
							contain.push(resPack);
						}
					}
					*/
				}
			}
			return;
		}
		
		function _removeMatched(slicePool, matchedArrayArray) {
			for (var i in matchedArrayArray) {
				var matchedArray = matchedArrayArray[i].matchedArray
				for (var j in matchedArray) {
					var binaryId = matchedArray[j][0].BinaryID;
					//console.log('_removeMatched! : '+binaryId);
					delete slicePool[binaryId];
				}
			}
			return;
		}
		
		//record 11, 10, 01, 00 all the possible type
		function _diffBinaryID(binaryID1, binaryID2) {
			var res = new Object();
			for (var i in binaryID1) {
				var diff =  binaryID1[i] + binaryID2[i];	//adding as strings
				res[diff] = (res[diff] || 0) + 1;
			}
			return res;
		}
		/*
		function _diffBinaryID_org(binaryID1, binaryID2) {
			var res = new Object();
			for (var i in binaryID1) {
				var diff =  binaryID1[i] - binaryID2[i];
				res[diff] = (res[diff] || 0) + 1;
			}
			return res;
		}
		*/
		function _xorMixBinarySize(binaryID1, binaryID2) {
			var resBinarySize = 0;
			for (var i in binaryID1) {
				resBinarySize += binaryID1[i] ^ binaryID2[i];
			}
			return resBinarySize;
		}
		function _orMixBinarySize(binaryID1, binaryID2) {
			var resBinarySize = 0;
			for (var i in binaryID1) {
				resBinarySize += binaryID1[i] | binaryID2[i];
			}
			return resBinarySize;
		}
		function _andMixBinarySize(binaryID1, binaryID2) {
			var resBinarySize = 0;
			for (var i in binaryID1) {
				resBinarySize += binaryID1[i] & binaryID2[i];
			}
			return resBinarySize;
		}
		
		//'xor' combine: check difference
		function _xorMixBinaryID(binaryID1, binaryID2) {
			var resBinaryArray = new Array();
			for (var i in binaryID1) {
				resBinaryArray.push(binaryID1[i] ^ binaryID2[i]);
			}
			return resBinaryArray.join('');
		}
		//'or' combine: check total
		function _orMixBinaryID(binaryID1, binaryID2) {
			var resBinaryArray = new Array();
			for (var i in binaryID1) {
				resBinaryArray.push(binaryID1[i] | binaryID2[i]);
			}
			return resBinaryArray.join('');
		}
		//'and' combine: check same
		function _andMixBinaryID(binaryID1, binaryID2) {
			var resBinaryArray = new Array();
			for (var i in binaryID1) {
				resBinaryArray.push(binaryID1[i] & binaryID2[i]);
			}
			return resBinaryArray.join('');
		}
		
		
		
		SliceMatch.AnalysisMatchResult = function (resPack) {
			//fit, contain, slicePool
			var fit = resPack.fit;
			var smaller = resPack.smaller;
			var bigger = resPack.bigger;
			var slicePool = resPack.slicePool;
			
			//register as index-binaryID[index]
			var resultMemberPool = new Array();
			_match_collectResultMember(resultMemberPool, fit, 'fit');
			_match_collectResultMember(resultMemberPool, smaller, 'smaller');
			_match_collectResultMember(resultMemberPool, bigger, 'bigger');
			resPack.resultMemberPool = resultMemberPool;
			
			
			//sort by '11' desc, '10' & '01'asc 
			//sort by '11' desc, '00'asc 
			var sort_func = function (a,b) {
				var a11 = a.matchedDiff['11'] || 0;
				var b11 = b.matchedDiff['11'] || 0;
				var a00 = a.matchedDiff['00'] || 0;
				var b00 = b.matchedDiff['00'] || 0;
				return (b11 + b00) - (a11 + a00);
				/*
				var a11 = a.matchedDiff['11'] || 0;
				var b11 = b.matchedDiff['11'] || 0;
				var a01 = a.matchedDiff['01'] || 0;
				var b01 = b.matchedDiff['01'] || 0;
				var a10 = a.matchedDiff['10'] || 0;
				var b10 = b.matchedDiff['10'] || 0;
				if (a11 != b11) return b11 - a11;
				if (a10 != b10) return a10 - b10;
				else return a01 - b01;
				*/
			}
			
			fit.sort(sort_func);
			smaller.sort(sort_func);
			bigger.sort(sort_func);
			
			/// important result
			//extract all site/info in result
			var targetSize = resPack.targetSlice.size;
			var fit_title = _match_collect_divideTitle(fit, targetSize);
			var smaller_title = _match_collect_divideTitle(smaller, targetSize);
			var bigger_title = _match_collect_divideTitle(bigger, targetSize);
			
			resPack.MatchedTitle = {
				fit: fit_title,
				smaller: smaller_title,
				bigger: bigger_title
			};
			
			
			//HTML
			var summaryHTML = _match_toSummary(resPack);
			var fitReportHTML = _match_toResultHTML('fit', fit);
			var smallerReportHTML = _match_toResultHTML('smaller', smaller);
			var biggerReportHTML = _match_toResultHTML('bigger', bigger);
			
			resPack.ReportHTML = {
				fit: fitReportHTML,
				smaller: smallerReportHTML,
				bigger: biggerReportHTML,
				summary: summaryHTML
			};
			
			//prepare for the graph
			///derepeat the BinaryID, addup tp get the distribution
			//collect to array, and deRepeat
			var unmatchedIDArray = _match_collect(slicePool, 'BinaryID');
			//var unmatchedIDArray = new Array();
			//for (var i in slicePool) unmatchedIDArray.push(slicePool[i].BinaryID);
			var fitSliceIDArray = new Array();
			for (var i in fit) {
				for (var j in fit[i].matchedArray) {
					fitSliceIDArray.push(fit[i].matchedArray[j][0].BinaryID);
				}
			}
			var smallerSliceIDArray = new Array();
			for (var i in smaller) {
				for (var j in smaller[i].matchedArray) {
					smallerSliceIDArray.push(smaller[i].matchedArray[j][0].BinaryID);
				}
			}
			var biggerSliceIDArray = new Array();
			for (var i in bigger) {
				for (var j in bigger[i].matchedArray) {
					biggerSliceIDArray.push(bigger[i].matchedArray[j][0].BinaryID);
				}
			}
			var smallerMixIDArray = _match_collect(smaller, 'mixedBinaryID');
			var biggerMixIDArray = _match_collect(bigger, 'mixedBinaryID');
			//var containMixIDArray = new Array();
			//for (var i in contain) containMixIDArray.push(contain[i].mixedBinaryID);
			var fitMixIDArray = _match_collect(fit, 'mixedBinaryID');
			//var fitMixIDArray = new Array();
			//for (var i in fit) fitMixIDArray.push(fit[i].mixedBinaryID);
			
			
			var unmatchedIDArray = _match_deRepeat(unmatchedIDArray);
			var smallerSliceIDArray = _match_deRepeat(smallerSliceIDArray);
			var biggerSliceIDArray = _match_deRepeat(biggerSliceIDArray);
			var fitMixIDArray = _match_deRepeat(fitMixIDArray);
			///mixArray should not be de-repeat
			//var containMixIDArray = _match_deRepeat(containMixIDArray);
			//var fitMixIDArray = _match_deRepeat(fitMixIDArray);
			
			resPack.DeRepeatIDArray = {
				fitMix: fitMixIDArray,
				fitSlice: fitSliceIDArray,
				smallerMix: smallerMixIDArray,
				smallerSlice: smallerSliceIDArray,
				biggerMix: biggerMixIDArray,
				biggerSlice: biggerSliceIDArray,
				unmatched: unmatchedIDArray,
			};
			
			var fitMixDistribution = _match_toDistribution(fitMixIDArray);
			var fitSliceDistribution = _match_toDistribution(fitSliceIDArray);
			var smallerMixDistribution = _match_toDistribution(smallerMixIDArray);
			var smallerSliceDistribution = _match_toDistribution(smallerSliceIDArray);
			var biggerMixDistribution = _match_toDistribution(biggerMixIDArray);
			var biggerSliceDistribution = _match_toDistribution(biggerSliceIDArray);
			var unmatchedDistribution = _match_toDistribution(unmatchedIDArray);
			
			resPack.Distribution = {
				fitMix: fitMixDistribution,
				fitSlice: fitSliceDistribution,
				smallerMix: smallerMixDistribution,
				smallerSlice: smallerSliceDistribution,
				biggerMix: biggerMixDistribution,
				biggerSlice: biggerSliceDistribution,
				unmatched: unmatchedDistribution,
			};
			
			return resPack;
		}
		
		function _match_collect_divideTitle(tgtArray, targetSize) {
			var collected = new Object();
			for (var i in tgtArray) {
				var matched = tgtArray[i].matchedArray;
				var score_11 = tgtArray[i].matchedDiff['11'];
				for (var j in matched) {
					var tempSlice = matched[j][0];
					var title_key = tempSlice.getUpperDivideTitleKeyCountList();
					//var score = targetSize * score_11 / tempSlice.size / tempSlice.size;
					var score = score_11 / tempSlice.size;
					
					//for these divide is from the same slice...
					//we don't divide them here
					title_key = title_key.join(' | ');
					
					collected[title_key] = (collected[title_key] || [0, 0, 0]);
					collected[title_key][0] ++;
					collected[title_key][1] += score;
					collected[title_key][2] += score_11;
					
					/* better with score
					for (var j in title_key) {
						collected[title_key[j]] = (collected[title_key[j]] || [0, 0, 0]);
						collected[title_key[j]][0]++;
						collected[title_key[j]][1] += score;
						collected[title_key[j]][1] += score_11;
					}
					*/
					/*
					var divides = matched[j][0].UpperDivide;
					for (var k in divides) {
						collected[divides[k].title] = true;
					}
					*/
				}
			}
			var result = new Array();
			for (var i in collected) {
				//var finalScore = collected[i][1] * collected[i][2]; //failed to pick 293
				var finalScore = collected[i][1] * collected[i][2] / collected[i][0] / collected[i][0]; //failed to pick 293
				//var finalScore = collected[i][2] / collected[i][0] / collected[i][1];
				result.push([finalScore, collected[i][0], collected[i][1], collected[i][2], i]);	//show up time, totsl score, total 11, upper divide&key
			}
			//sort
			var sort_func = function (a,b) {
				return b[0] - a[0];	//the score desc
			}
			result.sort(sort_func);
			
			for (var i in result) {
				result[i] = '[' + i + ']' 
				+ 'Score:' + result[i][0].toFixed(4) 
				+ '\t x' + result[i][1] 
				+ '\t Sum Score:' + result[i][2].toFixed(4) 
				+ '\t \'11\' Count:' + result[i][3] 
				+ '\t UpperDivide(key):' + result[i][4];
			}
			
			
			return result;
		}
		
		function _match_collectResultMember(memberArray, resultArray, resultType) {
			for (var i in resultArray) {
				var binaryID = resultArray[i].mixedBinaryID;
				for (var j in binaryID)
					if (binaryID[j] == '1') {
						memberArray[j] = memberArray[j] || new Object();
						memberArray[j][resultType] = memberArray[j][resultType] || new Array();
						memberArray[j][resultType].push(resultArray[i]);
					}
			}
			return;
		}
		function _match_collect(tgtArray, key) {
			var collectedArray = new Array();
			for (var i in tgtArray) collectedArray.push(tgtArray[i][key]);
			return collectedArray;
		}
		
		function _match_deRepeat(binaryIDArray) {
			var tempObj = new Object();
			for (var i in binaryIDArray) tempObj[binaryIDArray[i]] = true;
			var deRepeatedArray = new Array();
			for (var i in tempObj) deRepeatedArray.push(i);
			console.log('reduced: ' + (binaryIDArray.length - deRepeatedArray.length));
			return deRepeatedArray;
		}
		
		function _match_toDistribution(binaryIDArray) {
			//de-repeat
			var distributionArray = new Array();
			var distributionCount = 0;
			var distributionMax = 0;
			var distributionMin = 0;
			for (var i in binaryIDArray) {
				var binaryID = binaryIDArray[i];
				for (var j in binaryID) {
					distributionArray[j] = (distributionArray[j] || 0) + parseInt(binaryID[j]);
					distributionCount += parseInt(binaryID[j]);
				}
			}
			distributionMin = distributionCount;
			for (var i in distributionArray) {
				distributionMax = (distributionMax > distributionArray[i]) ? distributionMax : distributionArray[i];
				distributionMin = (distributionArray[i] == 0 || distributionMin < distributionArray[i]) ? distributionMin : distributionArray[i];
			}
			return {
				data: distributionArray,
				size: binaryIDArray.length,
				count: distributionCount,
				max: distributionMax,
				min: distributionMin
			};
		}
		
		
		
		/*
		targetSlice: targetSlice,
		maxMix: maxMix,
		ratioFit: ratioFit,
		fit: fit,
		contain: contain,
		slicePool: slicePool,	//what's left is unmatched
		poolSizeChange: poolSizeChange
		*/
		
		function _match_toSummary(resultPack) {
			var unmatchedCount = 0;
			for (var i in resultPack.slicePool) unmatchedCount++;
			var resultHTML = '<b>Target Slice BinaryID: </b> ' + resultPack.targetSlice.BinaryID + ' <br />'
							+ '<b>Target Slice shared by Divide/Enum: </b> ' + resultPack.targetSlice.getUpperDivideTitleKeyList().join(', ') + ' <br />'
							+ '<b>Target Slice size(1 in BinaryID)/length: </b> ' + resultPack.targetSlice.size + '/' + resultPack.targetSlice.length + ' <hr />'
							+ '<b>Match Mix Max: </b> ' + resultPack.maxMix + ' <br />'
							+ '<b>Match Mix Pool size change: </b> start[ ' + resultPack.poolSizeChange.join(' - ') + ' ]end <hr />'
							+ '<b>Match Fit pass Ratio: </b> ' + resultPack.ratioFit + '(0 for a Quality-based Match) <hr />'
							+ '<b>Result Count: </b> Fit: ' + resultPack.fit.length + ', Smaller: ' + resultPack.smaller.length + ', Bigger: ' + resultPack.bigger.length + ', Unmatched: ' + unmatchedCount + ' <hr />'
							+ '<b>Result Fit From: </b> Total: ' + resultPack.MatchedTitle.fit.length + ', Divide: <br />' + resultPack.MatchedTitle.fit.join('<br />') + ' <br />'
							+ '<b>Result Smaller From: </b> Total: ' + resultPack.MatchedTitle.smaller.length + ', Divide: <br />' + resultPack.MatchedTitle.smaller.join('<br />') + ' <br />'
							+ '<b>Result Bigger From: </b> Total: ' + resultPack.MatchedTitle.bigger.length + ', Divide: <br />' + resultPack.MatchedTitle.bigger.join('<br />') + ' <hr />'
							
							/// TODO: keep finish this summary
			return resultHTML;
		}
		
		function _match_toResultHTML(resultType, resultArray) {
			var resultHTML = '<b>'+resultType+'</b><hr />';
			if (resultArray.length == 0) {
				resultHTML += 'No match found of ' + _boldize(resultType);
				return resultHTML;
			}
			var standardOrderArray = ['11', '10', '01', '00'];	//for search result
			
			for (var i in resultArray) {
				var sliceArray = new Array();
				var matchedArray = resultArray[i].matchedArray;
				for (var j in matchedArray) {
					//var sliceDivides = matchedArray[j][0].getUpperDivideTitleList().join(' / ');
					var sliceDivides = matchedArray[j][0].getUpperDivideTitleKeyList().join('</b> / <b>');
					sliceArray.push((matchedArray[j][1] ? ' [' + matchedArray[j][1] + '] ' : '') + _boldize(sliceDivides));
				}
				var diffArray = new Array();
				//for (var j in resultArray[i].matchedDiff) {
				for (var j in standardOrderArray) {
					var _count = resultArray[i].matchedDiff[standardOrderArray[j]];
					if (_count) diffArray.push('\'' + standardOrderArray[j] + '\': ' + _boldize(_count));
				}
				//var tempHTML = 'matchedBySlicesFrom: ' + sliceArray.join(', ') + '<br/>';
				var tempHTML = '';
				tempHTML += 'matchedBySlicesFrom: ' + sliceArray.join('') + '<br/>';
				tempHTML += 'matchedDiff: ' + diffArray.join(' - ') + '<br/>';
				tempHTML += 'checkFitDifferenceRatio: ' + _boldize(resultArray[i].checkFit.toFixed(5)) + '<br/>';
				tempHTML += 'matchedFrom: ' + _boldize(resultArray[i].matchedFrom) + ' Slices<br/>';
				
				resultHTML += tempHTML +'<hr/>';
			}
			return resultHTML;
		}
		
		function _boldize(str) {return '<b>' + str + '</b>';}
		
		
		return SliceMatch;
	})();
	
	InfoExtractor.SliceMatch = SliceMatch;
	
})(InfoExtractor);
