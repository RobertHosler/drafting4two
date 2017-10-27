var getCards = function(cardnames) {
	var cards = [];
	var result = $.getJSON('http://mtgjson.com/json/AllCards.json', function(data) {
		//for each card in the datafile
		$.each(data, function(index, card) {
			//and each cardname in the list of cardnames
			$.each(cardnames, function(i, cardname) {
				//add the card to the list of cards if the cardname matches the index
				if (index === cardname) {
					cards.push(card);
				}
			});
		});
		return cards;
	});
};
//var cardnames = ["Birthing Pod"];
//getCards(cardnames);

var setImgCard = function(imgId, card) {
	var imgSrc = "http://mtgimage.com/card/"+card.imageName+".jpg";
	$(imgId).attr('src', imgSrc);
};

var getCards2 = function(cardnames) {
	var cards = [];
	$.ajax({
		 async: false,
		 type: 'GET',
		 url: 'http://mtgjson.com/json/AllCards-x.json',
		 success: function(data) {
			//for each cardname in the list of cardnames
			$.each(cardnames, function(index, cardname) {
				//add the card to the list of cards if the cardname matches the index
				var card = data[cardname];
				cards.push(card);
			});
		 }
	});
	return cards;
};

var getCardImages = function(cardnames) {
	var cards = getCards2(cardnames);
	var cardImages = [];
	$.ajax({
		 async: false,
		 type: 'GET',
		 url: 'http://mtgjson.com/json/AllSetsArray.json',
		 success: function(data) {
			//for each cardname in the list of cardnames
			$.each(cards, function(index, card) {
				var firstPrinting = card.printings[0];
				$.each(data, function(i, set) {
					if (set.code === firstPrinting) {
						$.each(set.cards, function(j, cardInSet) {
							if (cardInSet.name === card.name) {
								var number = cardInSet.number;
								var imgSrc = "http://magiccards.info/scans/en/"+firstPrinting.toLowerCase()+"/"+number+".jpg";
								cardImages.push(imgSrc);
								return false;
							}
						});
					}
				});
			});
		 }
	});
	return cardImages;
};

var appendCardImages2 = function(imgId, cardnames) {
	var cardImages = getCardImages(cardnames);
	$.each(cardImages, function(index, img) {
		$(imgId).append($("<img class=\"magicCard\" src=\"" + img + "\">"));//adds to current html body
	});
};

var appendCardImages = function(imgId, cardnames) {
	var cards = getCards2(cardnames);
	$.each(cards, function(index, card) {
		var color = "brown";
		if (card.colors) {
			color = card.colors.length > 1 ? "gold" : card.colors[0].toLowerCase();
		}
		var s = "<div class=\"writtenCard " + color + "\"><div class=\"innerWrittenCard\"><div class=\"row cardNameRow\"><span class=\"cardName\">"+card.name+"</span>";
			if (card.manaCost) {
				//TODO: remove brackets from manacost
				s += "<span class=\"manaCost\">"+prettyManaCost(card.manaCost)+"</span>";
			}
			s += "</div><div class=\"cardType row\">"+card.type+"</div>" + "<div class=\"cardText\">"+prettyManaCost(card.text)+"</div>";
			s += "<div class=\"powerToughness row\">";
			if (card.power) {
				s += card.power+"/"+card.toughness;
			} else if (card.loyalty) {
				s += card.loyalty;
			}
			s += "</div></div></div>";
		$(imgId).append(s);
	});
};

var prettyManaCost = function(manaCost) {
	var symbols = ["W", "U", "B", "R", "G"];
	symbols.forEach(function(element) {
		var regex = new RegExp("\{" + element + "\}", "g");
		manaCost = manaCost.replace(regex, manaSymbol(element));
	});
	manaCost = manaCost.replace(/\{|\}/g, '');//remove braces
	//
	//manaCost = manaCost.replace(/G/g, manaSymbol("green"));
	//var manaCost = card.manaCost.replace('}', '');
	return manaCost;
};

var manaSymbol = function(colorLetter) {
	var result = "";
	var imgSrc = "images/"+colorLetter+".png";
	result = "<img class=\"manaSymbol\" src=\"" + imgSrc + "\">";
	return result;
};

var appendCardNames = function(imgId, cardnames) {
	//var cards = getCards2(cardnames);
	$.each(cardnames, function(index, cardname) {
		$(imgId).append("<div>"+cardname+"</div>");
		//var imgSrc = "http://mtgimage.com/card/"+card.imageName+".jpg";
		//$(imgId).append($("<img class=\"magicCard\" src=\"" + imgSrc + "\">"));//adds to current html body
	});
};