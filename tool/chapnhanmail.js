//version 1.7 end
const {chromium,firefox, devices}  = require('playwright');
const read = require('prompt-sync')();
const fs = require('fs');
const { match } = require('assert');

let acc = new Array();
(async() => {
    try {
        let patchgmail='data/gmailmoi.txt';
        
        if (!fs.existsSync(patchgmail)) {
            fs.createWriteStream(patchgmail);
            log(`tao file gmailmoi.txt `)
        }else{
            checkupdate('chapnhanmail.js');
            let listgmail = fs.readFileSync(patchgmail, 'utf8')
            listgmail=listgmail.trim();
            if (listgmail.length>0) {
                acc = listgmail.split(/\r?\n/g);
    
                log(`nhap vao acc:  ${acc.length} `)
                //let i=0;
                // chinh useragnet, screen size
                //let i=0;
                for (let i = 0; i < acc.length; i) {
                    var {browser,context,page} = await khoitao('fchr',false);
                    log(`${i} acc:  ${acc[i]} `)
                    let accmail = await logingmail(page, acc[i]);
                    if (accmail!=="") {
                        let cc = await chapnhan(context,page);
                        if (cc!=="") {
                            savefile('chapnhanok',acc[i])
                            acc.splice(i,1);
                            writefile(patchgmail,acc);
                        }else{
                            savefile('chapnhanloi',acc[i])
                            acc.splice(i,1);
                            writefile(patchgmail,acc);
                        }
                    }else{
                        savefile("saipass",accmail);
                    }
                    await browser.close();
                }
            } else {
                log('khong co gmail');
            }
            log('hoan thanh');
        }

    } catch (error) {
        console.log("loi "+error.stack);
    }

})();
function log(mess) {
    try {
        let path = 'data/log.txt';
        if (!fs.existsSync(path)) {
            fs.appendFile(path,"log!", function (err) {
                if (err) throw err;
            });
        }

        fs.appendFile(path,mess + '\r\n',function (err) {
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
        //console.log(mess);
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
        //console.log(mess);
    } catch (error) {
        console.log(error.stack);
    }
}
async function khoitao(os,sock)
{
    try {
        let launchoptionchrome={
        headless :false,
        chromiumSandbox:false,
        args:['--disable-gpu',
            '--disable-dev-shm-usage',
            '--disable-web-security',
            '--disable-rtc-smoothness-algorithm',
            '--disable-webrtc-encryption',
            '--disable-client-side-phishing-detection',
            '--disable-webrtc-hw-decoding',
            '--disable-webrtc-hw-encoding',
            '--disable-webrtc-multiple-routes',
            '--disable-webrtc-hw-vp8-encoding',
            '--enforce-webrtc-ip-permission-check',
            '--force-webrtc-ip-handling-policy',
            '--ignore-certificate-errors',
            '--disable-infobars',
            '--disable-popup-blocking',
            '--disable-blink-features=AutomationControlled',
            '--disable-features=site-per-process',
            '--disable-user-media-security',
            '--use-fake-ui-for-media-stream',
            '--use-fake-mjpeg-decode-accelerator',
            '--use-fake-device-for-media-stream',
            '--disable-setuid-sandbox',
            '--use-fake-codec-for-peer-connection',
            '--disable-features=IsolateOrigins,site-per-process',
            '--no-sandbox',
            '--reset-variation-state',
            '--disable-features=UserAgentClientHint',
            '--force-device-scale-factor=1',
            '--disable-accelerated-2d-canvas',
            '--lang=en-EN',
            '--allow-insecure-localhost',
            '--disable-remote-fonts',
            '--no-first-run',
            '--disable-default-apps',
            '--no-default-browser-check',
            '--prerender-from-omnibox=disabled',
            '--silent-debugger-extension-api',
            '--allow-running-insecure-content',
            '--disable-strict-mixed-content-checking',
            '--allow-file-access-from-files',
            //"--app=https://music.youtube.com",
            ],

        ignoreDefaultArgs: [ "--enable-automation"],

    }
    if (sock!==false) {
        launchoptionchrome.proxy=  { server:sock.split(':')[0]+':'+sock.split(':')[1],
                        username:sock.split(':')[2],
                        password:sock.split(':')[3]
                    }
    }
    let launchoptionfirefox={
        headless :false,

    }
    let chromiumpatch='chrome-win/chrome.exe';
        if (fs.existsSync(chromiumpatch)) {
            launchoptionchrome.executablePath=chromiumpatch;
        }
    let browser=null;
    if (os=='ff') {
         browser = await firefox.launch(launchoptionfirefox);
    } else {
         browser = await chromium.launch(launchoptionchrome);
    }
    //const emu = devices["Desktop Firefox"];
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
    }
    let UA =[
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:86.0) Gecko/20100101 Firefox/86.0',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:83.0) Gecko/20100101 Firefox/83.0',
    ]
    browsercontextoptions.userAgent=UA[Math.floor(Math.random()*UA.length)]
    const context = await browser.newContext(browsercontextoptions);

    log('run');
    const page = await  context.newPage();
    page.setDefaultTimeout(0);
    return {browser,context,page};
    } catch (error) {
        log(error.stack);
    }
}

