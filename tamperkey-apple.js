// ==UserScript==
// @name         Apple Music AutoPlay - version 2.9.7
// @version      2.9.7
// @description  This script Autoplay Apple Music
// @author       bjemtj
// @match        *https://music.apple.com/*
// @match        *https://beta.music.apple.com/*
// @run-at       document-start
// @updateURL    https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamperkey-apple.js
// @downloadURL  https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamperkey-apple.js
// @grant        none
// @namespace 		http://tampermonkey.net/
// ==/UserScript==

(function () {
	'use strict';
	/*// @re quire  		https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
	 * https://developer.apple.com/documentation/musickitjs/accessing_musickit_features_using_javascript
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

	let urlarr;

	//$(".primary-actions__button--shuffle").click();

	function setRepeatAll() {
		console.log("Click Repeat");
		let repeatElm = document.querySelector("#scrollable-page > div > div > amp-chrome-player").shadowRoot.querySelector("div > div.chrome-player__playback-controls > apple-music-playback-controls").shadowRoot.querySelector("div > div:nth-child(3) > amp-playback-controls-repeat").shadowRoot.querySelector("button")
		let loopClickRepeat = setInterval(function () {
			if (repeatElm !== null) {
				let repeatLabel = repeatElm.getAttribute("class");
				if (repeatLabel.search("mode--2") > -1) {
					clearInterval(loopClickRepeat);
				} else {
					repeatElm.click();
				}
			}

		}, 2000);
	};
	function clickPlay() {
		console.log("Click Play");
		let repeatElm = document.querySelector('[data-testid="shuffle-icon"]');
		let loopClickRepeat = setInterval(function () {
			if (repeatElm !== null) {
				repeatElm.click();
				/*setTimeout(function(){
					var playBtn = document.querySelector(".button-reset.web-chrome-playback-controls__playback-btn[aria-label='Play']");
					if(playBtn == null){
					   clearInterval(loopClickRepeat);
					}
				},5000);*/
				setTimeout(clickNext_first, 30 * 1000);
				setTimeout(setRepeatAll, 30 * 1000);
				clearInterval(loopClickRepeat);
			}
		}, 10000);
	};

	var search_click = 0;
	function searchplaybtn() {
		let nexttElm = document.querySelector(".button-reset.web-chrome-playback-controls__playback-btn[aria-label='Next']");
		let playBtn = document.querySelector(".button-reset.web-chrome-playback-controls__playback-btn[aria-label='Play']");
		let tabsound = !!Array.prototype.find.call(document.querySelectorAll('audio,video'), function (elem) { return elem.duration > 0 && !elem.paused });
		let playbacktime = hmsToSecondsOnly(document.querySelector('.web-chrome-playback-lcd__playback-time').textContent.trim());
		if (playBtn != null) {
			//playBtn.click();
			nexttElm.click();
			console.log("search play click next");
			search_click++;
		} else if (tabsound == false && playbacktime !== 0)	// dung giua chung
		{
			nexttElm.click();
			console.log("search dung giua chung");
			search_click++;
		}
		if (search_click == 25) { window.location.reload(true); };
	};

	function Failed_to_fetch_err() {
		let dialogok = document.querySelector("#musickit-dialog");
		if (dialogok !== null) {
			let titleok = document.querySelector("#mk-dialog-title").textContent;
			if (titleok == "Failed to fetch") {
				window.location.reload(true);
			};
			if (titleok == "undefined") {
				window.location.reload(true);
			};
			if (titleok == "MEDIA_LICENSE") {
				window.location.reload(true);
			};

			if (titleok == "MEDIA_SESSION: TypeError: Cannot read property 'setServerCertificate' of null") {
				document.querySelector("#mk-dialog-actions > button").click();
			};
			if (titleok == "play() failed because the user didn't interact with the document first. https://goo.gl/xX8pDD") {
				document.querySelector("#mk-dialog-actions > button").click();
			};
			if (titleok == "cancelled") {
				document.querySelector("#mk-dialog-actions > button").click();
			};
		}
		let dialogbrowser = document.querySelector(".dt-modal__contents");
		if (dialogbrowser !== null) {
			let titlebrowser = document.querySelector("#dt-modal-container > div > div.dt-modal__dialog-content > div > article > div.web-error-dialog__top-content.web-error-dialog__top-content--expanded > h1").textContent;
			if (titlebrowser == "This Browser is Not Supported") {
				document.querySelector("#dt-modal-container > div > div.dt-modal__dialog-content > div > article > div.web-error-dialog__bottom-content > button").click();
			};
		}

	};

	var check_disable = 0;
	function searchplaydisable() {
		let playbtn = document.querySelector(".button-reset.web-chrome-playback-controls__playback-btn[aria-label='Play'][disabled]");
		let nextbtn = document.querySelector(".button-reset.web-chrome-playback-controls__playback-btn[aria-label='Next'][disabled]");
		if (playbtn !== null || nextbtn !== null) {
			console.log("Check Disabled Button Found");
			clickPlay();
			check_disable++;
		}
		if (check_disable == 5) { window.location.reload(true); };
	};


	function clickNext_first() {
		console.log("Click First Next");
		let repeatElm = document.querySelector(".button-reset.web-chrome-playback-controls__playback-btn[aria-label='Next']");
		repeatElm.click();
		let innt = 0;
		let loop = setInterval(function () {
			let timmeee = document.querySelector('.web-chrome-playback-lcd__time-end.web-chrome-playback-lcd__time-end--remaining')
			if (timmeee !== null) {
				console.log("wait 30s");
				rnd_play_type(3 * 1000);
				clearInterval(loop);
			} else {
				console("search playback-lcd");
				innt++;
			}
			if (innt > 10) {
				window.location.reload(true);
			}
		}, 5000)
	};

	function rnd_play_type(time) {
		let rdn = Math.floor(Math.random() * 40);
		console.log("randon ------------- " + rdn);
		if (rdn % 4 === 0) {
			setTimeout(clickNext, time + 3000);
			console.log(REPEAT_NUMB + " ------------- play next btn");
		} else {
			setTimeout(get_time_full, time + 3000);
			console.log(REPEAT_NUMB + " ------------- play full");
		}

	}
	function clickNext() {
		if (REPEAT_NUMB > 0) {
			let rdn = (Math.floor(Math.random() * (128 - 88)) + 88);
			setTimeout(() => {
				let repeatElm = document.querySelector(".button-reset.web-chrome-playback-controls__playback-btn[aria-label='Next']");
				repeatElm.click();
				rnd_play_type(3 * 1000);
			}, rdn);
		} else { clickstop(); }
	}

	function clickstop() {
		console.log("Click Stop");

		// let elem = document.querySelector("#scrollable-page > div > div > amp-chrome-player").shadowRoot.querySelector("div > div.chrome-player__playback-controls > apple-music-playback-controls").shadowRoot.querySelector("div > div.music-controls__main > amp-playback-controls-play > button.playback-play__pause")
		// if (elem.getAttribute('aria-hidden') !== null) {
		// 	elem.click();
		// }
		let loopstop = setInterval(function () {
			let stoplb = document.querySelector(".button-reset.web-chrome-playback-controls__playback-btn[aria-label='Pause']");
			let tabsound = !!Array.prototype.find.call(document.querySelectorAll('audio,video'), function (elem) { return elem.duration > 0 && !elem.paused });
			if (stoplb == null || tabsound == false) {
				if (urlarr.length > 1) {
					let currenturl = window.location.href;
					urlarr.forEach(element => {
						if (currenturl.search(element) > -1) {
							let indexurl = urlarr.indexOf(element);
							let tempurl;
							(indexurl < urlarr.length - 1) ? tempurl = urlarr[indexurl + 1] : tempurl = urlarr[0];
							if (currenturl.search("/us/")) {
								window.location.href = 'https://music.apple.com/us/playlist/' + tempurl;
							}
							if (currenturl.search("/gb/")) {
								window.location.href = 'https://music.apple.com/gb/playlist/' + tempurl;
							}
						}
					});
				} else { setTimeout(function () { window.location.reload(true); }, 20 * 1000); };
				clearInterval(loopstop);
			} else { stoplb.click(); }
		}, 5000)
	};

	function hmsToSecondsOnly(str) {
		let p = str.split(':'), s = 0, m = 1;

		while (p.length > 0) {
			s += m * parseInt(p.pop(), 10);
			m *= 60;
		}

		return s;
	};

	function get_time_full() {		//dem lui reload
		if (REPEAT_NUMB > 0) {
			let music = MusicKit.getInstance();
			var playbacktime = music.currentPlaybackDuration;		//hmsToSecondsOnly(document.querySelector('.web-chrome-playback-lcd__playback-time').textContent.trim());
			let endtime = music.currentPlaybackTimeRemaining; //hmsToSecondsOnly(document.querySelector('.web-chrome-playback-lcd__time-end.web-chrome-playback-lcd__time-end--remaining').textContent.trim());
			if (playbacktime > 0 && endtime > 0) {
				console.log("Get End Time " + endtime);
				REPEAT_NUMB--;
				rnd_play_type((endtime + 10) * 1000);
			} else {
				//nếu total time =0 thì next bài
				document.querySelector(".button-reset.web-chrome-playback-controls__playback-btn[aria-label='Next']").click();
				REPEAT_NUMB--;
			}
		} else {
			clickstop();
		}
	};

	var REPEAT_NUMB = 200;
	function plfunc() {
		setTimeout(clickPlay, 10 * 1000);
		setInterval(searchplaybtn, 50 * 1000);
		setInterval(searchplaydisable, 60 * 1000);
		setInterval(Failed_to_fetch_err, 15 * 1000);
	}

	function run() {
		console.log("Apple Music AutoPlay - version 2.7");
		let innt = 0;
		let loop = setInterval(function () {
			let shufflebtn = document.querySelector(".shuffle-button.typography-body-semibold-tall[aria-label='Shuffle']");
			if (shufflebtn !== null) {
				console.log("wait 1 phut");
				setTimeout(plfunc, 60 * 1000);
				clearInterval(loop);
			} else {
				console.log("search shuffle");
				innt++;
			}
			if (innt > 6) {
				let urll = window.location.href;

				if (urll.search("/account/settings") >= 0) {
					clearInterval(loop);
				} else { window.location.reload(true); }
			}
		}, 10000)
	};


	setTimeout(run, 10000);
})();
