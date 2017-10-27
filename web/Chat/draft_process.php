<?php
    //this file is called by the draft.js file
    $function = $_POST['function'];
    
    $log = array();
	
	/**
	 *	Converts state to json and writes to file
	 */
	function writeStateToFile($state, $file_name) {
		//$state['draftOver'] = isDraftOver($state);//set the draftOver variable
		$json = json_encode($state);
		//fwrite(fopen($file_name, 'a'), $json."\n");//append content
		file_put_contents($file_name, $json);//overwrite content
	}
	
	function saveDeckToFile($deck, $file_name) {
		file_put_contents($file_name, implode(PHP_EOL, $deck));
	}
	
	function retrieveStateFromFile($file_name) {
		$jsonString = file_get_contents($file_name);
		$file_content = json_decode($jsonString, true);
		return $file_content;
	}
	
	function addPileToDeckList($pile, $deckList) {
		foreach ($pile as $card) {
			//array_push($deckList, $card);
			$deckList[] = $card;//add card to decklist
		}
		return $deckList;
	}
	
	function isDraftOver($state) {
		$draftOver = true;
		//if the piles still have cards, draft isn't over
		foreach ($state['piles'] as $pile) {
			//if the pile is empty, the draft may be over so we should keep looking at the piles
			if (!empty($pile)) {
				//if the pile is not empty, the draft should continue
				$draftOver = false;
				break;
			}
		}
		return $draftOver;
	}
	
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
	
	function initState($draftName, $cubeName) {
		if(file_exists($cubeName)){
		   $cube = file($cubeName, FILE_IGNORE_NEW_LINES);//file reads a file into an array
		   shuffle($cube);
		   $mainPile = array_slice($cube, 0, 90);
		   $pileOne = array(array_pop($mainPile));
		   $pileTwo = array(array_pop($mainPile));
		   $pileThree = array(array_pop($mainPile));
		   $piles = array($mainPile, $pileOne, $pileTwo, $pileThree);
		   $players = array();
		 } else {
			 //What to do if the cube doesn't exist?
			$cubeName = 'default_cube.txt';
			initState($draftName, $cubeName);
		 }
		 $decks = array("", array(), array());
		 $state = [
			"fileName" => $draftName,
			"piles" => $piles,
			"decks" => $decks,
			"activePlayer" => 1,
			"currentPile" => 1,
			"players" => $players
		 ];
		 return $state;
	}
	    
	switch($function) {
    	 case('startDraft'):
        	 $cubeName = $_POST['cubeName'];
        	 $draftName = $_POST['draftName'];
        	 $playerName = $_POST['playerName'];
			 $file_name = $draftName.'.txt';
			 $playerNumber = -1;			 
			 if (file_exists($file_name)) {
				//File already exists, add new player
				$state = retrieveStateFromFile($file_name);
				$players = $state['players'];//retrieve state of players
				$playerNumber = array_search($playerName, $players);
				if ($playerNumber > -1) {
					//player rejoined - number is index + 1
					$playerNumber = $playerNumber + 1;
				} else {
					//player joined game - add to players list
					$players[] = $playerName;//add to players array
					$state['players'] = $players;//set state of players to local players
					$playerNumber = count($players);//playerNumber is count after adding
				}
			 } else {
				$state = initState($file_name, $cubeName);
				array_push($state['players'], $playerName);
				$playerNumber = count($state['players']);//playerNumber is count after adding
			 }
			 writeStateToFile($state, $file_name);
             $log['state'] = $state;//sends the state object back
			 $log['playerNumber'] = $playerNumber;
			 $log['changeTime'] = filemtime($file_name);
        	 break;
		 
    	 case('update'):
        	 $state = $_POST['state'];
			 $changeTime = $_POST['changeTime'];
        	 if(file_exists($state['fileName'])) {
        	   $changeTimeServer = filemtime($state['fileName']);
        	 }
        	 if($changeTimeServer == $changeTime){//change time is the same
        		 $log['state'] = $state;//state is the same as passed in
				 $log['change'] = false;
				 //$log['changeTime'] = filemtime($state['fileName']);
			 } else {//if the state has changed...
				 $log['state'] = retrieveStateFromFile($state['fileName']);//decode into an object
				 $log['change'] = true;
				 $log['changeTime'] = filemtime($state['fileName']);
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
			 writeStateToFile($state, $state['fileName']);
			$log['state'] = $state;
			$log['changeTime'] = filemtime($state['fileName']);
        	break;
    	case('passPile'):
			$state = $_POST['state'];
			//add card to currentPile
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
						//$deck[] = $topCard;
						//$state['decks'][$player] = $deck;
						$state['decks'][$player][] = $topCard;
						$topCard = isset($state['piles'][0]) ? array_pop($state['piles'][0]) : null;
						if ($topCard != null) {
							//add top of main pile to pile
							//$pile = $state['piles'][3];
							//$pile[] = $topCard;
							//$state['piles'][3] = $pile;
							$state['piles'][3][] = $topCard;
							//array_push($state['piles'][3], $topCard);
						} else {
							//$state['piles'][$pileNum] = array();//empty pile
						}
					}
					
					//change currentPile
					$currentPile = 1;
					while ($currentPile <= 3) {
						if (empty($state['piles'][$currentPile])) {
							//continue to increment until pile isn't empty
							$currentPile++;
						} else {
							break;
						}
					}
					
					if (empty($state['piles'][$currentPile])) {
						$currentPile = 2;
						if (empty($state['piles'][$currentPile])) {
							$currentPile = 3;
							if (empty($state['piles'][$currentPile])) {
								//all piles empty, draft over
								$state['draftOver'] = true;
							}
						}
					}
					$state['currentPile'] = $currentPile;
					//change the active player
					$state['activePlayer'] = ($player == 1) ? 2 : 1;
					//add to pile
					if ($topCard != null) {
						//add top card to current pile
						//array_push($state['piles'][$pileNum], $topCard);
					}
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
			writeStateToFile($state, $state['fileName']);
			$log['state'] = $state;
			$log['changeTime'] = filemtime($state['fileName']);
			break;
		case('saveDeck'):
			$state = $_POST['state'];
			$playerNumber = $_POST['playerNumber'];
			$deckFileName = $_POST['deckFileName'];
			$deck = $state['decks'][$playerNumber];
			saveDeckToFile($deck, $deckFileName);
			break;
    }
    
    echo json_encode($log);

?>