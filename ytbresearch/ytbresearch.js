const API_KEY = 'AIzaSyAmjxvAnND8hvlJSj5jQZ3acSFzVkzTWb4';//'AIzaSyBw06lFRMrP5b7nGekTlBNA-YDCHAgDTSQ';

const Listurl = [];
const listoutput = [];
let time = 'd|7';
let viewpoint = 200000;
let subpoint = 'l|1000'
let cphpoint = 100;
// https://www.magetop.com/blog/cach-lay-api-key-youtube/
// ytb API key

async function videoinfo(videoid) {
  try {

    let response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoid}&key=${API_KEY}`
    );
    const responseText = await response.text();
    const res = JSON.parse(responseText)
    let viewCount = parseInt(res.items[0].statistics.viewCount);
    let likeCount = parseInt(res.items[0].statistics.likeCount);
    let published = res.items[0].snippet.publishedAt;
    let channelId = res.items[0].snippet.channelId
    return { viewCount, likeCount, published, channelId };
  } catch (error) {
    console.log('Error videoinfo :', error.stack || error.meessage || error);
    return null;
  }
}

async function getChannelSubscriberCount(channelId) {
  try {

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${API_KEY}`
    );
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      return data.items[0].statistics.subscriberCount;
    } else {
      return null;
    }
  } catch (error) {
    console.log('Error getChannelSubscriberCount :', error.stack || error.meessage || error);
    return null;
  }
};

const infovideo = async (element) => {
  try {
    let videoid = element.querySelector(eleconfig.videoid)?.href?.split('v=')[1]?.split('&')[0] ?? eleconfig.videoid;
    if (Listurl.includes(videoid)) return;
    Listurl.push(videoid);
    let { viewCount, likeCount, published, channelId } = await videoinfo(videoid);
    let channelsub = parseInt(await getChannelSubscriberCount(channelId));
    let publishedDate = new Date(published);
    let uploadDate = publishedDate.getDate() + "/" + (publishedDate.getMonth() + 1) + "/" + publishedDate.getFullYear();
    let hoursSincePublished = getHoursSincePublished(published);
    let cph = parseInt(viewCount / hoursSincePublished);
    let metadataline = element.querySelector(eleconfig.metadataline) ?? eleconfig.metadataline;
    let view = metadataline.querySelectorAll(eleconfig.view) ?? eleconfig.view;
    view[0].textContent = viewCount.toLocaleString();
    view[1].textContent = uploadDate + ` Sub: ${channelsub.toLocaleString()}`;
    let videoTitle = element.querySelector(eleconfig.videoTitle) ?? eleconfig.videoTitle;

    videoTitle.textContent += `view ${viewCount.toLocaleString()} | like ${likeCount.toLocaleString()} | upload ${uploadDate} | CPH: ${cph.toLocaleString()} | Sub: ${channelsub.toLocaleString()}`;
    videoTitle.setAttribute('aria-label', videoTitle.textContent);
    videoTitle.setAttribute('title', videoTitle.textContent);
    if (settime(time, publishedDate) && viewCount > viewpoint && cph > cphpoint && setdub(subpoint, channelsub)) {
      videoTitle.style.color = '#1DAB6F'; // Thay #ff0000 bằng mã màu của bạn
      listoutput.push(`https://www.youtube.com/watch?v=${videoid} ${viewCount.toLocaleString()} like ${likeCount.toLocaleString()}  upload ${uploadDate}  CPH: ${cph.toLocaleString()}  ${channelId}  Sub: ${channelsub.toLocaleString()}`);
    }
  } catch (error) {
    console.log('Error:', error.stack || error.meessage || error);

  }

}
function getHoursSincePublished(publishedDate) {
  let now = new Date();
  let published = new Date(publishedDate);
  let differenceInMilliseconds = now - published;
  let differenceInHours = differenceInMilliseconds / 1000 / 60 / 60;
  return differenceInHours;
}

function setdub(subpoint, channelsub) {
  let query = subpoint.split('|')[0];
  switch (query) {
    case 'l':
      return channelsub >= parseInt(subpoint.split('|')[1]);
    case 'n':
      return channelsub <= parseInt(subpoint.split('|')[1]);
    default:
      break;
  }
  return false;
}
function settime(time, publishedDate) {
  let currentDate = new Date();
  let query = time.split('|')[0];
  let timepoint = new Date();

  switch (query) {
    case 'd':
      timepoint.setDate(currentDate.getDay() - parseInt(time.split('|')[1]));
      return publishedDate >= timepoint
    case 'm':
      timepoint.setMonth(currentDate.getMonth() - parseInt(time.split('|')[1]));
      return publishedDate >= timepoint
    case 'y':
      timepoint.setFullYear(currentDate.getFullYear() - parseInt(time.split('|')[1]));
      return publishedDate >= timepoint
    default:
      break;
  }
  return false;
}

async function fistRun() {
  let secondaryNode = document.querySelector('#secondary-inner,ytd-search,ytd-page-manager,ytd-two-column-browse-results-renderer');
  let listvideo = secondaryNode.querySelectorAll('ytd-compact-video-renderer,ytd-video-renderer,ytd-rich-grid-media');
  listvideo.forEach(async (element) => {
    await infovideo(element);
  });
}

let eleconfig = {
  videoid: '.yt-simple-endpoint.style-scope.ytd-compact-video-renderer,a#video-title,a#video-title-link',
  metadataline: '#metadata-line',
  view: '.inline-metadata-item.ytd-video-meta-block',
  videoTitle: '#video-title,a#video-title,span#video-title'
}
function mutationSv(partennode, childnode) {
  try {


    // Lấy element cần theo dõi
    let targetNode = document.querySelector(partennode);
    // Tạo một observer instance
    let observer = new MutationObserver(function (mutations) {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          let addedNodes = mutation.addedNodes;
          addedNodes.forEach(node => {
            if (node.nodeName.toLowerCase() === childnode) {
              //console.log('Node ytd-compact-video-renderer được thêm vào:', node);
              infovideo(node);
            }
          });
        }
      });
    });
    // Cấu hình observer: chỉ theo dõi thay đổi childList
    let config = { childList: true, subtree: true };
    observer.observe(targetNode, config);
  } catch (error) {
    console.log(`Error mutationSv ${partennode}:`, error.stack || error.meessage || error);
  }
}

// Thực hiện công việc của hàm run() với các tham số đã nhận
console.log("Time:", time);
console.log("Viewpoint:", viewpoint);
console.log("Subpoint:", subpoint);
await fistRun();
// if (document.querySelector('#secondary-inner'))
mutationSv('#secondary-inner', 'ytd-compact-video-renderer');
// if (document.querySelector('ytd-search'))
mutationSv('ytd-search', 'ytd-video-renderer');

// if (document.querySelector('ytd-page-manager'))
mutationSv('ytd-page-manager', 'ytd-rich-item-renderer');
// if (document.querySelector('ytd-two-column-browse-results-renderer'))
mutationSv('ytd-two-column-browse-results-renderer', 'ytd-rich-grid-media');
// chrome extension
// https://www.youtube.com/watch?v=Tt2NolG16kQ&list=PLwlNvVIUtWpsjFKGfIXKOz3CjUfg_aQN4&index=2
