/* global $*/
/* global mtg*/
/* global winston*/
/* global pancake*/

var draftName;
var draftType;
var cubeName;
var playerName;

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
	}
	switch (draftType) {
		case 'winston':
			draft.startDraft(winston);
			break;
		case 'pancake':
			draft.startDraft(pancake);
			break;
		default:
			draft.startDraft(winston);
	}
	// draft.startDraft(pancake);
});

var draft = (function() {

	var playerNumber;
	var dfm;
	var instanse = false;
	var updating = false;//set to true once the draft begins updating
	var isDeckSorted = true;
	var isSideboardSorted = true;

	var startDraft = function(draftFormatModule) {
		dfm = draftFormatModule;
		draftFormatModule.format;
		draftFormatModule.state;
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
					state = data.state;
					playerNumber = data.playerNumber;
					processDataChange(state);
					$("#statusDraftName").html("Draft: " + draftName);
					$("#statusPlayerNumber").html("Player Number: " + playerNumber);
					instanse = false;
				}
			});
		}
		else {
			//instanse unavailable, try again shortly
			setTimeout(function() {
				startDraft();
			}, 100);
		}
		if (!updating) {
			updating = true;
			setInterval(updateDraft, 1000);
		}
	};
	
	var updateStatusMessage = function() {
		$("#statusActivePlayer").html("Active Player: " + state.players[state.activePlayer-1]);
		$("#statusCurrentPileNumber").html("Current Pile: " + state.currentPile);
	};
	
	var restartDraft = function() {
		
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
					dfm.processData
					if (dfm.isStateUpdated(data.state)) {
						dfm.state = data.state;
						if (dfm.state.players[playerNumber - 1] != playerName) {
							//draft was restarted, need to rejoin
							startDraft(dfm);
						}
						else {
							dfm.processDataChange();
							this.processDataChange();
						}
					}
					instanse = false;
				},
			});
		}
	};
	
    var processDataChange = function() {
		updateCurrentPile();
		updateDeck(state.decks[playerNumber]); //update this player's decklist and sideboard
		updateSideboad(state.sideboard[playerNumber]);
		updateStatusMessage();
    };
	
	var updateCurrentPile = function() {
		$('#currentPile').html(""); //empty div
		if (!dfm.draftComplete && isActivePlayer() && state.activePile) {
			mtg.appendCardImages('#currentPile', state.activePile);
			$('#currentPileNumber').html(currentPileAsString(state.currentPile) + " - " + cardCountString(state.activePile.length));
		}
		else {
			$('#currentPileNumber').html("");
		}
	};
	
	var isActivePlayer = function() {
		return (state.activePlayer == playerNumber);
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
		$('#deckListNumber').html(cardCountString(deck ? deck.length : 0));
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
		$('#sideboardListNumber').html(cardCountString(sideboard ? sideboard.length : 0));
	};
	
	var moveToDeck = function(cardName) {
		
	};
	
	var moveToSideboard = function(cardName) {
		
	};
	
	var saveDeckToFile = function() {
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
			setTimeout(saveDeckToFile, 100);
		}
		
	};
	
	var sortDeck = function() {
		isDeckSorted = true;
		$("#showDeckSorted").hide();
		$("#showDeckUnsorted").show();
		updateDeck(dfm.state.decks[playerNumber]);
	};
	
	var unsortDeck = function() {
		isDeckSorted = false;
		$("#showDeckSorted").show();
		$("#showDeckUnsorted").hide();
		updateDeck(dfm.state.decks[playerNumber]);
	};
	
	var sortSideboard = function() {
		isSideboardSorted = true;
		$("#showSideboardSorted").hide();
		$("#showSideboardUnsorted").show();
		updateSideboad(state.sideboard[playerNumber]);
	};
	
	var unsortSideboard = function() {
		isSideboardSorted = false;
		$("#showSideboardSorted").show();
		$("#showSideboardUnsorted").hide();
		updateSideboad(state.sideboard[playerNumber]);
	};

	return {

	};
})();

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

var state;

function restartDraft() {
	if (!instanse) {
		instanse = true;
		$.ajax({
			type: "POST",
			url: "draft_process.php",
			data: {
				'function': 'restartDraft',
				'draftName': draftName,
				'cubeName': state.cubeName,
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
	else {
		setTimeout(function() {
			restartDraft();
		}, 100);
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