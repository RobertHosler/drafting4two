var instanse = false;

var openDraftsOnly = true;

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
				var draftList = "";
				var first = true;
				$.each(data.states, function(index, state){
					if (openDraftsOnly && state.players.length > 1) {
						return;
					}
					lobbyEmpty = false;
					var fileName = state.fileName;
					var draftName = fileName.substr(0, fileName.lastIndexOf('.'));
					var joinLink = "winston.php?draftName="+draftName;
					if (first) {
						first = false;
					} else {
						draftList += "<hr/>";
					}
					draftList += "<div class=\"row\"><div class=\"columns four\">";
					draftList += "Draft: " + draftName + "</div><div class=\"columns four\">";
					draftList += "Players: "  + state.players.length + "</div><div class=\"columns four\">";
					draftList += "<a href=\""+joinLink+"\">Join</a></div></div>";
				});
				$("#draftList").append(draftList);
				if (lobbyEmpty) {
					$("#draftList").append("No open drafts");
				}
				instanse = false;
			}
		});
	}
}

function showAllDrafts() {
	openDraftsOnly = false;
	listDrafts();
}

function showOpenDrafts() {
	openDraftsOnly = true;
	listDrafts();
}

function clearCreateForm() {
	// $("#createDraftForm").reset();
	var frm = document.getElementsByName('createDraftForm')[0];
	var isFieldBlank = false;
	$.each($("#"+frm.id+"> select"), function(index, item) {
		if (!$(item).val()) {
			// field blank
			isFieldBlank = true;
		}
	});
	if (isFieldBlank) {
		alert("Required Fields are blank!");
		return false;
	} else {
		frm.submit();
		frm.reset();
		return false;
	}
}