<?php
include 'draft_state.php';

//this file is called by the winston.js file
$function = $_POST['function'];
$response = array();

function changeTurn($state, $playerNumber) {
    //change the active player or reset turn values for new round
    if ($state['turn'] == 1) {
        $state['turn'] = 2;
		$state['activePlayer'] = ($player == 1) ? 2 : 1;
    } else if ($state['turn'] == 2) {
        //active player stays the same since players take turns going first in a round
        if ($state['currentGrid'] == $state['numGrids']) {
            $state['draftComplete'] = true;
        } else {
            $state['turn'] = 1;
            $state['currentGrid'] = $state['currentGrid'] + 1;
        }
    }
    return $state;
}

function addRowToDeck($state, $playerNumber, $rowNum) {
    //Add all cards in a given row to active players deck
    $colSize = $state['colSize'];
    $cards = array();
    for ($i = 0; $i < $colSize; $i++) {
        $card = $state['grids'][$currentGrid][$i][$rowNum];
        if ($card != "") {//ignore if empty slot
            $state['decks'][$playerNumber][] = $card;//add card
            $state['grids'][$currentGrid][$i][$rowNum] = "";//clear card from grid
        }
    }
    return $state;
}

function addColToDeck($state, $playerNumber, $colNum) {
    //Add all cards in a given column to active players
    $colSize = $state['colSize'];
    $cards = array();
    for ($i = 0; $i < $colSize; $i++) {
        $card = $state['grids'][$currentGrid][$colNum][$i];
        if ($card != "") {//ignore if empty slot
            $state['decks'][$playerNumber][] = $card;//add card to decklist
            $state['grids'][$currentGrid][$colNum][$i] = "";//clear card from grid
        }
    }
    return $state;
}

switch ($function) {
	case ('pickCol'):
        $draftName = $_POST['draftName'];
        $playerNumber = $_POST['playerNumber'];
        $colNum = $_POST['colNum'];
        $state = getDraftState($draftName);
        $state = addColToDeck($state, $playerNumber, $colNum);
        $state = changeTurn($state, $playerNumber);
	    saveDraftFile($state);
	    $publicState = getPublicState($state, $playerNumber);
	    $response['state'] = $publicState;
	    break;
	    
	case ('pickRow'):
        $draftName = $_POST['draftName'];
        $playerNumber = $_POST['playerNumber'];
        $rowNum = $_POST['rowNum'];
        $state = getDraftState($draftName);
        $state = addRowToDeck($state, $playerNumber, $rowNum);
        $state = changeTurn($state, $playerNumber);
	    saveDraftFile($state);
	    $publicState = getPublicState($state, $playerNumber);
	    $response['state'] = $publicState;
	    break;
}

echo json_encode($response); //response encoded as json object

?>