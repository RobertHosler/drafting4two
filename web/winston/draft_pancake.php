<?php
include 'draft_state.php';

//this file is called by the winston.js file
$function = $_POST['function'];
$response = array();

function removeCardFromPack($cardName, $pack) {
    $key = array_search($cardName, $pack); //find card key
    if ($key !== false) {
        unset($pack[$key]);//remove card
    } else {
    	//TODO: handle?
    }
    $pack = array_values($pack); //reindex the array so it will be interpretted as an array by javascript
    return $pack;
}

switch ($function) {
	case ('burnCard'):
	    $draftName = $_POST['draftName'];
	    $playerNumber = $_POST['playerNumber'];
        $cardName = $_POST['cardName'];
	    $state = getDraftState($draftName);
	    //Remove card from pack
	    
        $pack = $state['packs'][$playerNumber];
	    $pack = removeCardFromPack($cardName, $pack);
        $state['packs'][$playerNumber] = $pack; //set the pack without the card
        
        if ($pack.length) {
        	$state.
        }
	    
	    saveDraftFile($state);
	    $publicState = getPublicState($state, $playerNumber);
	    $response['state'] = $publicState;
	    break;
	    
	case ('makePick'):
	    $draftName = $_POST['draftName'];
	    $playerNumber = $_POST['playerNumber'];
	    $state = getDraftState($draftName);
	    //Remove card from pack and add to players deck
	    
        $pack = $state['packs'][$playerNumber];
	    $pack = removeCardFromPack($cardName, $pack);
        $state['packs'][$playerNumber] = $pack; //set the pack without the card
        $state['decks'][$playerNumber][] = $cardName; //add to decklist
        
        $turn = $state['currentTurn'];
        switch ($turn) {
        	case 1:
        		
        		break;
        	case 2:
        		
        		break;
        	case 3:
        		
        		break;
        }
		$state['picks'][$turn];
		$state['burns'][$turn];
		$state['currentPicks'][$playerNumber];

	    saveDraftFile($state);
	    $publicState = getPublicState($state, $playerNumber);
	    $response['state'] = $publicState;
	    break;
}

echo json_encode($response); //response encoded as json object

?>