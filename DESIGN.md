# AGMon - Design Guidelines & UI Tokens

Tài liệu này quy định các tiêu chuẩn thiết kế UI/UX, Design Tokens, quy tắc sử dụng icon và hướng dẫn đồ hoạ cho dự án **AGMon (Agent Factory)**. Mọi lập trình viên và tác nhân AI khi xây dựng hoặc cập nhật giao diện đều phải tuân thủ nghiêm ngặt các quy tắc dưới đây.

---

## 1. Quy tắc cốt lõi về UI & Icon (Bắt buộc)

### 1.1. Tuyệt đối không sử dụng Raw Emoji / Unicode Symbol thô trong UI
* **Cấm**: Tuyệt đối không hardcode các ký tự unicode emoji thô trong mã JSX/HTML (ví dụ: `🤖`, `🔊`, `🔇`, `🔔`, `🔕`, `📱`, `⚡`, `💬`, `👤`, `🛠️`, `🧠`, `📟`, `ℹ️`, `⚠️`, `❌`, `🚀`, `✅`...).
* **Lý do**: Emoji hiển thị không đồng nhất trên các hệ điều hành (macOS, Windows, Linux, iOS, Android), làm vỡ font metrics, phá vỡ tính chuyên nghiệp và thẩm mỹ chuẩn Developer Tooling của VS Code.
* **Quy chuẩn**: Luôn sử dụng icon component từ thư viện `lucide-react` hoặc file SVG vector tiêu chuẩn với kích thước, màu sắc và stroke nhất quán.
* **Thông báo hệ thống (Notifications) & Export**: Trong title trình duyệt hoặc file markdown xuất ra, sử dụng text tag có cấu trúc (ví dụ: `[DONE]`, `[ALERT]`, `### User`, `### Assistant`).

### 1.2. Quy tắc Canvas Scaling & Tỷ lệ hiển thị
* **Không tự động zoom vượt quá 100% (1:1 scale)**: Khi người dùng mở ứng dụng trên màn hình lớn hoặc siêu rộng (2K, 4K, UltraWide), Canvas Pixi.js không được tự ý scale phóng to vượt quá tỷ lệ tự nhiên 100%.
* **Mở rộng không gian hiển thị**: Màn hình lớn được tận dụng để hiển thị không gian văn phòng rộng hơn, hiển thị nhiều bàn làm việc của agents hơn ở tỷ lệ sắc nét từng pixel.
* **Điều khiển Pan & Zoom mượt mà**:
  - Hỗ trợ kéo chuột (Pan/Drag) tự do trong không gian văn phòng.
  - Cho phép người dùng chủ động zoom qua con lăn chuột hoặc nút điều khiển với khoảng giới hạn an toàn (`MIN_ZOOM = 0.2`, `MAX_ZOOM = 1.15` - `1.2`).
  - Hỗ trợ Double Click vào vùng trống để tự động fit toàn bộ văn phòng vào khung nhìn (`fit to screen`).

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

### 2.2. Đường viền (Borders & Dividers)
* **Subtle Border**: `#2b2b2b` hoặc `#333333` (phân chia panels, separators, tab borders).
* **Focused / Active Border**: `#007acc` hoặc `#38bdf8` (thể hiện focus state hoặc active tab).
* **Warning Border**: `#f59e0b/40` hoặc `#f43f5e/40` (thể hiện cảnh báo hoặc loop alert).

### 2.3. Màu điểm nhấn & Trạng thái Agent (Accents & State Colors)
* **VS Code Primary Accent**: `#007acc` / `#0062a3` (nút hành động chính, active indicator).
* **Streaming / Busy**: `#38bdf8` (Cyan) hoặc `#10b981` (Emerald) - Agent đang suy nghĩ / gọi công cụ / stream tokens.
* **Idle / Standby**: `#94a3b8` (Slate-400) - Agent nghỉ, chờ lệnh mới.
* **Error / Fault**: `#f43f5e` (Rose-500) - Lỗi thực thi, ngoại lệ API.
* **Loop Alert**: `#e11d48` (Rose-600) với hiệu ứng `animate-pulse` - Phát hiện vòng lặp vô tận (Runaway loop).
* **Cache Hit / Efficiency**: `#34d399` (Emerald-400) - Tỷ lệ Prompt Cache cao giúp tiết kiệm chi phí.

---

## 3. Typography & Phông chữ

1. **Monospace (`font-mono`)**: Bắt buộc sử dụng cho:
   - Session IDs, Trace IDs, Process PIDs.
   - Số lượng Token (Input, Output, Cache, Total).
   - Chi phí tiền tệ (`$0.015`).
   - Dấu mốc thời gian (`10:45:12`, `durationMs`).
   - Tên Models (`gemini-2.5-pro`, `claude-3-7-sonnet`).
   - Tên Tools (`run_command`, `replace_file_content`).
2. **Sans-serif (`font-sans`)**: Sử dụng cho tiêu đề bảng điều khiển, nhãn điều hướng, thông điệp hướng dẫn, nội dung hội thoại chat.

---

## 4. Chuẩn thiết kế Thành phần UI (Components)

### 4.1. Bảng dữ liệu (Tables)
* **Phân trang bắt buộc**: Mọi bảng dữ liệu tiềm năng có hàng trăm bản ghi (như Token Analytics) phải có phân trang (Pagination: 25 / 50 / 100 / 200). Không render toàn bộ vào DOM cùng lúc.
* **Sticky Header**: Tiêu đề cột luôn nhìn thấy khi cuộn trang, hỗ trợ click sắp xếp (Sortable) với icon `ArrowUpDown`.
* **Empty State**: Khi không có dữ liệu, hiển thị thông báo dịu mắt kèm gợi ý xóa bộ lọc.

### 4.2. Hộp thoại nổi (Modals & Drawers)
* Nền backdrop tối mờ nhẹ (`backdrop-blur-md bg-black/60`).
* Nút đóng (`X`) rõ ràng, hỗ trợ phím tắt `Escape`.
* Hỗ trợ nút phóng to toàn màn hình (`Maximize2` / `Minimize2`).
* Header và Footer luôn cố định (sticky), phần thân nội dung cuộn độc lập (`overflow-y-auto`).

### 4.3. Badge & Chip Tags
* Sử dụng kích thước chuẩn `xs` hoặc `sm` với padding cân đối (`px-2 py-0.5`).
* Phân biệt rõ loại Client:
  - **APP**: Tông màu tím (`bg-purple-950/80 border-purple-700/80 text-purple-300`).
  - **CLI**: Tông màu xanh ngọc (`bg-emerald-950/80 border-emerald-700/80 text-emerald-300`).
