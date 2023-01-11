let gbl_itemList_mvt = [];
let gbl_cartList = [];
let unitsInCart = 0;
let cartItemsTotal=0;

// let mvt_rowToManipulate = null;// Remove or update
// let mvt_indexToManipulate = -1;

// ----- CRUD API calls --------------------------------
//function readItems(type){
function readItemsMvt(){
	startLoadingAnim();

// 	let url = 'Assets/custom/back-end/v1/stock/read.php';
	let url = gbl_rootUrl+'/v1/stock/read.php';
	$.post(url, '', function(data, status){

		let dataObj = JSON.parse(data);
		let res = dataObj['res'];
		gbl_itemList_mvt = res;

		// Show in table
		renderItemTableMvt(res);
		stopLoadingAnim();
	});	
}

function makeMvt(mvtType, itemsList){
	startLoadingAnim();

	let params = {list: itemsList};
	let paramJSON = JSON.stringify(params);
	let formData = `mvt_type=${mvtType}&&operator_id=${gbl_userID}&&moved_items=${paramJSON}`;
	
// 	let url = 'Assets/custom/back-end/v1/movements/create.php';
	let url = gbl_rootUrl+'/v1/movements/create.php';
	$.post(url, formData, function(data, status){
		stopLoadingAnim();

		let dataObj = JSON.parse(data);
		let mvtID = dataObj['mvt_id'];
		let list = dataObj['mvt_items'];

		// console.log(list);

		if(mvtID>0){
			alert('Operation executed successfuly');
			$('#modal_mvt').hide();
			updateQtyPostMvt(mvtType);
			cartItemsTotal=0;
			$('#lbl_items_in_cart').text(cartItemsTotal);
		}
		else
			alert('Oops, Operation failed'); 
	});
}

// _____ CRUD API calls _________________________________


// ----- TABLE FUNCTIONS STOCK ITEMS --------------
function renderItemTableMvt(items){
	let tBody = $('#table_items_mvt tbody');
	let len = items.length;

	$('#table_items_mvt tbody tr').remove();

	for(i=0; i<len; i++){
	 	let item = items[i];

	 	let row = buidRowItemTableMvt(i, item);
		tBody.append(row);
	 }
}

function buidRowItemTableMvt(index, item){
	let row = 
	 "<tr class='tr-text' data-ref="+item.id+" data-ref2="+index+"> "
	+"<td>"+ item.barcode +"</td>"
	+"<td>"+ item.description +"</td>"
	+"<td>"+ item.category +"</td>"
	+"<td>"+ item.qty +"</td>"
	+"<td>"+ mvtBtnGroup() +"</td>"
	+"</tr>";

	return row;
}

function mvtBtnGroup(){
	let btnGroup = 
		"<div class='btn-group me-2'>"
			+"<button type='button' class='btn btn-sm btn-outline-danger' onclick='alterCartQty(this, -1)'> - </button>"
			+"<button type='button' class='btn btn-sm btn-outline-success' onclick='alterCartQty(this, 1)'> + </button>"
		+"</div>";

	return btnGroup;
}

function updateQtyPostMvt(operatorIndex){
	let len = gbl_cartList.length;
	let operators = [-1,1,-1,1];

	for (i = 0; i < len; i++) {
		let cartItem = gbl_cartList[i];
		let stockItem = gbl_itemList_mvt[cartItem.index];

		// Alter QTY (STK to CART)
		stockItem.qty += (cartItem.qtyInCart * operators[operatorIndex]);
	}

	renderItemTableMvt(gbl_itemList_mvt);

	gbl_cartList = [];
}
// _____ TABLE FUNCTIONS STOCK ITEMS ____________________



// ----- CART FUNCTIONS -----------------------------
function alterCartQty(ctl, value){
	let row = $(ctl).parents('tr');
	let id = row.attr('data-ref');
	let index = row.attr('data-ref2');

	addItemsToCart(index, id, value);	

	//$('#lbl_items_in_cart').text(unitsInCart);
}

function addItemsToCart(index, id, value){
	let cartLen = gbl_cartList.length;
	let cartUpdated = false;


	if(cartLen == 0 && value == -1){
		$('#modal_mvt').hide();
		cartItemsTotal = 0;
	}
	else if(cartLen == 0 && value == 1) // If cart is empty -> add 1 unit/qty of seleced item 
		cartUpdated = addItem(index);
	else
		cartUpdated = updateCartQty(index, id, value, cartLen);

	if(cartModalIsVisible == true && cartUpdated == true){
		renderMvtTable(gbl_cartList, cartLen);
	}

	$('#lbl_items_in_cart').text(cartItemsTotal);
} 

function addItem(index){
	gbl_cartList.push(cartItem(gbl_itemList_mvt[index], index));
	// gbl_cartList.push(cartItem(gbl_itemList_mvt[index]));
	cartItemsTotal += 1;
	//unitsInCart += 1; 
	return true;
}

