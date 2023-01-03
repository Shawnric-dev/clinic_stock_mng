<?php
	require_once '../../includes/DBQuerries.php';
	$response=array();
	$response['id']=-1;

	if($_SERVER['REQUEST_METHOD']=='POST'){

		if(isset($_POST['id']) && isset($_POST['pass'])){

			$db = new DBQuerries();
			
			$response['flag'] = $db->updateUserPass($_POST['id'], $_POST['pass']); 
		}
		else $response['report'] = 'Input data not set';
	}
	else $response['report'] = 'Request invalid';

	echo json_encode($response);
?>