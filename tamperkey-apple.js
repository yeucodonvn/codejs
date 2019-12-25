// ==UserScript==
// @name         Apple Music AutoPlay - MANAGER
// @version      1.7.1
// @description  This script Autoplay Apple Music
// @author       bjemtj
// @match        *https://beta.music.apple.com/*
// @run-at       document-start
// @updateURL    https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamperkey-apple.js
// @downloadURL  https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamperkey-apple.js
// @grant        none
// @require  https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @namespace http://tampermonkey.net/
// ==/UserScript==

(function() {
    'use strict';

    function setRepeatAll(){
		console.log("Click Repeat");
        var repeatElm = document.querySelector(".button-reset.web-chrome-playback-controls__secondary-btn[aria-label='Repeat']");
        var loopClickRepeat = setInterval(function(){
            if(repeatElm !== null){
                var repeatLabel = repeatElm.getAttribute("aria-label");
                if(repeatLabel == "Repeat all"){
                    clearInterval(loopClickRepeat);
                }else{
                    repeatElm.click();
                }
            }

        }, 2000);
    };
    function clickPlay(){
	console.log("Click Play");
	
        var repeatElm = document.querySelector(".shuffle-button.action-button.typ-label-medium.typography-label-emphasized.button-reset.ember-view[aria-label='Shuffle']");
        var loopClickRepeat = setInterval(function(){
            if(repeatElm !== null){
                var repeatLabel = repeatElm.getAttribute("aria-label");
                console.log(repeatElm);
                if(repeatLabel == "Shuffle"){
                    //repeatElm.click();
			var xPathRes = document.evaluate ('/html/body/div[2]/div[4]/div/div[2]/div/div/div[1]/div[2]/div[1]/div[2]/button[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
				xPathRes.singleNodeValue.click();
                    setTimeout(function(){
                        var playBtn = document.querySelector(".button-reset.web-chrome-playback-controls__playback-btn[aria-label='Play']");
                        if(playBtn == null){
                            clearInterval(loopClickRepeat);
                        }
                    },5000);
                }
            }

        }, 10000);
    };
	function clickNext_first(){
	    console.log("Click First Next");
        var repeatElm = document.querySelector(".button-reset.web-chrome-playback-controls__playback-btn[aria-label='Next']");
        repeatElm.click();
    };

	function clickstop(){
	    console.log("Click Stop");
		setTimeout(function(){
             var repeatElm = document.querySelector(".button-reset.web-chrome-playback-controls__playback-btn[aria-label='Pause']");
             if(repeatElm !== null){
                  repeatElm.click();
              }
         },5000);
    };
	var REPEAT_tmp = 1;
    function clickNext(){
        console.log("Click Next");
	document.querySelector("#ember40 > div.album-header-metadata > h1").innerHTML = "alexalex2019 Da Play "+REPEAT_tmp;
        var repeatElm = document.querySelector(".button-reset.web-chrome-playback-controls__playback-btn[aria-label='Next']");
        var loopClickRepeat = setInterval(function(){
            if(repeatElm !== null){
                var repeatLabel = repeatElm.getAttribute("aria-label");
                if(repeatLabel == "Next"){
                    clearInterval(loopClickRepeat);
                    repeatElm.click();
                    REPEAT_NUMB--;
		    REPEAT_tmp++;
                }
                if(REPEAT_NUMB<0){
			clickstop();
			setTimeout(function (){window.location.reload();},20*1000);
                }
            }
        }, 2000);
    };

    var REPEAT_NUMB = 200;
    function run() {
        console.log("Apple Music AutoPlay - MANAGER");

        $(window).off('beforeunload.windowReload');
       	setTimeout(clickPlay,10*1000);
        setRepeatAll();
		setTimeout(clickNext_first,30*1000);
        setInterval(clickNext,150*1000);
    };

    setTimeout(run, 5000);
})();
