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