var express = require('express'),
    nunjucks = require('nunjucks'),
    Sequelize = require('sequelize'),
    models = require('./models')(Sequelize),
    sequelize = models.sequelize,
    IME = require("./IME"),
    app = express();

// -------------

var dataHandler = {
  // find an entry by its id
  findEntry: function(id, next) {
  	models.dictionary_JSON.find({ where: { id: id }})
  	      .error(function(err) { next(err); })
  	      .success(function(result) {
  	        try {
							var b = new Buffer(result.data, 'base64')
							var s = b.toString();
  	          var data = JSON.parse(s);
    	        next(false, data);
  	        } catch (e) {
  	          var err = "parse error for: " + result.data;
  	          console.error(err);
  	          next(err);
  	        }
  	      });
  },
  // find all entries based on search terms
  findAll: function(term, next) {
    var interpreted = IME.convert(term.toLowerCase());
    if(interpreted === false) {
      return this.findUsingEnglish(term, next);
    }
    if(interpreted.kanji) {
      return this.findUsingKanji(interpreted.kanji, next);
    }
    if(interpreted.hiragana || interpreted.katakana) {
      return this.findUsingKana(interpreted.hiragana, interpreted.katakana, next);
    }
    next(false, interpreted);
  },
  // find all ids based on kanji hits
  findUsingKanji: function(kanji, next) {
    var findEntry = this.findEntry;
		var success = function(results) {
			var ids = results.map(function(v) { return v.id; });
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
    models.dictionary_keb.findAll({ where: ["data LIKE '" + kanji + "%'"]})
          .error(function(err) { next(err); })
          .success(success);
  },
  // find all ids based on kanji hits
  findUsingKana: function(hiragana, katakana, next) {
    var findEntry = this.findEntry;
		var success = function(results) {
			var ids = results.map(function(v) { return v.id; });
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
    models.dictionary_reb.findAll({ where: ["data LIKE '" + hiragana+ "%' OR data LIKE '" + katakana + "%'"]})
          .error(function(err) { next(err); })
          .success(success);
  },
  // find all ids based on english hits
  findUsingEnglish: function(eng, next) {
    var findEntry = this.findEntry;
		var success = function(results) {
			var ids = results.map(function(v) { return v.id; });
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
    models.dictionary_eng.findAll({ where: ["data LIKE '" + eng + "%'"]})
          .error(function(err) { next(err); })
          .success(success);
  }
};

// -------------

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

var routes = {
  index: function(req, res) {
    res.render("index.html");
  },
  entry: function(req, res) {
    dataHandler.findEntry(req.id, function(err, result) {
      if(err) {
        return res.json({ error: err });
      }
      res.json(result);
    });
  },
  find: function(req, res, next) {
    dataHandler.findAll(req.term, function(err, results) {
      if(err) {
        return res.json({ error: err });
      }
      res.json(results);
    });
  },
  show: function(req, res) {
    dataHandler.findAll(req.term, function(err, results) {
      if(err) {
        return res.json({ error: err });
      }
      res.render("result.html", { results: results });
    });
  }
}

// -------------

var parameters = function() {
  var params = Array.prototype.slice.call(arguments);
  params.forEach(function(param) {
    app.param(param, function(req, res, next, value) {
      req[param] = value;
      next();
    });
  });
};

parameters("id", "term");

// -------------

app.get('/',           routes.index);
app.get('/entry/:id',  routes.entry);
app.get('/find/:term', routes.find);
app.get('/show/:term', routes.show);

// -------------

var port = process.env.PORT || 80;
app.listen(port, function(err,res) {
  if(err) { console.error(err); exit(1); }
  console.log("server running on port "+port);
});
