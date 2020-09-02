// ==UserScript==
// @name         deezer
// @namespace    http://tampermonkey.net/
// @version      0.4.4
// @require  	 https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @updateURL    https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamperkey-deezer.js
// @downloadURL  https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamperkey-deezer.js
// @description  try to take over the world!
// @author       You
// @match        https://www.deezer.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
	
	var PARAMS;	
	var TIME_PLAY_DEEZER=9000000;
	/*
    	$.ajax ( {
        type:       'GET',
        url:        'https://gitlab.com/copcoi/codejs/-/raw/master/yt-parameters.json',
        dataType:   'JSON',
        success:    function (apiJSON) {
            PARAMS = apiJSON;
		TIME_PLAY_DEEZER=PARAMS.TIME_PLAY_DEEZER;
        },
        error:      function(err){
            alert("Cannot load JSON file");
            alert(err);
        }
    } );*/
	
	
	/*
	https://greasyfork.org/en/scripts/397299-deezer-media-session-support/code
	dzPlayer
	dzPlayer.position
	dzPlayer.duration
	dzPlayer.control.pause;
	dzPlayer.control.setRepeat(1);
	dzPlayer.control.seek(0.5); 0.5 =	50%
	
	*/
	
	
function play(){
	 console.log("play");
	var play = document.querySelector("[aria-label='Next']").click();
	setTimeout(pause,TIME_PLAY_DEEZER);
}

function Shuffle(){
	 console.log("Shuffle");
	var Shuffle= document.querySelector("[aria-label='Turn on Shuffle']")!==null;
	if(Shuffle)	{
		document.querySelector("[aria-label='Turn on Shuffle']").click();
	}
}
function pause(){
	 console.log("pause");
	var repeatElm = document.querySelector("[class='svg-icon-group-btn is-highlight']");
	var repeatLabel = repeatElm.getAttribute("aria-label");
	if(repeatLabel == "Pause"){
	repeatElm.click();
		setTimeout(reload,10*1000);
	}
}

function reload(){
	 console.log("reload");
	var repeatElm = document.querySelector("[class='svg-icon-group-btn is-highlight']");
	var repeatLabel = repeatElm.getAttribute("aria-label");
	if(repeatLabel == "Play"){
		window.location.reload();
	}
}

function error_dialog(){	 
	var errordialog= document.querySelector('[class="modal-dialog"]')!==null;
	if(errordialog)	{
		console.log("Click error dialog");
		document.querySelector('[class="btn btn-default"]').click();
	}
}
function run() {
        console.log("Deezer");

        $(window).off('beforeunload.windowReload');
		Shuffle();
		console.log(TIME_PLAY_DEEZER);
       	setTimeout(play,10*1000);
		setInterval(error_dialog,50*1000);
    };

    setTimeout(run, 5000);

})();
