// ==UserScript==
// @name            View Image
// @namespace       https://github.com/bijij/ViewImage
// @version         4.1.1
// @description     This userscript re-implements the "View Image" and "Search by image" buttons into google images.
// @author          Joshua B
// @run-at          document-end
// @include         http*://*.google.tld/search*tbm=isch*
// @include         http*://*.google.tld/imgres*
// @updateURL       https://gist.githubusercontent.com/bijij/58cc8cfc859331e4cf80210528a7b255/raw/viewimage.user.js
// ==/UserScript==
'use strict';

const DEBUG = true;

const VERSIONS = {
    FEB18: 'FEB18',
    JUL19: 'JUL19',
    OCT19: 'OCT19'
};

// Khởi tạo một đối tượng mới
var images = new Object();

// Hàm tìm kiếm div chứa tất cả các phần tử cần thiết
function getContainer(node) {
    var container, version;
    // Duyệt qua mảng các cặp [selector, version]
    [
        ['.irc_c[style*="visibility: visible;"][style*="transform: translate3d(0px, 0px, 0px);"]', VERSIONS.FEB18],
        ['.irc_c[data-ved]', VERSIONS.JUL19],
        ['.tvh9oe', VERSIONS.OCT19]
    ].forEach(element => {
        // Nếu node gần nhất phù hợp với selector
        if (node.closest(element[0])) {
            // Gán container và version
            [container, version] = [node.closest(element[0]), element[1]];
        }
    });
    // Trả về container và version
    return [container, version];
}

