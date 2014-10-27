<?php

/*
reqType:
'get':
	ID
	Detail
	WebLink(ID & Name)
	List
'search':(Food Only)
	string
	string in bld
'add':
'set':
'query':
*/



function echoReturn($msg) {
	echo $msg . "<br />";	
	die;
}

//global
$msg_sp="||";	//message spliter


//First Check
if ($_POST["FoodSQL"]=="") echoReturn("[Error]Are you sure this is the right php file?");	

//get parameters from URL
$reqType=$_POST["reqType"];	//type | sub type
$reqSpec=$_POST["reqSpec"];	//table | col |[value]
if (!($reqType && $reqSpec)) echoReturn("[Error]Error request...");

$reqText=$_POST["reqText"];	//for set/query
if (get_magic_quotes_gpc()==1 && !$reqText) $reqText=stripslashes($reqText);


//prepare sesult...
require 'B_FoodSQL.php';

$B_host = "localhost";
$B_user = "thatbean_tester";
$B_password = "tester";
$B_database = "thatbean_Food";
$foodSQL = new B_mysql();
if ($foodSQL->init($B_host, $B_user, $B_password, $B_database)!=1) echoReturn("[Error]Error db info...");

$reqType = explode($msg_sp,$reqType);
$reqSpec = explode($msg_sp,$reqSpec);

switch ($reqType[0])
{
	case "get":
		func_get($foodSQL, $reqType[1], $reqSpec);
		break;
	/*
	case "search":
		func_search($foodSQL, $reqType[1], $reqSpec);
		break;
	case "add":
		func_add($foodSQL, $reqType[1], $reqSpec);
		break;
	case "set":
		func_set($foodSQL, $reqType[1], $reqSpec);
		break;
	case "delete":
		func_delete($foodSQL, $reqType[1], $reqSpec);
		break;
	case "query":
		func_query($foodSQL, $reqType[1], $reqSpec);
		break;
	*/
	default:
		echoReturn("[Error]Error request type...");
		break;
}
//shouldn't reach here..
return;




function func_get($foodSQL, $reqSubType, $reqSpec) {
	global $msg_sp;
	echo $msg_sp . $reqSubType . $msg_sp . $reqSpec[0] . $msg_sp;
	
//	echo "good" . $reqSubType . $reqSpec . "<br />";
	switch ($reqSubType)
	{
		case "Detail":
			//if ($foodSQL_UpperNode[$reqSpec[0]]!=false) echo $msg_sp . "UPID" . getUpperID($foodSQL, $reqSpec[0], $reqSpec[2]);
			//if ($foodSQL_UnderNode[$reqSpec[0]]!=false) echo $msg_sp . "UDID" . getUnderIDList($foodSQL, $reqSpec[0], $reqSpec[2]);
		case "WebLink":
			echo $msg_sp . selectData($foodSQL, $reqSpec[0], explode(",", $reqSpec[1]), explode(",", $reqSpec[2]), explode(",", $reqSpec[3]));
			break;
		case "UpperID":
			echo $msg_sp . getUpperID($foodSQL, $reqSpec[0], $reqSpec[1]);
			break;
		case "UnderList":
			echo $msg_sp . getUnderIDList($foodSQL, $reqSpec[0], $reqSpec[1]);
			break;
		default:
			echoReturn("[Error]Error request sub type...");
			break;
	}
}





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