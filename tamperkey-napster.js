
// ==UserScript==
// @name         Naspter
// @version      0.2.2
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

    
    var BEFORE_DURATION = 80;//                     will increase from 1-20;
    var REPEAT_NUMB = 200;//                          will increase from 1-5;
    var ADDED_EVENT = 0;
    var CORRECT_ARTIST = true;
	var play_loading = true;



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
    };



	function seekSliderBar(){
        var player = document.querySelector('[title="Next track"]');
		player.click();
        if(ADDED_EVENT!==1){
            player.addEventListener("onStateChange", function(state){
                if(state === 0){
                    
                        console.log(REPEAT_NUMB);
                        if(REPEAT_NUMB > 0){
                            setTimeout(seekSliderBar,(Math.floor(Math.random() * 20) + BEFORE_DURATION)*1000);
                        }else{
                            location.reload();
                        }
                        REPEAT_NUMB--;
                    
                }
            });

            ADDED_EVENT = 1;
        }
    };

    function run(){
        console.log("Naspter AutoPlay - MANAGER");

		setAutoPlay(true);console.log("Naspter setAutoPlay");
		setShuffle(true);console.log("Naspter setShuffle");
        setTimeout(seekSliderBar,(Math.floor(Math.random() * 20) + BEFORE_DURATION)*1000);
    };

    setTimeout(run, 5000);
})();

