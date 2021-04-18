// ==UserScript==
// @name         amazon
// @namespace    http://tampermonkey.net/
// @version      0.2.7

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
	
	/*// @re quire  	 https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
	amznMusic.appConfig
	amznMusic.appConfig.deviceId
	https://github.com/deannyyy/gitTest/blob/37c878582d8b0b140a342d049892438b27c345f6/beardedspice-master/BeardedSpice/MediaStrategies/AmazonMusic.js
	amznMusic.widgets.player.getCurrent().duration;
	
	var p=amznMusic.widgets.player; 
	p.isPlaying()
	p.pause()
	p.resume()
	*/
	
	/*
function setRandomInterval(f, min, max) {
  setTimeout(function() {
    f();
    setRandomInterval(f, min, max)
  }, min + Math.random() * (max - min));
};
setRandomInterval(function(){document.querySelector('[aria-label="Play next song"]').click();}, 88000, 148000);
*/
	/*function next(){
	        console.log("click next");
	      var repeatElm = document.querySelector('[aria-label="Play next song"]');
			if(REPEAT_NUMB>0){
                    repeatElm.click();
                    REPEAT_NUMB--;
					// thay the cho code cjs
					var min = 128,
						max = 168;
					var rand = min + Math.floor(Math.random() * (max - min));  // min +  Math.random() từ 0 đến  max - min và + thêm min, Math.floor lấy số tự nhiên
					console.log(rand);
					setTimeout(next,rand*1000);
					// het
			} else {location.reload(true);}
			
	};
	*/
	
	
	function next(){
		location.reload(true);
	}
	function clickplay(){
	        console.log("click play");
	      document.querySelector("#detailHeaderButton2").click();
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
			var repeatElm = document.querySelector('music-button[icon-name="shuffle"]');
            if(repeatElm !== null){
                var repeatLabel = repeatElm.getAttribute("aria-label");
				//console.log(repeatLabel);
                if(repeatLabel == "Turn Off Shuffle"){
                    clearInterval(loopClickRepeat);
                }else{
                    repeatElm.click();
                }
            }
        }, 2000);
    };
	function check_notify(){
		var dilog= document.querySelector("#dialogBoxView > section > div.dialogContainer");
		var title = document.querySelector("#dialogBoxView > section > div.dialogContainer > div.dialogBody.dialogBoxFocus").textContent;
	    if(dilog!=null){
			if(title=="We are unable to complete your action.  Please try again later. " ){
			console.log("check_notify");
			window.location.reload(true);
			}
		}
	};

	function loadidng(){
			console.log("check load");
			let temp_load=0;
			var loopClickRepeat = setInterval(function(){
				var load = document.querySelector("#detailHeaderButton2");
				if(load){
					clearInterval(loopClickRepeat);
					setTimeout(clickplay,10*1000);
					// thay the cho code cjs
					//setTimeout(next,(Math.floor(Math.random() * (168 - 128))+128)*1000);
					setTimeout(next,16*60*60*1000);
					setInterval(check_notify,10*60*1000);
				}else{
					console.log("loading");
					temp_load++;
					if(temp_load>20){location.reload(true);}
				   //clearInterval(loopClickRepeat);
				}

			}, 5000);
		};

	function run() {
			console.log("AMAZON AutoPlay - MANAGER");

			//$(window).off('beforeunload.windowReload');
			loadidng();

		};

    setTimeout(run, 5000);
})();
