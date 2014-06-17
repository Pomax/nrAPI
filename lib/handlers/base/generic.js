module.exports = function(options) {
  var IME = require("jp-conversion");

  var json = options.json,
      kanji = options.kanji,
      kana = options.kana,
      english = options.english;

  return {
    /**
     * find an entry by its id
     */
    findEntry: function(id, next) {
      if(options.findEntry) { return options.findEntry.call(this, id, next); }
      json.find({ where: { id: id }})
          .error(function(err) { next(err); })
          .success(function(result) {
            try {
              var b = new Buffer(result.data, 'base64')
              var s = b.toString();
              var data = JSON.parse(s);

              if(options.postFindEntry) {
                options.postFindEntry(id, data, next);
              } else { next(false, data); }

            } catch (e) {
              var err = "parse error for: " + result.data;
              console.error(err);
              next(err);
            }
          });
    },

    /**
     * find all entries based on search terms
     */
    findAll: function(term, next) {
      if(options.findAll) { return options.findAll.call(this, term, next); }
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
          })
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
      if(options.findUsingKanji) { return options.findUsingKanji.call(this, kanji, next); }
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
      kanji .findAll({ where: ["data LIKE '" + kanji + "%'"]})
            .error(function(err) { next(err); })
            .success(success);
    },

    /**
     * find all ids based on kana hits
     */
    findUsingKana: function(hiragana, katakana, next) {
      if(options.findUsingKana) { return options.findUsingKana.call(this, hiragana, katakana, next); }
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
      kana.findAll({ where: ["data LIKE '" + hiragana+ "%' OR data LIKE '" + katakana + "%'"]})
          .error(function(err) { next(err); })
          .success(success);
    },

    /**
     * find all ids based on english hits
     */
    findUsingEnglish: function(eng, next) {
      if(options.findUsingEnglish) { return options.findUsingEnglish.call(this, eng, next); }
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
      english.findAll({ where: ["data LIKE '" + eng + "%'"]})
             .error(function(err) { next(err); })
             .success(success);
    }
  };
};
