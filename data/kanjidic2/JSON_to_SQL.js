var lazy = require("lazy"),
     fs = require("fs"),
     reader = new lazy(fs.createReadStream('res.json')),
     entries = [];

String.prototype.reverse = function() {
  return this.split('').reverse().join('');
}

/**
 *
 */
var formSQL = function(entry) {
  var SQL = [];

  // 1) base data
  var b = new Buffer(JSON.stringify(entry));
  var stringified = b.toString('base64');

  SQL.push("INSERT INTO kanji_dictionary_JSON (id, data) VALUES ('" + entry.literal + "', \"" + stringified +"\");");

  entry.readings.forEach(function(reb) {
    SQL.push("INSERT INTO kanji_dictionary_reb (id, data) VALUES ('" + entry.literal + "', '" + reb + "');");
  });

  entry.meanings.forEach(function(eng){
    eng = eng.replace(/'/g,"\\'");
    SQL.push("INSERT INTO kanji_dictionary_eng (id, data) VALUES ('" + entry.literal + "', '" + eng + "');");
  });

  SQL.push("INSERT INTO kanji_dictionary_rad (id, data) VALUES ('" + entry.literal + "', '" + entry.radical + "');");
  SQL.push("INSERT INTO kanji_dictionary_grade (id, data) VALUES ('" + entry.literal + "', '" + entry.grade + "');");
  SQL.push("INSERT INTO kanji_dictionary_strokes (id, data) VALUES ('" + entry.literal + "', '" + entry.strokeCount + "');");
  SQL.push("INSERT INTO kanji_dictionary_frequency (id, data) VALUES ('" + entry.literal + "', '" + entry.frequency + "');");
  SQL.push("INSERT INTO kanji_dictionary_jlpt (id, data) VALUES ('" + entry.literal + "', '" + entry.jlpt + "');");

  return SQL.join("\n");
}

/**
 *
 */
var processLine = function(line) {
  var entry = JSON.parse(line);
  console.log(formSQL(entry));
};

/**
 * kickoff
 */
reader.lines.forEach(processLine);
