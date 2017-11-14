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
					var joinLink = "winston.php?draftName="+fileName;
					if (first) {
						first = false;
					} else {
						draftList += "<hr/>";
					}
					draftList += "<div class=\"row\"><div class=\"columns four\">";
					draftList += "Draft: " + fileName + "</div><div class=\"columns four\">";
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

function deleteAllDrafts() {
	var password = prompt("Password", "");
	if (!instanse) {
		instanse = true;
		$.ajax({
			type: "POST",
			url: "draft_process.php",
			data: {
				'function': 'deleteDrafts',
				'password': password
			},
			dataType: "json",
			success: function(data) {
				instanse = false;
				if (data.passwordValid) {
					listDrafts();
				} else {
					alert("Password invalid");
				}
			}
		});
	}
}