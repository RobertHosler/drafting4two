/* global $*/
/* global mtg*/
/* global draft*/
/* global draftName*/
/* global playerNumber*/

var winchester = (function() {
    
    var state;

	var startDraft = function() {
		//show grid
		$("#winchester").show();
		//hide pile
		$("#currentPileRow").hide();
		$('#statusActivePlayer').show();
		$('#opponentPoolRow').show();
	};
	
	var isStateUpdated = function(_state) {
		//determine if state has been updated based on turn, active player, player list size, and round
		return true;
	};
	
	var	processDataChange = function(state) {
		if (state.draftComplete) {
			$("#winchester").hide();
			$("#draftComplete").show();
		} else {
			//update piles
			for (var i = 1; i <= 4; i++) {
				mtg.appendCardImages("#pile" + i, state.pile[i]);
			}
			updateActivePlayer(state);
		}
		updateStatusMessage(state);
	};
	
	var updateActivePlayer = function(state) {
		if (!state.draftComplete && state.isActivePlayer && state.players.length > 1) {
			//enable buttons
			$('.winchesterButton').removeAttr('disabled');
		}
		else {
			//disable buttons
			$('.winchesterButton').attr('disabled', 'disabled');
		}
	};
	
	var updateStatusMessage = function(state) {
		if (!state.draftComplete) {
			var activePlayerName = state.activePlayerName;
			if (!activePlayerName) {
				activePlayerName = "Other drafter has been chose to play first. Waiting for them to join.";
			}
			$('#statusActivePlayer').html("Active Player: " + activePlayerName);
			$('#statusCurrentRound').html("Grid: " + state.currentGrid + " of 18");
			$('#statusCurrentTurn').html("Turn: " + state.turn);
		} else {
			$('#statusActivePlayer').hide();
			$('#statusCurrentRound').hide();
			$('#statusCurrentTurn').hide();
		}
		//update active player, turn, and round
	};

	return {
		state: state,
		startDraft: startDraft,
		processDataChange: processDataChange,
		updateStatusMessage: updateStatusMessage,
		isStateUpdated: isStateUpdated
	};
})();