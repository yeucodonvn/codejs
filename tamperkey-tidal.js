
// ==UserScript==
// @name         Naspter
// @version      0.2.4
// @description  This script Autoplay Naspter
// @author       yeucodon
// @updateURL    https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamperkey-tidal.js
// @downloadURL  https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamperkey-tidal.js
// @match        *app.napster.com/**
// @run-at       document-start
// @grant        none
// @namespace http://tampermonkey.net/
// ==/UserScript==

(function() {
    'use strict';

    var REPEAT_NUMB = 2;//                          will increase from 1-5;

   function setRandomInterval(f, min, max) {
			if(REPEAT_NUMB>0){
				setTimeout(function() {
					f();
					setRandomInterval(f, min, max)
				}, min + Math.random() * (max - min));
			} else {location.reload();}
				REPEAT_NUMB--;
	};
setRandomInterval(function(){document.querySelector('[title="Next"]').click()}, 88000, 128000);
})();