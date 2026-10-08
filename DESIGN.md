# AGMon - Design Guidelines & UI Tokens

Tài liệu này quy định các tiêu chuẩn thiết kế UI/UX, Design Tokens, quy tắc sử dụng icon, hệ thống đồ họa 3D Isometric SVG, kiến trúc giao diện Supporter Store và hướng dẫn hiển thị cho dự án **AGMon (Agent Factory)**. Mọi lập trình viên và tác nhân AI khi xây dựng hoặc cập nhật giao diện đều phải tuân thủ nghiêm ngặt các quy tắc dưới đây.

---

## 1. Quy tắc cốt lõi về UI & Icon (Bắt buộc)

### 1.1. Tuyệt đối không sử dụng Raw Emoji / Unicode Symbol thô trong UI
* **Cấm**: Tuyệt đối không hardcode các ký tự unicode emoji thô trong mã JSX/HTML (ví dụ: `🤖`, `🔊`, `🔇`, `🔔`, `🔕`, `📱`, `⚡`, `💬`, `👤`, `🛠️`, `🧠`, `📟`, `ℹ️`, `⚠️`, `❌`, `🚀`, `✅`, `☕`, `🎨`...).
* **Lý do**: Emoji hiển thị không đồng nhất trên các hệ điều hành (macOS, Windows, Linux, iOS, Android), làm vỡ font metrics, phá vỡ tính chuyên nghiệp và thẩm mỹ chuẩn Developer Tooling của VS Code.
* **Quy chuẩn**: Luôn sử dụng icon component từ thư viện `lucide-react` hoặc file SVG vector tiêu chuẩn với kích thước, màu sắc và stroke nhất quán (`w-3.5 h-3.5`, `w-4 h-4`, stroke-width: 1.5 - 2).
* **Thông báo hệ thống (Notifications) & Export**: Trong title trình duyệt hoặc file markdown xuất ra, sử dụng text tag có cấu trúc (ví dụ: `[DONE]`, `[ALERT]`, `### User`, `### Assistant`, `[VIP]`).

### 1.2. Ngôn ngữ Giao diện Chuẩn (100% English UI Text)
* **Toàn bộ văn bản hiển thị trên giao diện người dùng phải bằng tiếng Anh (100% English)**:
  - Menu, tabs, buttons, tooltips, dialogs, badges, empty states.
  - Thông báo lỗi, toast messages, logs hiển thị trên terminal/console.
  - Tiêu đề, nhãn danh mục, mô tả item trong Supporter Store và Catalog.
* **Tài liệu kỹ thuật**: Các file markdown nội bộ (như `DESIGN.md`, `CLAUDE.md`) có thể dùng tiếng Việt để giải thích quy chuẩn, nhưng mọi mockup, text props, chuỗi giao diện phải là tiếng Anh chuẩn.

### 1.3. Quy tắc Canvas Scaling & Tỷ lệ hiển thị
* **Không tự động zoom vượt quá 100% (1:1 scale)**: Khi người dùng mở ứng dụng trên màn hình lớn hoặc siêu rộng (2K, 4K, UltraWide), Canvas Pixi.js không được tự ý scale phóng to vượt quá tỷ lệ tự nhiên 100%.
* **Mở rộng không gian hiển thị**: Màn hình lớn được tận dụng để hiển thị không gian văn phòng rộng hơn, hiển thị nhiều bàn làm việc của agents hơn ở tỷ lệ sắc nét từng pixel.
* **Điều khiển Pan & Zoom mượt mà**:
  - Hỗ trợ kéo chuột (Pan/Drag) tự do trong không gian văn phòng.
  - Cho phép người dùng chủ động zoom qua con lăn chuột hoặc nút điều khiển với khoảng giới hạn an toàn (`MIN_ZOOM = 0.2`, `MAX_ZOOM = 1.15` - `1.2`).
  - Hỗ trợ Double Click vào vùng trống hoặc nút *Reset Zoom* để tự động fit toàn bộ văn phòng vào khung nhìn (`fit to screen`).

