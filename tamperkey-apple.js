// ==UserScript==
// @name         Apple Music AutoPlay - MANAGER
// @version      2.5.4
// @description  This script Autoplay Apple Music
// @author       bjemtj
// @match        *https://music.apple.com/*
// @match        *https://beta.music.apple.com/*
// @run-at       document-start
// @updateURL    https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamperkey-apple.js
// @downloadURL  https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamperkey-apple.js
// @grant        none
// @require  		https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @namespace 		http://tampermonkey.net/
// ==/UserScript==

(function() {
    'use strict';
	/*https://developer.apple.com/documentation/musickitjs/accessing_musickit_features_using_javascript
	let music = MusicKit.getInstance();
	music.seekToTime(50);
	https://developer.apple.com/documentation/musickitjs/musickit
	seekToTime(time);
	MusicKit.PlayerRepeatMode=0;
	MusicKit.PlayerRepeatMode ="all";
	music.currentPlaybackTimeRemaining
	music.currentPlaybackDuration
	kết hợp seektotime với gettime và check audio sound = true thay cho addEventListener
	music.addEventListener("onPlaybackStateChange"
	
	let music = MusicKit.getInstance();
	music.addEventListener("onPlaybackStateChange", function(onPlaybackStateChange){alert(state);})

	this.storekit.addEventListener(Yt.authorizationStatusDidChange,(function(t){var n=t.authorizationStatus;l._hasAuthorized=[Lt.AUTHORIZED,Lt.RESTRICTED].includes(n)}))

	onPlaybackStateChange
	onreadystatechange
https://developer.apple.com/musickit/android/com/apple/android/music/playback/controller/MediaPlayerController.Listener.html#onPlaybackStateChanged-com.apple.android.music.playback.controller.MediaPlayerController-int-int-
	*/
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
	
	var search_click=0;
	function searchplaybtn(){
		var nexttElm = document.querySelector(".button-reset.web-chrome-playback-controls__playback-btn[aria-label='Next']");
		var playBtn = document.querySelector(".button-reset.web-chrome-playback-controls__playback-btn[aria-label='Play']");
		var tabsound = !!Array.prototype.find.call(document.querySelectorAll('audio,video'),function(elem){return elem.duration > 0 && !elem.paused});
		var playbacktime=hmsToSecondsOnly(document.querySelector('.web-chrome-playback-lcd__playback-time').textContent.trim());
        	if(playBtn != null){
			//playBtn.click();
			nexttElm.click();
			console.log("search play click next");
			search_click++;
			}else if(tabsound==false && playbacktime!==0)	// dung giua chung
			{
				nexttElm.click();
				console.log("search dung giua chung");
				search_click++;
			}
		if(search_click==25) {window.location.reload(true);};
	};
	
	function Failed_to_fetch_err(){
		var dialogok=document.querySelector("#musickit-dialog");
		if(dialogok!==null){
			/*var titleok=document.querySelector("#mk-dialog-title").textContent;
			if(titleok=="Failed to fetch"){
				window.location.reload(true);
			};
			if(titleok=="undefined"){
				window.location.reload(true);
			};
			if(titleok=="MEDIA_LICENSE"){
				window.location.reload(true);
			};*/
			window.location.reload(true);
		}
		
    };
	
	var check_disable=0;
	function searchplaydisable(){
		var playbtn = document.querySelector('.button-reset.web-chrome-playback-controls__playback-btn[data-test-playback-control-play][disabled]');
		var nextbtn = document.querySelector('.button-reset.web-chrome-playback-controls__playback-btn[data-test-playback-control-next][disabled]');
		if(playbtn!==null || nextbtn!==null){
				console.log("Check Disabled Button Found");
				clickPlay();
				check_disable++;
		}
		if(check_disable==5) {window.location.reload(true);};
    };


	function clickNext_first(){
	    console.log("Click First Next");
        var repeatElm = document.querySelector(".button-reset.web-chrome-playback-controls__playback-btn[aria-label='Next']");
        repeatElm.click();
    };
	

	function clickstop(){
	    console.log("Click Stop");
		var loopstop = setInterval(function(){
			var stoplb = document.querySelector(".button-reset.web-chrome-playback-controls__playback-btn[aria-label='Pause']");
			var tabsound = !!Array.prototype.find.call(document.querySelectorAll('audio,video'),function(elem){return elem.duration > 0 && !elem.paused});
			if(stoplb == null ||tabsound==false){
				setTimeout(function (){window.location.reload(true);},20*1000);
				clearInterval(loopstop);
			}else{stoplb.click();}
		},5000)
		 
    };
	/*	auto next
	var REPEAT_tmp = 1;
    function clickNext(){
	    let music = MusicKit.getInstance();
		var totalduration = music.currentPlaybackDuration;
		var min = 60,
			max = 40;
		var rand = min + Math.floor(Math.random() * (max - min));  // min +  Math.random() từ 0 đến  max - min và + thêm min, Math.floor lấy số tự nhiên
		console.log(rand);	
		music.seekToTime(rand);
		var percent = totalduration *0.9;
		//setTimeout(f,s,...) f function, s giay cua setTimeout ... lenh truyen vao f
		
		
            repeatElm.click();
            REPEAT_NUMB--;
			REPEAT_tmp++;
			
			if(REPEAT_NUMB<0){
			clickstop();
			setTimeout(function (){window.location.reload(true);},20*1000);
		}
            
    };
	
	

	*/
	function hmsToSecondsOnly(str) {
        var p = str.split(':'),            s = 0, m = 1;

        while (p.length > 0) {
            s += m * parseInt(p.pop(), 10);
            m *= 60;
        }

        return s;
    };
	//261
	function get_time() {		//dem lui reload
			if(REPEAT_NUMB>0){
				console.log(REPEAT_NUMB);
				let music = MusicKit.getInstance();
				var playbacktime = music.currentPlaybackDuration;		//hmsToSecondsOnly(document.querySelector('.web-chrome-playback-lcd__playback-time').textContent.trim());
				var endtime = music.currentPlaybackTimeRemaining; //hmsToSecondsOnly(document.querySelector('.web-chrome-playback-lcd__time-end.web-chrome-playback-lcd__time-end--remaining').textContent.trim());
						if(playbacktime>0&&endtime>0){
							console.log("Get End Time "+endtime);
							REPEAT_NUMB--;
							setTimeout(get_time,(endtime+20)*1000);
						}else
						{
							//nếu total time =0 thì next bài
							document.querySelector(".button-reset.web-chrome-playback-controls__playback-btn[aria-label='Next']").click();
							REPEAT_NUMB--;
						}
			} else {clickstop();
					}
	};
	
    var REPEAT_NUMB = 200;
	async function plfunc(){
		await setTimeout(clickPlay,10*1000);
		await setTimeout(clickNext_first,30*1000);
        await setTimeout(setRepeatAll,30*1000);
		
        //await setTimeout(clickNext,(Math.floor(Math.random() * (128 - 88))+88)*1000);
		var timmeee=document.querySelector('.web-chrome-playback-lcd__time-end.web-chrome-playback-lcd__time-end--remaining')
		if(timmeee!==null){
			console.log("wait 30s");
			setTimeout(get_time,30*1000);
		}
		else {	setTimeout(get_time,10*1000);	};

		setInterval(searchplaybtn,50*1000);
		setInterval(searchplaydisable,60*1000);
    	setInterval(Failed_to_fetch_err,50*1000);
	}

    function run() {
        console.log("Apple Music AutoPlay - MANAGER");

        $(window).off('beforeunload.windowReload');
       	var previewbtn=document.querySelector("[aria-label='Preview']");
		if(previewbtn!==null){
			console.log("wait 30s");
			setTimeout(plfunc,30*1000);
		}
		else {	setTimeout(plfunc,10*1000);	};
    };


    setTimeout(run, 10000);
})();
