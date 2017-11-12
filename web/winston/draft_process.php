<?php
	include 'draft_state.php';
	include 'draft_winston.php';
	
    //this file is called by the draft.js file
    $function = $_POST['function'];
    
    $log = array();
	
	/**
	 * Unused
	 */
	function make_unique($full_path) {
		$file_name = basename($full_path);
		$directory = dirname($full_path).DIRECTORY_SEPARATOR;

		$i = 2;
		while (file_exists($directory.$file_name)) {
			$parts = explode('.', $file_name);
			// Remove any numbers in brackets in the file name
			$parts[0] = preg_replace('/\(([0-9]*)\)$/', '', $parts[0]);
			$parts[0] .= '('.$i.')';

			$new_file_name = implode('.', $parts);
			if (!file_exists($new_file_name)) {
				$file_name = $new_file_name;
			}
			$i++;
		}
		return $directory.$file_name;
	}
	    
	switch($function) {
    	 case('startDraft'):
        	 $cubeName = $_POST['cubeName'];
        	 $draftName = $_POST['draftName'];
        	 $draftType = $_POST['draftType'];
        	 $fileName = $_POST['fileName'];
        	 $playerName = $_POST['playerName'];
			 $state_file_name = $draftName.'.txt';
			 $state = getDraftState($state_file_name, $cubeName);
			 $state['players'] = joinDraft($state['players'], $playerName);
			 $playerNumber = getPlayerNumber($state['players'], $playerName);
			 saveDraftFile($state);
             $log['state'] = $state;//sends the state object back
			 $log['playerNumber'] = $playerNumber;
			 $log['changeTime'] = draftLastChange($state_file_name);
        	 break;
		 
    	 case('update'):
        	 $state = $_POST['state'];
			 $changeTime = $_POST['changeTime'];
			 $changeTimeServer = 0;
        	 if(file_exists("drafts/".$state['fileName'])) {
				$changeTimeServer = draftLastChange($state['fileName']);
        	 }
        	 if($changeTimeServer == $changeTime){//change time is the same
        		 $log['state'] = $state;//state is the same as passed in
				 $log['change'] = false;
				 $log['changeTime'] = draftLastChange($state['fileName']);
			 } else {//if the state has changed...
				 $log['state'] = retrieveDraftFile($state['fileName']);//decode into an object
				 $log['change'] = true;
				 $log['changeTime'] = draftLastChange($state['fileName']);
			 }
             break;
    	 
    	 case('takePile'):
			$state = $_POST['state'];
			//pop card off of current deck for setting to the pile taken
			$topCard = isset($state['piles'][0]) ? array_pop($state['piles'][0]) : null;
			//determine current pile
			$pileNum = $state['currentPile'];
			$player = $state['activePlayer'];
			$pile = $state['piles'][$pileNum];
			$deck = isset($state['decks'][$player]) ? $state['decks'][$player] : array();
			$newPile;
			if ($topCard != null) {
				$newPile = array($topCard);
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
			$log['state'] = $state;
			$log['changeTime'] = draftLastChange($state['fileName']);
        	break;
        	
    	case('passPile'):
			$state = $_POST['state'];
			$state = passWinstonPile($state);
			saveDraftFile($state);
			$log['state'] = $state;
			$log['changeTime'] = draftLastChange($state['fileName']);
			break;
			
		case('saveDeck'):
			$state = $_POST['state'];
			$playerNumber = $_POST['playerNumber'];
			$deckFileName = $_POST['deckFileName'];
			$deck = isset($state['decks'][$playerNumber]) ? $state['decks'][$playerNumber] : array();
			$sideboard = isset($state['sideboard'][$playerNumber]) ? $state['sideboard'][$playerNumber] : array();
			saveDeckAndSideboardToFile($deck, $sideboard, $deckFileName);
			break;
			
		case('listDrafts'):
			$allFiles = retrieveAllDrafts();
			$drafts = array_diff($allFiles, array('.', '..', '.gitignore'));
			$states = [];
			foreach($drafts as $draft) {
				$state = retrieveDraftFile($draft);
				$states[] = $state;
			}
			$log['drafts'] = $drafts;
			$log['states'] = $states;
			break;
			
		case('moveToSideboard'):
			$state = $_POST['state'];
			$cardName = $_POST['cardName'];
			$playerNumber = $_POST['playerNumber'];
			$deckList = $state['decks'][$playerNumber];
			$key = array_search($cardName,$deckList);//find card key
			if ($key!==false) { unset($deckList[$key]); }//remove card
			$deckList = array_values($deckList);//resort the array so it will be interpretted as an array by javascript
			$state['decks'][$playerNumber] = $deckList;//set the list
			$state['sideboard'][$playerNumber][] = $cardName;//add to sideboard
			saveDraftFile($state);
			$log['state'] = $state;
			$log['changeTime'] = draftLastChange($state['fileName']);
			break;
			
		case('moveToDeck'):
			$state = $_POST['state'];
			$cardName = $_POST['cardName'];
			$playerNumber = $_POST['playerNumber'];
			$sideboard = $state['sideboard'][$playerNumber];
			$key = array_search($cardName,$sideboard);//find card key
			if ($key!==false) { unset($sideboard[$key]); }//remove card
			$sideboard = array_values($sideboard);//reindex the array so it will be interpretted as an array by javascript
			$state['sideboard'][$playerNumber] = $sideboard;//set the sideboard without the card
			$state['decks'][$playerNumber][] = $cardName;//add to decklist
			saveDraftFile($state);
			$log['state'] = $state;
			$log['changeTime'] = draftLastChange($state['fileName']);
			break;
			
		case('deleteDrafts'):
			//TODO: delete all drafts from the winston/drafts folder - ability to change which drafts are being deleted?  Move drafts folder to web so its web/drafts/winston/
			//TODO: create unique id for draft file rather than using the name of the draft.  makes clearing the draft folder less necessary
			break;
			
    }
    
    echo json_encode($log);

?>