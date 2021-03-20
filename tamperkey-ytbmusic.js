// ==UserScript==
// @name         YouTube AutoPlay - version 0.8.3
// @version      0.8.3

// @description  This script Autoplay Youtube
// @author       bjemtj
// @updateURL    https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamperkey-ytbmusic.js
// @downloadURL  https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamperkey-ytbmusic.js
// @match        *music.youtube.com/*
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

    let urlarr = ["PL_2SVRWG1wuMy0t89RN7jijHIZIDxmlkb"];
    //list cu  ["PL_2SVRWG1wuOjG3LBABwWsKo9Kw66UcwY","PL_2SVRWG1wuPaI5iK90pwo5u3fiqlA_3E"];

	/*// @require  	 https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
    var URLsc;
    $.ajax ( {
		type:       'GET',
		url:        'https://raw.githubusercontent.com/yeucodonvn/codejs/master/URL.json',
		dataType:   'JSON',
		success:    function (apiJSON) {
			let PARAMS = apiJSON;
			URLsc=PARAMS.ytb;
		},
		error:      function(err){
			alert("Cannot load JSON file");
			alert(err);
		}
	});
    */

    /*
    search URL tồn tại key list
    get array list từ json
    so sánh để lấy ID list, nextx list tiếp lần f5 tiếp theo
    var ojb = {
    "ytb" : ["PL_2SVRWG1wuOjG3LBABwWsKo9Kw66UcwY","PL_2SVRWG1wuPaI5iK90pwo5u3fiqlA_3E"],
    "apple" : ["pl.u-55D6ZJ1H6MDX680","url2","url3"]
            }
    ;alert(ojb.ytb.indexOf('PL_2SVRWG1wuPaI5iK90pwo5u3fiqlA_3E'));

    var obj= ytbartist.json;
    for (i in obj.song) {
        let name = obj.artist[i].name;
        for (j in obj.artist[i].song) {
          let songname=  obj.artist[i].song[j];
        }
    }
    let song ="Sleep In Her Rodeo"
        let cli= document.querySelector('[title="'+song+'"]');
        if (cli!==null) {
            document.querySelector("#play-button").click();
        }else{//next search
            "https://music.youtube.com/search?q=%22"+songname+"%22%2B%22"+name+"%22"
        }

    */
    function setShufflealbum(){
        let Shufflealbum = document.querySelector('.style-scope.yt-button-renderer[aria-label="Shuffle"],[aria-label="PLAY ALL"]');
		let autdioo = !!Array.prototype.find.call(document.querySelectorAll('audio,video'),function(elem){return elem.duration > 0 && !elem.paused});
		if(Shufflealbum!==null&& autdioo==false){
			console.log(Shufflealbum);
			Shufflealbum.click();
		}
    };
	function setShuffle(){
		console.log("set Shuffle");
        let element = document.querySelector(".shuffle.style-scope.ytmusic-player-bar");
		element.click();
    };

    function setRepeatAll(){
		console.log("set RepeatAll");
        let repeatElm = document.querySelector(".repeat.style-scope.ytmusic-player-bar");
        let loopClickRepeat = setInterval(function(){
            let repeatLabel = repeatElm.getAttribute("aria-label");
            if(repeatLabel == "Repeat all"){
                clearInterval(loopClickRepeat);
            }else{
                repeatElm.click();
            }

        }, 2000);
    };

    function hmsToSecondsOnly(str) {
        let p = str.split(':'),
            s = 0, m = 1;

        while (p.length > 0) {
            s += m * parseInt(p.pop(), 10);
            m *= 60;
        }

        return s;
    };
