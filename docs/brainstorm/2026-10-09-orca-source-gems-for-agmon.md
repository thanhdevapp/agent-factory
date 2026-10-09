# Hồ Sơ Bóc Tách Mã Nguồn Orca ADE: Các Tiện Ích & Phương Thức Kỹ Thuật Có Thể Góp Nhặt Cho AGMon

**Ngày lập:** 2026-10-09  
**Nguồn kiểm chứng:** Mã nguồn chính thức từ repo [`stablyai/orca`](https://github.com/stablyai/orca) (Commit nhánh `main`, clone trực tiếp tại `scratch/orca-src/`)  
**Mục tiêu:** Khai thác các kỹ thuật ngầm, tiện ích nhỏ, giải pháp cấu hình và cơ chế thực thi đã được kiểm chứng thực tế trong codebase của Orca để chắt lọc và áp dụng cho [`agmon`](file:///Volumes/T9/Projects/agent-factory).  

---

## 1. Cơ Chế Bắt Trạng Thái Realtime Qua `statusLine` Của Claude Code

- **Tệp nguồn kiểm chứng:** [`src/main/claude/statusline-script.ts`](file:///Volumes/T9/Projects/agent-factory/scratch/orca-src/src/main/claude/statusline-script.ts)
- **Vấn đề thực tế:** API lấy hạn mức (Usage/Rate Limits) của Anthropic Claude có giới hạn lượt gọi (rate limit) rất nghiêm ngặt. Nếu gọi thăm dò liên tục qua OAuth endpoint sẽ nhanh chóng bị chặn (HTTP 429).
- **Tuyệt chiêu kỹ thuật của Orca:**
  - Claude Code CLI tích hợp sẵn cơ chế cấu hình lệnh `statusLine`. Trên **mỗi lượt phản hồi (turn)** của agent, Claude Code tự động đổ cấu trúc JSON chứa đầy đủ `rate_limits` vào luồng `stdin` của lệnh `statusLine`.
  - Orca viết một đoạn script mỏng (`getManagedStatusLineScript`) chèn vào cấu hình của Claude:
    ```bash
    # Đọc stdin từ Claude Code đổ vào file tạm
    %WINDOWS_HOOK_STDIN_READER% > "%ORCA_STATUSLINE_PAYLOAD_FILE%" 2>nul
    # Kiểm tra xem có trường "rate_limits" hay không
    findstr.exe /c:\"rate_limits\" "%ORCA_STATUSLINE_PAYLOAD_FILE%"
    # Gửi POST về port nội bộ cục bộ của Orca kèm token bảo mật
    curl -X POST http://127.0.0.1:%ORCA_AGENT_HOOK_PORT%/api/statusline -d @...
    ```
  - **Điểm tinh tế:** Script này **không in ra bất kỳ ký tự nào ra stdout**, do đó giao diện thanh trạng thái trong terminal của người dùng hoàn toàn không bị xáo trộn.
- **Khả năng góp nhặt cho AGMon:**
  - `agmon` có thể tích hợp sẵn script này. Thay vì chỉ đọc thụ động file JSONL lịch sử, `agmon` nhận được chỉ số token quota và hạn mức 5 giờ của Claude ngay tức thì với độ trễ bằng 0.

---

## 2. Tiết Kiệm SSD & Khởi Tạo Worktree Siêu Tốc Bằng Symlink (`worktree.sharedDirectories`)

- **Tệp nguồn kiểm chứng:** [`src/main/git/worktree-shared-directories.ts`](file:///Volumes/T9/Projects/agent-factory/scratch/orca-src/src/main/git/worktree-shared-directories.ts) & [`src/shared/orca-yaml-hook-types.ts`](file:///Volumes/T9/Projects/agent-factory/scratch/orca-src/src/shared/orca-yaml-hook-types.ts)
- **Vấn đề thực tế:** Khi chạy 5 agent trên 5 Git worktree, nếu mỗi worktree phải chạy `npm install` hoặc copy thư mục `node_modules`, máy tính sẽ tốn từ 5GB - 15GB SSD và mất từ 1-3 phút nghẽn I/O ổ đĩa.
- **Giải pháp của Orca trong `orca.yaml`:**
  ```yaml
  worktree:
    sharedDirectories:
      - node_modules
      - .cache
      - .venv
  ```
  - Khi tạo worktree mới, Orca không copy hay install lại: nó tự động tạo **Symlink** trỏ từ thư mục chính sang thư mục của worktree mới.
  - **Quy tắc an toàn (Sanity Guard):** Orca chỉ cho phép symlink những thư mục **thực sự tồn tại** và **nằm trong `.gitignore`**. Nếu symlink một thư mục được Git theo dõi, Git sẽ báo lỗi dirty tree và tạo diff rác.
- **Khả năng góp nhặt cho AGMon:**
  - Đưa quy ước `worktree.sharedDirectories` này vào tài liệu hướng dẫn tối ưu cho người dùng `agmon`, giúp lập trình viên chạy nhiều agent song song với thời gian tạo môi trường dưới 200ms.

---

## 3. Tự Động Bắt Cổng Máy Chủ & URL Cục Bộ (`advertised-url-parsing.ts`)

- **Tệp nguồn kiểm chứng:** [`src/main/ports/advertised-url-parsing.ts`](file:///Volumes/T9/Projects/agent-factory/scratch/orca-src/src/main/ports/advertised-url-parsing.ts) & [`src/main/ports/advertised-url-watcher.ts`](file:///Volumes/T9/Projects/agent-factory/scratch/orca-src/src/main/ports/advertised-url-watcher.ts)
- **Cơ chế kỹ thuật:**
  - Một lớp xử lý buffer PTY (`PtyBuffer`) liên tục quét dòng chữ xuất hiện trong terminal để tìm regex:
    ```typescript
    const URL_CANDIDATE_PATTERN = /\bhttps?:\/\/[^\s<>"'`]+/gi
    ```
  - Lọc bỏ các mã màu terminal ANSI/OSC bằng các biểu thức chính quy chuyên biệt:
    ```typescript
    const OSC_PATTERN = /\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)/g
    const CSI_PATTERN = /\x1b\[[0-?]*[ -/]*[@-~]/g
    ```
  - Khi một agent chạy lệnh như `next dev` hoặc `vite`, terminal in ra `http://localhost:3000`. Bộ quét lập tức bắt được cổng này, xác thực bằng `new URL()`, liên kết với ID của worktree và kích hoạt:
    1. Hiển thị nút "Open App" trực tiếp trên thanh công cụ của agent.
    2. Tự động thiết lập đường truyền cổng (port forwarding) nếu chạy trên máy chủ SSH từ xa.
- **Khả năng góp nhặt cho AGMon:**
  - Khi một agent trong văn phòng pixel khởi chạy web server, trên bàn làm việc của nhân vật đó lập tức xuất hiện quả cầu web hoặc bong bóng hiển thị cổng `3000`. Lập trình viên chỉ cần click vào nhân vật là có thể mở ngay web app đang phát triển!

---

## 4. Hệ Thống Điều Hướng Sự Chú Ý Thông Minh (Attention System & Desktop Away State)

- **Tệp nguồn kiểm chứng:** [`src/renderer/src/attention/agent-attention-contract.ts`](file:///Volumes/T9/Projects/agent-factory/scratch/orca-src/src/renderer/src/attention/agent-attention-contract.ts) & [`src/main/notifications/desktop-away-state.ts`](file:///Volumes/T9/Projects/agent-factory/scratch/orca-src/src/main/notifications/desktop-away-state.ts)
- **Phân loại trạng thái cần chú ý (`AgentAttentionUnreadReason`):**
  - `'agent-completion'`: Agent đã hoàn tất toàn bộ chuỗi suy nghĩ và sửa code xong.
  - `'terminal-bell'`: Agent phát ra ký tự chuông terminal (ASCII Bell `\x07`), thường là lúc dừng lại yêu cầu người dùng phê duyệt câu hỏi hoặc cấp quyền ghi đè tệp.
  - `'manual-mark-unread'`: Người dùng tự đánh dấu để xem lại sau.
- **Cơ chế lọc thông báo chống làm phiền (`desktop-away-state.ts`):**
  ```typescript
  export const MOBILE_NOTIFICATION_AWAY_SECONDS = 180 // 3 phút
  export function readDesktopAwayState(monitor: IdleMonitor): boolean | undefined {
    const state = monitor.getSystemIdleState(MOBILE_NOTIFICATION_AWAY_SECONDS)
    if (state === 'locked' || state === 'idle') return true
    return monitor.getSystemIdleTime() >= MOBILE_NOTIFICATION_AWAY_SECONDS
  }
  ```
  - **Triết lý:** Nếu người dùng đang tích cực gõ phím trên máy tính, **tuyệt đối không gửi push notification làm phiền**. Chỉ khi máy tính bị khóa màn hình hoặc người dùng rời bàn phím quá 3 phút, hệ thống mới gửi thông báo ra ngoài.
- **Khả năng góp nhặt cho AGMon:**
  - AGMon có thể tận dụng logic này: Nếu tab trình duyệt đang focus, chỉ hiển thị bong bóng chat trên đầu nhân vật pixel; nếu dev chuyển sang tab khác hoặc khóa máy, mới kích hoạt Web Notification và âm thanh chuông báo.

---

## 5. Tự Động Nhận Diện Logo / Favicon Dự Án (`repo-icon-autodetect.ts`)

- **Tệp nguồn kiểm chứng:** [`src/main/repo-icon-autodetect.ts`](file:///Volumes/T9/Projects/agent-factory/scratch/orca-src/src/main/repo-icon-autodetect.ts)
- **Quy trình dò tìm đa tầng (Multi-tier Detection):**
  1. Đọc `package.json`: Lấy trường `homepage` $\rightarrow$ trích xuất favicon từ website của sản phẩm.
  2. Đọc Git Remote URL: Phân tích slug GitHub/GitLab $\rightarrow$ tải avatar của tổ chức/chủ sở hữu repo (`githubAvatarIcon`).
  3. Quét tệp tĩnh nội bộ: Tìm kiếm các tệp `favicon.ico`, `logo.svg`, `public/icon.png`, `apple-touch-icon.png` trong thư mục gốc.
- **Khả năng góp nhặt cho AGMon:**
  - Thay vì hiển thị các tòa nhà/phòng ban với icon thư mục chung chung, AGMon có thể tự động gắn logo chính thức của dự án lên biển hiệu phòng ban hoặc bảng tên trên bàn làm việc trong văn phòng ảo!

---

## 6. Bảng Điều Phối Cấu Hình Tác Vụ Dự Án (`orca.yaml` Hook Schema)

- **Tệp nguồn kiểm chứng:** [`src/shared/orca-yaml-hook-types.ts`](file:///Volumes/T9/Projects/agent-factory/scratch/orca-src/src/shared/orca-yaml-hook-types.ts)
- **Cấu trúc hoàn chỉnh của file cấu hình:**
  ```yaml
  scripts:
    setup: |
      pnpm install
      pnpm build
    archive: |
      git clean -df
  setupAgentStartupPolicy: wait-for-setup # hoặc 'start-immediately'
  defaultTabs:
    - title: "Dev Server"
      color: "#3b82f6"
      command: "pnpm dev"
    - title: "Test Watcher"
      color: "#10b981"
      command: "pnpm test:watch"
  worktree:
    sharedDirectories:
      - node_modules
      - .next/cache
  ```
- **Ý nghĩa thực tế:**
  - Chuẩn hóa toàn bộ vòng đời của một agent: Khi agent bắt đầu một task trên nhánh mới, môi trường được dựng tự động; các tab theo dõi kiểm thử được mở sẵn đúng vị trí.

---

## 7. Bảng Tổng Hợp Tiện Ích Đề Xuất Áp Dụng Ngay Cho AGMon

| Tiện Ích Orca | Tệp Nguồn Tham Chiếu | Cách Thức Triển Khai Vào AGMon | Độ Ưu Tiên |
| :--- | :--- | :--- | :--- |
| **Bắt Quota Claude qua StatusLine** | `src/main/claude/statusline-script.ts` | Bổ sung helper script tự động ghi nhận token usage tức thời từ stdin của Claude Code | **Cao (P1)** |
| **Nhận Diện Cổng Web Localhost** | `src/main/ports/advertised-url-parsing.ts` | Regex parser quét terminal log, gắn liên kết preview vào bàn làm việc của nhân vật pixel | **Cao (P1)** |
| **Tự Động Lấy Favicon/Logo Dự Án** | `src/main/repo-icon-autodetect.ts` | Hàm đọc `package.json` và thư mục `public/` để gán logo thật lên biển hiệu văn phòng | **Trung bình (P2)** |
| **Hệ Thống Lọc Thông Báo Idle** | `src/main/notifications/desktop-away-state.ts` | Sử dụng Page Visibility API + Idle timer để chỉ phát chuông/gửi thông báo khi dev vắng mặt | **Trung bình (P2)** |
| **Tối Ưu Worktree Shared Dirs** | `src/main/git/worktree-shared-directories.ts` | Hỗ trợ phát hiện và hiển thị các thư mục symlink giữa các worktree trong cùng một phòng | **Thấp (P3)** |
