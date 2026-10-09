# Giai Đoạn 4: Đóng Gói Ứng Dụng Desktop Tauri & Chế Độ Docked Bar (Desktop Companion)

## Mục tiêu
Đóng gói AGMon thành ứng dụng Desktop độc lập siêu nhẹ (< 15MB) sử dụng **Tauri 2.0**, cung cấp chế độ **Docked Bar** nằm nép ở mép dưới màn hình (học hỏi từ hiện tượng *Rusty's Retirement*), sẵn sàng phát hành trên Steam, Gumroad và phân phối trực tiếp.

---

## 1. Cấu Trúc Khung Tauri 2.0

Thư mục tạo mới: `src-tauri/`

- **Lý do chọn Tauri 2.0 thay vì Electron:**
  - Dung lượng file cài đặt: Tauri ~12MB vs Electron ~180MB.
  - Bộ nhớ RAM tiêu thụ khi chạy nền: Tauri ~35MB vs Electron ~350MB.
  - Khởi động tức thì < 200ms.
- **Tệp cấu hình**: `src-tauri/tauri.conf.json`
  - Quyền truy cập tệp cục bộ để đọc transcript CLI.
  - Hỗ trợ cửa sổ trong suốt (Transparent Window).
  - Tự động ghim trên cùng (Always-on-top).

---

## 2. Thiết Kế 2 Chế Độ Cửa Sổ (Window Modes)

### Chế độ A: Docked Screen-Bottom Bar (Mô hình *Rusty's Retirement*)
- Cửa sổ tự động neo chặt vào cạnh đáy màn hình (chiều cao cố định 120px - 140px, chiều rộng full màn hình).
- Hiển thị dãy bàn làm việc của các Agent đang chạy dưới dạng một băng chuyền nhà máy mini.
- Người dùng vừa gõ code trong VS Code / Cursor ở nửa trên màn hình, vừa nhìn thấy các chú thợ pixel đang cuốc đất, gõ phím, bê token ở dải mép dưới màn hình.
- Nút bấm thu gọn (Collapse / Hide) dạng slide-down khi cần không gian tối đa.

### Chế độ B: Full Factory Workspace (Màn Hình Thứ Hai)
- Mở toàn màn hình tỷ lệ 16:9 hoặc 21:9 trên màn hình phụ.
- Hiển thị toàn cảnh nhà máy 20 bàn, tủ rack server trung tâm, 4 pod đám mây và hệ thống ống khói xả hơi nước.

---

## 3. Tính Năng Bản Địa Hệ Điều Hành (Native OS Integrations)

Tệp tạo mới: `src-tauri/src/tray.rs` & `src-tauri/src/notifications.rs`

1. **System Tray Icon (Khay hệ thống)**:
   - Icon khay hệ thống hiển thị trạng thái hoạt động: Xanh khi có agent đang làm việc, Xám khi nghỉ ngơi.
   - Menu chuột phải: *Bật/Tắt Docked Mode*, *Tắt/Mở Âm thanh*, *Mở Cửa Hàng Decor*, *Thoát*.
2. **Global Hotkey (Phím tắt toàn cầu)**:
   - Bấm `Cmd+Shift+A` (macOS) hoặc `Ctrl+Shift+A` (Windows) để triệu hồi hoặc ẩn nhanh thanh Docked Bar.
3. **Native Desktop Notifications**:
   - Khi Agent chạy xong task hoặc gặp lỗi nghiêm trọng: Bắn thông báo hệ thống của macOS / Windows ngay cả khi người dùng đang chơi game hoặc xem phim.

---

## 4. Chuẩn Bị Phát Hành Lên Cửa Hàng (Distribution & Steam / Gumroad)

- **Quy trình đóng gói**:
  ```bash
  npm run tauri build
  ```
  Tạo ra file `.dmg` (macOS Apple Silicon & Intel) và file `.msi` / `.exe` (Windows 10/11).
- **Trang bán hàng (Steamworks / Gumroad)**:
  - Giá bán đề xuất: **$9.99**.
  - Tích hợp Steam Achievements (Thành tựu Steam: *Đạt 1 triệu token*, *Lên cấp 50*, *Đốt cháy 100 bug*).

---

## 5. Tiêu Chuẩn Nghiệm Thu
1. Bộ cài ứng dụng Desktop nhẹ dưới 20MB, cài đặt trong 10 giây.
2. Chế độ Docked Bar bám dính đáy màn hình mượt mà, không giật lag, không cản trở chuột khi lập trình.
3. Phím tắt toàn cầu triệu hồi và ẩn app hoạt động tức thì.
