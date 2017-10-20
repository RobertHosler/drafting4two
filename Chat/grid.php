<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<link rel="stylesheet" text="text/css" href="Skeleton-2.0.4/css/normalize.css" />
		<link rel="stylesheet" text="text/css" href="Skeleton-2.0.4/css/skeleton.css" />
		<link rel="stylesheet" text="text/css" href="mystyles.css" />
		
		<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
		<script type="text/javascript" src="chat.js"></script>
		<script type="text/javascript" src="page_processing.js"></script>
		
	</head>
	
	<body>
		<div class="container">
		
			<div class="row">
		
				<div class="nine columns">
					
					<!-- <div class="row">
						<img class="header" src="http://www.cubetutor.com/assets/1.28-SNAPSHOT/app/components/css/images/header_bg_4.jpg"/>
					</div> -->

					<div id="topButtons"class="row">
						<div class="three columns">Grid</div>
						<div class="three columns">
							<button class="draftButton">Col One</button>
						</div>
						<div class="three columns">
							<button class="draftButton">Col Two</button>
						</div>
						<div class="three columns">
							<button class="draftButton">Col Three</button>
						</div>
					</div>
					<div id="rowOne" class="row">
						<div class="three columns">
							<button class="draftButton">Row One</button>
						</div>
						<div class="three columns">
							<img class="magicCard" src="http://upload.wikimedia.org/wikipedia/en/a/aa/Magic_the_gathering-card_back.jpg"/></div>
						<div class="three columns">
							<img class="magicCard" src="http://upload.wikimedia.org/wikipedia/en/a/aa/Magic_the_gathering-card_back.jpg"/></div>
						<div class="three columns">
							<img class="magicCard" src="http://upload.wikimedia.org/wikipedia/en/a/aa/Magic_the_gathering-card_back.jpg"/></div>
						</div>
					<div id="rowTwo" class="row">
						<div class="three columns">
							<button class="draftButton">Row Two</button>
						</div>
						<div class="three columns">
							<img class="magicCard" src="http://upload.wikimedia.org/wikipedia/en/a/aa/Magic_the_gathering-card_back.jpg"/></div>
						<div class="three columns">
							<img class="magicCard" src="http://upload.wikimedia.org/wikipedia/en/a/aa/Magic_the_gathering-card_back.jpg"/></div>
						<div class="three columns">
							<img class="magicCard" src="http://upload.wikimedia.org/wikipedia/en/a/aa/Magic_the_gathering-card_back.jpg"/></div>
					</div>
					<div id="rowThree" class="row">
						<div class="three columns">
							<button class="draftButton">Row Three</button>
						</div>
						<div class="three columns">
							<img class="magicCard" src="http://upload.wikimedia.org/wikipedia/en/a/aa/Magic_the_gathering-card_back.jpg"/></div>
						<div class="three columns">
							<img class="magicCard" src="http://upload.wikimedia.org/wikipedia/en/a/aa/Magic_the_gathering-card_back.jpg"/></div>
						<div class="three columns">
							<img class="magicCard" src="http://upload.wikimedia.org/wikipedia/en/a/aa/Magic_the_gathering-card_back.jpg"/></div>
					</div>
			
					<div class="row">
						<div class="twelve columns">
							Deck:
						</div>
					</div>
					
					<div id="rowThree" class="row">
						<div class="twelve columns deck" style="overflow:auto;">
							<img class="magicCard" src="http://upload.wikimedia.org/wikipedia/en/a/aa/Magic_the_gathering-card_back.jpg"/>
							<img class="magicCard" src="http://upload.wikimedia.org/wikipedia/en/a/aa/Magic_the_gathering-card_back.jpg"/>
							<img class="magicCard" src="http://upload.wikimedia.org/wikipedia/en/a/aa/Magic_the_gathering-card_back.jpg"/>
							<img class="magicCard" src="http://upload.wikimedia.org/wikipedia/en/a/aa/Magic_the_gathering-card_back.jpg"/>
							<img class="magicCard" src="http://upload.wikimedia.org/wikipedia/en/a/aa/Magic_the_gathering-card_back.jpg"/>
							<img class="magicCard" src="http://upload.wikimedia.org/wikipedia/en/a/aa/Magic_the_gathering-card_back.jpg"/>
							<img class="magicCard" src="http://upload.wikimedia.org/wikipedia/en/a/aa/Magic_the_gathering-card_back.jpg"/>
							<img class="magicCard" src="http://upload.wikimedia.org/wikipedia/en/a/aa/Magic_the_gathering-card_back.jpg"/>
							<img class="magicCard" src="http://upload.wikimedia.org/wikipedia/en/a/aa/Magic_the_gathering-card_back.jpg"/>
							<img class="magicCard" src="http://upload.wikimedia.org/wikipedia/en/a/aa/Magic_the_gathering-card_back.jpg"/>
							<img class="magicCard" src="http://upload.wikimedia.org/wikipedia/en/a/aa/Magic_the_gathering-card_back.jpg"/>
						</div>				
					</div>
					
				</div>

				<div class="three columns">
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
