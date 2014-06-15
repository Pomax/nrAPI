module.exports = function(dataHandler) {
	return {
    index: function(req, res) {
      res.render("index.html");
    },
    entry: function(req, res) {
      dataHandler.getHandler(req.dict).findEntry(req.id, function(err, result) {
        if(err) {
          return res.render("err.html", { error: err });
        }
        res.json(result);
      });
    },
    find: function(req, res, next) {
      dataHandler.getHandler(req.dict).findAll(req.term, function(err, results) {
        if(err) {
          return res.render("err.html", { error: err });
        }
        res.json(results);
      });
    },
    show: function(req, res) {
      if (req.query.details) {
        res.locals.details = req.query.details;
      }
      dataHandler.getHandler(req.dict).findAll(req.term, function(err, results) {
        if(err) {
          return res.render("err.html", { error: err });
        }
        res.render(req.dict + "/result.html", { results: results });
      });
    }
  };
};
