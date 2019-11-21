
// ==UserScript==
// @name         Naspter
// @version      0.2
// @description  This script Autoplay Youtube
// @author       bjemtj
// @updateURL    https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamperkey-napster.js
// @downloadURL  https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamperkey-napster.js
// @match        *app.napster.com/**
// @run-at       document-start
// @grant        none
// @namespace http://tampermonkey.net/
// ==/UserScript==

(function() {
    'use strict';

    var ARTIST_ID = "PL_2SVRWG1wuP31KNu4sQPvtmL2Fc5JcZA";
    var BEFORE_DURATION = 60;//                     will increase from 1-20;
    var REPEAT_NUMB = 20;//                          will increase from 1-5;
    var ADDED_EVENT = 0;
    var CORRECT_ARTIST = true;

	//check pasue button loading
	//document.querySelector("#player-transport-controls > div.transport-top > div.player-play-button > div.player-loading")
	//class="player-loading active"
	function play_button(){
        var playElm = document.querySelector("#player-transport-controls > div.transport-top > div.player-play-button > div.player-loading");
        var checked = playElm.getAttribute("class");
		var toggle="player-loading"?true:false;
        if(toggle){
            location.reload();
        }
    };

	function setShuffle(toggle){
        var ShuffleElm = document.querySelector("#ember57");
        var checked = ShuffleElm.getAttribute("class");
        if(toggle == (checked=="shuffle-button icon-shuffle2 active ember-view"?false:true)){
            ShuffleElm.click();
        }
    };

    function setAutoPlay(toggle){
        var autoPlayElm = document.getElementById("ember53");
        var checked = autoPlayElm.getAttribute("title");
        if(toggle == (checked=="Repeat On"?false:true)){
            autoPlayElm.click();
        }
		//else{
		//	setAutoPlay(true);
		//}
    };


		function setRandomInterval(f, min, max) {
			setTimeout(function() {
				f();
				if(ADDED_EVENT!==1){
					setTimeout(play_button(), 20000);
					if(REPEAT_NUMB > 0){
						setRandomInterval(function(){document.querySelector('[title="Next track"]').click();}, 68000, 108000);
						
					}else{
                        location.reload();
                     }
                        REPEAT_NUMB--;
				}
				ADDED_EVENT = 1;
			}, min + Math.random() * (max - min));

		};


    function run(){
        console.log("YouTube AutoPlay - MANAGER");
		
		setAutoPlay(true);console.log("YouTube setAutoPlay");
		setShuffle(true);console.log("YouTube setShuffle");
        setRandomInterval(function(){document.querySelector('[title="Next track"]').click();}, 88000, 128000);
    };

    setTimeout(run, 10000);
})();

