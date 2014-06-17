var lookup = require("jp-giongo");
module.exports = {
	findAll: function(term, next) {
		var set = lookup.find(term);
    next(false, set);
	}
};
