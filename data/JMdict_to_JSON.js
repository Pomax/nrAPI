const START=0, END=1000000;

var fs = require('fs'),
    sax = require('sax'),
    parser = sax.parser(false),
    curEntry = false,
    container = "",
    curCount = 0,
    ignoreGloss = false,
    startTime = Date.now(),
    senseId = 1;

/**
 * ...
 */
var Sense = function() {
  this.id = senseId++;
  this.xref = [];
  this.ant = [];
  this.pos = [];
  this.gloss = [];
};

/**
 *
 */
Sense.prototype = {
  addXRef: function(xref) { this.xref.push(xref); },
  addAntonym: function(ant) { this.ant.push(ant); },
  addPos: function(pos) { this.pos.push(pos.replace('&','').replace(';','')); },
  addGloss: function(gloss) { this.gloss.push(gloss); }
}

/**
 * ...
 */
var Entry = function(){
  this.reb = [];
  this.keb = [];
  this.sense = [];
};

/**
 *
 */
Entry.prototype = {
  setID: function(id) { this.id = id; },
  addReading: function(reb) { this.reb.push(reb); },
  addKajiForm: function(keb) { this.keb.push(keb); },
  newSense: function() { this.sense.push(new Sense()); },
  addXRef: function(xref) { this.sense[this.sense.length-1].addXRef(xref); },
  addAntonym: function(ant) { this.sense[this.sense.length-1].addAntonym(ant); },
  addPos: function(pos) { this.sense[this.sense.length-1].addPos(pos); },
  addGloss: function(gloss) { this.sense[this.sense.length-1].addGloss(gloss); }
};

/***
 * PARSER HANDLING
 **/

// an error happened.
parser.onerror = function (e) {
};

// got some text.  t is the string of text.
parser.ontext = function (t) {
  if(container=="ent_seq" && t.trim()) { curEntry.id = t; }
  if(container=="reb" && t.trim()) { curEntry.addReading(t); }
  if(container=="keb" && t.trim()) { curEntry.addKajiForm(t); }
  if(container=="xref" && t.trim()) { curEntry.addXRef(t); }
  if(container=="pos" && t.trim()) { curEntry.addPos(t); }
  if(container=="ant" && t.trim()) { curEntry.addAntonym(t); }
  if(container=="gloss" && t.trim()) {
    if(!ignoreGloss) { curEntry.addGloss(t); }
    ignoreGloss = false;
  }
};

// an attribute.  attr has "name" and "value"
parser.onattribute = function (attr) {
  if(container=="gloss" && attr.name=="XML:LANG") {
    ignoreGloss = true;
  }
};

// opened a tag.  node has "name" and "attributes"
parser.onopentag = function (node) {
  /**
    entry*
      ent_seq -> id
      r_ele*
        reb -> reading
      k_ele*
        keb -> kanji form
      info => IGNORE
      sense*
        xref -> interpretation
        ant -> antonym
        pos -> part of speech
        gloss -> english term
        gloss.X => IGNORE
  **/
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
  if(container === "sense") {
    curEntry.newSense();
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
  var file_buf = fs.readFileSync('JMdict');
  parser.write(file_buf.toString('utf8')).close();
}
catch(ex) {
  //console.log(ex);
}