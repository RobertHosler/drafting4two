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

function passPack($state, $playerNumber, $packIndex) {
    if ($state['currentPack'][0] == "") {
	    //other pack not yet passed
	    $state['currentPack'][0] = $pack;
	} else {
	    //swap packs!
	    if ($playerNumber == 1) {
	        $state['currentPack'][1] = $state['currentPack'][0];
    	    $state['currentPack'][2] = $pack;
	    } else if ($playerNumber == 2) {
    	    $state['currentPack'][1] = $pack;
	        $state['currentPack'][2] = $state['currentPack'][0];
	    }
	    $state['currentPack'][0] = "";
    	$state['currentPicks'][1] = 0;
    	$state['currentPicks'][2] = 0;
    	$state['currentBurns'][1] = 0;
    	$state['currentBurns'][2] = 0;
	}
    return $state;	
}

switch ($function) {
	case ('burnCard'):
	    $draftName = $_POST['draftName'];
	    $playerNumber = $_POST['playerNumber'];
        $cardName = $_POST['cardName'];
	    $state = getDraftState($draftName);
	    //Remove card from pack
	    
        $packIndex = $state['currentPack'][$playerNumber];
        $pack = $state['packs'][$packIndex];
        $pack = removeCardFromPack($cardName, $pack);
        $state['currentPack'][$playerNumber] = $pack; //set the pack without the card
        
        $currentTurn = $state['currentTurn'];
        $burnsInTurn = $state['burns'][$currentTurn];
        $currentBurns = $state['currentBurns'][$playerNumber] + 1;
        $state['currentBurns'][$playerNumber] = $currentBurns;
        $round = $state['round'];

        if ($currentBurns < $burnsInTurn) {
        	//make another burn choice
        	//handle in js
        } else {
        	$state = passPack($state, $playerNumber, $packIndex);
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
	    
        $packIndex = $state['currentPack'][$playerNumber];
        $pack = $state['packs'][$packIndex];
        $pack = removeCardFromPack($cardName, $pack);
        $state['currentPack'][$playerNumber] = $pack; //set the pack without the card
        $state['decks'][$playerNumber][] = $cardName; //add to decklist
        
        $currentTurn = $state['currentTurn'];
        $picksInTurn = $state['picks'][$currentTurn];
        $burnsInTurn = $state['burns'][$currentTurn];
        $currentPicks = $state['currentPicks'][$playerNumber] + 1;
        $state['currentPicks'][$playerNumber] = $currentPicks;
        $picksInTurn = $state['picks'][$currentTurn];
        $round = $state['round'];

        if ($currentPicks < $picksInTurn) {
        	//make another pick
        	//handle in js
        } else if ($currentTurn == 3) {
			//last turn, no more picks
			//burn the rest of the pack and open a new pack
			$nextRound = $round + 1;
        	if ($playerNumber == 1) {
	        	$packIndex = ($nextRound * 2) - 1;//1,3,5,7,etc
        	} else if ($playerNumber == 2) {
 		       	$packIndex = $nextRound * 2;//2,4,6,8,etc
        	}
        	$state['currentPack'][$playerNumber] = $packIndex;
        } else if ($burnsInTurn > 0) {
          //switch to burning
          //handle in js
        } else {
        	$state = passPack($state, $playerNumber, $packIndex);
        }

	    saveDraftFile($state);
	    $publicState = getPublicState($state, $playerNumber);
	    $response['state'] = $publicState;
	    break;
}

echo json_encode($response); //response encoded as json object

?>