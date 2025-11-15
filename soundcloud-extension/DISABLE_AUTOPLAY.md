# Cách Tắt Autoplay Policy và GPU Process Trong Chrome

---

# PHẦN 1: TẮT AUTOPLAY POLICY

## Phương pháp 1: Chrome Flags (Đơn giản nhất)

1. Mở Chrome và vào: `chrome://flags`
2. Tìm: **"Autoplay policy"**
3. Đổi sang: **"No user gesture is required"**
4. Click **"Relaunch"**

## Phương pháp 2: Command Line Flags (Cho testing/development)

### Windows
Tạo shortcut với target:
```
"C:\Program Files\Google\Chrome\Application\chrome.exe" --autoplay-policy=no-user-gesture-required
```

### Hoặc tắt hoàn toàn:
```
"C:\Program Files\Google\Chrome\Application\chrome.exe" --autoplay-policy=no-user-gesture-required --disable-features=PreloadMediaEngagementData,AutoplayIgnoreWebAudio
```

### Linux/Mac
```bash
google-chrome --autoplay-policy=no-user-gesture-required
```

## Phương pháp 3: Site Settings (Cho từng trang cụ thể)

1. Vào trang web (ví dụ: soundcloud.com)
2. Click vào **icon khóa** bên trái URL
3. Click **"Site settings"**
4. Tìm **"Sound"**
5. Đổi sang: **"Allow"**

## Phương pháp 4: Chrome Policy (Cho doanh nghiệp/nhiều máy)

1. Tạo file: `C:\Program Files\Google\Chrome\Application\master_preferences`
2. Thêm nội dung:
```json
{
  "homepage": "about:blank",
  "distribution": {
    "skip_first_run_ui": true,
    "show_welcome_page": false,
    "import_bookmarks": false,
    "import_history": false,
    "import_home_page": false,
    "import_search_engine": false
  },
  "browser": {
    "custom_chrome_frame": false
  },
  "default_content_settings": {
    "popups": 1,
    "geolocation": 1,
    "media_stream_mic": 1,
    "media_stream_camera": 1
  },
  "policy": {
    "AutoplayAllowed": true
  }
}
```

## Kiểm tra xem đã tắt thành công chưa

Mở Console và chạy:
```javascript
document.createElement('audio').play().then(() => {
    console.log('✅ Autoplay ENABLED - Không cần user gesture');
}).catch(() => {
    console.log('❌ Autoplay BLOCKED - Vẫn cần user gesture');
});
```

## Lưu ý

- **Phương pháp 1 và 2** chỉ apply cho profile Chrome hiện tại
- Cần restart Chrome sau khi thay đổi
- Nếu update Chrome, có thể phải setting lại
- Chỉ nên tắt khi testing/development, không nên dùng cho browsing thường ngày

---

# PHẦN 2: TẮT GPU PROCESS (Hardware Acceleration)

## Tại sao cần tắt GPU?

- Giảm RAM usage
- Fix lỗi rendering (màn hình nhấp nháy, glitch)
- Tương thích với Remote Desktop/VNC
- Chạy trên máy ảo không có GPU
- Tiết kiệm pin laptop
- Fix crash trên một số card đồ họa

## Phương pháp 1: Chrome Settings (Đơn giản)

1. Vào: `chrome://settings/system`
2. Tắt: **"Use hardware acceleration when available"**
3. Click **"Relaunch"**

## Phương pháp 2: Command Line Arguments (Tắt hoàn toàn)

### Tắt GPU cơ bản:
```cmd
"C:\Program Files\Google\Chrome\Application\chrome.exe" --disable-gpu
```

### Tắt GPU + Autoplay (Kết hợp cả 2):
```cmd
"C:\Program Files\Google\Chrome\Application\chrome.exe" --disable-gpu --autoplay-policy=no-user-gesture-required
```

### Tắt GPU toàn diện (Recommended):
```cmd
"C:\Program Files\Google\Chrome\Application\chrome.exe" ^
  --disable-gpu ^
  --disable-gpu-compositing ^
  --disable-gpu-rasterization ^
  --disable-gpu-sandbox ^
  --disable-software-rasterizer ^
  --disable-features=VaapiVideoDecoder
```

