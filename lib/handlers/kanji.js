module.exports = function(models) {
  "use strict";

  var relations = require("kanji-relations");

  // Post-find handler, to add in the kanji relation
  // data from the relationship package.
  var enrich = function enrich(kanji, data, next) {
    var extended = relations.get(kanji);
    data.parents = extended.parents;
    data.children = extended.children;
    next(false, data);
  };

  // override for findUsingKanji, since that's
  // just a get for the kanji database.
  var findUsingKanji = function findUsingKanji(kanji, next) {
    return this.findEntry(kanji, function(err,result) {
      next(err,[result]);
    });
  };

  var options = {
    json: models.kanji_dictionary_JSON,
    kanji: false,
    kana: models.kanji_dictionary_reb,
    english: models.kanji_dictionary_eng,
    postFindEntry: enrich,
	  findUsingKanji: findUsingKanji
  };

  return require("./base/generic")(options);
};
