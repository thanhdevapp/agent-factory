# Giai Đoạn 1: Động Cơ Tiến Trình & Khai Thác XP Từ Công Việc Thật (Real-Work XP Engine)

## Mục tiêu
Thiết lập toàn bộ nền móng Gamification cho AGMon: Mỗi dòng code, mỗi token và mỗi commit thật từ AI CLI sẽ chuyển hóa thành điểm kinh nghiệm (XP), thăng cấp bậc thợ cho các bàn làm việc, và tích lũy đồng tiền nhà máy ($COIN).

---

## 1. Công Thức Quy Đổi XP & $COIN (Real-Work Mining)

Tệp tạo mới: `src/lib/progression/xpEngine.js`

```javascript
export const XP_RULES = {
  PER_100_TOKENS: 1,       // 1 XP cho mỗi 100 token LLM sinh ra
  TOOL_CALL_SUCCESS: 15,   // 15 XP khi tool bash / file_edit chạy thành công
  TURN_COMPLETED: 25,      // 25 XP khi kết thúc 1 turn trao đổi
  GIT_COMMIT_DETECTED: 100,// 100 XP khi phát hiện commit mới
  COIN_DIVISOR: 5          // Cứ 5 XP được thưởng 1 $COIN
};

export function calculateTurnXP(turnEvent) {
  let xp = 0;
  if (turnEvent.tokenCount) xp += Math.floor(turnEvent.tokenCount / 100) * XP_RULES.PER_100_TOKENS;
  if (turnEvent.toolCalls) xp += turnEvent.toolCalls.length * XP_RULES.TOOL_CALL_SUCCESS;
  if (turnEvent.isCompleted) xp += XP_RULES.TURN_COMPLETED;
  return xp;
}
```

---

## 2. Hệ Thống 50 Cấp Bậc Thợ (Worker Ranks)

Tệp tạo mới: `src/lib/progression/rankRules.js`

| Cấp độ | Danh hiệu Thợ | Điểm XP cần | Vật phẩm mở khóa tự động |
|---|---|---|---|
| **Level 1** | *Thợ Học Việc (Intern Apprentice)* | 0 XP | Bàn gỗ mộc, bóng đèn dây tóc |
| **Level 5** | *Thợ Bậc Ba (Junior Craftsman)* | 500 XP | Màn hình CRT xanh lá, cốc cà phê giấy |
| **Level 10** | *Kỹ Sư Lành Nghề (Senior Artificer)* | 2,500 XP | Màn hình kép LED, ghế công thái học |
| **Level 20** | *Quản Đốc Phân Xưởng (Factory Overseer)* | 10,000 XP | Phòng kính riêng, máy pha cà phê Espresso |
| **Level 35** | *Tổng Công Trình Sư (Chief Architect)* | 35,000 XP | Thảm nhung đỏ, robot phụ tá bưng trà |
| **Level 50** | *Đại Sư Tự Động Hóa (Automation Archmage)* | 100,000 XP | Ngai vàng Cyberpunk lơ lửng, hào quang vàng |

---

## 3. Hiệu Ứng Thăng Cấp Trên Canvas (Level-Up Celebration VFX)

Tệp tạo mới: `src/components/factory/scene/level-up-vfx.js`
- Tích hợp vào Pixi.js viewport:
  - Khi một bàn làm việc hoặc toàn nhà máy tích đủ XP lên level mới:
  - Bắn một chùm hạt pháo sáng màu vàng kim (`#f59e0b`) từ bàn làm việc đó bay lên cao.
  - Bảng chữ pixel `"LEVEL UP! LEVEL {X}"` nổi lên và mờ dần trong 2.5 giây.
  - Âm thanh "Level Up Chime" ngân vang vui tai.

---

## 4. Quản Lý Ví Tiền & Tiến Trình Cục Bộ (Local-First Wallet)

Tệp tạo mới: `src/lib/progression/walletStore.js`
- Lưu vào `localStorage` key `agmon_factory_progression`:
  - `totalXP`: Tổng XP trọn đời.
  - `currentLevel`: Cấp độ hiện tại.
  - `coins`: Số dư đồng $COIN hiện có.
  - `sessionStats`: Thống kê theo ngày (tokens processed, commits, tasks solved).
- Đảm bảo tính toán hoàn toàn offline, 0ms latency, không yêu cầu đăng nhập tài khoản.

---

## 5. Tiêu Chuẩn Nghiệm Thu (Acceptance Criteria)
1. Khi chạy một lệnh CLI (như Claude Code sửa file), thanh XP góc trên màn hình tăng đều theo số token thực tế.
2. Khi vượt ngưỡng level, hiệu ứng pháo hoa vàng kim bắn lên trên canvas và âm thanh level-up phát ra chính xác.
3. Reload lại trang web, số level, XP và $COIN không bị mất.
