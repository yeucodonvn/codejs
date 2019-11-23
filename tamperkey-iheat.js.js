// ==UserScript==
// @name         iheart
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @downloadURL  https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamperkey-iheat.js
// @downloadURL  https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamperkey-iheat.js
// @match        https://www.iheart.com/playlist/*
// @grant        none
// ==/UserScript==

(function() {
function setRandomInterval(f, min, max) {
  setTimeout(function() {
    f();
    setRandomInterval(f, min, max)
  }, min + Math.random() * (max - min));
};
setRandomInterval(function(){document.querySelector('[data-test="skip-button"]').click();}, 88000, 128000);
setRandomInterval(function(){document.querySelector('[data-test="play-button"]').click();}, 29000000, 29000000);

})();