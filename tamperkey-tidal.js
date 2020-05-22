// ==UserScript==
// @name         Tidal
// @version      0.2.5
// @require  https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @description  This script Autoplay Tidal
// @author       yeucodon
// @updateURL    https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamperkey-tidal.js
// @downloadURL  https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamperkey-tidal.js
// @match        https://listen.tidal.com/*
// @run-at       document-start
// @grant        none
// @namespace http://tampermonkey.net/
// ==/UserScript==

(function() {
    'use strict';

    var REPEAT_NUMB = 200;        

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

			document.querySelector("[data-track--button-id='shuffleAll'][data-track--content-type='playlist']").click();
	};
	function search_footer_player(){	
	        console.log("search footer player");
		var searchft=document.querySelector("[data-test='footer-player'][data-track--module-id='footer_player']");
		if(searchft==null){
			clickshuffle();
			}
		
	};
	
	function run() {
        console.log("Tidal AutoPlay - MANAGER");

        $(window).off('beforeunload.windowReload');
       	setTimeout(clickshuffle,10*1000);
		setInterval(search_footer_player,50*1000);
        setRandomInterval(function(){document.querySelector('[title="Next"]').click()}, 88000, 128000);
    };

    setTimeout(run, 5000);

})();
