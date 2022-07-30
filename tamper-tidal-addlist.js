// ==UserScript==
// @name         Tidal add list - version 1
// @version      1.0
// @description  This script Autoplay Tidal
// @author       yeucodon
// @updateURL    https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamper-tidal-addlist.js
// @downloadURL  https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamper-tidal-addlist.js
// @match        https://listen.tidal.com/*
// @run-at       document-start
// @grant        none
// @namespace http://tampermonkey.net/
// ==/UserScript==

(function() {
    'use strict';
    var paragram={
        NameAlbum:"list-thang8-2022",
        list: [
            "https://listen.tidal.com/album/179130881",
            "https://listen.tidal.com/album/179130893",
            "https://listen.tidal.com/album/179306059",
            "https://listen.tidal.com/album/179302544",
            "https://listen.tidal.com/album/179306063",
            "https://listen.tidal.com/album/203008328",
            "https://listen.tidal.com/album/203008282",
            "https://listen.tidal.com/album/201628725",
            "https://listen.tidal.com/album/201628568",
            "https://listen.tidal.com/album/201628552",
            "https://listen.tidal.com/album/201451761",
            "https://listen.tidal.com/album/200828961",
            "https://listen.tidal.com/album/201136331",
            "https://listen.tidal.com/album/204474055",
            "https://listen.tidal.com/album/207454328",
            "https://listen.tidal.com/album/186203251",
            "https://listen.tidal.com/album/178111064",
            "https://listen.tidal.com/album/206658689",
            "https://listen.tidal.com/album/205701358",
            "https://listen.tidal.com/album/205701323",
            "https://listen.tidal.com/album/208235369",
            "https://listen.tidal.com/album/208235426",
            "https://listen.tidal.com/album/202217467",
            "https://listen.tidal.com/album/207424538",
            "https://listen.tidal.com/album/209460014",
            "https://listen.tidal.com/album/183433306/track/183433307",
            "https://listen.tidal.com/album/222324129",
            "https://listen.tidal.com/album/227187160"
        ]
    };

    var curUrl;
    async function addlist(params) {
        // console.log("add list");
        await   sleep(2);
        document.querySelector('button[data-test="show-context-menu-button"]').click();
        await    sleep(0.5);
        document.querySelector('div[data-track--icon-clicked="add_to_playlist\"]>button[data-test=\"add-to-playlist"]').click();
        await    sleep(0.5);
        let clickname = document.querySelector('div[data-track--icon-clicked="' + paragram.NameAlbum + '"]>button');
        if (clickname!==null) {
            console.log("click list");
            clickname.click();
            // document.querySelector('div[data-track--icon-clicked="' + paragram.NameAlbum + '"]>button').click();
        }else{
            alert(`khong tim thay album name ${paragram.NameAlbum}`);
            window.location.reload();
        }
        await  sleep(2);
        dup();
        await   sleep(2);
        await   changelink();

    }
    var dup = (()=>{
        let dup = document.querySelector('.button--FoJMR.subtitle--2mpDt.modalButtonPrimary--3cBTD.modalButton--a5QlL[data-test="confirm"]')
        if (dup!==null) {
            document.querySelector('.button--FoJMR.subtitle--2mpDt.modalButtonPrimary--3cBTD.modalButton--a5QlL[data-test="confirm"]').click()
        }
    })
    async function changelink(params) {
        let indexurl = paragram.list.indexOf(curUrl);
        // console.log("index  "+indexurl);

        if (indexurl>=paragram.list.length-1) {
            console.log('xong');
            alert('xong');
        }else if (indexurl>=0) {
            window.location.href=paragram.list[indexurl+1];
        }
    }
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms*1000));
      }
    async function run() {
        let temp =0 ;
        curUrl= window.location.href;
        console.log("curUrl "+curUrl);
        await sleep(3);
        let indexurl = paragram.list.indexOf(curUrl);
        if (indexurl==-1) {
            window.location.href=paragram.list[0];
        }
        console.log("index  "+indexurl +" / "+paragram.list.length-1);
        let loop = setInterval( async () => {
            let morebtn = document.querySelector('div.header-details');
            if (morebtn!==null) {
                addlist();
                clearInterval(loop);
            }else{
                temp++;
                if (temp>5) {
                    clearInterval(loop);
                    alert('khong tim thay more btn');
                    window.location.href=paragram.list[indexurl+1];
                }
            }
        }, 2000);
    };

    setTimeout(run, 5000);
})();