### 1.4. Quy tắc Chế độ Cửa sổ & Trình bày (Windowing & Pin Mode - Cấm Popup thô)
* **Cấm Popup che khuất (No Blocking Popup Modals)**: Tuyệt đối không sử dụng modal popup lơ lửng chiếm toàn màn hình hoặc che khuất giao diện làm việc chính, gây gián đoạn việc giám sát canvas hoặc các tiến trình chạy nền.
* **Chỉ hỗ trợ 2 chế độ hiển thị linh hoạt**:
  - **Pinned Mode (Ghim vào Workbench Layout)**: Ghim trực tiếp vào Bottom Panel, Right Sidebar, hoặc mở như một Editor Tab chuẩn của VS Code Workbench, cho phép tương tác song song với các panel khác.
  - **Window Mode (Floating Window / Independent Window)**: Cửa sổ nổi chuyên dụng có thể kéo di chuyển (Draggable), thu nhỏ (Minimize), phóng to toàn màn hình (Maximize), hoặc di chuyển sang màn hình phụ mà không làm gián đoạn việc giám sát hệ thống.

---

## 2. Bảng màu & Design Tokens (VS Code Workbench Theme)

Giao diện AGMon được thiết kế theo phong cách VS Code Dark Modern với tông màu tối dễ chịu, tối ưu cho môi trường lập trình cường độ cao.

### 2.1. Màu nền & Bề mặt (Surfaces)
| Token / Mục đích | Giá trị Hex / Tailwind | Sử dụng |
| :--- | :--- | :--- |
| **Workspace Background** | `#181818` / `bg-[#181818]` | Nền chính của toàn bộ Workbench, viewport canvas |
| **Editor / Card Surface** | `#1e1e1e` / `bg-[#1e1e1e]` | Nền của các editor tabs, container card, modal body |
| **Sidebar & Header** | `#252526` / `bg-[#252526]` | Left sidebar, Right inspector, TitleBar, Tab headers |
| **Activity Bar** | `#181818` / `bg-[#181818]` | Thanh công cụ dọc ngoài cùng bên trái (48px) |
| **Hover / Active State** | `#2a2d2e` / `hover:bg-[#2a2d2e]` | Trạng thái hover của các hàng, danh sách |
| **Selection Highlight** | `#37373d` / `bg-[#37373d]` | Trạng thái item đang được chọn |
| **Subtle Overlay** | `bg-black/60 backdrop-blur-md` | Backdrop modal, drawer overlays |

### 2.2. Đường viền (Borders & Dividers)
* **Subtle Border**: `#2b2b2b` hoặc `#333333` (`border-neutral-800` / `border-[#2b2b2b]`) - phân chia panels, separators, tab borders.
* **Focused / Active Border**: `#007acc` hoặc `#38bdf8` (thể hiện focus state hoặc active tab).
* **Warning Border**: `#f59e0b/40` hoặc `#f43f5e/40` (thể hiện cảnh báo hoặc loop alert).
* **Card Outer Glow**: `shadow-[0_0_15px_rgba(0,0,0,0.5)]` kết hợp viền mờ `border-neutral-800/80`.

### 2.3. Màu điểm nhấn & Trạng thái Agent (Accents & State Colors)
* **VS Code Primary Accent**: `#007acc` / `#0062a3` (nút hành động chính, active indicator).
* **Streaming / Busy**: `#38bdf8` (Cyan) hoặc `#10b981` (Emerald) - Agent đang suy nghĩ / gọi công cụ / stream tokens.
* **Idle / Standby**: `#94a3b8` (Slate-400) - Agent nghỉ, chờ lệnh mới.
* **Error / Fault**: `#f43f5e` (Rose-500) - Lỗi thực thi, ngoại lệ API.
* **Loop Alert**: `#e11d48` (Rose-600) với hiệu ứng `animate-pulse` - Phát hiện vòng lặp vô tận (Runaway loop).
* **Cache Hit / Efficiency**: `#34d399` (Emerald-400) - Tỷ lệ Prompt Cache cao giúp tiết kiệm chi phí.

---

## 3. Hệ Thống 10 Themes Virtual Office (Floor Styles & Palettes)

Virtual Office hỗ trợ 10 phong cách nền sàn với bảng màu và ánh sáng môi trường riêng biệt:

