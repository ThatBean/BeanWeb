<!--
<!DOCTYPE html> 
<html lang="en"> 
<meta http-equiv="Content-Type" content="text/html; charset=utf8" />
<body>
<p>start</p>
-->
<?php
$charset = "UTF-8";
header("Content-Type: text/html; charset=".$charset);
require 'B_mysql.php';

echo "<p>B_FoodSQL loaded</p>";

$col_FoodSet	= array("sINFO");
$col_Food	= array("fNAME", "fPRICE", "fINFO");
$col_PlaceBld	= array("bNAME", "bSITE", "bINFO");
$col_PlaceWin	= array("wNAME", "wSITE", "wINFO");
$col_Comment	= array("cINFO");
$col_F_S_Link	= array("fID", "sID");
$col_F_W_Link	= array("fID", "wID");
$col_W_B_Link	= array("wID", "bID");
$col_C_Link	= array("cID", "tID", "tTYPE", "uID");
$col_User	= array("uTYPE", "uNAME", "uPW");
$col_ViewFoodBld= array("fID", "wID", "bID", "fNAME", "fPRICE", "fINFO");

$foodSQL_Col	= array(
	"FoodSet" 	=> $col_FoodSet,
	"Food" 		=> $col_Food,
	"PlaceBld" 	=> $col_PlaceBld,
	"PlaceWin" 	=> $col_PlaceWin,
	"Comment" 	=> $col_Comment,
	"F_S_Link" 	=> $col_F_S_Link,
	"F_W_Link" 	=> $col_F_W_Link,
	"W_B_Link" 	=> $col_W_B_Link,
	"C_Link" 	=> $col_C_Link,
	"User" 		=> $col_User,
	"ViewFoodBld"	=> $col_ViewFoodBld
);

$foodSQL_ReqID	= array(
	"FoodSet" 	=> array("sID"),
	"Food" 		=> array("fID"),
	"PlaceBld" 	=> array("bID"),
	"PlaceWin" 	=> array("wID"),
	"Comment" 	=> array("cID"),
	"F_S_Link" 	=> false,
	"F_W_Link" 	=> false,
	"W_B_Link" 	=> false,
	"C_Link" 	=> false,
	"User" 		=> array("uID"),
	"ViewFoodBld"	=> array("fID")
);

$foodSQL_Type	= array(
	"FoodSet" 	=> 1,
	"Food" 		=> 2,
	"PlaceBld" 	=> 3,
	"PlaceWin" 	=> 4,
	"Comment" 	=> 5,
	"F_S_Link" 	=> 6,
	"F_W_Link" 	=> 7,
	"W_B_Link" 	=> 8,
	"C_Link" 	=> 9,
	"User" 		=> 10,
	"ViewFoodBld"	=> 11
);

$foodSQL_UpperLink	= array(
	"FoodSet" 	=> false,
	"Food" 		=> "F_W_Link",
	"PlaceBld" 	=> false,
	"PlaceWin" 	=> "W_B_Link",
	"Comment" 	=> "C_Link",
	"F_S_Link" 	=> false,
	"F_W_Link" 	=> false,
	"W_B_Link" 	=> false,
	"C_Link" 	=> false,
	"User" 		=> false,
	"ViewFoodBld"	=> false
);

$foodSQL_UpperNode	= array(
	"FoodSet" 	=> false,
	"Food" 		=> "PlaceWin",
	"PlaceBld" 	=> false,
	"PlaceWin" 	=> "PlaceBld",
	"Comment" 	=> false,
	"F_S_Link" 	=> false,
	"F_W_Link" 	=> false,
	"W_B_Link" 	=> false,
	"C_Link" 	=> false,
	"User" 		=> false,
	"ViewFoodBld"	=> false
);


