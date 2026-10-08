---
title: "Kế Hoạch Triển Khai: Multi-Agent Collaboration DAG Graph"
version: "v0.3.5"
status: "completed"
created_at: "2026-10-08"
brainstorm_ref: "docs/brainstorm/2026-10-08-multi-agent-dag-graph.md"
phases:
  - id: 1
    name: "Data Hierarchy & Tree Extraction Engine"
    status: "completed"
  - id: 2
    name: "Native SVG & Interactive Canvas DAG Component"
    status: "completed"
  - id: 3
    name: "VS Code Workbench & Activity Bar Integration"
    status: "completed"
  - id: 4
    name: "Interactivity, Subagent Inspection & Verification"
    status: "completed"
---

# Kế Hoạch Triển Khai: Multi-Agent Collaboration DAG Graph (v0.3.5)

Tài liệu thiết kế gốc: [`docs/brainstorm/2026-10-08-multi-agent-dag-graph.md`](file:///Volumes/T9/Projects/agent-factory/docs/brainstorm/2026-10-08-multi-agent-dag-graph.md)

---

## Mục Tiêu & Tiêu Chí Chấp Nhận (Acceptance Criteria)

- [ ] **Data Extraction**: Trích xuất chính xác cấu trúc mạng lưới (Nodes & Edges) từ danh sách traces và transcript phiên làm việc (`invoke_subagent`, `send_message`, `parentSessionId`).
- [ ] **Native SVG/HTML Engine**: Render đồ thị DAG dạng tầng (Hierarchical Layout) bằng SVG Cubic Bezier và thẻ HTML Node Cards với 0 dependencies bên ngoài.
- [ ] **Data Pulse Animation**: Hiệu ứng xung nhịp ánh sáng chuyển động trên đường nối khi Agent con đang hoạt động hoặc trao đổi message với Agent cha.
- [ ] **Canvas Controls**: Kéo chuột (Pan), lăn chuột / nút bấm (Zoom in/out), nút Fit to Screen căn giữa mạng lưới.
- [ ] **1-Click Interaction**: Bấm vào bất kỳ Agent Node nào trên đồ thị để mở Inspector hoặc cửa sổ chat của đúng Subagent đó.
- [ ] **Workbench Integration**: Thêm icon `Network` / `GitFork` trên Activity Bar, mở tab `Multi-Agent Network` trên Editor Tabs.
- [ ] **Quy chuẩn UI**: Tuyệt đối không dùng symbol/emoji thô, 100% icon SVG từ `lucide-react`.

---

## Chi Tiết Các Pha Triển Khai (Phases)

### Phase 1: Data Hierarchy & Tree Extraction Engine
- **File tạo/sửa:** `src/lib/parsers/hierarchyParser.js`
- **Mục tiêu:**
  - Nhận vào danh sách active traces từ `useFactoryTraces` và metadata các sessions.
  - Phân loại các session thành Root (Orchestrator) và Subagents dựa vào `parentTraceId`, `tool_calls: invoke_subagent`, hoặc tiền tố session.
  - Tính toán toạ độ layout `(x, y)` theo tầng (Layered DAG layout) để tránh chồng lấn đường nối.
  - Trả về cấu trúc:
    ```js
    {
      nodes: [{ id, label, role, model, status, tokens, x, y, isRoot }],
      edges: [{ id, from: { x, y, id }, to: { x, y, id }, active: boolean, label }]
    }
    ```

### Phase 2: Native SVG & Interactive Canvas DAG Component
- **File tạo:** `src/components/factory/AgentGraphView.jsx`
- **Mục tiêu:**
  - Lớp nền SVG: Render các đường cong Bezier `d="M x1 y1 C cx1 cy1, cx2 cy2, x2 y2"` với màu sắc phân biệt trạng thái (Running = Cyan glow, Done = Emerald, Idle = Slate).
  - CSS Keyframes Animation: `stroke-dasharray` & `stroke-dashoffset` tạo hiệu ứng hạt electron / xung dữ liệu chạy dọc đường dây liên kết.
  - Lớp thẻ HTML Nodes: Render card hiển thị Avatar robot, Role badge, Model badge, Task prompt tóm tắt, Tokens metric.
  - Viewport Pan & Zoom: Quản lý state `scale` (25% - 200%) và `panOffset { x, y }`, hỗ trợ drag-to-pan mượt mà và zoom controls.

### Phase 3: VS Code Workbench & Activity Bar Integration
- **File sửa:**
  - `src/components/layout/ActivityBar.jsx`: Thêm nút bấm tab `network` với icon `GitFork` / `Network`.
  - `src/components/layout/EditorTabs.jsx`: Hỗ trợ tab `network` ("Multi-Agent Graph") cạnh `office` và `tokens`.
  - `src/components/layout/VSCodeWorkbench.jsx`: Đổi view trung tâm sang `<AgentGraphView />` khi tab `network` được chọn.
  - `src/components/layout/layoutStore.js`: Bổ sung view mode `network`.

### Phase 4: Interactivity, Inspection & Verification
- **File sửa:**
  - Kết nối sự kiện `onSelectNode`: Click vào node con ➔ Mở RightSidebar Inspector hoặc bật `SessionChatModal` cho đúng subagent đó.
  - Chạy `npm run build` xác nhận Turbopack biên dịch 0 lỗi.
  - Kiểm thử tự động bằng `agent-browser`: Mở tab Network, kiểm tra sơ đồ SVG, thử nghiệm Pan/Zoom và click node mở chat.
  - Commit và push git hoàn thành milestone.