| Theme ID | Tên hiển thị | Tông màu nền sàn | Màu lưới / Chỉ dẫn | Ánh sáng môi trường (Ambient) | Phân loại |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `theme_default` | **Classic Charcoal Slate** | `#14161a` (Dark Slate) | `#2d3548` (Slate-700) | `#38bdf8` (Sky blue glow) | FREE |
| `theme_cyberpunk` | **Cyberpunk Neon Night** | `#0d0819` (Deep Violet) | `#ff2a85` & `#00f0ff` | `#d946ef` (Neon Fuchsia) | FREE |
| `theme_matrix` | **Phosphor Matrix Terminal** | `#020d05` (Terminal Dark) | `#00ff66` (CRT Green) | `#10b981` (Phosphor Green) | FREE |
| `theme_wood` | **Cozy Scandinavian Loft** | `#1f1610` (Warm Walnut) | `#451a03` (Woodgrain) | `#f59e0b` (Warm Amber) | COFFEE |
| `theme_space` | **Deep Space Void** | `#030712` (Cosmic Black) | `#1e1b4b` (Indigo Grid) | `#6366f1` (Nebula Indigo) | COFFEE |
| `theme_blueprint` | **Blueprint CAD Grid** | `#0b1a30` (Architect Blue)| `#1d4ed8` (Blue Metric) | `#38bdf8` (Cyan Precision) | COFFEE |
| `theme_synthwave` | **Retro Synthwave 80s** | `#1a052e` (Sunset Purple) | `#d946ef` (Retro Magenta) | `#ec4899` (Sun Coral) | VIP |
| `theme_sakura_cyber` | **Sakura Cyber Garden** | `#1c0e18` (Obsidian Plum)| `#f43f5e` (Petal Rose) | `#fb7185` (Sakura Bloom) | VIP |
| `theme_nordic_ice` | **Minimalist Nordic Ice** | `#0f172a` (Glacial Deep) | `#38bdf8` (Frost Cyan) | `#e2e8f0` (Polar Glow) | VIP |
| `theme_industrial` | **High-Voltage Industrial** | `#18181b` (Hazard Zinc) | `#eab308` (Hazard Yellow) | `#f59e0b` (Amber Spark) | VIP |

### 3.1. Đồng bộ và Kích hoạt Theme (Theme Synchronization)
* Khi người dùng trang bị (Equip) một sàn mới trong Store:
  - Dữ liệu lưu ngay vào `localStorage` với key `agmon_supporter_data` (`equippedOfficeTheme`).
  - Phát sự kiện nội bộ `window.dispatchEvent(new CustomEvent('agmon:office-theme-change', { detail: { themeId } }))`.
  - Canvas Pixi.js (`office-canvas.js`) và Component Scene cập nhật lại Sprite/Graphics lưới sàn ngay lập tức mà không cần reload trang.

---

## 4. Typography & Hệ Thống Phông Chữ Toàn Cục

Typography trong AGMon được chuẩn hoá 100% về hệ thống biến CSS toàn cục và hỗ trợ chuyển đổi giao diện/phông chữ linh hoạt trong runtime theo chuẩn Design System của VS Code.

### 4.1. Hệ Thống Biến CSS Toàn Cục (Global CSS Variables)
Toàn bộ mã nguồn (CSS, Tailwind, Inline styles, SVG, Canvas) tuyệt đối không hardcode tên phông chữ cụ thể (như `Inter`, `-apple-system`, `monospace`). Phải sử dụng bộ biến chuẩn sau:

| Biến CSS | Giá trị Mặc định | Mục đích Sử dụng |
| :--- | :--- | :--- |
| `--font-family-ui` | `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` | Phông giao diện chính (UI sans-serif) |
| `--font-family-mono` | `ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace` | Phông mã nguồn, số liệu, tokens, lệnh (Monospace) |
| `--font-sans` | `var(--font-family-ui)` | Bí danh chuẩn Tailwind v4 `@theme` cho lớp `.font-sans` |
| `--font-mono` | `var(--font-family-mono)` | Bí danh chuẩn Tailwind v4 `@theme` cho lớp `.font-mono` |
| `--font-ui` | `var(--font-family-ui)` | Bí danh tương thích cho các component workbench |
| `--font-code` | `var(--font-family-mono)` | Bí danh tương thích cho editor và code blocks |
| `--font-size-ui` | `13px` | Cỡ chữ cơ sở của toàn bộ workbench |
| `--font-size-base` | `13px` | Bí danh cỡ chữ chuẩn |

