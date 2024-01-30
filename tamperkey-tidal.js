// ==UserScript==
// @name         Tidal - version 2.3
// @version      2.3
// @description  This script Autoplay Tidal
// @author       yeucodon
// @updateURL    https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamperkey-tidal.js
// @downloadURL  https://raw.githubusercontent.com/yeucodonvn/codejs/master/tamperkey-tidal.js
// @match        https://listen.tidal.com/*
// @match        https://www.google.com/*
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
		let upgrader = document.querySelector('[class*="sidebarUpgrade"]')
		if (upgrader) {
			alert("tai khoan het han");
			return;
		}
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
				window.location.href = "https://www.google.com";
			};
		}, 50000)
	};
	//check HIFI status
	async function checkHIFI() {
		try {
			let hifi = document.querySelector('[data-test="media-state-high"]')
			if (hifi !== null) {
				hifi.click();
				await sleep(5);
				document.querySelector('[for="streaming-audio-quality-standard-footer"]')?.click();
			}
		} catch (error) {
			console.log("error checkHIFI ");
		}
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
					//get_time();
					demloi = 0;
					clearInterval(loopchecktime);
				} else { demok++; }
				if (demok > 3) { demok = 0; clearInterval(loopchecktime) }
			}, 10 * 1000);
			if (search_spincount >= 10) {
				console.log("reload spinloader");
				window.location.href = "https://www.google.com";
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
				var observer = new MutationObserver(function (mutations) {
					mutations.forEach(function (mutation) {
						if (mutation.type == 'attributes' && mutation.attributeName == 'aria-valuenow') {
							var newValue = mutation.target.getAttribute('aria-valuenow');
							if (newValue == 20) {
								REPEAT_NUMB--;
								console.log(REPEAT_NUMB);
							}
						}
					});
				});
				var progressBar = document.getElementById('progressBar');
				var config = {
					attributes: true, childList: false,
					attributeFilter: ['aria-valuenow']
				};
				observer.observe(progressBar, config);

				//===============

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
							/*
							if (parseInt(totalDuration) > 0) {
								var observer = new MutationObserver(function (mutations) {
									mutations.forEach(function (mutation) {
										if (mutation.type == 'attributes' && mutation.attributeName == 'aria-valuenow') {
											var newValue = mutation.target.getAttribute('aria-valuenow');
											if (newValue == 20) {
												REPEAT_NUMB--;
											}
										}
									});
								});
								var progressBar = document.getElementById('progressBar');
								var config = { attributes: true };
								observer.observe(progressBar, config);
							} else { */
							if (parseInt(totalDuration) <= 0) {
								console.log(`khong thay time${endtime}`);
								document.querySelector('.playback-controls__button--white-icon[data-test="next"],[data-type="button__skip-next"][data-test="next"]').click();
								REPEAT_NUMB--;
							}
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
						if (REPEAT_NUMB == 0) {
							changelist();
						}
					}, 5000);
			} else {
				changelist();
			}

		} catch (error) {
			console.log(`loi get time${error}`);
		}
	};
	function changelist(params) {
		setTimeout(function () {
			if (urlarr.length > 1) {
				window.location.href = urlarr[Math.floor(Math.random() * (urlarr.length - 1))];
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
			case window.location.href.indexOf("google.com") > -1:
				return 4;
			default:
				return 0;
		}
	}
	function playlist(params) {
		let header = document.querySelector('.header-details')
		let trk = header.querySelector('[data-test="grid-item-meta-item-count"]')
		let numbertrack = trk.textContent;
		console.log(numbertrack);
		var regex = /\d+/;
		var result = numbertrack.match(regex);
		REPEAT_NUMB = Number(result[0]) + 7;

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
	function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms * 1000));
	}
	async function run() {
		console.log("Tidal AutoPlay - MANAGER");
		$(window).off('beforeunload.windowReload');
		if (detecturl() == 4) {
			let timewait = 60 * 60;
			console.log(`wait change link ${timewait}`);
			setTimeout(changelist, timewait * 1000);
		} else {
			let detectloign = document.querySelector('#login-button');
			if (detectloign !== null) {
				return;
			}
			let loop = setInterval(async () => {
				let captchas = document.querySelector('iframe[src*="https://geo.captcha-delivery.com"]');
				if (captchas) {
					window.location.href = "https://www.google.com";
				} else
					if (detecturl() !== 0) {
						if (detecturl() == 1) {
							changelist();
						}
						clearInterval(loop);
						ruuun();
					}
			}, 5000);
		}
	};
	setTimeout(run, 5000);

})();