$foodSQL_UnderLink	= array(
	"FoodSet" 	=> "F_S_Link",
	"Food" 		=> false,
	"PlaceBld" 	=> "W_B_Link",
	"PlaceWin" 	=> "F_W_Link",
	"Comment" 	=> false,
	"F_S_Link" 	=> false,
	"F_W_Link" 	=> false,
	"W_B_Link" 	=> false,
	"C_Link" 	=> false,
	"User" 		=> false,
	"ViewFoodBld"	=> false
);

$foodSQL_UnderNode	= array(
	"FoodSet" 	=> "Food",
	"Food" 		=> false,
	"PlaceBld" 	=> "PlaceWin",
	"PlaceWin" 	=> "Food",
	"Comment" 	=> false,
	"F_S_Link" 	=> false,
	"F_W_Link" 	=> false,
	"W_B_Link" 	=> false,
	"C_Link" 	=> false,
	"User" 		=> false,
	"ViewFoodBld"	=> false
);

/*$foodSQL_Res	= array(
	"FoodSet" 	=> array("sID"),
	"Food" 		=> array("fID"),
	"PlaceBld" 	=> array("bID"),
	"PlaceWin" 	=> array("wID"),
	"Comment" 	=> array("cID"),
	"F_S_Link" 	=> "",
	"F_W_Link" 	=> "",
	"W_B_Link" 	=> "",
	"C_Link" 	=> "",
	"User" 		=> array("uID"),
	"ViewFoodBld"	=> $col_ViewFoodBld
);*/

function getIDENTITY($b_dFoodSQL) {
	if ($b_dFoodSQL->query("SELECT @@IDENTITY")==-1) return -1;	//"failed to Query ID";
	else {
		$b_dTemp = $b_dFoodSQL->fetch_row();
		echo $b_dTemp[0] . "-Identity<br />";
		return $b_dTemp[0];
	}
}

function insertData($b_dFoodSQL, $b_dTable, $b_dValList) {
	Global $foodSQL_Col, $foodSQL_ReqID;
	//create mysql insert query
	$b_dTemp = $b_dFoodSQL->insert_gen($b_dTable, $foodSQL_Col[$b_dTable], $b_dValList);
	echo $b_dTemp . "<br />";
	if ($b_dTemp==-1) return -1;	//"Bad information Format";
	//make query
	if ($b_dFoodSQL->query($b_dTemp)==-1) return -1;	//"failed to Query insert";
	//check if has an ID for return
	if ($foodSQL_ReqID[$b_dTable]) return getIDENTITY($b_dFoodSQL);
	return 0;	//no ID (for Links)
}

function updateData($b_dFoodSQL, $b_dTable, $b_bSetColList, $b_dSetValList, $b_bWhereColList, $b_dWhereValList) {
	Global $foodSQL_Col;
	//create mysql update query
	$b_dTemp = "UPDATE " . $b_dTable . " " . $b_dFoodSQL->set_gen($b_bSetColList, $b_dSetValList) . " " . $b_dFoodSQL->where_gen($b_bWhereColList, $b_dWhereValList);
	echo $b_dTemp . "<br />";
	if ($b_dTemp==-1) return -1;	//"Bad information Format";
	//make query
	if ($b_dFoodSQL->query($b_dTemp)==-1) return -1;	//"failed to Query insert";
	return 0;
}


function extractResult($b_dFoodSQL, $b_dResList) {
	$b_dRes = "";
	$b_dCount = count( $b_dResList);
	while ($b_dTemp = $b_dFoodSQL->fetch_row()) {
		$b_dRes.="{";
		for ($i=0; $i<$b_dCount; $i++) {
			if ($i) $b_dRes.="|";
			$b_dRes.=$b_dTemp[$b_dResList[$i]];
		}
		$b_dRes.="}";
	}
	//echo $b_dRes . "-Result<br />";
	return $b_dRes;
}

