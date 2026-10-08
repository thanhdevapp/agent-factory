<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## UI & Icon Guidelines
- **Không sử dụng raw symbol / emoji**: Tuyệt đối không sử dụng các ký tự unicode emoji/symbol thô trong giao diện UI (ví dụ: 🤖, 🔊, 🔇, 🔔, 🔕, 📱, ⚡, 💬, 👤, 🛠️, 🧠, 📟, ℹ️, ⚠️, ❌, 🚀...).
- **Sử dụng bộ Icon hoặc SVG**: Luôn sử dụng icon component từ thư viện `lucide-react` hoặc file SVG tiêu chuẩn với kích thước, màu sắc và stroke nhất quán.
- **Canvas Scaling**: Canvas không phóng to (zoom lên vượt quá 100% / 1:1 scale) khi kích thước màn hình lớn. Màn hình to cho phép hiển thị không gian văn phòng rộng hơn (hiển thị nhiều hơn) ở tỷ lệ tự nhiên sắc nét, kèm tính năng pan/drag và điều khiển zoom mượt mà.

## Performance & Long-Running Stability
- **Stable React Keys**: Tuyệt đối không dùng `Date.now()` hoặc pure loop index làm key trong các danh sách cập nhật thường xuyên. Dùng composite key ổn định `${connId}-${item.timestamp || idx}-${idx}`.
- **Bounded Buffer & Pagination**: Luôn cap buffer danh sách log (tối đa 200-250 dòng) và phân trang bắt buộc cho các bảng dữ liệu lớn (như Token Analytics).
- **Tránh Serialization nặng**: Không gọi `JSON.stringify` trực tiếp trong render body của các component cập nhật thường xuyên; bọc trong `useMemo`.
- **Garbage Collection**: Luôn quét và xóa các session ID đã kết thúc trong `useRef` Map state khi size vượt ngưỡng (> 100).
- **Chi tiết xem thêm**: Tham khảo [DESIGN.md](file:///Volumes/T9/Projects/agent-factory/DESIGN.md) và [CLAUDE.md](file:///Volumes/T9/Projects/agent-factory/CLAUDE.md).

