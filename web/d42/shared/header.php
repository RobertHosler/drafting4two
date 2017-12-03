<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
</head>
<body>

<div class="pageheader">
	<div class="container">
		<span class="">
			<a href="/">Home</a>
			|
			<a href="addcube.php">Add Cube</a>
			|
			<a href="viewcube.php">View Cube</a>
			|
			<a href="javascript:void(0)" onclick="if (confirm('Are you sure you want to restart the draft?')) { draft.restartDraft(); }">Restart Draft</a>
			|
			<a href="#" onclick="draft.updateDraft();">Refresh Draft</a>
		</span>
		<?php 
    		if (isset($_SESSION["username"])) {
    		    include 'shared/user_actions.php';
    	    }
	    ?>
	</div>
</div>

</body>

</html>