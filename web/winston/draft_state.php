<?php
	
	/**
	 * Save decklist to text file
	 */
	function saveDeckToFile($deck, $file_name) {
		$fileContents = array();
		for ($i = 0; $i < count($deck); $i++) {
			$fileContents[$i] = "1 ".$deck[$i];
		}
		file_put_contents($file_name, implode("\r\n", $fileContents));
	}
	
	/**
	 * Save decklist and sideboard to file.
	 */
	function saveDeckAndSideboardToFile($deck, $sideboard, $file_name) {
		$fileContents = array();
		for ($i = 0; $i < count($deck); $i++) {
			$fileContents[$i] = "1 ".$deck[$i];
		}
		for ($i = 0; $i < count($sideboard); $i++) {
			$fileContents[$i] = "SB: 1 ".$sideboard[$i];
		}
		file_put_contents($file_name, implode("\r\n", $fileContents));
	}

	/**
	 *	Converts state to json and writes to file
	 */
	function writeStateToFile($state, $state_file_name) {
		//$state['draftOver'] = isDraftOver($state);//set the draftOver variable
		$json = json_encode($state);
		//fwrite(fopen($file_name, 'a'), $json."\n");//append content
		file_put_contents($state_file_name, $json);//overwrite content
	}
	
	function retrieveStateFromFile($state_file_name) {
		$jsonString = file_get_contents($state_file_name);
		$file_content = json_decode($jsonString, true);
		return $file_content;
	}

	function initState($draftName, $cubeName) {
		if(file_exists("cubes/".$cubeName.".txt")){
		   $cube = file("cubes/".$cubeName.".txt", FILE_IGNORE_NEW_LINES);//file reads a file into an array
		   shuffle($cube);
		   $mainPile = array_slice($cube, 0, 90);
		   $pileOne = array(array_pop($mainPile));
		   $pileTwo = array(array_pop($mainPile));
		   $pileThree = array(array_pop($mainPile));
		   $piles = array($mainPile, $pileOne, $pileTwo, $pileThree);
		   $players = array();
		 } else {
			 //What to do if the cube doesn't exist?  Retry with default_cube.txt
			$cubeName = 'default_cube';
			initState($draftName, $cubeName);
		 }
		 $decks = array("", array(), array());
		 $sideboard = array("", array(), array());
		 $state = [
			"fileName" => $draftName,
			"piles" => $piles,
			"decks" => $decks,
			"sideboard" => $sideboard,
			"activePlayer" => 1,
			"currentPile" => 1,
			"players" => $players
		 ];
		 return $state;
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
	
	/**
	 * TODO: change to addCardsToDeckList
	 *
	 * Add list of cards to the given array
	 */
	function addPileToDeckList($pile, $deckList) {
		foreach ($pile as $card) {
			//array_push($deckList, $card);
			$deckList[] = $card;//add card to decklist
		}
		return $deckList;
	}

?>