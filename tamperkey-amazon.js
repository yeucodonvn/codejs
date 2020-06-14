// ==UserScript==
// @name         amazon
// @namespace    http://tampermonkey.net/
// @version      0.2
// @require  https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @updateURL    https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamperkey-amazon.js
// @downloadURL  https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamperkey-amazon.js
// @description  try to take over the world!
// @author       You
// @match        https://music.amazon.*
// @grant        none
// ==/UserScript==

(function() {
function next(){	
	        console.log("click next");
	      var repeatElm = document.querySelector('[aria-label="Play next song"]');
        var loopClickRepeat = setInterval(function(){
			if(REPEAT_NUMB>0){
					clearInterval(loopClickRepeat);
                    repeatElm.click();
                    REPEAT_NUMB--;
			} else {location.reload();}
        }, 2000);
	};
  
function run() {
        console.log("AMAZON AutoPlay - MANAGER");
	
        $(window).off('beforeunload.windowReload');
       	setInterval(next, 88000, 128000);
    };

    setTimeout(run, 5000);
})();
