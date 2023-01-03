<?php
class DBQuerries{
	private $con;

	function __construct(){
		require dirname(__FILE__).'/Connector.php';
		$db = new Connector();
		$this->con = $db->connect();
	}
	
// ____GENERIC BEGIN _____
	function read_ifAlreadyExists($val,$col,$table){
		$query='select '.$col.' from '.$table.' where '.$col.'=?';
		$stmt=$this->con->prepare($query);
		$stmt->bind_param('s',$val);
		$stmt->execute();
		$stmt->store_result();

		return $stmt->num_rows>0;
	}

	function deleteRow($val,$col,$table){
		$stmt = $this->con->prepare('delete from '.$table.' where '.$col.'=?;');
		$stmt->bind_param('i', $val);
		return $stmt->execute();
	}
// ____GENERIC END _____



// ____ MAKE MVT BEGIN _____


// ____ MAKE MVT BEGIN ______
	function createMvt($mvtType, $timeStamp, $oprID){
		$stmt = $this->con->prepare('insert into stock_movement(mvt_operator, mvt_timestamp, mvt_type) values(?,?,?);');
		$stmt->bind_param('isi', $oprID, $timeStamp, $mvtType);

		$id=-1;
		if($stmt->execute())
			$id=$this->con->insert_id;

		return $id;
	}

	// Go to stockPro API to see how this is code
	function recordItemsMoved($mvtID, $mvtType, $movedItems){
		$operands = ['-','+','-','+'];
		$operand = $operands[$mvtType];

		$alterStkQtyQuerry = 'update stock_item set qty=qty'.$operand.'? where id=?;';
		$registerMovedItemsQuerry = 'insert into stock_item_moved(item_id, item_qty, mvt_id) values(?,?,?);';

		$stmtAlterQty=$this->con->prepare($alterStkQtyQuerry);
		$stmtRegItems=$this->con->prepare($registerMovedItemsQuerry);

		$stmtAlterQty->bind_param('ii', $qty, $itemID);
		$stmtRegItems->bind_param('iii', $itemID, $qty, $mvtID);

		foreach($movedItems as $item){
			$itemID = $item->id;
			$qty = $item->qty;	

			$stmtAlterQty->execute();
			$stmtRegItems->execute();	
		}

		$stmtAlterQty->close();
		$stmtRegItems->close();
	}

	function readMvts($timeInterval){
		$q = "select 

		stock_movement.mvt_id,
		stock_movement.mvt_timestamp,
		stock_movement.mvt_type,
		user.full_name		


		 from stock_movement, user where stock_movement.mvt_operator=user.id and stock_movement.mvt_timestamp like '$timeInterval%' order by stock_movement.mvt_id desc;";

		$stmt=$this->con->query($q);

		return $stmt->fetch_all(MYSQLI_ASSOC);

		// return $q;
	}

	function readMovedItems($mvtId){
		$q = "
		select 
			stock_item.barcode,
			stock_item.description,
			stock_item_moved.item_qty


		from stock_item_moved, stock_item 

		where stock_item_moved.mvt_id = ? 
		and stock_item_moved.item_id = stock_item.id;";

		$stmt=$this->con->prepare($q);
		$stmt->bind_param('i',$mvtId);
		$stmt->execute();

		return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
	}

// ____STOCK ITEM BEGIN______
	function createItem($barcode, $desc, $cat, $qty){
		$state = 1;

		$stmt = $this->con->prepare('insert into stock_item(barcode, description, category, qty, state) values(?,?,?,?,?);');
		$stmt->bind_param('sssii', $barcode, $desc, $cat, $qty, $state);

		$id=-1;
		if($stmt->execute())
			$id=$this->con->insert_id;

		return $id;
	}

	function readItems(){
		$stmt=$this->con->prepare('select * from stock_item;');
		$stmt->execute();
		return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
	}

	function updateItem($barcode, $desc, $cat, $id){
		$stmt=$this->con->prepare('update stock_item set barcode=?, description=?, category=? where id=?;');
		$stmt->bind_param('sssi', $barcode, $desc, $cat, $id);

		return $stmt->execute();
	}

