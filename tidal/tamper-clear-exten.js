// https://chrome.google.com/webstore/detail/clear-browsing-data/bjilljlpencdcpihofiobpnfgcakfdbe?hl=vi
function clear(params) {
    let urlclearEx = 'chrome-extension://bjilljlpencdcpihofiobpnfgcakfdbe/src/action/index.html';
    document.querySelector("body > div.v-application.v-theme--light.v-layout.v-layout--full-height.v-locale--is-ltr.vn-app > div > div.list-items-wrap > div.v-list.v-theme--light.v-list--density-default.v-list--one-line.list-items.vn-list.list-items > div:nth-child(1)").click();
}
function config(params) {
    // Set a string value
localStorage.setItem('name', 'Alice');

// Set a number value
localStorage.setItem('age', 25);

// Set an array value
var colors = ['red', 'green', 'blue'];
localStorage.setItem('colors', JSON.stringify(colors));

// Set an object value
var user = {name: 'Bob', email: 'bob@example.com'};
localStorage.setItem('user', JSON.stringify(user));
// Get a string value
var name = localStorage.getItem('name');
console.log(name); // Alice

// Get a number value
var age = localStorage.getItem('age');
console.log(age); // 25

// Get an array value
var colors = JSON.parse(localStorage.getItem('colors'));
console.log(colors); // ['red', 'green', 'blue']

// Get an object value
var user = JSON.parse(localStorage.getItem('user'));
console.log(user); // {name: 'Bob', email: 'bob@example.com'}

}

