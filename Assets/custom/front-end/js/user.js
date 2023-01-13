let gbl_userList = [];
let gbl_uType = ['Undefined','Administrator','Operator'];
let gbl_confirmOperation = '';

let rowToManipulate = null;// Remove or update
let indexToManipulate = -1;

let rowToUpdate = null;

// ----- CRUD API calls --------------------------------
function createUser(user){
	startLoadingAnim();
	let formData = `user_name=${user.user_name}&&pass=${user.pass}&&full_name=${user.full_name}&&contact=${user.contact}&&type=${user.type}&&state=${user.state}`;

	let url = gbl_rootUrl+'/v1/user/create.php';
	$.post(url, formData, function(data, status){
		stopLoadingAnim();

		let dataObj = JSON.parse(data);
		let id = dataObj['id'];

		if(id>0){
			user.id = id;
			clearTxts();
			gbl_userList.unshift(user);
			renderUserTable(gbl_userList);
			alert('Operation successful');
		}
		else if(id==-2)
			alert("There already is a user with the name '"+user.user_name+"'");
		
		else 
			alert('Operation failed, please try again');
	});
}

function readUsers(type){
	// Do not filter by type for now
	// Only by state
	startLoadingAnim();
	let state=1;
	let userState = $('#slct_filter_user_type').val();
	if(userState=='Disabled')
		state=0;
	else if(userState=='In line')
		state=2;

	let formData = `type=${type}&&state=${state}`;
	
	let url = gbl_rootUrl+'/v1/user/readUsers.php';
	$.post(url, formData, function(data, status){

		let dataObj = JSON.parse(data);
		let res = dataObj['res'];
		gbl_userList = res;

		// Show in table
		renderUserTable(res);
		stopLoadingAnim();
	});	
}

function updateUser(user){
	startLoadingAnim();
	let formData = `user_id=${user.id}&&pass=${user.pass}&&full_name=${user.full_name}&&contact=${user.contact}&&type=${user.type}`;

	let url = gbl_rootUrl+'/v1/user/update.php';
	$.post(url, formData, function(data, status){

		let dataObj = JSON.parse(data);
		let flag = dataObj['flag'];
		stopLoadingAnim();		

		if(flag==true){
			alert('Operation successful');
			$('#modal_user').hide();

			// Create row with altered data
			let alteredRow = buidRow(
				indexToManipulate, 
				user.id, 
				user.user_name,
				user.full_name,
				user.contact,
				user.type);

			// Remove old row and add updated one
			$(rowToManipulate).after(alteredRow);
			$(rowToManipulate).remove();

			// Update array
			gbl_userList[indexToManipulate].full_name = user.full_name;
			gbl_userList[indexToManipulate].contact = user.contact;
			gbl_userList[indexToManipulate].type = user.type;

			indexToManipulate = -1;
			rowToManipulate = null;
		}
		else 
			alert('Operation failed, please try again');
	});
}

function updateUserState(state, uID){
	startLoadingAnim();

	let formData = `user_id=${uID}&&state=${state}`;

	let url = gbl_rootUrl+'/v1/user/updateState.php';
	$.post(url, formData, function(data, status){
		stopLoadingAnim();

		let dataObj = JSON.parse(data);
		let flag = dataObj['flag'];

		if(flag==true){
			alert('Operation successful');
			gbl_userList.splice(indexToManipulate, 1);
			rowToManipulate.remove();
			
			indexToManipulate = -1;
			rowToManipulate = null;
		}
		else 
			alert('Operation failed, please try again');
	});
}

function deleteUser(uID){
	startLoadingAnim();

	let formData = `user_id=${uID}`;

	let url = gbl_rootUrl+'/v1/user/delete.php';
	$.post(url, formData, function(data, status){
		stopLoadingAnim();

		let dataObj = JSON.parse(data);
		let flag = dataObj['flag'];

		if(flag==true){
			alert('Operation successful');
			gbl_userList.splice(indexToManipulate, 1);
			rowToManipulate.remove();
			
			indexToManipulate = -1;
			rowToManipulate = null;
		}
		else 
			alert('Operation failed, please try again');
	});
}
// _____ CRUD API calls _________________________________




// ----- Table functions --------------------------------
function renderUserTable_onScroll(users, lastIndex){
	let tBody = $('#table_user tbody');
	let len = users.length;

	let remaining = len - lastIndex;
	

	clearTable();

	for(i=0; i<len; i++){
	 	let user = users[i];
	 	
	 	let row = buidRow(
	 		i, user['id'], user['user_name'], 
	 		user['full_name'], user['contact'], user['type']);

		tBody.append(row);
	 }
}

