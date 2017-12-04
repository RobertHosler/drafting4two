<?php
	session_start();
	if (isset($_SESSION["username"])) {
		if (!empty($_SERVER['HTTPS']) && ('on' == $_SERVER['HTTPS'])) {
			$uri = 'https://';
		} else {
			$uri = 'http://';
		}
		$uri .= $_SERVER['HTTP_HOST'];
		$uri .= '/winston/';
		header('Location: '.$uri);
	}
?>
<html>
	
	<head>
	    <title>Login</title>
		<?php include 'shared/html_head.php';?>
	</head>
	
	<body>
		
		<?php include 'shared/header.php';?>
		
		<div class="container">
			<br/>
			<div class="row">
				<div class="col-xs-12 col-md-6">
					<div class="panel panel-default">
						<!--<div class="panel-heading">-->
						<!--	Login to start drafting-->
						<!--</div>-->
						<div class="panel-heading">
							<h3>Login</h3>
						</div>
						<form action="/d42/" method="post">
						<div class="panel-body">
								<label for="username">Username </label><input type="text" name="username" class="form-control" required><br>
								<em>Provide a username to identify you while you draft.  Your account will not be saved at this time.</em>
		 						<!--<label for="password">Password </label><input type="password" name="password" class="form-control" required><br>-->
								<!--E-mail: <input type="text" name="email"><br>-->
						</div>
						<div class="panel-footer">
							<input type="submit" value="Login" class="btn btn-primary">
						</div>
						</form>
					</div>
				</div>
			</div>
		</div>
		
		<?php include 'shared/footer.php';?>
		
	</body>
</html>