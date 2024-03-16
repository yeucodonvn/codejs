const API_KEY = 'AIzaSyAbBIyID9O1HqSqpt-09aR1VrtH3vBHY7E';

const Listurl = [];
// https://www.magetop.com/blog/cach-lay-api-key-youtube/
// ytb API key AIzaSyAbBIyID9O1HqSqpt-09aR1VrtH3vBHY7E
const videoinfo = async (videoid) => {
  let response = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`
  );
  const responseText = await response.text();
  const res = JSON.parse(responseText)
  var viewCount = res.items[0].statistics.viewCount;
  var likeCount = res.items[0].statistics.likeCount;
  var published = res.items[0].snippet.publishedAt;
  var channelId = res.items[0].snippet.channelId
  return { viewCount, likeCount, published, channelId };
}

const getChannelSubscriberCount = async (channelId) => {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${API_KEY}`
  );
  const data = await response.json();

  if (data.items && data.items.length > 0) {
    return data.items[0].statistics.subscriberCount;
  } else {
    return null;
  }
};

const infovideo = async (videoid) => {
  var { viewCount, likeCount, published, channelId } = await videoinfo(videoid);
  var channelsub = await getChannelSubscriberCount(channelId);
  // so sánh published định dạng 2023-10-05T04:00:18Z với thời gian hiện tại, lấy ra dạng ngày tháng năm
  let publishedDate = new Date(published);
  let currentDate = new Date();
  let uploadDate = publishedDate.getDate() + "/" + (publishedDate.getMonth() + 1) + "/" + publishedDate.getFullYear();


}

async function fistrun(params) {
  var secondaryNode = document.querySelector('#secondary-inner');
  var listvideo = secondaryNode.querySelectorAll('ytd-compact-video-renderer');
  listvideo.forEach(async (element) => {
    var videoid = element.querySelector('.yt-simple-endpoint.style-scope.ytd-compact-video-renderer').href.split('v=')[1];
    Listurl.push(videoid);
    var { viewCount, likeCount, published, channelId } = await videoinfo(videoid);
    let publishedDate = new Date(published);
    var channelsub = await getChannelSubscriberCount(channelId);
    let currentDate = new Date();
    let uploadDate = publishedDate.getDate() + "/" + (publishedDate.getMonth() + 1) + "/" + publishedDate.getFullYear();
    var channelname = element.querySelector('[class=*"ytd-channel-name"]')
    element.querySelector('[class=*"ytd-channel-name"]').textContent = channelId + "-> Sub: " + channelsub;
    

  });


}
function reloadchange(params) {

}
// Lấy element cần theo dõi
var targetNode = document.querySelector('#secondary-inner');

// Tạo một observer instance
var observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (mutation.type === 'childList') {
      reloadchange();
    }
  });
});

// Cấu hình observer: chỉ theo dõi thay đổi childList
var config = { childList: true };

// Bắt đầu quá trình theo dõi
observer.observe(targetNode, config);