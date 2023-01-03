<?php
	require_once '../../includes/DBQuerries.php';
	$response=array();
	$response['id']=-1;

	if($_SERVER['REQUEST_METHOD']=='POST'){

		if(isset($_POST['mvt_type']) && isset($_POST['operator_id']) && isset($_POST['moved_items']) ){

			$db = new DBQuerries();
			$timeStamp = date('Y-m-d H:i:s');
			$list = json_decode($_POST['moved_items']);

			$response['mvt_items'] = $list->list;

			$mvtID = $db->createMvt($_POST['mvt_type'], $timeStamp, $_POST['operator_id']);
			
			if($mvtID!=-1){
				$db->recordItemsMoved($mvtID, $_POST['mvt_type'], $list->list);
			} 

			$response['mvt_id'] = $mvtID;			
		}
		else $response['report'] = 'Input data not set';
	}
	else $response['report'] = 'Request invalid';

	echo json_encode($response);
?>