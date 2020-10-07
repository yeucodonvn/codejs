// ==UserScript==
// @name         soundcloud
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @downloadURL  https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamperkey-soundcloudt.js
// @downloadURL  https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamperkey-soundcloud.js
// @match        https://www.iheart.com/playlist/*
// @run-at       document-start
// @grant        none
// ==/UserScript==
(function () {
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




	function play_btn() {
		console.log("play btn");
		var loopClickRepeat = setInterval(function () {
			var element = document.querySelector('[title="Play"]').click();
			if (element !== null) {
				var repeatLabel = element.getAttribute("class");
				if (repeatLabel == "shuffleControl sc-ir m-shuffling") {
					clearInterval(loopClickRepeat);
					console.log("click shuffle");
					shuffle.click();
					setTimeout(shuffle, 10000);
				} else {
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
	function shuffle() {
		var element = document.querySelector('[title="Shuffle"]');
		var repeatLabel = element.getAttribute("class");
		if (repeatLabel !== "shuffleControl sc-ir m-shuffling") {
			console.log("click shuffle");
			element.click();
		}

		setInterval(next, 80*1000);
	};
	function next() {
		document.querySelector(".skipControl.sc-ir.playControls__control.playControls__next.skipControl__next")
	}
	// chưa làm fund like

	/*
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
		*/

	function run() {
		console.log("SOUNDCLOUD AutoPlay - MANAGER - Repeat Number " + temp_number);
		var loopsearch = setInterval(function () {
			var element = document.querySelector('[title="Play"]');
			if (element !== null) {
				clearInterval(loopsearch);
				setTimeout(play_btn, 10000);
			};
		}, 5000);

	};

	setTimeout(run, 5000);
})();
