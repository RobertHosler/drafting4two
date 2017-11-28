/* global $*/
/* global mtg*/
/* global draft*/
/* global draftName*/
/* global playerNumber*/

var grid = (function() {
    
    var state;

	var startDraft = function() {
		//show grid
		$("#grid").show();
		//hide pile
		$("#currentPileRow").hide();
		$('#statusActivePlayer').show();
		$('#opponentPoolRow').show();
	};
	
	var isStateUpdated = function(_state) {
		//determine if state has been updated based on turn, active player, player list size, and round
		return grid.state.players.length != _state.players.length
			|| grid.state.turn != _state.turn
			|| grid.state.currentGrid != _state.currentGrid
			|| grid.state.draftComplete != _state.draftComplete;
	};
	
	var	processDataChange = function(state) {
		if (state.draftComplete) {
			$("#grid").hide();
			$("#draftComplete").show();
		} else {
			//update grid
			var colSize = 3;
			for (var i = 0; i < colSize; i++) {
				for (var j = 0; j < colSize; j++) {
					var gridSelector = "#grid"+i+j;
					var card = state.activeGrid[i][j];
					if (card != "") {
						$(gridSelector).html("Loading... " + card);
						var slot = [ card ];
						mtg.appendCardImages(gridSelector, slot);
					} else {
						$(gridSelector).html("");
						$(gridSelector).append($("<img class=\"magicCard\" src=\"/images/Magic_the_gathering-card_back.jpg\">"));
					}
				}
			}
			updateActivePlayer(state);
		}
		updateStatusMessage(state);
	};
	
	var updateActivePlayer = function(state) {
		if (!state.draftComplete && state.isActivePlayer && state.players.length > 1) {
			//enable buttons
			$('.gridButton').removeAttr('disabled');
			$('#statusCurrentGridNumber').html(state.currentGrid);
		}
		else {
			//disable buttons
			$('.gridButton').attr('disabled', 'disabled');
		}
	}
	
	var updateStatusMessage = function(state) {
		if (!state.draftComplete) {
			$('#statusActivePlayer').html("Active Player: " + state.activePlayerName);
			$('#statusCurrentRound').html("Grid: " + state.currentGrid + " of 18");
			$('#statusCurrentTurn').html("Turn: " + state.turn);
		} else {
			$('#statusActivePlayer').hide();
			$('#statusCurrentRound').hide();
			$('#statusCurrentTurn').hide();
		}
		//update active player, turn, and round
	};
	
	var takeRow = function(rowNum) {
		$('.gridButton').attr('disabled', 'disabled');
		//add all cards in a row to active players deck
		if (!draft.instanse) {
			draft.instanse = true;
			var row = rowNum;
			$.ajax({
				type: "POST",
				url: "draft_grid.php",
				data: {
					'function': 'pickRow',
					'draftName': draftName,
					'playerNumber': playerNumber,
					'rowNum': row
				},
				dataType: "json",
				success: function(data) {
					grid.state = data.state;
					processDataChange(data.state);
					draft.processDataChange(data.state);
					draft.instanse = false;
				}
			});
		}
		else {
			setTimeout(function() {
				takeRow(rowNum);
			}, 100);
		}
	};
	
	var takeCol = function(colNum) {
		$('.gridButton').attr('disabled', 'disabled');
		//add all cards in a col to active players deck
		if (!draft.instanse) {
			draft.instanse = true;
			var column = colNum;
			$.ajax({
				type: "POST",
				url: "draft_grid.php",
				data: {
					'function': 'pickCol',
					'draftName': draftName,
					'playerNumber': playerNumber,
					'colNum': column
				},
				dataType: "json",
				success: function(data) {
					grid.state = data.state;
					processDataChange(data.state);
					draft.processDataChange(data.state);
					draft.instanse = false;
				}
			});
		}
		else {
			setTimeout(function() {
				takeCol(colNum);
			}, 100);
		}
	};

	return {
		state: state,
		startDraft: startDraft,
		processDataChange: processDataChange,
		updateStatusMessage: updateStatusMessage,
		isStateUpdated: isStateUpdated,
		takeRow: takeRow,
		takeCol: takeCol
	};
})();