//version 1.0 end
const {chromium,firefox, devices}  = require('playwright');
const read = require('prompt-sync')();
const fs = require('fs');
const { match } = require('assert');

let acc = new Array();
(async() => {
    try {
        var arg = process.argv;
        let nuoimail=true;
        if (arg[2].search('--pass')>-1){ 
            log('chi change pass');
             nuoimail =false;}
        let notpass= false;
        if (arg[2].search('--notpass')>-1){ 
            log('khong change pass');
            notpass=true;
           }
        const patchgmail='data/gmail.txt';
        if (!fs.existsSync(patchgmail)) {
            fs.createWriteStream(patchgmail);
            log(`tao file gmail.txt `)
        }else{
            pathfile ='change_gmail.js';
            checkupdate(pathfile);
            let data = fs.readFileSync(patchgmail, 'utf8');
            data=data.trim();
            if (data.length!==0) {
                acc = data.split(/\r?\n/g);
                log(`nhap vao acc:  ${acc.length} `)
                //let i=0;
                // chinh useragnet, screen size
                for (let i = 0; i < acc.length; i) {
                    var {browser,page} = await khoitao('fchr',false);
                    log(`${i} acc:  ${acc[i]} `);
                    let gmail = acc[i].split('|');

                    let login = await logingmail(page, gmail);
                    if (login=='login ok') {
                        if (nuoimail) {
                            let B_guimail = await guimail(page);
                            let B_imap = await ON_IMAP(page);
                            let B_scapp = await ON_secureapps(page);
                            //let B_subnew = await subnews(page);
                        }
                        if (!notpass) {
                            var [B_changepass,acc_newpass] = await change_mk(page,gmail);
                            if(B_changepass){
                                gmail=acc_newpass;
                                savefile('gmail_da_change',`${acc_newpass[0]}|${acc_newpass[1]}${acc_newpass[2]}`+' | change pass ok');
                                acc.splice(i,1);
                                writefile(patchgmail,acc);
                            };
                        }
                        //let {B_mailkp,acc_newmailkp} = await changemailkp(page,acc[i]);
                        //  if(B_mailkp){gmail=acc_newmailkp;};
                    }else{
                        savefile('gmail_loi',acc[i]+' | '+login);
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
        }
        
        log('hoan thanh');
    } catch (error) {
        console.log("loi "+error.stack);
    }

})();
async function loadsock()
{

}
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
            //"--app=https://music.youtube.com",
            ],

            ignoreDefaultArgs: [ "--enable-automation"],
            ignoreDefaultArgs: ['--disable-component-extensions-with-background-pages'],

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
    let i = 0 ;
    do {
        try {
            await Promise.all([
                page.goto(urllink),
                page.waitForNavigation(),
            ]);
            return
        } catch (error) {
            log("loi load link => "+urllink);
            i++;
            if (i >=10) break;
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
        log("loi waitForTime =>  "+error.stack);
    }
    return status;
}
async function typeinput(page,element,text){
    try {
        await page.tap(element);
        await page.keyboard.type(text,{delay: 100});
    } catch (error) {
        console.log("loi =>  "+error.stack);
    }
}
async function tapbutton(page,element){
    try {
        if (await waitForTime(page,element,5)){
            await page.tap(element);
        }
    } catch (error) {
        log("loi =>  "+error.stack);
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
        log('login mail email ' +email);
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
            //document.querySelectorAll('[data-accountrecovery="false"]')[1].textContent;
            // check ('[data-accountrecovery="false"]') if (element.count > 2) { index = element.count-1}
            // let veroption = await page.$$('[data-accountrecovery="false"]');
            // if (veroption.length>1) {
                
            // }
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
            status = 'login ok';
        }
    } catch (error) {
        log("loi =>  "+error.stack);
    }
    return status;
}

async function STMPmailkp(acc) {
    let status = false;
    try {
    } catch (error) {
        
    }
    return status;
}

async function changemailkp(page,acc) {
    let link = 'https://myaccount.google.com/recovery/email';
    let status = false;
    try {
        await navigatorload(page,link);
    } catch (error) {
        log('loi spinner => '+error.stack)
    }
    return status;
}
async function getrandommail() {
    return acc[Math.floor(Math.random() * acc.length)].split('|')[0];
}
async function guimail(page) {
    let link = 'http://mail.google.com/mail/h/';
    let linksendmail ="https://mail.google.com/mail/u/0/h/81fsxgo0m5la/?&cs=b&pv=tl&v=b";
    let status = false;
    try {
        //await navigatorload(page,link);
        await navigatorload(page,linksendmail);
        let to=await getrandommail(),subject="let anba",body="please let me know what aboutn fill your site";
        if (await waitForTime(page,'[type="submit"][value="I\'d like to use HTML Gmail"]',5)) {
            await tapbutton(page,'[type="submit"][value="I\'d like to use HTML Gmail"]');
        }
        await tapbutton(page,'textarea[name="to"]');
        await typeinput(page,'textarea[name="to"]',to)
        await tapbutton(page,'input[name="subject"]');
        await typeinput(page,'input[name="subject"]',subject)
        await tapbutton(page,'textarea[name="body"]');
        await typeinput(page,'textarea[name="body"]',body)
        await tapbutton(page,'input[value="Send"]');
        status = true;
    } catch (error) {
        log('loi spinner => '+error.stack)
    }
    return status;
}

async function ON_IMAP(page) {
    // https://mail.google.com/mail/u/0/h/esqtsrzq9zd7/?v=prfap IMAP
    let link = 'https://mail.google.com/mail/u/0/h/esqtsrzq9zd7/?v=prfap';
    let status = false;
    try {
        await navigatorload(page,link);
        if (await waitForTime(page,'[type="submit"][value="I\'d like to use HTML Gmail"]',5)) {
            await tapbutton(page,'[type="submit"][value="I\'d like to use HTML Gmail"]');
        }
        await tapbutton(page,'text=Enable IMAP');
        await tapbutton(page,'input[value="Save Changes"]');
        status = true;
        log('IMAP ON')
    } catch (error) {
        log('loi spinner => '+error.stack)
    }
    return status;
}

async function subnews(page) {
    // site bao, site tin tuc
    let status = false;
    try {
        await navigatorload(page,link);
    } catch (error) {
        
    }
    return status;
}

async function outthietbi(page) {
    let link = 'https://myaccount.google.com/device-activity?gar=1';
    let status = false;
    try {
        await navigatorload(page,link);

        let listdevices = await page.$$('div.F4S0Db[role="listitem"]');
        for (let i = 0; i < listdevices.length; i++)
        {
            let element = listdevices[i];
            await element.tap('div[role="button"][aria-label="More info"]')
            let menu = await page.$('[class="JPdR6b rVZeG qjTEB"][role="menu"]');
            let phonefind = await menu.$('[aria-label="Find phone"]');
            if (phonefind){
                await menu.tap('[aria-label="Sign out this device"]');
                await page.tap('[jsname="V67aGc"](text=Sign out)');
                return status = true;
            }
            // let phone = await page.evaluate(async()=>{
            //     return await new Promise(resolve => {
            //         let menu = document.querySelector('[class="JPdR6b rVZeG qjTEB"][role="menu"]');
            //          if(menu.querySelector('[aria-label="Find phone"]')!==null)
            //          {menu.querySelector('[aria-label="Sign out this device"]').click();
            //         return resolve(true);
            //         }
            //     })
            // });
            
        };
    } catch (error) {
        
    }
    return status;
}

async function ON_secureapps(page) {
    let link = 'https://myaccount.google.com/lesssecureapps';
    let status = false;
    try {
        await navigatorload(page,link);
        await page.waitForTimeout(2000);
        await tapbutton(page,'text=Allow less secure apps: OFF');
        log('Allow less secure apps: ON')
        status = true;
    } catch (error) {
        log('loi ON_secureapps => '+error.stack)
    }
    return status;
}
function gennewpass(passlength) {
    let arrchar = 'QWERTYUIOASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm';
    let arrnumber = '0123456789';
    let kytudacbiet = '!@#$%^&*';
    let pass ='';
    for (let i = 0; i < passlength; i++) {
        if (i>4) {
            switch (Math.floor(Math.random() * 3)) {
                case 1:
                    pass += arrnumber.charAt(Math.floor(Math.random() * arrnumber.length));
                    break;
                case 2:
                    pass += kytudacbiet.charAt(Math.floor(Math.random() * kytudacbiet.length));
                    break;
                default:
                    pass += arrchar.charAt(Math.floor(Math.random() * arrchar.length));
                    break;
            }
        }else {
            pass += arrchar.charAt(Math.floor(Math.random() * arrchar.length));
        }
    }
    return pass;
}
async function change_mk(page,gmail) {
    let status = false;
    let link = 'https://myaccount.google.com/signinoptions/password';
    try {
        let pass = gmail[1];
        await navigatorload(page,link);
        // nhap pass
        await waitForTime(page,'[name="password"]',10)
        await tapbutton(page,'[name="password"]');
        await page.keyboard.type(pass,{delay: 100});
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2000);
        //await page.waitForNavigation();
        //new password
        let newpassword =await gennewpass(Math.floor(Math.random()*(15-8) + 8));
        await waitForTime(page,'[name="confirmation_password"]',10)
        await tapbutton(page,'[name="password"]');
        await page.keyboard.type(newpassword,{delay: 100});
        //await page.keyboard.press('Enter');
        await tapbutton(page,'[name="confirmation_password"]');
        log(`acc ${gmail[0]} pass new ${newpassword}`);
        await page.keyboard.type(newpassword,{delay: 100});
        //await page.keyboard.press('Enter');
        await Promise.all([
            tapbutton(page,'[type="submit"]'),
            page.waitForNavigation(),
        ]);
        await page.waitForTimeout(4000);
        if(await waitForTime(page,'text=Password changed successfully',10))
        {
            gmail[1]=newpassword;
            status=true;
            log(`change pass thanh cong gmail ${gmail}`);
        }
        return [status,gmail];
    } catch (error) {
        log('loi change mk => '+error.stack)
    }
}