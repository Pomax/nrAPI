
module.exports = function(models) {
  var context = {
    dict: require("./jmdict")(models),
    kanji: require("./kanji")(models),
    sfx: require("./sfx")
  };

  // safety net
	var fallback = {
		findEntry:        function(id, next)                 { next("unknown context"); },
		findAll:          function(term, next)               { next("unknown context"); },
		findUsingKanji:   function(kanji, next)              { next("unknown context"); },
		findUsingKana:    function(hiragana, katakana, next) { next("unknown context"); },
		findUsingEnglish: function(eng, next)                { next("unknown context"); }
	};

  return {
    getHandler: function(dict) {
      if(context[dict]) { return context[dict]; }
      return fallback;
    }
  };

};
