// ==UserScript==
// @name         deezer version 0.4.77
// @namespace    http://tampermonkey.net/
// @version      0.4.7

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
	var REPEAT_NUMB=200;
	/*// @re quire  	 https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
    	document.querySelector.ajax ( {
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
		document.querySelector('[class="states-button-action is-active"]').click();
		//setTimeout(pause,TIME_PLAY_DEEZER);
		setTimeout(seekt,5000);
	}
	if(playbtn()==2){seekt();}
}


function seekt(){
	let searchaudio = setInterval(function(){
		if(REPEAT_NUMB>0){
			//let tabsound = !!Array.prototype.find.call(document.querySelectorAll('audio,video'),function(elem){return elem.duration > 0 && !elem.paused});
			if(playbtn()==2){
				clearInterval(searchaudio);
				let duration = dzPlayer.duration;
				let rndplay = 90 + Math.floor(Math.random() * 30);
				let rndstart = Math.floor(Math.random() * (duration - rndplay - 5));
				console.log("start "+rndstart+" Play "+rndplay);
				//
				let seektime = (rndstart/duration);
				dzPlayer.control.seek(seektime);
				//
				setTimeout(function (duration){
					let rndend = Math.floor(duration*0.95);
					//console.log("rndend song "+rndend);
					dzPlayer.control.seek(0.95);
					let endtime = (duration-rndend-3);
					//console.log("endtime "+endtime);
					if(playbtn()!==2){
						document.querySelector("[aria-label='Next']").click();
						//clickPlay();
						setTimeout(seekt,2000);
					}else{
						//rnd_play_type(endtime*1000);
						//console.log("endtime song "+endtime);
						setTimeout(seekt,(endtime+3)*1000);
						REPEAT_NUMB--;
					}
				},rndplay*1000,duration);
			}
		} else {pause();}
	},2000);
};



function playbtn(){
	try{
		let x =0;
		let playbtn = document.querySelector('[class="states-button-action is-active"]').textContent.trim();
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
	let Shuffle= document.querySelector("[aria-label='Turn on Shuffle']")!==null;
	if(Shuffle)	{
		document.querySelector("[aria-label='Turn on Shuffle']").click();
	}
}
function pause(){
	 console.log("pause");
	 dzPlayer.control.pause();
		let looppause= setInterval(function(){
			if (playbtn() == 3) {
				window.location.reload(true);
				clearInterval(looppause);
			} else {
				//play_click();
				dzPlayer.control.pause();
			}
		},5000)
}


function error_dialog(){
	let errordialog= document.querySelector('[class="modal-dialog"]')!==null;
	if(errordialog)	{
		console.log("Click error dialog");
		document.querySelector('[class="btn btn-default"]').click();
	}
}
function run() {
        console.log("Deezer");

        //document.querySelector(window).off('beforeunload.windowReload');
		Shuffle();
		console.log(REPEAT_NUMB);
		let i = 0;
		let lopp= setInterval(function(){
			let btn= document.querySelector('[class="states-button-action is-active"]');
			if (btn!==null) {
				setTimeout(play,10*1000);
				setInterval(error_dialog,50*1000);
				clearInterval(lopp);
			}
			i++;
			if (i>10) {
				clearInterval(lopp);
			}
		},2000) ;
    };

    setTimeout(run, 5000);

})();