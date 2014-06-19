module.exports = function(models) {
  "use strict";

  var verbs = require("jp-conjugation");

  return require("./base/generic")({
    json: models.dictionary_JSON,
    kanji: models.dictionary_keb,
    kana: models.dictionary_reb,
    english: models.dictionary_eng
  });
};