	function updateItemState($state, $id){
		$stmt=$this->con->prepare('update stock_item set state=? where id=?;');
		$stmt->bind_param('ii', $state, $id);

		return $stmt->execute();
	}
	// Stock alterations are under stock movement
// ____STOCK ITEM END________



// ____STOCK CATEGORY BEGIN______
	function createCategory($name){
		$state = 1;

		$stmt = $this->con->prepare('insert into stock_item_category(name) values(?);');
		$stmt->bind_param('s', $name);

		$id=-1;
		if($stmt->execute())
			$id=$this->con->insert_id;

		return $id;
	}

	function readCategories(){
		$stmt=$this->con->prepare('select * from stock_item_category;');
		$stmt->execute();
		return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
	}
// ____STOCK CATEGORY END________



// ____USER BEGIN_______
	function createUser($userName, $pass, $fullName, $contact, $type, $state){
		$stmt = $this->con->prepare('insert into 
			user(user_name, pass, full_name, contact, type, state) 
			values(?,?,?,?,?,?);');
		$stmt->bind_param('ssssii',$userName, $pass, $fullName, $contact, $type, $state);

		$id=-1;
		if($stmt->execute()) 
			$id=$this->con->insert_id;

		return $id;
	}

	function readUserData($user,$pass){
		$stmt=$this->con->prepare('select id, type, full_name, state from user where user_name=? and pass=?');
		$stmt->bind_param('ss',$user,$pass);
		$stmt->execute();

		return $stmt->get_result()->fetch_assoc();
	}

	// At init
	function readUserData_($user){
		// $stmt=$this->con->prepare('select id, type, full_name, state from user where user_name=?');
		$stmt=$this->con->prepare('select id, pass, type from user where user_name=?');
		$stmt->bind_param('s',$user);
		$stmt->execute();

		return $stmt->get_result()->fetch_assoc();
	}

	function readUsers($type, $state){
		$typeClause='type=?';
		if($type==-1)
			$typeClause='';
		
		$stmt=$this->con->prepare('select * from user where state=? '.$typeClause.' order by user_name asc');

		if($type==-1)
			$stmt->bind_param('i',$state);
		else
			$stmt->bind_param('ii',$state,$type);
			
		$stmt->execute();
		return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
	}

	function updateUser($pass, $fullName, $contact, $type, $id){
		$stmt = $this->con->prepare('
			update user set pass=?, full_name=?, contact=?, type=? where id=?;');
		$stmt->bind_param('sssii', $pass, $fullName, $contact, $type, $id);
		return $stmt->execute();
	}

	function updateUserState($state, $id){
		$stmt = $this->con->prepare('
			update user set state=? where id=?;');
		$stmt->bind_param('ii', $state, $id);
		return $stmt->execute();
	}

	function updateUserPass($id, $pass){
		$stmt = $this->con->prepare('
			update user set pass=? where id=?;');
		$stmt->bind_param('si', $pass, $id);
		return $stmt->execute();
	}
// ____USER END_______



// ____CLIENT BEGIN______
	function createClient($name, $contact, $email, $city, $addr){
		$stmt = $this->con->prepare('insert into client(name, contact, email, city, address) values(?,?,?,?,?);');
		$stmt->bind_param('sssss', $name, $contact, $email, $city, $addr);

		$id=-1;
		if($stmt->execute())
			$id=$this->con->insert_id;

		return $id;
	}

	function readClients(){
		$stmt=$this->con->prepare('select * from client;');
		$stmt->execute();
		return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
	}

	function updateClient($name, $contact, $email, $city, $addr, $id){
		$stmt=$this->con->prepare('update client set name=?, contact=?, email=?, city=?, address=? where id=?;');
		$stmt->bind_param('sssssi', $name, $contact, $email, $city, $addr, $id);

		return $stmt->execute();
	}
// ____CLIENT END________
}
?>