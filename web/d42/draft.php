<?php include 'shared/start_authenticated_session.php';?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
	<?php include 'shared/html_head.php';?>
    <script type="text/javascript">
    	var username='<?php echo $_SESSION["username"];?>';
    	initDraft();
    </script>
</head>
	
<body>
	
	<?php include 'shared/header.php';?>
				
	<div class="container">
				
				<div id="topButtons"class="row">
					<div class="col-xs-12 col-sm-3">
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
					<div class="col-xs-12 col-sm-9">
						
						<div id="winstonPiles" class="row" style="display:none;">
							<div id="mainPileCount" class="col-xs-3 pileCount cardPile">
								<div>Main Pile</div>
								<div id="mainPileNumber">[pileNumber]</div>
								<div id="mainPile" class="mainWinstonPile"></div>
							</div>
							<div id="cardPileOne" class="col-xs-3 cardPile">
								<div>Pile One</div>
								<div id="pileOneNumber">[pileNumber]</div>
								<div class="pileBorder">
									<div id="pileOne" class="winstonPile"></div>
								</div>
							</div>
							<div id="cardPileTwo" class="col-xs-3 cardPile">
								<div>Pile Two</div>
								<div id="pileTwoNumber">[pileNumber]</div>
								<div class="pileBorder">
									<div id="pileTwo" class="winstonPile"></div>
								</div>
							</div>
							<div id="cardPileThree" class="col-xs-3 cardPile">
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
					<div class="col-xs-6 winstonButtons" style="display:none;">
						<button id="takePile" class="draftButton btn btn-primary" onclick="winston.takePile();">Take Pile</button>
					</div>
					<div class="col-xs-6 winstonButtons" style="display:none;">
						<button id="passPile" class="draftButton btn btn-default" onclick="winston.passPile();">Pass Pile</button>
					</div>
				</div>
				
				<div id="grid" style="display:none;">
					<div class="row">
						<div class="col-xs-3">
							<span>Current Grid: </span>
							<span id="statusCurrentGridNumber">1</span>
						</div>
						<div class="col-xs-3">
							<button id="gridCol1" class="draftButton gridButton btn btn-default" onclick="grid.takeCol(0);">Column One</button>
						</div>
						<div class="col-xs-3">
							<button id="gridCol2" class="draftButton gridButton btn btn-default" onclick="grid.takeCol(1);">Column Two</button>
						</div>
						<div class="col-xs-3">
							<button id="gridCol3" class="draftButton gridButton btn btn-default" onclick="grid.takeCol(2);">Column Three</button>
						</div>
					</div>
					<div class="row gridRow">
						<div class="col-xs-3">
							<button id="gridRow1" class="draftButton gridButton btn btn-default" onclick="grid.takeRow(0);">Row One</button>
						</div>
						<div id="grid00" class="col-xs-3">
							<img class="magicCard" src="/images/Magic_the_gathering-card_back.jpg">
						</div>
						<div id="grid01" class="col-xs-3">
							<img class="magicCard" src="/images/Magic_the_gathering-card_back.jpg">
						</div>
						<div id="grid02" class="col-xs-3">
							<img class="magicCard" src="/images/Magic_the_gathering-card_back.jpg">
						</div>
					</div>
					<div class="row gridRow">
						<div class="col-xs-3">
							<button id="gridRow2" class="draftButton gridButton btn btn-default" onclick="grid.takeRow(1);">Row Two</button>
						</div>
						<div id="grid10" class="col-xs-3">
							<img class="magicCard" src="/images/Magic_the_gathering-card_back.jpg">
						</div>
						<div id="grid11" class="col-xs-3">
							<img class="magicCard" src="/images/Magic_the_gathering-card_back.jpg">
						</div>
						<div id="grid12" class="col-xs-3">
							<img class="magicCard" src="/images/Magic_the_gathering-card_back.jpg">
						</div>
					</div>
					<div class="row gridRow">
						<div class="col-xs-3">
							<button id="gridRow3" class="draftButton gridButton btn btn-default" onclick="grid.takeRow(2);">Row Three</button>
						</div>
						<div id="grid20" class="col-xs-3">
							<img class="magicCard" src="/images/Magic_the_gathering-card_back.jpg">
						</div>
						<div id="grid21" class="col-xs-3">
							<img class="magicCard" src="/images/Magic_the_gathering-card_back.jpg">
						</div>
						<div id="grid22" class="col-xs-3">
							<img class="magicCard" src="/images/Magic_the_gathering-card_back.jpg">
						</div>
					</div>
				</div>
				
				<div id="winchester" style="display:none;">
					<div class="row">
						<div class="col-xs-12">			
							<div class="pileRow">
								<div class="heading">
									Pile: <span id="pileNumber1">1</span>
								</div>
								<div id="pile1" class="currentPile">
								
								</div>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-xs-12">			
							<div class="pileRow">
								<div class="heading">
									Pile: <span id="pileNumber2">2</span>
								</div>
								<div id="pile2" class="currentPile">
								
								</div>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-xs-12">			
							<div class="pileRow">
								<div class="heading">
									Pile: <span id="pileNumber3">3</span>
								</div>
								<div id="pile3" class="currentPile">
								
								</div>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-xs-12">			
							<div class="pileRow">
								<div class="heading">
									Pile: <span id="pileNumber4">4</span>
								</div>
								<div id="pile4" class="currentPile">
								
								</div>
							</div>
						</div>
					</div>
				</div>
				
				<!-- Draft Pile Row -->
				<div id="draftPileRow" class="row">
					<div class="col-xs-12">			
						<div id="currentPileRow" class="pileRow">
							<div class="heading">
								CurrentPile: <span id="currentPileNumber">[pileNumber]</span>
							</div>
							<div id="currentPile" class="currentPile">
							
							</div>
						</div>
					</div>
				</div>
				
				<!-- Download -->
				<div id="draftComplete" class="row" style="display: none;">
					<div class="col-xs-12">
						<button id="downloadDeck" class="draftButton btn btn-primary btn-lg" onclick="draft.saveDeckToFile();">Download Deck</button>
					</div>
				</div>
				
				<!-- Deck -->		
				<div class="row">
					<div class="col-xs-12">			
						<div id="deckRow" class="pileRow">
							<div class="heading">
								<button id="showDeckSorted" class="draftButton sortButton btn btn-default" onclick="draft.sortDeck();" style="display:none;">Show Sorted</button>
								<button id="showDeckUnsorted" class="draftButton sortButton btn btn-default" onclick="draft.unsortDeck();">Show Unsorted</button>
								Deck: <span id="deckListNumber">[pileNumber]</span>
							</div>
							<div id="deckList" class="deck maindeck"></div>
						</div>
					</div>
				</div>
				
				<!-- Sideboard -->	
				<div class="row">
					<div class="col-xs-12">
						<div id="deckRow" class="pileRow">
							<div class="heading">
								<button id="showSideboardSorted" class="draftButton sortButton btn btn-default" onclick="draft.sortSideboard();" style="display:none;">Show Sorted</button>
								<button id="showSideboardUnsorted" class="draftButton sortButton btn btn-default" onclick="draft.unsortSideboard();">Show Unsorted</button>
								Sideboard: <span id="sideboardListNumber">[pileNumber]</span>
							</div>
							<div id="sideboardList" class="deck sideboard"></div>
						</div>
					</div>
				</div>
				
				<div class="row">
					<div class="col-xs-12">
						<!-- Opponent Pool -->
						<div id="opponentPoolRow" class="pileRow" style="display:none;">
							<div class="heading">
								<button class="btn btn-default sortButton" type="button" data-toggle="collapse" data-target="#opponentPool" aria-expanded="false" aria-controls="collapseExample">Toggle</button>
								<button id="showOpponentPoolSorted" class="draftButton sortButton btn btn-default" onclick="draft.sortOpponentPool();" style="display:none;">Show Sorted</button>
								<button id="showOpponentPoolUnsorted" class="draftButton sortButton btn btn-default" onclick="draft.unsortOpponentPool();">Show Unsorted</button>
								<span>Opponent's Pool</span>
							</div>
							<div id="opponentPool" class="deck maindeck sideboard collapse"></div>
						</div>
					</div>
				</div>
				
				<div id="draftComplete" class="row" style="display: none;">
					<div class="col-xs-9" style="height:1px">
					</div>
					<div class="col-xs-3">
						<button id="downloadDeck" class="draftButton" onclick="draft.saveDeckToFile();">Download Deck</button>
					</div>
				</div>
			
			</div>

			<!-- Messaging Column -->
			<div class="col-xs-3" style="display: none;">
				<h2>Winston Drafting</h2>
				
				<p id="name-area"></p>
				
				<div id="chat-wrap"><div id="chat-area"></div></div>
				
				<form id="send-message-area">
					<p>Your message: </p>
					<textarea id="sendie" maxlength = '100' ></textarea>
				</form>
			</div>
			
	<?php include 'shared/footer.php';?>
</body>
</html>
