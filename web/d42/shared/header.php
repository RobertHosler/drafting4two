<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
</head>
<body>


<div style="background: white; display: none;">
	<div class="container" style="height: 70px;">
		<h1 class="pagetitle" style=""
			>drafting<span style="color: #4e79f7; padding: 0px 2px;">4</span>two</h1>
		<img src="/images/tgttm_roqb.jpg" class="flipped" style="height: 100%;padding: 5px 0px;float:left;margin-right: 10px;"></img>
		<img src="/images/tgttm_roqb.jpg" style="height: 100%;padding: 5px 0px;float:left;/* margin-left: 10px; *//* margin-right: 10px; */"></img>
	</div>
</div>

<nav class="navbar navbar-default">
  <div class="container">
    <!-- Brand and toggle get grouped for better mobile display -->
    <div class="navbar-header">
      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand brandtitle" href="/">
          <span style="float:left;">drafting<span style="color: #4e79f7; padding: 0px 2px;">4</span>two</span>
          <img src="/images/tgttm_roqb.jpg" class="flipped" style="height: 50px;padding: 5px 0px;float:left;margin-right: 5px;margin-top: -17px;margin-left: 5px;"></img>
          <img src="/images/tgttm_roqb.jpg" style="height: 50px;padding: 5px 0px;float:left;/* margin-left: 5px; *//* margin-right: 10px; */ margin-top: -17px;"></img>
      </a>
    </div>

    <!-- Collect the nav links, forms, and other content for toggling -->
    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
      <ul class="nav navbar-nav">
        <li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Manage Cubes <span class="caret"></span></a>
          <ul class="dropdown-menu">
            <li><a href="/d42/addcube.php">Add Cube</a></li>
            <li><a href="/d42/viewcube.php">View Cubes</a></li>
          </ul>
        </li>
        <li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Manage Draft <span class="caret"></span></a>
          <ul class="dropdown-menu">
            <li><a href="javascript:void(0)" onclick="if (confirm('Are you sure you want to restart the draft?')) { draft.restartDraft(); }">Restart Draft</a></li>
            <li><a href="#" onclick="draft.updateDraft();">Refresh Draft</a></li>
          </ul>
        </li>
      </ul>
		<?php 
    		if (isset($_SESSION["username"])) {
    		    include 'shared/user_actions.php';
    	    }
	    ?>
    </div><!-- /.navbar-collapse -->
  </div><!-- /.container-fluid -->
</nav>

</body>
</html>