async function logingmail(page, acc){
    let status ="";
    try{
        let email = acc.split('|')[0];
        let pass = acc.split('|')[1];
        let emailkp = acc.split('|')[2];
        await navigatorload(page,'https://accounts.google.com/signin/v2/identifier?service=youtube', {waitUntil: 'load', timeout: 0});
        log('login mail email ' +email);
        await typeinput(page,'#identifierId',email)
        page.keyboard.press('Enter');
        await page.waitForTimeout(2000);
        try {
            //if (await page.$('#captchaAudio[src]')!==null) {
            let capcha = await page.$('#captchaAudio[src]');
            if(capcha!==null) {
                log('dinh capcha');
                read('hay giai capcha => ');
                await page.waitForLoadState('networkidle');
            }
        } catch (error) {
            log('loi capcha => '+error.stack);
        }
        await typeinput(page,'[name="password"]',pass)
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
                await page.keyboard.press('Enter')
                await page.waitForNavigation();
            }
        } catch (error) {
            //console.log('loi email kp => '+error.stack);
        }
        try {
            // Click button:has-text("Next")
            let url = await page.evaluate(() => document.location.href);
            if (url.search('accounts.google.com/CheckCookie')>-1) {
                await Promise.all([
                    page.waitForNavigation(),
                ]);
            }
        } catch (error) {
            //console.log('loi spinner => '+error.stack)
        }
        await navigatorload(page,'https://mail.google.com/mail/u/0/h/esqtsrzq9zd7/?v=prfap');
        await page.waitForTimeout(4000);
        let url = await page.evaluate(() => document.location.href);
        if (url.search('signin/v2')>-1) {
            log('sai tai khoan');
        }else{
            log('login ok');
            status=acc;
        }
    } catch (error) {
        console.log("loi =>  "+error.stack);
    }
    return status;
}

function download(url,file){
    try {
        //const https = require('https'); // or 'https' for https:// URLs
        const https = require('https')
        //const fs = require('fs');
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
                console.log(file);
                console.log(url);
                let contenthost = result;
                var re =  new RegExp(/version ([+-]?(?=\.\d|\d)(?:\d+)?(?:\.?\d*))(?:[eE]([+-]?\d+))? end/g);
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
            const http      = require('http'),
                  https     = require('https');
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
async function navigatorload(page,urllink) {
    let i = 0 ;
    do {
        try {
            await Promise.all([
                page.waitForNavigation(),
                page.goto(urllink),
            ]);
            return
        } catch (error) {
            log("loi load link => "+urllink);
            i++;
            await page.waitForTimeout(3000);
            if (i >=10) return;
        }
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
// gg HTML basic    http://mail.google.com/mail/h/
async function typeinput(page,element,text){
    try {
        await page.tap(element);
        await page.keyboard.type(text,{delay: 100});
    } catch (error) {
        console.log("loi =>  "+error.stack);
    }
}
async function tapbutton(page,element,bol){
    try {
        if (await waitForTime(page,element,5)){
            await page.tap(element);
        }
    } catch (error) {
        log("loi =>  "+error.stack);
    }
}
async function chapnhan(context,page) {
    let status = "";
    log("chap nhan mail moi");
    try {
        await navigatorload(page,"http://mail.google.com/mail/h/");
        await page.waitForTimeout(4000);
        await tapbutton(page,'[type="submit"][value="I\'d like to use HTML Gmail"]');
        if (await waitForTime(page,':is(span:has-text("Google family group"):has-text("invited"),span:has-text(" Premium family membership"):has-text("invited"))',5)) {
            await tapbutton(page,':is(span:has-text("Google family group"):has-text("invited"),span:has-text(" Premium family membership"):has-text("invited"))');
            //await tapbutton(page,'a[href *= "families.google.com/join/promo"]');
            //next tab
            const [page1] = await Promise.all([
                context.waitForEvent('page'),
                tapbutton(page,'a[href *= "families.google.com/join/promo"]')
            ])

            await page1.waitForLoadState();
            if (await waitForTime(page1,'div[role="button"]:has-text("Get Started")',5)) {
                if (await waitForTime(page1,'text=YouTube Premium for your family',5)) {
                    await Promise.all([
                        page1.waitForNavigation(),
                        page1.tap('div[role="button"]:has-text("Get Started")'),
                    ]);
                    await page.waitForTimeout(4000);
                    await Promise.all([
                        page1.waitForNavigation(),
                        page1.tap('div[role="button"]:has-text("Join Family")'),
                    ]);
                } else {
                    await Promise.all([
                        page1.waitForNavigation(),
                        page1.tap('div[role="button"]:has-text("Get Started")'),
                    ]);
                    //await page1.tap('div[role="button"]:has-text("Get Started")');
                    await page1.waitForTimeout(4000);
                    //await waitForTime(page1,'div[role="button"]:has-text("Get Started")',5);
                    await Promise.all([
                        page1.waitForNavigation(),
                        page1.tap('div[role="button"]:has-text("Join Family")'),
                    ]);
                    //await page1.tap('div[role="button"]:has-text("Join Family")');
                }
                await page1.waitForTimeout(2000);
                status = await checkpre(page1);
            }else if (await waitForTime(page1,'div:has-text("Already in a family")',5)){
                log("email da chap nhan link moi");
                status = "ok";
            }else {log("email loi link moi");}
        }else{ log("khong tim thay mail moi")}

    } catch (error) {
        log('loi ytb => ' + error.stack);
    }
    return status;
}

async function checkpre(page){
    let status="";
    try{
        await navigatorload(page,"https://music.youtube.com/paid_memberships");

        if (await waitForTime(page,'yt-card-item-renderer.style-scope.yt-card-item-container-renderer',10)) {
                log("chap nhan thanh cong");
                status = "ok";
        }else{log("chap nhan k thanh cong");}
    }catch (error) {
        log("loi =>  "+error.stack);
    }
    return status;
}