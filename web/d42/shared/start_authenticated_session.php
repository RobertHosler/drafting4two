<?php
    //Starts a session and redirects to home if the user is not signed in.
    //This should be included on any pages that require an authenticated session.
	session_start();
	if (isset($_SESSION["username"])) {
		//do nothing
	} else if (isset($_POST["username"])) {
		$_SESSION["username"] = $_POST["username"];
	} else {
		if (!empty($_SERVER['HTTPS']) && ('on' == $_SERVER['HTTPS'])) {
			$uri = 'https://';
		} else {
			$uri = 'http://';
		}
		$uri .= $_SERVER['HTTP_HOST'];
		header('Location: '.$uri);
		exit;
	}
?>