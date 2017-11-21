/* global $*/
/* global mtg*/
/* global draft*/

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
    
    var makePick = function(cardName) {
        if (!draft.instanse) {
			draft.instanse = true;
			$.ajax({
				type: "POST",
				url: "draft_winston.php",
				data: {
					'function': 'makePick',
					'draftName': draftName,
					'playerNumber': playerNumber,
					'cardName': cardName
				},
				dataType: "json",
				success: function(data) {
					this.state = data.state;
					processDataChange(data.state);
					draft.processDataChange(data.state);
					draft.instanse = false;
				}
			});
		}
		else {
			setTimeout(makePick, 100);
		}
    };
    
    var burnPick = function(cardName) {
        if (!draft.instanse) {
			draft.instanse = true;
			$.ajax({
				type: "POST",
				url: "draft_winston.php",
				data: {
					'function': 'burnPick',
					'draftName': draftName,
					'playerNumber': playerNumber,
					'cardName': cardName
				},
				dataType: "json",
				success: function(data) {
					this.state = data.state;
					processDataChange(data.state);
					draft.processDataChange(data.state);
					draft.instanse = false;
				}
			});
		}
		else {
			setTimeout(burnPick, 100);
		}
    };
	
	var isStateUpdated = function(_state) {
		return this.state.players.length != _state.players.length;
	};
    
	var	processDataChange = function(state) {
			// isDraftComplete = true;
			// $("#draftComplete").show();
			// $("#topButtons").hide();
			// $("#buttonRow").hide();
			// $("#currentPileRow").hide();
	};

	return {
		startDraft: startDraft,
		processDataChange: processDataChange,
		isDraftComplete: isDraftComplete,
		isStateUpdated: isStateUpdated,
		burnPick: burnPick,
		makePick: makePick
	};
})();