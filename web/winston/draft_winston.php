<?php

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

?>