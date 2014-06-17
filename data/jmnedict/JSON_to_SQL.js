var lazy = require("lazy"),
     fs = require("fs"),
     reader = new lazy(fs.createReadStream('res.json')),
     entries = [],
     entryCount = 0;

String.prototype.reverse = function() {
  return this.split('').reverse().join('');
}

/**
 *
 */
var formSQL = function(entry) {
  entryCount++;

  var SQL = [];

  // 1) base data
  var b = new Buffer(JSON.stringify(entry));
  var stringified = b.toString('base64');

  SQL.push("INSERT INTO name_dictionary_JSON (id, data) VALUES ('" + entryCount + "', \"" + stringified +"\");");

  entry.kanji.forEach(function(keb) {
    SQL.push("INSERT INTO name_dictionary_keb (id, data) VALUES ('" + entryCount + "', '" + keb + "');");
  });

  entry.readings.forEach(function(reb) {
    SQL.push("INSERT INTO name_dictionary_reb (id, data) VALUES ('" + entryCount + "', '" + reb + "');");
  });

  var eng = [], types = [];
  entry.trans.forEach(function(trans) {
    trans.trans.forEach(function(en) {
      en = en.replace(/'/g,"\\'");
      if(eng.indexOf(en) === -1) { eng.push(en); }
    })
    if(types.indexOf(trans.nameType) === -1) { types.push(trans.nameType); }
  });

  eng.forEach(function(eng) {
    SQL.push("INSERT INTO name_dictionary_eng (id, data) VALUES ('" + entryCount + "', '" + eng + "');");
  })

  types.forEach(function(type) {
    SQL.push("INSERT INTO name_dictionary_type (id, data) VALUES ('" + entryCount + "', '" + type + "');");
  })

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