### 4.2. Bảng Phông Chữ Tuyển Chọn & Chuyển Đổi Động (Dynamic Font Switching)
Hệ thống cung cấp danh mục phông chữ tuyển chọn và nạp sẵn qua Google Fonts CDN kèm `preconnect` trong `layout.js`:
* **UI Fonts (`AVAILABLE_UI_FONTS`)**:
  - `System Default`: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
  - `Inter`: `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
  - `Segoe UI`: `"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, sans-serif`
  - `Roboto`: `"Roboto", "Helvetica Neue", Arial, sans-serif`
  - `Geist Sans`: `"Geist Sans", "Geist", -apple-system, BlinkMacSystemFont, sans-serif`
* **Code Fonts (`AVAILABLE_CODE_FONTS`)**:
  - `System Monospace`: `ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace`
  - `JetBrains Mono`: `"JetBrains Mono", ui-monospace, Menlo, Consolas, monospace`
  - `Fira Code`: `"Fira Code", ui-monospace, Menlo, Consolas, monospace`
  - `Cascadia Code`: `"Cascadia Code", "Cascadia Mono", Consolas, monospace`
  - `Geist Mono`: `"Geist Mono", ui-monospace, Menlo, Consolas, monospace`

### 4.3. Quy Tắc Kế Thừa Phông Chữ Bắt Buộc cho Form Controls & HTML Elements
Do các phần tử HTML form gốc (`button`, `input`, `select`, `textarea`) mặc định trên trình duyệt không kế thừa phông chữ từ thẻ cha `body`, CSS toàn cục `globals.css` bắt buộc phải áp dụng quy tắc kế thừa:
```css
button,
input,
optgroup,
select,
textarea {
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
}

.font-mono, pre, code, kbd, samp {
  font-family: var(--font-family-mono) !important;
}

.font-sans {
  font-family: var(--font-family-ui) !important;
}
```

### 4.4. Quy Tắc Cho Canvas 2D / PixiJS & Monaco Editor
* **Môi trường Canvas 2D & PixiJS**:
  - Canvas 2D (`ctx.font = ...`) và PixiJS `Text({ style: { fontFamily } })` **không thể tự động phân giải** cú pháp CSS `var(...)`.
  - Bắt buộc phải sử dụng hàm tiện ích `getActiveFont("ui" | "mono")` từ `src/lib/themeStore.js` để lấy chuỗi phông thực tế đã được cấu hình.
  - Bắt buộc đăng ký sự kiện `THEME_CHANGE_EVENT` (`agmon:theme-change`) để tự động vẽ lại (re-render) chữ trên bàn làm việc, badge, và chỉ số khi người dùng đổi phông hoặc theme.
* **Monaco Code Editor (`CodeFileEditor.jsx`)**:
  - Tuyệt đối không hardcode font-family hay font-size dạng chuỗi tĩnh.
  - Sử dụng state động `editorFontFamily` và `editorFontSize` đồng bộ với `getActiveFont("mono")` và tự động cập nhật khi bắt được `THEME_CHANGE_EVENT`.

### 4.5. Quy Tắc Cho Đồ Họa Vector SVG & File Export
* **SVG Text Elements**: Mọi thẻ `<text>` trong SVG (như `FileIcon.jsx`, `Item3DRenderer.jsx`, `AgentGraphView.jsx`) phải sử dụng thuộc tính `fontFamily="var(--font-family-ui)"` hoặc `fontFamily="var(--font-family-mono)"`.
* **Sơ đồ Mermaid (`MermaidBlock.js`)**: Cấu hình `themeVariables.fontFamily` bằng `getActiveFont("mono")`.
* **File HTML Xuất Báo Cáo (`exportUtils.js`)**: Khi xuất báo cáo HTML độc lập, trang HTML phải khai báo các biến `--font-family-ui` và `--font-family-mono` trong `:root` để đảm bảo báo cáo hiển thị nhất quán trên mọi máy tính.

### 4.6. Phân Định Phạm Vi Áp Dụng (Usage Scopes)
1. **Monospace (`font-mono` / `var(--font-family-mono)`)**: Bắt buộc sử dụng cho:
   - Session IDs, Trace IDs, Process PIDs.
   - Số lượng Token (Input, Output, Cache, Total).
   - Chi phí tiền tệ (`$0.0150`).
   - Dấu mốc thời gian (`10:45:12`, `durationMs`).
   - Tên Models (`gemini-2.5-pro`, `claude-3-7-sonnet`).
   - Tên Tools (`run_command`, `replace_file_content`).
   - Mã phím tắt (`Cmd+Shift+P`, `Esc`, `/`).
   - Khối mã code và terminal logs.
