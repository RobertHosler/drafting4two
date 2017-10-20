<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>

    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    
    <title>Chat</title>
    
    <link rel="stylesheet" text="text/css" href="Skeleton-2.0.4/css/normalize.css" />
    <link rel="stylesheet" text="text/css" href="Skeleton-2.0.4/css/skeleton.css" />
    <link rel="stylesheet" text="text/css" href="mystyles.css" />
    
    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
	
    <script type="text/javascript" src="chat.js"></script>
	
	<script type="text/javascript" src="page_processing.js"></script>

</head>

<!-- onload sets to update the chat every second -->
<body onload="setInterval('chat.update()', 1000)">

	<div class="container">
		
		<div class="row">

			<div id="page-wrap" class="four columns">
			
				<h2>Grid Drafting</h2>
				
				<p id="name-area"></p>
				
				<div id="chat-wrap"><div id="chat-area"></div></div>
				
				<form id="send-message-area">
					<p>Your message: </p>
					<textarea id="sendie" maxlength = '100' ></textarea>
				</form>
			
			</div>
		</div>
	</div>
</body>

</html>