module.exports = function(app) {
  "use strict";

  var params = ["dict", "id", "term"];
  params.forEach(function(param) {
    app.param(param, function(req, res, next, value) {
      req.params[param] = value;
      if(param === "dict") {
        var origin = req.get('origin');
        if(!origin  || (origin.indexOf("http://localhost")!==0 && !origin.match(/([^.]+\.)?nihongoresources\.com/))) {
          res.removeHeader("Access-Control-Allow-Origin");
        }
      }
      next();
    });
  });
};