2. **Sans-serif (`font-sans` / `var(--font-family-ui)`)**: Sử dụng cho tiêu đề bảng điều khiển, nhãn điều hướng, thông điệp hướng dẫn, nội dung hội thoại chat.

---

## 5. Chuẩn thiết kế Thành phần UI (Components)

### 5.1. Bảng dữ liệu (Tables)
* **Phân trang bắt buộc**: Mọi bảng dữ liệu tiềm năng có hàng trăm bản ghi (như Token Analytics) phải có phân trang (Pagination: 25 / 50 / 100 / 200). Không render toàn bộ vào DOM cùng lúc.
* **Sticky Header**: Tiêu đề cột luôn nhìn thấy khi cuộn trang, hỗ trợ click sắp xếp (Sortable) với icon `ArrowUpDown`.
* **Empty State**: Khi không có dữ liệu, hiển thị thông báo dịu mắt kèm gợi ý xóa bộ lọc, không dùng emoji.

### 5.2. Panel Điều Khiển & Cửa Sổ (Panels & Windows - Bỏ Popup thô)
* **Loại bỏ Popup che khuất**: Không sử dụng modal popup chặn tương tác giữa màn hình. Chuyển đổi toàn bộ hội thoại và thanh công cụ sang Pin hoặc Cửa sổ nổi.
* **Pin Mode**: Ghim vào Bottom Panel (`Terminal`, `Output`, `Problems`, `Chat`) hoặc mở thành một Editor Tab độc lập trong nhóm tabs chính.
* **Window Mode**: Hỗ trợ cửa sổ độc lập với backdrop mờ (`backdrop-blur-md bg-black/60`), có thể thu nhỏ (`Minimize2`), phóng to toàn màn hình (`Maximize2`), hoặc kéo sang màn hình phụ mà không làm gián đoạn việc giám sát hệ thống.
* Header và Footer luôn cố định (sticky), phần thân nội dung cuộn độc lập (`overflow-y-auto`).

### 5.3. Badge & Chip Tags
* Sử dụng kích thước chuẩn `xs` hoặc `sm` với padding cân đối (`px-2 py-0.5 rounded`).
* Phân biệt rõ danh mục và trạng thái:
  - **APP**: Tông màu tím (`bg-purple-950/80 border-purple-700/80 text-purple-300`).
  - **CLI**: Tông màu xanh ngọc (`bg-emerald-950/80 border-emerald-700/80 text-emerald-300`).
  - **FREE**: Tông màu ngọc lam (`bg-emerald-500/20 text-emerald-300 border-emerald-500/30`).
  - **COFFEE**: Tông màu vàng hổ phách (`bg-amber-500/20 text-amber-300 border-amber-500/30`).
  - **VIP SUPPORTER**: Tông vàng kim sang trọng (`bg-amber-500/20 text-amber-300 border-amber-500/40`).
  - **EQUIPPED**: Tông cyan nổi bật (`bg-cyan-500/20 text-cyan-300 border-cyan-500/40`).

### 5.4. Danh Sách Active Agents (Bố Cục 2 Dòng & Fallback Workspace An Toàn)
* **Bố cục hiển thị 2 dòng chuẩn (Two-Line Layout)**:
  - **Dòng 1 (Primary Header)**: Tên phiên (Session Title / Slug / Connection ID), icon Client (`APP` / `CLI`), Status Badge (`Streaming`, `Idle`, `Error`, `Done`).
  - **Dòng 2 (Secondary Preview)**: Preview tin nhắn cuối cùng (Last Message Preview) hoặc công cụ đang thực thi (`Tool: run_command`, `File: view_file`), được cắt ngắn an toàn với dấu `…` (truncate).
* **Cơ chế Fallback Workspace An Toàn**:
  - Khi một session không có metadata (thiếu title, thiếu slug, không có tin nhắn ban đầu từ extension/CLI), hệ thống bắt buộc fallback an toàn về tên Workspace / CWD hiện tại (ví dụ: `agent-factory` hoặc tên thư mục dự án cha).
  - Tuyệt đối không để trống dòng tiêu đề hoặc hiển thị các giá trị `undefined`, `null`, `[object Object]`.

