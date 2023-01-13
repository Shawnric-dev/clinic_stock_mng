let gbl_itemList = [];
//let gbl_uType = ['Undefined','Administrator','Operator'];
let categoryList = [];

let item_rowToManipulate = null;// Remove or update
let item_indexToManipulate = -1;

// ----- CRUD API calls --------------------------------
function createItem(item){
	startLoadingAnim();
	let formData = `barcode=${item.barcode}&&description=${item.description}&&category=${item.category}&&qty=${item.qty}`;

	let url = gbl_rootUrl+'/v1/stock/create.php';
	$.post(url, formData, function(data, status){
		stopLoadingAnim();

		let dataObj = JSON.parse(data);
		let id = dataObj['id'];
		let report = dataObj['id'];
 
		if(id>0){
			item.id = id;
			clearTxtsItem();
			gbl_itemList.unshift(item);
			renderItemTable(gbl_itemList);
			alert('Operation successful');
		}
		else if(id==-2)
			alert("There already is an item with barcode '"+item.barcode+"'");

		else if(id==-3)
			alert("There already is an item with description '"+item.description+"'");
		
		else 
			alert('Operation failed, please try again');
	});
}

//function readItems(type){
function readItems(){
	// Do not filter by type for now
	// Only by state.. State feature not active in this version of CIM
	// let state=1;
	// let userState = $('#slct_filter_user_type').val();
	// if(userState=='Disabled')
	// 	state=0;
	// else if(userState=='In line')
	// 	state=2;

	//let formData = `type=${type}&&state=${state}`;
	startLoadingAnim();
	
	let url = gbl_rootUrl+'/v1/stock/read.php';
	$.post(url, '', function(data, status){

		let dataObj = JSON.parse(data);
		let res = dataObj['res'];
		gbl_itemList = res;

		// Show in table
		renderItemTable(res);
		stopLoadingAnim();
	});	
}

function updateItem(item){
	startLoadingAnim();

	let formData = `id=${item.id}&&barcode=${item.barcode}&&description=${item.description}&&category=${item.category}`;

	let url = gbl_rootUrl+'/v1/stock/update.php';
	$.post(url, formData, function(data, status){
		stopLoadingAnim();

		let dataObj = JSON.parse(data);
		let flag = dataObj['flag'];

		if(flag==true){
			alert('Operation successful');
			$('#modal_item').hide();

			// Create row with altered data
			let alteredRow = buidRowItemTable(item_indexToManipulate, item);

			// Remove old row and add updated one
			$(item_rowToManipulate).after(alteredRow);
			$(item_rowToManipulate).remove();

			// Update array
			gbl_itemList[item_indexToManipulate].full_name = item.barcode;
			gbl_itemList[item_indexToManipulate].description = item.description;
			gbl_itemList[item_indexToManipulate].category = item.category;

			item_indexToManipulate = -1;
			item_rowToManipulate = null;

			clearTxtsItem();
		}
		else 
			alert('Operation failed, please try again');
	});
}

// function updateItemState(state, uID){
// 	let formData = `user_id=${uID}
// 					&&state=${state}`;

// 	let url = 'Assets/custom/back-end/v1/stock/updateState.php';
// 	$.post(url, formData, function(data, status){

// 		let dataObj = JSON.parse(data);
// 		let flag = dataObj['flag'];

// 		if(flag==true){
// 			alert('Operation successful');
// 			gbl_itemList.splice(item_indexToManipulate, 1);
// 			item_rowToManipulate.remove();
			
// 			item_indexToManipulate = -1;
// 			item_rowToManipulate = null;
// 		}
// 		else 
// 			alert('Operation failed, please try again');
// 	});
// }

function deleteItem(uID){
	startLoadingAnim();

	let formData = `id=${uID}`;

	let url = gbl_rootUrl+'/v1/stock/delete.php';
	$.post(url, formData, function(data, status){
		stopLoadingAnim();

		let dataObj = JSON.parse(data);
		let flag = dataObj['flag'];

		if(flag==true){
			// alert('Operation successful');
			gbl_itemList.splice(item_indexToManipulate, 1);
			item_rowToManipulate.remove();
			
			item_indexToManipulate = -1;
			item_rowToManipulate = null;
		}
		else 
			alert('Operation failed, please try again');
	});
}
// _____ CRUD API calls _________________________________




// TO BE WORKED ON
// ----- Table functions --------------------------------
// function renderItemTable_onScroll(users, lastIndex){
// 	let tBody = $('#table_user tbody');
// 	let len = users.length;

