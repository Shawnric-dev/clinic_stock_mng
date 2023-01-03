<?php
	require_once '../../includes/DBQuerries.php';
	$response=array();
	$response['id']=-1;

	if($_SERVER['REQUEST_METHOD']=='POST'){

		if(isset($_POST['user_name']) && isset($_POST['pass']) && isset($_POST['full_name']) && isset($_POST['contact']) && isset($_POST['type']) && isset($_POST['state'])){

			$db = new DBQuerries();
			
			if($db->read_ifAlreadyExists($_POST['user_name'], 'user_name', 'user')==false){

				$response['id'] = $db->createUser(
					$_POST['user_name'], 
					$_POST['pass'], 
					$_POST['full_name'],
					$_POST['contact'],  
					$_POST['type'], 
					$_POST['state']);
			}
			else $response['id']=-2; 
		}
		else $response['report'] = 'Input data not set';
	}
	else $response['report'] = 'Request invalid';

	echo json_encode($response);
?>