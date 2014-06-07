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

  SQL.push("INSERT INTO dictionary_JSON (id, data) VALUES (" + entry.id + ", \"" + stringified +"\");");

  entry.reb.forEach(function(reb) {
    SQL.push("INSERT INTO dictionary_reb (id, data) VALUES (" + entry.id +", '" + reb + "');");
  });

  entry.keb.forEach(function(keb){
    SQL.push("INSERT INTO dictionary_keb (id, data) VALUES (" + entry.id +", '" + keb + "');");
  });

  entry.sense.forEach(function(sense) {
    sense.xref.forEach(function(xref) {
      SQL.push("INSERT INTO dictionary_sense_xref (id, sense, data) VALUES (" + entry.id +", " + sense.id + ", '" + xref + "');");
    });
    sense.ant.forEach(function(ant) {
      SQL.push("INSERT INTO dictionary_sense_ant (id, sense, data) VALUES (" + entry.id +", " + sense.id + ", '" + ant + "');");
    });
    sense.pos.forEach(function(pos) {
      pos = pos.replace('∫',"int"); // lollerskates
      SQL.push("INSERT INTO dictionary_pos (id, sense, data) VALUES (" + entry.id +", " + sense.id + ", '" + pos + "');");
    });
    sense.gloss.forEach(function(gloss) {
      gloss = gloss.replace(/"/g,'\\"');
      SQL.push("INSERT INTO dictionary_eng (id, sense, data) VALUES (" + entry.id +", " + sense.id + ", \"" + gloss + "\");");
    });
  });

  var reverse

  // 2) substring and revstring information
  /*
  entry.reb.forEach(function(reb) {
    var i, j, last, str, revstr;
    for(i=0, last=reb.length; i<last-1; i++) {
      for(j=i+1; j<last; j++) {
        str = reb.substring(i,j);
        if(j==i+1) {
          SQL.push("INSERT INTO dictionary_reb_lookup_1 (id, data) VALUES (" + entry.id +", '" + str + "');");
        }
        else {
          revstr = str.reverse();
          SQL.push("INSERT INTO dictionary_reb_lookup (id, data, revdata) VALUES (" + entry.id +", '" + str + "', '" + revstr + "');");
        }
      }
    }
  });

  entry.keb.forEach(function(keb) {
    var i, j, last, str, revstr;
    for(i=0, last=keb.length; i<last-1; i++) {
      for(j=i+1; j<last; j++) {
        str = keb.substring(i,j);
        if(j==i+1) {
          SQL.push("INSERT INTO dictionary_keb_lookup_1 (id, data) VALUES (" + entry.id +", '" + str + "');");
        }
        else {
          revstr = str.reverse();
          SQL.push("INSERT INTO dictionary_keb_lookup (id, data, revdata) VALUES (" + entry.id +", '" + str + "', '" + revstr + "');");
        }
      }
    }
  });
  */

  /**
   * word
   */
  /*
  entry.sense.forEach(function(sense) {
    sense.gloss.forEach(function(gloss) {
      gloss = gloss.replace(/'/g,"\\'");
      // code goes here
      var terms = gloss.replace(/\(\)\[\]/g,'').split(/\s+/);
      var idx = 0;
      terms.forEach(function(term) {
        SQL.push("INSERT INTO dictionary_eng_LUT (id, sense, term, position, type) VALUES ("
                 + entry.id +", " + sense.id + ", '" + term + "', "+idx+", "+(idx==0? 0 : (idx==terms.length-1 ? 2 : 1))
                 + ");");
        idx++;
      });
    });
  });
  */

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