// Hàm tìm kiếm và xóa tất cả các phần tử liên quan đến extension.
function clearExtElements(container) {
    // Tìm kiếm các phần tử được tạo bởi extension trước đó
    var oldExtensionElements = container.querySelectorAll('.vi_ext_addon');
    // Duyệt qua và xóa tất cả các phần tử này
    for (var element of oldExtensionElements) {
        element.remove();
    }
}
// Hàm trả về URL của hình ảnh
function findImageURL(container, version) {

    var image = null;

    // Dựa vào phiên bản để tìm hình ảnh
    switch (version) {
        case VERSIONS.FEB18:
            // Tìm hình ảnh dựa trên các selector
            image = container.querySelector('img[src]#irc_mi, img[alt^="Image result"][src]:not([src^="https://encrypted-tbn"]).irc_mut, img[src].irc_mi');
            break;
        case VERSIONS.JUL19:
            // Tìm iframe, nếu không tìm thấy thì quay lại phiên bản FEB18
            var iframe = container.querySelector('iframe.irc_ifr');
            if (!iframe)
                return findImageURL(container, VERSIONS.FEB18);
            // Tìm hình ảnh trong iframe
            image = iframe.contentDocument.querySelector('img#irc_mi');
            break;
        case VERSIONS.OCT19:
            // Tìm hình ảnh dựa trên các selector
            image = container.querySelector('img[src].n3VNCb, img[src].r48jcc');
            // Nếu hình ảnh đã tồn tại trong danh sách hình ảnh, trả về URL của hình ảnh đó
            if (image.src in images) {
                return images[image.src];
            }
    }

    // Nếu hình ảnh không tìm thấy hoặc URL của hình ảnh bắt đầu bằng 'data', thử tìm thumbnail
    if (image === null || image.src === '' || image.src.startsWith('data')) {
        var thumbnail = document.querySelector('img[name="' + container.dataset.itemId + '"]');
        if (thumbnail === null) {
            // Nếu không tìm thấy thumbnail, thử lấy hình ảnh từ URL
            var url = new URL(window.location);
            var imgLink = url.searchParams.get('imgurl');
            if (imgLink) {
                return imgLink;
            }
        } else {
            // Nếu tìm thấy thumbnail, lấy metadata từ thumbnail
            var meta = thumbnail.closest('.rg_bx').querySelector('.rg_meta');
            var metadata = JSON.parse(meta.innerHTML);
            return metadata.ou;
        }
    }

    // Nếu cách trên không hoạt động, sử dụng liên kết trong hình ảnh liên quan để tìm nó
    if (image === null || image.src === '' || image.src.startsWith('data')) {
        var target_image = container.querySelector('img.target_image');
        if (target_image) {
            var link = target_image.closest('a');
            if (link) {
                // Một số tiện ích mở rộng thay thế liên kết hình ảnh google bằng liên kết gốc của chúng
                if (link.href.match(/^[a-z]+:\/\/(?:www\.)?google\.[^/]*\/imgres\?/)) {
                    var link_url = new URL(link.href);
                    var new_imgLink = link_url.searchParams.get('imgurl');
                    if (new_imgLink) {
                        return new_imgLink;
                    }
                } else {
                    return link.href;
                }
            }
        }
    }

    // Nếu hình ảnh tồn tại, trả về URL của hình ảnh
    if (image) {
        return image.src;
    }

}
function addViewImageButton(container, imageURL, version) {

    // Lấy nút visit
    var visitButton;
    switch (version) {
        case VERSIONS.FEB18:
            visitButton = container.querySelector('td > a.irc_vpl[href]').parentElement; // Tìm nút visit trong container dựa trên selector
            break;
        case VERSIONS.JUL19:
            visitButton = container.querySelector('a.irc_hol[href]'); // Tìm nút visit trong container dựa trên selector
            break;
        case VERSIONS.OCT19:
            visitButton = container.querySelector('.ZsbmCf[href], a.J2oL9c, a.jAklOc, a.uZ49bd, a.e0XTue, a.kWgFk, a.j7ZI7c'); // Tìm nút visit trong container dựa trên selector
            break;
    }

    // Tạo nút view image
    var viewImageButton = visitButton.cloneNode(true); // Tạo một bản sao của nút visit
    viewImageButton.classList.add('vi_ext_addon'); // Thêm class 'vi_ext_addon' vào nút view image

    // Đặt url cho nút view image
    var viewImageLink;
    switch (version) {
        case VERSIONS.FEB18:
            viewImageLink = viewImageButton.querySelector('a'); // Tìm liên kết trong nút view image
            break;
        default:
            viewImageLink = viewImageButton; // Nếu không tìm thấy, sử dụng chính nút view image làm liên kết
    }

    viewImageLink.href = imageURL; // Đặt href cho liên kết là imageURL
    if (version == VERSIONS.OCT19) {
        viewImageLink.removeAttribute('jsaction'); // Nếu phiên bản là OCT19, xóa thuộc tính 'jsaction'
    }

    // Đặt các tùy chọn bổ sung
    viewImageLink.setAttribute('target', '_blank'); // Đặt thuộc tính 'target' là '_blank' để mở liên kết trong tab mới

    // Đặt text cho nút view image
    var viewImageButtonText;
    switch (version) {
        case VERSIONS.FEB18:
            viewImageButtonText = viewImageButton.querySelector('.Tl8XHc'); // Tìm text trong nút view image
            break;
        case VERSIONS.JUL19:
            viewImageButtonText = viewImageButton.querySelector('.irc_ho'); // Tìm text trong nút view image
            break;
        case VERSIONS.OCT19:
            viewImageButtonText = viewImageButton.querySelector('.pM4Snf, .KSvtLc, .Pw5kW, .q7UPLe, .K8E1Be, .pFBf7b, span'); // Tìm text trong nút view image
            break;
    }

    viewImageButtonText.innerText = 'View Image'; // Đặt text của nút view image là 'View Image'

    // Đặt nút view image vào container
    visitButton.parentElement.insertBefore(viewImageButton, visitButton); // Chèn nút view image vào trước nút visit
    visitButton.parentElement.insertBefore(visitButton, viewImageButton); // Chèn nút visit vào trước nút view image
}
function addSearchImageButton(container, imageURL, version) {

    // Khởi tạo biến link
    var link;
    switch (version) {
        case VERSIONS.FEB18:
            link = container.querySelector('.irc_dsh > a.irc_hol'); // Tìm link trong container dựa trên selector
            break;
        case VERSIONS.JUL19:
            link = container.querySelector('.irc_ft > a.irc_help'); // Tìm link trong container dựa trên selector
            break;
        case VERSIONS.OCT19:
            link = container.querySelector('.PvkmDc, .qnLx5b, .zSA7pe, .uZ49bd, .e0XTue, .kWgFk, .j7ZI7c'); // Tìm link trong container dựa trên selector
            break;
    }

    // Tạo nút search by image
    var searchImageButton = link.cloneNode(true); // Tạo một bản sao của link
    searchImageButton.classList.add('vi_ext_addon'); // Thêm class 'vi_ext_addon' vào nút search by image

    // Đặt text cho nút more sizes
    var searchImageButtonText;
    switch (version) {
        case VERSIONS.FEB18:
            searchImageButtonText = container.querySelector('.irc_ho'); // Tìm text trong container dựa trên selector
            break;
        case VERSIONS.JUL19:
            searchImageButtonText = searchImageButton.querySelector('span'); // Tìm text trong nút search by image dựa trên selector
            break;
        case VERSIONS.OCT19:
            searchImageButtonText = searchImageButton; // Nếu không tìm thấy, sử dụng chính nút search by image làm text
            break;
    }

    searchImageButtonText.innerText = 'Search by Image'; // Đặt text của nút search by image là 'Search by Image'

    // Đặt url cho nút search by image
    searchImageButton.href = '/searchbyimage?image_url=' + encodeURIComponent(imageURL); // Đặt href cho nút search by image là '/searchbyimage?image_url=' + imageURL đã được mã hóa

    // Đặt các tùy chọn bổ sung
    if (true) {
        searchImageButton.setAttribute('target', '_blank'); // Đặt thuộc tính 'target' là '_blank' để mở link trong tab mới
    }

    // Đặt nút more sizes vào container
    link.parentElement.insertBefore(searchImageButton, link); // Chèn nút search by image vào trước link
    link.parentElement.insertBefore(link, searchImageButton); // Chèn link vào trước nút search by image
}

