// ==UserScript==
// @name         iheart
// @namespace    http://tampermonkey.net/
// @version      0.5
// @require 	 https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @description  try to take over the world!
// @author       You
// @downloadURL  https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamperkey-iheat.js
// @downloadURL  https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamperkey-iheat.js
// @match        https://www.iheart.com/playlist/*
// @run-at       document-start
// @grant        none
// ==/UserScript==
(function() {
    'use strict';
	var PARAMS;
    $.ajax ( {
        type:       'GET',
        url:        'https://raw.githubusercontent.com/yeucodonvn/codejs/master/yt-parameters.json',
        dataType:   'JSON',
        success:    function (apiJSON) {
            PARAMS = apiJSON;
        },
        error:      function(err){
            alert("Cannot load JSON file");
            alert(err);
        }
    } );

	function play_btn(){
		
		console.log("play btn");
		var element = document.querySelector('[data-test="play-button"]');
		console.log(element);
		var loopClickRepeat = setInterval(function(){
            if(element !== null){
                var repeatLabel = element.getAttribute("data-test-state");
                if(repeatLabel == "paused"){
					shuffle();
					console.log("click play btn");
                    //element.click();
					setTimeout(element.click(), 3000);

					var loopGetDuration_First = setInterval(function(){
					var totalDuration = hmsToSecondsOnly(document.querySelector('[data-test="player-total-time"]').textContent.trim());
					if(totalDuration>0){
						console.log("Get duration Total "+totalDuration);
						clearInterval(loopGetDuration_First);
						setTimeout(get_time,(totalDuration-10)*1000);
					}
					}
				)
                }else{
					console.log("search play btn");
                    clearInterval(loopClickRepeat);
                }
			}
			else{
				console.log("search element");
				clearInterval(loopClickRepeat);
				setTimeout(play_btn, 2000);
			}
        }, 5000);
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

	function searchconfirm(){
		var confirmdlg = document.querySelector('[class="confirm-dialog dialog-container"]');
        if(confirmdlg != null){
			var ok_btn = document.querySelector('[data-test="confirm-change-button"]');
			ok_btn.click();
			console.log("Click Confirm");
        }
    };
	var temp_number = 0;
	function get_time() {
			if(temp_number>0){
				console.log(temp_number);
				var loopGetDuration_First = setInterval(function(){
					var totalDuration = hmsToSecondsOnly(document.querySelector('[data-test="player-total-time"]').textContent.trim());
					if(totalDuration>0){
						console.log("Get duration Total "+totalDuration);
						clearInterval(loopGetDuration_First);
						temp_number--;
						setTimeout(get_time,(totalDuration-5)*1000);
					}
					}
				)
			} else {location.reload();}
	};
	function get_loading(){
		var totalDuration = hmsToSecondsOnly(document.querySelector('[data-test="player-total-time"]').textContent.trim());
		var current_time = hmsToSecondsOnly(document.querySelector('[data-test="player-current-time"]').textContent.trim());
		if(current_time==0&&totalDuration==0){
			console.log("loading error, click next ");
			document.querySelector('[data-test="skip-button"]').click();
			get_time();
		}
	};
	function shuffle(){
		console.log("Click shuffle");
		document.querySelector('[data-test="shuffle"]').click();
	};
	

	function run() {
        console.log("IHEAT AutoPlay - MANAGER - Repeat Number "+PARAMS.REPEAT_NUMB_IHEART);
		temp_number=PARAMS.REPEAT_NUMB_IHEART;
		
		play_btn();
		//setTimeout(shuffle, 15000);
		setInterval(searchconfirm,25*60*1000);
		setInterval(get_loading,50*1000);
    };

    setTimeout(run, 5000);
})();
