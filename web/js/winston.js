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