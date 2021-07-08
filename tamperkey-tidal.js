// ==UserScript==
// @name         Tidal - version 1.4.5
// @version      1.4.5
// @description  This script Autoplay Tidal
// @author       yeucodon
// @updateURL    https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamperkey-tidal.js
// @downloadURL  https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamperkey-tidal.js
// @match        https://listen.tidal.com/*
// @run-at       document-start
// @grant        none
// @namespace http://tampermonkey.net/
// ==/UserScript==

(function() {
    'use strict';

	var REPEAT_NUMB = 200;
	let urlarr = ["8f632cdf-74ce-4a09-99b1-956fe453582a"];
	//list cu ["d60d7202-4074-4923-b037-30f6ee9e7a1a","67422e19-a08e-4a9b-909b-034b2749362b"];

	/*//@require  https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js */
	// @run-at       document-end
	// phai la end k se loi jquery
	// var URLsc;
	// $.ajax ( {
	// 	type:       'GET',
	// 	url:        'https://raw.githubusercontent.com/yeucodonvn/codejs/master/URL.json',
	// 	dataType:   'JSON',
	// 	success:    function (apiJSON) {
	// 		let PARAMS = apiJSON;
	// 		URLsc=PARAMS.tidal;
	// 	},
	// 	error:      function(err){
	// 		alert("Cannot load JSON file");
	// 		alert(err);
	// 	}
	// });
   	function setRandomInterval(f, min, max) {
			if(REPEAT_NUMB>0){
				setTimeout(function() {
					f();
					setRandomInterval(f, min, max)
				}, min + Math.random() * (max - min));
			} else {location.reload(true);}
				REPEAT_NUMB--;
	};

	function clickshuffle(){
		console.log("click shuffleAll");
		let shufflebtn = document.querySelector("[data-test='shuffle-all'][data-track--button-id='shuffle']");
		shufflebtn.click();
		setTimeout(get_time, 10000);
		repeat();
	};
	function checkstop(){
		let stop = setInterval(function(){
			var playbtn = document.querySelector('[data-test="play"]');
			if(playbtn){
				document.querySelector('.playback-controls__button--white-icon[data-test="next"],[data-type="button__skip-next"][data-test="next"]').click();
				//playbtn.click();
				console.log("search stop");
				clearInterval(stop);
			}
		},50000)
	};
	function repeat() {
		console.log("click repeat")
		let intload=0;
		let loop = setInterval(function() {
			let repeatt = document.querySelector('[class^="repeatButton"],.withBackground[title="Repeat"]');
			if (repeatt) {
				let attribute = repeatt.getAttribute('data-type')
				if (attribute=='button__repeatAll') {
					clearInterval(loop);
				}else{repeatt.click()};;
			if(intload>10){clearInterval(loop)}
			}
			intload++;
		},2000)

	}

	function search_footer_player(){
		let searchft=document.querySelector("[data-test='footer-player'][data-track--module-id='footer_player']");
		if(searchft==null){
			console.log("search footer player");
			clickshuffle();
			}
	};
	var search_click=0;
	function search_play_spin_load(){
		let playbtn = document.querySelector('.css-b0d7sz');
		let current_time = document.querySelector('.knob--eG-Gb[style]').getAttribute('style');
		let demloi=0;
		let demok=0;
		let loopchecktime = setInterval(function(){
			let temp_time = document.querySelector('.knob--eG-Gb[style]').getAttribute('style');
			if(current_time.localeCompare(temp_time)==0){
				demloi++;
				console.log("search dung giua chung");
				}
			if(demloi>3)
			{
				document.querySelector('.playback-controls__button--white-icon[data-test="next"],[data-type="button__skip-next"][data-test="next"]').click();
				get_time();
				demloi=0;
				clearInterval(loopchecktime);
			}else{demok++;}
			if(demok>3){demok=0;clearInterval(loopchecktime)}
		}, 5000);
			if(playbtn!==null){
			search_click++;
			};
		if(search_click>=10) {window.location.reload(true)};
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

	var temp_number=200;
	function get_time() {//dem lui reload
			if(temp_number>0){
				console.log(temp_number);
				let loopGetDuration = setInterval(
				function(){
						var Duration = document.querySelector('[data-test="duration-time"]');
						if(Duration!==null){
							clearInterval(loopGetDuration);
							let totalDuration=hmsToSecondsOnly(Duration.textContent.trim());
							let current_time = hmsToSecondsOnly(document.querySelector('[data-test="current-time"]').textContent.trim());
							if(totalDuration>0){
								var endtime=totalDuration-current_time;
								console.log("Get duration Total "+endtime);
								temp_number--;
								setTimeout(get_time,(endtime+5)*1000);
							}else{
								document.querySelector('.playback-controls__button--white-icon[data-test="next"],[data-type="button__skip-next"][data-test="next"]').click();
								REPEAT_NUMB--;
							}
						}
					},5000);
			} else {
			// 	if(urlarr.length>1){
			// 	let currenturl=window.location.href;
			// 	urlarr.forEach(element => {
			// 		if(currenturl.search(element)>-1){
			// 			let indexurl = urlarr.indexOf(element);
			// 			let tempurl ;
			// 			(indexurl<urlarr.length-1) ?tempurl=urlarr[indexurl+1]:tempurl=urlarr[0];
			// 			window.location.href = 'https://listen.tidal.com/playlist/'+tempurl;
			// 		}
			// 	});
			// }else{window.location.href = 'https://listen.tidal.com/playlist/'+urlarr[0];};;
			location.reload(true);
		}
	};

	function ruuun(){
		setTimeout(clickshuffle,10*1000);
		setInterval(search_footer_player,50*1000);
		setInterval(search_play_spin_load,50*1000);
		setInterval(checkstop, 50 * 1000);
	}
	function run() {
        console.log("Tidal AutoPlay - MANAGER");
        //$(window).off('beforeunload.windowReload');
		var intload =0;
       	let load = setInterval(function(){
			let shuflle = document.querySelector("[data-test='shuffle-all'][data-track--button-id='shuffle']");
			let login = document.querySelector('[datatest="no-user--login"]');
			let signup = document.querySelector('[datatest="no-user--signup"]');

			if(login!==null&&signup!==null) {
				console.log("page doi login");
				clearInterval(load);
			}else{if(shuflle!==null){
				ruuun();
				clearInterval(load);
			}else{intload++;console.log("tim nut shuffle");}
			if(intload>7){window.location.reload(true);}}
		},5000)
    };

    setTimeout(run, 5000);

})();