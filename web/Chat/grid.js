
function startGridDraft() {
	draftName = $.urlParam('draftName');
	cubeName = $.urlParam('cubeName');
	playerName = $.urlParam('playerName');
	while (!playerName) {
		playerName = prompt("Please enter your name", "");
	}
	$("#welcomeMessage").html("<h2>Hello, " + playerName + "</h2>");//empty span
	$("#welcomeMessage").append("<p>Draft: " + draftName + "</p>");
	//alert(draftName);
	"use strict";
	if (!instanse) {
		instanse = true;
		$.ajax({
			type: "POST",
			url: "grid_draft_process.php",
			data: {
				'function': 'startDraft',
				'draftName': draftName,
				'cubeName': cubeName,
				'playerName': playerName
			},
			dataType: "json",
			success: function (data) {
				state = data.state;
				playerNumber = data.playerNumber;
				changeTime = data.changeTime;
				//TODO: 
				processDataChange(state);
				//updateAllPiles();
				//updateCurrentPile();
				$("#welcomeMessage").append("<p>Player Number: " + (playerNumber) + "</p>");
				instanse = false;
			}
		});
	}
	setInterval(updateDraft, 1000);
}