<?php
	require_once '../../includes/DBQuerries.php';
	$response=array();
	$response['id']=-1;

	if($_SERVER['REQUEST_METHOD']=='POST'){

		if(isset($_POST['barcode']) && isset($_POST['description']) && isset($_POST['category']) && isset($_POST['id']) ){

			$db = new DBQuerries();
			
			$response['flag'] = $db->updateItem(
				$_POST['barcode'], 
				$_POST['description'],
				$_POST['category'],  
				$_POST['id']);
			 
		}
		else $response['report'] = 'Input data not set';
	}
	else $response['report'] = 'Request invalid';

	echo json_encode($response);
?>