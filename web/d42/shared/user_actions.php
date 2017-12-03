<form action="shared/sign_out.php" method="post" style="float:right;">
	<span style="margin-right: 5px;">Welcome, <?php echo $_SESSION["username"]; ?></span>
	<input type="submit" value="Sign Out" class="btn btn-default">
</form>