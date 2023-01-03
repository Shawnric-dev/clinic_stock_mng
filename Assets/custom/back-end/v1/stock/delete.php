<?php
	require_once '../../includes/DBQuerries.php';
	$response=array();
	$response['id']=-1;

	if($_SERVER['REQUEST_METHOD']=='POST'){

		if(isset($_POST['id'])){

			$db = new DBQuerries();
			// $response['flag'] = $db->deleteUser($_POST['user_id']); 
			$response['flag'] = $db->deleteRow($_POST['id'], 'id', 'stock_item');
		}
		else $response['report'] = 'Input data not set';
	}
	else $response['report'] = 'Request invalid';

	echo json_encode($response);
?>