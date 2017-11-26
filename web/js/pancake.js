/* global $*/
/* global mtg*/
/* global draft*/
/* global draftName*/
/* global playerNumber*/

/*
State consists of 2 packs passed between two players.

198 Cards
18 packs of 11

9 Rounds
Round order:
Turn 1
Pick 1
Pass 10
Turn 2
Pick 1
Pick 1
Burn 1
Burn 1
Pass 6
Turn 3
Pick 2
Burn 4 (all the remaining)
*/

/**
 * Pancake draft is a draft format module that will be initialized and passed into a draft module.
 */
var pancake = (function() {
    
    var format = "pancake";
    var state;
    var isDraftComplete = false;

	var startDraft = function() {
		
	};
    
    var pickCard = function(cardName) {
        if (!draft.instanse) {
			draft.instanse = true;
			$.ajax({
				type: "POST",
				url: "draft_pancake.php",
				data: {
					'function': 'pickCard',
					'draftName': draftName,
					'playerNumber': playerNumber,
					'cardName': cardName
				},
				dataType: "json",
				success: function(data) {
					pancake.state = data.state;
					draft.processDataChange(data.state);
					draft.instanse = false;
				}
			});
		}
		else {
			setTimeout(pickCard, 100);
		}
    };
    
    var burnCard = function(cardName) {
        if (!draft.instanse) {
			draft.instanse = true;
			$.ajax({
				type: "POST",
				url: "draft_pancake.php",
				data: {
					'function': 'burnCard',
					'draftName': draftName,
					'playerNumber': playerNumber,
					'cardName': cardName
				},
				dataType: "json",
				success: function(data) {
					pancake.state = data.state;
					draft.processDataChange(data.state);
					draft.instanse = false;
				}
			});
		}
		else {
			setTimeout(burnCard, 100);
		}
    };
	
	var isStateUpdated = function(_state) {
		return pancake.state.players.length != _state.players.length
			|| pancake.state.currentTurn != _state.currentTurn
			|| pancake.state.round != _state.round
			|| pancake.state.currentPack[playerNumber] != _state.currentPack[playerNumber];
	};
    
	var	processDataChange = function(state) {
		$(".currentPile").removeClass("burning");
		$(".currentPile").removeClass("picking");
		var picksInTurn = state.picks[state.currentTurn];
		var burnsInTurn = state.burns[state.currentTurn];
        var currentPicks = state.currentPicks[playerNumber];
        var currentBurns = state.currentBurns[playerNumber];
        if (state.round == 0) {
			isDraftComplete = true;
			$("#draftComplete").show();
			$("#currentPileRow").hide();
        } else {
			if (currentPicks < picksInTurn) {
				var pickNum = picksInTurn - currentPicks;
				$(".currentPile").addClass("picking");
				$("#currentPileNumber").html("Pick " + mtg.cardCountString(pickNum));
			} else if (currentBurns < burnsInTurn) {
				var burnNum = burnsInTurn - currentBurns;
				$(".currentPile").addClass("burning");
				$("#currentPileNumber").html("Burn " + mtg.cardCountString(burnNum));
			} else {
				// alert("Error?");
				$("#currentPileNumber").html("Waiting for other player");
			}
        }
        updateStatusMessage(state);
	};
	
	var updateStatusMessage = function(state) {
		if (isDraftComplete) {
			$("#statusCurrentRound").hide();
			$("#statusCurrentTurn").hide();
		} else {
			$("#statusCurrentRound").html("Round: " + state.round);
			$("#statusCurrentTurn").html("Turn: " + state.currentTurn);
		}
	};

	return {
		state: state,
		startDraft: startDraft,
		processDataChange: processDataChange,
		updateStatusMessage: updateStatusMessage,
		isDraftComplete: isDraftComplete,
		isStateUpdated: isStateUpdated,
		burnCard: burnCard,
		pickCard: pickCard
	};
})();