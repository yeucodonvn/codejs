# -*- coding: utf-8 -*-
import requests
import json
import time
import hashlib
import re
from urllib.parse import urlencode
from typing import Optional, Dict, Any
from functools import reduce


class BilibiliClient:
    """
    Một client để tương tác với API của Bilibili, tập trung vào tìm kiếm,
    lấy danh sách yêu thích và lấy link download cho video.
    """

    BASE_HEADERS = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
        "Referer": "https://www.bilibili.com/",
        "Origin": "https://www.bilibili.com",
    }

    SEARCH_API_URL = "https://api.bilibili.com/x/web-interface/wbi/search/type"
    NAV_API_URL = "https://api.bilibili.com/x/web-interface/nav"
    PLAYER_PLAY_URL = "https://api.bilibili.com/x/player/playurl"
    FAV_LIST_API_URL = "https://api.bilibili.com/x/v3/fav/resource/list"
    VIDEO_INFO_API_URL = "https://api.bilibili.com/x/web-interface/view"

    MIXIN_KEY_ENCODE_TABLE = [
        46,
        47,
        18,
        2,
        53,
        8,
        23,
        32,
        15,
        50,
        10,
        31,
        58,
        3,
        45,
        35,
        27,
        43,
        5,
        49,
        33,
        9,
        42,
        19,
        29,
        28,
        14,
        39,
        12,
        38,
        41,
        13,
        37,
        48,
        7,
        16,
        24,
        55,
        40,
        61,
        26,
        17,
        0,
        1,
        60,
        51,
        30,
        4,
        22,
        25,
        54,
        21,
        56,
        59,
        6,
        63,
        57,
        62,
        11,
        36,
        20,
        34,
        44,
        52,
    ]

    def __init__(self, cookie: Optional[str] = None):
        self.session = requests.Session()
        self.session.headers.update(self.BASE_HEADERS)
        self.img_key = None
        self.sub_key = None
        self.user_mid = None

        if cookie:
            self.session.headers["Cookie"] = cookie
            print("--- Client đã được khởi tạo với cookie. ---")
        else:
            print(
                "--- Client đã được khởi tạo không có cookie. Một số chức năng (như xem danh sách yêu thích) sẽ không hoạt động. ---"
            )

        self._refresh_wbi_keys()

    def _get_mixin_key(self, img_key: str, sub_key: str) -> str:
        s = img_key + sub_key
        return reduce(lambda x, y: x + s[y], self.MIXIN_KEY_ENCODE_TABLE, "")[:32]

    def _refresh_wbi_keys(self):
        print("🔄 Đang lấy WBI keys mới nhất...")
        try:
            nav_data = self._make_request(self.NAV_API_URL, wbi_signed=False)
            if nav_data and "wbi_img" in nav_data:
                wbi_img = nav_data["wbi_img"]
                self.img_key = wbi_img["img_url"].split("/")[-1].split(".")[0]
                self.sub_key = wbi_img["sub_url"].split("/")[-1].split(".")[0]
                if nav_data.get("isLogin"):
                    self.user_mid = nav_data.get("mid")
                    print(
                        f"✅ Lấy WBI keys và thông tin người dùng (MID: {self.user_mid}) thành công!"
                    )
                else:
                    print("✅ Lấy WBI keys thành công! (Chưa đăng nhập)")
            else:
                raise ValueError("Không tìm thấy WBI keys trong phản hồi.")
        except Exception as e:
            print(f"❌ Lỗi khi lấy WBI keys: {e}. Sử dụng giá trị dự phòng.")
            self.img_key = "7cd084941338484aae1ad9425b84077c"
            self.sub_key = "4932caff0ff746eab6f01bf08b70ac45"

    def _sign_params(self, params: Dict[str, Any]) -> Dict[str, Any]:
        if not self.img_key or not self.sub_key:
            self._refresh_wbi_keys()
        mixin_key = self._get_mixin_key(self.img_key, self.sub_key)
        params["wts"] = int(time.time())
        params = dict(sorted(params.items()))
        query = urlencode(
            {
                k: "".join(filter(lambda char: char not in "!'()*", str(v)))
                for k, v in params.items()
            }
        )
        w_rid = hashlib.md5((query + mixin_key).encode("utf-8")).hexdigest()
        params["w_rid"] = w_rid
        return params

    def _make_request(
        self, url: str, params: Optional[Dict[str, Any]] = None, wbi_signed: bool = True
    ) -> Optional[Dict[str, Any]]:
        if params is None:
            params = {}
        final_params = self._sign_params(params) if wbi_signed else params
        try:
            response = self.session.get(url, params=final_params, timeout=15)
            response.raise_for_status()
            data = response.json()
            if data.get("code") == 0:
                return data.get("data", data.get("result"))
            else:
                print(
                    f"Lỗi API Bilibili (code: {data.get('code')}): {data.get('message', 'Lỗi không xác định')}"
                )
                if data.get("code") == -412 and wbi_signed:
                    print(
                        "Lỗi 412, có thể WBI key đã hết hạn. Thử làm mới và gọi lại..."
                    )
                    self._refresh_wbi_keys()
                    return self._make_request(url, params, wbi_signed)
                return None
        except requests.exceptions.RequestException as e:
            print(f"Lỗi kết nối: {e}")
            return None
        except json.JSONDecodeError:
            print("Lỗi: Không thể giải mã phản hồi JSON.")
            return None

    def search_video(self, keyword: str, page: int = 1) -> Optional[Dict[str, Any]]:
        print(f"\n🔍 Đang tìm kiếm video '{keyword}' (trang: {page})...")
        params = {
            "search_type": "video",
            "keyword": keyword,
            "page": page,
            "page_size": 20,
            "platform": "pc",
            "web_location": 1430654,
        }
        return self._make_request(self.SEARCH_API_URL, params=params)

    def get_video_info(self, bvid: str) -> Optional[Dict[str, Any]]:
        bvid = 'BV1of421Z7bB'
        """Lấy thông tin video, bao gồm CID."""
        print(f"ℹ️ Đang lấy thông tin chi tiết cho video {bvid}...")
        return self._make_request(
            self.VIDEO_INFO_API_URL, params={"bvid": bvid}, wbi_signed=False
        )

    def get_download_urls(self, bvid: str, cid: int) -> Optional[Dict[str, Any]]:
        print(f"⏬ Đang lấy link download cho BVID: {bvid}, CID: {cid}...")
        params = {
            "bvid": bvid,
            "cid": cid,
            "fnval": 4048,  # 4048 để lấy stream DASH và HDR
            "fourk": 1,
        }
        return self._make_request(self.PLAYER_PLAY_URL, params=params, wbi_signed=False)

    def get_fav_list(self, media_id: int, page: int = 1) -> Optional[Dict[str, Any]]:
        print(f"\n❤️ Đang lấy danh sách yêu thích (ID: {media_id}, trang: {page})...")
        params = {
            "media_id": media_id,
            "pn": page,
            "ps": 20,
            "platform": "web",
        }
        return self._make_request(
            self.FAV_LIST_API_URL, params=params, wbi_signed=False
        )


