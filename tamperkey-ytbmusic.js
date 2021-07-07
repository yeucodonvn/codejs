// ==UserScript==
// @name         YouTube AutoPlay - version 0.9
// @version      0.9.1
// @description  This script Autoplay Youtube
// @author       bjemtj
// @updateURL    https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamperkey-ytbmusic.js
// @downloadURL  https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamperkey-ytbmusic.js
// @match        *music.youtube.com/*
// @run-at       document-start
// @grant        none
// @namespace	 https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamperkey-ytbmusic.js
// @require  	 https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// ==/UserScript==

(function() {
    'use strict';

	var PARAMS;
    var PARAMSURL;
	var ADDED_EVENT = 0;
	var REPEAT_NUMB;
	var SEEK_EVENT=true;
	var LISTEN_DURATION_RANGE=10;
    var YTB_TRENDINGLOOP;
	var LISTEN_DURATION;
	var GOTO_PERCENT;

    var urlarr;
    $.ajax ( {
		type:       'GET',
		url:        'https://raw.githubusercontent.com/yeucodonvn/codejs/master/ytbartist.json',
		dataType:   'JSON',
		success:    function (apiJSON) {
			let PARAMSURL = apiJSON;
			urlarr=PARAMSURL.list;
		},
		error:      function(err){
			alert("Cannot load JSON file");
			alert(err);
		}
	});
    $.ajax ( {
		type:       'GET',
		url:        'https://raw.githubusercontent.com/yeucodonvn/codejs/master/yt-parameters.json',
		dataType:   'JSON',
		success:    function (apiJSON) {
			let PARAMS = apiJSON;
			REPEAT_NUMB=PARAMS.REPEAT_NUMB;
            LISTEN_DURATION=PARAMS.LISTEN_DURATION;
            GOTO_PERCENT=PARAMS.GOTO_PERCENT;
            YTB_TRENDINGLOOP=PARAMS.YTB_TRENDINGLOOP;
		},
		error:      function(err){
			alert("Cannot load JSON file");
			alert(err);
		}
	});

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
        let Shufflealbum = document.querySelector('.style-scope.yt-button-renderer[aria-label="Shuffle"],[aria-label="PLAY ALL"],[aria-label="PHÁT TẤT CẢ"],[aria-label="Phát ngẫu nhiên"]');
		let autdioo = !!Array.prototype.find.call(document.querySelectorAll('audio,video'),function(elem){return elem.duration > 0 && !elem.paused});
		if(Shufflealbum!==null&& autdioo==false){
			console.log(Shufflealbum);
			Shufflealbum.click();
            setTimeout(Shufflealbum.click(),2000);
		}
    };
	function setShuffle(){
		console.log("set Shuffle");
        let element = document.querySelector(".shuffle.style-scope.ytmusic-player-bar");
		element.click();
    };
    function togglepage(params) {
        let tog = document.querySelector('.toggle-player-page-button.style-scope.ytmusic-player-bar[aria-label="Close player page"]');
        if(tog!==null){tog.click();}
    }
    function setRepeatAll(){
		console.log("set RepeatAll");
        let intload =0;
        let repeatElm = document.querySelector(".repeat.style-scope.ytmusic-player-bar");
        let loopClickRepeat = setInterval(function(){
            let repeatLabel = repeatElm.getAttribute("aria-label");
            if(repeatLabel == "Repeat all"||repeatLabel =="Lặp lại toàn bộ"){
                clearInterval(loopClickRepeat);
            }else{
                repeatElm.click();
            }
            if(intload>7){clearInterval(loopClickRepeat)}

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
                            explorers();
							if (stopss) {
                                stopvideo(ytplayer);
                            }
                        }
                        REPEAT_NUMB--;
                }
            });

            ADDED_EVENT = 1;
        }
    };
    function stopvideo(ytplayer) {
        ytplayer.stopVideo();
        let loop = setInterval(() => {
            let play = document.querySelector('.play-pause-button.style-scope.ytmusic-player-bar[title="Pause"]')
            if (play) {
                ytplayer.stopVideo();
            }else{clearInterval(loop);}
        }, 10000);
        setTimeout(function () {
            if(urlarr.length>1){
                // let currenturl=window.location.href;
                // urlarr.forEach(element => {
                //     if(currenturl.search(element)>-1){
                //         let indexurl = urlarr.indexOf(element);
                //         let tempurl ;
                //         (indexurl<urlarr.length-1) ?tempurl=urlarr[indexurl+1]:tempurl=urlarr[0];
                //         window.location.href = 'https://music.youtube.com/playlist?list='+tempurl;
                //     }
                // });
                window.location.href = urlarr[Math.floor(Math.random() * (urlarr.length-1))];
            }else{
                location.reload(true)
            }
        },5000);
    }
    let stopss=false;
    function explorers() {
        let topbar= document.querySelector('.center-content.style-scope.ytmusic-nav-bar');
        topbar.querySelectorAll('.style-scope.ytmusic-pivot-bar-renderer')[1].click();

        setTimeout(() => {
            let element1= document.querySelectorAll('.yt-simple-endpoint.style-scope.yt-formatted-string')
           element1.forEach(element => {
               if (element.textContent.indexOf('Trending')>=0) {
                    element.click();
                    console.log('Trending');
                    setTimeout(() => {
                        REPEAT_NUMB=4;
                        let Shufflealbum = document.querySelector('.style-scope.yt-button-renderer');
                        if(Shufflealbum!==null){
                            console.log("wait 40s");
                            stopss=true;
                            setTimeout(document.querySelector('.style-scope.yt-button-renderer[aria-label="Shuffle"],[aria-label="PLAY ALL"],[aria-label="PHÁT TẤT CẢ"],[aria-label="Phát ngẫu nhiên"]').click(),10*1000);
                            //GetDuration_First();
                            setTimeout(togglepage,3000);

                        }
                    }, 10*1000);
                }
           });
        }, 5*1000);
    }

    function detecturl() {
        /* code laays link tw
        let element1= document.querySelectorAll('a[dir="ltr"][href]')
           element1.forEach(element => {
            console.log(element.getAttribute('href'));
           }); */
        switch (true) {
            case window.location.href.indexOf("/explore")>=0:
                return 1;
            case window.location.href.indexOf("/browse")>-1:
                return 2;
            default:
                return 0;
        }
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
    function GetDuration_First(params) {
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
    }
	function running() {
		console.log("PLAY");
        setShufflealbum();
        GetDuration_First();
		//setTimeout(checkplayerpage,60*1000);
        setTimeout(() => {
            setRepeatAll();
            setShuffle()//setTimeout(setShuffle(),2000,2000);
            checkVideoPaused();
		    checkspinloader()
		    clickLike();
        }, 10000);
        setInterval(togglepage(), 50*1000);
    };
    function run() {
        console.log("YouTube AutoPlay - MANAGER");
		// $(window).off('beforeunload.windowReload');
        let curUrl= window.location.href;
        console.log("curUrl "+curUrl);
        console.log("REPEAT_NUMB "+REPEAT_NUMB);
        console.log("gotoPercent "+GOTO_PERCENT);
        console.log("LISTEN_DURATION "+LISTEN_DURATION);

        if (detecturl()==1){setTimeout(window.location.href = urlarr[Math.floor(Math.random() * (urlarr.length))],5*60*1000);}
        else{
            let Shufflealbum = document.querySelector('.style-scope.yt-button-renderer');
            if(Shufflealbum==null){
                console.log("wait 40s");
                setTimeout(running,60*1000);
            }
            else {	setTimeout(running,20*1000);	};
        }
    };

    setTimeout(run, 5000);
})();