function cartItem(stockItem, index){
	let item = {
		index: index,
		id: stockItem.id,
		
		description: stockItem.description,
		barcode: stockItem.barcode,

		qtyInStock: stockItem.qty,
		qtyInCart: 1
	}

	return item;
}

// Come back to work on this
function updateCartQty(index, id, value, cartLen){
	let foundInCart = false;
	value = parseInt(value);

	let mvtType_string = $('#selector_operator_type').val();

	for(i=0; i<cartLen; i++){
		// If item exist in cart -> add 1 to its qty
		if(gbl_cartList[i].id == id){
			foundInCart = true;

			if(value==1){
				let inStock = gbl_cartList[i].qtyInStock;
				let inCart = gbl_cartList[i].qtyInCart;

				if(inStock < (inCart+1) && (mvtType_string=='Outward' || mvtType_string=='Outward correction')){
					alert('Not enough stock quantity to conclude transaction');
					
					renderMvtTable(gbl_cartList, cartLen);
					$('#modal_mvt').show();
					//break;
					return true;
				}
			}
			
			gbl_cartList[i].qtyInCart += value;
			// unitsInCart += value;
			
			// If cart item qty is 0 -> remove it from cart list
			if(gbl_cartList[i].qtyInCart==0){ 
				gbl_cartList.splice(i, 1);
				cartItemsTotal -= 1;
			}
				
			return true;
		}
	} 

	if(foundInCart==false && value==1){
		addItem(index);
	}
}
// _____ CART FUNCTIONS _________________________________


// ----- TABLE FUNCTIONS CART --------------
function renderMvtTable(items, len){
	let tBody = $('#table_items_to_move tbody');
	
	$('#table_items_to_move tbody tr').remove();

	for(i=0; i<len; i++){
	 	let item = items[i];

	 	let row = buidRowMvtTable(i, item);
		tBody.append(row);
	 }
}

function buidRowMvtTable(index, item){
	let row = 
	 "<tr class='tr-text' data-ref="+item.id+" data-ref2="+index+"> "
	+"<td>"+ item.barcode +"</td>"
	+"<td>"+ item.description +"</td>"
	+"<td>"+ item.qtyInCart +"</td>"
	+"<td>"+ item.qtyInStock +"</td>"
	+"<td>"+ mvtBtnGroupToMove() +"</td>"
	+"</tr>";

	return row;
}

function mvtBtnGroupToMove(){
	let btnGroup = 
		"<div class='btn-group me-2'>"
			+"<button type='button' class='btn btn-sm btn-outline-danger' onclick='alterCartQty(this, -1)'> - </button>"
			+"<button type='button' class='btn btn-sm btn-outline-success' onclick='alterCartQty(this, 1)'> + </button>"
		+"</div>";

	return btnGroup;
}
// _____ TABLE FUNCTIONS CART ____________________

// --------------------------------------------------------
function showConfirmModal_cancelSale(){
	gbl_confirmOperation = 'cancel_cart';
	
	$('#lbl_confirm_msg').text("Are you sure you want to cancel this cart?");
	$('#confirm_modal').show();
}

// Modal confirm
$('#btn_modal_confirm').on('click', function(){
	let id = $('#confirm_modal_id_holder').val();

	if(gbl_confirmOperation=='cancel_cart'){
		gbl_cartList = [];

		$('#modal_mvt').hide();
		$('#confirm_modal').hide();
	}
});

// _____ Table functions __________________________________




// ----- Handling button clicks ----------------------------
let cartModalIsVisible = false;
// Opens cart modal
$('#btn_view_cart').on('click', function(){
	let len = gbl_cartList.length;

	if(len>0){
		renderMvtTable(gbl_cartList, len);
		$('#modal_mvt').show();
		cartModalIsVisible = true;
	}
	else 
		alert('No items in cart, please add by clicking on PLUS button');

});

$('#btn_cancel_mvt').on('click', function(){
	showConfirmModal_cancelSale();
	cartModalIsVisible = false;
	unitsInCart = 0;
	$('#lbl_items_in_cart').text(0);
});

$('#btn_make_mvt').on('click', function(){
	// console.log('Make MVT'+gbl_cartList[0].qtyInCart); // gbl_cartList[0].id
	//let formData = `name=${client.name}&&contact=${client.contact}&&email=${client.email}&&city=${client.city}&&addr=${client.address}`;
	let mvtType_string = $('#selector_operator_type').val();
	let mvtType = 0;

	if(mvtType_string=='Outward') mvtType = 0;
	else if(mvtType_string=='Inward') mvtType = 1;
	else if(mvtType_string=='Outward correction') mvtType = 2;
	else if(mvtType_string=='Inward correction') mvtType = 3;

	let len = gbl_cartList.length;
	let itemsList = [];

	for (i=0; i<len; i++) {
		let item = {
			id: gbl_cartList[i].id,
			qty: gbl_cartList[i].qtyInCart
		}
		itemsList.push(item);
	}

	makeMvt(mvtType, itemsList);	
});	

// _______ Handling button clicks __________________________




