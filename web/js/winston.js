/* global $*/
/* global mtg*/

var winston = (function() {

    var format = "winston";
    var state;
	var draftComplete = false;//TODO: move draftComplete to the state object
    
    var takePile = function(cardName) {
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
    };
    
    var passPile = function(cardName) {
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
    };
    
    var processDataChange = function() {
    	//TODO configure page based on new state
		if (state.piles) {
			updateAllPiles();
			updateActivePlayer(state.activePlayer);
		}
		else {
			draftComplete = true;
			$("#draftComplete").show();
			$("#topButtons").hide();
			$("#buttonRow").hide();
			$("#currentPileRow").hide();
		}
    };
    
    var isStateUpdated = function(_state) {
    	//TODO compare current state to passed in state
    };
    
	var currentClass = "currentCardPile";
	
	var updateCardPileIndicator = function() {
		$(".cardPile").removeClass(currentClass);
		if (state.currentPile == 1) {
			$("#cardPileOne").addClass(currentClass);
		}
		else if (state.currentPile == 2) {
			$("#cardPileTwo").addClass(currentClass);
		}
		else {
			$("#cardPileThree").addClass(currentClass);
		}
	};
	
	var updateActivePlayer = function(activePlayer) {
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
	};

	var updateButtons = function(state) {
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
	};
	
	var updateAllPiles = function() {
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
	};

	var updatePile = function(id, size) {
		//Add card images
		$(id).html($("")); //empty div
		for (var i = 0; i !== size; ++i) {
			if (i > 30) {
				break;
			}
			$(id).append($("<img class=\"magicCard\" src=\"/images/Magic_the_gathering-card_back.jpg\">"));
		}
		//Reset Number
		$(id + 'Number').html($("")); //empty span
		$(id).append(cardCountString(size));
	};
	
	var currentPileAsString = function(pileNumber) {
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

var instanse = false; //used to lock functions which access the php files.
var playerNumber = 1; // set to 1 or 2 // need to figure out how this will be set...
var draftName = $.urlParam('draftName');
var cubeName = $.urlParam('cubeName');
var playerName = $.urlParam('playerName');
var changeTime;
var draftComplete = false;
var isDeckSorted = true;
var isSideboardSorted = true;
var updating = false;

/**
 * Run on load of the page to initialize the draft process.
 */
function startDraft() {
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
				'draftType': draftType,
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
	else {
		setTimeout(function() {
			startDraft();
		}, 100);
	}
	if (!updating) {
		updating = true;
		setInterval(updateDraft, 1000);
	}
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
				if (state.currentPile != data.state.currentPile
					|| state.piles[0] != data.state.piles[0]
					|| state.players.length != data.state.players.length) {
					state = data.state;
					if (state.players[playerNumber-1] != playerName) {
						//draft restarted
						startDraft();
					} else {
						changeTime = data.changeTime;
						processDataChange(state);
					}
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