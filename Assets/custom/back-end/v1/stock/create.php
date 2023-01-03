<?php
	require_once '../../includes/DBQuerries.php';
	$response=array();
	$response['id']=-1;

	if($_SERVER['REQUEST_METHOD']=='POST'){

		if(isset($_POST['barcode']) && isset($_POST['description']) && isset($_POST['category']) && isset($_POST['qty']) ){

			$db = new DBQuerries();
			
			$barcodeExists = $db->read_ifAlreadyExists($_POST['barcode'], 'barcode', 'stock_item');

			$descriptionExists = $db->read_ifAlreadyExists($_POST['description'], 'description', 'stock_item');

			if($barcodeExists==false && $descriptionExists==false){

				$response['id'] = $db->createItem(
					$_POST['barcode'], 
					$_POST['description'], 
					$_POST['category'],
					$_POST['qty']);
			}
			else if($barcodeExists==true) 
				$response['id']=-2;

			else if($descriptionExists==true) 
				$response['id']=-3; 
		}
		else $response['report'] = 'Input data not set';
	}
	else $response['report'] = 'Request invalid';

	echo json_encode($response);
?>