//version 1.1 end
const {chromium,firefox, devices}  = require('playwright');
const read = require('prompt-sync')();
const fs = require('fs');
const { match } = require('assert');

    (async() => {
        try {
            setInterval(checkupdate, 6*60*60*1000);
            //updatecode();
            let patchgmail='data/gmail.txt';
            let patchip='data/ip.txt';
            if (!fs.existsSync(patchgmail)) {
                fs.createWriteStream(patchgmail);
            }
            if (!fs.existsSync(patchip)) {
                fs.createWriteStream(patchip);
            }
            const data = fs.readFileSync(patchgmail, 'utf8')
            if (data.length>0) {
                const ip = fs.readFileSync(patchip, 'utf8')
                let acc = data.split(/\r?\n/g);
                log(`nhap vao acc:  ${acc.length} `)
                //let i=0;
                // chinh useragnet, screen size
                let i=0;
                while(true) {
                    if (ip.length>0) {
                        var sock = ip.split(/\r?\n/g);
                        var {browser,page} = await khoitao('fchr',sock[i]);
                    }else {
                        var {browser,page} = await khoitao('fchr',false);
                    }
                    log(`${i} acc:  ${acc[i]} `)
                    let login = await logingmail(page, acc[i]);
                    if (login) {
                        let check_pre = await checkpre(page);
                        await page.pause();
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
                    }
                    await browser.close();
                    if (i>=acc.length) {
                        i=0;
                    }
                }
            } else {
                log('khong co gmail');
            }
        } catch (error) {
            console.log("loi "+error.stack);
        }

    })();

    async function khoitao(os,sock)
    {
        try {
            let launchoptionchrome={
            headless :false,
            chromiumSandbox:false,
            args:["--disable-gpu",
            "--disable-dev-shm-usage",
            "--disable-web-security",
            "--disable-rtc-smoothness-algorithm",
            "--disable-webrtc-encryption",
            "--disable-client-side-phishing-detection",
            "--disable-webrtc-hw-decoding",
            "--disable-webrtc-hw-encoding",
            "--disable-webrtc-multiple-routes",
            "--disable-webrtc-hw-vp8-encoding",
            "--enforce-webrtc-ip-permission-check",
            "--force-webrtc-ip-handling-policy",
            "--ignore-certificate-errors",
            "--disable-infobars",
            "--disable-popup-blocking",
            "--disable-blink-features=AutomationControlled",
            "--disable-features=site-per-process",
            "--disable-user-media-security",
            "--use-fake-ui-for-media-stream",
            "--use-fake-mjpeg-decode-accelerator",
            "--use-fake-device-for-media-stream",
            "--use-fake-device-for-media-stream",
            "--disable-setuid-sandbox",
            "--use-fake-codec-for-peer-connection",
            "--disable-features=IsolateOrigins,site-per-process",
            "--no-sandbox",
            "--reset-variation-state",
            '--disable-features=site-per-process',
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
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:83.0) Gecko/20100101 Firefox/83.0',
            hasTouch:true,
            viewport: { width: widths, height: heights },
            screen : { width: widths, height: heights },
            colorScheme: 'dark' ,
        }

        const context = await browser.newContext(browsercontextoptions);

        log('run');
        const page = await  context.newPage();
        page.setDefaultTimeout(0);
        return {browser,page};
        } catch (error) {
            log(error.stack);
        }
    }
    async function logingmail(page, acc){
        let status = false;
        try{
            let email = acc.split('|')[0];
            let pass = acc.split('|')[1];
            let emailkp = acc.split('|')[2];
            await navigatorload(page,'https://accounts.google.com/signin/v2/identifier?service=youtube', {waitUntil: 'load', timeout: 0});
            await page.tap('#identifierId');
            // await page.fill('#identifierId',email);
            log('login mail email ' +email);
            await page.keyboard.type(email,{delay: 100});
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
            await page.tap('[name="password"]');
            await page.keyboard.type(pass,{delay: 100});
            await page.keyboard.press('Enter');
            try {
                await page.waitForTimeout(4000);
                //let emailrecovery = await page.$(':is([data-challengeindex="0"],[aria-label="Confirm your recovery email"])');
                let emailrecovery = await page.evaluate(()=>(document.querySelector('[data-challengeindex="0"],[aria-label="Confirm your recovery email"]')!==null));
                if(emailrecovery) {
                //if(emailrecovery!==null) {
                    log('emailkp');
                    await page.tap(':is([data-challengeindex="0"],[aria-label="Confirm your recovery email"])');
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
                        page.waitForNavigation(/*{ url: 'https://accounts.google.com/CheckCookie?hl=en&checkedDomains=youtube&pstMsg=1&ifkv=AU9NCcwBu_sKrRQT6pxuoY7OJIKnCGsvsj9oh1ItvPVngRj98_4Wr53bAMEgAXHwt3DLxcAAnZtY&chtml=LoginDoneHtml&service=youtube&continue=https%3A%2F%2Faccounts.google.com%2FManageAccount%3Fnc%3D1&gidl=EgIIAA' }*/),
                    ]);
                }
            } catch (error) {
                //console.log('loi spinner => '+error.stack)
            }
            await navigatorload(page,'https://accounts.google.com/signin/v2/identifier?service=youtube', {waitUntil: 'load', timeout: 0});
            await page.waitForNavigation();
            await page.waitForTimeout(4000);
            /*
            * getAtribute element handel to list
             * let viewauthorlist = await page.$('.view-content');
                let authorlist = await viewauthorlist.$$eval('a[href]', nodes => nodes.map(n => n.getAttribute('href')));
             */
            let url = await page.evaluate(() => document.location.href);
            if (url.search('signin/v2')>-1) {
                log('sai tai khoan');
            }else{
                log('login ok');
                status = true;
            }
        } catch (error) {
            console.log("loi =>  "+error.stack);
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
    function download(url){
        try {
            //const https = require('https'); // or 'https' for https:// URLs
            const https = require('https')
            //const fs = require('fs');
            https.get(url, resp => resp.pipe(fs.createWriteStream('app.js')));
        } catch (error) {
            log("loi download update "+error.stack)
        }
    }
    async function checkupdate(params) {
        try {
            log("check update");
            url='https://raw.githubusercontent.com/yeucodonvn/codejs/master/app.js';
            var re =  new RegExp(/(?<=version)\?([0-9]*[.]*[0-9])\+(.*?)(?<=end)/g);;
            //check update
            let versionhost="";
            await getlink(url).then(
                result => {
                    let contenthost = result;
                    var re =  new RegExp(/version ([+-]?(?=\.\d|\d)(?:\d+)?(?:\.?\d*))(?:[eE]([+-]?\d+))? end/g);
                    versionhost = contenthost.match(re)[0].replace("version ","").replace(" end","");
                    log(versionhost);
                    if (versionhost!="") {
                        let contentlocal = fs.readFileSync('app.js', 'utf8')
                        let versionlocal = contentlocal.match(re)[0].replace("version ","").replace(" end","");
                        log(versionlocal);
                        if (versionhost>versionlocal) {
                            //download de file
                            download(url);
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
    function getlink(params) {
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
        // xu ly dialog, dat truoc khi dialog hien
        // dung nhieu lan
        try {
            await page.on('dialog', async (dialog) => {
                log(dialog.message());
                await dialog.accept();
            })
            // dung 1 lan, can chinh xac khi xuat
            // page.once('dialog', async function(dialog) {
            //     await dialog.accept();
            // });
        // await page.evaluate(() => {
        //         confirm('are you sure');
        //     });
        } catch (error) {
            log('error dialog ');
        }
    }
    // log dung stdout phai co .end() neu k se bi full
    // function log(arguments) {
    //     try {
    //         let path = 'data/log.txt';
    //     if (!fs.existsSync(path)) {
    //         fs.appendFile(path,"log!", function (err) {
    //             if (err) throw err;
    //           });
    //     }

    //     var util = require('util');
    //     var logFile = fs.createWriteStream(path, { flags: 'a' });
    //     // Or 'w' to truncate the file every time the process starts.
    //     var logStdout = process.stdout;

    //     console.log = function () {
    //     logFile.write(util.format.apply(null, arguments) + '\r\n');
    //     logStdout.write(util.format.apply(null, arguments) + '\r\n');
    //     }
    //     console.error = console.log;
    //     console.log(arguments);
    //     } catch (error) {
    //         log(error.stack);
    //     }
    // }
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
    async function navigatorload(page,urllink) {
        do {
            try {
                await page.goto(urllink);
                return
            } catch (error) {
                log("loi load link => "+urllink);
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
                    console.log("create btn");
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
                    }, 30*1000);
                }

                function checkspinloader(){
                    setInterval(function(){
                        let autdioo = !!Array.prototype.find.call(document.querySelectorAll('audio,video'),function(elem){return elem.duration > 0 && !elem.paused});
                        let spinloader = document.querySelector('.play-pause-button-spinner.style-scope.ytmusic-player-bar');
                        let gethidden=spinloader.getAttribute("aria-hidden");
                        if(!gethidden || autdioo==false){
                            document.querySelector('[aria-label="Next song"],.next-button.style-scope.ytmusic-player-bar').click();
                            console.log("check spin loader");
                            //intcheck++;
                        }
                        //if(intcheck>30)(location.reload(true));
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
                run();
                console.log("run script");
            });
        } catch (error) {
            log("loi run js => "+ error.stack);
        }
    }
    async function waitnext(page,numnext){
        await runjs(page);
        await page.waitForTimeout(2000);
        do {
            let num = await page.evaluate(() => document.querySelector('button#playnum_plw').textContent);
            //console.log(`test receive num = ${num}`);
            if (num>numnext) {
                break;
            }
            await page.waitForTimeout(2*60*1000);
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
            let listurl = JSON.parse(await getlink(url));
            dialogdiss(page);
            for (let index = 0; index < 10; index++) {
                let link = listurl.list[Math.floor(Math.random()*(listurl.list.length))];

                log(`play ytb => ${link}`);
                await navigatorload(page,link);
                // if (page.waitForSelector('[aria-label="Shuffle"]')==null) {
                //     continue;
                // }
                await page.tap(':is(.style-scope.yt-button-renderer[aria-label="Shuffle"],[aria-label="PLAY ALL"],[aria-label="PHÁT TẤT CẢ"],[aria-label="Phát ngẫu nhiên"])');
                await waitnext(page,30)
                await ytbtrending(page);
            }
        }
        catch(error){
            log("loi =>  "+error.stack)}
    }
    
    async function ytbtrending(page) {
        try{
            log('play ytb trending');
            await navigatorload(page,'https://music.youtube.com/explore');

            // Click text=Explore
            // await Promise.all([
            //     page.waitForNavigation(/*{ url: 'https://music.youtube.com/explore' }*/),
            //     page.tap('text=Explore')
            // ]);
            await Promise.all([
                page.waitForNavigation(/*{ url: 'https://music.youtube.com/explore' }*/),
                page.tap(':is(h2[aria-label="Trending"]:has(yt-button-renderer.style-scope.ytmusic-carousel-shelf-basic-header-renderer.style-text),h2[aria-label="Thịnh hành"]:has(yt-button-renderer.style-scope.ytmusic-carousel-shelf-basic-header-renderer.style-text))'),
            ]);

            await page.waitForTimeout(2*1000);
            await page.tap(':is(.style-scope.yt-button-renderer[aria-label="Shuffle"],[aria-label="PLAY ALL"],[aria-label="PHÁT TẤT CẢ"],[aria-label="Phát ngẫu nhiên"])');
            await waitnext(page,5)
            //await page.tap('tp-yt-paper-icon-button#play-pause-button[aria-label="Pause"]');
            await page.waitForTimeout(2*1000);
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