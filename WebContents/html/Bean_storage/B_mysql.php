<?php
class B_mysql {
	var $B_sql_host;
	var $B_sql_user;
	var $B_sql_password;
	var $B_sql_database;
	
	var $B_sql_connection;
	var $B_sql_result;
	
	var $B_sql_error;
	
	function init($b_host,$b_user,$b_pw,$b_db){
		//echo "initining " . $b_db;
		$this->B_sql_error = "";
		$this->B_sql_host = $b_host;
		$this->B_sql_user = $b_user;
		$this->B_sql_password = $b_pw;
		$this->B_sql_database = $b_db;
		$this->B_sql_connection = mysql_connect($this->B_sql_host, $this->B_sql_user, $this->B_sql_password);
		$this->check_connection();
		$this->query("SET NAMES 'utf8'");
		//echo "inited " . $b_db;
		return mysql_select_db($this->B_sql_database, $this->B_sql_connection);
	}
	
	function query($b_query){
		$this->check_connection();
		if (!($this->B_sql_result = mysql_query($b_query, $this->B_sql_connection))) {
			$this->B_sql_result = mysql_error();
			return -1;
		}
		return 0;
	}
	
	function where_gen($b_qColList, $b_qValList, $b_qOr=false, $b_qLike=false){
		$b_qCount = count($b_qColList);
		if ($b_qCount != count($b_qValList)) return -1;
		$b_qTempWhere="WHERE ";
		if ($b_qColList) {
			for ($i=0; $i<$b_qCount; $i++) {
				if ($i) $b_qTempWhere.=($b_qOr?" OR ":" AND ");
				$b_qTempWhere.=array_shift($b_qColList) . ($b_qLike?" like '":" = '") . array_shift($b_qValList) . "'";
			}
		}
		return $b_qTempWhere;
	}
		
	function select_gen($b_qResList=false){
		$b_qTempRes="SELECT ";
		if ($b_qResList) {
			$b_qCount = count($b_qResList);
			for ($i=0; $i<$b_qCount; $i++) {
				if ($i) $b_qTempRes.=",";
				$b_qTempRes.=array_shift($b_qResList);
			}
		}
		else $b_qTempRes.="*";
		return $b_qTempRes;
	}
	
	function insert_gen($b_qTable, $b_qColList, $b_qValList){
		$b_qCount = count($b_qColList);
		if ($b_qCount != count($b_qValList)) return -1;
		$b_qTempCol="";
		$b_qTempVal="";
		for ($i=0; $i<$b_qCount; $i++) {
			if ($i) {
				$b_qTempCol.=",";
				$b_qTempVal.=",";
			}
			$b_qTempCol.=array_shift($b_qColList);
			$b_qTempVal.="'" . array_shift($b_qValList) . "'";
		}
		return ("INSERT INTO " . $b_qTable . "(" . $b_qTempCol . ") VALUES(" . $b_qTempVal . ")");
	}
	
	function set_gen($b_qColList, $b_qValList){
		$b_qCount = count($b_qColList);
		if ($b_qCount != count($b_qValList)) return -1;
		$b_qTempSet="SET ";
		for ($i=0; $i<$b_qCount; $i++) {
			if ($i) $b_qTempSet.=",";
			$b_qTempSet.=array_shift($b_qColList) . " = '" . array_shift($b_qValList) . "'";
		}
		return $b_qTempSet;
	}
	
	function fetch_row(){
		//echo "fetching..." . "<br />";
		//echo $this->B_sql_result . "<br />";
		return mysql_fetch_array($this->B_sql_result);
	}
	
	function check_connection(){
		if (!$this->B_sql_connection) {
			$this->B_sql_connection = mysql_connect($this->B_sql_host, $this->B_sql_user, $this->B_sql_password);
			if (!$this->B_sql_connection) {
				$this->B_sql_error = mysql_error();
				//die($this->B_sql_error);
				echo "error " . $this->B_sql_error;
				return -1;
			}
		}
	}
}
?>