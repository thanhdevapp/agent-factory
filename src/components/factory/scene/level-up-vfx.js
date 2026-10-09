import { Container, Graphics, Text, TextStyle } from "pixi.js";

/**
 * Level-Up Celebration Visual Effects (Pixi.js v8)
 * Radiates golden fireworks and floating pixel banner when worker levels up
 */
export function createLevelUpVFX() {
  const container = new Container();
  const sparksLayer = new Graphics();
  const bannerContainer = new Container();

  container.addChild(sparksLayer, bannerContainer);

  const particles = [];
  const banners = [];

  return {
    container,

    triggerLevelUp({ x = 600, y = 350, level = 2, title = "Senior Artificer" } = {}) {
      // 1. Spawn Golden Particle Fireworks
      const count = 45;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.3 - 0.15);
        const speed = 0.12 + Math.random() * 0.22;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.08, // slight upward bias
          size: 2 + Math.random() * 3,
          color: Math.random() > 0.3 ? 0xf59e0b : 0xfde047, // Gold / Amber
          life: 1.0,
          decay: 0.0007 + Math.random() * 0.0005
        });
      }

      // 2. Create Floating Banner
      const textStyle = new TextStyle({
        fontFamily: "monospace, monospace",
        fontSize: 13,
        fontWeight: "bold",
        fill: 0xfffbeb,
        align: "center",
        dropShadow: {
          alpha: 0.9,
          angle: Math.PI / 6,
          blur: 4,
          color: 0x000000,
          distance: 2
        }
      });

      const bannerText = new Text({
        text: `★ LEVEL UP! LEVEL ${level} ★\n${title.toUpperCase()}`,
        style: textStyle
      });
      bannerText.anchor.set(0.5, 1);
      bannerText.x = x;
      bannerText.y = y - 25;

      const bgBox = new Graphics();
      const padX = 14;
      const padY = 8;
      const w = bannerText.width + padX * 2;
      const h = bannerText.height + padY * 2;

      bgBox.roundRect(-w / 2, -h - 25, w, h, 6).fill({ color: 0x1e1b4b, alpha: 0.92 });
      bgBox.roundRect(-w / 2, -h - 25, w, h, 6).stroke({ width: 2, color: 0xf59e0b, alpha: 0.95 });

      const singleBanner = new Container();
      singleBanner.x = x;
      singleBanner.y = y;
      singleBanner.addChild(bgBox, bannerText);

      bannerText.x = 0;
      bannerText.y = -25 - padY;

      bannerContainer.addChild(singleBanner);

      banners.push({
        container: singleBanner,
        startY: y,
        currentY: y,
        life: 1.0,
        decay: 0.0004
      });
    },

    animate(deltaMS) {
      sparksLayer.clear();

      // Animate Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx * deltaMS;
        p.y += p.vy * deltaMS;
        p.vy += 0.00015 * deltaMS; // Gravity
        p.life -= p.decay * deltaMS;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        const alpha = Math.max(0, p.life);
        sparksLayer.circle(p.x, p.y, p.size).fill({ color: p.color, alpha });
        sparksLayer.circle(p.x, p.y, p.size * 2).fill({ color: 0xf59e0b, alpha: alpha * 0.2 });
      }

      // Animate Banners
      for (let i = banners.length - 1; i >= 0; i--) {
        const b = banners[i];
        b.currentY -= 0.02 * deltaMS; // float upward
        b.container.y = b.currentY;
        b.life -= b.decay * deltaMS;

        b.container.alpha = Math.max(0, Math.min(1, b.life * 2));

        if (b.life <= 0) {
          bannerContainer.removeChild(b.container);
          b.container.destroy({ children: true });
          banners.splice(i, 1);
        }
      }
    }
  };
}
