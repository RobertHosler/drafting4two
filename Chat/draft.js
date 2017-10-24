
/**
___Winston state
int count (number of lines to determine if we need to update)
ary mainPile
ary pileOne
ary pileTwo
ary pileThree
ary playerOneDeckList
ary playerTwoDeckList
int currentPile
int activePlayer (1 or 2)
*/
var state;

var instanse = false;//used to lock functions which access the php files.
var mes;
var file;
var playerNumber = 1; // set to 1 or 2 // need to figure out how this will be set...
var draftName;
var cubeName;
var playerName;
var changeTime;
var draftComplete = false;

/**
 * Run on load of the page to initialize the draft process.
 */
function startDraft() {
	draftName = $.urlParam('draftName');
	cubeName = $.urlParam('cubeName');
	playerName = $.urlParam('playerName');
	while (!playerName) {
		playerName = prompt("Please enter your name", "");
	}
	if (!cubeName) {
		cubeName = "cube.txt"
	}
	$("#welcomeMessage").html("<h2>Hello, " + playerName + "</h2>");//empty span
	$("#welcomeMessage").append("<p>Draft: " + draftName + "</p>");
	//alert(draftName);
	"use strict";
	if (!instanse) {
		instanse = true;
		$.ajax({
			type: "POST",
			url: "draft_process.php",
			data: {
				'function': 'startDraft',
				'draftName': draftName,
				'cubeName': cubeName,
				'playerName': playerName
			},
			dataType: "json",
			success: function (data) {
				state = data.state;
				playerNumber = data.playerNumber;
				changeTime = data.changeTime;
				//TODO: 
				processDataChange(state);
				//updateAllPiles();
				//updateCurrentPile();
				$("#welcomeMessage").append("<p>Player Number: " + (playerNumber) + "</p>");
				instanse = false;
			}
		});
	}
	setInterval(updateDraft, 1000);
}

/**
 * Checks to see if the state was updated, and if it was, overwrites 
 * the state with what is on the server.
 */
function updateDraft() {
	if (!instanse) {
		instanse = true;
	    $.ajax({
			type: "POST",
			url: "draft_process.php",
			data: {
			   	'function': 'update',
				'state': state,
				'file': file,
				'changeTime': changeTime
			},
			dataType: "json",
			success: function(data) {
				state = data.state;
				if (data.change) {
					changeTime = data.changeTime;
					processDataChange(state);
				}
				instanse = false;
			},
		});
	}
}

function processDataChange(state) {
	updateAllPiles();
	updateCurrentPile();
	//updateDeckList(state.deckList);
	updateDeckList(state.decks[playerNumber]);//update this player's decklist
	updateActivePlayer(state.activePlayer);
	updateStatusMessage();
}

function updateStatusMessage() {
	$("#statusMessage").html("<p>Active Player: " + state.activePlayer + "</p>");
	$("#statusMessage").append("<p>Current Pile: " + state.currentPile + "</p>");
}

function updateActivePlayer(activePlayer) {
	if (!draftComplete && isActivePlayer() && state.players.length > 1) {
		//enable buttons
		$('#takePile').removeAttr('disabled');
		$('#passPile').removeAttr('disabled');  
		updateButtons(state);
	} else {
		//disable buttons
		$('#takePile').attr('disabled','disabled');
		$('#passPile').attr('disabled','disabled'); 
	}
}

function updateButtons(state) {
	//disable passing the pile if the next piles are empty
	if ( (state.currentPile == 1 && (!state.piles[2] || state.piles[2].length === 0) && (!state.piles[3] || state.piles[3].length === 0) )
		|| (state.currentPile == 2 && (!state.piles[3] || state.piles[3].length === 0))
		|| (state.currentPile == 3 && (!state.piles[0] || state.piles[0].length === 0)) ) {
	   $('#passPile').attr('disabled','disabled');//disable passing the pile
	}
	//disable taking the pile if the current piles length is 0
	if ( state.piles[state.currentPile].length === 0) {
	   $('#takePile').attr('disabled','disabled');//disable passing the pile
	}
}

function isActivePlayer() {
	return (state.activePlayer == playerNumber);
}

function updateAllPiles() {
	var mainPileSize = state.piles[0] != null ? state.piles[0].length : 0;
	var pileOneSize = state.piles[1] != null ? state.piles[1].length : 0;
	var pileTwoSize = state.piles[2] != null ? state.piles[2].length : 0;
	var pileThreeSize = state.piles[3] != null ? state.piles[3].length : 0;
	var totalCardsLeft = mainPileSize + pileOneSize + pileTwoSize + pileThreeSize;
	if (totalCardsLeft > 0) {
		updatePile('#mainPile', mainPileSize);
		updatePile('#pileOne', pileOneSize);
		updatePile('#pileTwo', pileTwoSize);
		updatePile('#pileThree', pileThreeSize);
	} else {
		draftComplete = true;
		$("#draftComplete").show();
		$("#topButtons").hide();
		$("#buttonRow").hide();
		$("#currentPileRow").hide();
	}
}

