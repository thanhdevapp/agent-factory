import { Container, Graphics } from "pixi.js";

// Token packets travelling between desks, the rack, and provider pods.
//
// Three kinds, so the picture says which way tokens flow:
//   input   round,  desk -> rack -> provider (arcs over the room)
//   output  diamond, provider -> rack -> desk (arcs underneath)
//   cached  square, desk -> rack only: served from cache, never reaches a provider
//
// One Graphics object is shared by every particle and rebuilt each frame: at a
// few hundred dots that is far cheaper than a Sprite per packet.

function lerpPoint(from, to, t, arc) {
  const lift = Math.sin(t * Math.PI) * arc;
  return {
    x: from.x + (to.x - from.x) * t,
    y: from.y + (to.y - from.y) * t - lift,
  };
}

const MAX_PACKETS = 700;

export function createTokenStreams() {
  const container = new Container();
  const layer = new Graphics();
  const glowLayer = new Graphics();
  container.addChild(glowLayer, layer);

  const packets = [];

  return {
    container,

    /**
     * Replace the set of active routes; called when the graph changes.
     * route: { from, to, color, weight, shape?: "circle"|"diamond"|"square", arc?: number }
     */
    setRoutes(routes) {
      packets.length = 0;
      for (const route of routes) {
        const spawn = Math.max(1, Math.min(6, Math.round(route.weight * 6)));
        for (let i = 0; i < spawn; i += 1) {
          packets.push({
            from: route.from,
            to: route.to,
            t: (i / spawn + Math.random() * 0.1) % 1,
            speed: 0.00035 + Math.random() * 0.0006 + route.weight * 0.0004,
            color: route.color,
            size: 1.6 + route.weight * 2.2,
            shape: route.shape || "circle",
            arc: route.arc ?? 26,
          });
        }
      }
      while (packets.length > MAX_PACKETS) packets.pop();
    },

    animate(deltaMS) {
      layer.clear();
      glowLayer.clear();

      for (const p of packets) {
        p.t += p.speed * deltaMS;
        if (p.t > 1) {
          p.t -= 1;
          p.speed = 0.00035 + Math.random() * 0.0006;
        }
        const pt = lerpPoint(p.from, p.to, p.t, p.arc);
        // Fade in/out at the ends so packets do not pop.
        const alpha = Math.min(1, p.t * 6) * Math.min(1, (1 - p.t) * 6);
        const s = p.size;

        if (p.shape === "diamond") {
          layer.poly([pt.x, pt.y - s * 1.5, pt.x + s * 1.2, pt.y, pt.x, pt.y + s * 1.5, pt.x - s * 1.2, pt.y]).fill({ color: p.color, alpha });
        } else if (p.shape === "square") {
          const q = s * 0.7;
          layer.rect(pt.x - q, pt.y - q, q * 2, q * 2).fill({ color: p.color, alpha: alpha * 0.9 });
        } else {
          layer.circle(pt.x, pt.y, s).fill({ color: p.color, alpha });
        }
        glowLayer.circle(pt.x, pt.y, s * 3).fill({ color: p.color, alpha: alpha * 0.14 });
      }
    },
  };
}
