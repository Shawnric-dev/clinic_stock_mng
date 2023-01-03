let gbl_mvtRepList = [];
let mvtRep_indexToManipulate=-1;
let mvtTypes = ['Outward', 'Inward','Outward correction', 'Inward correction'];

// --- CRUD API Calls BEGIN -------
function readMvts(timeInterval){
	startLoadingAnim();

	let formData = `time_interval=${timeInterval}`;
	let url = 'Assets/custom/back-end/v1/movements/read.php';
	$.post(url, formData, function(data, status){
	
		let dataObj = JSON.parse(data);
		let res = dataObj['res'];
		gbl_mvtRepList = res;

		renderMovementsTable(gbl_mvtRepList);

		stopLoadingAnim();

		if(timeInterval=='onInit'){
			$('#txt_filter_report_time').val(dataObj['date']);
		}
	});
}

function readMovedItems(mvt){
	startLoadingAnim();

	let formData = `mvt_id=${mvt.mvt_id}`;
	let url = 'Assets/custom/back-end/v1/movements/readMovedItems.php';
	$.post(url, formData, function(data, status){
	
		let dataObj = JSON.parse(data);
		let res = dataObj['res'];

		renderMovedItemsTable(res);
		stopLoadingAnim();

		// Construct
		$('#txt_mvditems_type').text(mvtTypes[mvt.mvt_type]+" (N. "+mvt.mvt_id+")");
		$('#txt_mvditems_timestamp').text(mvt.mvt_timestamp);
		$('#txt_mvditems_operator').text(mvt.full_name);

		$('#modal_moved_items').show();
	});
}
// ___ CRUD API Calls END _________



// --- Table function BEGIN -------
function renderMovementsTable(mvtList){
	let tBody = $('#table_reports tbody');
	let len = mvtList.length;

	$('#table_reports tbody tr ').remove();

	for(i=0; i<len; i++){
		// console.log(mvt);
		let mvt = mvtList[i];
		let row = buildMvtTableRow(i, mvt);
		tBody.append(row);
	}
}

function buildMvtTableRow(index, mvt){
	let row = 
	"<tr class='tr-text' data-ref="+mvt.mvt_id+" data-ref2="+index+"> "
	+"<td>"+ mvt.mvt_id +"</td>"
	+"<td>"+ mvt.mvt_timestamp +"</td>"
	+"<td>"+ mvt.full_name +"</td>"
	+"<td>"+ mvtTypes[mvt.mvt_type] +"</td>"
	+"<td>"+ dot3MenuMvt() +"</td>"
	+"</tr>";

	return row;
}

function dot3MenuMvt(){
	let dot3Menu =
		 "<button type='button' class='btn btn-sm dropdown-toggle' id='btn_user3dotmenu' data-bs-toggle='dropdown' aria-expanded='false'></button>"
						    		
		+"<ul class='dropdown-menu' aria-labelledby='btn_user3dotmenu'>"
		    +"<li><a class='dropdown-item' onclick='showMoveItems(this)'> View moved items </a></li>"
		+"</ul>";

	return dot3Menu;
}

function showMoveItems(ctl){
	let row = $(ctl).parents('tr');
	mvtRep_indexToManipulate= row.attr('data-ref2');

	let mvt = gbl_mvtRepList[mvtRep_indexToManipulate];

	// readMovedItems(mvt.mvt_id, mvt.mvt_timestamp, mvt.full_name, mvtTypes[mvt.mvt_type]);
	readMovedItems(mvt);
}

/// For moved items
function renderMovedItemsTable(items){
	// console.log(items);
	let tBody = $('#table_items_moved tbody');
	let len = items.length;

	$('#table_items_moved tbody tr ').remove();

	for(i=0; i<len; i++){
		// console.log(mvt);
		let item = items[i];
		let row = buildMovedItemsTableRow(i, item);
		tBody.append(row);
	}
}

function buildMovedItemsTableRow(index, item){
	let row = 
	// "<tr class='tr-text' data-ref="+mvt.mvt_id+" data-ref2="+index+"> "
	"<tr class='tr-text'> "
	+"<td>"+ item.item_qty +"</td>"
	+"<td>"+ item.barcode +"</td>"
	+"<td>"+ item.description +"</td>"
	+"</tr>";

	return row;
}
// --- Table functions END -------

// Future feature (Show report on change interval)
// $('#slct_filter_report_time').on('change', function(){
// 	// Not click
// 	// Change works
// 	let date = $('#txt_filter_report_time').val();
// 	// console.log('State change: '+date);

// 	console.log(date.substring(0, 7));

// 	// readMvts(date);
// });

// Future feature (Show report on change time)
// $('#txt_filter_report_time').on('change', function(){
// 	// Not click
// 	// Change works
// 	let date = $('#txt_filter_report_time').val();
// 	// console.log('State change: '+date);

// 	console.log(date);

// 	// readMvts(date);
// });

$('#btn_report_search').on('click', function(){
	// Not click
	// Change works
	let date = $('#txt_filter_report_time').val();
	let intervalStr = $('#slct_filter_report_time').val();
	// console.log('State change: '+date);

	// if(intervalStr=='Daily') // Do no alteration
	// 	date = date.substring(0, 7);
	
	if(intervalStr=='Monthly')
		date = date.substring(0, 7);
	else if(intervalStr=='Yearly')
		date = date.substring(0, 4);

	readMvts(date);
});

$('#btn_close_moved_items').on('click', function(){
	$('#modal_moved_items').hide();
});