### Dành cho máy yếu/VM (Tối ưu hiệu năng):
```cmd
"C:\Program Files\Google\Chrome\Application\chrome.exe" ^
  --disable-gpu ^
  --disable-gpu-compositing ^
  --disable-software-rasterizer ^
  --disable-dev-shm-usage ^
  --no-sandbox ^
  --disable-setuid-sandbox ^
  --disable-accelerated-2d-canvas ^
  --disable-accelerated-video-decode
```

### Kết hợp tất cả cho Extension Testing:
```cmd
"C:\Program Files\Google\Chrome\Application\chrome.exe" ^
  --disable-gpu ^
  --disable-gpu-compositing ^
  --autoplay-policy=no-user-gesture-required ^
  --disable-features=PreloadMediaEngagementData,AutoplayIgnoreWebAudio ^
  --disable-web-security ^
  --user-data-dir="C:\chrome-dev-profile"
```

## Phương pháp 3: Chrome Flags

Vào: `chrome://flags` và tìm:

### Tắt GPU Compositing:
```
chrome://flags/#disable-gpu-compositing
```
→ Đổi sang: **Disabled**

### Tắt Hardware Acceleration:
```
chrome://flags/#disable-accelerated-video-decode
```
→ Đổi sang: **Disabled**

## Phương pháp 4: Tạo Shortcut Riêng (Windows)

1. **Chuột phải Desktop** → New → Shortcut
2. **Target:**
```
"C:\Program Files\Google\Chrome\Application\chrome.exe" --disable-gpu --autoplay-policy=no-user-gesture-required --user-data-dir="C:\chrome-dev"
```
3. **Đặt tên:** "Chrome Dev (No GPU + Autoplay)"
4. Click **OK**

## Kiểm tra GPU Status

### Cách 1: Chrome GPU Info
```
chrome://gpu
```
Xem dòng: **"Graphics Feature Status"**
- Nếu tắt thành công: sẽ thấy nhiều dòng **"Software only, hardware acceleration disabled"**

### Cách 2: Task Manager
1. **Shift + Esc** (Chrome Task Manager)
2. Xem cột **"GPU Memory"**
3. Nếu = 0 hoặc không hiển thị → GPU đã tắt ✅

### Cách 3: Console Check
```javascript
// Paste vào Console
console.log('GPU Vendor:', (function() {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return 'GPU Disabled ✅';
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    return debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'Unknown';
})());
```

## Các Flags GPU Khác (Nâng cao)

```cmd
--disable-gpu                           # Tắt GPU process hoàn toàn
--disable-gpu-compositing              # Tắt GPU compositing
--disable-gpu-rasterization            # Tắt GPU rasterization
--disable-gpu-sandbox                  # Tắt GPU sandbox
--disable-software-rasterizer          # Tắt software rasterizer
--disable-accelerated-2d-canvas        # Tắt Canvas 2D acceleration
--disable-accelerated-video-decode     # Tắt video decode acceleration
--disable-accelerated-mjpeg-decode     # Tắt MJPEG decode acceleration
--use-gl=swiftshader                   # Dùng SwiftShader (software GL)
--use-gl=disabled                      # Tắt OpenGL
--use-angle=disabled                   # Tắt ANGLE
```

## Khi nào nên tắt GPU?

✅ **NÊN tắt khi:**
- Chạy trên Remote Desktop/VNC
- Máy ảo không có GPU passthrough
- Gặp lỗi crash, flickering, artifact
- Card đồ họa cũ/không tương thích
- Muốn tiết kiệm RAM/Pin
- Testing extension không cần render phức tạp

❌ **KHÔNG NÊN tắt khi:**
- Chơi game, xem video 4K
- Dùng WebGL, Canvas phức tạp
- Cần hiệu năng cao cho web app
- Máy có GPU mạnh

## Benchmark: GPU vs Software Rendering

| Tác vụ | GPU Enabled | GPU Disabled |
|--------|-------------|--------------|
| Load trang web thường | ~500ms | ~700ms |
| Scroll mượt | 60 FPS | 30-45 FPS |
| Video 1080p | Mượt | Giật nhẹ |
| Canvas animation | 60 FPS | 15-30 FPS |
| RAM usage | +200-500MB | Baseline |

## Lưu ý

- Tắt GPU sẽ làm **giảm hiệu năng rendering**
- Scroll, animation có thể **lag hơn**
- Video 4K/WebGL sẽ **chậm đáng kể**
- Nhưng **giảm RAM** và **tăng tính ổn định** trên máy yếu
- **Restart Chrome** sau khi thay đổi
