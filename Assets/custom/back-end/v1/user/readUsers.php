<?php
	require_once '../../includes/DBQuerries.php';
	$responce=array();
	$responce['res']=null;

	if($_SERVER['REQUEST_METHOD']=='POST'){

		if(isset($_POST['type']) && isset($_POST['state'])){

			$db=new DBQuerries();
			$responce['res']=$db->readUsers($_POST['type'], $_POST['state']);
		}
		else $responce['report']='Input data not set'; 
	}
	else $responce['report']='Request invalid';

	echo json_encode($responce);
?>