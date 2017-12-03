<?php include 'shared/start_authenticated_session.php';?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>

    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    
    <title>Lobby</title>
    
    <link rel="stylesheet" text="text/css" href="/libs/bootstrap/3.3.5/bootstrap.min.css"/>
    <link rel="stylesheet" text="text/css" href="/libs/bootstrap/3.3.5/bootstrap-theme.min.css"/>
    <link rel="stylesheet" text="text/css" href="/css/mystyles.css" />
    <link rel="stylesheet" text="text/css" href="/css/lobby.css" />
	<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
	<script type="text/javascript" src="/libs/bootstrap/3.3.5/bootstrap.min.js"></script>
	<script type="text/javascript" src="/js/lobby.js"></script>
	<script type="text/javascript" src="/js/mtg.js"></script>

</head>

<!-- onload sets to update the chat every second -->
<body onload="listDrafts();">
		
	<?php include 'shared/header.php';?>
	
	<div class="container">
		
		<div class="row">

			<div class="col-xs-12 col-sm-6">
			
				<div class="row">
					<div class="col-xs-12">
						<h2>View Drafts</h2>
					</div>
				</div>
				
				<div class="row">
					<div class="col-xs-12">
						<span class="btn-group">
							<button class="btn btn-default" onclick="showOpenDrafts();">Show Open Drafts</button>
							<button class="btn btn-default" onclick="showAllDrafts();">Show All Drafts</button>
						</span>
						<span class="">
							<button class="btn btn-default" onclick="deleteAllDrafts();">Delete All Drafts</button>
						</span>
					</div>
				</div>
				<div class="row">
					<div class="col-xs-12">
						<div id="draftList" class="draftList">
							
						</div>
					</div>
				</div>
			</div>
			
			<div id="page-wrap" class="col-xs-12 col-sm-6">
			
				<form id="createDraftForm" name="createDraftForm" action="draft.php">
					<div class="panel panel-default">
						<div class="panel-heading">
							<h3>Create Draft</h3>
						</div>
						<div class="panel-body">
							<!--<label for="playerName">Player Name: </label>-->
							<!--<input id="playerName" type="text" name="playerName" required class="draftButton form-control"></input>-->
							<label for="draftName">Draft Name: </label>
							<input type="text" name="draftName" required class="draftButton form-control"></input>
							<label for="draftType">Draft Type: </label>
							<select id="draftType" onchange="setDraftDefaults(this);" name="draftType" class="draftButton form-control">
			                    <option value="winston">Winston 90</option>
			                    <option value="winston100">Winston 100</option>
			                    <option value="pancake">Pancake</option>
			                    <option value="burnfour">Burn Four</option>
			                    <option value="glimpse">Glimpse</option>
			                    <option value="grid">Grid</option>
			                    <option value="winchester">Winchester</option>
			                </select>
			                <p id="draftDescription"></p>
			                <script type="text/javascript">
			                	setDraftDefaults("#draftType");
			                </script>
							<label for="cubeName">Cube Name: </label>
							<select id="cubeLists" name="cubeName" class="draftButton form-control">
							</select>
						</div>
						<div class="panel-footer">
							<input type="submit" value="Submit" onclick="clearCreateForm()" class=" btn btn-primary"></input>
							<input type="reset" value="Reset" class=" btn btn-default"></input>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
	
	<?php include 'shared/footer.php';?>
</body>

</html>