// Adds links to an object
// Thêm liên kết vào một đối tượng
function addLinks(node) {

    if (DEBUG)
        console.log('ViewImage: Đang thử thêm liên kết vào node: ', node);

    // Tìm container
    var [container, version] = getContainer(node);

    // Trả về nếu không tìm thấy container
    if (!container) {
        if (DEBUG)
            console.log('ViewImage: Thêm liên kết thất bại, không tìm thấy container.');
        return;
    }

    if (DEBUG)
        console.log('ViewImage: Giả định phiên bản trang web: ', version);

    // Xóa bất kỳ phần tử mở rộng cũ nào
    clearExtElements(container);

    // Tìm url của hình ảnh
    var imageURL = findImageURL(container, version);

    // Trả về nếu không tìm thấy hình ảnh
    if (!imageURL) {

        if (DEBUG)
            console.log('ViewImage: Thêm liên kết thất bại, không tìm thấy hình ảnh.');

        return;
    }

    addViewImageButton(container, imageURL, version);
    addSearchImageButton(container, imageURL, version);
}

// Hàm parseDataSource nhận vào một mảng và xử lý nó
function parseDataSource(array) {
    // Lấy ra phần tử meta từ mảng
    var meta = array[31][0][12][2];
    // Duyệt qua từng phần tử trong mảng meta
    for (var i = 0; i < meta.length; i++) {
        try {
            // Thêm hình ảnh vào mảng images
            images[meta[i][1][2][0]] = meta[i][1][3][0];
        } catch (error) {
            // Nếu có lỗi, kiểm tra nếu DEBUG đang bật thì in ra thông báo
            if (DEBUG)
                console.log('ViewImage: Skipping image');
        }
    }
}

