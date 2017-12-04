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
var yourDraftsOnly = true;

function listDrafts() {
	"use strict";
	if (!instanse) {
		instanse = true;
		var loading = "<div class=\"row\">Loading...</div>";
		$("#draftList").html(loading);
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
					if (yourDraftsOnly && jQuery.inArray(username, state.players) === -1) {
						return;
					} else if (openDraftsOnly && state.players.length > 1) {
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
					draftList += "<div class=\"col-xs-4\"><label>Draft:</label> " + fileName + "<br/><label>Format:</label> "  + state.format + "</div>";
					draftList += "<div class=\"col-xs-4\"><label>Players:</label> ";
					$.each(state.players, function(n, player) {
						draftList += "<br/>" + player;
					});
					draftList += "</div>";
					draftList += "<div class=\"col-xs-4\"><a href=\""+joinLink+"\" class=\"btn btn-default\">Join</a></div></div>";
				});
				$("#draftList").append(draftList);
				if (lobbyEmpty) {
					draftList += "<div class=\"row\">";
					draftList += "No open drafts";
					draftList += "</div>";
					$("#draftList").append(draftList);
				}
				instanse = false;
			}
		});
	}
}

function showAllDrafts() {
	openDraftsOnly = false;
	yourDraftsOnly = false;
	$("#allDrafts").addClass("active");
	$("#openDrafts").removeClass("active");
	$("#yourDrafts").removeClass("active");
	listDrafts();
}

function showOpenDrafts() {
	openDraftsOnly = true;
	yourDraftsOnly = false;
	$("#openDrafts").addClass("active");
	$("#allDrafts").removeClass("active");
	$("#yourDrafts").removeClass("active");
	listDrafts();
}

function showYourDrafts() {
	openDraftsOnly = false;
	yourDraftsOnly = true;
	$("#yourDrafts").addClass("active");
	$("#openDrafts").removeClass("active");
	$("#allDrafts").removeClass("active");
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
		waitingDialog.show("Adding " + cubeName);
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
				waitingDialog.hide();
				window.location = "viewcube.php?cube="+cubeName;
				instanse = false;
			}
		});
	} else {
		setTimeout(function() {
			addCubeList();
		}, 100);
	}
}

function populateInitialSortedList() {
	var cubeName = $.urlParam('cube');
	populateSortedList(cubeName);
}

function populateSortedList(cube) {
	if (!instanse) {
		instanse = true;
		$("#sortedCube").html("Loading...");
		var cubeName = cube ? cube : $("#cubeLists").val();
		$("#cubeLists").val(cubeName);
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
			populateSortedList(cube);
		}, 100);
	}
}

/**
 * Module for displaying "Waiting for..." dialog using Bootstrap
 *
 * @author Eugene Maslovich <ehpc@em42.ru>
 */

var waitingDialog = waitingDialog || (function ($) {
    'use strict';

	// Creating modal dialog's DOM
	var $dialog = $(
		'<div class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-hidden="true" style="padding-top:15%; overflow-y:visible;">' +
		'<div class="modal-dialog modal-m">' +
		'<div class="modal-content">' +
			'<div class="modal-header"><h3 style="margin:0;"></h3></div>' +
			'<div class="modal-body">' +
				'<div class="progress progress-striped active" style="margin-bottom:0;"><div class="progress-bar" style="width: 100%"></div></div>' +
			'</div>' +
		'</div></div></div>');

	return {
		/**
		 * Opens our dialog
		 * @param message Custom message
		 * @param options Custom options:
		 * 				  options.dialogSize - bootstrap postfix for dialog size, e.g. "sm", "m";
		 * 				  options.progressType - bootstrap postfix for progress bar type, e.g. "success", "warning".
		 */
		show: function (message, options) {
			// Assigning defaults
			if (typeof options === 'undefined') {
				options = {};
			}
			if (typeof message === 'undefined') {
				message = 'Loading';
			}
			var settings = $.extend({
				dialogSize: 'm',
				progressType: '',
				onHide: null // This callback runs after the dialog was hidden
			}, options);

			// Configuring dialog
			$dialog.find('.modal-dialog').attr('class', 'modal-dialog').addClass('modal-' + settings.dialogSize);
			$dialog.find('.progress-bar').attr('class', 'progress-bar');
			if (settings.progressType) {
				$dialog.find('.progress-bar').addClass('progress-bar-' + settings.progressType);
			}
			$dialog.find('h3').text(message);
			// Adding callbacks
			if (typeof settings.onHide === 'function') {
				$dialog.off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
					settings.onHide.call($dialog);
				});
			}
			// Opening dialog
			$dialog.modal();
		},
		/**
		 * Closes dialog
		 */
		hide: function () {
			$dialog.modal('hide');
		}
	};

})(jQuery);
