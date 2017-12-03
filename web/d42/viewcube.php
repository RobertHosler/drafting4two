<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>

    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    
    <title>Cube List</title>
    
    <link rel="stylesheet" text="text/css" href="/libs/bootstrap/3.3.5/bootstrap.min.css"/>
    <link rel="stylesheet" text="text/css" href="/libs/bootstrap/3.3.5/bootstrap-theme.min.css"/>
    <link rel="stylesheet" text="text/css" href="/css/mystyles.css" />
    <link rel="stylesheet" text="text/css" href="/css/lobby.css" />
	<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
	<script type="text/javascript" src="/libs/bootstrap/3.3.5/bootstrap.min.js"></script>
	<script type="text/javascript" src="/js/lobby.js"></script>
	<script type="text/javascript" src="/js/mtg.js"></script>

</head>

<body>
	
	<?php include 'shared/header.php';?>

	<div class="container">
		
		<div class="row">

			<div id="page-wrap" class="col-xs-12">
			
				<h2>View Cube List</h2>
				
				<div>
					<label for="cubeName">Cube Name: </label>
					<select id="cubeLists" name="cubeName" class="draftButton form-control" onchange="populateSortedList();">
					</select>
				</div>
				
				<br/>
				
				<div id="sortedCube" class="deck maindeck sideboard">Sorted cube list</div>
				
				<script type="text/javascript">
					$(function() {
						populateSortedList();
					});
				</script>
				
			</div>
		</div>
	</div>
	
	<?php include 'shared/footer.php';?>
</body>

</html>