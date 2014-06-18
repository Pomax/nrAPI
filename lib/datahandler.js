module.exports = function(models) {
  "use strict";

  var handlers = "./handlers/";
  var context = {
    dict:  require(handlers + "jmdict")(models),
    kanji: require(handlers + "kanji")(models),
    name:  require(handlers + "name")(models),
    sfx:   require(handlers + "sfx")
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
