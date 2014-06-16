module.exports = function(app) {
  var params = ["dict", "id", "term"];
  params.forEach(function(param) {
    app.param(param, function(req, res, next, value) {
      req[param] = value;
      next();
    });
  });
};
