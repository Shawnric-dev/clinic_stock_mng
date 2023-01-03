let activeTab = null;
let gbl_userID = 0;
let gbl_userPass = '';
let gbl_table_to_searchIn = 'table_company'; // Work on search feature
let gbl_userType = 0;


// Used across all JS -------------------
// let gbl_msg_success = "'Operation successful'";
// let gbl_msg_fail = "'Operation failed, please try again'";
// --------------------------------------

$(document).ready(function(){
	$(window).on('load', function(){
		$('.loader-wrapper').fadeOut();
	});

	getUserData($('.lbl_user_name').text().trim());

	$('.myTab').css('display', 'none');
	$('#tab_mvt').css('display', 'block');
});

// _____ NAV Functions ______

// Called on click
function openTab(tabID, elmt){
	$('.myTab').css('display', 'none');
	$('.nav-link').removeClass('active');
	$('#'+tabID).css('display', 'block');
	$(elmt).addClass('active');

	activeTab = tabID;		

	if(activeTab=='tab_reports'){
		gbl_table_to_searchIn = 'table_reports';
		readMvts('onInit');
	}
	else if(activeTab=='tab_mvt'){
		gbl_table_to_searchIn = 'table_items_mvt';
		readItemsMvt();
	}
	else if(activeTab=='tab_content'){
		gbl_table_to_searchIn = 'table_items';
		readItems();
	}
	else if(activeTab=='tab_client'){
		gbl_table_to_searchIn = 'table_client';
		readClients();
	}
	else if(activeTab=='tab_user'){
		gbl_table_to_searchIn = 'table_user';
		readUsers(-1);	
	}
	else if(activeTab=='tab_settings'){

	}
}


function getUserData(userName){
	let formData = `user_name=${userName}`;	
	let url = 'Assets/custom/back-end/v1/user/getUserData.php';

	$.post(url, formData, function(data, status){

		let dataObj = JSON.parse(data);
		let res = dataObj['data'];

		$('#txt_main_user_id').val(res.id);

		gbl_userID = res.id;
		gbl_userPass = res.pass;
		gbl_userType = res.type;

		if(gbl_userType==2) // If user is operator
			operatorInit();			
		
		else  // If user is admin
			adminInit();
	});	
}

function operatorInit(){
	$('#nav_link_userCRUD').css('display', 'none');
	$('#nav_link_stockCRUD').css('display', 'none');

	$('.myTab').css('display', 'none');
	$('#tab_mvt').css('display', 'block');

	$('.nav-link').removeClass('active');
	$('#nav_link_mvt').addClass('active');

	$('#row_section_mvt_type_select').css('display', 'none');
	
	gbl_table_to_searchIn = 'table_items_mvt';
	readItemsMvt();
}

function adminInit(){
	$('.myTab').css('display', 'none');
	$('#tab_reports').css('display', 'block');

	gbl_table_to_searchIn = 'table_reports';
	readMvts('onInit');
}


// --- For search bar start ---
$(function(){
	$('#input_search').on('keyup', function(){
		let val = $(this).val().toLowerCase();

		$("#"+gbl_table_to_searchIn+" > tbody > tr").filter(function(){
			$(this).toggle($(this).text().toLowerCase().indexOf(val)>-1)
		});	
	});
});
// --- For search bar end ---


// --- For loading gif start ---
function startLoadingAnim(){
	$('body').addClass('loading');
}

function stopLoadingAnim(){
	$('body').removeClass('loading');
}
// --- For loading gif end ---