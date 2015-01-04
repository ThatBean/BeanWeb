<?php
//echo "ing...";
$msg_sp="||";	//message spliter

//get parameters from URL
if ($_POST["file_name"]=="") {
	echo "[file]File name please...";	
	return;
}

//echo "set " . get_magic_quotes_gpc() . "<br />"; //check if auto add slash

if ($_POST["option"]=="mod") {
	fileMod();
}
elseif ($_POST["option"]=="open") {
	fileOpen($msg_sp);
}
else {
	echo "[file]error option...<br />how did you do that?";
}
return;

function fileMod() {
	$file_name=$_POST["file_name"];
	$file_path=($_POST["file_path"]==""?".":$_POST["file_path"]). "/".$file_name;
	$file_text=$_POST["file_text"];	//Auto decode
	//$file_text=urldecode($_POST["file_text"]);	//Bugged "+" -> " "
	if (get_magic_quotes_gpc()==1) {	//no auto add slash
		$file_text=stripslashes($file_text);
	}
	$response="";
	//echo $file_name . " | " . $file_path . " | " . $file_text;
	/**/
	if (file_exists($file_path)) {
		$response="[mod]file " . $file_path . " exists, overwriting... <br />";
	}
	else {
		$response="[mod]file " . $file_path . " creating... <br />";
	}

	$file = fopen($file_path,"wb");
	if ($file) {
		$response=$response . "[mod]" . fwrite($file,$file_text) . " char written to file. <br />";
		fclose($file);
		$response=$response . "[mod]chOwn/chMod: " . chown($file_path,"Bean") ."/". chmod($file_path,0644) ."<br />";
	}
	else {
		$response=$response . "[mod]failed to open file. <br />";
	}
	//output the response
	echo $response;
	//echo $file_name . "|" .$file_path . " | " . $file_text . " | " . $_POST["file_text"];
	/**/
}

function fileOpen($msg_sp) {
	$file_name=$_POST["file_name"];
	$file_path=($_POST["file_path"] == "" ? "." : $_POST["file_path"]) . "/" . $file_name;
	$response="";
	if (!file_exists($file_path)) {
		echo "[open]file " . $file_path . " does not exist...";
		return;
	}
	$response=file_get_contents($file_path);
	if ($response=="") {
		echo "[open]file is empty or failed to open...";
		return;
	}
	//output the response
	echo "[open]get file " . $file_path . " contents success..." . $msg_sp . $response;
	return;
}
?>