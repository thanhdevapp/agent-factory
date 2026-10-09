# AGMon - Claude Code & Agent Development Guidelines

Tài liệu này cung cấp hướng dẫn kiến trúc, danh mục lệnh, và bộ quy tắc kỹ thuật nghiêm ngặt dành cho lập trình viên và các tác nhân AI (Claude Code, Antigravity) làm việc trên dự án **AGMon (Agent Factory)**.

---

## 1. Tổng quan Dự án & Ngăn xếp Công nghệ

**AGMon (Agent Factory)** là nền tảng giám sát đa tác nhân AI (Multi-Agent Realtime Monitor) theo thời gian thực mô phỏng giao diện VS Code Workbench và văn phòng ảo 2D (Pixi.js) dành cho **Google Antigravity CLI/App** và **Claude Code**.

* **Framework**: Next.js 16.4.0 (App Router), Turbopack
* **Ngôn ngữ & Thư viện**: React 19, JavaScript (ESM), Tailwind CSS
* **Đồ hoạ Canvas**: PixiJS v8 (WebGL 2D Sprite & Particle Engine)
* **Icons**: `lucide-react` (Bộ icon duy nhất được phép sử dụng)
* **Giao tiếp Realtime**: Server-Sent Events (SSE) theo dõi trực tiếp các tệp log và transcript tại `~/.gemini/antigravity-cli/brain/` và `~/.claude/`

---

## 2. Danh mục Lệnh thường dùng

* `npm run dev`: Chạy máy chủ phát triển Next.js với Turbopack trên cổng `3030`.
* `npm run build`: Kiểm tra và build bản production (Bắt buộc chạy để xác minh không có lỗi cú pháp, lint hoặc kiểu dữ liệu trước khi commit).
* `npm run start`: Khởi chạy bản build production trên cổng `3030` thông qua `server.js`.
* `npm run publish`: Tự động tăng patch version (`npm version patch`), build production (`next build`), publish gói công khai lên npmjs (`npm publish --access public`) và đẩy commit cùng git tag lên GitHub (`git push origin main --tags`).

### Lệnh CLI `agmon` (sau khi cài đặt hoặc qua `bin/cli.js`)
* `agmon list`: Hiển thị bảng ASCII danh sách các phiên agent đang hoạt động kèm PID, thư mục làm việc, công cụ đang gọi.
* `agmon launch <agent> [prompt]`: Khởi chạy nhanh tác nhân (`antigravity`, `claude`, `codex`) ngay tại thư mục hiện tại.
* `agmon kill <pid>`: Kết thúc an toàn tiến trình agent đang chạy hoặc bị treo.
* `agmon watch <dir>`: Thêm thư mục dự án vào danh sách theo dõi hoạt động.
* `agmon start` / `agmon stop` / `agmon status`: Quản lý tiến trình daemon chạy ngầm.
* `agmon autostart enable` / `disable`: Cấu hình tự động khởi động cùng hệ điều hành (macOS LaunchAgent / Linux systemd).

---

## 3. Kiến trúc Thư mục

* `bin/cli.js`: Điểm vào (Entry point) của công cụ dòng lệnh CLI `agmon`.
* `server.js`: Custom server hỗ trợ chạy cả Next.js và API độc lập.
* `src/app/`: Các tuyến đường App Router Next.js và API endpoints:
  * `/api/traces/stream`: Tuyến SSE truyền tải telemetry agents theo thời gian thực.
  * `/api/sessions/[id]/transcript`: Bóc tách toàn bộ hội thoại và tool calls của phiên.
  * `/api/reports/tokens`: Tổng hợp thống kê chi phí, model và tokens.
  * `/api/project/scripts`: Quét và trả về danh sách npm scripts từ `package.json` dự án.
  * `/api/project/run-script`: Thực thi script dự án và stream output trực tiếp qua SSE.
  * `/api/workspace/files`: Duyệt cây thư mục mã nguồn của workspace đang được quan sát.
  * `/api/workspace/file-content`: Đọc nội dung tệp tin mã nguồn có kiểm tra an toàn đường dẫn.
  * `/api/handoff`: Chuyển giao mở nhanh dự án trong terminal/editor bản địa (Ghostty, iTerm2, VS Code, Cursor...).
  * `/api/version`: Kiểm tra phiên bản ứng dụng hiện tại.
  * `/reports`: Trang báo cáo phân tích độc lập.
  * `/store`: Cửa hàng Cosmetics Store và trang bị vật phẩm.
