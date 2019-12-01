// ==UserScript==
// @name         apple
// @namespace    http://tampermonkey.net/
// @version      1.2
// @updateURL    https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamperkey-apple.js
// @downloadURL  https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamperkey-apple.js
// @description  try to take over the world!
// @author       You
// @match        https://beta.music.apple.com/*
// @grant        none
// ==/UserScript==

(function() {
    function setRandomInterval(f, min, max) {
  setTimeout(function() {
    f();
    setRandomInterval(f, min, max)
  }, min + Math.random() * (max - min));
};
setRandomInterval(function(){document.querySelector('[aria-label="Next"]').click()}, 880000, 1200000);
})();
