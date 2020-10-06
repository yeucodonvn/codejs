// ==UserScript==
// @name         deezer
// @namespace    http://tampermonkey.net/
// @version      0.4.6

// @updateURL    https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamperkey-deezer.js
// @downloadURL  https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamperkey-deezer.js
// @description  try to take over the world!
// @author       You
// @match        *.deezer.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
	
	var PARAMS;	
	var TIME_PLAY_DEEZER=9000000;
	/*// @re quire  	 https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
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
	if(playbtn()==1){
		play_click();
		document.querySelector("[aria-label='Next']").click();
		setTimeout(pause,TIME_PLAY_DEEZER);
		}
}
function play_click(){
	try{
		 document.querySelector('[class="states-button-action is-active"]').click();
	}
	catch(err) {
		console.log("lỗi play_click "+err.message )
	};
}
function playbtn(){
	try{
		var x =0;
		var playbtn = document.querySelector('[class="states-button-action is-active"]').textContent.trim();
		switch(playbtn){
			case "Listen": return x=1;
			case "Now Playing": return x=2;
			case "Pause": return x=3;
			case "Resume": return x=4;
		}
	}
	catch(err) {
		console.log("lỗi "+err.message )
	};
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
	if (playbtn() == 2) {
		play_click();
		setTimeout(window.location.reload(true), 10 * 1000);
	} else {
		setTimeout(window.location.reload(true), 10 * 1000);
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

        //$(window).off('beforeunload.windowReload');
		Shuffle();
		console.log(TIME_PLAY_DEEZER);
       	setTimeout(play,10*1000);
		setInterval(error_dialog,50*1000);
    };

    setTimeout(run, 5000);

})();