### 5.5. Trình Xem & Soạn Thảo Tệp Tin (File Viewer, Markdown Preview & Image Viewer)
Tích hợp bộ công cụ quản lý và xem tệp tin lấy cảm hứng từ Developer Builder Kit:
* **Code & Config Editor (Monaco Editor)**:
  - Hỗ trợ xem và chỉnh sửa với đầy đủ cú pháp tô màu (Syntax Highlighting) cho JavaScript, TypeScript, Python, JSON, YAML, TOML, Markdown, HTML, CSS, SQL, Shell script...
  - Hỗ trợ đếm dòng (Line Numbers), Mini-map, và nút Copy nội dung nhanh (`Copy` / `Check` icon).
  - Tự động đồng bộ kích thước chữ và phông chữ theo Theme Settings qua `THEME_CHANGE_EVENT`.
* **Markdown Preview**:
  - Chuyển đổi linh hoạt giữa chế độ Code thô và Preview định dạng Markdown hoàn chỉnh (tiêu đề, danh sách, bảng, blockquote, inline code).
* **Image Viewer**:
  - Hỗ trợ xem trực tiếp các định dạng ảnh `.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`, `.webp`, `.ico`.
  - Cung cấp thanh công cụ điều khiển: Zoom in (`ZoomIn`), Zoom out (`ZoomOut`), Tỷ lệ gốc 1:1 (`Maximize`), và Nút tải tệp (`Download`).
* **File Cấu Hình (Config Files)**:
  - Tự động nhận diện và định dạng các file `.env*`, `.json`, `.yml`, `.yaml`, `.ini`, `.toml` với syntax highlighting chuẩn xác.

---

## 6. Hệ Thống Đồ Họa Vector 3D Isometric SVG (Isometric Tech Art)

Các vật phẩm trong Supporter Store và Virtual Office sử dụng đồ hoạ vector 3D Isometric chuẩn xác:

### 6.1. Tọa độ & Phép chiếu Isometric (Isometric Projection Standard)
* **Góc chiếu trục đo tiêu chuẩn (True Isometric ~30°)**:
  - Đỉnh trên: `(cx, cy - h/2)`
  - Đỉnh phải: `(cx + w/2, cy)`
  - Đỉnh dưới: `(cx, cy + h/2)`
  - Đỉnh trái: `(cx - w/2, cy)`
  - Path đa giác bề mặt sàn chuẩn: `M 100 25 L 175 68 L 100 110 L 25 68 Z`.
* **Cấu trúc xếp lớp độ sâu (Z-Layering)**:
  1. **Lớp bóng đổ sàn (Cast Shadow)**: Ellipse hoặc Path nằm dưới cùng với hiệu ứng mờ nhạt (`fill="black" opacity="0.4 - 0.6"`).
  2. **Lớp cạnh đáy vát (Bevel Edge / Extrusion Rim)**: Thể hiện độ dày của khối với màu tối hơn mặt trên 30% (`M 25 68 L 100 110 L 100 120 L 25 78 Z`).
  3. **Lớp bề mặt chính (Top Surface Slate)**: Gradient tuyến tính thể hiện nguồn sáng từ góc trên bên trái (`x1="0" y1="0" x2="1" y2="1"`).
  4. **Lớp lưới vi mạch (Circuitry & Gridlines)**: Đường nét nội tại với `strokeDasharray`, phát quang neon nhẹ.
  5. **Vật thể trọng tâm (Workstation / Agent Core)**: Chi tiết bàn máy tính hoặc khối lõi phát sáng tâm đối xứng.

---

## 7. Kiến trúc Supporter Store & Catalog (1,010 Tech Items)

Supporter Store cung cấp hệ thống 1,010 vật phẩm công nghệ cao chia thành 6 danh mục:

1. **Office Themes & Wallpapers (10 Floor Styles)**: Giao diện nền và lưới ánh sáng cho phòng làm việc 2D.
2. **Agent Skins 3D (250 Items)**: Ngoại trang cyborg, giáp cơ khí và hình thái avatar đặc nhiệm.
3. **Tech Desk Props (350 Items)**: Màn hình cong, máy chủ rack, cốc cà phê giữ nhiệt, bàn phím cơ và thiết bị lập trình.
4. **Pets & Companions (200 Items)**: Drone bay mini lơ lửng, robot đồng hành, thú cưng cyber.
5. **Auras & Effects (100 Items)**: Vòng năng lượng phát quang chân bàn, hạt hào quang, hiệu ứng dữ liệu.
6. **Trophies & Milestones (100 Items)**: Kỷ niệm chương đạt mốc 10M tokens, huy hiệu tốc độ xử lý.

