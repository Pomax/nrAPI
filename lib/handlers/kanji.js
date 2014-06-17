module.exports = function(models) {
  var relations = require("kanji-relations");
  return require("./base/generic")({
    json: models.kanji_dictionary_JSON,
    kanji: false,
    kana: models.kanji_dictionary_reb,
    english: models.kanji_dictionary_eng,
    // Post-find handler, to add in the kanji relation
    // data from the relationship package.
    postFindEntry: function enrich(kanji, data, next) {
	    var extended = relations.get(kanji);
	    data.parents = extended.parents;
	    data.children = extended.children;
	    next(false, data);
	  },
	  // override for findUsingKanji, since that's
	  // just a get for the kanji database.
	  findUsingKanji: function(kanji, next) {
      return this.findEntry(kanji, function(err,result) {
      	next(err,[result])
      });
	  }
  });

};
