// ===== THAY THẾ CÁC GIÁ TRỊ SAU =====
const API_KEY = 'AIzaSyAmjxvAnND8hvlJSj5jQZ3acSFzVkzTWb4';//'AIzaSyBw06lFRMrP5b7nGekTlBNA-YDCHAgDTSQ'; // 👈 Dán API Key của bạn vào đây
// =======================================

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Chuyển đổi một mảng các đối tượng JavaScript thành chuỗi CSV và kích hoạt tải xuống.
 * @param {Array<object>} dataArray Mảng các đối tượng cần chuyển đổi.
 * @param {string} fileName Tên file CSV mong muốn.
 */
function downloadAsCSV(dataArray, fileName = 'youtube-data.csv') {
    if (!dataArray || dataArray.length === 0) {
        console.error("Dữ liệu trống, không thể tạo file CSV.");
        return;
    }
    const sanitize = (value) => {
        if (value === null || value === undefined) return '';
        let str = String(value);
        if (str.search(/("|,|\n)/g) >= 0) {
            str = `"${str.replace(/"/g, '""')}"`;
        }
        return str;
    };
    const headers = Object.keys(dataArray[0]);
    const csvRows = [headers.join(',')];
    for (const row of dataArray) {
        const values = headers.map(header => sanitize(row[header]));
        csvRows.push(values.join(','));
    }
    const csvContent = csvRows.join('\n');
    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        console.log(`✅ File CSV "${fileName}" đã được tải xuống.`);
    }
}

/**
 * Tìm Channel ID từ handle của kênh (ví dụ: @handle).
 * @param {string} handle Handle của kênh (bắt đầu bằng @).
 * @param {string} apiKey Khóa API Google của bạn.
 * @returns {Promise<string|null>} Channel ID hoặc null nếu không tìm thấy.
 */
async function getChannelIdFromHandle(handle, apiKey) {
    console.log(`...Đang tìm Channel ID cho handle: ${handle}...`);
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=id&q=${handle}&type=channel&key=${apiKey}`;
    const response = await fetch(searchUrl);
    if (!response.ok) throw new Error(`Lỗi HTTP khi tìm kiếm handle! Trạng thái: ${response.status}`);
    const searchData = await response.json();
    if (searchData.items && searchData.items.length > 0) {
        const channelId = searchData.items[0].id.channelId;
        console.log(`...Tìm thấy Channel ID: ${channelId}`);
        return channelId;
    }
    throw new Error(`Không tìm thấy Channel ID nào cho handle "${handle}".`);
}


/**
 * Hàm 1: Lấy thông tin chi tiết của kênh và ID của video trong kênh (giới hạn 500 video gần nhất).
 * @param {string} channelId The ID of the YouTube channel.
 * @param {string} apiKey Your Google API key.
 * @returns {Promise<{channelInfo: object, videoIds: string[]}>}
 */
async function getChannelInfoAndVideoIds(channelId, apiKey) {
    console.log("🚀 [1/4] Đang lấy thông tin kênh...");
    const channelApiUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings,topicDetails,contentDetails&id=${channelId}&key=${apiKey}`;
    const channelResponse = await fetch(channelApiUrl);
    if (!channelResponse.ok) throw new Error(`Lỗi HTTP khi lấy kênh! Trạng thái: ${channelResponse.status}`);
    const channelData = await channelResponse.json();
    if (!channelData.items || channelData.items.length === 0) {
        throw new Error("Không tìm thấy kênh. Vui lòng kiểm tra lại Channel ID hoặc API Key.");
    }
    const channelInfo = channelData.items[0];
    const uploadsPlaylistId = channelInfo.contentDetails.relatedPlaylists.uploads;
    console.log(`👍 [1/4] Lấy thông tin kênh thành công. Playlist ID: ${uploadsPlaylistId}`);

    console.log("🚀 [2/4] Đang lấy ID của tối đa 500 video gần nhất...");
    let allVideoIds = [];
    let nextPageToken = null;
    const videoLimit = 500; // Đặt giới hạn số lượng video

    do {
        const playlistApiUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=${uploadsPlaylistId}&maxResults=50&pageToken=${nextPageToken || ''}&key=${apiKey}`;
        const playlistResponse = await fetch(playlistApiUrl);
        const playlistData = await playlistResponse.json();
        const videoIdsOnPage = playlistData.items.map(item => item.contentDetails.videoId);
        
        const remainingSpace = videoLimit - allVideoIds.length;
        if (videoIdsOnPage.length > remainingSpace) {
             allVideoIds.push(...videoIdsOnPage.slice(0, remainingSpace));
        } else {
            allVideoIds.push(...videoIdsOnPage);
        }

        nextPageToken = playlistData.nextPageToken;
        console.log(`...Đã lấy ${allVideoIds.length}/${videoLimit} video ID...`);
    } while (nextPageToken && allVideoIds.length < videoLimit);
    
    console.log(`👍 [2/4] Lấy thành công tổng cộng ${allVideoIds.length} video ID gần nhất.`);

    return { channelInfo, videoIds: allVideoIds };
}

/**
 * Hàm 2: Lấy thông tin chi tiết cho danh sách video ID một cách đồng thời (đa luồng).
 * @param {string[]} videoIds Array of video IDs.
 * @param {string} apiKey Your Google API key.
 * @param {number} concurrency The number of parallel requests.
 * @returns {Promise<object[]>}
 */
async function getVideosDetailsConcurrently(videoIds, apiKey, concurrency = 10) {
    console.log(`🚀 [3/4] Đang lấy thông tin chi tiết video với ${concurrency} luồng...`);
    let allVideoDetails = [];
    const chunks = [];
    for (let i = 0; i < videoIds.length; i += 50) {
        chunks.push(videoIds.slice(i, i + 50));
    }

    for (let i = 0; i < chunks.length; i += concurrency) {
        const batch = chunks.slice(i, i + concurrency);
        const promises = batch.map(chunk => {
            const videoDetailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics,status&id=${chunk.join(',')}&key=${apiKey}`;
            return fetch(videoDetailsUrl).then(res => res.json());
        });
        const results = await Promise.all(promises);
        for (const result of results) {
            if (result.items) {
                allVideoDetails.push(...result.items);
            }
        }
        console.log(`...Đã xử lý ${allVideoDetails.length}/${videoIds.length} video...`);

        // Thêm thời gian chờ để tránh nghẽn API
        if (i + concurrency < chunks.length) {
            console.log("...Tạm dừng 1 giây để tránh nghẽn...");
            await delay(1000); // Chờ 1 giây
        }
    }
    console.log("👍 [3/4] Lấy thông tin chi tiết tất cả video thành công.");
    return allVideoDetails;
}


