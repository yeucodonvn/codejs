// ==UserScript==
// @name         deezer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @updateURL    https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamperkey-deezer.js
// @downloadURL  https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamperkey-deezer.js
// @description  try to take over the world!
// @author       You
// @match        https://www.deezer.com/*
// @grant        none
// ==/UserScript==

(function() {
function setRandomInterval(f, min, max) {
  setTimeout(function() {
    f();
    setRandomInterval(f, min, max)
  }, min + Math.random() * (max - min));
};
setRandomInterval(function(){document.querySelector("[aria-label='Next']").click();}, 68000, 88000);

})();
