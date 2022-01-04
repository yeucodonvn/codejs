//version 3.3.2 end
const {chromium,firefox, devices}  = require('playwright');
const fs = require('fs');
const { match } = require('assert');
const http      = require('http'),
      https     = require('https');
const request = require('request').defaults({ encoding: null });
const Captcha = require('2captcha');


//playwright-extra-stealth
// var playwrightExtraStealth = require("playwright-extra-stealth")
// yarn add playwright@1.8.0 playwright-extra@next
//https://github.com/berstend/puppeteer-extra/tree/automation-extra/packages/playwright-extra#quickstart

//================
const srcDir = `data/profile`;

let typecapcha=true;
let b_headFull = true;
let isStop=false;
let runos ="chrome"; // chrome , ff
let UA =[
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:83.0) Gecko/20100101 Firefox/83.0',
]
let useragnets = UA[Math.floor(Math.random()*UA.length)];
//=====================

    async function khoitao(browsertype,userdata,sock)
    {
        try {
            let widths=Math.floor(Math.random()*(1280-800)+800);
            let heights=Math.floor(Math.random()*(1024-600)+600);
            let launchoptionchrome={
                //headless :false,
                chromiumSandbox:false,
                args:[
                    '--no-sandbox',
                    '--no-pings',
                    '--no-zygote',
                    // '--mute-audio',
                    '--no-first-run',
                    '--no-default-browser-check',
                    '--disable-software-rasterizer',
                    '--disable-cloud-import',
                    '--disable-gesture-typing',
                    '--disable-setuid-sandbox',
                    '--disable-offer-store-unmasked-wallet-cards',
                    '--disable-offer-upload-credit-cards',
                    '--disable-print-preview',
                    '--disable-voice-input',
                    '--disable-wake-on-wifi',
                    '--disable-cookie-encryption',
                    '--ignore-gpu-blocklist',
                    '--enable-async-dns',
                    '--enable-simple-cache-backend',
                    '--enable-tcp-fast-open',
                    '--enable-webgl',
                    '--prerender-from-omnibox=disabled',
                    '--enable-web-bluetooth',
                    '--ignore-certificate-errors',
                    '--ignore-certificate-errors-spki-list',
                    '--disable-site-isolation-trials',
                    '--disable-features=AudioServiceOutOfProcess,IsolateOrigins,site-per-process,TranslateUI,BlinkGenPropertyTrees', // do not disable UserAgentClientHint
                    '--aggressive-cache-discard',
                    '--disable-extensions',
                    '--disable-blink-features',
                    '--disable-blink-features=AutomationControlled',
                    '--disable-ipc-flooding-protection',
                    '--enable-features=NetworkService,NetworkServiceInProcess,TrustTokens,TrustTokensAlwaysAllowIssuance',  // support ServiceWorkers
                    '--disable-component-extensions-with-background-pages',
                    '--disable-default-apps',
                    '--disable-breakpad',
                    '--disable-component-update',
                    '--disable-domain-reliability',
                    '--disable-sync',
                    '--disable-client-side-phishing-detection',
                    '--disable-hang-monitor',
                    '--disable-popup-blocking',
                    '--disable-prompt-on-repost',
                    '--metrics-recording-only',
                    '--safebrowsing-disable-auto-update',
                    '--password-store=basic',
                    '--autoplay-policy=no-user-gesture-required',
                    '--use-mock-keychain',
                    '--force-webrtc-ip-handling-policy=default_public_interface_only',
                    '--disable-session-crashed-bubble',
                    '--disable-crash-reporter',
                    '--disable-dev-shm-usage',
                    '--force-color-profile=srgb',
                    '--disable-accelerated-2d-canvas',
                    '--disable-translate',
                    '--disable-background-networking',
                    '--disable-background-timer-throttling',
                    '--disable-backgrounding-occluded-windows',
                    '--disable-infobars',
                    '--hide-scrollbars',
                    '--disable-renderer-backgrounding',
                    '--font-render-hinting=none',
                    '--disable-logging',
                    '--use-gl=swiftshader',             // better cpu usage with --use-gl=desktop rather than --use-gl=swiftshader, still needs more testing.
                
                    // optimze fps
                    '--enable-surface-synchronization',
                    '--run-all-compositor-stages-before-draw',
                    '--disable-threaded-animation',
                    '--disable-threaded-scrolling',
                    '--disable-checker-imaging',
                
                    '--disable-new-content-rendering-timeout',
                    '--disable-image-animation-resync',
                    '--disable-partial-raster',
                
                    '--blink-settings=primaryHoverType=2,availableHoverTypes=2,primaryPointerType=4,availablePointerTypes=4',
                
                    // '--deterministic-mode',                          // Some friends commented that with this parameter mouse movement is stuck, so let's comment it out
                    // '--disable-web-security',
                    // '--disable-cache',                               // cache
                    // '--disable-application-cache',
                    // '--disable-offline-load-stale-cache',
                    // '--disable-gpu-shader-disk-cache',
                    // '--media-cache-size=0',
                    // '--disk-cache-size=0',
                    // '--enable-experimental-web-platform-features',   // Make Chrome for Linux support Bluetooth. eg: navigator.bluetooth, window.BluetoothUUID
                    // '--disable-gpu',                                 // Cannot be disabled: otherwise webgl will not work
                    // '--disable-speech-api',                          // Cannot be disabled: some websites use speech-api as fingerprint
                    // '--no-startup-window',                           // Cannot be enabled: Chrome won't open the window and puppeteer thinks it's not connected
                    // '--disable-webgl',                               // Requires webgl fingerprint
                    // '--disable-webgl2',
                    // '--disable-notifications',                       // Cannot be disabled: notification-api not available, fingerprints will be dirty
                
                //"--app=https://music.youtube.com",
                ],
                ignoreDefaultArgs: [ "--enable-automation"],//--no-audio ? --mute-audio
                ignoreDefaultArgs: ['--disable-component-extensions-with-background-pages'],
                //...emu,
                language : 'en',
                geolocation: { longitude: 48.858455, latitude: 2.294474 },
                permissions: ['geolocation'],
                hasTouch:true,
                viewport: { width: widths, height: heights },
                screen : { width: widths, height: heights },
                colorScheme: 'dark' ,
                bypassCSP: true,
            }
            launchoptionchrome.tracesDir='';
            let launchoptionfirefox={ };
            if (b_headFull) {
                launchoptionfirefox.headless =false;
                launchoptionchrome.headless =false;
            }

            if (sock!==false) {
                if (sock.search(':')<0) {
                    launchoptionchrome.proxy=  { server:sock+':3128',
                    username:'copcoi',
                    password:'Pedped99'
                    }
                }else {
                    launchoptionchrome.proxy=  { server:sock.split(':')[0]+':'+sock.split(':')[1],
                    username:sock.split(':')[2],
                    password:sock.split(':')[3]
                    }
                }
            }

            let chromiumpatch='chrome-win/chrome.exe';
            if (fs.existsSync(chromiumpatch)) {
                launchoptionchrome.executablePath=chromiumpatch;
            }
            log(`windows size ${widths} ${heights}`);
            launchoptionchrome.userAgent=useragnets;
            const browser = await chromium.launchPersistentContext(userdata,launchoptionchrome);
            const page = await  browser.newPage();
            log('run');
            const enabledEvasions = [
                'chrome.app',
                'chrome.csi',
                'chrome.loadTimes',
                'chrome.runtime',
                'iframe.contentWindow',
                'media.codecs',
                'navigator.hardwareConcurrency',
                'navigator.languages',
                'navigator.permissions',
                'navigator.plugins',
                'navigator.webdriver',
                'sourceurl',
                // 'user-agent-override', // doesn't work since playwright has no page.browser()
                'webgl.vendor',
                'window.outerdimensions'
            ];
            const evasions = enabledEvasions.map(e => new require(`puppeteer-extra-plugin-stealth/evasions/${e}`));
            const stealth = {
                callbacks: [],
                async evaluateOnNewDocument(...args) {
                    this.callbacks.push({ cb: args[0], a: args[1] })
                }
            }
            evasions.forEach(e => e().onPageCreated(stealth));
            for (let evasion of stealth.callbacks) {
                await page.addInitScript(evasion.cb, evasion.a);
            }
            page.setDefaultTimeout(0);
            await evaluateOnNewDocument(page);
            return {browser,page};
        }
         catch (error) {
            log(error.stack);
        }
    };
    async function khoitao_lauch(browsertype,sock)
    {
        try {
            let launchoptionchrome={
                //headless :false,
                
                chromiumSandbox:false,
                args:[
                    '--no-sandbox',
                    '--no-pings',
                    '--no-zygote',
                    '--mute-audio',
                    '--no-first-run',
                    '--no-default-browser-check',
                    '--disable-software-rasterizer',
                    '--disable-cloud-import',
                    '--disable-gesture-typing',
                    '--disable-setuid-sandbox',
                    '--disable-offer-store-unmasked-wallet-cards',
                    '--disable-offer-upload-credit-cards',
                    '--disable-print-preview',
                    '--disable-voice-input',
                    '--disable-wake-on-wifi',
                    '--disable-cookie-encryption',
                    '--ignore-gpu-blocklist',
                    '--enable-async-dns',
                    '--enable-simple-cache-backend',
                    '--enable-tcp-fast-open',
                    '--enable-webgl',
                    '--prerender-from-omnibox=disabled',
                    '--enable-web-bluetooth',
                    '--ignore-certificate-errors',
                    '--ignore-certificate-errors-spki-list',
                    '--disable-site-isolation-trials',
                    '--disable-features=AudioServiceOutOfProcess,IsolateOrigins,site-per-process,TranslateUI,BlinkGenPropertyTrees', // do not disable UserAgentClientHint
                    '--aggressive-cache-discard',
                    '--disable-extensions',
                    '--disable-blink-features',
                    '--disable-blink-features=AutomationControlled',
                    '--disable-ipc-flooding-protection',
                    '--enable-features=NetworkService,NetworkServiceInProcess,TrustTokens,TrustTokensAlwaysAllowIssuance',  // support ServiceWorkers
                    '--disable-component-extensions-with-background-pages',
                    '--disable-default-apps',
                    '--disable-breakpad',
                    '--disable-component-update',
                    '--disable-domain-reliability',
                    '--disable-sync',
                    '--disable-client-side-phishing-detection',
                    '--disable-hang-monitor',
                    '--disable-popup-blocking',
                    '--disable-prompt-on-repost',
                    '--metrics-recording-only',
                    '--safebrowsing-disable-auto-update',
                    '--password-store=basic',
                    '--autoplay-policy=no-user-gesture-required',
                    '--use-mock-keychain',
                    '--force-webrtc-ip-handling-policy=default_public_interface_only',
                    '--disable-session-crashed-bubble',
                    '--disable-crash-reporter',
                    '--disable-dev-shm-usage',
                    '--force-color-profile=srgb',
                    '--disable-accelerated-2d-canvas',
                    '--disable-translate',
                    '--disable-background-networking',
                    '--disable-background-timer-throttling',
                    '--disable-backgrounding-occluded-windows',
                    '--disable-infobars',
                    '--hide-scrollbars',
                    '--disable-renderer-backgrounding',
                    '--font-render-hinting=none',
                    '--disable-logging',
                    '--use-gl=swiftshader',             // better cpu usage with --use-gl=desktop rather than --use-gl=swiftshader, still needs more testing.
                
                    // optimze fps
                    '--enable-surface-synchronization',
                    '--run-all-compositor-stages-before-draw',
                    '--disable-threaded-animation',
                    '--disable-threaded-scrolling',
                    '--disable-checker-imaging',
                
                    '--disable-new-content-rendering-timeout',
                    '--disable-image-animation-resync',
                    '--disable-partial-raster',
                
                    '--blink-settings=primaryHoverType=2,availableHoverTypes=2,primaryPointerType=4,availablePointerTypes=4',
                
                    // '--deterministic-mode',                          // Some friends commented that with this parameter mouse movement is stuck, so let's comment it out
                    // '--disable-web-security',
                    // '--disable-cache',                               // cache
                    // '--disable-application-cache',
                    // '--disable-offline-load-stale-cache',
                    // '--disable-gpu-shader-disk-cache',
                    // '--media-cache-size=0',
                    // '--disk-cache-size=0',
                    // '--enable-experimental-web-platform-features',   // Make Chrome for Linux support Bluetooth. eg: navigator.bluetooth, window.BluetoothUUID
                    // '--disable-gpu',                                 // Cannot be disabled: otherwise webgl will not work
                    // '--disable-speech-api',                          // Cannot be disabled: some websites use speech-api as fingerprint
                    // '--no-startup-window',                           // Cannot be enabled: Chrome won't open the window and puppeteer thinks it's not connected
                    // '--disable-webgl',                               // Requires webgl fingerprint
                    // '--disable-webgl2',
                    // '--disable-notifications',                       // Cannot be disabled: notification-api not available, fingerprints will be dirty
                
                //"--app=https://music.youtube.com",
                ],
                ignoreDefaultArgs: [ "--enable-automation"],//--no-audio ? --mute-audio
                ignoreDefaultArgs: ['--disable-component-extensions-with-background-pages'],

            }
            launchoptionchrome.tracesDir='';
            let launchoptionfirefox={ };
            if (b_headFull) {
                launchoptionfirefox.headless =false;
                launchoptionchrome.headless =false;
            }

            if (sock!==false) {
                if (sock.search(':')<0) {
                    launchoptionchrome.proxy=  { server:sock+':3128',
                    username:'copcoi',
                    password:'Pedped99'
                    }
                }else {
                    launchoptionchrome.proxy=  { server:sock.split(':')[0]+':'+sock.split(':')[1],
                    username:sock.split(':')[2],
                    password:sock.split(':')[3]
                    }
                }
            }

            let chromiumpatch='chrome-win/chrome.exe';
            if (fs.existsSync(chromiumpatch)) {
                launchoptionchrome.executablePath=chromiumpatch;
            }
            let widths=Math.floor(Math.random()*(1280-800)+800);
            let heights=Math.floor(Math.random()*(1024-600)+600);
            log(`windows size ${widths} ${heights}`);
            let browsercontextoptions={
                //...emu,
                language : 'en',
                geolocation: { longitude: 48.858455, latitude: 2.294474 },
                permissions: ['geolocation'],
                hasTouch:true,
                viewport: { width: widths, height: heights },
                screen : { width: widths, height: heights },
                colorScheme: 'dark' ,
                bypassCSP: true,
            };
            
            browsercontextoptions.userAgent=useragnets;
            let browser=null;
            if (browsertype=='ff') {
                browser = await firefox.launch(launchoptionfirefox);
            } else {
                browser = await chromium.launch(launchoptionchrome);
            }
            const context = await browser.newContext(browsercontextoptions);
            const page = await  context.newPage();
            

            log('run');
            const enabledEvasions = [
                'chrome.app',
                'chrome.csi',
                'chrome.loadTimes',
                'chrome.runtime',
                'iframe.contentWindow',
                'media.codecs',
                'navigator.hardwareConcurrency',
                'navigator.languages',
                'navigator.permissions',
                'navigator.plugins',
                'navigator.webdriver',
                'sourceurl',
                // 'user-agent-override', // doesn't work since playwright has no page.browser()
                'webgl.vendor',
                'window.outerdimensions'
            ];
            const evasions = enabledEvasions.map(e => new require(`puppeteer-extra-plugin-stealth/evasions/${e}`));
            const stealth = {
                callbacks: [],
                async evaluateOnNewDocument(...args) {
                    this.callbacks.push({ cb: args[0], a: args[1] })
                }
            }
            evasions.forEach(e => e().onPageCreated(stealth));
            for (let evasion of stealth.callbacks) {
                await page.addInitScript(evasion.cb, evasion.a);
            }
            page.setDefaultTimeout(0);
            await evaluateOnNewDocument(context);
            return {browser,page};
        } catch (error) {
            log(error.stack);
        }
    }
    async function evaluateOnNewDocument(context) {
        //Skip images/styles/fonts loading for performance
   
        await context.addInitScript(() => {
            // Pass webdriver check
            Object.defineProperty(navigator, 'webdriver', {
                get: () => false,
            });
        });
    
        await context.addInitScript(() => {
            // Pass chrome check
            window.chrome = {
                runtime: {},
                // etc.
            };
        });
        await context.addInitScript(() => {
            const newProto = navigator.__proto__
            delete newProto.webdriver
            navigator.__proto__ = newProto
        });
    
        await context.addInitScript(() => {
            //Pass notifications check
            const originalQuery = window.navigator.permissions.query;
            return window.navigator.permissions.query = (parameters) => (
                parameters.name === 'notifications' ?
                    Promise.resolve({ state: Notification.permission }) :
                    originalQuery(parameters)
            );
        });
    
        await context.addInitScript(() => {
            // Overwrite the `plugins` property to use a custom getter.
            Object.defineProperty(navigator, 'plugins', {
                // This just needs to have `length > 0` for the current test,
                // but we could mock the plugins too if necessary.
                get: () => [1, 2, 3, 4, 5],
            });
        });

        await context.addInitScript(() => {
            // Overwrite the `languages` property to use a custom getter.
            Object.defineProperty(navigator, 'languages', {
                get: () => ['en-US', 'en'],
            });
        });

        await context.addInitScript(() => {

            Object.defineProperty(navigator, 'maxTouchPoints', {
                get() {
                    "¯\_(ツ)_/¯";
                    return 1;
                },
            });
            navigator.permissions.query = i => ({then: f => f({state: "prompt", onchange: null})});
        });

        await context.addInitScript(() => {
            window.qs = document.querySelector;
            window.qsAll = document.querySelectorAll;
          });
    }
    async function logingmail(page, acc){
        let status = "";
        try{
            let email = acc[0];
            let pass = acc[1];
            let emailkp = acc[2];
            await navigatorload(page,'https://mail.google.com/mail/u/0/h/esqtsrzq9zd7/?v=prfap');
            await page.waitForTimeout(2000);
            let url = await page.evaluate(async () => document.location.href);
            if (url.search('signin/v2')>-1||url.search('/about/')>-1) {
                await navigatorload(page,'https://accounts.google.com/signin/v2/identifier?service=youtube');
                log('login gmail');
                await page.tap('#identifierId');
                // await page.fill('#identifierId',email);
                log('login mail ' +email);
                await page.keyboard.type(email,{delay: 100});
                await page.keyboard.press('Enter');
                await page.waitForTimeout(2000);
                try {
                    //if (await page.$('#captchaAudio[src]')!==null) {
                    let capcha = await page.$('#captchaAudio[src]');
                    if(capcha!==null) {
                        log('dinh capcha');
                        if (typecapcha) {
                            log('capcha => ');
                            let i = 0;
                            while (true){
                                await recapcha(page);
                                if(await waitForTime(page,'[name="password"]',10)) break;
                                else{
                                    i++;
                                    if (i >=3)return status="doi capcha";
                                }
                            };
                            //await page.waitForLoadState('networkidle');
                        }else {
                            return status="doi capcha";
                        }
                    };
                    let botsingin = await page.$('text=This browser or app may not be secure.');
                    if (botsingin) {
                        log('Couldn’t sign you in =>'+useragnets);
                        return status="This browser or app may not be secure";
                        //await page.waitForLoadState('networkidle');
                    }
                } catch (error) {
                    log('loi capcha => '+error.stack);
                }
                await page.tap('[name="password"]');
                await page.keyboard.type(pass,{delay: 100});
                await page.keyboard.press('Enter');
                await page.waitForTimeout(4000);
                try {
                    // let verphone = await page.$('text=Verify it’s you');
                    let verphone = await page.evaluate(()=>(document.querySelector('[type="tel"]').textContent=="Verify it’s you"));
                    if(verphone) {
                        log('verrphone');
                        return status= 'ver phone';
                    }
                } catch (error) {
                }
                try {
                    let emailrecovery = await page.$('div[role="link"]:has-text("Confirm your recovery email")');
                    if(emailrecovery) {
                        log('emailkp');
                        await page.tap('div[role="link"]:has-text("Confirm your recovery email")')
                        await page.tap('#knowledge-preregistered-email-response');
                        await page.keyboard.type(emailkp,{delay: 100});
                        await Promise.all([
                            page.waitForNavigation(),
                            await page.keyboard.press('Enter')
                        ]);
                    }
                } catch (error) {
                    //console.log('loi email kp => '+error.stack);
                }
                try {
                    let url = await page.evaluate(async () => document.location.href);
                    if (url.search('accounts.google.com/CheckCookie')>-1) {
                            page.waitForNavigation()
                    }
                } catch (error) {
                }
                await navigatorload(page,'https://mail.google.com/mail/u/0/h/esqtsrzq9zd7/?v=prfap');
                await page.waitForTimeout(4000);
                let url = await page.evaluate(async () => document.location.href);
                if (url.search('signin/v2')>-1) {
                    log('sai tai khoan');
                }else{
                    log('login ok');
                    status = 'login ok';
                }
            }else{
                log('da login');
                status = 'login ok';
            }
        } catch (error) {
            log("loi =>  "+error.stack);
        }
        return status;
    }
    async function recapcha(page){
        const linkcaptcha = await page.locator('img#captchaimg[src *= "Captcha"]');
        let url = await linkcaptcha.getAttribute('src');
        let basecode = await base64('https://accounts.google.com'+url);
        let resuiltcode = await slovercode(basecode);
        log(`code capcha ${resuiltcode.data}`);
        let inputbtn = url.replace('/Captcha?v=2&ctoken=',"")
        await page.tap('input[aria-label="Type the text you hear or see"]');
        await page.keyboard.type(resuiltcode.data,{delay: 100});
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2000);
    }

    async function base64(url){  
        log(`convert captcha to base64`);
        return new Promise((resolve, reject)=>{  
            request.get(url, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    data = "data:" + response.headers["content-type"] + ";base64," + Buffer.from(body).toString('base64');
                    resolve(data);
                }else{
                    reject(error);
                }
            });
        })
    }
    async function slovercode(basecode){ 
        log(`Slover captcha`);
        return new Promise((resolve, reject)=>{
            const solver = new Captcha.Solver('eec2a83bcbf570d877b23d815087ce3e');
            solver
                //.imageCaptcha(fs.readFileSync('Captcha.jpg', 'base64'))
                .imageCaptcha(basecode)
                .then((res) => { resolve (res); })
                .catch((err) => {  reject(err); });
        })
     }
    function savefile(file,mess) {
        try {
            let path = 'data/'+file+'.txt';
            if (!fs.existsSync(path)) {
                fs.appendFile(path,"", function (err) {
                    if (err) console.log(err.stack);
                });
            }
            fs.appendFile(path,mess + '\r\n',function (err) {
                if (err) {
                    console.log(error.stack);
                } else {
                  // done
                }});
        } catch (error) {
            console.log(error.stack);
        }
    }
    function writefile(path,list) {
        try {
            if (!fs.existsSync(path)) {
                fs.appendFile(path,"", function (err) {
                    if (err) console.log(err.stack);
                });
            }
            let mess="";
            list.forEach(text => {
                mess+=text + '\r\n';
            });

            fs.writeFile(path,mess,function (err) {
                if (err) {
                    console.log(error.stack);
                } else {
                  // done
                }});
        } catch (error) {
            console.log(error.stack);
        }
    }
    function download(url,file){
        try {
            const https = require('https')
            https.get(url, resp => resp.pipe(fs.createWriteStream(file)));
        } catch (error) {
            log("loi download update "+error.stack)
        }
    }
    async function checkupdate(file) {
        try {
            log("check update");
            url='https://raw.githubusercontent.com/yeucodonvn/codejs/master/tool/'+file;

            //check update
            let versionhost="";
            await getlink(url,file).then(
                result => {
                    let contenthost = result;
                    var re =  new RegExp(/version .*? end/g);
                    versionhost = contenthost.match(re)[0].replace("version ","").replace(" end","");
                    log(versionhost);
                    if (versionhost!="") {
                        let contentlocal = fs.readFileSync(file, 'utf8')
                        let versionlocal = contentlocal.match(re)[0].replace("version ","").replace(" end","");
                        log(versionlocal);
                        if (versionhost>versionlocal) {
                            //download de file
                            download(url,file);
                            log("update code");
                        }
                        contenthost="";
                        contentlocal="";
                        }
                    },
                    error => log("getlink update error"+error)
                );
        } catch (error) {
            log("update error => " + error.stack);
        }
    }
    function getlink(params,file) {
        const getScript = (url) => {
            return new Promise((resolve, reject) => {
                let client = http;
                if (url.toString().indexOf("https") === 0) {
                    client = https;
                }
                client.get(url, (resp) => {
                    let data = '';
                    // A chunk of data has been recieved.
                    resp.on('data', (chunk) => {
                        data += chunk;
                    });
                    // The whole response has been received. Print out the result.
                    resp.on('end', () => {
                        resolve(data);
                    });
                }).on("error", (err) => {
                    reject(err);
                });
            });
        };
        return getScript(params);
    }
    async function dialogdiss(page)
    {
        try {
            await page.on('dialog', async (dialog) => {
                log(dialog.message());
                await dialog.accept();
            })
        } catch (error) {
            log('error dialog ');
        }
    }

    async function log(mess) {
        try {
            let path = 'data/log.txt';
            if (!fs.existsSync(path)) {
                fs.appendFile(path,"log!", function (err) {
                    if (err) throw err;
                });
            }
            //mess = new Date()+ ':\t'+mess 

            fs.appendFile(path,new Date()+ ':\t'+mess+ '\r\n',function (err) {
                if (err) {
                    console.log(error.stack);
                } else {
                  // done
                }});
            console.log(mess);
        } catch (error) {
            console.log(error.stack);
        }
    }
    async function navigatorload(page,urllink) {
        let i = 0 ;
        do {
            try {
                await Promise.all([
                    page.goto(urllink,{waitUntil: 'load', timeout: 0}),
                    page.waitForNavigation(),
                ]);
                return
                
            } catch (error) {
                log("loi load link => "+urllink + '\n'+error.stack);
                i++;
                await page.waitForTimeout(3000);
                if (i >=10) return;
            }
        } while (true);
    }

    async function runjs(page) {
        try {
            //check video paused js
            await page.evaluate(()=>{
                var playnum=0;
                var ADDED_EVENT = 0;
                function addele(){
                    const element = document.createElement('button');
                    element.innerHTML = '0';
                    element.id = 'playnum_plw';
                    document.body.appendChild(element);
                    console.log("create button");
                }
                function clickLike(){
                    let ytplayer = document.getElementById("movie_player");
                        if(ADDED_EVENT!==1){
                            ytplayer.addEventListener("onStateChange", function(state){
                                if(state === 0){
                                    playnum++;
                                    document.querySelector('button#playnum_plw').innerHTML=playnum;
                                    console.log(playnum);
                                    let btnRender = document.getElementById("like-button-renderer");
                                    if(btnRender != null){
                                        if(Math.floor(Math.random() * 15) > 10){
                                            console.log("Like Click");
                                            btnRender.querySelector('[aria-label="Like"],.like.style-scope.ytmusic-like-button-renderer').click();
                                        }
                                    }
                                }
                            });
                            ADDED_EVENT = 1;
                        }
                };
                function togglepage(params) {
                    setInterval(() => {
                        let tog = document.querySelector('.toggle-player-page-button.style-scope.ytmusic-player-bar[aria-label="Close player page"]');
                        if(tog!==null){tog.click();
                            setTimeout(function(){
                                let minivideo = document.querySelector('ytmusic-player.style-scope.ytmusic-player-page');
                                if (minivideo.hasAttribute('player-ui-state_')) {
                                    console.log('player-ui-state_');
                                    minivideo.removeAttribute('player-ui-state_');//player-ui-state_="INACTIVE"
                                }//video-mode_
                                if (minivideo.hasAttribute('video-mode_')) {
                                    console.log('video-mode_');
                                    minivideo.removeAttribute('video-mode_');//player-ui-state_="INACTIVE"
                                }
                            },5000);
                        }
                    }, 10*1000);
                }

                function checkspinloader(){
                    let intcheck = 0;
                    setInterval(function(){
                        let autdioo = !!Array.prototype.find.call(document.querySelectorAll('audio,video'),function(elem){return elem.duration > 0 && !elem.paused});
                        let spinloader = document.querySelector('.play-pause-button-spinner.style-scope.ytmusic-player-bar');
                        let gethidden=spinloader.getAttribute("aria-hidden");
                        if(!gethidden || autdioo==false){
                            document.querySelector('[aria-label="Next song"],.next-button.style-scope.ytmusic-player-bar').click();
                            console.log("check spin loader");
                            intcheck++;
                        }
                        if(intcheck>10){
                            document.querySelector('.style-scope.yt-button-renderer[aria-label="Shuffle"],[aria-label="PLAY ALL"],[aria-label="PHÁT TẤT CẢ"],[aria-label="Phát ngẫu nhiên"]').click();
                            intcheck=0;
                        }
                    },60 * 1000);
                };
                function checkVideoPaused(){
                    setInterval(function(){
                        let yesBtn = document.querySelector(".style-scope.yt-button-renderer.style-blue-text[id='button']");
                        if(yesBtn){
                            console.log("check pause");
                            yesBtn.click();
                        }
                    },60 * 1000);
                };
                function run() {
                    addele();
                    checkVideoPaused();
                    clickLike();
                    togglepage();
                    checkspinloader();
                }
                console.log("run script");
                run();
            });
        } catch (error) {
            log("loi run js => "+ error.stack);
        }
    }
    async function waitnext(page,numnext){
        await page.waitForTimeout(2000);
        do {
            if (await waitForTime(page,'button#playnum_plw',5)) {
                let num = await page.evaluate(() => document.querySelector('button#playnum_plw').textContent);
                // let sound = await page.evaluate(() => !!Array.prototype.find.call(document.querySelectorAll('audio,video'),function(elem){return elem.duration > 0 && !elem.paused}));
                // log("check play sound "+sound);
                if (num>numnext) {
                    break;
                }
                await page.waitForTimeout(2*60*1000);
            }
            else {return;}
        } while (true);
    }
    async function waitForTime(page,element,time){
        let status = false;
        try {
            for (let i = 0; i < time; i++) {
                if (await page.$(element)) {
                    status = true;
                    break;
                }
                await page.waitForTimeout(1000);
            }
        } catch (error) {
            console.log("loi =>  "+error.stack);
        }
        return status;
    }
    async function ytb(page) {
        try{
            //https://music.youtube.com/paid_memberships
            let url = "https://raw.githubusercontent.com/yeucodonvn/codejs/master/ytbartist.json";
            await dialogdiss(page);
            for (let index = 0; index < 7; index++) {
                let listurl = JSON.parse(await getlink(url));
                let link = listurl.list[Math.floor(Math.random()*(listurl.list.length))];

                log(`play ytb => ${link}`);
                await navigatorload(page,link);
                await runjs(page);
                //await context.tracing.start({ screenshots: true, snapshots: true });
                let element =':is(.style-scope.yt-button-renderer[aria-label="Shuffle"],[aria-label="PLAY ALL"],[aria-label="PHÁT TẤT CẢ"],[aria-label="Phát ngẫu nhiên"])';
                await waitForTime(page,element,5)
                await page.tap(element);
                await waitnext(page,30),
                //await context.tracing.stop({ path: 'trace.zip' });
                await ytbtrending(page);
            }
        }
        catch(error){
            log("loi =>  "+error.stack);
        }

    }

    async function ytbtrending(page) {
        try{
            let element="";
            log('play ytb trending');
            await navigatorload(page,'https://music.youtube.com/explore');
            await runjs(page);
            await Promise.all([
                page.waitForNavigation(/*{ url: 'https://music.youtube.com/explore' }*/),
                page.tap(':is(h2[aria-label="Trending"]:has(yt-button-renderer.style-scope.ytmusic-carousel-shelf-basic-header-renderer.style-text),h2[aria-label="Thịnh hành"]:has(yt-button-renderer.style-scope.ytmusic-carousel-shelf-basic-header-renderer.style-text))'),
                element =':is(.style-scope.yt-button-renderer[aria-label="Shuffle"],[aria-label="PLAY ALL"],[aria-label="PHÁT TẤT CẢ"],[aria-label="Phát ngẫu nhiên"])',
                await waitForTime(page,element,5),
            ]);
            element =':is(.style-scope.yt-button-renderer[aria-label="Shuffle"],[aria-label="PLAY ALL"],[aria-label="PHÁT TẤT CẢ"],[aria-label="Phát ngẫu nhiên"])';
            await waitForTime(page,element,1);
            await page.tap(element);
            await waitnext(page,5)
            //await page.tap('tp-yt-paper-icon-button#play-pause-button[aria-label="Pause"]');
            await page.waitForTimeout(2*1000);
            log('end trending');
        }
        catch(error){
            log("loi trending =>  "+error.stack)}
    }
    async function checkpre(page){
        let status=0;
        try{
            let url = "https://music.youtube.com/paid_memberships";
            await navigatorload(page,url);
            await page.waitForTimeout(3000);
            if (await waitForTime(page,'yt-card-item-renderer.style-scope.yt-card-item-container-renderer',20)) {
                if (await waitForTime(page,'#error-text-renderer.style-scope.yt-card-item-error-renderer',5)) {
                    status=2;
                }else{status=1;}
            }else{status=3;}
        }catch (error) {
            log("loi =>  "+error.stack);
        }
        return status;
    }
    let B_profile=true;
    (async() => {
        try {
            pathfile ='ytbplay.js';
            //updatecode();
            checkupdate(pathfile);
            setInterval(()=>{checkupdate(pathfile)}, 6*60*60*1000);

            var arg = process.argv;
            if (typeof arg[3] !== 'undefined') {
                if(arg[3].search('--capcha')>-1){
                    typecapcha=false;
                }
                // if (arg[3].search('--headless')>-1) {
                //     b_headFull=false;
                // }
            }
            if (typeof arg[3] !== 'undefined') {
                if(arg[3].search('--profile')>-1){
                    B_profile=false;
                }
                // if (arg[3].search('--headless')>-1) {
                //     b_headFull=false;
                // }
            }
            let patchgmail='data/gmail.txt';
            if (typeof arg[2] !== 'undefined') {
                if (arg[2].search('--gmail')>-1) {
                    let gm = arg[2].replace('--gmail=','');
                    patchgmail = 'data/'+gm;
                        log(patchgmail);
                    }
                }

            const patchip='data/ip.txt';
            if (!fs.existsSync(patchip)) {
                fs.createWriteStream(patchip);
            }
            let data = fs.readFileSync(patchgmail, 'utf8');
            data=data.trim();
            if (data.length!==0) {
                let acc = data.split(/\r?\n/g);
                log(`nhap vao acc:  ${acc.length} `)
                // chinh useragnet, screen size
                let i=0;
                while(true) {
                    if (typeof acc[i] !== 'undefined') {
                        let gmail = acc[i].split('|');
                        if (B_profile) {
                            let destDir='data/'+gmail[0];
                            // const fse = require('fs-extra');
                            // if (!await fse.pathExists(destDir)) {
                            //     await fse.copy(srcDir, destDir,{ overwrite: true } )
                            //     .then(() => console.log('tao profile thanh cong!'))
                            //     .catch(err => console.error(err))
                            // }
                            if (!fs.existsSync(destDir)){
                                console.log('tao folder');
                               fs.mkdirSync(destDir);
                            }


                            const ip = fs.readFileSync(patchip, 'utf8')
                            if (ip.length>0) {
                                var sock = ip.split(/\r?\n/g);
                                var {browser,page} = await khoitao(runos,destDir,sock[Math.floor(Math.random()*(sock.length))]);
                            }else {
                                var {browser,page} = await khoitao(runos,destDir,false);
                            }
                            log(`${i} acc:  ${gmail} `)
                            //===== close blank tab
                            const pages = await browser.pages();
                            console.log("tabs "+pages.length );
                            if (pages.length > 1) {
                                console.log("close blank tab");
                                await pages[0].close();
                            }
                        }else {
                            const ip = fs.readFileSync(patchip, 'utf8')
                            if (ip.length>0) {
                                var sock = ip.split(/\r?\n/g);
                                var {browser,page} = await khoitao_lauch(runos,sock[Math.floor(Math.random()*(sock.length))]);
                            }else {
                                var {browser,page} = await khoitao_lauch(runos,destDir,false);
                                log(`${i} acc:  ${gmail} `)
                            }
                        }
                        
                        
                        //=========
                        let login = await logingmail(page, gmail);
                        if (login=='login ok' ) {
                            let check_pre = await checkpre(page);
                            switch (check_pre) {
                                case 1:
                                    await ytb(page);
                                    i++;
                                    break;
                                case 2:
                                    log("ytb het han");
                                    // remove acc[i] khoi file goc
                                    savefile('acc_het_han',acc[i])
                                    acc.splice(i,1);
                                    writefile(patchgmail,acc);
                                    break;
                                case 3:
                                    log("ytb chua reg");
                                    savefile('acc_chua_reg',acc[i])
                                    acc.splice(i,1);
                                    writefile(patchgmail,acc);
                                    break;
                                default:
                                    break;
                            }
                        }else if(login=="This browser or app may not be secure"){
                            // next;
                            i++;
                        }else{
                            savefile('acc_loi',acc[i]+' | '+login);
                            acc.splice(i,1);
                            writefile(patchgmail,acc);
                        }
                        await browser.close();
                        if (i>=acc.length) {
                            i=0;
                        }
                        if (acc.length==0) {
                            log('het gmail');
                            return;
                        }
                    }
                }
            } else {
                log('khong co gmail');
            }

            log('hoan thanh');
        } catch (error) {
            console.log("loi "+error.stack);
        }

    })();