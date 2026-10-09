# Giai Đoạn 3: Cửa Hàng Decor Nhà Máy & Chủ Đề Không Gian (Factory Storefront & Cosmetics)

## Mục tiêu
Xây dựng hệ thống giao diện chủ đề đa dạng (Themes) và Cửa hàng Decor (Storefront) để biến AGMon thành cỗ máy sinh doanh thu trực tiếp từ người dùng thông qua mã VietQR và thanh toán thẻ Stripe/Polar.

---

## 1. Hệ Thống Đổi Chủ Đề Nhà Máy (Factory Themes Engine)

Tệp tạo mới: `src/lib/cosmetics/themeEngine.js`
Tệp chỉnh sửa: `src/components/factory/scene/office-layout.js`

Mỗi theme thay đổi toàn bộ bảng màu gạch lát sàn, tường nhà máy, màu bàn ghế và hiệu ứng hạt ánh sáng:

1. **Theme Mặc Định (Industrial Lab)**:
   - Sàn bê tông xám công nghiệp, tường gạch xanh navy, đèn halogen trắng ấm.
2. **Theme Cyberpunk Neo-Tokyo ($4.99 hoặc 5,000 $COIN)**:
   - Sàn kim loại tối màu phản chiếu vệt tím hồng neon.
   - Các đường ống dẫn token phát sáng màu Cyan & Magenta.
   - Bảng hiệu hologram chớp tắt kiểu Blade Runner.
3. **Theme Silicon Valley 1984 Garage ($4.99 hoặc 5,000 $COIN)**:
   - Nhà để xe với sàn gỗ cũ, hộp carton xếp đống.
   - Màn hình máy tính màu be phong cách Macintosh 128k cổ điển.
   - Giấy đục lỗ rơi vương vãi trên sàn.
4. **Theme Quán Cafe Tokyo Ngày Mưa ($4.99 hoặc 5,000 $COIN)**:
   - Cửa sổ lớn nhìn ra mưa rơi lách tách.
   - Quầy bar bằng gỗ sồi, cốc cà phê bốc khói nghi ngút.
   - Ánh đèn vàng ấm áp xoa dịu áp lực lập trình.

---

## 2. Giao Diện Cửa Hàng Decor (Storefront Modal)

Tệp tạo mới: `src/components/factory/store/StorefrontModal.jsx`

Bao gồm 3 tab trực quan:
- **Tab 1: Không Gian & Chủ Đề (Themes)**: Xem trước (Live Preview) hiệu ứng của từng theme trước khi kích hoạt.
- **Tab 2: Trang Bị & Thú Cưng (Pets & Props)**:
  - Mèo ngủ dưới gầm bàn (tự động vươn vai khi agent hoàn thành 1 turn).
  - Máy pha cà phê Espresso mini (tự động xả hơi khói khi token bay qua).
  - Bảng thành tích Huân chương vàng gắn tường.
- **Tab 3: Gói Ủng Hộ Tác Giả (Supporter Packs)**:
  - *Gói Cà Phê Đá (VietQR 25,000 VNĐ / $1)*: Tặng huy hiệu Supporter.
  - *Gói All Themes Pack ($9.99)*: Mở khóa vĩnh viễn toàn bộ theme hiện tại và tương lai.

---

## 3. Cơ Chế Mua Hàng & Kích Hoạt Bản Quyền (License & VietQR Flow)

Tệp tạo mới: `src/lib/cosmetics/licenseKey.js`

- **Với người dùng Việt Nam (VietQR)**:
  - Tích hợp tạo mã QR động ngân hàng với nội dung chuyển khoản mã hóa `AGMON_{USER_HASH}`.
  - Sau khi quét mã, hệ thống tự động xác thực và cấp mã mở khóa tức thì.
- **Với người dùng Quốc Tế (Stripe / Polar / Gumroad)**:
  - Người dùng nhập mã License Key được gửi qua email sau khi mua hàng.
  - Thuật toán xác thực License Key cục bộ bằng chữ ký Ed25519 / HMAC offline, không cần gọi server xác minh bản quyền mỗi lần mở app (bảo vệ quyền riêng tư).

---

## 4. Tiêu Chuẩn Nghiệm Thu
1. Người dùng có thể dùng $COIN cày được từ code thật để mua ít nhất 1-2 món decor cơ bản miễn phí.
2. Khi kích hoạt theme mới, toàn bộ canvas chuyển đổi mượt mà sang màu sắc và ánh sáng của theme đó mà không cần reload trang.
3. Mã VietQR và cổng thanh toán quốc tế hoạt động trơn tru.
