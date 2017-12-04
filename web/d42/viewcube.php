<?php include 'shared/start_authenticated_session.php';?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <title>View Cube</title>
	<?php include 'shared/html_head.php';?>
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
						populateInitialSortedList();
					});
				</script>
				
			</div>
		</div>
	</div>
	
	<?php include 'shared/footer.php';?>
</body>

</html>