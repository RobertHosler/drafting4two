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

function startNewTurn($state) {
    $state['currentPack'][0] = "";
	$state['currentPicks'][1] = 0;
	$state['currentPicks'][2] = 0;
	$state['currentBurns'][1] = 0;
	$state['currentBurns'][2] = 0;
    $state['currentTurn'] = $state['currentTurn'] + 1;
    return $state;
}

function startNewRound($state) {
    $state = startNewTurn($state);
    $state['currentTurn'] = 1;
	$nextRound = $state['round'] + 1;
	$state['round'] = $nextRound;
	$state['currentPack'][1] = ($nextRound * 2) - 1;//1,3,5,7,etc
	$state['currentPack'][2] = $nextRound * 2;//2,4,6,8,etc
	return $state;
}

function endDraft($state, $playerNumber, $packIndex) {
    if ($state['currentPack'][0] == "") {
	    //other pack not yet passed
	    $state['currentPack'][0] = $packIndex;
	    $state['currentPack'][$playerNumber] = 0;
	} else {
        $state = startNewRound($state);
        $state['round'] = 0;
    	$state['currentPack'][1] = 0;
    	$state['currentPack'][2] = 0;
	}
    return $state;
}

function passPack($state, $playerNumber, $packIndex) {
    if ($state['currentPack'][0] == "") {
	    //other pack not yet passed
	    $state['currentPack'][0] = $packIndex;
	    $state['currentPack'][$playerNumber] = 0;
	} else {
	    //swap packs!
	    if ($playerNumber == 1) {
	        $state['currentPack'][1] = $state['currentPack'][0];
    	    $state['currentPack'][2] = $packIndex;
	    } else if ($playerNumber == 2) {
    	    $state['currentPack'][1] = $packIndex;
	        $state['currentPack'][2] = $state['currentPack'][0];
	    }
	    $state = startNewTurn($state);
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
        $state['packs'][$packIndex] = $pack;//set the pack without the card
        
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
	    
	case ('pickCard'):
        $draftName = $_POST['draftName'];
        $playerNumber = $_POST['playerNumber'];
        $cardName = $_POST['cardName'];
        $state = getDraftState($draftName);
        //Remove card from pack and add to players deck
	    
        $packIndex = $state['currentPack'][$playerNumber];
        $pack = $state['packs'][$packIndex];
        $pack = removeCardFromPack($cardName, $pack);
        $state['packs'][$packIndex] = $pack;//set the pack without the card
        $state['decks'][$playerNumber][] = $cardName; //add to decklist
        
        $currentTurn = $state['currentTurn'];
        $picksInTurn = $state['picks'][$currentTurn];
        $burnsInTurn = $state['burns'][$currentTurn];
        $currentPicks = $state['currentPicks'][$playerNumber] + 1;
        $state['currentPicks'][$playerNumber] = $currentPicks;
        $round = $state['round'];

        if ($currentPicks < $picksInTurn) {
        	//make another pick
        	//handle in js
        } else if ($currentTurn < $state['turns']) {
			//last turn, no more picks
			//burn the rest of the pack and open a new pack if both players ready
            $state['packs'][$packIndex] = array();//set an empty array
            if ($round < $state['rounds']) {
                if ($state['currentPack'][0] == "") {
            	    //other pack not yet finished
            	    $state['currentPack'][0] = $packIndex;
            	    $state['currentPack'][$playerNumber] = 0;
                } else {
                    //Begin new round
                    $state = startNewRound($state);
                }
            } else {
		    	//TODO: handle last round
		    	$state = endDraft($state, $playerNumber, $packIndex);
            }
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