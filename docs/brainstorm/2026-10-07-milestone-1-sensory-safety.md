# 🧠 Thiết Kế Kỹ Thuật AGMon v0.2.0: The Sensory & Safety Update

**Ngày tạo:** 2026-10-07  
**Dự án:** `agmon` (Agent Monitor)  
**Phiên bản mục tiêu:** `v0.2.0`  
**Tác giả:** Brainstorming Session with Antigravity  

---

## 1. Tóm Tắt & Mục Tiêu

Milestone 1 tập trung biến **AGMon** từ một bảng theo dõi thụ động thành **hệ thống giám sát giác quan & an toàn chủ động** dành cho lập trình viên sử dụng AI Agent (Claude Code CLI & Antigravity CLI).

### 4 Trụ cột cốt lõi:
1. **Web Audio Chiptune Synthesizer (0 Byte Audio Assets):** Tạo âm thanh gõ phím, chuông hoàn thành và còi cảnh báo bằng Web Audio API thuần mà không tốn dung lượng file MP3.
2. **Cảnh báo Agent ngáo đá (Runaway Loop Detection):** Phát hiện và hiển thị hoạt họa bốc khói/đèn cảnh báo khi Agent bị kẹt loop công cụ lặp lại liên tiếp.
3. **Live Terminal Log Peek:** Cửa sổ xem trực tiếp 20-25 dòng lịch sử lệnh Bash, file edit, prompt mới nhất trong Drawer bên phải.
4. **Desktop Push Notification:** Thông báo native OS khi agent hoàn thành công việc hoặc cần user bấm Approve/Input.

---

## 2. Thiết Kế Kiến Trúc & Chi Tiết Triển Khai

### 2.1. Web Audio Synthesizer (`src/lib/soundFx.js`)
- **Triết lý:** Không dùng file MP3/WAV để giữ package siêu nhẹ (< 3.5MB). Dùng `AudioContext` tạo sóng âm Oscillator (sine, square, sawtooth).
- **Âm thanh hỗ trợ:**
  - `playTick()`: Click gõ phím lách cách tần số cao (3ms burst) khi agent sinh token.
  - `playComplete()`: Chuông 2 nốt hòa âm C5 -> G5 vui nhộn khi task kết thúc thành công (`Done`).
  - `playAlarm()`: Âm thanh 3 xung cảnh báo khẩn cấp khi gặp lỗi Rate Limit, Quota hoặc Runaway Loop.
  - `playNeedInput()`: Âm báo 2 nốt thanh thoát khi Agent cần người dùng phê duyệt lệnh Bash/Tool call.
- **UX Controls:**
  - Mặc định: `Muted` lần đầu để tuân thủ chính sách Autoplay của trình duyệt.
  - Nút Loa 🔊/🔇 trên Header với trạng thái lưu trong `localStorage`.

### 2.2. Thuật toán phát hiện Runaway Loop (`src/lib/traceContract.js`)
- **Cơ chế:** Trong mỗi session của Antigravity/Claude, theo dõi mảng `recentTools` (sliding window 10 sự kiện gần nhất).
- **Điều kiện kích hoạt:**
  - Cùng 1 loại tool (ví dụ `Bash` chạy test liên tục hoặc `Edit` lặp file) lặp lại $\ge 5$ lần trong vòng 60 giây.
  - Hoặc số token output nhảy vọt $> 100k$ token trong 1 bước duy nhất.
- **Trạng thái:** Gán cờ `isLooping = true` trên record của workstation.

### 2.3. Hiệu ứng Hoạt họa Pixi.js (`src/components/factory/scene/characters.js`)
- Khi `isLooping = true`:
  - **Bàn làm việc:** Viền bàn phát sáng nhấp nháy màu đỏ cam (#ef4444).
  - **Khói bốc trên đầu:** Container hạt khói (3-4 cụm hạt Graphics xám nhạt) bay lên và mờ dần (alpha tween).
  - **Biểu cảm Robot:** Mắt robot chuyển thành hình xoáy ốc `@_@` hoặc biểu tượng cảnh báo `⚠️`.

### 2.4. Live Terminal Log Peek (`src/components/factory/AgentPanel.js`)
- Thêm Tab chuyển đổi giữa **"Metrics & Telemetry"** và **"Live Terminal Logs"**.
- Tab Live Logs render khung hiển thị dạng terminal dark mode (monospaced font `JetBrains Mono / Menlo`):
  - Dòng thời gian `[HH:mm:ss]`.
  - Loại hành động: `[BASH]`, `[EDIT]`, `[SEARCH]`, `[PROMPT]`.
  - Chi tiết đối số: Tên file đã sửa, câu lệnh CLI đã chạy, kết quả exit code.
  - Tự động cuộn xuống cuối (Auto-scroll to bottom).

### 2.5. Native OS Desktop Notification (`src/lib/notifications.js`)
- Gọi `Notification.requestPermission()` khi người dùng bật thông báo.
- Gửi thông báo hệ thống:
  - *"🤖 Agent [tên_project] đã hoàn thành nhiệm vụ!"*
  - *"⚠️ Agent [tên_project] cần bạn phê duyệt lệnh trong terminal!"*
- Khi người dùng click vào thông báo: Tự động `window.focus()` vào tab AGMon và chọn đúng bàn của Agent đó.

---

## 3. Đánh Giá Rủi Ro & Giải Pháp Kỹ Thuật

| Rủi ro | Mức độ | Giải pháp |
|--------|--------|-----------|
| Âm thanh gây khó chịu nếu kêu quá nhiều | Cao | Thêm cơ chế Debounce / Cooldown (tiếng tick gõ phím tối đa 3 lần/giây; tiếng chuông hoàn thành chỉ kêu 1 lần cho mỗi chuyển đổi trạng thái). |
| Trình duyệt chặn âm thanh tự động (Autoplay Policy) | Trung bình | Yêu cầu tương tác click đầu tiên của người dùng để kích hoạt AudioContext (`audioCtx.resume()`). |
| Hiệu ứng khói hạt Pixi.js làm tụt FPS | Thấp | Tái sử dụng Object Pooling cho các hạt khói Pixi.js, tối đa 10 hạt cùng lúc. |
| Log quá dài gây tốn RAM browser | Thấp | Giới hạn tối đa 50 dòng sự kiện gần nhất cho mỗi Agent trong bộ nhớ RAM. |

---

## 4. Kế Hoạch Kiểm Thử & Tiêu Chí Nghiệm Thu (Acceptance Criteria)

1. **Âm thanh:** Bật toggle loa -> Nghe rõ tiếng click khi gõ phím, chuông ting khi hoàn thành task. Không có file MP3 nào trong gói bundle.
2. **Loop Alert:** Chuyển sang Preset `errors` -> Robot lập tức bốc khói, đổi mắt xoáy, còi kêu và viền đỏ xuất hiện.
3. **Logs:** Click vào bàn Agent đang chạy -> Tab Live Logs hiển thị danh sách lệnh thật từ file transcript/session.
4. **Build & Package:** Chạy `npm run prepack` -> Package size vẫn duy trì dưới 3.5MB, `next start` hoạt động trơn tru.
