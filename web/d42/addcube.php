<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>

    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    
    <title>Cube List</title>
    
    <link rel="stylesheet" text="text/css" href="/libs/skeleton/2.0.4/normalize.css" />
    <link rel="stylesheet" text="text/css" href="/libs/skeleton/2.0.4/skeleton.css" />
    <link rel="stylesheet" text="text/css" href="/css/mystyles.css" />
    <link rel="stylesheet" text="text/css" href="/css/lobby.css" />
	<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
	<script type="text/javascript" src="/js/lobby.js"></script>
	<script type="text/javascript" src="/js/mtg.js"></script>

</head>

<body>
	
	<?php include 'shared/header.php';?>

	<div class="container">
		
		<div class="row">

			<div id="page-wrap" class="six columns">
			
				<h2>Add Cube List</h2>
				
				<form id="createDraftForm" name="createDraftForm" action="javascript:addCubeList();" target="_blank">
					<label for="cubeName">Cube Name: </label>
					<input id="cubeName" type="text" name="cubeName" required class="draftButton"></input>
					<label for="cubeName">Cube List: </label>
					<div><em>Cube List should consist of a single card name on each line.</em></div>
					<textarea id="cubeList" style="width: 100%; height: 200px;"></textarea>
					<div class="row">
						<input type="submit" value="Submit" class="draftButton eight columns"></input>
						<input type="reset" value="Reset" class="draftButton four columns"></input>
					</div>
				</form>
			
			</div>
			<div class="six columns">
				<div class="row">
				</div>
			</div>
		</div>
	</div>
	
	<?php include 'shared/footer.php';?>
</body>

</html>