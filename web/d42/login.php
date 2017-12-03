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
	    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	    <meta name="viewport" content="width=device-width, initial-scale=1">
	    <title>Login</title>
	    <link rel="stylesheet" text="text/css" href="/libs/bootstrap/3.3.5/bootstrap.min.css"/>
	    <link rel="stylesheet" text="text/css" href="/libs/bootstrap/3.3.5/bootstrap-theme.min.css"/>
	    <link rel="stylesheet" text="text/css" href="/css/mystyles.css" />
	    <link rel="stylesheet" text="text/css" href="/css/lobby.css" />
		<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
		<script type="text/javascript" src="/libs/bootstrap/3.3.5/bootstrap.min.js"></script>
		<script type="text/javascript" src="/js/lobby.js"></script>
		<script type="text/javascript" src="/js/mtg.js"></script>
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
						<form action="/d42/" method="post">
						<div class="panel-body">
								<label for="username">Username: </label><input type="text" name="username" class="form-control"><br>
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