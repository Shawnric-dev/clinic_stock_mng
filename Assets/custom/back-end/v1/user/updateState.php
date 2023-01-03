<?php
	require_once '../../includes/DBQuerries.php';
	$response=array();
	$response['id']=-1;

	if($_SERVER['REQUEST_METHOD']=='POST'){

		if(isset($_POST['user_id']) && isset($_POST['state'])){

			$db = new DBQuerries();
			
			$response['flag'] = $db->updateUserState(
				$_POST['state'], $_POST['user_id']); 
		}
		else $response['report'] = 'Input data not set';
	}
	else $response['report'] = 'Request invalid';

	echo json_encode($response);
?>