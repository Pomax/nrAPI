module.exports = function(Sequelize) {
  "use strict";

  var database = "jmdict",
			username = "jpenuser",
			password = "jpenpass",
			sequelize = new Sequelize(database,username,password,{
				dialect: "mysql",
				port: 3306,
				logging: false
			});

	sequelize.authenticate().complete(function(err) {
		if (err) {
			console.error('Unable to connect to the database:', err);
			process.exit(1);
		} else {
			console.log('Connection has been established successfully.');
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

  var kanji_dictionary_JSON      = sequelize.define("kanji_dictionary_JSON",      { "id": Sequelize.STRING(4), "data": Sequelize.TEXT }, ext);
  var kanji_dictionary_reb       = sequelize.define("kanji_dictionary_reb",       { "id": Sequelize.STRING(4), "data": Sequelize.TEXT }, ext);
  var kanji_dictionary_eng       = sequelize.define("kanji_dictionary_eng",       { "id": Sequelize.STRING(4), "data": Sequelize.TEXT }, ext);
  var kanji_dictionary_rad       = sequelize.define("kanji_dictionary_rad",       { "id": Sequelize.STRING(4), "data": Sequelize.TEXT }, ext);
  var kanji_dictionary_grade     = sequelize.define("kanji_dictionary_grade",     { "id": Sequelize.STRING(4), "data": Sequelize.TEXT }, ext);
  var kanji_dictionary_strokes   = sequelize.define("kanji_dictionary_strokes",   { "id": Sequelize.STRING(4), "data": Sequelize.TEXT }, ext);
  var kanji_dictionary_frequency = sequelize.define("kanji_dictionary_frequency", { "id": Sequelize.STRING(4), "data": Sequelize.TEXT }, ext);
  var kanji_dictionary_jlpt      = sequelize.define("kanji_dictionary_jlpt",      { "id": Sequelize.STRING(4), "data": Sequelize.TEXT }, ext);

  var name_dictionary_JSON = sequelize.define("name_dictionary_JSON", { "id": Sequelize.INTEGER(12), "data": Sequelize.TEXT }, ext);
  var name_dictionary_keb  = sequelize.define("name_dictionary_keb",  { "id": Sequelize.INTEGER(12), "data": Sequelize.TEXT }, ext);
  var name_dictionary_reb  = sequelize.define("name_dictionary_reb",  { "id": Sequelize.INTEGER(12), "data": Sequelize.TEXT }, ext);
  var name_dictionary_eng  = sequelize.define("name_dictionary_eng",  { "id": Sequelize.INTEGER(12), "data": Sequelize.TEXT }, ext);
  var name_dictionary_type = sequelize.define("name_dictionary_type", { "id": Sequelize.INTEGER(12), "data": Sequelize.TEXT }, ext);


  return {
    sequelize: sequelize

    // jmdict models
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

    // kanjidic2 models
  , kanji_dictionary_JSON      : kanji_dictionary_JSON
  , kanji_dictionary_reb       : kanji_dictionary_reb
  , kanji_dictionary_eng       : kanji_dictionary_eng
  , kanji_dictionary_rad       : kanji_dictionary_rad
  , kanji_dictionary_grade     : kanji_dictionary_grade
  , kanji_dictionary_strokes   : kanji_dictionary_strokes
  , kanji_dictionary_frequency : kanji_dictionary_frequency
  , kanji_dictionary_jlpt      : kanji_dictionary_jlpt

  // jmnedict models
  , name_dictionary_JSON : name_dictionary_JSON
  , name_dictionary_keb  : name_dictionary_keb
  , name_dictionary_reb  : name_dictionary_reb
  , name_dictionary_eng  : name_dictionary_eng
  , name_dictionary_type : name_dictionary_type

  };

};
