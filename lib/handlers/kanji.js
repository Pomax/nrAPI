module.exports = function(models) {
  "use strict";

  var relations = require("kanji-relations");
  var unknownrelations = {parents:[], children: []};
  var bushu = ["","一","｜","丶","ノ","乙 (乚)","亅","二","亠","人 (イ)","儿","入","八","冂","冖","冫",
               "几","凵","刀 (刂)","力","勹","匕","匚","匸","十","卜","卩","厂","厶","又","口","囗","土",
               "士","夂","夊","夕","大","女","子","宀","寸","小","尢","尸","屮","山","川 (巛)","工","己 (已/巳)",
               "巾","干","幺","广","廴","廾","弋","弓","彐 (彑)","彡","彳","心 (忄)","戈","戸","手 (扌)",
               "支","攵 (夂)","文","斗","斤","方","无","日 (曰)","曰","月","木","欠","止","歹","殳","毌 (母)",
               "比","毛","氏","气","水 (氵/氺)","火 (灬)","爪 (爫)","父","爻","爿","片","牙","牛 (牜)","犬 (犭)",
               "玄","玉 (王/壬)","瓜","瓦","甘","生","用","田","疋","疒","癶","白","皮","皿","目","矛","矢",
               "石","示 (ネ)","禸","禾","穴","立","竹","米","糸","缶","网 (罒/罓)","羊","羽","老","而","耒",
               "耳","聿","肉 (月)","臣","自","至","臼","舌","舛","舟","艮","色","艸","虍","虫","血","行",
               "衣 (衤)","西 (襾)","見","角","言","谷","豆","豕","豸","貝","赤","走","足","身","車","辛",
               "辰","辵 (辶)","邑 ( 阝)","酉","釆 (采)","里","金","長 (镸)","門","阜 (阝 )","隶","隹",
               "雨","青 (靑)","非","面 (靣)","革","韋","韭","音","頁","風","飛","食","首","香","馬","骨",
               "高 (髙)","髟","鬥","鬯","鬲","鬼","魚","鳥","鹵","鹿","麥 (麦)","麻","黄","黍","黑 (黒)",
               "黹","黽","鼎","鼓 (鼔)","鼠","鼻","齊 (斉)","齒 (歯)","龍 (竜)","龜 (亀)","龠"];

  // Post-find handler, to add in the kanji relation
  // data from the relationship package.
  var enrich = function enrich(kanji, data, next) {
    var extended = relations.get(kanji) || unknownrelations;
    data.parents = extended.parents;
    data.children = extended.children;
    data.radicalnumber = data.radical;
    data.radical = bushu[parseInt(data.radical,10)];
    next(false, data);
  };

  // override for findUsingKanji, since that's
  // just a get for the kanji database.
  var findUsingKanji = function findUsingKanji(kanji, next) {
    return this.findEntry(kanji, function(err,result) {
      next(err,[result]);
    });
  };

  var options = {
    json: models.kanji_dictionary_JSON,
    kanji: false,
    kana: models.kanji_dictionary_reb,
    english: models.kanji_dictionary_eng,
    postFindEntry: enrich,
	  findUsingKanji: findUsingKanji
  };

  return require("./base/generic")(options);
};
