---
title: "Time-Machine Session Replay"
description: "Tua lại và phát lại toàn bộ diễn biến lịch sử của AI Agent theo trục thời gian với Scrubber, Milestone markers, đồng bộ trạng thái nhân vật Canvas và Inspector code diff."
status: completed
priority: P2
branch: "main"
tags: ["replay", "timemachine", "visualizer", "keyframes", "workbench"]
blockedBy: []
blocks: []
created: "2026-10-08T03:04:06.271Z"
createdBy: "ck:plan"
source: skill
brainstorm_ref: "docs/brainstorm/2026-10-08-time-machine-session-replay.md"
---

# Time-Machine Session Replay (v0.4.0)

Tài liệu thiết kế kiến trúc gốc: [`docs/brainstorm/2026-10-08-time-machine-session-replay.md`](file:///Volumes/T9/Projects/agent-factory/docs/brainstorm/2026-10-08-time-machine-session-replay.md)

## Tổng Quan & Mục Tiêu

Tính năng **Time-Machine Session Replay** biến AGMon từ một công cụ quan sát realtime thụ động thành một **Hộp đen hành trình (Flight Blackbox Recorder)** cho AI Agent:
- Cho phép người dùng chọn bất kỳ session nào trong quá khứ hoặc hiện tại để tua lại từng bước hành động.
- Thanh điều khiển Timeline Toolbar với nút Play/Pause, tốc độ 1x/2x/5x/10x, thanh trượt dải thời gian với các chấm mốc sự kiện (Milestones).
- Đồng bộ không-thời gian: Khi tua thời gian, nhân vật Agent trên Canvas hoặc các Node trên DAG Graph tự động đổi tư thế, nổi bóng thoại trạng thái, và số token/chi phí tích lũy tăng dần theo thời gian thực tế.
- Tích hợp liền mạch vào VS Code Workbench dưới dạng Tab Editor hoặc Floating Toolbar Overlay.

## Các Pha Triển Khai (Phases)

| Phase | Tên Pha | Trạng Thái | Mô Tả Trọng Tâm |
|---|---|---|---|
| 1 | [Event Normalizer & Keyframe Parser](./phase-01-event-normalizer-keyframe-parser.md) | Completed | Parser chuẩn hóa transcript JSONL thành mảng keyframes timeline |
| 2 | [TimeMachine Scrubber & Player Controls](./phase-02-timemachine-scrubber-player-controls.md) | Completed | Xây dựng thanh toolbar điều khiển Play/Pause/Speed/Scrubber |
| 3 | [Canvas & Graph Retrospective State Sync](./phase-03-canvas-graph-retrospective-state-sync.md) | Completed | Đồng bộ trạng thái hồi tố của nhân vật Canvas & Network Graph |
| 4 | [Inspector & Keyboard Shortcuts Integration](./phase-04-inspector-keyboard-shortcuts-integration.md) | Completed | Cửa sổ chi tiết bước, phím tắt điều khiển Space/Arrows và verify |

## Quy Chuẩn Kỹ Thuật

- **UI & Icons**: Tuân thủ nghiêm ngặt `AGENTS.md` — 100% icon SVG từ `lucide-react`, không dùng symbol emoji thô.
- **Shared UI**: Tái sử dụng bộ component dùng chung tại `src/components/ui/` (`Button`, `Input`, `Select`, `Badge`, `Modal`, `Tooltip`).
- **Hiệu Năng**: Đạt 60fps khi kéo tua thanh trượt (Scrubbing latency < 16ms), tính toán trước mảng keyframes.
