/* lọc lấy file dạng srt
khi get text sẽ tính toán theo thời gian position + duration nếu cách position tiếp theo > 3 giây thì xuống dòng, nếu không thì để liền dòng
 */

async function getSubs(languageCode = 'en') {
    // Fetch the current page and parse the response
    const response = await fetch(window.location.href);
    // Lấy nội dung trả về từ yêu cầu HTTP
    const responseText = await response.text();

    // Tách chuỗi để lấy phần dữ liệu cần thiết từ nội dung trả về
    const ytInitialPlayerResponse = responseText.split('ytInitialPlayerResponse = ')[1].split(';var')[0];
    // Chuyển chuỗi JSON thành đối tượng JavaScript và lấy ra danh sách các đường dẫn phụ đề
    const captionTracks = JSON.parse(ytInitialPlayerResponse).captions.playerCaptionsTracklistRenderer.captionTracks;

    // Định nghĩa hàm để tìm URL của phụ đề dựa vào mã ngôn ngữ
    const findCaptionUrl = language => captionTracks.find(track => track.vssId.indexOf(language) === 0)?.baseUrl;
    /* [
        {
            "baseUrl": "https://www.youtube.com/api/timedtext?v=0qmF2-f7TgA&ei=9YPkZfXwDeS5vcAP_tufsAc&caps=asr&opi=112496729&xoaf=5&hl=vi&ip=0.0.0.0&ipbits=0&expire=1709500005&sparams=ip,ipbits,expire,v,ei,caps,opi,xoaf&signature=C17836FEA56EEAF5311B5816DBA00CBEBCE5FF1F.C7736F778A7CBD4A41EB69FB21EFBCC6B2D052BB&key=yt8&kind=asr&lang=en",
            "name": {
                "simpleText": "Tiếng Anh (được tạo tự động)"
            },
            "vssId": "a.en",
            "languageCode": "en",
            "kind": "asr",
            "isTranslatable": true,
            "trackName": ""
        }
    ] */
    // Xác định URL cho phụ đề
    const firstChoice = findCaptionUrl("." + languageCode);
    const url = firstChoice
        // Nếu tìm thấy phụ đề phù hợp với mã ngôn ngữ, sử dụng URL đó
        ? firstChoice + "&fmt=json3"
        // Nếu không tìm thấy, sử dụng URL phụ đề mặc định hoặc phụ đề tiếng Anh
        : (findCaptionUrl(".") || findCaptionUrl("a." + languageCode) || captionTracks[0].baseUrl) + "&fmt=json3&tlang=" + languageCode;
    //https://www.youtube.com/api/timedtext?v=0qmF2-f7TgA&ei=9YPkZfXwDeS5vcAP_tufsAc&caps=asr&opi=112496729&xoaf=5&hl=vi&ip=0.0.0.0&ipbits=0&expire=1709500005&sparams=ip,ipbits,expire,v,ei,caps,opi,xoaf&signature=C17836FEA56EEAF5311B5816DBA00CBEBCE5FF1F.C7736F778A7CBD4A41EB69FB21EFBCC6B2D052BB&key=yt8&kind=asr&lang=en&fmt=json3&tlang=en
    
    // Lấy nội dung phụ đề từ URL đã xác định
    const subsResponse = await fetch(url);
    const subsContent = await subsResponse.json();

    // Chuyển đổi định dạng của các sự kiện trong nội dung phụ đề
    return subsContent.events.map(event => ({
        // Giữ nguyên các thuộc tính khác của sự kiện
        ...event,
        // Chuyển đổi định dạng của phần văn bản trong sự kiện
        text: event.segs?.map(segment => segment.utf8)?.join(" ")?.replace(/\n/g, ' ')?.replace(/♪|'|"|\.{2,}|\<[\s\S]*?\>|\{[\s\S]*?\}|\[[\s\S]*?\]/g, '')?.trim() || ''
    }));
}

async function logSubs(languageCode) {
    // Lấy phụ đề
    const subtitles = await getSubs(languageCode);

    // Nối các phần văn bản của phụ đề lại với nhau bằng dấu xuống dòng
    const subtitleText = subtitles.map(subtitle => subtitle.text).join('\n');

    // In văn bản phụ đề ra console
    console.log(subtitleText);
    // Trả về văn bản phụ đề
    return subtitleText;
}