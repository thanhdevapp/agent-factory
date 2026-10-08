<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## UI & Icon Guidelines
- **Không sử dụng raw symbol / emoji**: Tuyệt đối không sử dụng các ký tự unicode emoji/symbol thô trong giao diện UI (ví dụ: 🤖, 🔊, 🔇, 🔔, 🔕, 📱, ⚡, 💬, 👤, 🛠️, 🧠, 📟, ℹ️, ⚠️, ❌, 🚀...).
- **Sử dụng bộ Icon hoặc SVG**: Luôn sử dụng icon component từ thư viện `lucide-react` hoặc file SVG tiêu chuẩn với kích thước, màu sắc và stroke nhất quán.
- **Canvas Scaling**: Canvas không phóng to (zoom lên vượt quá 100% / 1:1 scale) khi kích thước màn hình lớn. Màn hình to cho phép hiển thị không gian văn phòng rộng hơn (hiển thị nhiều hơn) ở tỷ lệ tự nhiên sắc nét, kèm tính năng pan/drag và điều khiển zoom mượt mà.