### 7.1. Bố cục Store View
* **Left Navigation Sidebar**:
  - Danh mục với icon `lucide-react` chuyên biệt, số lượng item trên từng danh mục (`badge count`).
  - Card "Current Avatar" hiển thị trực tiếp trạng thái avatar, theme phòng làm việc đang trang bị, số lượng props, và huy hiệu VIP.
* **Header & Quick Filter Bar**:
  - Thanh tìm kiếm tức thời hỗ trợ phím tắt `/`.
  - Bộ nút chuyển nhanh danh mục (Quick Category Pills).
  - Nút chuyển đổi View Mode: Grid tiêu chuẩn (`LayoutGrid`) và Ma trận thu nhỏ (`Grid2X2`).
  - Nút nhập mã ủng hộ / mở khóa VIP ("Buff Dev").
* **Card Sản phẩm (Product Card)**:
  - Khung xem trước 3D Isometric Slate sắc nét.
  - Tên vật phẩm và mô tả ngắn gọn.
  - Huy hiệu phân loại (`FREE`, `COFFEE`, `VIP`).
  - Nút tương tác rõ ràng: `Apply Floor` / `Equip` / `Equipped` (đổi màu xanh cyan khi đã trang bị).

---

## 8. Chuẩn Render An Toàn Dữ Liệu & Hiệu Năng (Data Metric Safety & Performance)

### 8.1. An toàn Null/Undefined cho số đo và tiền tệ
Để ngăn chặn crash DOM khi luồng SSE truyền dữ liệu rỗng hoặc chưa hoàn tất:
* **Cost & Phí**: Luôn bọc hàm an toàn:
  ```javascript
  const safeCost = typeof cost === 'number' ? cost : Number(cost) || 0;
  return `$${safeCost.toFixed(4)}`;
  ```
* **Thời lượng (Elapsed ms)**:
  ```javascript
  const safeElapsed = Math.max(0, Number(elapsed) || 0);
  ```
* **Tỷ lệ Cache & Tiến độ (%)**:
  ```javascript
  const safeCachedPct = Math.min(100, Math.max(0, Number(cachedPct) || 0));
  ```

### 8.2. Quy tắc Hiệu năng cho ứng dụng chạy liên tục
* **Stable React Keys**: Tuyệt đối không dùng `Date.now()` hoặc pure loop index. Dùng composite key ổn định: `${connId}-${item.timestamp || idx}-${idx}`.
* **Bounded Buffer**: Cap tối đa buffer log ở 200 - 250 dòng để tránh rò rỉ bộ nhớ DOM.
* **Tránh Heavy Serialization**: Không gọi `JSON.stringify` trực tiếp trong render body của component cập nhật thường xuyên; bọc trong `useMemo`.
* **Garbage Collection**: Luôn quét và xóa các session ID đã kết thúc trong `useRef` Map state khi size vượt ngưỡng (> 100).

### 8.3. Giám Sát & Quét Transcripts Động (Dynamic Watcher & Multi-Agent Telemetry)
* **Dynamic Path Discovery**:
  - Bộ quét (`watcherManager.js`, `antigravityWatcher.js`, `claudeWatcher.js`) tự động khám phá và duyệt thư mục dự án và session logs tại `~/.gemini/antigravity-cli/brain/` và `~/.claude/` mà không phụ thuộc vào đường dẫn cố định.
  - Tự động nhận diện session từ Claude Extension (`extension-sessions/`) và CLI thông thường.
* **Null-Safe Token & Metric Handling**:
  - Khi phiên chưa phát sinh lượt gọi LLM hoặc không có dữ liệu token trong transcript, gán giá trị `null` thay vì số liệu giả lập.
  - Mọi hàm reducer, tính tổng, hiển thị chỉ số pod hay status bar bắt buộc phải kiểm tra an toàn:
    ```javascript
    const totalTokens = (session.tokens?.input ?? 0) + (session.tokens?.output ?? 0);
    ```
* **Tự Động Nhận Diện Provider & Model**:
  - Chuẩn hoá thông minh nhà cung cấp (Anthropic, Gemini, OpenAI, MiniMax, DeepSeek) dựa trên tên model thực tế và loại client (`app`, `cli`, `extension`).
