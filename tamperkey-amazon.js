// ==UserScript==
// @name         amazon
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @require  	 https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @updateURL    https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamperkey-amazon.js
// @downloadURL  https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamperkey-amazon.js
// @description  try to take over the world!
// @author       You
// @match        https://music.amazon.com/*
// @match        https://music.amazon.co.uk/*
// @grant        none
// ==/UserScript==

(function() {
	var REPEAT_NUMB=200;
	/*
function setRandomInterval(f, min, max) {
  setTimeout(function() {
    f();
    setRandomInterval(f, min, max)
  }, min + Math.random() * (max - min));
};
setRandomInterval(function(){document.querySelector('[aria-label="Play next song"]').click();}, 88000, 148000);
*/
function next(){
	        console.log("click next");
	      var repeatElm = document.querySelector('[aria-label="Play next song"]');
			if(REPEAT_NUMB>0){
                    repeatElm.click();
                    REPEAT_NUMB--;
					// thay the cho code cjs
					var min = 88,
						max = 128;
					var rand = min + Math.floor(Math.random() * (max - min));  // min +  Math.random() từ 0 đến  max - min và + thêm min, Math.floor lấy số tự nhiên
					console.log(rand);
					setTimeout(next,rand*1000);
					// het
			} else {location.reload();}
	};
	function clickplay(){
	        console.log("click play");
	      document.querySelector(".playAll.iconOnlyButton.button").click();
		  setRepeatAll();
		  setShuffle();
	};
	function setRepeatAll(){
		console.log("Click Repeat");

        var loopClickRepeat = setInterval(function(){
			var repeatElm = document.querySelector('.repeatButton.playerIconRepeat.transportButton.transportButton[aria-label="Repeat All"]');
            if(repeatElm !== null){
                var repeatLabel = repeatElm.getAttribute("class");
				//console.log(repeatLabel);
                if(repeatLabel == "repeatButton playerIconRepeat transportButton on transportButton"){
                    clearInterval(loopClickRepeat);
                }else{
                    repeatElm.click();
                }
            }
        }, 2000);
    };
	function setShuffle(){
		console.log("Click Shuffle");

        var loopClickRepeat = setInterval(function(){
			var repeatElm = document.querySelector('[aria-label="Shuffle All"]');
            if(repeatElm !== null){
                var repeatLabel = repeatElm.getAttribute("aria-checked");
				//console.log(repeatLabel);
                if(repeatLabel == "true"){
                    clearInterval(loopClickRepeat);
                }else{
                    repeatElm.click();
                }
            }
        }, 2000);
    };

	function loadidng(){

			console.log("check load");
			var loopClickRepeat = setInterval(function(){
				var load = document.querySelector(".playAll.iconOnlyButton.button");
				if(load){
					clearInterval(loopClickRepeat);
					setTimeout(clickplay,10*1000);
					// thay the cho code cjs
					setTimeout(next,(Math.floor(Math.random() * (128 - 88))+88)*1000);
				}else{
					console.log("loading");
					temp_load++;
					if(temp_load>20){location.reload();}
				   //clearInterval(loopClickRepeat);
				}

			}, 5000);
		};

	function run() {
			console.log("AMAZON AutoPlay - MANAGER");

			$(window).off('beforeunload.windowReload');
			loadidng();

		};

    setTimeout(run, 5000);
})();