function selectData($b_dFoodSQL, $b_dTable, $b_bColList, $b_dValList, $b_dResList) {
	Global $foodSQL_ReqID;
	//create mysql select query
	$b_dTemp = $b_dFoodSQL->select_gen($b_dResList) . " FROM " . $b_dTable . " " . $b_dFoodSQL->where_gen($b_bColList, $b_dValList);
	echo $b_dTemp . "<br />";
	if ($b_dTemp==-1) return -1;	//"Bad information Format";
	//make query
	if ($b_dFoodSQL->query($b_dTemp)==-1) return -1;	//"failed to Query insert";
	//extract result
	if (!$b_dResList) $b_dResList=$foodSQL_ReqID[$b_dTable];
	return extractResult($b_dFoodSQL, $b_dResList);	//"Finished";
}

function searchData($b_dFoodSQL, $b_dTable, $b_bColList, $b_dValList, $b_dResList, $b_dOr=false) {
	Global $foodSQL_Col;
	//create mysql select query
	$b_dTemp = $b_dFoodSQL->select_gen($b_dResList) . " FROM " . $b_dTable . " " . $b_dFoodSQL->where_gen($b_bColList, $b_dValList, $b_dOr, true);
	echo $b_dTemp . "<br />";
	if ($b_dTemp==-1) return -1;	//"Bad information Format";
	//make query
	if ($b_dFoodSQL->query($b_dTemp)==-1) return -1;	//"failed to Query insert";
	//extract result
	return extractResult($b_dFoodSQL, $b_dResList);	//"Finished";
}



function addBld($b_dFoodSQL, $b_dBldName, $b_dBldSite, $b_dBldInfo) {
	//insert Bld and get cID
	if (($b_dBldID=insertData($b_dFoodSQL, "PlaceBld", array($b_dBldName, $b_dBldSite, $b_dBldInfo)))==-1) return -1;
	return $b_dBldID;
}

function addData($b_dFoodSQL, $b_dTable, $b_dName, $b_dMark, $b_dInfo, $b_dUpperNodeID) {
	Global $foodSQL_Col, $foodSQL_ReqID, $foodSQL_UpperNode, $foodSQL_UpperLink;
	//check if UpperNode exist
	if (!isIDExist($b_dFoodSQL, $foodSQL_UpperNode[$b_dTable], $b_dUpperNodeID)) return -1;
	//insert (Win/Food) and get cID
	if (($b_dID=insertData($b_dFoodSQL, $b_dTable, array($b_dName, $b_dMark, $b_dInfo)))==-1) return -1;
	//add Link
	$b_dValList = array($b_dID, $b_dUpperNodeID);
	if (insertData($b_dFoodSQL, $foodSQL_UpperLink[$b_dTable], $b_dValList)==-1) return -1;
	return 0;
}

function addFoodSet($b_dFoodSQL, $b_dSetName, $b_dFoodIDList) {
	Global $foodSQL_Col, $foodSQL_ReqID;
	//check if Food exist and create INFO string
	$b_dTemp = $b_dSetName . "||";
	foreach ($b_dFoodIDList as $i) {
		if (!isIDExist($b_dFoodSQL, "Food", $i)) return -1;
		$b_dTemp.=$i . "|";
	}
	echo "Created sINFO " . $b_dTemp . "<br />";
	//insert FoodSet and get sID
	if (($b_dID=insertData($b_dFoodSQL, "FoodSet", array($b_dTemp)))==-1) return -1;
	//add many F_S_Link
	foreach ($b_dFoodIDList as $i) {
		$b_dValList = array($i, $b_dID);
		if (insertData($b_dFoodSQL, "F_S_Link", $b_dValList)==-1) return -1;
	}
	return 0;
}

function addUser($b_dFoodSQL, $b_dType, $b_dName, $b_dPW) {
	Global $foodSQL_Col, $foodSQL_Type;
	//insert User and get uID
	if (($b_dID=insertData($b_dFoodSQL, "User", array($b_dType, $b_dName, $b_dPW)))==-1) return -1;
	return $b_dID;
}


