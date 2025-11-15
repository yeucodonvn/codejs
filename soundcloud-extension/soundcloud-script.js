// SoundCloud AutoPlay Script - Running in MAIN world
(function () {
	'use strict';

	console.log('[SoundCloud AutoPlay] Extension loaded in MAIN world');

	var LocalStorageKey = "urlSoundcloud";
	var temp_number = 200;

	function play_btn() {
		checkstop();
		var loopClickRepeat = setInterval(function () {
			let element = document.querySelector('section.playControls__inner');
			if (element !== null) {
				clearInterval(loopClickRepeat);
				setTimeout(shuffle, 10000);
				setTimeout(repeatpp, 1000);
				setstop();
			} else {
				console.log("[SoundCloud AutoPlay] Searching for play controls...");
			}
		}, 5000);
	}

	function checkstop() {
		setInterval(function () {
			let element = document.querySelector('.playControls__elements>button[aria-label="Play current"],.soundTitle__playButton>[role="button"][title="Play"]:not(.playlock-freeze)');
			if (element != null) {
				console.log('[SoundCloud AutoPlay] Detected pause, clicking play...');
				element.click(); // Native click in MAIN world
			}
		}, 5000);
	}
	function setstop() {
		setTimeout(function () {
			window.location.href = 'https://google.com/';
		}, temp_number * 60 * 1000); // Stop after temp_number minutes
	}
	function SetLocalStorage(key, value) {
		localStorage.setItem(key, value);
		console.log('[SoundCloud AutoPlay] Saved "' + key + '" to localStorage.');
	}

	function repeatpp() {
		let intload = 0;
		let loop = setInterval(function () {
			let element = document.querySelector(".repeatControl");
			if (element && !element.classList.contains('m-all')) {
				console.log("[SoundCloud AutoPlay] Enabling repeat...");
				element.click();
			} else {
				clearInterval(loop);
			}
			if (intload > 7) { clearInterval(loop) }
			intload++;
		}, 1000)
	}

	function shuffle() {
		var element = document.querySelector('button.shuffleControl');
		if (element && !element.classList.contains('m-shuffling')) {
			console.log("[SoundCloud AutoPlay] Enabling shuffle...");
			element.click();
		}
	}

	function clickLike() {
		let loopClickLikeRepeat = setInterval(function () {
			let btnRender = document.querySelector('[aria-label="Like"]');
			if (btnRender != null) {
				if (Math.floor(Math.random() * 125) > 100) {
					console.log("[SoundCloud AutoPlay] Liking track...");
					btnRender.click();
				}
				clearInterval(loopClickLikeRepeat);
			}
		}, 100 * 1000);
	}

	function clickFollow() {
		let loopClickLikeRepeat = setInterval(function () {
			let btnRender = document.querySelector('[aria-label="Follow"]');
			if (btnRender != null) {
				if (Math.floor(Math.random() * 105) > 100) {
					console.log("[SoundCloud AutoPlay] Following artist...");
					btnRender.click();
				}
				clearInterval(loopClickLikeRepeat);
			}
		}, 100 * 1000);
	}

	function run() {

		console.log("[SoundCloud AutoPlay] Starting automation...");
		let signin = document.querySelector('[aria-label="Sign in"]');
		if (signin != null) return;
		let url = localStorage.getItem(LocalStorageKey);
		if (url == null || url == "" || url == "undefined") {
			url = prompt("Enter SoundCloud URL:", "https://soundcloud.com/marilyncortez/sets/melodies-from-beyond-1");
			SetLocalStorage(LocalStorageKey, url);
			console.log("[SoundCloud AutoPlay] Redirecting to: " + url);
			window.location.href = url;
		}
		else {
			let curl = window.location.href;
			if (curl.includes(url)) {
				setTimeout(play_btn, 20000);
			}
			else {
				setTimeout(function () {
					console.log("[SoundCloud AutoPlay] Wrong URL, redirecting...");
					window.location.href = url;
				}, 10000);
			}
		}
	}

	// Start after 5 seconds
	setTimeout(run, 5000);

})();
