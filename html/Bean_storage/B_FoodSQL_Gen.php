<!DOCTYPE html> 
<html lang="en"> 
<meta http-equiv="Content-Type" content="text/html; charset=utf8" />
<body>
<p>start</p>

<?php
$charset = "UTF-8";
header("Content-Type: text/html; charset=".$charset);
require 'B_FoodSQL.php';

function echoReturn($msg) {
	echo $msg . "<br />";	
	die;
}

$B_host = "localhost";
$B_user = "thatbean_tester";
$B_password = "tester";
$B_database = "thatbean_Food";
$foodSQL = new B_mysql();
if ($foodSQL->init($B_host, $B_user, $B_password, $B_database)!=1) echoReturn("[Error]Error db info...");

echo "<h1>HERE COMES THE REAL TEST!!!!</h1>" . "<br /><br />";

$Num001		= array("第一", "第二", "第三", "第四");
$Num002		= array("第一", "第二", "第三", "第四", "第五");
$Prefix001	= array("泡面", "炒面", "汤面", "米线");
$Prefix002	= array("第一", "第二", "第三", "第四", "泡面", "炒面", "汤面", "米线");
//echo "<b>" . "addFoodSet - FoodSet001" . "</b><br />";
//echo addFoodSet($foodSQL, $i.$Prefix002[rand(0, 7)].$Prefix002[rand(0, 7)], array("1","2","3")) . "<br />";
//addFoodSet($b_dFoodSQL, $b_dSetName, $b_dFoodIDList)
/*
$count=161;

for ($i=1; $i<=80; $i++)
{
$j1=rand(161, 240);
$j2=rand(161, 240);
while($j1==$j2) $j2=rand(161, 240);
$j3=rand(161, 240);
while($j1==$j3 || $j2==$j3) $j3=rand(161, 240);
//echo $j1. $j2. $j3. "<br />".$i.$Prefix002[rand(0, 7)].$Prefix002[rand(0, 7)]. "<br />";
echo "<b>" . "addFoodSet - ".$i.$Prefix002[rand(0, 7)].$Prefix002[rand(0, 7)]. "</b> fID:" . addFoodSet($foodSQL, ($i.$Prefix002[rand(0, 7)].$Prefix002[rand(0, 7)]), array($j1, $j2, $j3)) . "<br />";
}


*/

