let gbl_clientList = [];
let client_indexToManipulate=-1;
let client_rowToManipulate=null;


// --- CRUD API Calls BEGIN -------
function createClient(client){
	startLoadingAnim();
	let formData = `name=${client.name}&&contact=${client.contact}&&email=${client.email}&&city=${client.city}&&addr=${client.address}`;
	
	let url = 'Assets/custom/back-end/v1/client/create.php';
	$.post(url, formData, function(data, status){

		let dataObj = JSON.parse(data);
		let id = dataObj['id'];

		console.log(data);

		if(id>0){
			client.id = id;
			clearTxtsClient();
			gbl_clientList.unshift(client);
			renderClienTable(gbl_clientList);
			alert('Operation successful');
		}
		else if(id==-2)
			alert("There is already a client with denomination '"+client.name+"'");
		
		else
			alert('Operation failed, please try again');

		stopLoadingAnim();
	});
}

function readClients(){
	startLoadingAnim();

	let formData = ``;
	let url = 'Assets/custom/back-end/v1/client/read.php';
	$.post(url, formData, function(data, status){
		
		let dataObj = JSON.parse(data);
		let res = dataObj['res'];
		gbl_clientList = res;

		renderClienTable(gbl_clientList);

		stopLoadingAnim();
	});
}

function updateClient(client){
	startLoadingAnim();

	let formData = `name=${client.name}&&contact=${client.contact}&&email=${client.email}&&city=${client.city}&&address=${client.address}&&id_=${client.id}`;

	let url = 'Assets/custom/back-end/v1/client/update.php';
	$.post(url, formData, function(data, status){
		console.log(data);

		let dataObj = JSON.parse(data);
		let flag = dataObj['flag'];

		stopLoadingAnim();

		if(flag==true){
			
			$('#modal_client').hide();

			let newRow = buildClientTableRow(client_indexToManipulate, client);

			$(client_rowToManipulate).after(newRow);
			$(client_rowToManipulate).remove();

			gbl_clientList[client_indexToManipulate].name = client.name;
			gbl_clientList[client_indexToManipulate].contact = client.contact;
			gbl_clientList[client_indexToManipulate].email = client.email;
			gbl_clientList[client_indexToManipulate].city = client.city;
			gbl_clientList[client_indexToManipulate].address = client.address;
		
			alert('Operation successful');
		}
		else 
			alert('Operation failed, please try again');
	
			
	});
}

function deleteClient(cID){
	startLoadingAnim();

	let formData = `id=${cID}`
	let url = 'Assets/custom/back-end/v1/client/delete.php';

	$.post(url, formData, function(data, status){

		stopLoadingAnim();

		let dataObj = JSON.parse(data);
		let flag = dataObj['flag'];

		if(flag==true){
			//alert('Operation successful');

			gbl_clientList.splice(client_indexToManipulate, 1);
			client_rowToManipulate.remove();

			client_indexToManipulate = -1;
			client_rowToManipulate = null;
		}
		else 
			alert('Operation failed, please try again');

		
	});
}
// ___ CRUD API Calls END _________



// --- Table function BEGIN -------
function renderClienTable(clients){
	let tBody = $('#table_client tbody');
	let len = clients.length;

	clearClientsTable();

	for(i=0; i<len; i++){
		let client = clients[i];

		let row = buildClientTableRow(i, client);

		tBody.append(row);
	}
}

function buildClientTableRow(index, client){
	let row = 
	"<tr class='tr-text' data-ref="+client.id+" data-ref2="+index+"> "
	+"<td>"+ client.name +"</td>"
	+"<td>"+ client.contact +"</td>"
	+"<td>"+ client.email +"</td>"
	+"<td>"+ client.city +"</td>"
	+"<td>"+ client.address +"</td>"
	+"<td>"+ dot3MenuClients() +"</td>"
	+"</tr>";

	return row;
}

function dot3MenuClients(){
	let dot3Menu =
		 "<button type='button' class='btn btn-sm dropdown-toggle' id='btn_user3dotmenu' data-bs-toggle='dropdown' aria-expanded='false'></button>"
						    		
		+"<ul class='dropdown-menu' aria-labelledby='btn_user3dotmenu'>"
		    +"<li><a class='dropdown-item' onclick='showClientData(this)'> Update </a></li>"
		    +"<li><a class='dropdown-item' onclick='showClientConfirmModal(this, \"Permanently remove client \", \"delete_client\")'> Remove </a></li>"
		+"</ul>";

	return dot3Menu;
}

function clearClientsTable(){
	$('#table_client tbody tr ').remove();
}

// --- functions called in table
function showClientData(ctl){
	let row = $(ctl).parents('tr');
	client_indexToManipulate= row.attr('data-ref2');
	client_rowToManipulate = row;

	let client = gbl_clientList[client_indexToManipulate];

	$('#txt_client_id').val(client.id);
	$('#txt_client_name').val(client.name);
	$('#txt_client_contact').val(client.contact);
	$('#txt_client_email').val(client.email);
	$('#txt_client_city').val(client.city);
	$('#txt_client_addr').val(client.address);

	$('#btn_client_modal_reg').text('Update');

	$('#modal_client').show();
}

function showClientConfirmModal(ctl, msg, confirmOpr){
	let row = $(ctl).parents('tr');
	client_indexToManipulate= row.attr('data-ref2');
	client_rowToManipulate = row;

	let client = gbl_clientList[client_indexToManipulate];
	
	// Make it clear that this goes accross all js files
	gbl_confirmOperation = confirmOpr;


	$('#lbl_confirm_msg').text(msg+" '"+client.name+"'?");
	$('#confirm_modal_id_holder').val(client.id);
	$('#confirm_modal_index_holder').val(client_indexToManipulate);

	$('#confirm_modal').show();
}

// Modal confirm
$('#btn_modal_confirm').on('click', function(){
	let id = $('#confirm_modal_id_holder').val();

	if(gbl_confirmOperation=='delete_client')
		deleteClient(id);

	$('#confirm_modal').hide();
});

// ___ Table function BEGIN _______



// --- Handling button clicks -----
$('#btn_show_client_modal').on('click', function(){
	$('#modal_client').show();
});

$('#btn_client_modal_reg').on('click', function(){
	let client = {
		name: $('#txt_client_name').val(),
		contact: $('#txt_client_contact').val(),
		email: $('#txt_client_email').val(),
		city: $('#txt_client_city').val(),
		address: $('#txt_client_addr').val(),
		id: $('#txt_client_id').val()
	};

	let opr = $('#btn_client_modal_reg').text();

	if(opr=='Register')
		createClient(client);
	else
		updateClient(client);
});

$('#btn_client_modal_clear').on('click', function(){
	clearTxtsClient();
});
// ___ Handling button clicks _____




// --- Utility function -----------
function clearTxtsClient() {
	$('#txt_client_name').val('');
	$('#txt_client_contact').val('');
	$('#txt_client_email').val('');
	$('#txt_client_city').val('');
	$('#txt_client_addr').val('');
	$('#txt_client_id').val('');
	$('#btn_client_modal_reg').text('Register');

	client_indexToManipulate=-1;
	client_rowToManipulate=null;
}
// ___ Utility function ___________