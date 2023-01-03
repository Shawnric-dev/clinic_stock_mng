<?php
	require_once '../../includes/DBQuerries.php';
	$response=array();
	$response['id']=-1;

	if($_SERVER['REQUEST_METHOD']=='POST'){

		if(isset($_POST['id']) && isset($_POST['state'])){

			$db = new DBQuerries();
			
			$response['flag'] = $db->updateItemState(
				$_POST['state'], $_POST['id']); 
		}
		else $response['report'] = 'Input data not set';
	}
	else $response['report'] = 'Request invalid';

	echo json_encode($response);
?>