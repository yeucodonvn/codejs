// ==UserScript==
// @name         apple
// @namespace    http://tampermonkey.net/
// @version      1.4
// @require  https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
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
    setRandomInterval(function(){document.querySelector("#ember21 > div > div.web-chrome-playback-controls__main > button:nth-child(3)").click()}, 880000, 1200000);
//setRandomInterval(function(){document.querySelector('[aria-label="Next"]').click()}, 880000, 1200000);
})();
