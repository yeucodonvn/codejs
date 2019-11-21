
// ==UserScript==
// @name         YouTube AutoPlay - MANAGER
// @version      0.2.5
// @description  This script Autoplay Youtube
// @author       bjemtj
// @match        *music.youtube.com/playlist?list=*
// @run-at       document-start
// @grant        none
// @namespace http://tampermonkey.net/
// ==/UserScript==

(function() {
    'use strict';

    var ARTIST_ID = "PL_2SVRWG1wuP31KNu4sQPvtmL2Fc5JcZA";
    var BEFORE_DURATION = 60;//                     will increase from 1-20;
    var REPEAT_NUMB = 200;//                          will increase from 1-5;
    var ADDED_EVENT = 0;
    var CORRECT_ARTIST = true;

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

    function seekSliderBar(per){
        var ytplayer = document.getElementById("movie_player");

        ytplayer.seekTo(ytplayer.getDuration()*per, true);
        if(ADDED_EVENT!==1){
            ytplayer.addEventListener("onStateChange", function(state){
                if(state === 0){
                    if(CORRECT_ARTIST){
                        console.log(REPEAT_NUMB);
                        if(REPEAT_NUMB > 0){
                            setTimeout(seekSliderBar,(Math.floor(Math.random() * 20) + BEFORE_DURATION)*1000, 0.9);
                        }else{
                           location.reload();
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



    function run() {
        console.log("YouTube AutoPlay - MANAGER");
		setShufflealbum();
        setRepeatAll();
		setShuffle()			//setTimeout(setShuffle(),2000,2000);

        setTimeout(seekSliderBar,(Math.floor(Math.random() * 20) + BEFORE_DURATION)*1000, 0.9);
    };

    setTimeout(run, 5000);
})();
