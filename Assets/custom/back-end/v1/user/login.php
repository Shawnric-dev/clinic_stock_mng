<?php
	require_once '../../includes/DBQuerries.php';
	$responce=array();
	$responce['data']=null;

	if($_SERVER['REQUEST_METHOD']=='POST'){

		if(isset($_POST['user_name']) && isset($_POST['pass'])){

			$db=new DBQuerries();
			$responce['data']=$db->readUserData($_POST['user_name'], $_POST['pass']);
		}
		else $responce['report']='Input data not set'; 
	}
	else $responce['report']='Request invalid';

	echo json_encode($responce);
?>