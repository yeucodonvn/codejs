
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
	var temp_load = 0;
   function setRandomInterval(f, min, max) {
			
	};
	// thay the cho code cjs
	function next(){	
	        console.log("click next");
	      var repeatElm = document.querySelector('[class="player-advance-button icon-next2"][title="Next track"]');
        var loopClickRepeat = setInterval(function(){
			if(REPEAT_NUMB>0){
					clearInterval(loopClickRepeat);
                    repeatElm.click();
                    REPEAT_NUMB--;
			} else {location.reload();}
        }, 2000);
	};
	
	function clickshuffle(){	
	        console.log("click shuffleAll");
	      document.querySelector("#ember44 > a.shuffle-button.icon-shuffle2").click();
	};
	
	function loadidng(){
		
		console.log("check load");
        var loopClickRepeat = setInterval(function(){
            var load = document.querySelector(".playlist-radio-variety-row");
            if(load){
				clearInterval(loopClickRepeat);
				setTimeout(clickshuffle,10*1000);
				// thay the cho code cjs
				setInterval(next,128000);
            }else{
				console.log("loading");
				temp_load++;
				if(temp_load>20){location.reload();}
               //clearInterval(loopClickRepeat);
            }

        }, 2000);
	};

	function run() {
        console.log("napster AutoPlay - MANAGER");
	
        $(window).off('beforeunload.windowReload');
       	loadidng();
    };

    setTimeout(run, 5000);
})();