def display_videos(video_list: list, source: str):
    if not video_list:
        print(f"❌ Không tìm thấy video nào trong {source}.")
        return
    print(f"\n--- Danh sách video từ {source} ---")
    for i, item in enumerate(video_list):
        title = (
            item.get("title", "N/A")
            .replace('<em class="keyword">', "")
            .replace("</em>", "")
        )
        author = item.get("author", item.get("upper", {}).get("name", "N/A"))
        bvid = item.get("bvid", "N/A")
        video_url = f"https://www.bilibili.com/video/{bvid}" if bvid != "N/A" else "N/A"
        print(f"  [{i+1}] {title}")
        print(f"      - Tác giả: {author}")
        print(f"      - BVID: {bvid}")
        print(f"      - URL: {video_url}")
    print("----------------------------------\n")


def display_download_info(data: Dict[str, Any]):
    """
    Hiển thị link download chất lượng cao nhất cho video và audio.
    """
    if not data or "dash" not in data:
        print(
            "❌ Không lấy được thông tin download. Video có thể yêu cầu VIP hoặc đã bị xóa."
        )
        return

    dash_data = data["dash"]
    video_streams = dash_data.get("video", [])
    audio_streams = dash_data.get("audio", [])

    print("\n--- Link Download Chất Lượng Cao Nhất ---")

    if video_streams:
        # Lấy stream đầu tiên, thường là chất lượng cao nhất
        best_video = video_streams[0]
        quality = best_video.get("id")
        resolution = f"{best_video.get('width')}x{best_video.get('height')}"
        codecs = best_video.get("codecs")
        print("🎬 Video (Chất lượng cao nhất):")
        print(f"  - ID: {quality} ({resolution}) - Codec: {codecs}")
        print(f"  - URL: {best_video.get('baseUrl')}")
    else:
        print("🎬 Video: Không tìm thấy link.")

    if audio_streams:
        # Lấy stream đầu tiên, thường là chất lượng cao nhất
        best_audio = audio_streams[0]
        quality = best_audio.get("id")
        codecs = best_audio.get("codecs")
        print("\n🎵 Audio (Chất lượng cao nhất):")
        print(f"  - ID: {quality} - Codec: {codecs}")
        print(f"  - URL: {best_audio.get('baseUrl')}")
    else:
        print("\n🎵 Audio: Không tìm thấy link.")

    print("-------------------------------------------\n")
    print(
        "📌 Ghi chú: Bạn cần dùng một công cụ như FFmpeg để ghép file video và audio lại."
    )


