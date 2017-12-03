<?php
include 'draft_state.php';

//this file is called by the winston.js file
$function = $_POST['function'];
$response = array();

/**
 * Add list of cards to the given array
 */
function addPileToDeckList($pile, $deckList) {
    foreach ($pile as $card) {
        //array_push($deckList, $card);
        $deckList[] = $card;//add card to decklist
    }
    return $deckList;
}

function passWinstonPile($state) {
	$topCard = isset($state['piles'][0]) ? array_pop($state['piles'][0]) : null;
	$pileNum = $state['currentPile'];
	$player = $state['activePlayer'];
	$deck = isset($state['decks'][$player]) ? $state['decks'][$player] : array();
		
	switch ($pileNum) {
		case 3:
			if ($topCard == null) {
				//this pile must be taken, no cards left in main
				$pile = $state['piles'][3];
				$state['decks'][$player] = addPileToDeckList($pile, $deck);
				$state['piles'][$pileNum] = array();//empty pile
			} else {
				//add top of main pile to deck
				$state['decks'][$player][] = $topCard;
				//add top of main pile to pile 3 if there is another card...
				$topCard = isset($state['piles'][0]) ? array_pop($state['piles'][0]) : null;
				if ($topCard != null) {
					//add top of main pile to pile
					$state['piles'][3][] = $topCard;
				}
			}
			
			//change currentPile until it isn't empty
			$currentPile = 1;
			while ($currentPile <= 3) {
				if (empty($state['piles'][$currentPile])) {
					//continue to increment until pile isn't empty
					$currentPile++;
				} else {
					break;
				}
			}
			$state['currentPile'] = $currentPile;
			//change the active player
			$state['activePlayer'] = ($player == 1) ? 2 : 1;
			break;
		default:
			//add to pile
			if ($topCard != null) {
				//add top card to current pile
				array_push($state['piles'][$pileNum], $topCard);
			}
			//change currentPile
			$currentPile = $pileNum + 1;
			while ($currentPile <= 3) {
				if (empty($state['piles'][$currentPile])) {
					//continue to increment until pile isn't empty
					$currentPile++;
				} else {
					break;
				}
			}
			$state['currentPile'] = $currentPile;
	}
	return $state;
}

switch ($function) {
	case ('passPile'):
	    $draftName = $_POST['draftName'];
	    $playerNumber = $_POST['playerNumber'];
	    $currentPile = $_POST['currentPile'];
	    $state = getDraftState($draftName);
	    if ($state['activePlayer'] != $playerNumber) {
	    	error_log("Can't pass, not active player");
	    } else if ($state['currentPile'] != $currentPile) {
	    	error_log("Can't pass, current pile is inconsistent. CurrentPile: ".$currentPile." StatePile: ".$state['currentPile']);
	    } else {
	        $state = passWinstonPile($state);
	        saveDraftFile($state);
	    }
	    $publicState = getPublicState($state, $playerNumber);
	    // $publicState['recentlyDrafted'] = $pile;
	    $response['state'] = $publicState;
	    break;
	    
	case ('takePile'):
	    $draftName = $_POST['draftName'];
	    $playerNumber = $_POST['playerNumber'];
	    $state = getDraftState($draftName);
	    
	    if ($state['activePlayer'] != $playerNumber) {
	    	error_log("Can't take, not the active player!");
	    } else {
		    //pop card off of current deck for setting to the pile taken
		    $topCard = isset($state['piles'][0]) ? array_pop($state['piles'][0]) : null;
		    //determine current pile
		    $pileNum = $state['currentPile'];
		    $player = $state['activePlayer'];
		    $pile = $state['piles'][$pileNum];
		    $deck = isset($state['decks'][$player]) ? $state['decks'][$player] : array();
		    $newPile;
		    if ($topCard != null) {
		        $newPile = array(
		            $topCard
		        );
		        //reset pile
		        $state['piles'][$pileNum] = $newPile;
		    } else {
		        //if no top card, pile should be set to an empty array
		        //$newPile = array();
		        unset($state['piles'][$pileNum]);
		    }
		    
		    //add pile to decklist
		    $state['decks'][$player] = addPileToDeckList($pile, $deck);
		    
		    //set current pile
		    if (isset($state['piles'][1])) {
		        $state['currentPile'] = 1;
		    } else if (isset($state['piles'][2])) {
		        $state['currentPile'] = 2;
		    } else if (isset($state['piles'][3])) {
		        $state['currentPile'] = 3;
		    } else {
		        $state['currentPile'] = 0;
		    	$state['draftComplete'] = true;
		    }
		    
		    //change the active player
		    $state['activePlayer'] = ($state['activePlayer'] == 1) ? 2 : 1;
		    
	    }
	    
	    //encode the state as json and write to file
	    saveDraftFile($state);
	    $publicState = getPublicState($state, $playerNumber);
	    $publicState['recentlyDrafted'] = $pile;
	    $response['state'] = $publicState;
	    break;
}

echo json_encode($response); //response encoded as json object

?>