// 	let remaining = len - lastIndex;
	

// 	clearTableItem();

// 	for(i=0; i<len; i++){
// 	 	let user = users[i];
	 	
// 	 	let row = buidRow(
// 	 		i, user['id'], user['user_name'], 
// 	 		user['full_name'], user['contact'], user['type']);

// 		tBody.append(row);
// 	 }
//}

function renderItemTable(items){
	let tBody = $('#table_items tbody');
	let len = items.length;

	clearTableItem();

	for(i=0; i<len; i++){
	 	let item = items[i];
	 	// console.log();
	 	let row = buidRowItemTable(i, item);
		tBody.append(row);
	 }
}

function buidRowItemTable(index, item){
	let row = 
	 "<tr class='tr-text' data-ref="+item.id+" data-ref2="+index+"> "
	+"<td>"+ item.barcode +"</td>"
	+"<td>"+ item.description +"</td>"
	+"<td>"+ item.category +"</td>"
	+"<td>"+ item.qty +"</td>"
	+"<td>"+ dot3MenuItem() +"</td>"
	+"</tr>";

	return row;
}

function dot3MenuItem(){
	// Add 3 dot meu image
	let dot3Menu =
		 "<button type='button' class='btn btn-sm dropdown-toggle' id='btn_user3dotmenu' data-bs-toggle='dropdown' aria-expanded='false'></button>"
						    		
		+"<ul class='dropdown-menu' aria-labelledby='btn_user3dotmenu'>"
		    +"<li><a class='dropdown-item' onclick='showItemData(this)'> Update </a></li>"
		    +"<li><a class='dropdown-item' onclick='showConfirmModal(this, \"Permanently remove item \", \"delete_item\")'> Remove </a></li>"
		+"</ul>";

	return dot3Menu;
}


function clearTableItem(){
	$('#table_items tbody tr').remove();
}

// --------------------------------------------------------
// Open modal with user info
function showItemData(ctl){
	let row = $(ctl).parents('tr');
	item_indexToManipulate = row.attr('data-ref2');
	item_rowToManipulate = row;

	let item = gbl_itemList[item_indexToManipulate];

	$('#txt_item_id').val(item.id);

	$('#txt_barcode').val(item.barcode);	
	$('#txt_desc').val(item.description);
	$('#txt_cat').val(item.category);
	$('#txt_qty').val(item.qty);

	$('#btn_item_modal_reg').text('Update');

	$('#modal_item').show();
}

function showConfirmModal(ctl, msg, confirmOpr){
	let row = $(ctl).parents('tr');
	let id = row.attr('data-ref');
	item_indexToManipulate = row.attr('data-ref2');
	item_rowToManipulate = row;
	
	gbl_confirmOperation = confirmOpr;

	let item = gbl_itemList[item_indexToManipulate];

	$('#lbl_confirm_msg').text(msg+" ("+item.barcode+", "+item.description+")?");
	$('#confirm_modal_id_holder').val(item.id);
	$('#confirm_modal_index_holder').val(item_indexToManipulate);

	$('#confirm_modal').show();
}

// Modal confirm
$('#btn_modal_confirm').on('click', function(){
	let id = $('#confirm_modal_id_holder').val();

	if(gbl_confirmOperation=='deactivate_item')
		updateItemState(0, id);

	else if(gbl_confirmOperation=='delete_item')
		deleteItem(id);
	
	$('#confirm_modal').hide();
});

// _____ Table functions __________________________________




// ----- Handling button clicks ----------------------------
$('#btn_show_item_modal').on('click', function(){
	$('#modal_item').show();
});

$('#btn_item_modal_reg').on('click', function(){
	let opr = $('#btn_item_modal_reg').text();

	let item = {
		id: $('#txt_item_id').val(),
		barcode: $('#txt_barcode').val(),
		description: $('#txt_desc').val(),
		category: $('#txt_cat').val(),
		qty: $('#txt_qty').val(),
		state: 1		
	};
	
	if(opr=='Register')
		createItem(item);
	else 
		updateItem(item);

});

$('#btn_item_modal_clear').on('click', function(){
	clearTxtsItem();	
});

// _______ Handling button clicks __________________________




// ---- Utility functions ----------------------------------
function clearTxtsItem(){
	$('#txt_barcode').val('');
	$('#txt_desc').val('');
	$('#txt_cat').val('');
	$('#txt_qty').val('');
	$('#txt_item_id').val('');

	$('#btn_item_modal_reg').text('Register');
}
// ____ Utility function ___________________________________
