// ==UserScript==
// @name         Apple Music AutoPlay - MANAGER
// @version      1.5
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
        var repeatElm = document.querySelector(".button-reset.web-chrome-playback-controls__secondary-btn[aria-label='Repeat']");
        var loopClickRepeat = setInterval(function(){
            if(repeatElm !== null){
                var repeatLabel = repeatElm.getAttribute("aria-label");
                if(repeatLabel == "**FUSE.Repeat.All**"){
                    clearInterval(loopClickRepeat);
                }else{
                    repeatElm.click();
                }
            }

        }, 2000);
    };
    function clickPlay(){
        var repeatElm = document.querySelector(".shuffle-button.action-button.typ-label-medium.typography-label-emphasized.button-reset.ember-view[aria-label='Shuffle']");
        var loopClickRepeat = setInterval(function(){
            if(repeatElm !== null){
                var repeatLabel = repeatElm.getAttribute("aria-label");
                console.log(repeatElm);
                if(repeatLabel == "Shuffle"){
                    repeatElm.click();
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
	    console.log("Click Next First");
        var repeatElm = document.querySelector(".button-reset.web-chrome-playback-controls__playback-btn[aria-label='Next']");
        repeatElm.click();
    };

    function clickNext(){
        console.log("Click Next");
        var repeatElm = document.querySelector(".button-reset.web-chrome-playback-controls__playback-btn[aria-label='Next']");
        var loopClickRepeat = setInterval(function(){
            if(repeatElm !== null){
                var repeatLabel = repeatElm.getAttribute("aria-label");
                if(repeatLabel == "Next"){
                    clearInterval(loopClickRepeat);
                    repeatElm.click();
                    REPEAT_NUMB--;
                }
                if(REPEAT_NUMB<0){
                    window.location.reload();
                }
            }
        }, 2000);
    };
    var REPEAT_NUMB = 300;
    function run() {
        console.log("Apple Music AutoPlay - MANAGER");

        $(window).off('beforeunload.windowReload');
        clickPlay();
        setRepeatAll();
		setTimeout(clickNext_first,30*1000);
        setInterval(clickNext,120*1000);
    };

    setTimeout(run, 5000);
})();