//"sr-Cyrl-RS"

    function seekSliderBar(gotoPercent, listenDuration){
        let ytplayer = document.getElementById("movie_player");

		if(SEEK_EVENT){
			let totalDuration = hmsToSecondsOnly(document.querySelector('.time-info.style-scope.ytmusic-player-bar').textContent.split(" / ")[1].trim());
            ytplayer.seekTo(totalDuration * gotoPercent, true);
        }

        if(ADDED_EVENT!==1){
            ytplayer.addEventListener("onStateChange", function(state){	//https://freetuts.net/ham-addeventlistener-trong-javascript-374.html		chỗ này để cập nhật mỗi khi chạy next bài mới
                if(state === 0){
                        console.log(REPEAT_NUMB);
                        if(REPEAT_NUMB > 0){
                            clickLike();
							let loopGetDuration = setInterval(function(){
                                //console.log("Get duration");
                                let totalDuration = hmsToSecondsOnly(document.querySelector('.time-info.style-scope.ytmusic-player-bar').textContent.split(" / ")[1].trim());
                                if(totalDuration > 0 && totalDuration < 1000){
                                    let rndStart = Math.floor(Math.random() * (parseInt(totalDuration) - parseInt(listenDuration) - 5));
                                    console.log("Total "+totalDuration+" - Start from " + rndStart);
                                    let ytplayer = document.getElementById("movie_player");
                                    setTimeout(ytplayer.seekTo, 5000, rndStart, true);
                                    clearInterval(loopGetDuration);
                                }
                            }, 1000);
                            let rndDuration = (Math.floor(Math.random() * LISTEN_DURATION_RANGE) + LISTEN_DURATION);
                            setTimeout(seekSliderBar, rndDuration*1000, GOTO_PERCENT, rndDuration);
                        }else{
							stopvideo(ytplayer);
                        }
                        REPEAT_NUMB--;
                }
            });

            ADDED_EVENT = 1;
        }
    };
    function stopvideo(ytplayer) {
        ytplayer.stopVideo();
        setTimeout(function () {
        // if(urlarr.length>1){
        //     let currenturl=window.location.href;
        //     urlarr.forEach(element => {
        //         if(currenturl.search(element)>-1){
        //             let indexurl = urlarr.indexOf(element);
        //             let tempurl ;
        //             (indexurl<urlarr.length-1) ?tempurl=urlarr[indexurl+1]:tempurl=urlarr[0];
        //             window.location.href = 'https://music.youtube.com/playlist?list='+tempurl;
        //         }
        //     });
        // }else{window.location.href = 'https://music.youtube.com/playlist?list='+urlarr[0];};
        location.reload(true);
        },5000);
    }

    function clickLike(){
        let loopClickLikeRepeat = setInterval(function(){
            let btnRender = document.getElementById("like-button-renderer");
            if(btnRender != null){
                if(Math.floor(Math.random() * 15) > 10){
                    console.log("Like Click");
                    btnRender.querySelector('[aria-label="Like"]').click();
                }
                clearInterval(loopClickLikeRepeat);
            }
        },5 * 1000);
    }
	function checkplayerpage(){
		let Shufflealbum = document.querySelector('.style-scope.yt-button-renderer[aria-label="Shuffle"]');
        let repeatElm = document.querySelector("#player-page");
        let repeatLabel = repeatElm.getAttribute("style");
            if(Shufflealbum !==null &&repeatLabel == "visibility: hidden;"){
				console.log("player-page");
                Shufflealbum.click();
            }
    };
	function checkVideoPaused(){
        setInterval(function(){
            let yesBtn = document.querySelector(".style-scope.yt-button-renderer.style-blue-text[id='button']");
            if(yesBtn){
                yesBtn.click();
            }
        },60 * 1000);

    };
	var intcheck=0;
	function checkspinloader(){
        setInterval(function(){
			let autdioo = !!Array.prototype.find.call(document.querySelectorAll('audio,video'),function(elem){return elem.duration > 0 && !elem.paused});
			let spinloader = document.querySelector('.play-pause-button-spinner.style-scope.ytmusic-player-bar');
			let gethidden=spinloader.getAttribute("aria-hidden");
            if(!gethidden || autdioo==false){
                document.querySelector('[aria-label="Next song"]').click();
				console.log("check spin loader");
				intcheck++;
            }
			if(intcheck>30)(location.reload(true));
        },60 * 1000);
    };

	function running() {
		console.log("PLAY");
        setShufflealbum();
        let loopGetDuration_First = setInterval(function(){
            //console.log("Get duration");
            let totalDuration_First = hmsToSecondsOnly(document.querySelector('.time-info.style-scope.ytmusic-player-bar').textContent.split(" / ")[1].trim());
            if(totalDuration_First > 0 && totalDuration_First < 1000){
                let rndDuration_First = (Math.floor(Math.random() * LISTEN_DURATION_RANGE) + LISTEN_DURATION);
                let rndStart_First = Math.floor(Math.random() * (parseInt(totalDuration_First) - parseInt(rndDuration_First) - 5));
                console.log("Total "+totalDuration_First+" - Start from " + rndStart_First);
                let ytplayer = document.getElementById("movie_player");
                setTimeout(ytplayer.seekTo, 5000, rndStart_First, true);
                setTimeout(seekSliderBar, rndDuration_First*1000, GOTO_PERCENT, rndDuration_First);
                clearInterval(loopGetDuration_First);
            }
        },2000);
		setTimeout(checkplayerpage,60*1000);
        setTimeout(() => {
            setRepeatAll();
            setShuffle()//setTimeout(setShuffle(),2000,2000);
            checkVideoPaused();
		    checkspinloader()
		    clickLike();
        }, 10000);
    };
    function run() {
        console.log("YouTube AutoPlay - MANAGER");
		// $(window).off('beforeunload.windowReload');
        let Shufflealbum = document.querySelector('.style-scope.yt-button-renderer');
		if(Shufflealbum==null){
			console.log("wait 40s");
			setTimeout(running,40*1000);
		}
		else {	setTimeout(running,20*1000);	};
    };

    setTimeout(run, 5000);
})();
