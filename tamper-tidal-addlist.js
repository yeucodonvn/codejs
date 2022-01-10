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
        NameAlbum:"list-thang1-2022",
        list: [
            "https://listen.tidal.com/album/179130881",
"https://listen.tidal.com/album/179130893",
"https://listen.tidal.com/album/179306059",
"https://listen.tidal.com/album/179302544",
"https://listen.tidal.com/album/179306063",
"https://listen.tidal.com/album/181922465",
"https://listen.tidal.com/album/178484775",
"https://listen.tidal.com/album/192027731",
"https://listen.tidal.com/album/195963518",
"https://listen.tidal.com/album/194604354",
"https://listen.tidal.com/album/194767487",
"https://listen.tidal.com/album/195200433",
"https://listen.tidal.com/album/195497426",
"https://listen.tidal.com/album/195963077",
"https://listen.tidal.com/album/196039609",
"https://listen.tidal.com/album/193760650/track/193760652",
"https://listen.tidal.com/album/196987210",
"https://listen.tidal.com/album/198366248",
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
"https://listen.tidal.com/album/195191959",
"https://listen.tidal.com/album/195088664",
"https://listen.tidal.com/album/195088753",
"https://listen.tidal.com/album/186203251",
"https://listen.tidal.com/album/178111064",
"https://listen.tidal.com/album/206658689",
"https://listen.tidal.com/album/205701358",
"https://listen.tidal.com/album/205701323",
"https://listen.tidal.com/album/208235369",
"https://listen.tidal.com/album/208235426",
"https://listen.tidal.com/album/202217467",
"https://listen.tidal.com/album/207424538",
"https://listen.tidal.com/album/207454328",
"https://listen.tidal.com/album/209460014"
        ]
    };

    var curUrl;
    async function addlist(params) {
        console.log("add list");
        await   sleep(2);
        document.querySelector('button[data-test="show-context-menu-button"]').click();
        await    sleep(0.5);
        document.querySelector('div[data-track--icon-clicked="add_to_playlist\"]>button[data-test=\"add-to-playlist"]').click();
        await    sleep(0.5);
        let clickname = document.querySelector('div[data-track--icon-clicked="' + paragram.NameAlbum + '"]>button');
        if (clickname!==null) {
            clickname.click();
            // document.querySelector('div[data-track--icon-clicked="' + paragram.NameAlbum + '"]>button').click();
        }else{
            window.location.reload();
        }
        await    sleep(0.5);
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
        console.log("index  "+indexurl);

        if (indexurl>=paragram.list.length-1) {
            console.log('xong');
        }else if (indexurl>-1) {
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
        let loop = setInterval( async () => {
            let morebtn = document.querySelector('div.header-details');
            if (morebtn!==null) {
                addlist();
                clearInterval(loop);
            }else{
                temp++;
                if (temp>5) {
                    clearInterval(loop);
                    console.log('khong tim thay more btn');
                }
            }
        }, 2000);
    };

    setTimeout(run, 5000);

   
})();