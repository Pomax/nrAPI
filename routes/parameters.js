module.exports = function(app) {
  var params = ["dict", "id", "term"];
  params.forEach(function(param) {
    app.param(param, function(req, res, next, value) {
      req[param] = value;
      if(param === "dict") {
        var origin = req.get('origin');
        if(origin.match(/([^.]+\.)?nihongoresources\.com/)) {
          res.header("Access-Control-Allow-Origin", origin);
        } else {
          res.header("Access-Control-Allow-Origin", "deny");
        }
      }
      next();
    });
  });
};
