// ==UserScript==
// @name         google
// @namespace    http://tampermonkey.net/
// @version      0.1
// @updateURL    https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamperkey-google.js
// @downloadURL  https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamperkey-google.js
// @description  try to take over the world!
// @author       You
// @match        https://play.google.com/music*
// @grant        none
// ==/UserScript==

(function() {
    function setRandomInterval(f, min, max) {
  setTimeout(function() {
    f();
    setRandomInterval(f, min, max) 
  }, min + Math.random() * (max - min));
};
setRandomInterval(function(){$('#player-bar-forward').click();}, 88000, 148000);
})();
