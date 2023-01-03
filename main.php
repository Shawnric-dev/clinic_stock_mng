<!DOCTYPE html>
<html>
<head>
	<title> Clinic Inventory Management </title>

	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	
	<link href="Assets/bootstrap-5.0.0/css/bootstrap.min.css" type="text/css" rel="stylesheet">

	<link href="Assets/custom/front-end/dashboard/dashboard.css" type="text/css" rel="stylesheet">

	<link href="Assets/custom/front-end/css/style.css" rel="stylesheet" type="text/css">

	<!-- <style>
		.overlay{
			display: none;
			position: fixed;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
			z-index: 999;
			background: rgba(255,255,255,0.8) url("Spinner-3.gif") center no-repeat;
		}

		body.loading{
			overflow: hidden;
		}

		body.loading .overlay{
			display: block;
		}
	</style> -->

</head>
<body>
	<?php
		// Const data
		$appName = 'Clinic IM 0.1';
		$userName='';

		if($_SERVER['REQUEST_METHOD']=='POST'){
			if(isset($_POST['user_name'])){
				$userName = $_POST['user_name'];
				// Load init data
				// Operators can see reports/ Invenotru and users 
			} else echo "Invalid USER";	
		} else echo "Invalid request";

		// Configs
		// Tab names
		$tab1 = 'Reports';
		$tab2 = 'Inventory';
		$tab3 = 'Clients';
		$tab4 = 'Users';
		$tab5 = 'Settings';
		$tab6 = 'Movements';

		$lbl_search = 'Search';
	?>


	<header class="navbar navbar-dark sticky-top bg_primary flex-md-nowrap p-0 shadow">
  
  		<a class="navbar-brand col-md-3 col-lg-2 me-0 px-3 bg_primary" href="#"> <?=$appName?> </a>
  		<button class="navbar-toggler position-absolute d-md-none collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
    		<span class="navbar-toggler-icon"></span>
  		</button>
  		
  		<input id="input_search" class="form-control form-control-dark w-100 admin_search_bar" type="text" placeholder="<?=$lbl_search?>" aria-label="Search">
  
		<ul class="navbar-nav px-3 bg_primary">
		    <li class="nav-item text-nowrap">
		     	<a class="nav-link lbl_user_name"> <?=$userName?> </a>
		    </li>
		</ul>
	</header>


	<div class="container-fluid">
		<div class="row">
			<nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
				
				<div class="postion-sticky pt-3">
					<ul class="nav flex-column">

						<li class="nav-item">
							<a id="a_link_reports" class="nav-link active" aria-current="page" onclick="openTab('tab_reports', this)"> 
								<span data-feather="bar-chart-2"></span> <?=$tab1?> 
							</a>
						</li>
						<li class="nav-item">
							<a id="nav_link_mvt" class="nav-link" onclick="openTab('tab_mvt', this)"> 
								<span data-feather="shopping-cart"></span> <?=$tab6?> 
							</a>
						</li>
						<li id="nav_link_stockCRUD" class="nav-item">
							<a class="nav-link" onclick="openTab('tab_content', this)"> 
								<span data-feather="shopping-cart"></span> <?=$tab2?> 
							</a>
						</li>
						<li class="nav-item">
							<a class="nav-link" onclick="openTab('tab_client', this)"> 
								<span data-feather="users"></span> <?=$tab3?>
							</a>
						</li>
						<li id='nav_link_userCRUD' class="nav-item">
							<a class="nav-link" onclick="openTab('tab_user', this)"> 
								<span data-feather="users"></span> <?=$tab4?>
							</a>
						</li>
						<li class="nav-item">
							<a class="nav-link" onclick="openTab('tab_settings', this)">
								<span data-feather="layers"></span> <?=$tab5?> 
							</a>
						</li>

					</ul>
				</div>
			</nav>

			<main id="tab_reports" class="myTab col-md-9 ms-sm-auto col-lg-10 px-md-4">
				<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb3 border-bottom">

					<h1 class="h2"> <?=$tab1?> </h1>
					<div class="btn-toolbar mb-2 mb-md-0">

						<div class="btn-group">
						<!-- <div class="col-sm-1"> -->
							<button id="btn_report_search" class="btn btn-sm btn-outline-success"><img src="Assets/custom/front-end/resouces/imgs/search.png"></button>
						<!-- </div> -->

						<!-- <div class="col-sm-5 mrg-reduction-10"> -->
							<select id="slct_filter_report_time" class="form-select btn btn-sm btn-outline-success">
								<option>Daily</option>
								<option>Monthly</option>
								<option>Yearly</option>
							</select>
						<!-- </div> -->

						<!-- <div class="col-sm-6"> -->
							<div class="time_container btn btn-sm btn-outline-success">
								<input id="txt_filter_report_time" type="date" class="form-control btn-outline-success" data-bs-toggle="tooltip" title="Month/Day/Year">
							</div>
						</div>
					</div>
				</div>

				<!-- <h2>List de presença</h2> -->
				<div class="table-responsive">
					<table id="table_reports" class="table table-striped table-sm">
						<thead>
							<tr>
								<th>#</th>
								<th>Time stamp</th>
								<th>Operator</th>
								<th>Movement</th>
								<th></th>
							</tr>
						</thead>
						<tbody></tbody>
					</table>
				</div>
			</main>

			<main id="tab_mvt" class="myTab col-md-9 ms-sm-auto col-lg-10 px-md-4">
				<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb3 border-bottom">

					<h1 class="h2"> <?=$tab6?> </h1>
					<div class="btn-toolbar mb-2 mb-md-0">

					</div>
				</div>

				<!-- <h2>List de presença</h2> -->
				<div class="table-responsive">
					<table id="table_items_mvt" class="table table-striped table-sm">
						<thead>
							<tr>
								<th>Barcode</th>
								<th>Description</th>
								<th>Category</th>
								<th>QTY</th>
								<th>.</th>
							</tr>
						</thead>
						<tbody> </tbody>
					</table>
				</div>

				<div id="btn_view_cart" class='btn-group btn btn-success floating-action-btn'>
					<p class="floating-action-text" >Cart</p> 
					<img class="floating-action-img" src="Assets/custom/front-end/resouces/imgs/dlvry_stk.png">
				</div>
				<p id='lbl_items_in_cart' class='floating-action-lbl'>0</p>

			</main>

			<main id="tab_content" class="myTab col-md-9 ms-sm-auto col-lg-10 px-md-4">
				<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb3 border-bottom">

					<h1 class="h2"> <?=$tab2?> </h1>
					<div class="btn-toolbar mb-2 mb-md-0">

						<button id='btn_show_item_modal' type="button" class="btn btn-sm btn-outline-success">
							Add item
						</button>
					</div>
				</div>

				<div class="table-responsive">
					<table id="table_items" class="table table-striped table-sm">
						<thead>
							<tr>
								<th>Barcode</th>
								<th>Description</th>
								<th>Category</th>
								<th>QTY</th>
								<th>.</th>
							</tr>
						</thead>
						<tbody> </tbody>
					</table>
				</div>
			</main>

			<main id="tab_client" class="myTab col-md-9 ms-sm-auto col-lg-10 px-md-4">
				<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb3 border-bottom">

					<h1 class="h2"> <?=$tab3?> </h1>
					<div class="btn-toolbar mb-2 mb-md-0">
						<button id="btn_show_client_modal" type="button" class="btn btn-sm btn-outline-success"> Add client </button>
					</div>
				</div>

				<!-- <h2>List de presença</h2> -->
				<div class="table-responsive">
					<table id="table_client" class="table table-striped table-sm">
						<thead>
							<tr>
								<th>Name</th>
								<th>Contact</th>
								<th>Email</th>
								<th>City</th>
								<th>Address</th>
								<th>.</th>
							</tr>
						</thead>
						<tbody>
							
						</tbody>
					</table>
				</div>
			</main>

			<main id="tab_user" class="myTab col-md-9 ms-sm-auto col-lg-10 px-md-4">
				<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb3 border-bottom">

					<h1 class="h2"> <?=$tab4?> </h1>
					<div class="btn-toolbar mb-4 mb-md-0 row">

						<div class="col-sm-5">
							<button id="btn_show_user_modal" type="button" class="btn btn-sm btn-outline-success mr-8" > Register </button>	
						</div>

						<div class="col-sm-7">
							<select id="slct_filter_user_type" class="form-select btn btn-sm btn-outline-success">
								<option>Active</option>
								<option>Disabled</option>
								<option>In line</option>
							</select>
						</div>
						
					</div>
				</div>

				<!-- <h2>List de presença</h2> -->
				<div class="table-responsive">
					<table id="table_user" class="table table-striped table-sm">
						<thead>
							<tr>
								<th>Username</th>
								<th>Full name</th>
								<th>Contact</th>
								<th>Category</th>
								<th>.</th>
							</tr>
						</thead>
						<tbody></tbody>
					</table>
				</div>
			</main>

			<main id="tab_settings" class="myTab col-md-9 ms-sm-auto col-lg-10 px-md-4">
				<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb3 border-bottom">

					<h1 class="h2"> <?=$tab5?> </h1>
				</div>

				<div class="panel_settings">

					<div class="row form-row">
						<div class="col-sm-4">
							<label for="txt_set_user_pass">Username:</label>	
						</div>
						<div class="col-sm-8">
							<!-- <input id="txt_set_user_pass" type="text" class="form-control disable"> -->
							<label id="txt_set_user_pass"> <?=$userName?> </label>
						</div>
					</div>

					<div class="row form-row">
						<div class="col-sm-4">
							<label for="txt_set_cur_pass">Current password:</label>	
						</div>
						<div class="col-sm-8">
							<input id="txt_set_cur_pass" type="password" class="form-control">
						</div>
					</div>

					<div class="row form-row">
						<div class="col-sm-4">
							<label for="txt_set_new_pass">New password:</label>	
						</div>
						<div class="col-sm-8">
							<input id="txt_set_new_pass" type="text" class="form-control">
						</div>
					</div>

					<div class="row form-row">
						<div class="col-sm-4">
							<label for="txt_set_conf_pass">Confirm password:</label>	
						</div>
						<div class="col-sm-8">
							<input id="txt_set_conf_pass" type="text" class="form-control">
						</div>
					</div>

					<br>
					<br>

					<div class="modal-footer">
						<button id="btn_set_save" class="btn btn-success" type="button">Save changes</button>
					</div>
				
				</div>
			</main>

		</div>
	</div>

	<!---- Modals BEGIN ------>

	<!---- Items to move add/update modal BEGIN ---->
	<div class="modal" id="modal_mvt" tabindex="-1">
		<div class="modal-dialog">
			<div class="modal-content">
				
				<div class="modal-header">
					<h5 class="modal-title">Items to move</h5>

					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar" onclick="$('#modal_mvt').hide(); cartModalIsVisible=false;"></button>
				</div>

				<div class="modal-body">
					<!-- <div> -->
					<div id="row_section_mvt_type_select" class="row form-row">
						<div class="col-sm-6 text-end">
							<label for="selector_operator_type">Movement type:</label>	
						</div>
						<div class="col-sm-6">
							<select id="selector_operator_type" class="form-select">
								<option>Outward</option>
								<option>Inward</option>
								<option>Outward correction</option>
								<option>Inward correction</option>
							</select>
						</div>						
					</div>

					<br>

					<div class="table-responsive">
						<table id="table_items_to_move" class="table table-striped table-sm">
							<thead>
								<tr>
									<th>Barcode</th>
									<th>Description</th>
									<th>To move</th>
									<th>In stock</th>
									<th>.</th>
								</tr>
							</thead>
							<tbody> </tbody>
						</table>
					</div>
					<!-- </div> -->
				</div>

				<div class="modal-footer">
					<!-- <button id="" class="btn" type="button">Voltar</button> -->
					<button id="btn_cancel_mvt" class="btn" type="button">Cancel</button>

					<button id="btn_make_mvt" class="btn btn-success" type="button">Make movement</button>
				</div>

			</div>
		</div>
	</div>
	<!---- Items to move add/update modal END ------>


	<!---- Items moved modal START ------>
	<div class="modal" id="modal_moved_items" tabindex="-1">
		<div class="modal-dialog">
			<div class="modal-content">
				
				<div class="modal-header">
					<h5 class="modal-title">Items moved</h5>

					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="close" onclick="$('#modal_moved_items').hide();"></button>
				</div>

				<div class="modal-body">
					<!-- <div> -->
					<div class="row form-row">
						<div class="col-sm-4">
							<label for="txt_mvditems_type"> Movement type: </label>	
						</div>
						<div class="col-sm-8">
							<label id="txt_mvditems_type"> dsbdsino </label>
						</div>						
					</div>

					<div class="row form-row">
						<div class="col-sm-4">
							<label for="txt_mvditems_timestamp"> Timestamp: </label>	
						</div>
						<div class="col-sm-8">
							<label id="txt_mvditems_timestamp" data-bs-toggle="tooltip" title="Year-month-day hour:minute:second"> </label>
						</div>						
					</div>

					<div class="row form-row">
						<div class="col-sm-4">
							<label for="txt_mvditems_operator"> Operator: </label>	
						</div>
						<div class="col-sm-8">
							<label id="txt_mvditems_operator"> </label>
						</div>						
					</div>

					<br>

					<div class="table-responsive">
						<table id="table_items_moved" class="table table-striped table-sm">
							<thead>
								<tr>
									<th>Moved</th>
									<th>Barcode</th>
									<th>Description</th>
								</tr>
							</thead>
							<tbody> </tbody>
						</table>
					</div>
					<!-- </div> -->
				</div>

				<div class="modal-footer">
					<!-- <button id="" class="btn" type="button">Voltar</button> -->
					<button id="btn_close_moved_items" class="btn" type="button">Close</button>
				</div>

			</div>
		</div>
	</div>
	<!---- Items moved modal END ------>



	<!---- Stock item add/update modal BEGIN ---->
	<div class="modal" id="modal_item" tabindex="-1">
		<div class="modal-dialog">
			<div class="modal-content">
				
				<div class="modal-header">
					<h5 class="modal-title">Item data</h5>

					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar" onclick="$('#modal_item').hide(); clearTxtsItem();"></button>
				</div>

				<div class="modal-body">
					<form>
						<div class="row form-row">
							<div class="col-sm-3">
								<label for="txt_barcode"> Barcode: </label>		
							</div>
							<div class="col-sm-9">
								<input id="txt_barcode" type="text" class="form-control">
							</div>
						</div>

						<div class="row form-row">
							<div class="col-sm-3">
								<label for="txt_desc"> Description: </label>	
							</div>
							<div class="col-sm-9">
								<input id="txt_desc" type="text" class="form-control">
							</div>
						</div>

						<div class="row form-row">
							<div class="col-sm-3">
								<label for="txt_cat"> Category: </label>	
							</div>
							<div class="col-sm-9">
								<input id="txt_cat" type="text" class="form-control">
							</div>
						</div>

						<div class="row form-row">
							<div class="col-sm-3">
								<label for="txt_qty">Quantity:</label>	
							</div>
							<div class="col-sm-9">
								<input id="txt_qty" type="number" class="form-control">
							</div>
						</div>

						<input id="txt_item_id" class="d-none"> 
						
					</form>
				</div>

				<div class="modal-footer">
					<button id="btn_item_modal_clear" class="btn" type="button">Cancel</button>

					<button id="btn_item_modal_reg" class="btn btn-success" type="button">Register</button>
				</div>

			</div>
		</div>
	</div>
	<!---- Stock item add/update modal END ------>

	<!---- User add/update modal BEGIN ---->
	<div class="modal" id="modal_user" tabindex="-1">
		<div class="modal-dialog">
			<div class="modal-content">
				
				<div class="modal-header">
					<h5 class="modal-title">User</h5>

					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar" onclick="$('#modal_user').hide(); clearTxts();"></button>
				</div>

				<div class="modal-body">
					<form>
						<div class="row form-row">
							<div class="col-sm-4">
								<label for="txt_user_name">Username:</label>	
							</div>
							<div class="col-sm-8">
								<input id="txt_user_name" type="text" class="form-control">
							</div>
						</div>

						<div class="row form-row">
							<div class="col-sm-4">
								<label for="txt_user_pass">Password:</label>	
							</div>
							<div class="col-sm-8">
								<input id="txt_user_pass" type="password" class="form-control">
							</div>
						</div>

						<div class="row form-row">
							<div class="col-sm-4">
								<label for="txt_user_full_name">Full name:</label>	
							</div>
							<div class="col-sm-8">
								<input id="txt_user_full_name" type="text" class="form-control">
							</div>
						</div>

						<div class="row form-row">
							<div class="col-sm-4">
								<label for="txt_user_contact">Contact:</label>	
							</div>
							<div class="col-sm-8">
								<input id="txt_user_contact" type="text" class="form-control">
							</div>
						</div>

						<div class="row form-row">
							<div class="col-sm-4">
								<label for="slct_user_type">Category:</label>	
							</div>
							<div class="col-sm-8">
								<select id="slct_user_type" class="form-select">
									<option>Operator</option>
									<option>Administrator</option>
								</select>
							</div>
						</div>

						<input id="txt_user_id" class="d-none"> 
						
					</form>
				</div>

				<div class="modal-footer">
					<button id="btn_user_clear" class="btn" type="button">Cancel</button>

					<button id="btn_user_reg" class="btn btn-success" type="button">Register</button>
				</div>

			</div>
		</div>
	</div>
	<!---- User add/update modal END ------>

	<!---- Client add/update modal BEGIN ---->
	<div class="modal" id="modal_client" tabindex="-1">
		<div class="modal-dialog">
			<div class="modal-content">
				
				<div class="modal-header">
					<h5 class="modal-title">Client data</h5>

					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar" onclick="$('#modal_client').hide(); clearTxtsClient();"></button>
				</div>

				<div class="modal-body">
					<form>
						<div class="row form-row">
							<div class="col-sm-3">
								<label for="txt_client_name"> Name: </label>	
							</div>
							<div class="col-sm-9">
								<input id="txt_client_name" type="text" class="form-control">
							</div>
						</div>

						<div class="row form-row">
							<div class="col-sm-3">
								<label for="txt_client_contact"> Contact: </label>	
							</div>
							<div class="col-sm-9">
								<input id="txt_client_contact" type="number" class="form-control">
							</div>
						</div>

						<div class="row form-row">
							<div class="col-sm-3">
								<label for="txt_client_email"> Email: </label>	
							</div>
							<div class="col-sm-9">
								<input id="txt_client_email" type="email" class="form-control">
							</div>
						</div>

						<div class="row form-row">
							<div class="col-sm-3">
								<label for="txt_client_city">City:</label>	
							</div>
							<div class="col-sm-9">
								<input id="txt_client_city" type="text" class="form-control">
							</div>
						</div>

						<div class="row form-row">
							<div class="col-sm-3">
								<label for="txt_client_addr"> Address:</label>	
							</div>
							<div class="col-sm-9">
								<input id="txt_client_addr" type="text" class="form-control">
							</div>
						</div>

						<input id="txt_client_id" class="d-none"> 
						
					</form>
				</div>

				<div class="modal-footer">
					<button id="btn_client_modal_clear" class="btn" type="button">Cancel</button>

					<button id="btn_client_modal_reg" class="btn btn-success" type="button">Register</button>
				</div>

			</div>
		</div>
	</div>
	<!---- Client add/update modal END ------>


	<!---- User alterer state/ delete modal (Might  be a generic function) BEGIN ---->
	<div class="modal" id="confirm_modal" tabindex="-1">
		<div class="modal-dialog">
			<div class="modal-content">

				<div class="modal-header">
					<h5 class="modal-title"></h5>
					<button type="button" class="btn-close" data-bs-dismiss='modal' aria-label='close' onclick="$('#confirm_modal').hide()"></button>
				</div>

				<div class="modal-body">
					<p id="lbl_confirm_msg">The confirmation message</p>
				</div>

				<div class="modal-footer">
          			<button type='button' class='btn' data-bs-dismiss="modal" onclick="$('#confirm_modal').hide()">No</button>

          			<button id='btn_modal_confirm' type='button' class='btn btn-success'>Yes</button>
				</div>
				
				<input id="confirm_modal_id_holder" class="d-none">
				<input id="confirm_modal_index_holder" class="d-none">

			</div>
		</div>
	</div>


	<!---- User alterer state/ delete modal (Might  be a generic function) END ---->

	<!---- Modals END ------->

	<div class="loader-wrapper">
		<span class="loader"></span>
		<span class="loader-inner"></span>
	</div>

	<script src="Assets/bootstrap-5.0.0/js/bootstrap.bundle.min.js"></script>
	<script src="Assets/bootstrap-5.0.0/js/jquery-2.1.1.min.js"></script>
	<script src="Assets/custom/front-end/dashboard/dashboard.js"></script>

	<div class="overlay"> </div>



	<!-- Custom JS -->
	<script src="Assets/custom/front-end/js/main.js"></script>
	<script src="Assets/custom/front-end/js/mvt_report.js"></script>
	<script src="Assets/custom/front-end/js/movements.js"></script>
	<script src="Assets/custom/front-end/js/user.js"></script>
	<script src="Assets/custom/front-end/js/client.js"></script>
	<script src="Assets/custom/front-end/js/stock.js"></script>
	<script src="Assets/custom/front-end/js/password.js"></script>


	<!-- Custom JS -->

</body>
</html>