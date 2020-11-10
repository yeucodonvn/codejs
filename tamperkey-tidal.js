// ==UserScript==
// @name         Tidal
// @version      0.7
// @description  This script Autoplay Tidal
// @author       yeucodon
// @updateURL    https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamperkey-tidal.js
// @downloadURL  https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamperkey-tidal.js
// @match        https://listen.tidal.com/*
// @run-at       document-start
// @grant        none
// @namespace http://tampermonkey.net/
// ==/UserScript==

(function() {
    'use strict';

    var REPEAT_NUMB = 200;        
	//auto next
	/*@re quire  https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js */
   	function setRandomInterval(f, min, max) {
			if(REPEAT_NUMB>0){
				setTimeout(function() {
					f();
					setRandomInterval(f, min, max)
				}, min + Math.random() * (max - min));
			} else {location.reload(true);}
				REPEAT_NUMB--;
	};

	function clickshuffle(){	
	    
		console.log("click shuffleAll");
		document.querySelector("[data-track--button-id='shuffleAll'][data-track--content-type='playlist']").click();
		setTimeout(get_time, 10000);
		repeat();
	};
	function checkstop(){
		var stop =setInterval(function(){
			var playbtn = document.querySelector('[data-test="play"]');
			if(playbtn){
				simulate(document.querySelector('[data-test="next"]'), "click");
				//playbtn.click();
				console.log("search stop");
				clearInterval(stop);
			}			
		},5000)
	};
	function repeat() {
		//class^="repeatButton--3iDaJ all--3BIEW"	data-type="button__repeatAll"
		console.log("click repeat")
		let loop = setInterval(function() {
			let repeatt = document.querySelector('[class^="repeatButton"]')
			let attribute = repeatt.getAttribute('data-type')
			if (attribute=='button__repeatAll') {
				clearInterval(loop);
			}else{repeatt.click()};;
		})

	}
	
	function search_footer_player(){
		var searchft=document.querySelector("[data-test='footer-player'][data-track--module-id='footer_player']");
		if(searchft==null){
			console.log("search footer player");
			clickshuffle();
			}
	};

	var search_click=0;
	function search_play_spin_load(){
		var spinload=document.querySelector('.svg--3cSMl.spinningCircle--PrOB9');
		var current_time = hmsToSecondsOnly(document.querySelector('[data-test="current-time"]').textContent.trim());
		var demloi=0;
		var demok=0;
		// so sánh giây có bị dừng
		//if(spinload==null && current_time !== 0){
		if(spinload==null){
			console.log("search dung giua chung");
			var loopchecktime = setInterval(function(){
				var temp_time = hmsToSecondsOnly(document.querySelector('[data-test="current-time"]').textContent.trim());
				if(current_time==temp_time){	//lần đầu check curent=tem dem loi = 1,
					demloi++;					// sau 2 giây check lại nếu cureent vẫn bằng temp thì demloi + 1 
					}
				if(demloi>3)					// nếu demloi > 3 sẽ next và dừng lặp
				{
					document.querySelector('.playback-controls__button--white-icon').click();
					get_time();	//gọi lại get_time để đếm người reload
					demloi=0;
					clearInterval(loopchecktime);
				}else{demok++;}					// nếu đếm lỗi <= 3(nếu chạy thì demloi =1) tăng demok
				if(demok>3){demok=0;clearInterval(loopchecktime);}	// check demok 3 lần nếu đúng thì đừng lặp
			}, 5000);
			search_click++;
		};
		if(search_click>=10) {window.location.reload(true);};
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
	
	var temp_number=200;
	function get_time() {//dem lui reload
			if(temp_number>0){
				console.log(temp_number);
				var loopGetDuration = setInterval(
				function(){
						var Duration = document.querySelector('[data-test="duration-time"]');
						if(Duration!==null){
							clearInterval(loopGetDuration);
							var totalDuration=hmsToSecondsOnly(Duration.textContent.trim());
							var current_time = hmsToSecondsOnly(document.querySelector('[data-test="current-time"]').textContent.trim());
							if(totalDuration>0){
								var endtime=totalDuration-current_time;
								console.log("Get duration Total "+endtime);
								temp_number--;
								setTimeout(get_time,(endtime+5)*1000);
							}else{
								document.querySelector('.playback-controls__button--white-icon').click();
								REPEAT_NUMB--;
							}
						}
					},5000);
			} else {location.reload(true);}
	};
	
	// silulate mouse
function simulate(element, eventName)
{
    var options = extend(defaultOptions, arguments[2] || {});
    var oEvent, eventType = null;

    for (var name in eventMatchers)
    {
        if (eventMatchers[name].test(eventName)) { eventType = name; break; }
    }

    if (!eventType)
        throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');

    if (document.createEvent)
    {
        oEvent = document.createEvent(eventType);
        if (eventType == 'HTMLEvents')
        {
            oEvent.initEvent(eventName, options.bubbles, options.cancelable);
        }
        else
        {
            oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
            options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
            options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
        }
        element.dispatchEvent(oEvent);
    }
    else
    {
        options.clientX = options.pointerX;
        options.clientY = options.pointerY;
        var evt = document.createEventObject();
        oEvent = extend(evt, options);
        element.fireEvent('on' + eventName, oEvent);
    }
    return element;
}

function extend(destination, source) {
    for (var property in source)
      destination[property] = source[property];
    return destination;
}

var eventMatchers = {
    'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
    'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
}
var defaultOptions = {
    pointerX: 0,
    pointerY: 0,
    button: 0,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    bubbles: true,
    cancelable: true
}


	function ruuun(){
		setTimeout(clickshuffle,10*1000);
		setInterval(search_footer_player,50*1000);
		setInterval(search_play_spin_load,50*1000);
		setInterval(checkstop, 50 * 1000);
	}
	function run() {
        console.log("Tidal AutoPlay - MANAGER");
        //$(window).off('beforeunload.windowReload');
		var intload =0;
       	var load = setInterval(function(){
			var shuflle = document.querySelector("[data-track--button-id='shuffleAll'][data-track--content-type='playlist']");
			if(shuflle!==null){
				ruuun();
				clearInterval(load);
			}else{intload++;}
			if(intload>7){window.location.reload(true);}
		},5000)
    };

    setTimeout(run, 5000);

})();