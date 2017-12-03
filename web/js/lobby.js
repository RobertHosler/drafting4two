/* global mtg*/
/* global $ */


$(function() {
	listCubes();
});

function setWinstonDefaults() {
    // $("#numberPacks").val(6);
    // $("#sizePacks").val(15);
    $("#draftDescription").html("Take turns looking through 3 piles of cards refiled with the pool of extra cards.");
}

function setGridDefaults() {
    // $("#numberPacks").val(18);
    // $("#sizePacks").val(9);
    $("#draftDescription").html("Take turns picking a row or column from a grid of 9 cards.");
}

function setWinchesterDefaults() {
    // $("#numberPacks").val(6);
    // $("#sizePacks").val(15);
    $("#draftDescription").html("Take turns picking from one of four piles.  Each turn a card is added to each pile.");
}

function setPancakeDefaults() {
    // $("#numberPacks").val(18);
    // $("#sizePacks").val(11);
    var desc = "<div>9 Rounds of 3 turns</div>";
    desc += "<div>Pack size 11 cards</div>";
    desc += "<div>Turn 1 Each player takes 1 card then passes the pack to the other player.</div>";
    desc += "<div>Turn 2 Each player takes 2 cards then burns 2 and passes back to the other player.</div>";
	desc += "<div>Turn 3 each player takes 2 cards then discards the remaining card.</div>";
	desc += "<div>Each player will draft 45 cards total.</div>";
	$("#draftDescription").html(desc);
}

function setGlimpseDefaults() {
    // $("#numberPacks").val(18);
    // $("#sizePacks").val(11);
    var desc = "<div>9 Rounds of 5 turns</div>";
    desc += "<div>Pack size 15 cards</div>";
    desc += "<div>Each turn each player takes 1 card and then burns 2 cards before passing the pack to the other player.</div>";
	desc += "<div>Each player will draft 45 cards total.</div>";
	$("#draftDescription").html(desc);
}

function setBurnFourDefaults() {
    // $("#numberPacks").val(18);
    // $("#sizePacks").val(11);
    var desc = "<div>12 Rounds of 3 turns</div>";
    desc += "<div>Pack size 15 cards</div>";
    desc += "<div>Each turn each player takes 1 card and then burns 4 cards before passing the pack to the other player.</div>";
	desc += "<div>Each player will draft 36 cards total.</div>";
    $("#draftDescription").html(desc);
}

function setDraftDefaults(dropdown) {
    switch ($(dropdown).val()) {
        case "grid":
            setGridDefaults();
            break;
        case "winston":
        case "winston100":
            setWinstonDefaults();
            break;
        case "winchester":
            setWinchesterDefaults();
            break;
        case "pancake":
            setPancakeDefaults();
            break;
        case "burnfour":
            setBurnFourDefaults();
            break;
        case "glimpse":
            setGlimpseDefaults();
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
			url: "process/draft_process.php",
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
					var joinLink = "draft.php?draftName="+fileName+"&draftType="+state.format+"&cubeName="+state.cubeName;
					if (first) {
						first = false;
					} else {
						draftList += "<hr/>";
					}
					draftList += "<div class=\"row\">";
					draftList += "<div class=\"col-xs-4\"><label>Draft:</label> " + fileName + "</div>";
					// draftList += "<div class=\"columns four\"><label>Players:</label> "  + state.players.length + "</div>";
					draftList += "<div class=\"col-xs-4\"><label>Format:</label> "  + state.format + "</div>";
					draftList += "<div class=\"col-xs-4\"><a href=\""+joinLink+"\">Join</a></div></div>";
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
			url: "process/draft_process.php",
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

function listCubes() {
	"use strict";
	if (!instanse) {
		instanse = true;
		$.ajax({
			type: "POST",
			url: "process/draft_process.php",
			data: {
				'function': 'listCubes'
			},
			dataType: "json",
			success: function (data) {
				$.each(data.cubes, function(index, cube){
					var cubeName = cube.substr(0, cube.lastIndexOf('.'));//remove txt
					$('#cubeLists').append($('<option>', {
					    value: cubeName,
					    text: cubeName
					}));
				});
				instanse = false;
			}
		});
	} else {
		setTimeout(function() {
			listCubes();
		}, 100);
	}
}

function addCubeList() {
	"use strict";
	if (!instanse) {
		instanse = true;
		var cubeName = $("#cubeName").val();
		var cubeList = $("#cubeList").val();
		$.ajax({
			type: "POST",
			url: "process/draft_process.php",
			data: {
				'function': 'addCubeList',
				'cubeName': cubeName,
				'cubeList': cubeList
			},
			dataType: "json",
			success: function (data) {
				$.each(data.cubes, function(index, cube) {
					var cubeName = cube.substr(0, cube.lastIndexOf('.'));//remove txt
					$('#cubeLists').append($('<option>', {
					    value: cubeName,
					    text: cubeName
					}));
				});
				var cubeList = data.cubeList;
				instanse = false;
			}
		});
	} else {
		setTimeout(function() {
			addCubeList();
		}, 100);
	}
}

function populateSortedList() {
	if (!instanse) {
		instanse = true;
		$("#sortedCube").html("Loading...");
		var cubeName = $("#cubeLists").val();
		$.ajax({
			type: "POST",
			url: "process/draft_process.php",
			data: {
				'function': 'retrieveCubeList',
				'cubeName': cubeName
			},
			dataType: "json",
			success: function (data) {
				$("#sortedCube").html("");
				mtg.appendSortedCardNames("#sortedCube", data.cubeList);
				instanse = false;
			}
		});
	} else {
		setTimeout(function() {
			populateSortedList();
		}, 100);
	}
}