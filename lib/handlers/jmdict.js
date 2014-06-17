module.exports = function(models) {
  return require("./base/generic")({
    json: models.dictionary_JSON,
    kanji: models.dictionary_keb,
    kana: models.dictionary_reb,
    english: models.dictionary_eng
  });
};
