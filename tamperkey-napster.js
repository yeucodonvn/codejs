
// ==UserScript==
// @name         Naspter
// @version      0.3
// @require  https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @description  This script Autoplay Naspter
// @author       yeucodon
// @updateURL    https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamperkey-napster.js
// @downloadURL  https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamperkey-napster.js
// @match        *app.napster.com/**
// @run-at       document-start
// @grant        none
// @namespace http://tampermonkey.net/
// ==/UserScript==

(function() {
    'use strict';

    var REPEAT_NUMB = 200;//                          will increase from 1-5;

   function setRandomInterval(f, min, max) {
			if(REPEAT_NUMB>0){
				setTimeout(function() {
					f();
					setRandomInterval(f, min, max)
				}, min + Math.random() * (max - min));
			} else {location.reload();}
				REPEAT_NUMB--;
	};
function clickshuffle(){	
	        console.log("click shuffleAll");
	      document.querySelector("#ember44 > a.shuffle-button.icon-shuffle2").click();
	};
	
function run() {
        console.log("Tidal AutoPlay - MANAGER");

        $(window).off('beforeunload.windowReload');
       	setTimeout(clickshuffle,10*1000);
		setInterval(search_footer_player,50*1000);
        setRandomInterval(function(){document.querySelector('[title="Next track"]').click();}, 88000, 128000);
    };

    setTimeout(run, 5000);
})();

