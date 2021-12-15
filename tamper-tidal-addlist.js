// ==UserScript==
// @name         Tidal add list - version 1
// @version      1.0
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
    var urlarr;
    var name_album;
    $.ajax ( {
		type:       'GET',
		url:        'https://raw.githubusercontent.com/yeucodonvn/codejs/master/tidal-artist.json',
		dataType:   'JSON',
		success:    function (apiJSON) {
			let PARAMSURL = apiJSON;
			urlarr=PARAMSURL.list;
            name_album=PARAMSURL.NameAlbum;
		},
		error:      function(err){
			alert("Cannot load JSON ytbartist");
			alert(err);
		}
	});

    var curUrl;
    function addlist(params) {
        document.querySelector('button[data-test=\"show-context-menu-button\"]').click();
        document.querySelector('div[data-track--icon-clicked="add_to_playlist\"]>button[data-test=\"add-to-playlist"]').click();
        document.querySelector('div[data-track--icon-clicked="' + name_album + '"]>button').click();
        let dup = document.querySelector('.button--FoJMR.subtitle--2mpDt.modalButtonPrimary--3cBTD.modalButton--a5QlL[data-test="confirm"]')
        if (dup!==null) {
            document.querySelector('.button--FoJMR.subtitle--2mpDt.modalButtonPrimary--3cBTD.modalButton--a5QlL[data-test="confirm"]').click();
        }
    }
    function changelink(params) {
        let indexurl = urlarr.indexOf(curUrl);
        window.location.href(urlarr[indexurl+1]);
    }
    function run() {
        let temp =0 ;
        curUrl= window.location.href;
        console.log("curUrl "+curUrl);
        let loop = setInterval(() => {
            let morebtn = document.querySelector('div.header-details');
            if (morebtn!==null) {
                addlist();
                cleanup(loop);
            }else{
                temp++;
                if (temp>5) {
                    cleanup(loop);
                    console.log('khong tim thay more btn');
                }
            }
        }, 2000);
    };

    setTimeout(run, 5000);

})();