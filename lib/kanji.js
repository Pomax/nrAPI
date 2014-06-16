module.exports = function(models) {
  var IME = require("jp-conversion");
  var relations = require("kanji-relations");

  var enrich = function(kanji, data) {
    var extended = relations.get(kanji);
    data.parents = extended.parents;
    data.children = extended.children;
  }

  return {
		/**
		 * find an entry by its id
		 */
		findEntry: function(kanji, next) {
			models.kanji_dictionary_JSON
			.find({ where: { id: kanji }})
			.error(function(err) { next(err); })
			.success(function(result) {
				try {
					var b = new Buffer(result.data, 'base64')
					var s = b.toString();
					var data = JSON.parse(s);
          enrich(kanji, data);
					next(false, data);
				} catch (e) {
					var err = "parse error: " + result;
					console.error(e);
					next(e);
				}
			});
		},

		/**
		 * find all entries based on search terms
		 */
		findAll: function(term, next) {
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
			this.findEntry(kanji, function(err, result) {
				next(err,[result]);
			});
		},

		/**
		 * find all ids based on kanji hits
		 */
		findUsingKana: function(hiragana, katakana, next) {
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
			models.dictionary_reb
			.findAll({ where: ["data LIKE '" + hiragana+ "%' OR data LIKE '" + katakana + "%'"]})
			.error(function(err) { next(err); })
			.success(success);
		},

		/**
		 * find all ids based on english hits
		 */
		findUsingEnglish: function(eng, next) {
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
			models.dictionary_eng
			.findAll({ where: ["data LIKE '" + eng + "%'"]})
			.error(function(err) { next(err); })
			.success(success);
		}
	};
};
