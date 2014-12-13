module.exports = function(options) {
  "use strict";

  var IME = require("jp-conversion");

  var sequelize = options.sequelize,
      jsonModel = options.json,
      kanjiModel = options.kanji,
      kanaModel = options.kana,
      englishModel = options.english;

  var overrides = {
    findEntry: options.findEntry,
    findAll: options.findAll,
    findUsingKanji: options.findUsingKanji,
    findUsingKana: options.findUsingKana,
    findUsingEnglish: options.findUsingEnglish
  };

  // minor data massage, so that once the input is handed to
  // SQL, there are no quotes left in it, and the * wildcard
  // has been turned into the % wildcard instead.
  var sanitizeSQL = function(term) {
    if(!term) return term;
    return term.replace(/'/g, '');
  };

  return {
    /**
     * find an entry by its id
     */
    findEntry: function(id, next) {
      if(overrides.findEntry) { return overrides.findEntry.call(this, id, next); }
      jsonModel .find({ where: { id: id }})
                .error(function(err) { next(err); })
                .success(function(result) {
                  var data = {};
                  if(result && result.data) {
                    var b = new Buffer(result.data, 'base64');
                    var s = b.toString();
                    try { data = JSON.parse(s); }
                    catch (e) {
                      var err = "parse error for: " + result.data;
                      console.error(err,"\n",s);
                      return next(err);
                    }
                  } else {
                    console.log("error on result for "+id, result);
                  }
                  if(options.postFindEntry) {
                    options.postFindEntry(id, data, next);
                  } else { next(false, data); }
                });
    },

    /**
     * find all entries based on search terms
     */
    findAll: function(term, next) {
      if(overrides.findAll) { return overrides.findAll.call(this, term, next); }
      var handler = this;
      var interpreted = IME.convert(term.toLowerCase());
      if(interpreted === false) {
        return this.findUsingEnglish(term, next);
      }
      if(interpreted.kanji) {
        return this.findUsingKanji(interpreted.kanji, next);
      }
      if(interpreted.hiragana || interpreted.katakana) {
        if(!term.match(/[\u3041-\u30FA]/) && interpreted.romaji) {
          return handler.findUsingEnglish(interpreted.romaji, function(err, results) {
            if(err) { return next(err,results); }
            handler.findUsingKana(interpreted.hiragana, interpreted.katakana, function(err, moreResults) {
              next(err, results.concat([false]).concat(moreResults));
            });
          });
        } else {
          return this.findUsingKana(interpreted.hiragana, interpreted.katakana, next);
        }
      }
      next("unknown input language", interpreted);
    },

    /**
     * find all ids based on kanji hits
     */
    findUsingKanji: function(kanji, next) {
      kanji = sanitizeSQL(kanji).replace(/\*/g,'%');
      if(overrides.findUsingKanji) { return overrides.findUsingKanji.call(this, kanji, next); }
      var findEntry = this.findEntry;
      var success = function(results) {
        var ids = results.map(function(v) { return v.id; });
        ids = ids.filter(function(elem, pos) {
          return ids.indexOf(elem) == pos;
        });
        var entries = [];
        (function nextId() {
          if(ids.length === 0) {
            return next(false, entries);
          }
          var id = ids.splice(0,1)[0];
          findEntry(id, function(err, result) {
            entries.push(result);
            nextId();
          });
        }());
      };
      kanjiModel.findAll({ where: ["data LIKE '" + kanji + "'"]})
                .error(function(err) { next(err); })
                .success(success);
    },

    /**
     * find all ids based on kana hits
     */
    findUsingKana: function(hiragana, katakana, next) {
      hiragana = sanitizeSQL(hiragana);
      katakana = sanitizeSQL(katakana);
      if(overrides.findUsingKana) { return overrides.findUsingKana.call(this, hiragana, katakana, next); }
      var findEntry = this.findEntry;
      var success = function(results) {
        var ids = results.map(function(v) { return v.id; });
        ids = ids.filter(function(elem, pos) {
          return ids.indexOf(elem) == pos;
        });
        var entries = [];
        (function nextId() {
          if(ids.length === 0) {
            return next(false, entries);
          }
          var id = ids.splice(0,1)[0];
          findEntry(id, function(err, result) {
            entries.push(result);
            nextId();
          });
        }());
      };
      var where = [];
      if(hiragana) { where.push("data LIKE '" + hiragana.replace(/\*/g,'%') + "'"); }
      if(katakana) { where.push("data LIKE '" + katakana.replace(/\*/g,'%') + "'"); }
      kanaModel .findAll({ where: where.join(" OR ") })
                .error(function(err) { next(err); })
                .success(success);
    },

    /**
     * find all ids based on english hits
     */
    findUsingEnglish: function(eng, next) {
      eng = sanitizeSQL(eng);
      if(overrides.findUsingEnglish) { return overrides.findUsingEnglish.call(this, eng, next); }
      var findEntry = this.findEntry;
      var success = function(results) {
        var rankings = {};
        var ids = results.map(function(v) {
          v = v.dataValues;
          rankings[v.id] = v.ranking;
          return v.id;
        });
        ids = ids.filter(function(elem, pos) {
          return ids.indexOf(elem) == pos;
        });
        var entries = [];
        (function nextId() {
          if(ids.length === 0) {
            return next(false, entries);
          }
          var id = ids.splice(0,1)[0];
          findEntry(id, function(err, result) {
            if (result) {
              result.ranking = rankings[id];
              entries.push(result);
            }
            nextId();
          });
        }());
      };
      var where = "MATCH (data) AGAINST ('" + eng + "' IN NATURAL LANGUAGE MODE)";
      var findProps = {
        attributes: ["id", "data", [sequelize.literal(where), "ranking"]],
        where: [where]
      };
      if(eng.indexOf("*") > -1) {
        // If there are wildcards we need to use RLIKE instead
        // of full text searching.
        eng = eng.replace(/\*/g, '.*').replace(/_/g,'.');
        findProps.where =  "data RLIKE '[[:<:]]" + eng + "[[:>:]]'";
        delete findProps.attributes;
      }
      englishModel .findAll(findProps)
                   .error(function(err) { next(err); })
                   .success(success);
    }
  };
};
