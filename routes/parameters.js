module.exports = function(app) {
  var params = ["dict", "id", "term"];
  params.forEach(function(param) {
    app.param(param, function(req, res, next, value) {
      req[param] = value;
      if(param === "dict") {
        if(req.host.match(/([^.]+\.)?nihongoresources\.com/)) {
          res.header("Access-Control-Allow-Origin", req.protocol + "://" + req.host);
        }
      }
      next();
    });
  });
};