/**
 * Hàm chính: Điều phối việc lấy dữ liệu kênh, video và xuất ra CSV.
 * @param {string} channelInput The ID or Handle of the YouTube channel.
 * @param {string} apiKey Your Google API key.
 */
async function getChannelDataAndExport(channelInput, apiKey) {
    if (apiKey === "YOUR_API_KEY" || !apiKey) {
        console.error("⛔️ Lỗi: Vui lòng thay thế 'YOUR_API_KEY' bằng API Key thực tế của bạn.");
        return;
    }
    console.log(`🔎 Bắt đầu quá trình lấy dữ liệu cho đầu vào: ${channelInput}`);
    try {
        let channelId = channelInput;
        // Kiểm tra nếu người dùng nhập handle
        if (channelInput.startsWith('@')) {
            channelId = await getChannelIdFromHandle(channelInput, apiKey);
        }

        // Chạy hàm 1
        const { channelInfo, videoIds } = await getChannelInfoAndVideoIds(channelId, apiKey);

        // Chạy hàm 2
        const allVideoDetails = await getVideosDetailsConcurrently(videoIds, apiKey);

        // --- Bước 4: Xử lý và tổng hợp dữ liệu cho file CSV ---
        console.log("⚙️ [4/4] Đang xử lý và tạo dữ liệu cho CSV...");
        const processedData = allVideoDetails.map(video => {
            const stats = video.statistics;
            const viewCount = parseInt(stats.viewCount || 0);
            const likeCount = parseInt(stats.likeCount || 0);
            const commentCount = parseInt(stats.commentCount || 0);
            const engagementRate = viewCount > 0 ? ((likeCount + commentCount) / viewCount) * 100 : 0;

            return {
                "videoId": video.id,
                "videoTitle": video.snippet.title,
                "videoPublishedAt": video.snippet.publishedAt,
                "videoDescription": video.snippet.description,
                "videoDuration": video.contentDetails.duration,
                "videoStatus": video.status.privacyStatus,
                "videoViews": viewCount,
                "videoLikes": likeCount,
                "videoComments": commentCount,
                "videoTags": (video.snippet.tags || []).join('; '),
                "engagementRatePercent": engagementRate.toFixed(2),
                "channelId": channelInfo.id,
                "channelName": channelInfo.snippet.title,
                "channelPublishedAt": channelInfo.snippet.publishedAt,
                "channelSubscribers": parseInt(channelInfo.statistics.subscriberCount || 0),
                "channelTotalViews": parseInt(channelInfo.statistics.viewCount || 0),
                "channelTotalVideos": parseInt(channelInfo.statistics.videoCount || 0),
                "channelCountry": channelInfo.brandingSettings?.channel?.country || 'N/A',
                "channelKeywords": channelInfo.brandingSettings?.channel?.keywords || 'N/A',
                "channelTopics": (channelInfo.topicDetails?.topicCategories || []).join('; ').replace(/https:\/\/en.wikipedia.org\/wiki\//g, '')
            };
        });
        console.log("👍 [4/4] Xử lý dữ liệu thành công.");

        // --- Bước 5: Xuất ra file CSV ---
        console.log("🚀 [5/5] Đang chuẩn bị tải file CSV...");
        downloadAsCSV(processedData, `youtube-channel-${channelInput}-videos.csv`);

    } catch (error) {
        console.error("💥 Đã xảy ra lỗi trong quá trình thực thi:", error);
    }
}

// --- Chạy hàm chính ---


// Sử dụng một Set để lưu trữ các channel ID đã được xử lý
const processedChannelIds = new Set();

let videoElements = document.querySelectorAll("#contents>ytd-rich-item-renderer");

for (let i = 0; i < videoElements.length; i++) {
    try {
        const element = videoElements[i];
        let metadata = element.querySelector("yt-content-metadata-view-model a");
        let channelid = metadata.href.split("/").pop();

        // Chỉ xử lý nếu channel ID này chưa có trong Set
        if (!processedChannelIds.has(channelid)) {
            console.log(`Đang xử lý kênh mới: ${channelid}`);

            // Thêm channel ID vào Set để đánh dấu là đã xử lý
            processedChannelIds.add(channelid);

            // Gọi hàm của bạn
            getChannelDataAndExport(channelid, API_KEY);
        }

    } catch (error) {
        // Bỏ qua lỗi nếu không tìm thấy metadata để vòng lặp không bị gián đoạn
        // console.error("💥 Lỗi khi xử lý một video item:", error);
    }
}
