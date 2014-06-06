module.exports = function(Sequelize) {

  var sequelize = new Sequelize("jmdict", "jpenuser", "jpenpass", {
    dialect: "mysql",
    port: 3306,
    logging: false
  });

	sequelize.authenticate().complete(function(err) {
		if (err) {
			console.error('Unable to connect to the database:', err)
			exit(1);
		} else {
			console.log('Connection has been established successfully.')
		}
	});

	var ext = {
	  timestamps: false,
	  freezeTableName: true
	};

  var dictionary_JSON         = sequelize.define("dictionary_JSON",         { "id": Sequelize.INTEGER(12), "data": Sequelize.TEXT }, ext);
	var dictionary_reb          = sequelize.define("dictionary_reb",          { "id": Sequelize.INTEGER(12), "data": Sequelize.TEXT }, ext);
	var dictionary_reb_lookup   = sequelize.define("dictionary_reb_lookup",   { "id": Sequelize.INTEGER(12), "data": Sequelize.TEXT }, ext);
	var dictionary_reb_lookup_1 = sequelize.define("dictionary_reb_lookup_1", { "id": Sequelize.INTEGER(12), "data": Sequelize.TEXT, "revdata": Sequelize.TEXT }, ext);
	var dictionary_keb          = sequelize.define("dictionary_keb",          { "id": Sequelize.INTEGER(12), "data": Sequelize.TEXT }, ext);
	var dictionary_keb_lookup   = sequelize.define("dictionary_keb_lookup",   { "id": Sequelize.INTEGER(12), "data": Sequelize.TEXT }, ext);
	var dictionary_keb_lookup_1 = sequelize.define("dictionary_keb_lookup_1", { "id": Sequelize.INTEGER(12), "data": Sequelize.TEXT, "revdata": Sequelize.TEXT }, ext);
	var dictionary_sense_xref   = sequelize.define("dictionary_sense_xref",   { "id": Sequelize.INTEGER(12), "sense": Sequelize.INTEGER(12), "data": Sequelize.TEXT }, ext);
	var dictionary_sense_ant    = sequelize.define("dictionary_sense_ant",    { "id": Sequelize.INTEGER(12), "sense": Sequelize.INTEGER(12), "data": Sequelize.TEXT }, ext);
	var dictionary_pos          = sequelize.define("dictionary_pos",          { "id": Sequelize.INTEGER(12), "sense": Sequelize.INTEGER(12), "data": Sequelize.TEXT }, ext);
	var dictionary_eng          = sequelize.define("dictionary_eng",          { "id": Sequelize.INTEGER(12), "sense": Sequelize.INTEGER(12), "data": Sequelize.TEXT }, ext);
	var dictionary_eng_LUT      = sequelize.define("dictionary_eng_LUT",          { "id": Sequelize.INTEGER(12), "sense": Sequelize.INTEGER(12), "term": Sequelize.TEXT, "position": Sequelize.INTEGER(12), "type": Sequelize.INTEGER(12) });

  return {
    sequelize: sequelize
	, dictionary_JSON         : dictionary_JSON
	, dictionary_reb          : dictionary_reb
	, dictionary_reb_lookup   : dictionary_reb_lookup
	, dictionary_reb_lookup_1 : dictionary_reb_lookup_1
	, dictionary_keb          : dictionary_keb
	, dictionary_keb_lookup   : dictionary_keb_lookup
	, dictionary_keb_lookup_1 : dictionary_keb_lookup_1
	, dictionary_sense_xref   : dictionary_sense_xref
	, dictionary_sense_ant    : dictionary_sense_ant
	, dictionary_pos          : dictionary_pos
	, dictionary_eng          : dictionary_eng
	, dictionary_eng_LUT      : dictionary_eng_LUT
  };

};
