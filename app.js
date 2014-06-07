var app = require('express')(),
    nunjucks = require('nunjucks').configure('views', { autoescape: true, express: app }),
    models = require('./lib/models')(require('sequelize')),
    parameters = require("./routes/parameters")(app)("dict", "id", "term"),
    routes = require("./routes")(require("./lib/datahandler")(models));

app.get('/',           routes.index);
app.get('/:dict/entry/:id',  routes.entry);
app.get('/:dict/find/:term', routes.find);
app.get('/:dict/show/:term', routes.show);

var port = process.env.PORT || 8910;
app.listen(port, function(err,res) {
  if(err) { console.error(err); exit(1); }
  console.log("server running on port "+port);
});
