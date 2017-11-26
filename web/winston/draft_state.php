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
            $fileContents[] = "1 ".$deck[$i];
        }
        for ($i = 0; $i < count($sideboard); $i++) {
            $fileContents[] = "SB: 1 ".$sideboard[$i];
        }
        error_log("Saving deck to file: ".$_SERVER['DOCUMENT_ROOT'].$file_name);
        file_put_contents($_SERVER['DOCUMENT_ROOT'].$file_name, implode("\r\n", $fileContents));
    }

    /**
     *	Converts state to json and writes to file
     */
    function writeStateToFile($state, $filePath) {
        //$state['draftOver'] = isDraftOver($state);//set the draftOver variable
        // error_log("State: ".$state);
        $json = json_encode($state);
        // error_log("State to be saved: ".$json);
        if (isSet($state['draftLock'])) {
            //open
            $f = fopen($filePath, 'w');
            //write
            fwrite($f, $json);//write content
            //release file lock and close
            flock($f, LOCK_UN);
            fclose($f);
        } else {
            //no lock, just put contents, this will happen when first created
            file_put_contents($filePath, $json);//overwrite content
        }
    }
    
    function retrieveStateFromFile($filePath) {
        // $myfile=fopen($filePath,'rt');
        // flock($myfile,LOCK_SH);
        // error_log("Retrieve state from: ".$filePath);
        $jsonString = file_get_contents($filePath);
        // error_log("State in file: ".$jsonString);
        // flock($myfile, LOCK_UN); 
        // fclose($myfile);
        $json = json_decode($jsonString, true);
        return $json;
    }

    function initState($draftName, $cubeName, $draftType) {
        error_log("Creating ".$draftType." draft");
        if(file_exists(getCubesPath()."/".$cubeName.".txt")){
            $cube = file(getCubesPath()."/".$cubeName.".txt", FILE_IGNORE_NEW_LINES);//file reads a file into an array
            shuffle($cube);
            switch ($draftType) {
                case ('winston'):
                    return initWinstonState($draftName, $cubeName, $cube);
                    break;
                case ('pancake'):
                    return initPancakeState($draftName, $cubeName, $cube);
                    break;
            }
        } else {
             //What to do if the cube doesn't exist?  Retry with default_cube.txt
             //TODO notify user that default cube was used... somehow
            $cubeName = 'default_cube';
            return initState($draftName, $cubeName, $draftType);
         }
    }
    
    function initWinstonState($draftName, $cubeName, $cube) {
         $mainPile = array_slice($cube, 0, 90);
         $pileOne = array(array_pop($mainPile));
         $pileTwo = array(array_pop($mainPile));
         $pileThree = array(array_pop($mainPile));
         $piles = array($mainPile, $pileOne, $pileTwo, $pileThree);
         $players = array();
         $decks = array("", array(), array());
         $sideboard = array("", array(), array());
         $state = [
            "format" => 'winston',
            "fileName" => $draftName,
            "cubeName" => $cubeName,
            "players" => array(),
            "decks" => array("", array(), array()),
            "sideboard" => array("", array(), array()),
            "piles" => $piles,
            "activePlayer" => rand(1, 2),
            "currentPile" => 1
         ];
         return $state;
    }
    
    function initPancakeState($draftName, $cubeName, $cube) {
         error_log("initPancakeState");
         $pool = array_slice($cube, 0, 198);
         $packSize = 11;
         $numPacks = 18;
         $packs = buildPacks($pool, $packSize, $numPacks);
         $state = [
            "format" => 'pancake',
            "fileName" => $draftName,
            "cubeName" => $cubeName,
            "players" => array(),
            "decks" => array("", array(), array()),
            "sideboard" => array("", array(), array()),
            "packs" => $packs,
            "picks" => array(0, 1, 2, 2),//number of picks on each turn in a round
            "burns" => array(0, 0, 2, 0),//number of burns on each turn in a round
            "currentPack" => array("", 1, 2),//current pack being view by player one and two, this will be moved as the draft progresses
            "currentTurn" => 1,//current turn in the round
            "currentPicks" => array("", 0, 0),//number of picks in the turn by each player 
            "currentBurns" => array("", 0, 0),//number of burns in the turn by each player
            "packSize" => $packSize,
            "numPacks" => $numPacks,
            "round" => 1,
            "rounds" => 9
         ];
         return $state;
    }
    
    function buildPacks($pool, $packSize, $numPacks) {
        $packs = array("");//blank value to offset array
         for ($i = 0; $i < $numPacks; $i++) {
            $pack = array();//create a pack
             for ($j = 0; $j < $packSize; $j++) {
                $pack[] = array_pop($pool);//add cards to pack
             }
             $packs[] = $pack;//add pack to packs list
         }
         return $packs;
    }
    
    /**
     * Convert the state object into a publicly viewable version
     */
    function getPublicState($state, $playerNumber) {
        switch ($state['format']) {
            case 'winston':
                $state = getPublicWinstonState($state, $playerNumber);
                break;
            case 'pancake':
                $state = getPublicPancakeState($state, $playerNumber);
                break;
        }
        for ($i = 0; $i < count($state['decks']); $i++) {
            if ($i != $playerNumber) {
                $state['decks'][$i] = "";
                $state['sideboard'][$i] = "";
            }
        }
        // releaseDraftLock($state['draftLock']);
        $state['draftLock'] = null;
        return $state;
    }
    
    function getPublicWinstonState($state, $playerNumber) {
        //clean piles - convert them to length of pile
        if ($playerNumber == $state['activePlayer']) {
            $state['activePile'] = $state['piles'][$state['currentPile']];//set activePile to visible pile
        }
        $state['piles'][0] = count($state['piles'][0]);
        $state['piles'][1] = count($state['piles'][1]);
        $state['piles'][2] = count($state['piles'][2]);
        $state['piles'][3] = count($state['piles'][3]);
        return $state;		
    }
    
    function getPublicPancakeState($state, $playerNumber) {
        // error_log("playerNumber: ".$playerNumber);
        $currentPack = $state['currentPack'][$playerNumber];
        // error_log("currentPack: ".$currentPack);
        $state['activePile'] = $state['packs'][$currentPack];//set activePile to visible pack
        $state['packs'] = "";
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
    
    /**
     * Extracted code from start draft.
     * 
     * Check draft state for if 
     */
    function joinDraft($players, $playerName) {
        $playerNumber = array_search($playerName, $players);
        if ($playerNumber === false) {
            //player joined game - add to players list
            $players[] = $playerName;//add to players array
        } else {
            //player rejoined, already in players list
        }
        return $players;
    }
    
    function getPlayerNumber($players, $playerName) {
        $playerNumber = array_search($playerName, $players);
        if ($playerNumber === false) {
            $playerNumber = -1;
        } else {
            $playerNumber++;
        }
        return $playerNumber;
    }
    
    function retrieveDraftFile($fileName) {
        $draftsPath = getDraftsPath();
        return retrieveStateFromFile($draftsPath."/".$fileName);
    }
    
    function saveDraftFile($state) {
        $draftsPath = getDraftsPath();
        writeStateToFile($state, $draftsPath."/".$state['fileName']);
    }
    
    function draftLastChange($fileName) {
        $draftsPath = getDraftsPath();
        return filectime($draftsPath."/".$fileName);
    }
    
    function retrieveAllDrafts() {
        $draftsPath = getDraftsPath();
        $allDrafts = scandir($draftsPath);
        return $allDrafts;
    }
    
    function doesDraftExist($draftName) {
        $draftsPath = getDraftsPath();
        return file_exists($draftsPath."/".$draftName);
    }
    
    $_draftsPath;
    $_cubesPath;
    
    function getDraftsPath() {
        if ($_draftsPath == null) {
            $webPath = $_SERVER['DOCUMENT_ROOT']; //path to /web
            $appPath = dirname($webPath);
            $_draftsPath = $appPath."/data/drafts";
            // error_log("_draftsPath=".$_draftsPath);
        }
        return $_draftsPath;
    }
    
    function getDraftPath($draftName) {
        return getDraftsPath()."/".$draftName;
    }
    
    function getCubesPath() {
        if ($_cubesPath == null) {
            $webPath = $_SERVER['DOCUMENT_ROOT']; //path to /web
            $appPath = dirname($webPath); //path to root of app
            $_cubesPath = $appPath."/data/cubes";//append path to cubes dir
            // error_log("$_cubesPath=".$_cubesPath);
        }
        return $_cubesPath;
    }
    
    function getDraftState($draftName) {
        $state = null;
        // error_log("Getting draft state for: ".getDraftsPath()."/".$state_file_name);
        if (file_exists(getDraftPath($draftName))) {
            //Draft already exists, retrieve from file
            // $state = retrieveDraftFile($draftName);
            // error_log("Get draft state1: ".$state);
            // $f = getDraftLock($filePath);
            
            //open
            $filePath = getDraftPath($draftName);
            $f = fopen($filePath, 'r');
            //get lock
            flock($f, LOCK_EX);
            //read
            $jsonString = file_get_contents($filePath);
            // error_log("State in file: ".$jsonString);
            //close
            fclose($f);
            //return value
            $state = json_decode($jsonString, true);
            $state['draftLock'] = true;
        }
        return $state;
    }
    
    function getDraftLock($filePath) {
        $f = fopen($filePath, 'r');
        $got_lock = true;
        $count = 0;
        $timeout_secs = 5;
        while (!flock($f, LOCK_EX | LOCK_NB)) {
            if ($count++ < $timeout_secs) {
                error_log("Waiting for draft lock");
                sleep(1);
            } else {
                $got_lock = false;
                break;
            }
        }
        return $f;
    }
    
    function releaseDraftLock($f) {
        if ($f != null) {
            // error_log("Releasing draft lock: ".$f);
            flock($f, LOCK_UN);
            fclose($f);
        }
    }
    
    function getContents($path, $waitIfLocked = true) { 
        if(!file_exists($path)) { 
            throw new Exception('File "'.$path.'" does not exists'); 
        }
        else {
            $fo = fopen($path, 'r'); 
            $locked = flock($fo, LOCK_SH, $waitIfLocked); 
            if(!$locked) { 
                return false;
            } else { 
                $cts = file_get_contents($path); 
                
                flock($fo, LOCK_UN);
                fclose($fo); 
                return $cts; 
            } 
        } 
    } 
    
?>