def main():
    print("=============================================")
    print(" Bilibili Search & Download Tool (by Gemini) ")
    print("=============================================")

    # cookie = input("Nhập cookie của bạn (nhấn Enter để bỏ qua): ").strip()
    # client = BilibiliClient(cookie=cookie)
    client = BilibiliClient(cookie="buvid3=6DDFBAAC-13E6-2419-F047-64486A95ABF742054infoc; b_nut=1731238842; bsource=search_baidu; _uuid=B79109389-1F106-D6A5-7F4D-4DA92BB6A3BB41806infoc; buvid_fp=6521e38fdb2aa24344934bb2f6563be6; buvid4=CBB4B0EC-66E4-A2F9-B681-49CC19BA25E543572-024111011-PjK9dL0dTrNEdpefov0iTw%3D%3D; rpdid=|(umYJRummuR0J'u~JukJ))RR; enable_web_push=DISABLE; home_feed_column=5; bmg_af_switch=1; bmg_src_def_domain=i1.hdslb.com; browser_resolution=1478-754; CURRENT_QUALITY=0; SESSDATA=5c203d43%2C1770845717%2C2cf8b%2A82CjCJ6eiM4FOi3vOar0mQs45Q84v1cu7f1Vs_N4_ZRkguvLLEyKnzR7-TVfrI1mB8YGwSVlZ2Y3FPbzJkRU9NaThTY1I5blQzNk9YNFViMFBSNXhwdFNCekZlOFZRWHdpamtQWEZZQ0dUbFlpd21yNnM3LVFIMmlSMEN0RjhzQ2pheURBY0JKU1dRIIEC; bili_jct=89207a3a2399c07e285dc0eab698ed71; DedeUserID=3546959501593109; DedeUserID__ckMd5=b13609710621faca; sid=4su7nlco; theme-tip-show=SHOWED; b_lsid=533EBBBE_198B9DB9CC4; bili_ticket=eyJhbGciOiJIUzI1NiIsImtpZCI6InMwMyIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTU3MjQwMzYsImlhdCI6MTc1NTQ2NDc3NiwicGx0IjotMX0.bNx3QfLqn0JefatztMpyidH70MEcKF3xdtFB10xEAuw; bili_ticket_expires=1755723976; theme-avatar-tip-show=SHOWED; timeMachine=0; CURRENT_FNVAL=4048; bp_t_offset_3546959501593109=1102211143570554880")

    while True:
        print("\nChọn một chức năng:")
        print("[1] Tìm kiếm video")
        print("[2] Lấy video từ danh sách yêu thích")
        print("[exit] Thoát")
        choice = input("Lựa chọn của bạn: ").strip()

        if choice == "1":
            keyword = input("Nhập từ khóa tìm kiếm: ").strip()
            if not keyword:
                continue

            search_results = client.search_video(keyword)
            if search_results and search_results.get("result"):
                video_list = search_results["result"]
                display_videos(video_list, f"kết quả tìm kiếm '{keyword}'")

                try:
                    vid_choice_str = input(
                        "Chọn video để lấy link download (nhập 0 để quay lại): "
                    ).strip()
                    if not vid_choice_str or vid_choice_str == "0":
                        continue
                    vid_choice = int(vid_choice_str) - 1

                    selected_video = video_list[vid_choice]
                    bvid = selected_video.get("bvid")

                    # Cần lấy CID từ thông tin chi tiết của video
                    info = client.get_video_info(bvid)
                    if info and "cid" in info:
                        cid = info["cid"]
                        download_info = client.get_download_urls(bvid, cid)
                        if download_info:
                            display_download_info(download_info)
                    else:
                        print(f"❌ Không thể lấy CID cho video {bvid}.")

                except (ValueError, IndexError):
                    print("Lựa chọn không hợp lệ.")

        elif choice == "2":
            if not client.user_mid:
                print(
                    "❌ Chức năng này yêu cầu cookie đã đăng nhập. Vui lòng khởi động lại và nhập cookie."
                )
                continue

            # Mặc định lấy thư mục yêu thích đầu tiên
            default_fav_id = client.user_mid
            fav_results = client.get_fav_list(default_fav_id)
            if fav_results and fav_results.get("medias"):
                video_list = fav_results["medias"]
                display_videos(video_list, "danh sách yêu thích")

                try:
                    vid_choice_str = input(
                        "Chọn video để lấy link download (nhập 0 để quay lại): "
                    ).strip()
                    if not vid_choice_str or vid_choice_str == "0":
                        continue
                    vid_choice = int(vid_choice_str) - 1

                    selected_video = video_list[vid_choice]
                    bvid = selected_video.get("bvid")
                    cid = selected_video.get("cid")  # API yêu thích trả về sẵn CID

                    download_info = client.get_download_urls(bvid, cid)
                    if download_info:
                        display_download_info(download_info)

                except (ValueError, IndexError):
                    print("Lựa chọn không hợp lệ.")

        elif choice.lower() == "exit":
            break
        else:
            print("Lựa chọn không hợp lệ, vui lòng nhập 1, 2 hoặc exit.")

    print("\n👋 Tạm biệt!")


if __name__ == "__main__":
    main()
