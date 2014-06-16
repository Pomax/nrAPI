var express = require('express'),
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
    parameters = require("./routes/parameters")(app)("dict", "id", "term"),
    routes = require("./routes")(require("./lib/datahandler")(models));

app.use(express.static(__dirname + '/public'));

app.get('/',                 routes.index);
app.get('/:dict/entry/:id',  routes.entry);
app.get('/:dict/find/:term', routes.find);
app.get('/:dict/show/:term', routes.show);

var port = process.env.PORT || 8910;
app.listen(port, function(err,res) {
  if(err) { console.error(err); exit(1); }
  console.log("server running on port "+port);
});