function updatePile(id, size) {
	$(id).html($(""));//empty div
	for ( var i = 0; i !== size; ++i) {
		if (i > 30) {
			break;
		}
		$(id).append($("<img class=\"magicCard\" src=\"http://upload.wikimedia.org/wikipedia/en/a/aa/Magic_the_gathering-card_back.jpg\">"));
	}
	updatePileCount((id + 'Number'), size);
}

function updatePileCount(id, size) {
	$(id).html($(""));//empty span
	$(id).append(cardCountString(size));
}

function cardCountString(size) {
	if (size == 1) {
		return size + " Card";
	} else {
		return size + " Cards";
	}
}

/**
 * Populates the CurrentPile section of the page with the cards in the current pile.
 */
function updateCurrentPile() {
	$('#currentPile').html("");//empty div
	if (!draftComplete && isActivePlayer()) {
		appendCardImages('#currentPile', state.piles[state.currentPile]);
		$('#currentPileNumber').html(currentPileAsString(state.currentPile) + " - " + cardCountString(state.piles[state.currentPile].length));
	} else {
		$('#currentPileNumber').html("");
	}
	if (state.currentPile == 1) {
		$("#pileOneArrow").show();
		$("#pileTwoArrow").hide();
		$("#pileThreeArrow").hide();
	} else if (state.currentPile == 2) {
		$("#pileOneArrow").hide();
		$("#pileTwoArrow").show();
		$("#pileThreeArrow").hide();
	} else {
		$("#pileOneArrow").hide();
		$("#pileTwoArrow").hide();
		$("#pileThreeArrow").show();
	}
}

function currentPileAsString(pileNumber) {
	if (pileNumber == 1) {
		return "One";
	} else if (pileNumber == 2) {
		return "Two";
	} else if (pileNumber == 3) {
		return "Three";
	} else {
		return "Error";
	}
}

function takePileLegacy() {
	if (isActivePlayer()) {
		var activePlayerDeck = state.decks[state.activePlayer];
		var currentPile = state.piles[state.currentPile];
		$.each (currentPile, function(index, card) {
			activePlayerDeck.push(card);
		});
		//reset currentPile
		currentPile = [];
		currentPile.push(state.piles[0].pop());
		state.piles[state.currentPile] = currentPile;
		state.currentPile = 1;
		updateAll();
	}
}

function takePile() {
	if (!instanse) {
		instanse = true;
	    $.ajax({
			type: "POST",
			url: "draft_process.php",
			data: {
			   	'function': 'takePile',
				'state': state,
				'file': file,
				'changeTime': changeTime
			},
			dataType: "json",
			success: function(data) {
				state = data.state;
				changeTime = data.changeTime;
				processDataChange(state);
				instanse = false;
			},
		});
	}
	else {
		setTimeout(takePile, 100);
	}
}

function updateAll() {
	updateAllPiles();
	updateCurrentPile();
	updateDeckList(state.decks[playerNumber]);//update this player's decklist
}

function passPileLegacy() {
	if (isActivePlayer()) {
		var currentPile = state.piles[state.currentPile];
		currentPile.push(state.piles[0].pop());
		state.piles[state.currentPile] = currentPile;
		if (state.currentPile === 3) {
			var activePlayerDeck = state.decks[state.activePlayer];
			activePlayerDeck.push(state.piles[0].pop());
			state.currentPile = 1;
		} else {
			state.currentPile += 1;
		}
		updateAll();
	}
}

function passPile() {
	if (!instanse) {
		instanse = true;
	    $.ajax({
			type: "POST",
			url: "draft_process.php",
			data: {
			   	'function': 'passPile',
				'state': state,
				'file': file,
				'changeTime': changeTime
			},
			dataType: "json",
			success: function(data) {
				state = data.state;
				changeTime = data.changeTime;
				processDataChange(state);
				instanse = false;
			},
		});
	}
	else {
		setTimeout(passPile, 100);
	}
}

function updateDeckList(deckList) {
	$('#deckList').html($(""));//empty div
	appendCardNames('#deckList', deckList);
	$('#deckListNumber').html(cardCountString(deckList ? deckList.length : 0));
}

$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return results[1] || 0;
    }
}

function saveDeckToFile(deck) {
	deck = deck ? deck : state.decks[playerNumber];
	var dt = new Date();
	var date = dt.getFullYear() + "" + (dt.getMonth() + 1) + "" + dt.getDate();
	var fileName = date + "_" + draftName + "_" + playerName + ".txt";
	if (!instanse) {
		instanse = true;
		$.ajax({
			type: "POST",
			url: "draft_process.php",
			data: {
				'function': 'saveDeck',
				'state': state,
				'deckFileName': fileName,
				'playerNumber': playerNumber
			},
			dataType: "json",
			success: function (data) {
				var a = document.createElement('A');
				a.href = fileName;//full path
				a.download = fileName.substr(fileName.lastIndexOf('/') + 1);//file name
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
				instanse = false;
			}
		});
	}
	else {
		setTimeout(saveDeckToFile, 100);
	}
}
 

function Draft() {
	"use strict";
	this.update = updateDraft;
	this.send = sendDraft;
	this.getState = getStateOfDraft;
}