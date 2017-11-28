/* global $*/
/* global mtg*/
/* global draft*/
/* global draftName*/
/* global playerNumber*/

var grid = (function() {
    
    var state;

	var startDraft = function() {
		//show grid
		//hide pile
	};
	
	var isStateUpdated = function(_state) {
		//determine if state has been updated based on turn, active player, player list size, and round
	};
	
	var	processDataChange = function(state) {
		//update grid
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