(function () {
    'use strict';
    var LocalStorageKey = "urlSoundcloud";
    console.log("wait time");
    let url = localStorage.getItem(LocalStorageKey);
    console.log(url);
    
    setTimeout(function () {
        
        window.location.href = url;
    }, 20 * 60 * 1000);
})();
