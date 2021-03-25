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

document.querySelector('.secondary-flex-columns.style-scope.ytmusic-responsive-list-item-renderer').textContent;
document.querySelector('.title-column.style-scope.ytmusic-responsive-list-item-renderer')
document.querySelector('.flex-columns.style-scope.ytmusic-responsive-list-item-renderer').click();

let istate=true;ytplayer.addEventListener("onStateChange", function(state){ if (state===0) {true= false; }}); return istate;


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
