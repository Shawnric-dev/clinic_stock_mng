// Use JS file for this
		$('#login_form').on('submit', function(e){
			startLoadingAnim();

			e.preventDefault();
			
			let user = $('#txt_user').val();
			let pass = $('#txt_pass').val();
			let formData = `user_name=${user}&&pass=${pass}`;

			
			let url = gbl_rootUrl+'/v1/user/login.php'; 
			$.post(url, formData, function(data, status){
				let dataObj = JSON.parse(data);
				
				// get id->get user typeS
				stopLoadingAnim();

				let resData = dataObj['data'];

				if(resData!=null){

					if(resData['state']==1){
						$("txt_full_name").val(resData['full_name']);
						$("txt_id").val(resData['id']);
						$("txt_type").val(resData['type']);
						$("txt_state").val(resData['state']);

						e.currentTarget.submit();
					}
					else alert('Conta disativada');
				}
				else alert('Opa, palavra passe errada');
			});		
		});

		// Create accout via ajax
		// $('#btn_register').click(function(){
		$('#btn_register').on('click',function(){
			let user_name = $('#txt_user_reg').val();
			let user_pass = $('#txt_pass_reg').val();
			let user_full_name = $('#txt_user_name').val();
			let type = 1;
			let state = 1;

			let formData = `user_name=${user_name}&&pass=${user_pass}&&full_name=${user_full_name}&&type=${type}&&state=${state}`;

			startLoadingAnim();
			
			let url = gbl_rootUrl+'/v1/user/create.php';
			$.post(url, formData, function(data, status){

				let dataObj = JSON.parse(data);
				let id = dataObj['id'];
				stopLoadingAnim();

				if(id>0){
					$('#txt_user_reg').val('');
					$('#txt_pass_reg').val('');
					$('#txt_user_name').val('');

					alert('Operacao executado com sucesso');
				}
			});
		});

		// Enabling navigation
		$("#btn_goto_register").click(function(){
			$('.login-form').hide();
			$('.registration-form').show();
			$('.logo-text').text('Registration form');
		});

		$("#btn_goto_login").click(function(){
			$('.login-form').show();
			$('.registration-form').hide();
			$('.logo-text').text('LOGIN');
			// Formulário de login
		});
