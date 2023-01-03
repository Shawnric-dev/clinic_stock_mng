// ----- CRUD API calls --------------------------------
function updateUserPass(id, newPass){
	startLoadingAnim();

	let formData = `id=${id}&&pass=${newPass}`;

	let url = 'Assets/custom/back-end/v1/user/updatePass.php';
	$.post(url, formData, function(data, status){
		stopLoadingAnim();

		let dataObj = JSON.parse(data);
		let flag = dataObj['flag'];

		if(flag==true){
			gbl_userPass = newPass;
			$('#confirm_modal').hide();

			$('#txt_set_cur_pass').val('');
			$('#txt_set_new_pass').val('');
			$('#txt_set_conf_pass').val('');

			// alert('Operação executado com sucesso');
		}
		else 
			alert('Opa, houve algum erro por favor tente de novo');
	});
}

// _____ CRUD API calls _________________________________

// --------------------------------------------------------
function showConfirmPassUpdateModal(msg, confirmOpr){
	gbl_confirmOperation = confirmOpr;
	$('#lbl_confirm_msg').text(msg);
	$('#confirm_modal').show();
}

// Modal confirm
$('#btn_modal_confirm').on('click', function(){
	let id = $('#confirm_modal_id_holder').val(); 

	if(gbl_confirmOperation=='update_user_pass'){
		let newPass = $('#txt_set_new_pass').val();
		updateUserPass(gbl_userID, newPass);
	}

	$('#confirm_modal').hide();
});
// _____ Table functions __________________________________


// ----- Handling button clicks ----------------------------
$('#btn_set_save').on('click', function(){

	let inputedCurPass = $('#txt_set_cur_pass').val();
	let newPass = $('#txt_set_new_pass').val();
	let confPass = $('#txt_set_conf_pass').val();

	if(gbl_userPass==inputedCurPass){
		if(newPass==confPass){
			showConfirmPassUpdateModal('Confirmar atualização de palavra passe','update_user_pass');
		}
		else alert('Opa, nova palavra passe diferente da palavra passe de confirmação');	
	}
	else alert('Opa, palavra passe errada');
});
// ____ Utility function ___________________________________