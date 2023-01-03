<?php
class Connector{
	private $con;

	function __construct(){}

	function connect(){
		include_once dirname(__FILE__).'/Constants.php';
		
		$this->con = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT);
		
		if($this->con->connect_error) echo "DB con failure".mysql_connect_err();

		return $this->con;
	}
}
?>