module.exports = (function() {
  "use strict";

  var lookup = require("jp-giongo");

  return {
  	findAll: function(term, next) {
  		var set = lookup.find(term);
      next(false, set);
  	}
  };

}());
