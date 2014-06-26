module.exports = function(app) {
  var params = ["dict", "id", "term"];
  params.forEach(function(param) {
    app.param(param, function(req, res, next, value) {
      req[param] = value;
      if(param === "dict") {
        // CORS is based on the :dict parameter
        res.header("Access-Control-Allow-Origin", [
          "http://nihongoresources.com",
          "http://api.nihongoresources.com"
        ].join(' '));
      }
      next();
    });
  });
};
