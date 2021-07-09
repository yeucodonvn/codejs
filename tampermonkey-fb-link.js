// ==UserScript==
// @name         Tidal - version 1.4.5
// @version      1.4.5
// @description  This script Autoplay Tidal
// @author       yeucodon
// @updateURL    https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamperkey-tidal.js
// @downloadURL  https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamperkey-tidal.js
// @match        https://www.facebook.com
// @run-at       document-start
// @grant        none
// @namespace    alex
// ==/UserScript==

// (function() {
//     'use strict';
//     function run(params) {
//         Console.log("click link facebook");
        
//     }
//     setTimeout(run, 5000);
// }





// ==UserScript==
// @name         SoundCloud AutoPlay - MAIN
// @version      2.5.7
// @description  This script Autoplay SoundCloud
// @author       bjemtj
// @match        *soundcloud.com/*
// @run-at       document-end
// @updateURL    https://bjemtj.github.io/tampermonkey/soundcloud-main.js
// @downloadURL  https://bjemtj.github.io/tampermonkey/soundcloud-main.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var PARAMS = {
        "DELAY": 5000,
        "DOMAIN": "https://soundcloud.com",
        "LISTEN_DURATION": 600,
        "LISTEN_OTHERS_DURATION": 300,
        "LINKS":{
            "ARTISTS" : ["https://soundcloud.com/terence-garza/sets/guitar-in-country-vol-01",
                         "https://soundcloud.com/user-930237602/sets/communication-time",
                        "https://soundcloud.com/bernadette-hopper/sets/forgot-wedding"],
            "OTHERS": "https://soundcloud.com/discover",
            "FANPAGE": "https://www.facebook.com/pg/Musicfme/posts/?ref=page_internal"
        },
        "UPDATE_API": "https://script.google.com/macros/s/AKfycbyaTbgkqRWkFTu5dlcsrG9YSHaTHdNpKsrTrhsOCFyN_CiSBBmA9rUc-Q/exec",
        "GET_IP_URI": "https://api.ipify.org/",
        "LIKE_RATE": 0.4,
        "REPOST_RATE": 0.5,
        "FOLLOW_RATE": 0.4
    };

    function updateStatus(){

        var xhr = new XMLHttpRequest();
        xhr.open('GET', PARAMS.GET_IP_URI, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200 || (xhr.status === 0 && xhr.responseText !== '')) {
                    var getURI = PARAMS.UPDATE_API + "?ipaddress=" + xhr.responseText + "&state=2";
                    console.log(getURI);

                    var xhrSendStatus = new XMLHttpRequest();
                    xhrSendStatus.open('GET', getURI, true);
                    xhrSendStatus.send(null);
                }
                else {
                    console.log("Get IP address failed!");
                }
            }
        };
        xhr.send(null);
    }
    function getActiveURL(){
        switch(true)
        {
            case PARAMS.LINKS.ARTISTS.indexOf(window.location.href) >= 0:
                return 1;
            case window.location.href == PARAMS.LINKS.OTHERS:
                return 2;
            default:
                return 0;
        }
    };

    function clickShuffle(){
        var loopClickShuffleRepeat = setInterval(function(){
            let btnRender = document.querySelector("button[title='Shuffle']");
            if(btnRender != null){
                btnRender.click();
                clearInterval(loopClickShuffleRepeat);
            }
        }, PARAMS.DELAY);
    };
    function clickLike(){
        var loopLikeCount = 0;
        var loopClickLikeRepeat = setInterval(function(){
            loopLikeCount++;
            let btnRender = document.querySelector("button[aria-label='Like']");
            if(btnRender != null){
                if(Math.random() < PARAMS.LIKE_RATE)
                {
                    btnRender.click();
                }
                clearInterval(loopClickLikeRepeat);
            }else if(loopLikeCount > 3){
                let unlikeBtnRender = document.querySelector("button[aria-label='Unlike']");
                if(unlikeBtnRender != null){  
                    if(Math.random() < PARAMS.LIKE_RATE)
                    {
                        unlikeBtnRender.click();
                    }
                } 
                clearInterval(loopClickLikeRepeat);
            }
        }, PARAMS.DELAY);
    };
    function clickRepost(){
        var loopRepostCount = 0;
        var loopClickRepostRepeat = setInterval(function(){
            loopRepostCount++;
            let btnRender = document.querySelector("button[aria-label='Repost']");
            if(btnRender != null){
                if(Math.random() < PARAMS.REPOST_RATE)
                {
                    btnRender.click();
                }
                clearInterval(loopClickRepostRepeat);
            }else if(loopRepostCount > 3){
                let unRepostBtnRender = document.querySelector("button[aria-label*='Unpost']");
                if(unRepostBtnRender != null){  
                    if(Math.random() < PARAMS.REPOST_RATE)
                    {
                        unRepostBtnRender.click();
                    }
                } 
                clearInterval(loopClickRepostRepeat);
            }
        }, PARAMS.DELAY);
    };
    function clickFollow(){
        var loopFollowCount = 0;
        var loopClickFollowRepeat = setInterval(function(){
            loopFollowCount++;
            let btnRender = document.querySelector("button[aria-label='Follow']");
            if(btnRender != null){
                if(Math.random() < PARAMS.FOLLOW_RATE)
                {
                    btnRender.click();
                }
                clearInterval(loopClickFollowRepeat);
            }else if(loopFollowCount > 3){
                let unFollowBtnRender = document.querySelector("button[aria-label='Unfollow']");
                if(unFollowBtnRender != null){  
                    if(Math.random() < PARAMS.FOLLOW_RATE)
                    {
                        unFollowBtnRender.click();
                    }
                } 
                clearInterval(loopClickFollowRepeat);
            }
        }, PARAMS.DELAY);
    };

    function clickPlay(){
        var loopClickPlayRepeat = setInterval(function(){
            var btns = document.querySelectorAll("a[title='Play']");
            let rdPos = Math.floor(Math.random() * btns.length);
            let element = btns[rdPos];
            if(element != null){
                element.click();
                console.log(getActiveURL() + " play");
                clearInterval(loopClickPlayRepeat);
            }
        }, PARAMS.DELAY);
    };
    function gotoURL(url) {
        var a = document.createElement('a');
        var link = document.createTextNode(url);
        a.appendChild(link);
        a.title = url;
        a.href = url;
        document.body.appendChild(a);
        a.click();
        newPlay();
    };
    function hardReload(url) {
        window.location.href = url;
    };

    function newPlay(){

        if(getActiveURL() == 1)
        {
            setTimeout(clickPlay, PARAMS.DELAY);
            setTimeout(clickShuffle, PARAMS.DELAY);
            setTimeout(clickLike, PARAMS.DELAY);
            setTimeout(clickRepost, PARAMS.DELAY);
            setTimeout(clickFollow, PARAMS.DELAY);

            setTimeout(hardReload, PARAMS.LISTEN_DURATION * 1000, PARAMS.LINKS.OTHERS); //Hard reload after listen time
        }else if(getActiveURL() == 2)
        {
            setTimeout(clickPlay, PARAMS.DELAY);
            setTimeout(clickShuffle, PARAMS.DELAY);
            setTimeout(clickLike, PARAMS.DELAY);
            setTimeout(clickRepost, PARAMS.DELAY);
            setTimeout(clickFollow, PARAMS.DELAY);

            let rndArtist = PARAMS.LINKS.ARTISTS[Math.floor(Math.random() * PARAMS.LINKS.ARTISTS.length)];
            let artistPath = rndArtist.replace(PARAMS.DOMAIN, "");
            setTimeout(gotoURL, PARAMS.LISTEN_OTHERS_DURATION * 1000, artistPath); //Go to Artist path after break time
        }
    };

    function run() {
        newPlay();
    };

    //#### Main thread
    setTimeout(run, PARAMS.DELAY);
    
    
    setTimeout(updateStatus, 2000);
    setInterval(updateStatus, 120000);

})();