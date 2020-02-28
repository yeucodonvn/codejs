// ==UserScript==
// @name         iheart
// @namespace    http://tampermonkey.net/
// @version      0.4
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

    var PARAMS.REPEAT_NUMB_IHEART = 200;

	function play_btn(){
		console.log("play btn");
		var element = document.querySelector('[data-test="play-button"]');
		console.log(element);
		var loopClickRepeat = setInterval(function(){
            if(element !== null){
                var repeatLabel = element.getAttribute("data-test-state");
                if(repeatLabel == "paused"){
					console.log("click play btn repeat "+PARAMS.REPEAT_NUMB_IHEART);
                    element.click();
					setRandomInterval(function(){document.querySelector('[data-test="skip-button"]').click()}, 88000, 128000);
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
        }, 2000);
	};

   function setRandomInterval(f, min, max) {
			if(PARAMS.REPEAT_NUMB_IHEART>0){
				console.log("next");
				setTimeout(function() {
					f();
					setRandomInterval(f, min, max)
				}, min + Math.random() * (max - min));
			} else {location.reload();}
				PARAMS.REPEAT_NUMB_IHEART--;
	};

	function run() {
        console.log("IHEAT AutoPlay - MANAGER");
		play_btn();
		//setTimeout(play_btn, 5000);
    };

    setTimeout(run, 5000);
})();
