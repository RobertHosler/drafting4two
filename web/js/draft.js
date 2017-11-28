
/* global $*/
/* global mtg*/
/* global winston*/
/* global pancake*/
/* global grid*/
/* global draft*/

var draftName;
var draftType;
var cubeName;
var playerName;
var playerNumber;
var isManualUpdateOnly = false;

/**
 * Initialize all the variables from the request parameters
 */
$(function() {
	draftName = $.urlParam('draftName');
	draftType = $.urlParam('draftType');
	cubeName = $.urlParam('cubeName');
	playerName = $.urlParam('playerName');
	while (!playerName) {
		playerName = prompt("Please enter your name", "");
		// window.location += "&playerName="+playerName;
	}
	switch (draftType) {
		case 'winston':
		case 'winston100':
			draft.startDraft(winston);
			break;
		case 'pancake':
		case 'burnfour':
		case 'glimpse':
			draft.startDraft(pancake);
			break;
		case 'grid':
		case 'grid20':
			draft.startDraft(grid);
			break;
		default:
			draft.startDraft(winston);
	}
	// draft.startDraft(pancake);
});

(function(exports) {

	var dfm;
	var instanse = false;
	var updating = false; //set to true once the draft begins updating
	var isDeckSorted = true;
	var isSideboardSorted = true;

	var startDraft = function(draftFormatModule) {
		dfm = draftFormatModule;
		dfm.startDraft();
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
					'draftType': draftType,
					'cubeName': cubeName,
					'playerName': playerName
				},
				dataType: "json",
				success: function(data) {
					dfm.state = data.state;
					playerNumber = data.playerNumber;
					processDataChange(data.state);
					$("#statusDraftName").html("Draft: " + draftName);
					$("#statusPlayerNumber").html("Player Number: " + playerNumber);
					instanse = false;
				}
			});
		}
		else {
			//instanse unavailable, try again shortly
			setTimeout(function() {
				draft.startDraft(draftFormatModule);
			}, 100);
		}
		if (!updating && !isManualUpdateOnly) {
			updating = true;
			setInterval(updateDraft, 1000);
		}
	};
	exports.startDraft = startDraft;

	var updateStatusMessage = function(state) {
		
	};

	exports.restartDraft = function() {
		if (!instanse) {
			instanse = true;
			$.ajax({
				type: "POST",
				url: "draft_process.php",
				data: {
					'function': 'restartDraft',
					'draftName': draftName,
					'draftType': draftType,
					'cubeName': cubeName,
					'playerName': playerName
				},
				dataType: "json",
				success: function(data) {
					dfm.state = data.state;
					playerNumber = data.playerNumber;
					processDataChange(data.state);
					$("#statusDraftName").html("Draft: " + draftName);
					$("#statusPlayerNumber").html("Player Number: " + playerNumber);
					instanse = false;
				}
			});
		}
		else {
			setTimeout(function() {
				draft.restartDraft();
			}, 100);
		}
	};

	/**
	 * Checks to see if the state was updated, and if it was, overwrites 
	 * the state with what is on the server.
	 */
	var updateDraft = function() {
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
					if (dfm.isStateUpdated(data.state)) {
						dfm.state = data.state;
						if (data.state.players[playerNumber - 1] != playerName) {
							//draft was restarted, need to rejoin
							draft.startDraft(dfm);
						}
						else {
							processDataChange(data.state);
						}
					}
					instanse = false;
				}
			});
		}
	};
	exports.updateDraft = updateDraft;

	var processDataChange = function(state) {
		updateCurrentPile(state);
		updateDeck(state.decks[playerNumber]); //update this player's decklist and sideboard
		updateSideboad(state.sideboard[playerNumber]);
		updateStatusMessage(state);
		dfm.processDataChange(state, isActivePlayer(state.activePlayer));
	};
	exports.processDataChange = processDataChange;

	var updateCurrentPile = function(state) {
		$('#currentPile').html(""); //empty div
		if (state.activePile && !state.draftComplete && isActivePlayer(state.activePlayer)) {
			mtg.appendCardImages('#currentPile', state.activePile);
		}
		else {
			$('#currentPileNumber').html("");
		}
	};

	var isActivePlayer = function(activePlayer) {
		return activePlayer ? (activePlayer == playerNumber) : true;
	};

	var updateDeck = function(deck) {
		$('#deckList').html($("")); //empty div
		if (isDeckSorted) {
			mtg.appendSortedCardNames('#deckList', deck);
		}
		else {
			var cardList = "";
			$.each(deck, function(index, card) {
				cardList += "<div>" + card + "</div>";
			});
			$('#deckList').append(cardList);
		}
		$('#deckListNumber').html(mtg.cardCountString(deck ? deck.length : 0));
	};

	var updateSideboad = function(sideboard) {
		$('#sideboardList').html($("")); //empty div
		if (isSideboardSorted) {
			mtg.appendSortedCardNames('#sideboardList', sideboard);
		}
		else {
			var cardList = "";
			$.each(sideboard, function(index, card) {
				cardList += "<div>" + card + "</div>";
			});
			$('#sideboardList').append(cardList);
		}
		$('#sideboardListNumber').html(mtg.cardCountString(sideboard ? sideboard.length : 0));
	};

	exports.moveToDeck = function(cardName, element) {
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
					dfm.state = data.state;
					processDataChange(data.state);
					instanse = false;
				}
			});
		}
		else {
			setTimeout(function() {
				draft.moveToDeck(cardName);
			}, 100);
		}
	};

	exports.moveToSideboard = function(cardName, element) {
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
					dfm.state = data.state;
					processDataChange(data.state);
					instanse = false;
				}
			});
		}
		else {
			setTimeout(function() {
				draft.moveToSideboard(cardName);
			}, 100);
		}
	};

	exports.saveDeckToFile = function() {
		var deck = dfm.state.decks[playerNumber];
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
			setTimeout(draft.saveDeckToFile(), 100);
		}

	};

	exports.sortDeck = function() {
		isDeckSorted = true;
		$("#showDeckSorted").hide();
		$("#showDeckUnsorted").show();
		updateDeck(dfm.state.decks[playerNumber]);
	};

	exports.unsortDeck = function() {
		isDeckSorted = false;
		$("#showDeckSorted").show();
		$("#showDeckUnsorted").hide();
		updateDeck(dfm.state.decks[playerNumber]);
	};

	exports.sortSideboard = function() {
		isSideboardSorted = true;
		$("#showSideboardSorted").hide();
		$("#showSideboardUnsorted").show();
		updateSideboad(dfm.state.sideboard[playerNumber]);
	};

	exports.unsortSideboard = function() {
		isSideboardSorted = false;
		$("#showSideboardSorted").show();
		$("#showSideboardUnsorted").hide();
		updateSideboad(dfm.state.sideboard[playerNumber]);
	};
	
	exports.pickCard = function(cardName) {
		$(".cardActions > button").attr('disabled', 'disabled');
		dfm.pickCard(cardName);
	};
	
	exports.burnCard = function(cardName) {
		$(".cardActions > button").attr('disabled', 'disabled');
		dfm.burnCard(cardName);
	};

	// return {
	// 	startDraft: startDraft,
	// 	updateDraft: updateDraft,
	// 	restartDraft: restartDraft,
	// 	moveToDeck: moveToDeck,
	// 	moveToSideboard: moveToSideboard,
	// 	saveDeckToFile: saveDeckToFile,
	// 	sortDeck, sortDeck,
	// 	sortSideboard, unsortSideboard
	// };
})(this.draft = {});

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