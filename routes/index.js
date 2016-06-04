module.exports = function(dataHandler) {
  "use strict";

	return {
    // main page
    index: function(req, res) {
      res.render("index.html");
    },

    // functional routes
    entry: function(req, res, next) {
      dataHandler.getHandler(req.params.dict).findEntry(req.params.id, function(err, result) {
        if(err) { return next(err); }
        res.json(result);
      });
    },
    find: function(req, res, next) {
      dataHandler.getHandler(req.params.dict).findAll(req.params.term, function(err, results) {
        if(err) { return next(err); }
        res.json(results);
      });
    },
    show: function(req, res, next) {
      if (req.query.details) { res.locals.details = req.query.details; }
      dataHandler.getHandler(req.params.dict).findAll(req.params.term, function(err, results) {
        if(err) { return next(err); }
        res.render(req.params.dict + "/result.html", { results: results });
      });
    },

    // when everything goes wrong
    errorLogger: function(err, req, res, next) {
      console.error('error: ' + JSON.stringify({
        timestamp: Date.now(),
        error: err
      }));
      next(err);
    },
    errorHandler: function(err, req, res, next) {
      res.status(500);
      res.render('err.html', {
        error: err,
        params: req.params,
        query: req.query
      });
      // going to assume this is a bad database connection. Restart through forever
      process.exit(1);
    }
  };
};
