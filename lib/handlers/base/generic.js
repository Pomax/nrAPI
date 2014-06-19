module.exports = function(options) {
  "use strict";

  var IME = require("jp-conversion");

  var jsonModel = options.json,
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
                  var b = new Buffer(result.data, 'base64');
                  var s = b.toString();
                  var data = {};
                  try { data = JSON.parse(s); }
                  catch (e) {
                    var err = "parse error for: " + result.data;
                    console.error(err,"\n",s);
                    return next(err);
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
        if(interpreted.romaji) {
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
      hiragana = sanitizeSQL(hiragana).replace(/\*/g,'%');
      katakana = sanitizeSQL(katakana).replace(/\*/g,'%');
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
      kanaModel .findAll({ where: ["data LIKE '" + hiragana+ "' OR data LIKE '" + katakana + "'"]})
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
      var where = "MATCH (data) AGAINST ('" + eng + "')";
      if(eng.indexOf("*") > -1) {
        // If there are wildcards we need to use RLIKE instead
        // of full text searching.
        eng = eng.replace(/\*/g, '.*').replace(/_/g,'.');
        where = "data RLIKE '[[:<:]]" + eng + "[[:>:]]'";
      }
      englishModel .findAll({ where: [where] })
                   .error(function(err) { next(err); })
                   .success(success);
    }
  };
};
