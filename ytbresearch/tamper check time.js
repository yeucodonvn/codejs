// ==UserScript==
// @name         Douyn check times
// @namespace    http://tampermonkey.net/
// @version      2024-08-09
// @description  try to take over the world!
// @author       You
// @match        https://www.douyin.com/discover
// @match        https://www.douyin.com/?recommend=1
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyin.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    function discover(params) {
        let lagElement = document.querySelector('div#waterFallScrollContainer');
        async function add(node) {
            if (node.nodeName.toLowerCase() === 'div') {
                let time = node.querySelector('span[class="iME2aRIb yqgtGZur"]')
                if (time) {
                    let timetext = time.textContent;
                    // console.log(timetext);
                    if (timetext.includes('小') || timetext.includes('分')) {
                        // console.log(`correct ${timetext}`);
                        //YW2FZ8iD
                        let number = timetext.match(/\d+/)[0];
                        if (number < 20) {
                            let name = node.querySelector('div.YW2FZ8iD')
                            let tap = name.textContent;
                            if (tap.includes('第一集') || tap.includes('第1集') || tap.includes('第01集')) {
                                name.style.backgroundColor = '#1DAB6F';
                                alert(`tìm thấy tập 1 ${tap}`)
                            }
                            else
                                name.style.backgroundColor = '#FFC10D';
                        }
                    }
                    // else if (timetext.includes('月')) {
                    //     node.remove();
                    // }
                }
            }
        }
        const firsttimes = (lagElement) => {
            let childlistdiv = lagElement.querySelectorAll('.YW2FZ8iD');
            for (const element of childlistdiv) {
                let time = element.querySelector('span[class="iME2aRIb yqgtGZur"]')
                if (time) {
                    let timetext = time.textContent;
                    if (timetext.includes('小') || timetext.includes('分')) {
                        let number = timetext.match(/\d+/)[0];
                        if (number < 20) {
                            let tap = element.textContent;
                            if (tap.includes('第一集') || tap.includes('第1集') || tap.includes('第01集')) {
                                element.style.backgroundColor = '#1DAB6F';
                                alert(`tìm thấy tập 1 ${tap}`)

                            }
                            else
                                element.style.backgroundColor = '#FFC10D';
                        }
                    }
                }
            }

        }
        firsttimes(lagElement);
        const observer = new MutationObserver(function (mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    let addedNodes = mutation.addedNodes;
                    addedNodes.forEach((node) => {
                        add(node);
                    });
                }
            }
        });
        const config = { childList: true, subtree: true };
        observer.observe(lagElement, config);
    }


    function recomment(params) {
        async function addrecom(node) {
            if (node.nodeName.toLowerCase() === 'div') {
                let time = node.querySelector('span.time')
                if (time) {
                    let timetext = time.textContent;
                    // console.log(timetext);
                    if (timetext.includes('小') || timetext.includes('分')) {
                        // console.log(`correct ${timetext}`);
                        //YW2FZ8iD
                        let number = timetext.match(/\d+/)[0];
                        if (number < 10) {
                            let name = node.querySelector('div[class="title notBideoTags"],div.title')
                            let tap = name.textContent;
                            if (tap.includes('第一集') || tap.includes('第1集') || tap.includes('第01集'))
                                name.style.backgroundColor = '#FFC10D';
                            else
                                name.style.backgroundColor = '#1DAB6F';
                        }
                    }
                    // else if (timetext.includes('月')) {
                    //     node.remove();
                    // }
                }
            }
        }

        let lagElement = document.querySelector('[data-e2e="feed-active-video"] [class*="basePlayerContainer"]');
        const observer = new MutationObserver(function (mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    let addedNodes = mutation.addedNodes;
                    addedNodes.forEach((node) => {
                        addrecom(node);
                    });
                }
            }
        });
        const config = { childList: true, subtree: true };
        observer.observe(lagElement, config);
    }
    let loopsearch = setInterval(() => {

        if (document.querySelector('div#waterFallScrollContainer')) {
            clearInterval(loopsearch)
            discover();
        } else if (document.querySelector('[data-e2e="feed-active-video"] [class*="basePlayerContainer"]')) {
            clearInterval(loopsearch)
            recomment()
        }
    }, 1000);

})();