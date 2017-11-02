var mtg = (function() {
	
	var allCards;
	var appendViewId;

	/**
	 * Currently called from draft.js
	 * Append Card images asynchronously
	 */
	var appendCardImages = function(viewId, cardnames) {
		if (allCards) {
			addCardsToView(viewId, getCards(cardnames));
		} else {
			appendViewId = viewId;
			$.getJSON('http://mtgjson.com/json/AllCards-x.json', function(obj) {
				allCards = obj;
				var cards = getCards(cardnames);
				addCardsToView(viewId, cards);
			});
		}
	};
	
	var getCards = function(cardnames) {
		var cards = [];
		//for each cardname in the list of cardnames
		$.each(cardnames, function(index, cardname) {
			//add the card to the list of cards if the cardname matches the index
			var card = allCards[cardname];
			cards.push(card);
		});
		return cards;
	};
	
	var addCardsToView = function(viewId, cards) {
		$.each(cards, function(index, card) {
			var color = "brown";
			if (card.colors) {
				color = card.colors.length > 1 ? "gold" : card.colors[0].toLowerCase();
			}
			var s = "<div class=\"writtenCard " + color + "\"><div class=\"innerWrittenCard\"><div class=\"row cardNameRow\"><span class=\"cardName\">"+card.name+"</span>";
				if (card.manaCost) {
					//TODO: remove brackets from manacost
					s += "<span class=\"manaCost\">"+prettySymbolText(card.manaCost)+"</span>";
				}
				s += "</div><div class=\"cardType row\">"+card.type+"</div>" + "<div class=\"cardText\">"+prettySymbolText(card.text)+"</div>";
				s += "<div class=\"powerToughness row\">";
				if (card.power) {
					s += card.power+"/"+card.toughness;
				} else if (card.loyalty) {
					s += card.loyalty;
				}
				s += "</div></div></div>";
			$(viewId).append(s);
		});
	};
	
	/**
	 * Returns card names in multiple color sorted arrays sorted by cmc.
	 */
	var sortCardsByColorCmc = function(cardnames) {
		var result = {
			white: [],
			blue: [],
			black: [],
			red: [],
			green: [],
			multi: [],
			land: [],
			colorless: []
		};
		var cards = getCards(cardnames);
		$.each(cards, function(index, card) {
		    switch (card.colors.length) {
		        case 0: //Colorless or land
                    switch (card.types[0]) {
                        case "Land":
                            result.land.push(card);
                            break;
                        default:
                            result.colorless.push(card);
                    }
                    break;
                case 1: //Single Color
                    switch (card.colors[0]) {
                        case "White":
                            result.white.push(card);
                            break;
                        case "Blue":
                            result.blue.push(card);
                            break;
                        case "Black":
                            result.black.push(card);
                            break;
                        case "Red":
                            result.red.push(card);
                            break;
                        case "Green":
                            result.green.push(card);
                            break;
                    }
                    break;
		        default: //Multicolor
                    result.multi.push(card);
		    }
		});
		result.white.sort(compareCmc);
		result.blue.sort(compareCmc);
		result.black.sort(compareCmc);
		result.red.sort(compareCmc);
		result.green.sort(compareCmc);
		result.multi.sort(compareCmc);
		result.colorless.sort(compareCmc);
		return result;
	};

	var compareCmc = function(cardA, cardB) {
        	return cardA.cmc - cardB.cmc;
	};
	
	/**
	 *  Converts mana, tap, and numbers to pretty graphics
	 */
	var prettySymbolText = function(textWithSymbols) {
		if (!textWithSymbols) return;
		var symbols = ["{T}", "{Q}", "{[0]}", "{[1]}", "{[2]}", "{[3]}", "{[4]}", "{[5]}", "{[6]}", "{[7]}", "{[8]}", "{[9]}", "{X}", "{W}", "{U}", "{B}", "{R}", "{G}", "{W/B}", "{R/W}", "{W/U}", "{G/W}", "{U/B}", "{U/R}", "{G/U}", "{R/G}", "{B/G}", "{B/R}", "{2/W}", "{2/U}", "{2/B}", "{2/R}", "{2/G}", "{W/P}", "{U/P}", "{B/P}", "{R/P}", "{G/P}"];
		symbols.forEach(function(element) {
			var regex = new RegExp(element, "g");
			textWithSymbols = textWithSymbols.replace(regex, manaSymbol(element));
		});
		textWithSymbols = textWithSymbols.replace(/\{|\}/g, '');//remove braces
		return textWithSymbols;
	};

	var manaSymbol = function(symbol) {
		symbol = symbol.replace(/\/|\[|\]|\{|\}/g, '');//remove braces
		var result = "";
		var imgSrc = "/images/"+symbol+".svg";
		result = "<img class=\"manaSymbol\" src=\"" + imgSrc + "\">";
		return result;
	};

	var appendCardNames = function(divId, cardnames) {
		$.each(cardnames, function(index, cardname) {
			$(divId).append("<div>"+cardname+"</div>");
		});
	};

	var appendSortedCardNames = function(divId, cardnames) {
		var sortedCards = sortCardsByColorCmc(cardnames);
        	$.each(sortedCards, function(index, array) {
			$(divId).append("<div>");
			$(divId).append("<div>"+index+"</div>");
			$.each(array, function(index, item){
			    $(divId).append("<p>"+item.name+" </p>");
			});
			$(divId).append("</div>");
		});
	};
	
	return {
		appendCardNames: appendCardNames,
		appendSortedCardNames: appendSortedCardNames,
		appendCardImages: appendCardImages,
		prettySymbolText: prettySymbolText,
		sortCards: sortCardsByColorCmc
	}
})();
