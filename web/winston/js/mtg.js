var mtg = (function() {
	
	var allCards;

	/**
	 * Currently called from draft.js
	 * Append Card images asynchronously
	 */
	var appendCardImages = function(viewId, cardnames) {
		if (allCards) {
			addCardsToView(viewId, getCards(cardnames));
		} else {
			$.getJSON('http://mtgjson.com/json/AllCards-x.json', function(obj) {
				allCards = obj;
				addCardsToView(viewId, getCards(cardnames));
			});
		}
	};
	
	var getCards = function(divId, cardnames) {
		var cards = [];
		//for each cardname in the list of cardnames
		$.each(cardnames, function(index, cardname) {
			//add the card to the list of cards if the cardname matches the index
			var card = allCards[cardname];
			cards.push(card);
		});
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
		//TODO: sort and populate result object
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
			
		});
		return result;
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

	var appendCardNames = function(imgId, cardnames) {
		$.each(cardnames, function(index, cardname) {
			$(imgId).append("<div>"+cardname+"</div>");
		});
	};
	
	return {
		appendCardNames: appendCardNames,
		appendCardImages: appendCardImages,
		prettySymbolText: prettySymbolText
	}
})();