function addComment($b_dFoodSQL, $b_dTable, $b_dComment, $b_dNodeID, $b_dUserID) {
	Global $foodSQL_Col, $foodSQL_Type;
	//check if Node and User exist
	if (!isIDExist($b_dFoodSQL, $b_dTable, $b_dNodeID)) return -1;
	if (!isIDExist($b_dFoodSQL, "User", $b_dUserID)) return -1;
	//insert Comment and get cID
	if (($b_dID=insertData($b_dFoodSQL, "Comment", array($b_dComment)))==-1) return -1;
	//create value list
	$b_dValList = array($b_dID, $b_dNodeID, $foodSQL_Type[$b_dTable], $b_dUserID);
	//insert C_Link
	if (insertData($b_dFoodSQL, "C_Link", $b_dValList)==-1) return -1;
	return 0;
}

function isIDExist($b_dFoodSQL, $b_dTable, $b_dID) {
	Global $foodSQL_Col, $foodSQL_ReqID;
	//check if Node exist
	$b_dNodeID=selectData($b_dFoodSQL, $b_dTable, $foodSQL_ReqID[$b_dTable], array($b_dID), $foodSQL_ReqID[$b_dTable]);
	return ($b_dNodeID && ($b_dNodeID!=-1));
}

function getUpperID($b_dFoodSQL, $b_dTable, $b_dID) {
	Global $foodSQL_Col, $foodSQL_ReqID, $foodSQL_UpperNode, $foodSQL_UpperLink;
	//check if UpperNode exist
	if (($b_dUpperNodeID=selectData($b_dFoodSQL, $foodSQL_UpperLink[$b_dTable], $foodSQL_ReqID[$b_dTable], array($b_dID), $foodSQL_ReqID[$foodSQL_UpperNode[$b_dTable]]))==-1) return -1;
	return $b_dUpperNodeID;
}


function getUnderIDList($b_dFoodSQL, $b_dTable, $b_dID) {
	Global $foodSQL_Col, $foodSQL_ReqID, $foodSQL_UnderNode, $foodSQL_UnderLink;
	//check if UpperNode exist
	if (($b_dUnderNodeIDList=selectData($b_dFoodSQL, $foodSQL_UnderLink[$b_dTable], $foodSQL_ReqID[$b_dTable], array($b_dID), $foodSQL_ReqID[$foodSQL_UnderNode[$b_dTable]]))==-1) return -1;
	return $b_dUnderNodeIDList;
}

/*

function delComment
function delBld
function delData (Win/Food)
function delFodSet



//SELECT * FROM `category` WHERE MATCH(catname) AGAINST('you' IN BOOLEAN MODE)
SELECT * FROM `Comment` WHERE MATCH(cINFO) AGAINST('188' IN BOOLEAN MODE);
//SELECT * FROM `category` WHERE body like '%123%';
SELECT * FROM Comment WHERE cINFO like '%188%';

UPDATE Persons SET Age = '36' WHERE FirstName = 'Peter' AND LastName = 'Griffin'
*/

//end of good
return;


echo "<p>step 01</p>";


//die("test error");


$foodSQL = new B_mysql();


$B_host = "localhost";
$B_user = "thatbean_tester";
$B_password = "tester";
$B_database = "thatbean_Food";

//print_r($foodSQL_Col);
//echo "<br />";
//print_r($foodSQL_Col['Comment']);


echo $foodSQL->init($B_host, $B_user, $B_password, $B_database) . "<br />";

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

?>

<p>middle</p>


















