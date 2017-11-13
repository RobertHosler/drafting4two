/* global $*/
/* global mtg*/
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

var instanse = false; //used to lock functions which access the php files.
var playerNumber = 1; // set to 1 or 2 // need to figure out how this will be set...
var draftName;
var cubeName;
var playerName;
var changeTime;
var draftComplete = false;
var isDeckSorted = true;
var isSideboardSorted = true;


/**
 * Get parameter froms the window location
 */
$.urlParam = function(name) {
	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	if (results == null) {
		return null;
	}
	else {
		return results[1] || 0;
	}
};

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
		cubeName = "default_cube";
	}
	$("#welcomeMessage").html("<h2>Hello, " + playerName + "</h2>"); //empty span
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
			success: function(data) {
				state = data.state;
				playerNumber = data.playerNumber;
				changeTime = data.changeTime;
				processDataChange(state);
				$("#statusDraftName").html("Draft: " + draftName);
				$("#statusPlayerNumber").html("Player Number: " + playerNumber);
				instanse = false;
			}
		});
	}
	setInterval(updateDraft, 1000);
}

function restartDraft() {
	if (!instanse) {
		instanse = true;
		$.ajax({
			type: "POST",
			url: "draft_process.php",
			data: {
				'function': 'restartDraft',
				'draftName': draftName,
				'cubeName': cubeName,
				'playerName': playerName
			},
			dataType: "json",
			success: function(data) {
				state = data.state;
				playerNumber = data.playerNumber;
				changeTime = data.changeTime;
				processDataChange(state);
				$("#statusDraftName").html("Draft: " + draftName);
				$("#statusPlayerNumber").html("Player Number: " + playerNumber);
				instanse = false;
			}
		});
	}
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
				'draftName': draftName,
				'playerNumber': playerNumber
			},
			dataType: "json",
			success: function(data) {
				if (state.currentPile != data.state.currentPile ||
					state.piles[0] != data.state.piles[0]) {
					state = data.state;
					changeTime = data.changeTime;
					processDataChange(state);
				}
				instanse = false;
			},
		});
	}
}

function moveToSideboard(cardName, element) {
	$(element).hide();
	if (!instanse) {
		instanse = true;
		$.ajax({
			type: "POST",
			url: "draft_process.php",
			data: {
				'function': 'moveToSideboard',
				'draftName': draftName,
				'cardName': cardName,
				'playerNumber': playerNumber
			},
			dataType: "json",
			success: function(data) {
				state = data.state;
				changeTime = data.changeTime;
				processDataChange(data.state);
				instanse = false;
			},
		});
	}
	else {
		setTimeout(function() {
			moveToSideboard(cardName);
		}, 100);
	}
}

function moveToDeck(cardName, element) {
	$(element).hide();
	if (!instanse) {
		instanse = true;
		$.ajax({
			type: "POST",
			url: "draft_process.php",
			data: {
				'function': 'moveToDeck',
				'draftName': draftName,
				'cardName': cardName,
				'playerNumber': playerNumber
			},
			dataType: "json",
			success: function(data) {
				state = data.state;
				changeTime = data.changeTime;
				processDataChange(data.state);
				instanse = false;
			},
		});
	}
	else {
		setTimeout(function() {
			moveToDeck(cardName);
		}, 100);
	}
}

function processDataChange(state) {
	if (state.piles) {
		updateAllPiles();
		updateCurrentPile();
		updateActivePlayer(state.activePlayer);
	}
	else {
		draftComplete = true;
		$("#draftComplete").show();
		$("#topButtons").hide();
		$("#buttonRow").hide();
		$("#currentPileRow").hide();
	}
	updateDeckList(state.decks[playerNumber], state.sideboard[playerNumber]); //update this player's decklist and sideboard
	updateStatusMessage();
}

function updateStatusMessage() {
	$("#statusActivePlayer").html("Active Player: " + state.players[state.activePlayer-1]);
	$("#statusCurrentPileNumber").html("Current Pile: " + state.currentPile);
}

function updateActivePlayer(activePlayer) {
	if (!draftComplete && isActivePlayer() && state.players.length > 1) {
		//enable buttons
		$('#takePile').removeAttr('disabled');
		$('#passPile').removeAttr('disabled');
		updateButtons(state);
	}
	else {
		//disable buttons
		$('#takePile').attr('disabled', 'disabled');
		$('#passPile').attr('disabled', 'disabled');
	}
}

function updateButtons(state) {
	//disable passing the pile if the next piles are empty
	if ((state.currentPile == 1 && (!state.piles[2] || state.piles[2] === 0) && (!state.piles[3] || state.piles[3] === 0)) ||
		(state.currentPile == 2 && (!state.piles[3] || state.piles[3] === 0)) ||
		(state.currentPile == 3 && (!state.piles[0] || state.piles[0] === 0))) {
		$('#passPile').attr('disabled', 'disabled'); //disable passing the pile
	}
	//disable taking active pile if its undefined
	if (!state.activePile) {
		$('#takePile').attr('disabled', 'disabled'); //disable passing the pile
	}
}

function isActivePlayer() {
	return (state.activePlayer == playerNumber);
}

function updateAllPiles() {
	if (!state.piles) { return; }
	var mainPileSize = state.piles[0] ? state.piles[0] : 0;
	var pileOneSize = state.piles[1] ? state.piles[1] : 0;
	var pileTwoSize = state.piles[2] ? state.piles[2] : 0;
	var pileThreeSize = state.piles[3] ? state.piles[3] : 0;
	var totalCardsLeft = mainPileSize + pileOneSize + pileTwoSize + pileThreeSize;
	if (totalCardsLeft > 0) {
		updatePile('#mainPile', mainPileSize);
		updatePile('#pileOne', pileOneSize);
		updatePile('#pileTwo', pileTwoSize);
		updatePile('#pileThree', pileThreeSize);
	}
	else {
		draftComplete = true;
		$("#draftComplete").show();
		$("#topButtons").hide();
		$("#buttonRow").hide();
		$("#currentPileRow").hide();
	}
}

