// ==UserScript==
// @name         Apple Music AutoPlay - MANAGER
// @version      1.7.5
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
                    repeatElm.click();
                    /*setTimeout(function(){
                        var playBtn = document.querySelector(".button-reset.web-chrome-playback-controls__playback-btn[aria-label='Play']");
                        if(playBtn == null){
                           clearInterval(loopClickRepeat);
                        }
                    },5000);*/
					clearInterval(loopClickRepeat);
                }
            }

        }, 10000);
    };

	function searchplaybtn(){
		var playBtn = document.querySelector(".button-reset.web-chrome-playback-controls__playback-btn[aria-label='Play']");
        if(playBtn != null){
			//playBtn.click();
			var nexttElm = document.querySelector(".button-reset.web-chrome-playback-controls__playback-btn[aria-label='Next']");
			nexttElm.click();
			console.log("search play click next");
        }
    };

	function searchplaydisable(){
		var playbtn = document.querySelector('[data-test-playback-control-play]');
		if(playbtn){
			var nextbtn = document.querySelector('[data-test-playback-control-next]');
			var getplay=playbtn.getAttribute("disabled");
			var getnext=playbtn.getAttribute("disabled");
			if(getplay&&getnext){
				location.reload();
			cons	ole.log("check disabled button ok");
			}
		}
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
		//document.querySelector("#ember41 > div.album-header-metadata > h1").innerHTML = 'alexalex2019 đã next '+REPEAT_tmp+" bài";
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
		setTimeout(clickNext_first,30*1000);
        setTimeout(setRepeatAll,10*1000);
        setInterval(clickNext,120*1000);
		setInterval(searchplaybtn,50*1000);
		setInterval(searchplaydisable,20*60*1000);
    };

    setTimeout(run, 5000);
})();
