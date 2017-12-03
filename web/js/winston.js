/* global $*/
/* global mtg*/
/* global draft*/
/* global draftName*/
/* global playerNumber*/

var winston = (function() {

    var state;
	
	var startDraft = function() {
		$("#winstonPiles").show();
		$(".winstonButtons").show();
	};
	
	 var takePile = function(cardName) {
		$("#passPile").attr("disabled", true);
		$("#takePile").attr("disabled", true);
		// if (!confirm('Take pile?')) return;
		if (!draft.instanse) {
			draft.instanse = true;
			$.ajax({
				type: "POST",
				url: "process/draft_winston.php",
				data: {
					'function': 'takePile',
					'draftName': draftName,
					'playerNumber': playerNumber
				},
				dataType: "json",
				success: function(data) {
					winston.state = data.state;
					processDataChange(data.state);
					draft.processDataChange(data.state);
					draft.instanse = false;
				}
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
		if (!draft.instanse) {
			draft.instanse = true;
			$.ajax({
				type: "POST",
				url: "process/draft_winston.php",
				data: {
					'function': 'passPile',
					'draftName': draftName,
					'playerNumber': playerNumber,
					'currentPile': winston.state.currentPile
				},
				dataType: "json",
				success: function(data) {
					winston.state = data.state;
					processDataChange(data.state);
					draft.processDataChange(data.state);
					draft.instanse = false;
				}
			});
		}
		else {
			setTimeout(passPile, 100);
		}
	};
	
	var isStateUpdated = function(_state) {
		return winston.state.currentPile != _state.currentPile
					|| winston.state.piles[0] != _state.piles[0]
					|| winston.state.players.length != _state.players.length;
	};
    
	var currentClass = "currentCardPile";

	var	processDataChange = function(state) {
		if (!state.draftComplete) {
			updateAllPiles(state);
			var isActivePlayer = (state.activePlayer == playerNumber);
			updateActivePlayer(state, isActivePlayer);
		} else {
			$("#draftComplete").show();
			$("#topButtons").hide();
			$("#buttonRow").hide();
			$("#currentPileRow").hide();
		}
        updateStatusMessage(state);
	};
	
	var updateStatusMessage = function(state) {
		if (state.draftComplete) {
			$("#statusActivePlayer").hide();
			$("#statusCurrentPileNumber").hide();
		} else {
			var activePlayer = state.players[state.activePlayer - 1];
			activePlayer = activePlayer ? activePlayer : "Drafter 2 will pick first. Waiting for them to join.";
			$("#statusActivePlayer").html("Active Drafter: " + activePlayer);
			$("#statusCurrentPileNumber").html("Current Pile: " + state.currentPile);
		}
	};
	
	var updateCardPileIndicator = function(state) {
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
	
	var updateActivePlayer = function(state, isActivePlayer) {
		if (!state.draftComplete && isActivePlayer && state.players.length > 1) {
			//enable buttons
			$('#takePile').removeAttr('disabled');
			$('#passPile').removeAttr('disabled');
			$('#currentPileNumber').html(currentPileAsString(state.currentPile) + " - " + mtg.cardCountString(state.activePile.length));
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
	
	var updateAllPiles = function(state) {
		if (!state.piles) { return; }
		var mainPileSize = state.piles[0] ? state.piles[0] : 0;
		var pileOneSize = state.piles[1] ? state.piles[1] : 0;
		var pileTwoSize = state.piles[2] ? state.piles[2] : 0;
		var pileThreeSize = state.piles[3] ? state.piles[3] : 0;
		var totalCardsLeft = mainPileSize + pileOneSize + pileTwoSize + pileThreeSize;
		if (!state.draftComplete) {
			updatePile('#mainPile', mainPileSize);
			updatePile('#pileOne', pileOneSize);
			updatePile('#pileTwo', pileTwoSize);
			updatePile('#pileThree', pileThreeSize);
			updateCardPileIndicator(state);
		} else {
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
		$(id).append(mtg.cardCountString(size));
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
		state: state,
		startDraft: startDraft,
		processDataChange: processDataChange,
		isStateUpdated: isStateUpdated,
		passPile: passPile,
		takePile: takePile
	};
})();