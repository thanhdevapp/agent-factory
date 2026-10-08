---
title: "Kế Hoạch Triển Khai: Supporter Store & Cosmetic Desk Customization"
version: "v0.4.0"
status: "pending"
created_at: "2026-10-08"
brainstorm_ref: "docs/brainstorm/2026-10-08-supporter-store-cosmetics.md"
phases:
  - id: 1
    name: "Supporter Storage, Catalog & Offline Key Validator"
    status: "pending"
  - id: 2
    name: "Web Audio Ambient Soundscape Generator"
    status: "pending"
  - id: 3
    name: "Supporter Store Modal Component with VietQR"
    status: "pending"
  - id: 4
    name: "Virtual Office Canvas Rendering (Skins, Pets & Desk Props)"
    status: "pending"
  - id: 5
    name: "Workbench UI Integration & End-to-End Verification"
    status: "pending"
---

# Kế Hoạch Triển Khai: Supporter Store & Cosmetic Customization (v0.4.0)

Tài liệu thiết kế gốc: [`docs/brainstorm/2026-10-08-supporter-store-cosmetics.md`](file:///Volumes/T9/Projects/agent-factory/docs/brainstorm/2026-10-08-supporter-store-cosmetics.md)

---

## Mục Tiêu & Tiêu Chí Chấp Nhận (Acceptance Criteria)

- [ ] **VietQR & Kênh Donate**: Hiển thị mã QR ngân hàng Việt Nam tự động qua VietQR API cho các mức ủng hộ (20k, 50k, 100k) cùng các liên kết quốc tế (GitHub Sponsors, Buy Me a Coffee).
- [ ] **Supporter Key Validator**: Người dùng nhập mã Supporter Key (ví dụ `AGMON-COFFEE-VIP`) để mở khóa ngay lập tức toàn bộ kho đồ, lưu vĩnh viễn trong `localStorage`.
- [ ] **Kho Nhân Vật (Skins)**: Lựa chọn và trang bị 4 skin nhân vật khác nhau: Classic Robot, Pixel Cat Coder, Cyber Ninja, Retro Hacker.
- [ ] **Thú Cưng Văn Phòng**: Hiển thị chú mèo con hoặc chú chó Shiba nằm ngủ thở nhẹ dưới chân bàn của Agent.
- [ ] **Phụ Kiện Bàn Làm Việc**: Máy pha cà phê Espresso mini bốc khói thơm khi Agent đang xử lý task, chậu cây Bonsai thư giãn.
- [ ] **Âm Thanh Không Gian (Ambient Audio)**: Phát tiếng mưa rơi nhẹ nhàng hoặc âm thanh quán cà phê Lo-Fi bằng Web Audio API thuần (0 byte MP3).
- [ ] **Tích Hợp Workbench**: Nút bấm "Tiệm Cà Phê / Ủng Hộ" với icon `Coffee` trên TitleBar và ActivityBar.
- [ ] **Quy Chuẩn UI**: Tuyệt đối không dùng symbol/emoji thô, 100% sử dụng icon SVG từ `lucide-react`.

---

## Chi Tiết Các Pha Triển Khai (Phases)

### Phase 1: Supporter Storage, Catalog & Offline Key Validator
- **File tạo:** `src/lib/supporterStore.js`
- **Mục tiêu:**
  - Khai báo Catalog danh mục các Skins, Pets, Props, Ambient Soundscapes.
  - Quản lý trạng thái: `isSupporter`, `equippedSkin`, `equippedPet`, `equippedProps`, `ambientSound`.
  - Hàm `unlockWithCode(code)`: Kiểm tra mã kích hoạt hợp lệ và lưu vào `localStorage`.
  - Cơ chế Event Listener / Custom Event để thông báo cho Canvas cập nhật ngay lập tức khi người dùng đổi skin/pet.

### Phase 2: Web Audio Ambient Soundscape Generator
- **File tạo:** `src/lib/ambientAudio.js`
- **Mục tiêu:**
  - `startRainAmbience(volume)`: Sử dụng bộ sinh nhiễu hồng (Pink Noise) lọc qua Lowpass Filter tạo tiếng mưa rơi rả rích.
  - `startCoffeeShopAmbience(volume)`: Sử dụng các tầng dao động nhẹ tạo không gian quán cà phê ấm cúng.
  - Hàm `stopAmbient()`, `setAmbientVolume(vol)` nhẹ nhàng không tốn CPU.

### Phase 3: Supporter Store Modal Component with VietQR
- **File tạo:** `src/components/store/SupporterStoreModal.jsx`
- **Mục tiêu:**
  - Modal thiết kế hiện đại, dark mode đồng bộ, gồm 4 tabs:
    1. **Mời Cà Phê**: Chọn gói 20k / 50k / 100k, hiển thị mã VietQR động, số tài khoản, link GitHub Sponsors, ô nhập mã mở khóa.
    2. **Kho Nhân Vật**: Preview pixel và nút "Trang bị" các skin (Mèo Dev, Cyber Ninja, Retro Hacker).
    3. **Thú Cưng & Bàn Làm Việc**: Bật/tắt mèo/chó dưới gầm bàn, máy cà phê, chậu cây.
    4. **Âm Thanh Không Gian**: Bật/tắt tiếng mưa hoặc quán cà phê kèm thanh trượt âm lượng.

### Phase 4: Virtual Office Canvas Rendering (Skins, Pets & Desk Props)
- **File sửa:**
  - `src/components/factory/scene/characters.js`: Cập nhật hàm vẽ robot để hỗ trợ vẽ thêm tai mèo, khăn ninja, mũ hacker.
  - `src/components/factory/scene/desk.js`: Bổ sung vẽ phụ kiện máy pha cà phê bốc khói và thú cưng nằm dưới gầm bàn.
  - `src/components/factory/office-scene.js`: Lắng nghe sự kiện đổi skin/pet từ `supporterStore` để redraw các bàn làm việc.

### Phase 5: Workbench UI Integration & End-to-End Verification
- **File sửa:**
  - `src/components/layout/TitleBar.jsx`: Thêm nút "Ủng hộ tác giả" (Icon `Coffee`) với badge "Supporter" nếu đã kích hoạt.
  - `src/components/layout/ActivityBar.jsx`: Thêm icon Coffee tiện mở kho đồ nhanh.
  - `src/components/layout/VSCodeWorkbench.jsx`: Gắn `SupporterStoreModal` vào layout tổng.
  - Chạy `npm run build` kiểm tra Turbopack 0 lỗi biên dịch.
  - Kiểm thử tự động bằng `agent-browser` mở modal, nhập code mở khóa và kiểm tra các thay đổi trên Canvas.
