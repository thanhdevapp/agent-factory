# Giai Đoạn 2: Bộ Tổng Hợp Âm Thanh Bàn Phím Cơ & Tiếng Còi Nhà Máy (Web Audio Synthesizer)

## Mục tiêu
Tạo ra trải nghiệm thính giác "gây nghiện" cho lập trình viên bằng cách giả lập tiếng gõ bàn phím cơ bằng **Web Audio API thuần** (0 byte file MP3 tải từ mạng). Tiếng gõ lách cách đồng bộ 100% với tốc độ sinh token của LLM, đi kèm tiếng còi nhà máy tan ca khi agent commit code.

---

## 1. Kiến Trúc Bộ Tổng Hợp Âm Thanh (Web Audio Synthesizer)

Tệp tạo mới: `src/lib/audio/keyboardSynth.js`

- **Tại sao dùng Web Audio API thay vì file MP3?**
  - File MP3 gõ phím khi lặp lại với tần suất cao (20-50 tokens/giây) sẽ bị méo tiếng, trễ âm (latency) và tốn băng thông tải asset.
  - Bộ tổng hợp tham số (Parametric Synthesizer) dùng `AudioContext`, `OscillatorNode`, `BiquadFilterNode` và `GainNode` tạo ra tiếng gõ phím cơ chân thực chỉ bằng vài chục dòng code toán học với độ trễ < 5ms.

```javascript
class MechanicalKeyboardSynth {
  constructor() {
    this.ctx = null;
    this.currentSwitch = 'cherry-blue'; // 'cherry-blue' | 'topre' | 'ibm-model-m'
    this.volume = 0.3;
    this.isMuted = false;
  }

  init() {
    if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
  }

  playClick() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    
    // Tạo tiếng click đanh (High click) + tiếng đáy phím (Bottom out thump)
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    // Tùy biến tần số theo loại switch
    const freq = this.currentSwitch === 'cherry-blue' ? 3200 : (this.currentSwitch === 'topre' ? 800 : 1800);
    osc.frequency.setValueAtTime(freq + (Math.random() * 200 - 100), now);
    
    gain.gain.setValueAtTime(this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.04);
  }
}
```

---

## 2. Đồng Bộ Nhịp Gõ Theo Tốc Độ Token (Token Cadence Sync)

Tệp chỉnh sửa: `src/components/factory/scene/office-scene.js` & `traceContract.js`

- Khi SSE stream bắn về một chunk token mới:
  - Tính toán số lượng token mới xuất hiện $\Delta T$.
  - Chia nhỏ thành chuỗi các tiếng gõ phím phân bổ ngẫu nhiên trong khoảng thời gian 100ms - 200ms để mô phỏng ngón tay gõ bàn phím nhịp nhàng.
  - Khi token dừng bắn (Agent chuyển sang suy nghĩ): Âm thanh bàn phím tự động dừng lại.

---

## 3. Tiếng Còi Hơi Nhà Máy (Factory Whistle Celebration)

Tệp tạo mới: `src/lib/audio/factoryWhistle.js`

- Khi phát hiện một Git Commit hoặc một Task hoàn thành thành công:
  - Bộ tổng hợp âm thanh kéo một hồi còi hơi dài 1.5 giây (hài âm kép 440Hz + 554Hz) mô phỏng tiếng còi báo giờ tan ca của nhà máy công nghiệp cổ điển.
  - Mang lại cảm giác nhẹ nhõm, đã tai cho lập trình viên.

---

## 4. Bảng Điều Khiển Âm Thanh Trên UI (Sound Controls)

Tệp chỉnh sửa: `src/components/factory/CanvasHUD.jsx`
- Nút loa Toggle Mute / Unmute nhanh bằng phím tắt `M`.
- Thanh trượt âm lượng (Volume Slider).
- Bộ chọn Switch (Dropdown):
  - 🔘 Cherry MX Blue (Clicky đanh tai)
  - 🔘 Topre Silent (Thock êm trầm)
  - 🔘 IBM Model M 1984 (Kim loại giòn tan)

---

## 5. Tiêu Chuẩn Nghiệm Thu
1. Không phụ thuộc vào bất kỳ file âm thanh tĩnh nặng nề nào.
2. Tiếng gõ gõ cành cạch tự động phát theo nhịp khi Agent đang gõ code.
3. Người dùng có thể bấm phím `M` để tắt âm ngay lập tức bất cứ lúc nào.