* `src/components/layout/`: Bộ khung giao diện VS Code Workbench (`TitleBar`, `ActivityBar`, `LeftSidebar`, `RightSidebar`, `BottomPanel`, `EditorTabs`, `StatusBar`, `VSCodeWorkbench`).
* `src/components/terminal/`: Terminal WebGL tích hợp drawer (`WebTerminalDrawer.jsx`, `@xterm/addon-webgl`, hardware acceleration).
* `src/components/factory/`: Văn phòng ảo 2D (`office-canvas.js`, `office-scene.js`, các sprite nhân vật, bàn làm việc, đường truyền tokens) và đồ thị phân rã nhiệm vụ đa tác nhân (`AgentGraphView.jsx`).
* `src/components/chat/`: Hộp thoại tương tác phiên (`SessionChatModal.js`, `ChatMessageItem.js`, `ToolCallCard.js`, `ContextGauge.js`, `DiffViewer.js`).
* `src/components/replay/`: Cỗ máy tua lại hành trình phiên làm việc (`TimeMachineToolbar.jsx`, `ReplayEventInspector.jsx`, `ReplayModeOverlay.jsx`).
* `src/components/reports/`: Giao diện báo cáo phân tích Token & Chi phí (`TokenReportView.jsx`).
* `src/lib/watchers/`: Trình giám sát hệ thống tệp local (`watcherManager.js`, `antigravityWatcher.js`, `claudeWatcher.js`).
* `src/lib/parsers/`: Các bộ phân tích định dạng transcript và log (`antigravityParser.js`, `claudeParser.js`, `replayParser.js`, `hierarchyParser.js`).

---

## 4. Bộ Quy tắc Bắt buộc Khi Phát triển (Development Rules)

### 4.1. Quy tắc UI & Icons
1. **Tuyệt đối cấm sử dụng raw emoji**: Không được chèn ký tự unicode emoji thô trong JSX/HTML (ví dụ: `🤖`, `🔊`, `🔇`, `🔔`, `🔕`, `📱`, `⚡`, `💬`, `👤`, `🛠️`, `🧠`, `📟`, `ℹ️`, `⚠️`, `❌`, `🚀`...).
2. **Luôn sử dụng `lucide-react`**: Sử dụng icon component chính danh kèm kích thước và màu sắc nhất quán (`w-3.5 h-3.5`, `w-4 h-4`).
3. **Canvas Scaling**: Canvas không tự động scale phóng to vượt quá 100% (1:1) khi kích thước màn hình lớn. Không gian màn hình rộng dùng để mở rộng tầm nhìn văn phòng (xem được nhiều bàn làm việc hơn).

### 4.2. Hiệu năng & Ứng dụng chạy thời gian dài (Long-Running Stability)
1. **React Key phải ổn định**:
   * Tuyệt đối không dùng `Date.now()` hoặc pure array `index` làm key cho các danh sách nhận dữ liệu SSE định kỳ (như log lines, terminal entries).
   * Luôn dùng composite key ổn định: `${connId}-${item.timestamp || idx}-${idx}` hoặc Entity ID duy nhất để ngăn chặn React huỷ và tạo lại DOM vô cớ (DOM Thrashing).
2. **Giới hạn bộ nhớ & DOM (Bounded Memory & DOM Bloat)**:
   * Danh sách log realtime trong `BottomPanel` hoặc `SessionChatModal` phải được cap tối đa (ví dụ 200 - 250 bản ghi mới nhất qua `.slice(-250)`).
   * Bảng dữ liệu lớn (như Session Table trong `TokenReportView`) phải có phân trang bắt buộc (25 / 50 / 100 / 200 dòng mỗi trang), không bao giờ render hàng nghìn thẻ `<tr>` đồng thời.
3. **Tránh Serialization nặng trên Main Thread**:
   * Không gọi `JSON.stringify(largePayload, null, 2)` trực tiếp trong thân render JSX của các tab re-render liên tục.
   * Luôn bọc trong `useMemo`, chỉ chạy khi tab đó đang active và giới hạn slice số lượng phần tử xem trước.
4. **Thu dọn bộ nhớ (Garbage Collection) cho State tích luỹ**:
   * Các `useRef` kiểu `new Map()` dùng để lưu trạng thái phiên (như trigger chuông âm thanh cảnh báo, sound alarms) phải có cơ chế quét dọn (`GC cleanup`) khi kích thước Map vượt ngưỡng (> 100), xóa các ID phiên đã kết thúc.
5. **Chống Overlapping Polling & Rò rỉ Request**:
   * Trong các hook polling định kỳ (như `useSessionTranscript`), phải có cờ `isFetchingRef` ngăn chặn request trùng lặp và sử dụng `AbortController` để huỷ bỏ request đang bay khi đổi phiên hoặc unmount.
6. **Bảo vệ WebGL & PixiJS Context**:
   * Luôn gọi `e.preventDefault()` khi bắt sự kiện `webglcontextlost` để trình duyệt không loại bỏ vĩnh viễn GPU context.
   * Khi bắt `webglcontextrestored`, không gọi `app.render()` đồng bộ ngay lập tức (tránh lỗi `INVALID_ENUM: texParameter`). Sử dụng rebuild có độ trễ qua `setTimeout`.
   * Trong hàm `destroy()`, gỡ bỏ sạch sẽ toàn bộ event listeners trên `window` và `canvas`, dừng ticker để không rò rỉ bộ nhớ.

---

## 5. Quy trình Kiểm thử & Commit

* Trước khi commit mã nguồn, luôn chạy:
  ```bash
  npm run build
  ```
  để đảm bảo không có cảnh báo nghiêm trọng hoặc lỗi build.
* Sử dụng quy chuẩn Conventional Commits cho thông điệp commit:
  - `feat:` Tính năng mới
  - `fix:` Sửa lỗi
  - `perf:` Tối ưu hiệu năng, giảm giật lag, chống rò rỉ bộ nhớ
  - `docs:` Cập nhật tài liệu kỹ thuật
