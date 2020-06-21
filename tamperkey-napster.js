// ==UserScript==
// @name         Naspter
// @version      0.3.2
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

	function next(){	
	        console.log("click next");
	      var repeatElm = document.querySelector('[class="player-advance-button icon-next2"][title="Next track"]');
		if(REPEAT_NUMB>0){
		clearInterval(loopClickRepeat);
                    repeatElm.click();
                    REPEAT_NUMB--;
		var min = 88,
			max = 128;
		var rand = min + Math.floor(Math.random() * (max - min));  // min +  Math.random() từ 0 đến  max - min và + thêm min, Math.floor lấy số tự nhiên
		console.log(rand);
		setTimeout(next,rand*1000);				
		} else {location.reload();}
	};
	function setRepeatAll(){
		console.log("Click Repeat");
        var repeatElm = document.querySelector('#ember53');
        var loopClickRepeat = setInterval(function(){
            if(repeatElm !== null){
                var repeatLabel = repeatElm.getAttribute("title");
                if(repeatLabel == "Repeat On"){
                    clearInterval(loopClickRepeat);
                }else{
                    repeatElm.click();
                }
            }
        }, 2000);
    };

	function clickshuffle(){	
	        console.log("click shuffleAll");
	      document.querySelector("#ember44 > a.shuffle-button.icon-shuffle2").click();
		  setRepeatAll();
	};

	function loadidng(){
		console.log("check load");
        var loopClickRepeat = setInterval(function(){
            var load = document.querySelector(".playlist-radio-variety-row");
            if(load){
				clearInterval(loopClickRepeat);
				setTimeout(clickshuffle,10*1000);
				// thay the cho code cjs
				setTimeout(next,(Math.floor(Math.random() * (128 - 88))+88)*1000);
				setInterval(checkstop,40*1000);
				setInterval(checkloading,40*1000);
            }else{
				console.log("loading");
				temp_load++;
				if(temp_load>20){location.reload();}
               //clearInterval(loopClickRepeat);
            }

        }, 5000);
	};
	//check load
	var checkloadingtemp=0;
	function checkloading() {
		var loopClickRepeat = setInterval(function(){
			var loadingactiv =	document.querySelector(".player-loading.active");
			if(loadingactiv){
			console.log("checkstop");
			checkloadingtemp++;
				if(checkloadingtemp>5){
					console.log("loading active");
					document.querySelector('[class="player-advance-button icon-next2"][title="Next track"]').click();
					if(checkloadingtemp>20){location.reload();}
					
				}
			}
			else{
				clearInterval(loopClickRepeat);
				checkloadingtemp=0;
				}
        }, 5000);		
    };
	
	
	function checkstop() {        
		var playbtn =	document.querySelector('.icon-pause2[title="Pause"]');
		var times =	document.querySelector('.player-time').textContent;
			var p = times.split('/').shift();
		if(playbtn && p=="0:00"){
			console.log("checkstop");
			document.querySelector('[class="player-advance-button icon-next2"][title="Next track"]').click();
		}		
    };
	function run() {
        console.log("napster AutoPlay - MANAGER");
	
        $(window).off('beforeunload.windowReload');
       	loadidng();
    };

    setTimeout(run, 5000);
})();
