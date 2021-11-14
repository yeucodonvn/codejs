//version 2.5 end
const {chromium,firefox, devices}  = require('playwright');
const read = require('prompt-sync')();
const fs = require('fs');
const { match } = require('assert');

let typecapcha=false;
let b_headFull = true;
let isStop=false;
let runos ="chrome"; // chrome , ff
(async() => {
        try {
            pathfile ='ytbplay.js';
            //updatecode();
            checkupdate(pathfile);
            setInterval(()=>{checkupdate(pathfile)}, 6*60*60*1000);

            var arg = process.argv;
            if (typeof arg[3] !== 'undefined') {
                if(arg[3].search('capcha')>-1){
                    typecapcha=true;
                }
                if (arg[3].search('--headless')>-1) {
                    b_headFull=false;
                }
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
                    if (typeof acc[i] == 'undefined') {
                        log('het gmail');
                        return;
                    }
                    let gmail = acc[i].split('|');
                    const ip = fs.readFileSync(patchip, 'utf8')
                    if (ip.length>0) {
                        var sock = ip.split(/\r?\n/g);
                        log(sock);
                        var {browser,context,page} = await khoitao(runos,sock[Math.floor(Math.random()*(sock.length))]);
                    }else {
                        var {browser,context,page} = await khoitao(runos,false);
                    }
                    log(`${i} acc:  ${gmail} `)
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
                    }else{
                        savefile('acc_loi',acc[i]+' | '+login);
                        acc.splice(i,1);
                        writefile(patchgmail,acc);
                    }
                    await browser.close();
                    if (i>=acc.length) {
                        i=0;
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

    let UA =[
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:86.0) Gecko/20100101 Firefox/86.0',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:83.0) Gecko/20100101 Firefox/83.0',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 11.0; rv:83.0) Gecko/20100101 Firefox/83.0',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:83.0) Gecko/20100101 Firefox/83.0',
        'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:83.0) Gecko/20100101 Firefox/83.0',
        'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:83.0) Gecko/20100101 Firefox/83.0',
        'Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:83.0) Gecko/20100101 Firefox/83.0',
        'Mozilla/5.0 (Windows NT 10.0; rv:83.0) Gecko/20100101 Firefox/83.0',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:84.0) Gecko/20100101 Firefox/84.0',
        'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:84.0) Gecko/20100101 Firefox/84.0',
        'Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:84.0) Gecko/20100101 Firefox/84.0',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:84.0) Gecko/20100101 Firefox/84.0',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
        'Mozilla/5.0 (Windows NT 10.0; rv:84.0) Gecko/20100101 Firefox/84.0',
        'Mozilla/5.0 (Windows NT 6.2; Win64; x64; rv:84.0) Gecko/20100101 Firefox/84.0',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 11.1; rv:84.0) Gecko/20100101 Firefox/84.0',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:85.0) Gecko/20100101 Firefox/85.0',
        'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:85.0) Gecko/20100101 Firefox/85.0',
        'Mozilla/5.0 (Windows NT 6.1; rv:85.0) Gecko/20100101 Firefox/85.0',
        'Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:85.0) Gecko/20100101 Firefox/85.0',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:86.0) Gecko/20100101 Firefox/86.0',
        'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:86.0) Gecko/20100101 Firefox/86.0',
        'Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:86.0) Gecko/20100101 Firefox/86.0',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:86.0) Gecko/20100101 Firefox/86.0',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:86.0) Gecko/20100101 Firefox/86.0',
        'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:86.0) Gecko/20100101 Firefox/86.0',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:82.0) Gecko/20100101 Firefox/82.0',
        'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:82.0) Gecko/20100101 Firefox/82.0',
        'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:82.0) Gecko/20100101 Firefox/82.0',
        'Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:82.0) Gecko/20100101 Firefox/82.0',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:82.0) Gecko/20100101 Firefox/82.0',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:82.0) Gecko/20100101 Firefox/82.0',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:81.0) Gecko/20100101 Firefox/81.0',
        'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:81.0) Gecko/20100101 Firefox/81.0',
        'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:81.0) Gecko/20100101 Firefox/81.0',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:81.0) Gecko/20100101 Firefox/81.0',
        'Mozilla/5.0 (Windows NT 10.0; rv:81.0) Gecko/20100101 Firefox/81.0',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:81.0) Gecko/20100101 Firefox/81.0',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:80.0) Gecko/20100101 Firefox/80.0',
        'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:80.0) Gecko/20100101 Firefox/80.0',
        'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:80.0) Gecko/20100101 Firefox/80.0',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:80.0) Gecko/20100101 Firefox/80.0',
    ]
    async function khoitao(browsertype,sock)
    {
        try {
            let launchoptionchrome={
                //headless :false,
                
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
                ignoreDefaultArgs: [ "--enable-automation"],//--no-audio ? --mute-audio
                ignoreDefaultArgs: ['--disable-component-extensions-with-background-pages'],

            }
            launchoptionchrome.tracesDir='';
        let launchoptionfirefox={
           
        }
        if (b_headFull) {
            launchoptionfirefox.headless =false;
            launchoptionchrome.headless =false;
        }

        if (sock!==false) {
            launchoptionchrome.proxy=  { server:sock.split(':')[0]+':'+sock.split(':')[1],
                            username:sock.split(':')[2],
                            password:sock.split(':')[3]
                        }
            launchoptionfirefox.proxy=  { server:sock.split(':')[0]+':'+sock.split(':')[1],
                        username:sock.split(':')[2],
                        password:sock.split(':')[3]
                    }
        }

        let chromiumpatch='chrome-win/chrome.exe';
        if (fs.existsSync(chromiumpatch)) {
            launchoptionchrome.executablePath=chromiumpatch;
        }

        let browser=null;
        if (browsertype=='ff') {
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
        };
        
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
        let status = "";
        try{
            let email = acc[0];
            let pass = acc[1];
            let emailkp = acc[2];
            await navigatorload(page,'https://accounts.google.com/signin/v2/identifier?service=youtube', {waitUntil: 'load', timeout: 0});
            await page.tap('#identifierId');
            // await page.fill('#identifierId',email);
            log('login mail ' +email);
            await page.keyboard.type(email,{delay: 100});
            page.keyboard.press('Enter');
            await page.waitForTimeout(2000);
            try {
                //if (await page.$('#captchaAudio[src]')!==null) {
                let capcha = await page.$('#captchaAudio[src]');
                if(capcha!==null) {
                    log('dinh capcha');
                    if (typecapcha) {
                        read('hay giai capcha => ');
                        await page.waitForLoadState('networkidle');
                    }else {
                        return status="doi capcha";
                    }
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
        } catch (error) {
            log("loi =>  "+error.stack);
        }
        return status;
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

    function log(mess) {
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
                    page.goto(urllink),
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
                let sound = await page.evaluate(() => !!Array.prototype.find.call(document.querySelectorAll('audio,video'),function(elem){return elem.duration > 0 && !elem.paused}));
                log("check play sound "+sound);
                //console.log(`test receive num = ${num}`);
                if (num>numnext) {
                    break;
                }
                await page.waitForTimeout(60*1000);
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
            for (let index = 0; index < 10; index++) {
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
            process.exit();
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
            await waitForTime(page,element,5);
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

            if (await waitForTime(page,'yt-card-item-renderer.style-scope.yt-card-item-container-renderer',10)) {
                if (await waitForTime(page,'#error-text-renderer.style-scope.yt-card-item-error-renderer',5)) {
                    status=2;
                }else{status=1;}
            }else{status=3;}
        }catch (error) {
            log("loi =>  "+error.stack);
        }
        return status;
    }