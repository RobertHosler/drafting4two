<?php
include 'draft_state.php';
include 'draft_winston.php';

//this file is called by the draft.js file
$function = $_POST['function'];
$response = array();

/**
 * Unused
 */
function make_unique($full_path) {
    $file_name = basename($full_path);
    $directory = dirname($full_path) . DIRECTORY_SEPARATOR;
    
    $i = 2;
    while (file_exists($directory . $file_name)) {
        $parts = explode('.', $file_name);
        // Remove any numbers in brackets in the file name
        $parts[0] = preg_replace('/\(([0-9]*)\)$/', '', $parts[0]);
        $parts[0] .= '(' . $i . ')';
        
        $new_file_name = implode('.', $parts);
        if (!file_exists($new_file_name)) {
            $file_name = $new_file_name;
        }
        $i++;
    }
    return $directory . $file_name;
}

function startDraft() {
    $response = array();
    $cubeName = $_POST['cubeName'];
    $draftName = $_POST['draftName'];
    $draftType = $_POST['draftType'];
    $fileName = $_POST['fileName'];
    $playerName = $_POST['playerName'];
    $state = getDraftState($draftName);
    if ($state == null) {
        //Create new state
        $state = initState($draftName, $cubeName);
    }
    $state['players'] = joinDraft($state['players'], $playerName);
    $playerNumber = getPlayerNumber($state['players'], $playerName);
    saveDraftFile($state);
    $response['state'] = getPublicState($state, $playerNumber); //sends the state object back
    $response['playerNumber'] = $playerNumber;
    return $response;
}

function restartDraft() {
    $response = array();
    $cubeName = $_POST['cubeName'];
    $draftName = $_POST['draftName'];
    $draftType = $_POST['draftType'];
    $fileName = $_POST['fileName'];
    $playerName = $_POST['playerName'];
    //Create new state
    $state = initState($draftName, $cubeName);
    $state['players'] = joinDraft($state['players'], $playerName);
    $playerNumber = getPlayerNumber($state['players'], $playerName);
    saveDraftFile($state);
    $response['state'] = getPublicState($state, $playerNumber); //sends the state object back
    $response['playerNumber'] = $playerNumber;
    return $response;
}

switch ($function) {
    case ('startDraft'):
        $response = startDraft();
        break;
        
    case ('restartDraft'):
        $response = restartDraft();
        break;
    
    case ('update'):
        $draftName = $_POST['draftName'];
        $playerNumber = $_POST['playerNumber'];
        $state = getDraftState($draftName);
        $response['state'] = getPublicState($state, $playerNumber); //decode into an object
        break;
    
    case ('takePile'):
        $draftName = $_POST['draftName'];
        $playerNumber = $_POST['playerNumber'];
        $state = getDraftState($draftName);
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
        } else {
            $state['currentPile'] = 3;
        }
        
        //change the active player
        $state['activePlayer'] = ($state['activePlayer'] == 1) ? 2 : 1;
        
        //encode the state as json and write to file
        saveDraftFile($state);
        $publicState = getPublicState($state, $playerNumber);
        $publicState['recentlyDrafted'] = $pile;
        $response['state'] = $publicState;
        break;
    
    case ('passPile'):
        $draftName = $_POST['draftName'];
        $playerNumber = $_POST['playerNumber'];
        $state = getDraftState($draftName);
        if ($state['activePlayer'] == $playerNumber) {
            $previousTs = draftLastChange($draftName);
            $state = passWinstonPile($state);
            saveDraftFile($state);
        }
        $publicState = getPublicState($state, $playerNumber);
        $publicState['recentlyDrafted'] = $pile;
        $response['state'] = $publicState;
        break;
    
    case ('saveDeck'):
        $draftName = $_POST['draftName'];
        $state = getDraftState($draftName);
        $playerNumber = $_POST['playerNumber'];
        $deckFileName = $_POST['deckFileName'];
        $deck = isset($state['decks'][$playerNumber]) ? $state['decks'][$playerNumber] : array();
        $sideboard = isset($state['sideboard'][$playerNumber]) ? $state['sideboard'][$playerNumber] : array();
        saveDeckAndSideboardToFile($deck, $sideboard, $deckFileName);
        break;
    
    case ('listDrafts'):
        $allFiles = retrieveAllDrafts();
        $drafts = array_diff($allFiles, array(
            '.',
            '..',
            '.gitignore'
        ));
        $states = array();
        foreach ($drafts as $draft) {
            $state = retrieveDraftFile($draft);
            $states[] = $state;
        }
        $response['drafts'] = $drafts;
        $response['states'] = $states;
        break;
    
    case ('moveToSideboard'):
        $draftName = $_POST['draftName'];
        $state = getDraftState($draftName);
        $cardName = $_POST['cardName'];
        $playerNumber = $_POST['playerNumber'];
        $deckList = $state['decks'][$playerNumber];
        $key = array_search($cardName, $deckList); //find card key
        if ($key !== false) {
            unset($deckList[$key]);
        } //remove card
        $deckList = array_values($deckList); //resort the array so it will be interpretted as an array by javascript
        $state['decks'][$playerNumber] = $deckList; //set the list
        $state['sideboard'][$playerNumber][] = $cardName; //add to sideboard
        saveDraftFile($state);
        $response['state'] = getPublicState($state, $playerNumber);
        break;
    
    case ('moveToDeck'):
        $draftName = $_POST['draftName'];
        $state = getDraftState($draftName);
        $cardName = $_POST['cardName'];
        $playerNumber = $_POST['playerNumber'];
        $sideboard = $state['sideboard'][$playerNumber];
        $key = array_search($cardName, $sideboard); //find card key
        if ($key !== false) {
            unset($sideboard[$key]);
        } //remove card
        $sideboard = array_values($sideboard); //reindex the array so it will be interpretted as an array by javascript
        $state['sideboard'][$playerNumber] = $sideboard; //set the sideboard without the card
        $state['decks'][$playerNumber][] = $cardName; //add to decklist
        saveDraftFile($state);
        $response['state'] = getPublicState($state, $playerNumber);
        break;
    
    case ('deleteDrafts'):
        //TODO: delete all drafts from the winston/drafts folder - ability to change which drafts are being deleted?  Move drafts folder to web so its web/drafts/winston/
        //TODO: create unique id for draft file rather than using the name of the draft.  makes clearing the draft folder less necessary
        break;
        
}

echo json_encode($response); //response encoded as json object
 
?>