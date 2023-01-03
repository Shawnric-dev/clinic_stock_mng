<?php
	require_once '../../includes/DBQuerries.php';
	$responce=array();
	$responce['res']=null;

	if($_SERVER['REQUEST_METHOD']=='POST'){

		if(isset($_POST['time_interval'])){

			$responce['date']=''; 
			$date = $_POST['time_interval'];
			if($date=='onInit'){
				$date = date('Y-m-d');
				$responce['date']=$date;
			}

			$db=new DBQuerries();
			$responce['res']=$db->readMvts($date);
		}
		else $responce['report']='Input data not set'; 
	}
	else $responce['report']='Request invalid';

	echo json_encode($responce);
?>