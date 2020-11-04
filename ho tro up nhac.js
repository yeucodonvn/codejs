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

const firstname ="firstname nhac si";
const lastname ="lastname nhac si";

const  track =['teen bafi hats',
'teen bafi hats'
];

//==================================
const trackname = document.querySelectorAll('.coolInput.uploadFileTitle');
if (track.length !== trackname.length) {
    console.log("list nhap so luong k giong nhau");
}else{
    for(let index = 0; index < trackname.length; index++) {
        trackname[index].value=track[index];
   }
};

const fname = document.querySelectorAll('[placeholder="First name"]');
foreac(fname,firstname);
const lname = document.querySelectorAll('[placeholder="Last name"]');
foreac(lname,lastname);

function foreac(element,name) {
    for(let index = 0; index < element.length; index++) {
        trackname[index].value=name;
   }
}


//=== unitedmaster
const arname ="nhac si";

const name = document.querySelectorAll('[placeholder="Enter Legal Names"]') ;
    for(let index = 0; index < name.length; index++) {
        name[index].value=arname;
   };
const eletmen = document.querySelectorAll('[placeholder]');
for(let index = 0; index < eletmen.length; index++) {
    let temmp= eletmen[index].getAttribute('placeholder');
    if (temmp.indexOf("Add title for")>=0 ) {
        temmp=temmp.replace("Add title for ","");
        temmp=temmp.replace(".wav","");
        eletmen[index].value=temmp;
        console.log(temmp);
    }
};