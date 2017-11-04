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