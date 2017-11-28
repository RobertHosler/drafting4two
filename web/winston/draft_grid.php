<?php
include 'draft_state.php';

//this file is called by the winston.js file
$function = $_POST['function'];
$response = array();

function changeRound() {
    //change the round or end the draft
}

function changeTurn() {
    //change the active player or reset turn values for new round
    
}

function addRowToDeck() {
    //Add all cards in a given row to active players deck
    
}

function addColToDeck() {
    //Add all cards in a given column to active players
    
}

switch ($function) {
	case ('pickCol'):
        $draftName = $_POST['draftName'];
        $playerNumber = $_POST['playerNumber'];
        $colNum = $_POST['colNum'];
        $state = getDraftState($draftName);

	    saveDraftFile($state);
	    $publicState = getPublicState($state, $playerNumber);
	    $response['state'] = $publicState;
	    break;
	    
	case ('pickRow'):
        $draftName = $_POST['draftName'];
        $playerNumber = $_POST['playerNumber'];
        $rowNum = $_POST['rowNum'];
        $state = getDraftState($draftName);

	    saveDraftFile($state);
	    $publicState = getPublicState($state, $playerNumber);
	    $response['state'] = $publicState;
	    break;
}

echo json_encode($response); //response encoded as json object

?>