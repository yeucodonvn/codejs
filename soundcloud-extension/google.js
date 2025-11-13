(function () {
    'use strict';
    var LocalStorageKey = "urlSoundcloud";

    setTimeout(function () {
        let url = localStorage.getItem(LocalStorageKey);
        window.location.href = url;
    }, 20 * 60 * 1000);
})();
