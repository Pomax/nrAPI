(function runApplication() {
  "use strict";

  // Basic app setup
  var compress = require('compression'),
      express = require('express'),
      cors = require('cors'),
      app = express();

  app.use(compress());
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", req.get('origin'));
    res.header("Access-Control-Allow-Credentials", "true");
    next();
  });
  app.use(express.static(__dirname + '/public'));
  
  // CORS settings
  var corsOptions = {
    origin: [
      'http://api.nihongoresources.com',
      'https://api.nihongoresources.com',
      'http://www.nihongoresources.com',
      'https://www.nihongoresources.com'
    ]
  };

  app.use(cors(corsOptions));  

  // Content related setup
  var nunjucksEnv = (function() {
        var ime = require("jp-conversion");
        var nunjucks = require('nunjucks');
        // for some reason I cannot refactor this to live in a file in ./lib
        var loader = new nunjucks.FileSystemLoader('views');
        var env = new nunjucks.Environment( loader, { autoescape: true } );
        env.express(app);
        env.addFilter("romanise", function(value) { return ime.romanise(value); });
        return env;
      }()),
      parameters = require("./routes/parameters")(app),
      models = require('./lib/models')(require('sequelize')),
      routes = require("./routes")(require("./lib/datahandler")(models));

  app.get('/',                 routes.index);
  app.get('/:dict/entry/:id',  routes.entry);
  app.get('/:dict/find/:term', routes.find);
  app.get('/:dict/show/:term', routes.show);

  app.use(routes.errorLogger);
  app.use(routes.errorHandler);

  var port = process.env.PORT || 8910;
  app.listen(port, function(err,res) {
    if(err) { console.error(err); exit(1); }
    console.log("server running on port "+port);
  });

}());
