<?php
	require_once '../../includes/DBQuerries.php';
	$response=array();
	$response['id']=-1;

	if($_SERVER['REQUEST_METHOD']=='POST'){

		if(isset($_POST['name']) && isset($_POST['contact']) && isset($_POST['email']) && isset($_POST['city']) && isset($_POST['address']) && $_POST['id_'] ){

			$db = new DBQuerries();
			
			$response['flag'] = $db->updateClient(
				$_POST['name'], 
				$_POST['contact'], 
				$_POST['email'],
				$_POST['city'],  
				$_POST['address'],
				$_POST['id_']);
			 
		}
		else $response['report'] = 'Input data not set';
	}
	else $response['report'] = 'Request invalid';

	echo json_encode($response);
?>