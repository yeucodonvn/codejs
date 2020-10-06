// ==UserScript==
// @name         iheart
// @namespace    http://tampermonkey.net/
// @version      0.7

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
	var temp_number = 200;
	/*
	 * // @re quire 	 https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
   	$.ajax ( {
        type:       'GET',
        url:        'https://gitlab.com/copcoi/codejs/-/raw/master/yt-parameters.json',
        dataType:   'JSON',
        success:    function (apiJSON) {
            PARAMS = apiJSON;
			temp_number=PARAMS.REPEAT_NUMB_IHEART;
        },
        error:      function(err){
            alert("Cannot load JSON file");
            alert(err);
        }
    } );*/

	/* 
	API jwplayer	https://developer.jwplayer.com/jwplayer/docs/jw8-javascript-api-reference
	jwplayer().seek(position)
	jwplayer().getDuration()

	*/


	function play_btn(){
		console.log("play btn");
		var loopClickRepeat = setInterval(function(){
			var shuffle = document.querySelector('[data-test="Shuffle"]');
			var element = document.querySelector('[data-test="play-button"]');
            if(element !== null && shuffle !== null){
                var repeatLabel = element.getAttribute("data-test-state");
                if(repeatLabel == "paused"){
					clearInterval(loopClickRepeat);
					console.log("click shuffle");
                    shuffle.click();
					setTimeout(play, 10000);
                }else{
					console.log("search play btn");
                }
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
	function play(){
		var element = document.querySelector('[data-test="play-button"]');
		console.log("click play btn");
		console.log(element);
		element.click();
		setTimeout(get_time, 10000);
    };
	function searchconfirm(){
		var confirmdlg = document.querySelector('[class="confirm-dialog dialog-container"]');
        if(confirmdlg != null){
			var ok_btn = document.querySelector('[data-test="confirm-change-button"]');
			ok_btn.click();
			console.log("Click Confirm");
        }
    };

	function get_time() {//dem lui reload
			if(temp_number>0){
				console.log(temp_number);
				var loopGetDuration = setInterval(
				function(){
						var Duration = document.querySelector('[data-test="seekbar-duration"]');
						if(Duration!==null){
							clearInterval(loopGetDuration);
							var totalDuration=hmsToSecondsOnly(Duration.textContent.trim());
							var current_time = hmsToSecondsOnly(document.querySelector('[data-test="seekbar-position"]').textContent.trim());
							if(totalDuration>0){
								var endtime=totalDuration-current_time;
								console.log("Get duration Total "+endtime);
								temp_number--;
								setTimeout(get_time,(endtime+5)*1000);
							}else{
								document.querySelector('[data-test="next-button"]').click();
							}
						}
					},5000);
			} else {location.reload(true);}
	};
	function get_loading(){
		var chkcircle = document.querySelector('[aria-label="Play Button"]').getElementsByTagName("circle").length;
		var current_time = hmsToSecondsOnly(document.querySelector('[data-test="seekbar-position"]').textContent.trim());
		if(chkcircle ==1 && current_time!=0){
			console.log("loading error, click next ");
			document.querySelector('[data-test="next-button"]').click();
			get_time();
		}
	};
	
	function searchstop(){
		var stop=!!Array.prototype.find.call(document.querySelectorAll('audio,video'),function(elem){return elem.duration > 0 && !elem.paused});
		var current_time = hmsToSecondsOnly(document.querySelector('[data-test="seekbar-position"]').textContent.trim());
		var demloi=0;
		var demok=0;
		if(stop==false){
			console.log("search dung");
			var loopchecktime = setInterval(function(){
				var temp_time = hmsToSecondsOnly(document.querySelector('[data-test="seekbar-position"]').textContent.trim());
				if(current_time==temp_time){
					demloi++;
					}
				if(demloi>3)
				{
					document.querySelector('.playback-controls__button--white-icon').click();
					get_time();
					clearInterval(loopchecktime);
				}else{demok++;}
				if(demok>3){clearInterval(loopchecktime);}
			}, 2000);
		};
	};
	
	function run() {
        console.log("IHEAT AutoPlay - MANAGER - Repeat Number "+temp_number);
		var loopsearch = setInterval(function(){
			var element = document.querySelector('[data-test="play-button"]');
			if(element!==null){
				clearInterval(loopsearch);
				setTimeout(play_btn, 10000);
				setInterval(searchconfirm,25*60*1000);
				setInterval(get_loading,50*1000);
				setInterval(searchstop,50*1000);
			};
		},5000);
		
    };

    setTimeout(run, 5000);
})();
