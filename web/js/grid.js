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
	};
	
	var isStateUpdated = function(_state) {
		//determine if state has been updated based on turn, active player, player list size, and round
		return grid.state.players.length != _state.players.length
			|| grid.state.currentTurn != _state.currentTurn
			|| grid.state.round != _state.round
			|| grid.state.currentGrid != _state.currentGrid;
	};
	
	var	processDataChange = function(state) {
		//update grid
		var colSize = 3;
		for (var i = 0; i < colSize; i++) {
			for (var j = 0; j < colSize; j++) {
				var gridSelector = "#grid"+i+j;
				$(gridSelector).html("Loading...");
				var slot = [ state.activeGrid[i][j] ];
				mtg.appendCardImages(gridSelector, slot);
			}
		}
	};
	
	var updateStatusMessage = function(state) {
		//update active player, turn, and round
	};
	
	var pickRow = function(rowNum) {
		//add all cards in a row to active players deck
		
	};
	
	var pickCol = function(colNum) {
		//add all cards in a col to active players deck
		
	};

	return {
		state: state,
		startDraft: startDraft,
		processDataChange: processDataChange,
		updateStatusMessage: updateStatusMessage,
		isStateUpdated: isStateUpdated,
		pickRow: pickRow,
		pickCol: pickCol
	};
})();