function renderUserTable(users){
	let tBody = $('#table_user tbody');
	let len = users.length;

	clearTable();

	for(i=0; i<len; i++){
	 	let user = users[i];
	 	
	 	let row = buidRow(
	 		i, user['id'], user['user_name'], 
	 		user['full_name'], user['contact'], user['type']);

		tBody.append(row);
	 }
}

function buidRow(index, uID, userName, fullName, contact, type){
	let row = 
	 "<tr class='tr-text' data-ref="+uID+" data-ref2="+index+"> "
	+"<td>"+ userName +"</td>"
	+"<td>"+ fullName +"</td>"
	+"<td>"+ contact +"</td>"
	+"<td>"+ gbl_uType[type] +"</td>"
	+"<td>"+ dot3Menu() +"</td>"
	+"</tr>";

	return row;
}

function dot3Menu(){
	// Add 3 dot meu image
	let dot3Menu =
		 "<button type='button' class='btn btn-sm dropdown-toggle' id='btn_user3dotmenu' data-bs-toggle='dropdown' aria-expanded='false'></button>"
						    		
		+"<ul class='dropdown-menu' aria-labelledby='btn_user3dotmenu'>"
		    +"<li><a class='dropdown-item' onclick='showUserData(this)'> Update </a></li>"
		    +"<li><a class='dropdown-item' onclick='showConfirmModal(this, \"Are you sure you want to disable user \", \"deactivate_user\")'> Disable </a></li>"
		    +"<li><a class='dropdown-item' onclick='showConfirmModal(this, \"Permanently remove user \", \"delete_user\")'> Remove </a></li>"
		+"</ul>";

	return dot3Menu;
}


function clearTable(){
	$('#table_user tbody tr').remove();
}

// --------------------------------------------------------
// Open modal with user info
function showUserData(ctl){
	let row = $(ctl).parents('tr');
	indexToManipulate = row.attr('data-ref2');
	rowToManipulate = row;

	let user = gbl_userList[indexToManipulate];

	$('#txt_user_id').val(user.id);

	// Disable this input field on show data
	$('#txt_user_name').val(user.user_name);
	
	$('#txt_user_pass').val(user.pass);
	$('#txt_user_full_name').val(user.full_name);
	$('#txt_user_contact').val(user.contact);
	$('#slct_user_type').val(gbl_uType[user.type]);

	$('#btn_user_reg').text('Update');

	$('#modal_user').show();
}

function showConfirmModal(ctl, msg, confirmOpr){
	let row = $(ctl).parents('tr');
	let id = row.attr('data-ref');
	indexToManipulate = row.attr('data-ref2');
	rowToManipulate = row;
	
	gbl_confirmOperation = confirmOpr;

	let user = gbl_userList[indexToManipulate];

	$('#lbl_confirm_msg').text(msg+" '"+user.full_name+"'?");
	$('#confirm_modal_id_holder').val(user.id);
	$('#confirm_modal_index_holder').val(indexToManipulate);

	$('#confirm_modal').show();
}

// Modal confirm
$('#btn_modal_confirm').on('click', function(){
	let id = $('#confirm_modal_id_holder').val();

	if(gbl_confirmOperation=='deactivate_user')
		updateUserState(0, id);

	else if(gbl_confirmOperation=='delete_user')
		deleteUser(id);
	
	

	$('#confirm_modal').hide();
});

// _____ Table functions __________________________________




// ----- Handling button clicks ----------------------------
$('#btn_show_user_modal').on('click', function(){
	$('#modal_user').show();
});

$('#btn_user_reg').on('click', function(){
	let opr = $('#btn_user_reg').text();

	let user = {
		id: $('#txt_user_id').val(),
		user_name: $('#txt_user_name').val(),
		pass: $('#txt_user_pass').val(),
		full_name: $('#txt_user_full_name').val(),
		contact: $('#txt_user_contact').val(),
		type: 2,
		state: 1
	};

	if($('#slct_user_type').val()=='Administrator')
		user.type = 1;
	
	if(opr=='Register')
		createUser(user);
	else 
		updateUser(user);

});

$('#btn_user_clear').on('click', function(){
	clearTxts();	
});

// Find out proper event
$('#slct_filter_user_type').on('click', function(){
	readUsers(-1);
});
// _______ Handling button clicks __________________________




// ---- Utility functions ----------------------------------
function clearTxts(){
	$('#txt_user_name').val('');
	$('#txt_user_pass').val('');
	$('#txt_user_full_name').val('');
	$('#txt_user_contact').val('');
	$('#slct_user_type').val('Operator');
	$('#txt_user_id').val('');

	$('#btn_user_reg').text('Register');
}
// ____ Utility function ___________________________________
