<!--<form action="shared/sign_out.php" method="post" style="float:right;">-->
<!--	<span style="margin-right: 5px;">Welcome, <?php echo $_SESSION["username"]; ?></span>-->
<!--	<input type="submit" value="Sign Out" class="btn btn-default">-->
<!--</form>-->
<ul class="nav navbar-nav navbar-right">
	<li class="dropdown">
	  <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><?php echo $_SESSION["username"]; ?> <span class="caret"></span></a>
	  <ul class="dropdown-menu">
	    <li><a href="#">Action</a></li>
	    <li><a href="#">Another action</a></li>
	    <li><a href="#">Something else here</a></li>
	    <li role="separator" class="divider"></li>
	    <li><a href="shared/sign_out.php">Sign Out</a></li>
	  </ul>
	</li>
</ul>