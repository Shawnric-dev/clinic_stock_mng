<?php
	require_once '../../includes/DBQuerries.php';
	$responce=array();
	$responce['data']=null;

	if($_SERVER['REQUEST_METHOD']=='POST'){

		if(isset($_POST['user_name'])){

			$db=new DBQuerries();
			$responce['data']=$db->readUserData_($_POST['user_name']);
			// $responce['data']='Returing back'.$_POST['user_name'];
		}
		else $responce['report']='Input data not set'; 
	}
	else $responce['report']='Request invalid';

	echo json_encode($responce);
?>