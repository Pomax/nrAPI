module.exports = function(app) {
  return function() {
  	var params = Array.prototype.slice.call(arguments);
	  params.forEach(function(param) {
	    app.param(param, function(req, res, next, value) {
	      req[param] = value;
	      next();
	    });
	  });
	};
};
