module.exports = function(models) {
  "use strict";

  return require("./base/generic")({
    json: models.name_dictionary_JSON,
    kanji: models.name_dictionary_keb,
    kana: models.name_dictionary_reb,
    english: models.name_dictionary_eng
  });
};
