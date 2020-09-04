// ==UserScript==
// @name         deezer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @require  	 https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
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
	/*
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
			var loopGetDuration = setInterval(
				function () {
					var Duration = document.querySelector('[data-qa="remaining_time"]');
					if (Duration !== null) {
						clearInterval(loopGetDuration);
						var totalDuration = hmsToSecondsOnly(Duration.textContent.trim());
						var current_time = hmsToSecondsOnly(document.querySelector('[data-qa="elapsed_time"]').textContent.trim());
						if (totalDuration > 0) {
							var endtime = totalDuration - current_time;
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

	function repeatbtn() {
		var loopsearch = setInterval(function () {
		var Shufflealbum = document.querySelector('[data-qa="tuner_repeat_button"]');
		var repeaaria = Shufflealbum.getAttribute("aria-label")
			if (Shufflealbum == "Repeat all") {
				console.log("Repeat");
			clearInterval(loopsearch);
			} else {
				Shufflealbum.click();;
			}
	},3000)
}

function run() {
        console.log("Pandora");
		var temp_load = 0;
        $(window).off('beforeunload.windowReload');
		
		var loopsearch = setInterval(function () {
			var Shufflealbum = document.querySelector('.ButtonRow__button.ButtonRow__button--shuffle');
			if (Shufflealbum == null) {
				clearInterval(loopsearch);
				Shufflealbum.click();
				setTimeout(repeatbtn, 10 * 1000);
				setTimeout(get_time, 10 * 1000);
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
