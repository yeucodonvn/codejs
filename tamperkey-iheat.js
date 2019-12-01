// ==UserScript==
// @name         iheart
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @downloadURL  https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamperkey-iheat.js
// @downloadURL  https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamperkey-iheat.js
// @match        https://www.iheart.com/playlist/*
// @grant        none
// ==/UserScript==
(function() {
    'use strict';

    var REPEAT_NUMB = 200;

   function setRandomInterval(f, min, max) {
			if(REPEAT_NUMB>0){
				setTimeout(function() {
					f();
					setRandomInterval(f, min, max)
				}, min + Math.random() * (max - min));
			} else {location.reload();}
				REPEAT_NUMB--;
	};
	
	function play_btn(){
	var element = document.querySelector('[data-test="play-button"]');
		element.click();
	}
	
	function run() {
        console.log("YouTube AutoPlay - MANAGER");
		play_btn();

       	setRandomInterval(function(){document.querySelector('[data-test="skip-button"]').click()}, 88000, 128000);
    };

    setTimeout(run, 5000);
})();