function updatePile(id, size) {
	$(id).html($("")); //empty div
	for (var i = 0; i !== size; ++i) {
		if (i > 30) {
			break;
		}
		$(id).append($("<img class=\"magicCard\" src=\"/images/Magic_the_gathering-card_back.jpg\">"));
	}
	updatePileCount((id + 'Number'), size);
}

function updatePileCount(id, size) {
	$(id).html($("")); //empty span
	$(id).append(cardCountString(size));
}

function cardCountString(size) {
	if (size == 1) {
		return size + " Card";
	}
	else {
		return size + " Cards";
	}
}

var currentClass = "currentCardPile";

/**
 * Populates the CurrentPile section of the page with the cards in the current pile.
 */
function updateCurrentPile() {
	$('#currentPile').html(""); //empty div
	if (!draftComplete && isActivePlayer() && state.activePile) {
		mtg.appendCardImages('#currentPile', state.activePile);
		$('#currentPileNumber').html(currentPileAsString(state.currentPile) + " - " + cardCountString(state.activePile.length));
	}
	else {
		$('#currentPileNumber').html("");
	}
	$(".cardPile").removeClass(currentClass);
	if (state.currentPile == 1) {
		$("#cardPileOne").addClass(currentClass);
	} else if (state.currentPile == 2) {
		$("#cardPileTwo").addClass(currentClass);
	} else {
		$("#cardPileThree").addClass(currentClass);
	}
}

function currentPileAsString(pileNumber) {
	if (pileNumber == 1) {
		return "One";
	}
	else if (pileNumber == 2) {
		return "Two";
	}
	else if (pileNumber == 3) {
		return "Three";
	}
	else {
		return "Error";
	}
}

function takePile() {
	$("#passPile").attr("disabled", true);
	$("#takePile").attr("disabled", true);
	// if (!confirm('Take pile?')) return;
	if (!instanse) {
		instanse = true;
		$.ajax({
			type: "POST",
			url: "draft_process.php",
			data: {
				'function': 'takePile',
				'draftName': draftName,
				'changeTime': changeTime,
				'playerNumber': playerNumber
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
	updateDeckList(state.decks[playerNumber], state.sideboard[playerNumber]); //update this player's decklist
}

function passPile() {
	$("#passPile").attr("disabled", true);
	$("#takePile").attr("disabled", true);
	// if (!confirm('Pass pile?')) return;
	if (!instanse) {
		instanse = true;
		$.ajax({
			type: "POST",
			url: "draft_process.php",
			data: {
				'function': 'passPile',
				'draftName': draftName,
				'changeTime': changeTime,
				'playerNumber': playerNumber
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

function updateDeckList(deckList, sideboardList) {
	$('#deckList').html($("")); //empty div
	if (isDeckSorted) {
		mtg.appendSortedCardNames('#deckList', deckList);
	} else {
		var cardList = "";
		$.each(deckList, function(index, card) {
			cardList += "<div>" + card + "</div>";
		});
		$('#deckList').append(cardList);
	}
	$('#sideboardList').html($("")); //empty div
	if (isSideboardSorted) {
		mtg.appendSortedCardNames('#sideboardList', sideboardList);
	} else {
		var cardList = "";
		$.each(sideboardList, function(index, card) {
			cardList += "<div>" + card + "</div>";
		});
		$('#sideboardList').append(cardList);
	}
	$('#deckListNumber').html(cardCountString(deckList ? deckList.length : 0));
	$('#sideboardListNumber').html(cardCountString(sideboardList ? sideboardList.length : 0));
}

function sortDeckList() {
	isDeckSorted = true;
	$("#showDeckSorted").hide();
	$("#showDeckUnsorted").show();
	updateDeckList(state.decks[playerNumber], 
		state.sideboard[playerNumber]);
}

function unsortDeckList() {
	isDeckSorted = false;
	$("#showDeckSorted").show();
	$("#showDeckUnsorted").hide();
	updateDeckList(state.decks[playerNumber], 
		state.sideboard[playerNumber]);
}

function sortSideboard() {
	isSideboardSorted = true;
	$("#showSideboardSorted").hide();
	$("#showSideboardUnsorted").show();
	updateDeckList(state.decks[playerNumber], 
		state.sideboard[playerNumber]);
}

function unsortSideboard() {
	isSideboardSorted = false;
	$("#showSideboardSorted").show();
	$("#showSideboardUnsorted").hide();
	updateDeckList(state.decks[playerNumber], 
		state.sideboard[playerNumber]);
}

function saveDeckToFile(deck) {
	deck = deck ? deck : state.decks[playerNumber];
	var dt = new Date();
	var date = dt.getFullYear() + "" + (dt.getMonth() + 1) + "" + dt.getDate();
	var fileName = "/decks/" + date + "_" + draftName + "_" + playerName + ".txt";
	if (!instanse) {
		instanse = true;
		$.ajax({
			type: "POST",
			url: "draft_process.php",
			data: {
				'function': 'saveDeck',
				'draftName': draftName,
				'deckFileName': fileName,
				'playerNumber': playerNumber
			},
			dataType: "json",
			success: function(data) {
				var a = document.createElement('A');
				a.href = fileName; //full path
				a.download = fileName.substr(fileName.lastIndexOf('/') + 1); //file name
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
