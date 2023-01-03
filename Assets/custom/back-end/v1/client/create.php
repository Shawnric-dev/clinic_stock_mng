<?php
	require_once '../../includes/DBQuerries.php';
	$response=array();
	$response['id']=-1;

	if($_SERVER['REQUEST_METHOD']=='POST'){

		if(isset($_POST['name']) && isset($_POST['contact']) && isset($_POST['email']) && isset($_POST['city']) && isset($_POST['addr']) ){

			$db = new DBQuerries();
			
			if($db->read_ifAlreadyExists($_POST['name'], 'name', 'client')==false){

				$response['id'] = $db->createClient(
					$_POST['name'], 
					$_POST['contact'], 
					$_POST['email'],
					$_POST['city'],  
					$_POST['addr']);

				$response['addr:']=$_POST['addr'];	
			}
			else $response['id']=-2; 
		}
		else $response['report'] = 'Input data not set';
	}
	else $response['report'] = 'Request invalid';

	echo json_encode($response);
?>