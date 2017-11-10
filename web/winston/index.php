<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>

    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    
    <title>Chat</title>
    
    <link rel="stylesheet" text="text/css" href="css/Skeleton-2.0.4/css/normalize.css" />
    <link rel="stylesheet" text="text/css" href="css/Skeleton-2.0.4/css/skeleton.css" />
    <link rel="stylesheet" text="text/css" href="css/mystyles.css" />
    
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
	
	<script type="text/javascript" src="js/lobby.js"></script>

		
</head>

<!-- onload sets to update the chat every second -->
<body onload="listDrafts();">

	<div class="container">
		
		<div class="row">

			<div id="page-wrap" class="four columns">
			
				<h2>Join Draft</h2>
				
				<div></div>
								
				<form action="winston.php" target="_blank">
					<p>Player Name: </p>
					<input type="text" name="playerName" required></input>
					<p>Draft Name: </p>
					<input type="text" name="draftName" required></input>
					<p>Cube Name: </p>
					<select name="cubeName">
						<option value="360">Roqb 360</option>
						<option value="roqb_pauper">Roqb Pauper</option>
						<option value="klug">Klug</option>
						<option value="kranny">Kranny</option>
						<option value="Usman">Usman</option>
						<option value="pauper">Pauper</option>
						<option value="usman_pauper">Usman Pauper</option>
						<option value="mini">Mini (for testing)</option>
					</select>
					<div>
					<input type="submit" value="Submit"></input>
					</div>
				</form>
			
			</div>
			<div class="four columns">
				<div>
					<button class="draftButton" onclick="listDrafts();">Refresh Drafts</button>
				</div>
				<div id="draftList">
				
				</div>
			</div>
		</div>
	</div>
</body>

</html>