<?php
	require_once '../../includes/DBQuerries.php';
	$responce=array();
	$responce['res']=null;

	if($_SERVER['REQUEST_METHOD']=='POST'){

		if(isset($_POST['mvt_id'])){

			$db=new DBQuerries();
			$responce['res']=$db->readMovedItems($_POST['mvt_id']);
		}
		else $responce['report']='Input data not set'; 
	}
	else $responce['report']='Request invalid';

	echo json_encode($responce);
?>