<?php
/*
#for UTF-8
ALTER DATABASE `thatbean_Food` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE `Food` CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;

#User
insert into mysql.user(Host,User,Password) values("localhost","thatbean_tester",password("tester"));
flush privileges;
grant all privileges on thatbean_Food.* to thatbean_tester@localhost identified by "tester";
flush privileges;

UPDATE user SET Password = 'tester' WHERE User = 'thatbean' 

#Used for DB creating#############################
CREATE DATABASE thatbean_Food DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

#used for table creating##########################
CREATE TABLE FoodSet (
sID int NOT NULL AUTO_INCREMENT,
sINFO TEXT,
PRIMARY KEY (sID)
) CHARACTER SET utf8 COLLATE utf8_general_ci;

CREATE TABLE Food (
fID int NOT NULL AUTO_INCREMENT,
fNAME TINYTEXT NOT NULL,
fPRICE int NOT NULL,
fINFO TEXT,
PRIMARY KEY (fID)
) CHARACTER SET utf8 COLLATE utf8_general_ci;

CREATE TABLE PlaceBld (
bID int NOT NULL AUTO_INCREMENT,
bNAME TINYTEXT NOT NULL,
bSITE TINYTEXT NOT NULL,
bINFO TEXT,
PRIMARY KEY (bID)
) CHARACTER SET utf8 COLLATE utf8_general_ci;

CREATE TABLE PlaceWin (
wID int NOT NULL AUTO_INCREMENT,
wNAME TINYTEXT NOT NULL,
wSITE TINYTEXT NOT NULL,
wINFO TEXT,
PRIMARY KEY (wID)
) CHARACTER SET utf8 COLLATE utf8_general_ci;




CREATE TABLE Comment (
cID int NOT NULL AUTO_INCREMENT,
cINFO TEXT,
cTIME TIMESTAMP NOT NULL DEFAULT NOW(),
PRIMARY KEY (cID)
) CHARACTER SET utf8 COLLATE utf8_general_ci;



CREATE TABLE User (
uID int NOT NULL AUTO_INCREMENT,
uTYPE int NOT NULL CHECK (uTYPE>0 AND uTYPE<3),
uNAME TINYTEXT NOT NULL,
uPW TEXT NOT NULL,
PRIMARY KEY (uID)
) CHARACTER SET utf8 COLLATE utf8_general_ci;



CREATE TABLE F_S_Link (
fID int NOT NULL,
sID int NOT NULL,
FOREIGN KEY (fID) REFERENCES Food(fID),
FOREIGN KEY (sID) REFERENCES FoodSet(sID)
);

CREATE TABLE F_W_Link (
fID int NOT NULL,
wID int NOT NULL,
FOREIGN KEY (fID) REFERENCES Food(fID),
FOREIGN KEY (wID) REFERENCES PlaceWin(wID),
UNIQUE (fID)
);

CREATE TABLE W_B_Link (
wID int NOT NULL,
bID int NOT NULL,
FOREIGN KEY (wID) REFERENCES PlaceWin(wID),
FOREIGN KEY (bID) REFERENCES PlaceBld(bID),
UNIQUE (wID)
);

CREATE TABLE C_Link (
cID int NOT NULL,
tID int NOT NULL,
tTYPE int NOT NULL CHECK (tTYPE>=1 AND tTYPE<=5),
uID int NOT NULL,
FOREIGN KEY (cID) REFERENCES Comment(cID),
FOREIGN KEY (uID) REFERENCES User(uID),
UNIQUE (tID,tTYPE),
UNIQUE (cID)
);


#search food by building
select * from Food,F_W_Link,W_B_Link WHERE F_W_Link.wID = W_B_Link.wID AND F_W_Link.fID = Food.fID AND Food.fINFO LIKE "%001%";

#create View for "search food by building"
CREATE VIEW ViewFoodBld AS
SELECT Food.fID,F_W_Link.wID,bID,fNAME,fPRICE,fINFO
FROM Food,F_W_Link,W_B_Link
WHERE F_W_Link.wID = W_B_Link.wID AND F_W_Link.fID = Food.fID;


##used for clear up steps
#clear Links
delete from F_S_Link;
delete from F_W_Link;
delete from W_B_Link;
delete from C_Link;
#clear Data
delete from FoodSet;
delete from Food;
delete from PlaceBld;
delete from PlaceWin;
delete from Comment;
delete from User;

*/
?>

<!--
<p>end</p>
</body>
</html>
-->