// Hàm parseDataSource1 tìm kiếm và phân tích dữ liệu từ trang web
function parseDataSource1() {
    // Tạo biểu thức chính quy để tìm kiếm dữ liệu bắt đầu
    const start_search = /AF_initDataCallback\({key:\s'ds:1',\shash:\s'\d+',\sdata:/;
    // Tạo biểu thức chính quy để tìm kiếm dữ liệu kết thúc
    const end_search = ', sideChannel: {}});</script>';

    // Tìm kiếm dữ liệu bắt đầu trong HTML của trang web
    var match = document.documentElement.innerHTML.match(start_search);

    // Xác định vị trí bắt đầu và kết thúc của dữ liệu
    var start_index = match.index + match[0].length;
    var end_index = start_index + document.documentElement.innerHTML.slice(start_index).indexOf(end_search);

    // Phân tích dữ liệu và gọi hàm parseDataSource
    parseDataSource(JSON.parse(document.documentElement.innerHTML.slice(start_index, end_index)));
}

// Hàm parseDataSource2 tương tự như parseDataSource1 nhưng tìm kiếm dữ liệu khác
function parseDataSource2() {
    // Tạo biểu thức chính quy để tìm kiếm dữ liệu bắt đầu
    const start_search = /AF_initDataCallback\({key:\s'ds:2',\sisError:\s{2}false\s,\shash:\s'\d+',\sdata:function(){return\s/;
    // Tạo biểu thức chính quy để tìm kiếm dữ liệu kết thúc
    const end_search = '}});</script>';

    // Tìm kiếm dữ liệu bắt đầu trong HTML của trang web
    var match = document.documentElement.innerHTML.match(start_search);

    // Xác định vị trí bắt đầu và kết thúc của dữ liệu
    var start_index = match.index + match[0].length;
    var end_index = start_index + document.documentElement.innerHTML.slice(start_index).indexOf(end_search);

    // Phân tích dữ liệu và gọi hàm parseDataSource
    parseDataSource(JSON.parse(document.documentElement.innerHTML.slice(start_index, end_index)));
}
// Kiểm tra xem nguồn có chứa mảng hình ảnh không
try {
    // Nếu HTML của trang web chứa 'key: \'ds:1\''
    if (document.documentElement.innerHTML.indexOf('key: \'ds:1\'') != -1) {
        // Nếu DEBUG đang bật, in ra thông báo đang cố gắng phân tích nguồn dữ liệu 1
        if (DEBUG)
            console.log('ViewImage: Attempting to parse data source 1.');
        // Gọi hàm parseDataSource1 để phân tích nguồn dữ liệu 1
        parseDataSource1();
    } 
    // Nếu HTML của trang web chứa 'key: \'ds:2\''
    else if (document.documentElement.innerHTML.indexOf('key: \'ds:2\'') != -1) {
        // Nếu DEBUG đang bật, in ra thông báo đang cố gắng phân tích nguồn dữ liệu 2
        if (DEBUG)
            console.log('ViewImage: Attempting to parse data source 2.');
        // Gọi hàm parseDataSource2 để phân tích nguồn dữ liệu 2
        parseDataSource2();
    } 
    // Nếu không tìm thấy 'key: \'ds:1\'' hoặc 'key: \'ds:2\'' trong HTML của trang web
    else {
        // Ném lỗi không thể xác định loại nguồn dữ liệu
        throw 'Could not determine data source type.';
    }

    // Nếu DEBUG đang bật, in ra thông báo đã tạo thành công mảng hình ảnh từ nguồn
    if (DEBUG)
        console.log('ViewImage: Successfully created source images array.');

} 
// Nếu có lỗi xảy ra trong quá trình kiểm tra và phân tích nguồn dữ liệu
catch (error) {
    // Nếu DEBUG đang bật, in ra thông báo không tạo được mảng hình ảnh từ nguồn và chi tiết lỗi
    if (DEBUG) {
        console.log('ViewImage: Failed to create source images array.');
        console.error(error);
    }
}

// Định nghĩa các quan sát viên mutation
var observer = new MutationObserver(function (mutations) {

    // Nếu DEBUG đang bật, in ra thông báo phát hiện mutation
    if (DEBUG)
        console.log('ViewImage: Mutations detected: ', mutations);

    var node;
    // Duyệt qua từng mutation
    for (var mutation of mutations) {
        // Nếu có node mới được thêm vào
        if (mutation.addedNodes && mutation.addedNodes.length > 0) {
            // Duyệt qua từng node mới
            for (node of mutation.addedNodes) {
                // Nếu node có classList
                if (node.classList) {
                    // Kiểm tra xem node có phải là node hình ảnh mới không
                    if (['irc_mi', 'irc_mut', 'irc_ris', 'n3VNCb', 'r48jcc'].some(className => node.classList.contains(className))) {
                        console.log(node)
                       // addLinks(node);
                    }
                }
            }
        }

        // Nếu target của mutation có classList và chứa class 'n3VNCb' hoặc 'r48jcc'
        if (mutation.target.classList && mutation.target.classList.contains('n3VNCb', 'r48jcc')) {
            // Tìm node gần nhất có class 'tvh9oe'
            node = mutation.target.closest('.tvh9oe');

            // Nếu node không có thuộc tính 'aria-hidden'
            if (!node.hasAttribute('aria-hidden')) {
                console.log(node)
               // addLinks(node);
            }
        }
    }
});

// Bắt đầu thêm liên kết
if (DEBUG)
    console.log('ViewImage: Initialising observer...');

// Bắt đầu quan sát thay đổi trên document.body
observer.observe(document.body, {
    childList: true, // quan sát thay đổi trong danh sách con
    subtree: true, // quan sát thay đổi trong tất cả cây con
    attributes: true // quan sát thay đổi thuộc tính
});

// inject CSS into document
if (DEBUG)
    console.log('ViewImage: Injecting CSS...');

var customStyle = document.createElement('style');
customStyle.innerText = `
.irc_dsh>.irc_hol.vi_ext_addon,
.irc_ft>.irc_help.vi_ext_addon,
.PvkmDc.vi_ext_addon,
.qnLx5b.vi_ext_addon
{
    margin: 0 4pt!important
}
.irc_hol.vi_ext_addon
{
    flex-grow:0!important
}
.zSA7pe[href^="/searchbyimage"] {
    margin-left: 4px;
}
.ZsbmCf.vi_ext_addon{
    flex-grow:0
}`;
document.head.appendChild(customStyle);
// qemu-img create -f qcow2 "E:\may ao\qemu\w2012.img" 12G
//qemu-system-x86_64 -m 2048 -cdrom E:\Windows_Server_2012_R2(2).iso -hda "E:\may ao\qemu\w2012.img"
// -boot d -net nic -net user -localtime -vga std -usb -device usb-tablet -soundhw hda -cpu host -smp 2 -name "Windows Server 2012 R2" -monitor stdio -vnc :1