return;
/*
//Add building
//addBld($b_dFoodSQL, $b_dBldName, $b_dBldSite, $b_dBldInfo)

echo "<b>" . "addBld - 第一餐厅" . "</b> bID:" . addBld($foodSQL, "第一餐厅", "大学里面", "不错") . "<br />";
echo "<b>" . "addBld - 第二食堂" . "</b> bID:" . addBld($foodSQL, "第二食堂", "东某院旁", "不错") . "<br />";
echo "<b>" . "addBld - 第三饭店" . "</b> bID:" . addBld($foodSQL, "第三饭店", "某湖边", "不错") . "<br />";
echo "<b>" . "addBld - 第四小吃" . "</b> bID:" . addBld($foodSQL, "第四小吃", "正在施工", "不错") . "<br />";
//bID 1 - 4


//Add Window
//addData($b_dFoodSQL, $b_dTable, $b_dName, $b_dMark, $b_dInfo, $b_dUpperNodeID)

echo "<b>" . "addData - 第一窗口" . "</b> wID:" . addData($foodSQL, "PlaceWin", "第一窗口", "第一餐厅里面", "不错?", "1") . "<br />";
echo "<b>" . "addData - 第一面馆" . "</b> wID:" . addData($foodSQL, "PlaceWin", "第一面馆", "第一餐厅里面", "不错?", "1") . "<br />";
echo "<b>" . "addData - 第一盖饭" . "</b> wID:" . addData($foodSQL, "PlaceWin", "第一盖饭", "第一餐厅里面", "不错?", "1") . "<br />";
echo "<b>" . "addData - 第一盒饭" . "</b> wID:" . addData($foodSQL, "PlaceWin", "第一盒饭", "第一餐厅里面", "不错?", "1") . "<br />";
echo "<b>" . "addData - 第一外卖" . "</b> wID:" . addData($foodSQL, "PlaceWin", "第一外卖", "第一餐厅里面", "不错?", "1") . "<br />";

echo "<b>" . "addData - 第二窗口" . "</b> wID:" . addData($foodSQL, "PlaceWin", "第二窗口", "第二食堂里面", "不错?", "2") . "<br />";
echo "<b>" . "addData - 第二面馆" . "</b> wID:" . addData($foodSQL, "PlaceWin", "第二面馆", "第二食堂里面", "不错?", "2") . "<br />";
echo "<b>" . "addData - 第二盖饭" . "</b> wID:" . addData($foodSQL, "PlaceWin", "第二盖饭", "第二食堂里面", "不错?", "2") . "<br />";
echo "<b>" . "addData - 第二盒饭" . "</b> wID:" . addData($foodSQL, "PlaceWin", "第二盒饭", "第二食堂里面", "不错?", "2") . "<br />";
echo "<b>" . "addData - 第二外卖" . "</b> wID:" . addData($foodSQL, "PlaceWin", "第二外卖", "第二食堂里面", "不错?", "2") . "<br />";

echo "<b>" . "addData - 第三窗口" . "</b> wID:" . addData($foodSQL, "PlaceWin", "第三窗口", "第三饭店里面", "不错?", "3") . "<br />";
echo "<b>" . "addData - 第三面馆" . "</b> wID:" . addData($foodSQL, "PlaceWin", "第三面馆", "第三饭店里面", "不错?", "3") . "<br />";
echo "<b>" . "addData - 第三盖饭" . "</b> wID:" . addData($foodSQL, "PlaceWin", "第三盖饭", "第三饭店里面", "不错?", "3") . "<br />";
echo "<b>" . "addData - 第三盒饭" . "</b> wID:" . addData($foodSQL, "PlaceWin", "第三盒饭", "第三饭店里面", "不错?", "3") . "<br />";
echo "<b>" . "addData - 第三外卖" . "</b> wID:" . addData($foodSQL, "PlaceWin", "第三外卖", "第三饭店里面", "不错?", "3") . "<br />";

echo "<b>" . "addData - 第四窗口" . "</b> wID:" . addData($foodSQL, "PlaceWin", "第四窗口", "第四小吃里面", "不错?", "4") . "<br />";
echo "<b>" . "addData - 第四面馆" . "</b> wID:" . addData($foodSQL, "PlaceWin", "第四面馆", "第四小吃里面", "不错?", "4") . "<br />";
echo "<b>" . "addData - 第四盖饭" . "</b> wID:" . addData($foodSQL, "PlaceWin", "第四盖饭", "第四小吃里面", "不错?", "4") . "<br />";
echo "<b>" . "addData - 第四盒饭" . "</b> wID:" . addData($foodSQL, "PlaceWin", "第四盒饭", "第四小吃里面", "不错?", "4") . "<br />";
echo "<b>" . "addData - 第四外卖" . "</b> wID:" . addData($foodSQL, "PlaceWin", "第四外卖", "第四小吃里面", "不错?", "4") . "<br />";
//wID 1-5 6-10 11-15 16-20


$Num001		= array("第一", "第二", "第三", "第四");
$Num002		= array("第一", "第二", "第三", "第四", "第五");
$Prefix001	= array("泡面", "炒面", "汤面", "米线");



$count=1;

foreach ($Num001 as $i) {
	foreach ($Num002 as $j) {
		foreach ($Prefix001 as $k) {
			///???
			echo "<b>" . "addData - ".$i.$j.$k. "</b> fID:";
			echo "<b>" . "addData - ".$i.$j.$k. "</b> fID:" . addData($foodSQL, "Food", ($i.$j.$k), "198元", "命令行下插入汉字,不错不错", ("$count")) . "<br />";
			
		}
		$count=$count+1;
	}
}
//fID 161 - 240

*/

//###################################################################################################################



















$arr1=array("one", "two", "three");
$arr2=array("111", "222", "333");
$arr3=array("AAA", "BBB", "CCC");
echo $foodSQL->select_gen($arr1, $arr2, $arr3) . "<br />";
echo $foodSQL->set_gen($arr1, $arr2, $arr3) . "<br />";
echo $foodSQL->insert_gen("aTable", $arr1, $arr2, $arr3) . "<br />";

$arr=array("18812221");

echo "<h1>HERE COMES THE REAL TEST!!!!</h1>" . "<br /><br />";


//echo "<b>" . "insertData - Comment" . "</b><br />";
//echo insertData($foodSQL, "Comment", array("18812221")) . "<br />";
//insertData($b_dFoodSQL, $b_dTable, $b_dValList)

//echo "<b>" . "updateData - Comment" . "</b><br />";
//echo updateData($foodSQL, "Comment", array("cINFO"), array("234"), array("cID"), array("112393")) . "<br />";
//updateData($b_dFoodSQL, $b_dTable, $b_bSetColList, $b_dSetValList, $b_bWhereColList, $b_dWhereValList)


