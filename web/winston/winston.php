<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<link rel="stylesheet" text="text/css" href="css/Skeleton-2.0.4/css/normalize.css" />
		<link rel="stylesheet" text="text/css" href="css/Skeleton-2.0.4/css/skeleton.css" />
		<link rel="stylesheet" text="text/css" href="css/mystyles.css" />
		<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
		<script type="text/javascript" src="js/draft.js"></script>
		<script type="text/javascript" src="js/mtg.js"></script>
		
	</head>
	
	<!-- 
		place for deck at the bottom where you can resort by adjusting a text box? 
		or two places one for sideboard one for deck so you can build deck as you go and there are
		buttons for adjusting it. basically rebuild cubetutor's deckbuilder.
		
		setInterval('Draft.update()', 1000)
	-->
	
	<body onload="startDraft();">
		<div class="container">
		
			<div class="row">
		
				<div class="twelve columns">
					
					<!-- Header -->
					
					<div class="row">
						<img class="header" src="images/header_bg_4.jpg"/>
					</div>
					
					<div id="topButtons"class="row">
						<div class="four columns">
							<div id="welcomeMessage"></div>
							<div id="statusMessage"></div>
						</div>
						<div id="mainPileCount" class="two columns">
							<div>Main Pile: <span id="mainPileNumber">[pileNumber]</span></div>
							<div id="mainPile" class="mainWinstonPile"></div>
						</div>
						<div class="two columns">
							<div>Pile One: <span id="pileOneNumber">[pileNumber]</span></div>
							<div id="pileOne" class="winstonPile"></div>
							<div id="pileOneArrow" class="currentPilePointer">^</div>
						</div>
						<div class="two columns">
							<div>Pile Two: <span id="pileTwoNumber">[pileNumber]</span></div>
							<div id="pileTwo" class="winstonPile"></div>
							<div id="pileTwoArrow" class="currentPilePointer" style="display: none;">^</div>
						</div>
						<div class="two columns">
							<div>Pile Three: <span id="pileThreeNumber">[pileNumber]</span></div>
							<div id="pileThree" class="winstonPile"></div>
							<div id="pileThreeArrow" class="currentPilePointer" style="display: none;">^</div>
						</div>
					</div>
					
					<!-- Button Row -->
					<div id="buttonRow" class="row">
						<div class="six columns" style="height: 1px;"></div>
						<div class="three columns">
							<button id="takePile" class="draftButton" onclick="if (confirm('Take pile?')) { takePile(); }">Take Pile</button>
						</div>
						<div class="three columns">
							<button id="passPile" class="draftButton" onclick="if (confirm('Pass pile?')) { passPile(); }">Pass Pile</button>
						</div>
					</div>
					
					<!-- Draft Pile Row -->
					<div id="currentPileRow" class="pileRow row">
						<div class="twelve columns heading">
							CurrentPile: <span id="currentPileNumber">[pileNumber]</span>
						</div>
						<div id="currentPile" class="twelve columns currentPile">
						
						</div>
					</div>
					
					<div id="draftComplete" class="row" style="display: none;">
						<div class="nine columns" style="height:1px">
						</div>
						<div class="three columns">
							<button id="downloadDeck" class="draftButton" onclick="saveDeckToFile();">Download Deck</button>
						</div>
					</div>
					
					<!-- Deck list -->					
					<div id="deckRow" class="row pileRow">
						<div class="twelve columns heading">
							Your Deck: <span id="deckListNumber">[pileNumber]</span>
						</div>
						<div id="deckList" class="twelve columns deck" style=""></div>				
					</div>
					
					<div id="draftComplete" class="row" style="display: none;">
						<div class="nine columns" style="height:1px">
						</div>
						<div class="three columns">
							<button id="downloadDeck" class="draftButton" onclick="saveDeckToFile();">Download Deck</button>
						</div>
					</div>
				
				</div>

				<!-- Messaging Column -->
				<div class="three columns" style="display: none;">
					<h2>Winston Drafting</h2>
					
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
