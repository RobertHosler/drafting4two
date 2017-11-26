<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

		<link rel="stylesheet" text="text/css" href="/libs/skeleton/2.0.4/normalize.css" />
		<link rel="stylesheet" text="text/css" href="/libs/skeleton/2.0.4/skeleton.css" />
		<link rel="stylesheet" text="text/css" href="/css/mystyles.css" />
		<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
		<script type="text/javascript" src="/js/mtg.js"></script>
		<script type="text/javascript" src="/js/draft.js"></script>
		<script type="text/javascript" src="/js/winston.js"></script>
		<script type="text/javascript" src="/js/pancake.js"></script>
		
	</head>
	
	<body>
		<div class="container">
		
			<div class="row">
		
				<div class="twelve columns">
					
					<!-- Header -->
					
					<div class="row">
						<img class="header" src="/images/header_bg_4.jpg"/>
						<a href="/">Return to Lobby</a>
						<a href="javascript:void(0)" onclick="if (confirm('Are you sure you want to restart the draft?')) { draft.restartDraft(); }">Restart Draft</a>
						<a href="#" onclick="draft.updateDraft();">Refresh Draft</a>
					</div>
					
					<div id="topButtons"class="row">
						<div class="seven columns">
							<div id="welcomeMessage"></div>
							<div id="status">
								<div id="statusDraftName"></div>
								<div id="statusPlayerNumber" style="display: none;"></div>
								<div id="statusActivePlayer"></div>
								<div id="statusCurrentPileNumber" style="display: none;"></div>
								<div id="statusCurrentRound"></div>
								<div id="statusCurrentTurn"></div>
							</div>
						</div>
						<div class="five columns">
							<div id="winstonPiles" class="row" style="display:none;">
								<div id="mainPileCount" class="three columns pileCount cardPile">
									<div>Main Pile</div>
									<div id="mainPileNumber">[pileNumber]</div>
									<div id="mainPile" class="mainWinstonPile"></div>
								</div>
								<div id="cardPileOne" class="three columns cardPile">
									<div>Pile One</div>
									<div id="pileOneNumber">[pileNumber]</div>
									<div class="pileBorder">
										<div id="pileOne" class="winstonPile"></div>
									</div>
								</div>
								<div id="cardPileTwo" class="three columns cardPile">
									<div>Pile Two</div>
									<div id="pileTwoNumber">[pileNumber]</div>
									<div class="pileBorder">
										<div id="pileTwo" class="winstonPile"></div>
									</div>
								</div>
								<div id="cardPileThree" class="three columns cardPile">
									<div>Pile Three</div>
									<div id="pileThreeNumber">[pileNumber]</div>
									<div class="pileBorder">
										<div id="pileThree" class="winstonPile"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
					
					<!-- Button Row -->
					<div id="buttonRow" class="row">
						<div class="six columns" style="height: 1px;"></div>
						<div class="three columns winstonButtons" style="display:none;">
							<button id="takePile" class="draftButton" onclick="winston.takePile();">Take Pile</button>
						</div>
						<div class="three columns winstonButtons" style="display:none;">
							<button id="passPile" class="draftButton" onclick="winston.passPile();">Pass Pile</button>
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
						<div class="eight columns" style="height: 1px;"></div>
						<div class="three columns">
							<button id="showDeckSorted" class="draftButton" onclick="draft.sortDeck();" style="display:none;">Sorted</button>
							<button id="showDeckUnsorted" class="draftButton" onclick="draft.unsortDeck();">Unsorted</button>
						</div>
						<div id="deckList" class="twelve columns deck maindeck"></div>
					</div>
					
					<div id="deckRow" class="row pileRow">
						<div class="twelve columns heading">
							Your Sideboard: <span id="sideboardListNumber">[pileNumber]</span>
						</div>
						<div class="eight columns" style="height: 1px;"></div>
						<div class="three columns">
							<button id="showSideboardSorted" class="draftButton" onclick="draft.sortSideboard();" style="display:none;">Sorted</button>
							<button id="showSideboardUnsorted" class="draftButton" onclick="draft.unsortSideboard();">Unsorted</button>
						</div>
						<div id="sideboardList" class="twelve columns deck sideboard"></div>
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
