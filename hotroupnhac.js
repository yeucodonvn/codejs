//document.querySelectorAll('[placeholder="First name"]')
//placeholder="Last name"
//document.querySelectorAll('.coolInput.uploadFileTitle')

/* NodeList 
https://css-tricks.com/snippets/javascript/loop-queryselectorall-matches/
var myNodeList = document.querySelectorAll('li');
forEach(myNodeList, function (index, value) {
  console.log(index, value); // passes index + value back!
});
*/

//=== distrokid

let firstname ="firstname nhac si";
let lastname ="lastname nhac si";

let  track =['DCUOI TY',
'CMV',
'CHAN TINH',
'CBTY',
'CAY DAN SV',
'CA MAU'
];

//==================================
let trackname = document.querySelectorAll('.coolInput.uploadFileTitle');
if (track.length !== trackname.length) {
    console.log("list nhap so luong k giong nhau");
}else{
    for(let index = 0; index < trackname.length; index++) {
        trackname[index].value=track[index];
   }
};

let fname = document.querySelectorAll('[placeholder="First name"]');
foreac(fname,firstname);
let lname = document.querySelectorAll('[placeholder="Last name"]');
foreac(lname,lastname);

function foreac(element,name) {
    for(let index = 0; index < element.length; index++) {
        trackname[index].value=name;
   }
   
}/*
fname.forEach(element, (firstname)=> {
    element.value=firstname;
    
});
C:\Users\alex\Desktop
document.querySelectorAll('.distroFileInput:not([name="artwork"])');

*/



//=== unitedmaster
let arname ="nhac si";

let name = document.querySelectorAll('[placeholder="Enter Legal Names"]') ;
    for(let index = 0; index < name.length; index++) {
        name[index].focus() ;
        setTimeout(() => {
        name[index].value=arname;
        name[index].setAttribute("value",arname);
        }, 500);
        
   };
   
let eletmen = document.querySelectorAll('[placeholder]');
for(let index = 0; index < eletmen.length; index++) {
    let temmp= eletmen[index].getAttribute('placeholder');
    if (temmp.indexOf("Add title for")>=0 ) {
        eletmen[index].focus() ;
        setTimeout(() => {
        temmp=temmp.replace("Add title for ","");
        temmp=temmp.replace(".wav","");
        eletmen[index].setAttribute("value","temmp");
        eletmen[index].value=temmp;
        console.log(temmp);
        }, 500);
    }
};

//=============== tax distrokid =====
//about:config -> dom.event.clipboardevents.enabled -> false
let  info =['Teresa Moore','337547463','37 Myer','Bob White','Wv','25028','3042458068'];

document.querySelector('[value="Individual/Sole Proprietor or Single-Member LLC"]').click();

document.querySelector('[name="individualName"]').value=info[0];

document.querySelector("#taxUnitedStates > form > table > tbody > tr:nth-child(12) > td:nth-child(2) > input").value=info[1];

document.querySelector('[name="addressStreet1"]').value=info[2];

document.querySelector('[name="addressCity"]').value=info[3];
document.querySelector('[name="addressPostalCode"]').value=info[5];
document.querySelector('[name="phone"]').value=info[6];

document.querySelector('[name="signature"]').value=info[0];

document.querySelector('.taxAffirmation').click();


//======== download soundraw

let stop = 0;// doi lenh de stop
let num = 1
let listdown = document.querySelectorAll('[data-icon="arrow-down"]');
listdown.forEach(element => {
    let paten=  element.parentNode;
    setTimeout(() => {
        let loop = setInterval(() => {
            let spinni= document.querySelector('.spinner-border.text-light.downloading.btn-pool.delete-disabled');
            let disablebtn= document.querySelector('.btn-pool.clickable.delete-disabled');
            let load = document.querySelector("#download-btn-background > button").textContent
                if (!disablebtn&&!spinni&& !load.includes("%")){
                    paten.click();
                    console.log(num++ + " down tiep")

                    clearInterval(loop);
                }else if (stop!==0) {
                    clearInterval(loop);
                    console.log("end")
                }else{
                    console.log("doi")
                }
        }, 30000);
    }, 10000);
});

//======== download ecret
let stop = 0;// doi lenh de stop
function down() {
    document.querySelector('.create-music-btn').click();
    let num=0;
    let loop = setInterval(() => {
        let spinni= document.querySelector('.fas.pre-download-btn.enabled.fa-spinner');
        let downloadbtn= document.querySelector('.fas.fa-arrow-down.pre-download-btn.enabled');
        let load = document.querySelector(".progress-wrapper");
        if (!spinni&&num>0) {
            clearInterval(loop);
            console.log(" create");
            setTimeout(down, 5000);
        }else if (stop!==0) {
            clearInterval(loop);
            console.log("end")
        }else   if (downloadbtn&&load&&!spinni&&num==0){
            downloadbtn.click();
            console.log(" down tiep");
            num++;
        }
            else{
                console.log("doi")
            }
    }, 10000);
    pop();
}
function pop() {
setInterval(() => {
    let pop =  document.querySelector("#reload-btn");
   if (pop) {
    pop.click();
   }
}, 10000);
}

