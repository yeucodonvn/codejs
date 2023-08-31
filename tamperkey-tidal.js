// ==UserScript==
// @name         Tidal - version 2.2.2
// @version      2.2.2
// @description  This script Autoplay Tidal
// @author       yeucodon
// @updateURL    https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamperkey-tidal.js
// @downloadURL  https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamperkey-tidal.js
// @match        https://listen.tidal.com/*
// @run-at       document-idle
// @grant    	GM_openInTab
// @grant 		GM_getTabs
// @grant 		GM_saveTab
// @require  	https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @namespace 	http://tampermonkey.net/
// ==/UserScript==

(function () {
	'use strict';

	var REPEAT_NUMB = 30;
	let urlarr = [];
	//list cu ["d60d7202-4074-4923-b037-30f6ee9e7a1a","67422e19-a08e-4a9b-909b-034b2749362b"];

	// @run-at       document-end
	// phai la end k se loi jquery
	// var URLsc;
	$.ajax({
		type: 'GET',
		url: 'https://raw.githubusercontent.com/yeucodonvn/codejs/master/tidal-artist.json',
		dataType: 'JSON',
		success: function (apiJSON) {
			let PARAMS = apiJSON;
			urlarr = PARAMS.list;
		},
		error: function (err) {
			alert("Cannot load JSON file");
			alert(err);
		}
	});
	/* fetch('https://raw.githubusercontent.com/yeucodonvn/codejs/master/tidal-artist.json')
		.then(response => response.json())
		.then(apiJSON => {
			let PARAMS = apiJSON;
			urlarr = PARAMS.list;
		})
		.catch(err => {
			alert("Cannot load JSON file");
			alert(err);
		}); */

	/* function wait(delay) {
		return new Promise((resolve) => setTimeout(resolve, delay));
	}
	function fetchRetry(url, delay, tries, fetchOptions = {}) {
		function onError(err) {
			triesLeft = tries - 1; if (!triesLeft) { throw err; } return wait(delay).then(() => fetchRetry(url, delay, triesLeft, fetchOptions));

		} console.log('Fetch : ' + tries);
		return fetch(url, fetchOptions)
			.then(response => response.json())
			.then(apiJSON => { let PARAMS = apiJSON; urlarr = PARAMS.list; })
			.catch(onError)
	};
	// Goi lai sau 3s, retry toi da 100 lan 
	fetchRetry(url, 3000, 100); */
	function clickshuffle() {
		console.log("click shuffleAll");
		let shufflebtn = document.querySelector("[data-test='shuffle-all'][data-track--button-id='shuffle']");
		shufflebtn.click();
		setTimeout(checkHIFI, 10000);
		setTimeout(get_time, 10000);
		repeat();
	};
	function cookiebanner(params) {
		document.querySelector('#onetrust-banner-sdk');
		document.querySelector('#onetrust-reject-all-handler');

	}
	let search_stop_count = 0;
	function checkstop() {
		let stop = setInterval(function () {
			var playbtn = document.querySelector('[data-test="play"]');
			if (playbtn) {
				console.log("search stop: " + search_stop_count);
				document.querySelector('.playback-controls__button--white-icon[data-test="next"],[data-type="button__skip-next"][data-test="next"]').click();
				//playbtn.click();
				search_stop_count++;
				clearInterval(stop);
			}
			if (search_stop_count >= 15) {
				console.log("reload search stop");
				//window.location.reload(true)
				window.open(urlarr[Math.floor(Math.random() * (urlarr.length - 1))]);
				GM_saveTab({ active: true }); // save the current tab as active
				GM_getTabs((tabs) => {
					for (const [tabId, tab] of Object.entries(tabs)) {
						if (!tab.active) { // if the tab is not active
							window.close(tabId); // close it
						}
					}
				});
			};
		}, 50000)
	};
	//check HIFI status
	async function checkHIFI() {
		try {
			let streaming_quality = document.querySelector("button[data-test-streaming-quality]")
			let modestream = streaming_quality.getAttribute('data-test-streaming-quality')
			if (modestream.toLowerCase().search('low') == -1) {
				streaming_quality.click()
				console.log('change mode click');
				await sleep(5);
				let changemode = document.querySelector('button[data-test="streaming-audio-quality-standard"]')
				changemode.click();
				console.log('change mode');
				await sleep(3);
				window.location.reload(true);
			}
		} catch (error) {
			console.log("error checkHIFI ");
		}
	}

	function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms * 1000));
	}

	function repeat() {
		console.log("click repeat")
		let intload = 0;
		let loop = setInterval(function () {
			let repeatt = document.querySelector('[class^="repeatButton"],.withBackground[title="Repeat"]');
			if (repeatt) {
				let attribute = repeatt.getAttribute('data-type')
				if (attribute == 'button__repeatAll') {
					clearInterval(loop);
				} else { repeatt.click() };;
				if (intload > 10) { clearInterval(loop) }
			}
			intload++;
		}, 2000)

	}

	function search_footer_player() {
		let searchft = document.querySelector("[data-test='footer-player'][data-track--module-id='footer_player']");
		if (searchft == null) {
			console.log("search footer player");
			clickshuffle();
		}
	};

	var search_spincount = 0;
	function search_play_spin_load() {
		if (document.querySelector('#progressBar')) {
			let current_time = document.querySelector('#progressBar').getAttribute('aria-valuenow');
			let demloi = 0;
			let demok = 0;
			let loopchecktime = setInterval(function () {
				let temp_time = document.querySelector('#progressBar').getAttribute('aria-valuenow');
				if (current_time.localeCompare(temp_time) == 0) {
					console.log("search xoay tron" + search_spincount);
					demloi++;
				}
				if (demloi > 3) {
					console.log("xoay tron next" + search_spincount);

					search_spincount++;
					document.querySelector('.playback-controls__button--white-icon[data-test="next"],[data-type="button__skip-next"][data-test="next"]').click();
					get_time();
					demloi = 0;
					clearInterval(loopchecktime);
				} else { demok++; }
				if (demok > 3) { demok = 0; clearInterval(loopchecktime) }
			}, 10 * 1000);
			if (search_spincount >= 10) {
				console.log("reload spinloader");
				//window.location.reload(true)
				window.open(urlarr[Math.floor(Math.random() * (urlarr.length - 1))]);
				GM_saveTab({ active: true }); // save the current tab as active
				GM_getTabs((tabs) => {
					for (const [tabId, tab] of Object.entries(tabs)) {
						if (!tab.active) { // if the tab is not active
							window.close(tabId); // close it
						}
					}
				});
			};
		}
	};

	function hmsToSecondsOnly(str) {
		let p = str.split(':'),
			s = 0, m = 1;
		while (p.length > 0) {
			s += m * parseInt(p.pop(), 10);
			m *= 60;
		}

		return s;
	};

	var temp_number = 20;
	function get_time() {//dem lui reload
		try {
			// if (temp_number > 0) {
			if (REPEAT_NUMB > 0) {
				console.log(REPEAT_NUMB);
				let loopGetDuration = setInterval(
					function () {
						// var Duration = document.querySelector('[data-test="duration"]');
						var Duration = document.querySelector('#progressBar').getAttribute('aria-valuemax');
						if (Duration == null) {
							console.log("khong tim thay thoi gian cua bai, thong bao lai cho em");
						}
						let current_time = document.querySelector('#progressBar').getAttribute('aria-valuenow');
						if (current_time == null) {
							console.log("khong tim thay thoi gian hien tai cua bai, thong bao lai cho em");
						}
						let iniduration = 0;
						if (Duration > 0) {
							checktime()
							// if (current_time > 0) {
							clearInterval(loopGetDuration);
							let totalDuration = document.querySelector('#progressBar').getAttribute('aria-valuemax');
							let current_time = document.querySelector('#progressBar').getAttribute('aria-valuenow');
							if (totalDuration > 0) {
								var endtime = totalDuration - current_time;
								if (endtime > 0) {
									console.log("Get duration Total " + endtime);
									REPEAT_NUMB--;
									setTimeout(get_time, (endtime + 5) * 1000);
								} else {
									document.querySelector('.playback-controls__button--white-icon[data-test="next"],[data-type="button__skip-next"][data-test="next"]').click();
									console.log(`next ${endtime}`);
									REPEAT_NUMB--;
								}
							} else {
								console.log(`khong thay time${endtime}`);
								document.querySelector('.playback-controls__button--white-icon[data-test="next"],[data-type="button__skip-next"][data-test="next"]').click();
								REPEAT_NUMB--;
							}
							// } else
							// 	// get theo% processbar
							// 	if (hmsToSecondsOnly(document.querySelector('[data-test="current-time"]').textContent.trim()) == 0) {
							// 		let progress_bar = document.querySelector('[data-test="progress-bar"]');
							// 		if (progress_bar != null) {
							// 			let sstyle = progress_bar.querySelector('[style]')
							// 			let current_prcess = sstyle.getAttribute('style').trim();
							// 			current_prcess = current_prcess.replace("transform: translateX(-", "");
							// 			// loi neu dinh k chay bai hat
							// 			current_prcess = current_prcess.replace("%);", "");
							// 			if (current_prcess > 0) {
							// 				let totalDuration = hmsToSecondsOnly(Duration.textContent.trim());
							// 				let endtime = totalDuration * (current_prcess / 100);
							// 				console.log("Get duration Total " + endtime);
							// 				temp_number--;
							// 				setTimeout(get_time, (endtime + 5) * 1000);
							// 			} else {
							// 				const next = '.playback-controls__button--white-icon[data-test="next"],[data-type="button__skip-next"][data-test="next"]';
							// 				document.querySelector(next).click();
							// 				REPEAT_NUMB--;
							// 			}
							// 		}
							// 	}
						}
						else {
							iniduration++;
							console.log(`khong thay Duration${Duration}`);

							document.querySelector('.playback-controls__button--white-icon[data-test="next"],[data-type="button__skip-next"][data-test="next"]').click();
							REPEAT_NUMB--;
							if (iniduration > 10) {
								changelist();
							}
						}
					}, 5000);
			} else {
				changelist();
				// location.reload(true);
			}

		} catch (error) {
			console.log(`loi get time${error}`);
		}
	};
	function newtab(params) {
		setTimeout(function () {
			if (urlarr.length > 1) {
				// alert("hay tat trang hien tai");
				window.location.href = (urlarr[Math.floor(Math.random() * (urlarr.length - 1))]);
				// window.open(urlarr[Math.floor(Math.random() * (urlarr.length - 1))], { active: true })
				// setTimeout(() => {
				// 	window.close();
				// }, 2000);
			} else {
				location.reload(true)
			}
		}, 5000);
	}
	function changelist(params) {
		setTimeout(function () {
			if (urlarr.length > 1) {
				window.location.href = urlarr[Math.floor(Math.random() * (urlarr.length - 1))];

				// window.open(urlarr[Math.floor(Math.random() * (urlarr.length - 1))], "_blank");
				// GM_openInTab(urlarr[Math.floor(Math.random() * (urlarr.length - 1))], { active: true })
				// setTimeout(() => {
				// 	window.close();
				// }, 2000);


			} else {
				location.reload(true)
				// window.open(window.location.href, "_blank");
				// window.close();
			}
		}, 5000);
	}

	function checktime(params) {
		try {
			let totalDuration = document.querySelector('#progressBar').getAttribute('aria-valuemax');
			let current_time = document.querySelector('#progressBar').getAttribute('aria-valuenow');
			if (Number(current_time) > Number(totalDuration)) {
				console.log(`check time errorr ${current_time} total ${totalDuration}`);
				document.querySelector('.playback-controls__button--white-icon[data-test="next"],[data-type="button__skip-next"][data-test="next"]').click();
				// changelist();
			}
		} catch (error) {

		}
	}
	function detecturl() {
		/* code laays link tw
		let element1= document.querySelectorAll('a[dir="ltr"][href]')
		   element1.forEach(element => {
			console.log(element.getAttribute('href'));
		   }); */
		switch (true) {
			case window.location.href.indexOf("/explore") > -1:
				return 1;
			case window.location.href.indexOf("/album") > -1:
				return 2;
			case window.location.href.indexOf("/playlist") > -1:
				return 3;
			default:
				return 0;
		}
	}
	function playlist(params) {
		let header = document.querySelector('.header-details')
		let trk = header.querySelector('[data-test="grid-item-meta-item-count"]')
		let numbertrack = trk.textContent;
		console.log(numbertrack);
		REPEAT_NUMB = Number(numbertrack.replace(' TRACKS', '')) + 7;
		temp_number = Number(numbertrack.replace(' TRACKS', '')) + 7;
	}

	function ruuun() {
		var intload = 0;
		let load = setInterval(function () {
			let shuflle = document.querySelector("[data-test='shuffle-all'][data-track--button-id='shuffle']");
			let login = document.querySelector('[datatest="no-user--login"]');
			let signup = document.querySelector('[datatest="no-user--signup"]');

			if (login !== null && signup !== null) {
				console.log("page doi login");
				clearInterval(load);
			} else {
				//https://listen.tidal.com/view/pages/explore
				if (shuflle !== null) {
					setTimeout(clickshuffle, 10 * 1000);
					setTimeout(playlist, 10 * 1000);
					setInterval(search_footer_player, 50 * 1000);
					setInterval(checktime, 50 * 1000);
					setInterval(search_play_spin_load, 50 * 1000);
					setInterval(checkstop, 50 * 1000);
					clearInterval(load);
				} else { intload++; console.log("tim nut shuffle"); }

				if (intload > 7) {
					console.log("reload search btn");
					// check block


					changelist();
				}
			}
		}, 5000)
	}
	function Sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms * 1000));
	}
	function run() {
		console.log("Tidal AutoPlay - MANAGER");
		$(window).off('beforeunload.windowReload');
		let detectloign = document.querySelector('#login-button');
		if (detectloign !== null) {
			return;
		}
		let loop = setInterval(() => {
			let captchas = document.querySelector('iframe[src *= "captcha-delivery.com"]');
			if (captchas) {
				Sleep(20 * 60);
			} else
				if (detecturl() !== 0) {
					if (detecturl() == 1) {
						newtab();
					}
					clearInterval(loop);
					ruuun();
				}
		}, 5000);
	};
	setTimeout(run, 5000);

})();
