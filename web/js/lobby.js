function setWinstonDefaults() {
    $("#numberPacks").val(6);
    $("#sizePacks").val(15);
    $("#draftDescription").html("Take turns looking through 3 piles of cards refiled with the pool of extra cards.");
}

function setGridDefaults() {
    $("#numberPacks").val(18);
    $("#sizePacks").val(9);
    $("#draftDescription").html("Take turns picking a row or column from a grid of 9 cards.");
}

function setWinchesterDefaults() {
    $("#numberPacks").val(6);
    $("#sizePacks").val(15);
    $("#draftDescription").html("Take turns picking from one of four piles.  Each turn a card is added to each pile.");
}

function setDraftDefaults(dropdown) {
    switch ($(dropdown).val()) {
        case "grid":
            setGridDefaults();
            break;
        case "winston":
            setWinstonDefaults();
            break;
        case "winchester":
            setWinchesterDefaults();
            break;
        default:
            alert("Draft Selection Error");
    }
}

var instanse = false;

function listDrafts() {
	"use strict";
	if (!instanse) {
		instanse = true;
		$.ajax({
			type: "POST",
			url: "draft_process.php",
			data: {
				'function': 'listDrafts'
			},
			dataType: "json",
			success: function (data) {
				$("#draftList").html("");
				var lobbyEmpty = true;
				$.each(data.states, function(index, state){
					if (state.players.length < 2) {
						lobbyEmpty = false;
						var fileName = state.fileName;
						var draftName = fileName.substr(0, fileName.lastIndexOf('.'));
						var joinLink = "winston.php?draftName="+draftName;
						$("#draftList").append("<p>Draft: " + draftName + "<br/>Players: "  + state.players.length + "<br/><a href=\""+joinLink+"\">Join</a></p>");
					}
				});
				if (lobbyEmpty) {
					$("#draftList").append("No open drafts");
				}
				instanse = false;
			}
		});
	}
}