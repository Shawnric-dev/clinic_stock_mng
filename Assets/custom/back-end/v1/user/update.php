<?php
	require_once '../../includes/DBQuerries.php';
	$response=array();
	$response['id']=-1;

	if($_SERVER['REQUEST_METHOD']=='POST'){

		if(isset($_POST['user_id']) && isset($_POST['pass']) && isset($_POST['full_name']) && isset($_POST['contact']) && isset($_POST['type'])){

			$db = new DBQuerries();
			
			$response['flag'] = $db->updateUser(
				$_POST['pass'], 
				$_POST['full_name'],
				$_POST['contact'],  
				$_POST['type'], 
				$_POST['user_id']);
			 
		}
		else $response['report'] = 'Input data not set';
	}
	else $response['report'] = 'Request invalid';

	echo json_encode($response);
?>