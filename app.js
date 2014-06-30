(function runApplication() {
  "use strict";

  var compression = require('compression'),
      express = require('express'),
      app = express(),
      nunjucksEnv = (function() {
        var ime = require("jp-conversion");
        var nunjucks = require('nunjucks');
        // for some reason I cannot refactor this to live in a file in ./lib
        var loader = new nunjucks.FileSystemLoader('views');
        var env = new nunjucks.Environment( loader, { autoescape: true } );
        env.express(app);
        env.addFilter("romanise", function(value) { return ime.romanise(value); });
        return env;
      }()),
      models = require('./lib/models')(require('sequelize')),
      parameters = require("./routes/parameters")(app),
      routes = require("./routes")(require("./lib/datahandler")(models));

  app.use(compress());
  app.use(express.static(__dirname + '/public'));

  // general purpose error handler, so that the app doesn't crash
  app.use(function(err, req, res, next){
    var time = Date.now();
    console.error("error timestamp: " + time);
    console.error("query parameters: " + (function() {
      var s = req.id ? " " + req.id : '';
      s += req.dict ? " " + req.dict : '';
      s += req.term ? " " + req.test : '';
      return s;
    }()));
    console.error(err.stack);
    res.send(500, "An error occurred during search. Log timestamp: " + time);
  });

  app.get('/',                 routes.index);
  app.get('/:dict/entry/:id',  routes.entry);
  app.get('/:dict/find/:term', routes.find);
  app.get('/:dict/show/:term', routes.show);

  var port = process.env.PORT || 8910;
  app.listen(port, function(err,res) {
    if(err) { console.error(err); exit(1); }
    console.log("server running on port "+port);
  });

}());