echo "<b>" . "selectData - Comment" . "</b><br />";
echo selectData($foodSQL, "Comment", array("cINFO"), array("Good Food!!!")) . "<br />";
//echo "<b>" . "selectData - Comment" . "</b><br />";
//echo selectData($foodSQL, "Comment", array("cINFO"), array("18812221"), array("cID", "cINFO", "cTIME")) . "<br />";
//selectData($b_dFoodSQL, $b_dTable, $b_bColList, $b_dValList, $b_dResList)

echo "<b>" . "searchData - Comment" . "</b><br />";
echo searchData($foodSQL, "Comment", array("cINFO"), array("Go%"), array("cID", "cINFO", "cTIME")) . "<br />";
echo "<b>" . "searchData - ViewFoodBld" . "</b><br />";
echo searchData($foodSQL, "ViewFoodBld", array("bID", "fINFO"), array("3", "%命令行%"), array("fID", "fINFO", "wID")) . "<br />";


//echo "<b>" . "addBld - Bld001" . "</b><br />";
//echo addBld($foodSQL, "Bld001", "rod001", "Info for bld 0001") . "ADDbld<br />";
//addBld($b_dFoodSQL, $b_dBldName, $b_dBldSite, $b_dBldInfo)



echo "<b>" . "addData - PlaceWin" . "</b><br />";
echo addData($foodSQL, "PlaceWin", "Win001", "Bld001", "Info for win 0001", "3") . "<br />";
//addData($b_dFoodSQL, $b_dTable, $b_dName, $b_dMark, $b_dInfo, $b_dUpperNodeID)


echo "<b>" . "addData - Food" . "</b><br />";
echo addData($foodSQL, "Food", "Food001", "198", "Info for food 0001命令行下插入汉字", "6") . "<br />";
//addData($b_dFoodSQL, $b_dTable, $b_dName, $b_dMark, $b_dInfo, $b_dUpperNodeID)
echo "<b>" . "selectData - Food" . "</b><br />";
echo selectData($foodSQL, "Food", array("fID"), array("60"), array("fID", "fINFO")) . "<br />";

//echo "<b>" . "addFoodSet - FoodSet001" . "</b><br />";
//echo addFoodSet($foodSQL, "Set001", array("1","2","3")) . "<br />";
//addFoodSet($b_dFoodSQL, $b_dSetName, $b_dFoodIDList)



echo "<b>" . "addUser - Tester" . "</b><br />";
echo addUser($foodSQL, "0", "Tester", "000000") . "<br />";
//addUser($b_dFoodSQL, $b_dType, $b_dName, $b_dPW)


echo "<b>" . "addComment - Food" . "</b><br />";
echo addComment($foodSQL, "Food", "Good Food!!!", "60", "1") . "<br />";
//addComment($b_dFoodSQL, $b_dTable, $b_dComment, $b_dNodeID, $b_dUserID)



echo "<b>" . "getUpperID - Food001 #58" . "</b><br />";
echo getUpperID($foodSQL, "Food", 58) . "<br />";
echo "<b>" . "getUpperID - Win001 #7" . "</b><br />";
echo getUpperID($foodSQL, "PlaceWin", 7) . "<br />";
//getUpperID($b_dFoodSQL, $b_dTable, $b_dID)



echo "<b>" . "getUnderIDList - Win001 #6" . "</b><br />";
echo getUnderIDList($foodSQL, "PlaceWin", 6) . "<br />";
echo "<b>" . "getUnderIDList - Bld001 #3" . "</b><br />";
echo getUnderIDList($foodSQL, "PlaceBld", 3) . "<br />";
//getUnderIDList($b_dFoodSQL, $b_dTable, $b_dID)


echo "<b>" . "getUpperID - Food001 #58" . "</b><br />";
echo getUpperID($foodSQL, "Food", 58) . "<br />";
echo "<b>" . "getUpperID - Win001 #7" . "</b><br />";
echo getUpperID($foodSQL, "PlaceWin", 7) . "<br />";
//getUpperID($b_dFoodSQL, $b_dTable, $b_dID)



echo "<b>" . "getUnderIDList - Win001 #6" . "</b><br />";
echo getUnderIDList($foodSQL, "PlaceWin", 6) . "<br />";
echo "<b>" . "getUnderIDList - Bld001 #3" . "</b><br />";
echo getUnderIDList($foodSQL, "PlaceBld", 3) . "<br />";
//getUnderIDList($b_dFoodSQL, $b_dTable, $b_dID)

return;
?>
<p>end</p>
</body>
</html>