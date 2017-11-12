<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>

    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    
    <title>Lobby</title>
    
    <link rel="stylesheet" text="text/css" href="/libs/skeleton/2.0.4/normalize.css" />
    <link rel="stylesheet" text="text/css" href="/libs/skeleton/2.0.4/skeleton.css" />
    <link rel="stylesheet" text="text/css" href="/css/mystyles.css" />
    <link rel="stylesheet" text="text/css" href="/css/lobby.css" />
	<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
	<script type="text/javascript" src="/js/lobby.js"></script>

		
</head>

<!-- onload sets to update the chat every second -->
<body onload="listDrafts();">

	<div class="container">
		
		<div class="row">

			<div id="page-wrap" class="six columns">
			
				<h2>Join Draft</h2>
				
				<div></div>
								
				<form id="createDraftForm" name="createDraftForm" action="winston.php" target="_blank">
					<label for="playerName">Player Name: </label>
					<input id="playerName" type="text" name="playerName" required class="draftButton"></input>
					<label for="draftName">Draft Name: </label>
					<input type="text" name="draftName" required class="draftButton"></input>
					<label for="draftType">Draft Type: </label>
					<select name="draftType" class="draftButton">
						<option value="winston">Winston</option>
						<option value="grid">Grid</option>
						<option value="winchester">Winchester</option>
					</select>
					<label for="cubeName">Cube Name: </label>
					<select name="cubeName" class="draftButton">
						<option value="360">Roqb 360</option>
						<option value="roqb_pauper">Roqb Pauper</option>
						<option value="klug">Klug</option>
						<option value="kranny">Kranny</option>
						<option value="Usman">Usman</option>
						<option value="pauper">Pauper</option>
						<option value="usman_pauper">Usman Pauper</option>
						<option value="mini">Mini (for testing)</option>
					</select>
					<div class="row">
						<input type="submit" value="Submit" onclick="clearCreateForm()" class="draftButton eight columns"></input>
						<input type="reset" value="Reset" class="draftButton four columns"></input>
					</div>
				</form>
			
			</div>
			<div class="six columns">
				<h2>View Drafts</h2>
				<div class="row">
					<button class="draftButton six columns" onclick="showOpenDrafts();">Show Open Drafts</button>
					<button class="draftButton six columns" onclick="showAllDrafts();">Show All Drafts</button>
				</div>
				<div id="draftList" class="draftList">
				
				</div>
			</div>
		</div>
	</div>
</body>

</html>