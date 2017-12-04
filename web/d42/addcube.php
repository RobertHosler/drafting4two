<?php include 'shared/start_authenticated_session.php';?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <title>Add Cube</title>
	<?php include 'shared/html_head.php';?>
</head>

<body>
	
	<?php include 'shared/header.php';?>

	<div class="container">
		
		<div class="row">

			<div id="page-wrap" class="col-xs-6">
			
				<form id="createDraftForm" name="createDraftForm" action="javascript:addCubeList();" target="_blank">
				<div class="panel panel-default">
					<div class="panel-heading">
						<h3>Add Cube List</h3>
					</div>
					<div class="panel-body">
						
						<label for="cubeName">Cube Name: </label>
						<input id="cubeName" type="text" name="cubeName" required class="draftButton form-control"></input>
						<label for="cubeName">Cube List: </label>
						<textarea id="cubeList" style="width: 100%; height: 200px;" class="form-control"></textarea>
						<div><em>Cube List should consist of a single card name on each line.</em></div>
					</div>
					<div class="panel-footer">
						<input type="submit" value="Submit" class="btn btn-primary"></input>
						<input type="reset" value="Reset" class="btn btn-default"></input>
					</div>
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