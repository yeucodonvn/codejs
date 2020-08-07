// ==UserScript==
// @name         YouTube AutoPlay - MANAGER
// @version      0.6
// @require  	 https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @description  This script Autoplay Youtube
// @author       bjemtj
// @updateURL    https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamperkey-ytbmusic.js
// @downloadURL  https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamperkey-ytbmusic.js
// @match        *music.youtube.com/playlist?list=*
// @run-at       document-start
// @grant        none
// @namespace	 https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamperkey-ytbmusic.js
// ==/UserScript==

(function() {
    'use strict';
	
	var PARAMS;
	var ADDED_EVENT = 0;
	var CORRECT_ARTIST = true;
	var REPEAT_NUMB = 100;
	var SEEK_EVENT=true;
	var LISTEN_DURATION_RANGE=10;
	var LISTEN_DURATION=60;
	var GOTO_PERCENT=0.9;
	var ARTIST_ID='PL_2SVRWG1wuNYWc4mYWLmg_rIxqnG97Pi';
	/*
    $.ajax ( {
        type:       'GET',
        url:        'https://gitlab.com/copcoi/codejs/-/raw/master/yt-parameters.json',
        dataType:   'JSON',
        success:    function (apiJSON) {
            PARAMS = apiJSON;
			REPEAT_NUMB = (Math.floor(Math.random() * PARAMS.REPEAT_TIMES_RANGE) + PARAMS.REPEAT_TIMES);
			SEEK_EVENT = PARAMS.SEEK_EVENT;
			LISTEN_DURATION_RANGE = PARAMS.LISTEN_DURATION_RANGE;
			LISTEN_DURATION = PARAMS.LISTEN_DURATION;
			GOTO_PERCENT = PARAMS.GOTO_PERCENT;
			ARTIST_ID = PARAMS.ARTIST_ID;
        },
        error:      function(err){
            alert("Cannot load JSON file");
            alert(err);
        }
    } );*/


    function setShufflealbum(){
        var element = document.querySelector('[aria-label="Shuffle"]');
		element.click();
    };
	function setShuffle(){
        var element = document.querySelector(".shuffle.style-scope.ytmusic-player-bar");
		element.click();
    };

    function setRepeatAll(){
        var repeatElm = document.querySelector(".repeat.style-scope.ytmusic-player-bar");
        var loopClickRepeat = setInterval(function(){
            var repeatLabel = repeatElm.getAttribute("aria-label");
            if(repeatLabel == "Repeat all"){
                clearInterval(loopClickRepeat);
            }else{
                repeatElm.click();
            }

        }, 2000);
    };

    function hmsToSecondsOnly(str) {
        var p = str.split(':'),
            s = 0, m = 1;

        while (p.length > 0) {
            s += m * parseInt(p.pop(), 10);
            m *= 60;
        }

        return s;
    };

    function seekSliderBar(gotoPercent, listenDuration){
        var ytplayer = document.getElementById("movie_player");
		
		if(SEEK_EVENT){
            var totalDuration = hmsToSecondsOnly(document.querySelector('.time-info.style-scope.ytmusic-player-bar').textContent.split(" / ")[1].trim());
            ytplayer.seekTo(totalDuration * gotoPercent, true);
        }

        if(ADDED_EVENT!==1){
            ytplayer.addEventListener("onStateChange", function(state){
                if(state === 0){
                    if(CORRECT_ARTIST){
                        console.log(REPEAT_NUMB);
                        if(REPEAT_NUMB > 0){
                            clickLike();

                            var loopGetDuration = setInterval(function(){
                                //console.log("Get duration");
                                var totalDuration = hmsToSecondsOnly(document.querySelector('.time-info.style-scope.ytmusic-player-bar').textContent.split(" / ")[1].trim());
                                if(totalDuration > 0 && totalDuration < 1000){
                                    var rndStart = Math.floor(Math.random() * (parseInt(totalDuration) - parseInt(listenDuration) - 5));
                                    console.log("Total "+totalDuration+" - Start from " + rndStart);
                                    var ytplayer = document.getElementById("movie_player");
                                    setTimeout(ytplayer.seekTo, 5000, rndStart, true);
                                    clearInterval(loopGetDuration);
                                }
                            }, 1000);
                            var rndDuration = (Math.floor(Math.random() * LISTEN_DURATION_RANGE) + LISTEN_DURATION);
                            setTimeout(seekSliderBar, rndDuration*1000, GOTO_PERCENT, rndDuration);
                        }else{
				localStorage.clear();
                           location.reload(true);
                        }
                        REPEAT_NUMB--;
                    }else{
                        window.location.href = 'https://music.youtube.com/playlist?list='+ARTIST_ID;
                    }
                }
            });

            ADDED_EVENT = 1;
        }
    };

    function clickLike(){
        var loopClickLikeRepeat = setInterval(function(){
            var btnRender = document.getElementById("like-button-renderer");
            if(btnRender != null){
                if(Math.floor(Math.random() * 15) > 10){
                    console.log("Like Click");
                    btnRender.querySelector('[aria-label="Like"]').click();
                }
                clearInterval(loopClickLikeRepeat);
            }
        },5 * 1000);
    }

	function checkVideoPaused(){
        setInterval(function(){
            var yesBtn = document.querySelector(".style-scope.yt-button-renderer.style-blue-text[id='button']");
            if(yesBtn){
                yesBtn.click();
            }
        },60 * 1000);

    };
	function checkspinloader(){
        setInterval(function(){
            var spinloader = document.querySelector('.play-pause-button-spinner.style-scope.ytmusic-player-bar');
			var gethidden=spinloader.getAttribute("aria-hidden");
            if(!gethidden){
                document.querySelector('[aria-label="Next song"]').click();
				console.log("check spin loader");
            }
        },60 * 1000);

    };
	function running() {
		setShufflealbum();
        setRepeatAll();
		setShuffle()			//setTimeout(setShuffle(),2000,2000);
		checkVideoPaused();
		checkspinloader()
		clickLike();
         var loopGetDuration_First = setInterval(function(){
            //console.log("Get duration");
            var totalDuration_First = hmsToSecondsOnly(document.querySelector('.time-info.style-scope.ytmusic-player-bar').textContent.split(" / ")[1].trim());
            if(totalDuration_First > 0 && totalDuration_First < 1000){
                var rndDuration_First = (Math.floor(Math.random() * LISTEN_DURATION_RANGE) + LISTEN_DURATION);
                var rndStart_First = Math.floor(Math.random() * (parseInt(totalDuration_First) - parseInt(rndDuration_First) - 5));
                console.log("Total "+totalDuration_First+" - Start from " + rndStart_First);
                var ytplayer = document.getElementById("movie_player");
                setTimeout(ytplayer.seekTo, 5000, rndStart_First, true);
                setTimeout(seekSliderBar, rndDuration_First*1000, GOTO_PERCENT, rndDuration_First);
                clearInterval(loopGetDuration_First);
            }
        },2000);
    };
    function run() {
        console.log("YouTube AutoPlay - MANAGER");
		 $(window).off('beforeunload.windowReload');
       	var previewbtn=document.querySelector('[aria-label="Shuffle"]');
		if(previewbtn!==null){
			console.log("wait 30s");
			setTimeout(running,30*1000);
		}
		else {	setTimeout(running,10*1000);	};
    };

    setTimeout(run, 5000);
})();
