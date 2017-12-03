<?php
	session_start();
	if (!empty($_SERVER['HTTPS']) && ('on' == $_SERVER['HTTPS'])) {
		$uri = 'https://';
	} else {
		$uri = 'http://';
	}
	$uri .= $_SERVER['HTTP_HOST'];
	
	if (isset($_SESSION["username"])) {
		$uri .= '/d42/lobby.php';
	} else if (isset($_POST["username"])) {
		$_SESSION["username"] = $_POST["username"];
		$uri .= '/d42/lobby.php';
	} else {
		$uri .= '/d42/login.php';
	}
	header('Location: '.$uri);
	exit;
?>
Something is wrong with the XAMPP installation :-(
