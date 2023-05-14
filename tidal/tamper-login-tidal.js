// Get all tabs
GM_getTabs(function(tabs) {
    // Loop through each tab object
    for (var i = 0; i < tabs.length; i++) {
      // Get the URL of the tab
      var url = tabs[i].url;
      // Do something with the URL
      console.log(url);
    }
  });


/**
 * check login o listen.tidal.com
 * chuyen tiep sang login js
 * check block page -> neu block clear doi 1h
 * check acc.play neu 0 thi random
 * login dung fetch hoac ajax gui data len server ( set play 1 )
 * 
 * ////
 * sau khi play xong, gui data len server ( set play 0)
 * mo extension clean tab moi
 * dung GM_getTabs de check close page extension
 * f5 trang
 */