down();

let a = document.querySelector('#contents.style-scope.ytmusic-shelf-renderer');
a.querySelectorAll('#play-button.style-scope.ytmusic-item-thumbnail-overlay-renderer[size=""MUSIC_PLAY_BUTTON_SIZE_SMALL""]');

document.querySelectorAll('#avatar-btn')
document.querySelectorAll('.yt-simple-endpoint.style-scope.ytd-compact-link-renderer#endpoint')[51].click();

document.querySelectorAll('.style-scope.yt-multi-page-menu-section-renderer')[14].click();
document.querySelectorAll('.yt-simple-endpoint.style-scope.ytd-compact-link-renderer')[25].textContent;

let istate=true;ytplayer.addEventListener("onStateChange", function(state){ if (state===0) {true= false; }}); return istate;

//========= doc kindle unlimited ============
let i =1;
let istop=1;
let loop = setInterval(() => {
    let next =document.querySelector("#kindleReader_pageTurnAreaRight");
    if (next) {console.log(istop);
        istop++;
        next.click();}
        else{
            console.log("k thay nut next");
            clearInterval(loop);
        }
    if (i==0) {
        console.log("stop");
        clearInterval(loop);
    }
}, (Math.floor(Math.random() * (2000))+1000)*60);


// =========== add list soundcloud =================================

function timer(ms) {return new Promise(resolve => {
    setTimeout(() => {
      resolve('resolved');
    }, ms);
  });}
function run(){
    let listmore = document.querySelectorAll('.sc-button-more[aria-label="More"]');
     listmore.forEach(async element => {
        await element.click();
        timer(10*1000);
         console.log(`click`);
         while (true) {
            let addpll=document.querySelector('.sc-button-addtoset.sc-button.moreActions__button.sc-button-medium');
            if (addpll) {
                addpll.click();
                console.log(`addpll`);
                break;
            }
             timer(10*1000);
        }
         timer(10*1000);
         let dialog = document.querySelector('.modal__content');
         if (dialog){
             while (true) {
                let addpll=document.querySelector('.addToPlaylistButton.sc-button.sc-button-medium.sc-button-responsive');
                if (addpll) {
                    addpll.click();
                    console.log(`addpll`);
                    break;
                }
                 timer(10*1000);
            }
             timer(10*1000);
            let clos=document.querySelector('.modal__closeButton');
            if (clos) {
                clos.click();
                console.log(`close`);
            }
        }
         timer(10*1000);
    });
}
 run();
//========================
//get link yoube bo qua tich
let filldate=1;
let fillview=1;
let datefillter="6 months ago";//days weeks months years
let viewfillter="1M views";
function loctich(params) {
    //home
        let elementgrid= document.querySelectorAll('ytd-rich-item-renderer.style-scope.ytd-rich-grid-renderer,ytd-video-renderer.style-scope.ytd-expanded-shelf-contents-renderer,ytd-compact-video-renderer.style-scope.ytd-watch-next-secondary-results-renderer');
        elementgrid.forEach(element => {
            element.querySelector('#video-title-link,#video-title.yt-simple-endpoint.style-scope.ytd-video-renderer,#video-title.style-scope.ytd-compact-video-renderer').style.backgroundColor='';
            if (element.querySelector('.badge.badge-style-type-verified.style-scope.ytd-badge-supported-renderer,.badge.badge-style-type-verified-artist.style-scope.ytd-badge-supported-renderer')==null) {
                let title = element.querySelector('#video-title-link,#video-title.yt-simple-endpoint.style-scope.ytd-video-renderer,#video-title.style-scope.ytd-compact-video-renderer').getAttribute('aria-label');
                let linkytb = element.querySelector('#thumbnail.yt-simple-endpoint.inline-block.style-scope.ytd-thumbnail,a.yt-simple-endpoint.style-scope.ytd-compact-video-renderer').getAttribute('href');
                let chanel='';
                if (document.querySelector('ytd-compact-video-renderer.style-scope.ytd-watch-next-secondary-results-renderer')!=null) {
                    chanel= element.querySelector('#text.style-scope.ytd-channel-name').textContent;
                } else {
                    chanel= element.querySelector('a.yt-simple-endpoint.style-scope.yt-formatted-string').getAttribute('href');
                }
                let viewdate = element.querySelector('#metadata-line.style-scope.ytd-video-meta-block.has-vidiq-like-ratio,#metadata-line.style-scope.ytd-video-meta-block');
                let view = viewdate.querySelectorAll('.style-scope.ytd-video-meta-block')[0].textContent;
                let time = viewdate.querySelectorAll('.style-scope.ytd-video-meta-block')[1].textContent;
                if ((filldate?date(datefillter)>=date(time):true)&&(fillview?views(view)>=views(viewfillter):true)) {
                    console.log(title+ ' | ' + linkytb+ ' | ' +chanel+ ' | ' +view + ' | ' +time );
                    element.querySelector('#video-title-link,#video-title.yt-simple-endpoint.style-scope.ytd-video-renderer,#video-title.style-scope.ytd-compact-video-renderer').style.backgroundColor='green';
                }
            }
        })
}
function date(element) {
    element = element.replace(' ago','');
    let p =element.split(' '),day=0;
    switch (p[1]) {
        case 'day': day= parseInt(p[0],10);
            break;
        case 'days': day= parseInt(p[0],10);
            break;
        case 'weeks':day= parseInt(p[0],10)*7;
            break;
        case 'month':day= parseInt(p[0],10)*30;
            break;
        case 'months':day= parseInt(p[0],10)*30;
            break;
        case 'year':day= parseInt(p[0],10)*365;
            break;
        case 'years':day= parseInt(p[0],10)*365;
            break;
        default:
            break;
    }
    return day;
}
function views(element) {
    element = element.replace(' views','');
    let view=0;
    if (element.indexOf('M')!=-1) {
        view= parseFloat(element.replace('M',''))*1000000;
    } else if (element.indexOf('K')!=-1) {
        view= parseFloat(element.replace('K',''))*1000;
    } else {
        view= parseFloat(element);
    }
    return view;
}
loctich();


