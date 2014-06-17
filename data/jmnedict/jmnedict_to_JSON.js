const START=0, END=10000000;

var fs = require('fs'),
    sax = require('sax'),
    parser = sax.parser(false),
    curEntry = false,
    curTrans = false;
    container = "",
    curCount = 0,
    startTime = Date.now(),
    flags = {};

/**
 * ...
 */
var Trans = function() {
  this.trans = [];
};

/**
 * ...
 */
Trans.prototype = {
  setNameType: function(t) { this.nameType = t; },
  addTrans:    function(t) { this.trans.push(t); }
};


/**
 * ...
 */
var Entry = function() {
  this.kanji = [];
  this.readings = [];
  this.trans = [];
};

/**
 *
 */
Entry.prototype = {
  addKanji:    function(k) { this.kanji.push(k); },
  addReading:  function(r) { this.readings.push(r); },
  newTrans:    function()  { curTrans = new Trans(); this.trans.push(curTrans); },
  setNameType: function(v) { curTrans.setNameType(v.substring(1,v.length-1)); },
  addTrans:    function(t) { curTrans.addTrans(t); }
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
  if(container=="keb")       { curEntry.addKanji(t); }
  if(container=="reb")       { curEntry.addReading(t); }
  if(container=="name_type") { curEntry.setNameType(t); }
  if(container=="trans_det") { curEntry.addTrans(t); }
};


// opened a tag.  node has "name" and "attributes"
parser.onopentag = function (node) {
  container = node.name.toLowerCase();
  if(container === "entry") {
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
  if(container === "trans") {
    curEntry.newTrans();
  }
};

// parser stream is done, and ready to have more stuff written to it.
parser.onend = function () {
  throw "we're done here. "+curCount+" entries parsed, run took "+(Date.now() - startTime)/1000+"s.";
};

/********************************************************
                     Program run
********************************************************/
//try {
  var file_buf = fs.readFileSync('JMnedict.xml');
  parser.write(file_buf.toString('utf8')).close();
//}
//catch(ex) {
//  console.error(ex);
//  console.trace();
//}