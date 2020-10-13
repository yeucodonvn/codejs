// ==UserScript==
// @name         pandora
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @updateURL    https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamperkey-pandora.js
// @downloadURL  https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamperkey-pandora.js
// @description  try to take over the world!
// @author       You
// @match        *https://www.pandora.com/*
// @grant        none
// ==/UserScript==


(function() {
    'use strict';
	
	var PARAMS;	
	var temp_number = 200;
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
	
function get_time() {//dem lui reload
		if (temp_number > 0) {
			console.log(temp_number);
			let loopGetDuration = setInterval(
				function () {
					let Duration = document.querySelector('[data-qa="remaining_time"]');
					if (Duration !== null) {
						clearInterval(loopGetDuration);
						let totalDuration = hmsToSecondsOnly(Duration.textContent.trim());
						let current_time = hmsToSecondsOnly(document.querySelector('[data-qa="elapsed_time"]').textContent.trim());
						if (totalDuration > 0) {
							let endtime = totalDuration - current_time;
							console.log("Get duration Total " + endtime);
							temp_number--;
							setTimeout(get_time, (endtime + 5) * 1000);
						} else {
							document.querySelector('.SkipButton.Tuner__Control__Button.Tuner__Control__SkipForward__Button.TunerControl').click();
							
						}
					}
				}, 5000);
		} else { location.reload(true); }
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

	var search_click=0;
	function search_play(){
		let current_time = hmsToSecondsOnly(document.querySelector('[data-qa="elapsed_time"]').textContent.trim());
		let demloi=0;
		let demok=0;
		let loopchecktime = setInterval(function(){
			let temp_time = hmsToSecondsOnly(document.querySelector('[data-qa="elapsed_time"]').textContent.trim());
				if(current_time.equals(temp_time)){
					demloi++;				
					}
				if(demloi>3)				
				{	
					console.log("search dung giua chung");
					document.querySelector('.SkipButton.Tuner__Control__Button.Tuner__Control__SkipForward__Button.TunerControl').click();
					get_time();	
					search_click++;
					clearInterval(loopchecktime);
				}else{demok++;}				
				if(demok>3){clearInterval(loopchecktime);}
			}, 2000);
			
		if(search_click==10) {window.location.reload(true);};
	};

function repeatbtn() {
	let loopsearch = setInterval(function() {
		let Shufflealbum = document.querySelector('[data-qa="tuner_repeat_button"]');
		let repeaaria = Shufflealbum.getAttribute("aria-label");
				if (repeaaria == "Repeat all") {
					console.log("Repeat");
					clearInterval(loopsearch);
				} else {
					Shufflealbum.click();;
				}
		},3000)
}

function run() {
        console.log("Pandora");
		let temp_load = 0;
        //$(window).off('beforeunload.windowReload');
		
		let loopsearch = setInterval(function () {
			let Shufflealbum = document.querySelector('.ButtonRow__button.ButtonRow__button--shuffle');
			if (Shufflealbum !== null) {
				console.log("play");
				clearInterval(loopsearch);
				Shufflealbum.click();
				setTimeout(repeatbtn, 10 * 1000);
				setTimeout(get_time, 10 * 1000);
				setInterval(search_play, 50 * 1000);
			} else {
				temp_load++;
				console.log("wait 10s");
			}
			if (temp_load > 10) {
				window.location.reload(true);
            }
		},10000)
};

    setTimeout(run, 5000);

})();
