var highlight = [];
var unhighlight = function() {
  highlight.forEach(function(a) { a.style.color = ''; });
};

var clearFrame = document.createElement("div");
clearFrame.innerHTML = "<div class='clearframe' title='close'>X</div>";
clearFrame = clearFrame.children[0];
clearFrame.onclick = function() {
  document.body.removeChild(clearFrame);
  document.querySelector("iframe").src = "";
  unhighlight();
}

var as = document.querySelectorAll("a[data-kanji]");
as = Array.prototype.slice.call(as);
as.forEach(function(a) {
  var dk = a.getAttribute("data-kanji");
  a.onclick = function() {
    var elements = document.querySelectorAll("a[data-kanji="+dk+"]");
    unhighlight();
    highlight = Array.prototype.slice.call(elements);
    highlight.forEach(function(a) { a.style.color = "red"; });
    document.body.appendChild(clearFrame);
  }
});