//================================================================
let element= document.querySelectorAll('a[dir="ltr"]');
           element.forEach(element => {
            console.log(element.getAttribute('href'));
           });

//==== copy vafo clipboad
let ips=document.querySelectorAll('[data-qa-ip-main]');
let lis='';
ips.forEach(element => {
    lis+=element.textContent+'\n';
});
console.log(lis);
CopyMe(lis);

  function CopyMe(TextToCopy) {
    var TempText = document.createElement("input");
    TempText.value = TextToCopy;
    document.body.appendChild(TempText);
    TempText.select();
    
    document.execCommand("copy");
    document.body.removeChild(TempText);
    
    alert("Copied the text: " + TempText.value);
  }
  //==== nháp
/*



https://www.youtube.com/watch?v=vmWmCw_8WsE
https://vananhtooo.wordpress.com/2017/10/16/cac-cach-giup-ban-thuc-hien-upload-file-voi-selenium/
key simulator cefshap c#
key simulator selenium c#

document.addEventListener ('keydown', function (event){ 
    console.log (event.which); 
});  
 
var evt = new KeyboardEvent('keydown', {'keyCode':65, 'which':65}; 
document.dispatchEvent (evt); 

https://jsfiddle.net/DxER9/

$("#eventTarg").bind ("keydown keypress keyup change",  function (zEvent) {
    console.log ("Input event:", zEvent.type, zEvent);
    $("#eventLog").append ('<span>' + zEvent.type + ': ' + zEvent.which + ', </span>');
} );

$("button").click ( function (zEvent) {
    if (zEvent.target.id == "simA_plain") {
        console.log ("Plain");
        var keyVal = 65;
        $("#eventTarg").trigger ( {
            type: 'keypress', keyCode: keyVal, which: keyVal, charCode: keyVal
        } );
    }
    else {
        console.log ("Plugin");
        $("#eventTarg").sendkeys ("B") ;
    }
} );


https://gist.github.com/ejoubaud/7d7c57cda1c10a4fae8c

Podium = {};

Podium.keydown = function(k) {
    var oEvent = document.createEvent('KeyboardEvent');

    // Chromium Hack
    Object.defineProperty(oEvent, 'keyCode', {
                get : function() {
                    return this.keyCodeVal;
                }
    });     
    Object.defineProperty(oEvent, 'which', {
                get : function() {
                    return this.keyCodeVal;
                }
    });     

    if (oEvent.initKeyboardEvent) {
        oEvent.initKeyboardEvent("keydown", true, true, document.defaultView, k, k, "", "", false, "");
    } else {
        oEvent.initKeyEvent("keydown", true, true, document.defaultView, false, false, false, false, k, 0);
    }

    oEvent.keyCodeVal = k;

    if (oEvent.keyCode !== k) {
        alert("keyCode mismatch " + oEvent.keyCode + "(" + oEvent.which + ")");
    }

    document.body.dispatchEvent(oEvent);
}

Podium.keydown(40); // for arrow-down, arrow-up is 38
*/
