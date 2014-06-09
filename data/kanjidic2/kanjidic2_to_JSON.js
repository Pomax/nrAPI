const START=0, END=10000000;

var fs = require('fs'),
    sax = require('sax'),
    parser = sax.parser(false),
    curEntry = false,
    container = "",
    curCount = 0,
    startTime = Date.now(),
    flags = {};

/**
 * ...
 */
var Entry = function() {
  this.readings = [];
  this.meanings = [];
};

/**
 *
 */
Entry.prototype = {
  setLiteral: function(l) { this.literal = l; },
  setCodePoint: function(cp) { this.codepoint = cp; },
  setRadical: function(r) { this.radical = r; },
  setGrade: function(g) { this.grade = g; },
  setStrokeCount: function(s) { this.strokeCount = s; },
  setFrequency: function(f) { this.frequency = f; },
  setJLPT: function(l) { this.jlpt = l; },
  addReading: function(r) { this.readings.push(r); },
  addMeaning: function(m) { this.meanings.push(m); },
};

/***
 * PARSER HANDLING
 **/

// an error happened.
parser.onerror = function (e) {
  console.error(e);
};

// got some text.  t is the string of text.
parser.ontext = function (t) {
  t = t.trim();
  if(!t) return;
  if(container=="literal")      { curEntry.setLiteral(t); }
  if(container=="cp_value")     { if(flags["cp_type"]) curEntry.setCodePoint(t); }
  if(container=="rad_value")    { if(flags["rad_type"]) curEntry.setRadical(t); }
  if(container=="grade")        { curEntry.setGrade(t); }
  if(container=="stroke_count") { curEntry.setStrokeCount(t); }
  if(container=="freq")         { curEntry.setFrequency(t); }
  if(container=="jlpt")         { curEntry.setJLPT(t); }
  if(container=="reading")      { if(flags["r_type"]) curEntry.addReading(t); }
  if(container=="meaning")      { if(!flags["m_lang"]) curEntry.addMeaning(t); }
};

// an attribute.  attr has "name" and "value"
var onattribute = function (attr) {
  flags = {};
  var name = attr.name.toLowerCase(),
      value = attr.value.trim();
  if(container==="cp_value" && name==="cp_type") {
    flags[name] = (value==="ucs");
  }
  if(container==="rad_value" && name==="rad_type") {
    flags[name] = (value==="classical");
  }
  if(container==="reading" && name==="r_type") {
    flags[name] = (value==="ja_kun" || value==="ja_on");
  }
  if(container==="meaning" && name==="m_lang") {
    flags[name] = true;
  }
};

// opened a tag.  node has "name" and "attributes"
parser.onopentag = function (node) {
  container = node.name.toLowerCase();
  if(container === "character") {
    if(curEntry) {
      if(START!==false && curCount>=START) {
        console.log(JSON.stringify(curEntry));
      }
      curCount++;
    }
    if(END!==false && curCount>=END) {
      throw "we're done here. "+curCount+" entries parsed, run took "+(Date.now() - startTime)/1000+"s.";
    }
    curEntry = new Entry();
  }
  else {
    Object.keys(node.attributes).forEach(function(name) {
      onattribute({name: name, value: node.attributes[name]});
    })
  }
};

// parser stream is done, and ready to have more stuff written to it.
parser.onend = function () {
  throw "we're done here. "+curCount+" entries parsed, run took "+(Date.now() - startTime)/1000+"s.";
};

/********************************************************
                     Program run
********************************************************/
try {
  var file_buf = fs.readFileSync('kanjidic2.xml');
  parser.write(file_buf.toString('utf8')).close();
}
catch(ex) {
  console.error(ex);
  console.trace();
}