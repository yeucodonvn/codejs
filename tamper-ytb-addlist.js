// ==UserScript==
// @name         Youtube add list - version 1
// @version      1.0
// @description  This script Autoplay Youtube
// @author       yeucodon
// @updateURL    https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamper-ytb-addlist.js
// @downloadURL  https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamper-ytb-addlist.js
// @match        https://music.youtube.com/*
// @run-at       document-start
// @grant        none
// @namespace http://tampermonkey.net/
// ==/UserScript==

(function() {
    'use strict';
    const paragram={
        NameAlbum:"list-thang9-2022",
        list: [
            "https://music.youtube.com/playlist?list=OLAK5uy_lzgPOZ--PyaavUSrVJISt-auc6LdET7NQ",
            "https://music.youtube.com/playlist?list=OLAK5uy_mowQfV4B_wxXxnZ1Zg64Vru-riDuj52U8",
            "https://music.youtube.com/playlist?list=OLAK5uy_keIQ6xUMHTM1HimorvtzroWH927n-SU_Q",
            "https://music.youtube.com/playlist?list=OLAK5uy_mSqBFklpOc7d0LUxeCGgEkpEPhes9d1MY",
            "https://music.youtube.com/playlist?list=OLAK5uy_n8E8MDuuII5XHyzaq6kzM4cjCMWMuK_G4",
            "https://music.youtube.com/playlist?list=OLAK5uy_kRkTPjdhtK2ceR6b9n0PhepVNMrtSyfSg",
            "https://music.youtube.com/playlist?list=OLAK5uy_mMRG1IjV9ujmlw3yZ4Ke3FkEyJRbe8570",
            "https://music.youtube.com/playlist?list=OLAK5uy_mvSPOSkgPwlxS44cffixmmd4yfotayjbw",
            "https://music.youtube.com/playlist?list=OLAK5uy_lGfqmfuP5NyPirbVctVMOTxGe2gKPWDAM",
            "https://music.youtube.com/playlist?list=OLAK5uy_npU9_bBWx0w2Q7t7TFWEjIeiDUsw7eUhs",
            "https://music.youtube.com/playlist?list=OLAK5uy_ktsywtS1mqC60oUI5F1Rwos0i8VDH0Opg",
            "https://music.youtube.com/playlist?list=OLAK5uy_kkfUoeCTWMYjBvMFY6w_MRNhhzk7dvMYY",
            "https://music.youtube.com/playlist?list=OLAK5uy_k_DbaZo3W72OEwN6zs0iQrXzqtG5efSJU",
            "https://music.youtube.com/playlist?list=OLAK5uy_liAssO0sRWjb8fbKfbtp9q04BxmAkhQIQ",
            "https://music.youtube.com/playlist?list=OLAK5uy_mmNeF5FqRhaIpW3A1dQu81lcVImVoD1hM",
            "https://music.youtube.com/playlist?list=OLAK5uy_mrT_UklcQRiq6rlvIvXc3pmZLVoXUL7p4",
            "https://music.youtube.com/playlist?list=OLAK5uy_n0ky1t3ywujpBOV114P3e450cY-dCt34s",
            "https://music.youtube.com/playlist?list=OLAK5uy_lGXSvs-JYI2iJmF6RoUqgDb_ec8XTGBHc",
            "https://music.youtube.com/playlist?list=OLAK5uy_mGG_BBcK2Tj0C-SHGIYMYRnRhtrTpQHM8",
            "https://music.youtube.com/playlist?list=OLAK5uy_nITp7z8N2tRlZXZIebQ6nEPSopOEcSMfs",
            "https://music.youtube.com/playlist?list=OLAK5uy_nZ1IomTbhRJdaadM3QOACgW194_hlMQlI",
            "https://music.youtube.com/playlist?list=OLAK5uy_kufc5UB0A4qR6q3TVIvd__XNnmbNqlja0",
            "https://music.youtube.com/playlist?list=OLAK5uy_lRvsqL93ph1nsQRfln6-3TomG4KZJ531M",
            "https://music.youtube.com/playlist?list=OLAK5uy_ntvTqP-snTF9GWQfMw8GhUMhsijMerPzA",
            "https://music.youtube.com/playlist?list=OLAK5uy_m6B1RGcgutzeLnV9GHIXgCJuD4NYCC8Ss"
        ]
    };

    const curUrl= window.location.href;
    async function addlist(params) {
        // console.log("add list");
        await   sleep(2);
        document.querySelector('tp-yt-paper-icon-button[title="More actions"]').click();
        await    sleep(0.5);
        let more_action = document.querySelector('ytmusic-menu-popup-renderer');
        let list_action = more_action.querySelectorAll('yt-formatted-string')
        list_action.forEach(element => {
            if (element.textContent.search('Add to playlist')>-1) {
                element.click();
            }
        });
        await    sleep(0.5);
        let add_list_pop =document.querySelector('ytmusic-add-to-playlist-renderer');
        let add_to_list = add_list_pop.querySelector('yt-formatted-string[title="'+paragram.NameAlbum +'"')
        if (add_to_list!==null) {
            console.log("click list");
            add_to_list.click();
            // document.querySelector('div[data-track--icon-clicked="' + paragram.NameAlbum + '"]>button').click();
        }else{
            alert(`khong tim thay album name ${paragram.NameAlbum}`);
            // window.location.reload();
        }
        await  sleep(2);
        await   changelink();

    }
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
        sleep(3);
        paragram;
        let temp =0 ;
        // curUrl= window.location.href;
        console.log("curUrl "+curUrl);
        await sleep(3);
        let indexurl = paragram.list.indexOf(curUrl);
        if (indexurl==-1) {
            window.location.href=paragram.list[0];
        }
        console.log("index  "+indexurl +" / "+(paragram.list.length-1));
        let loop = setInterval( async () => {
            let morebtn = document.querySelector('tp-yt-paper-icon-button[title="More actions"]');
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