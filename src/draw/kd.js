/* Shared layout + Nokta helpers for "Sayı Makinesi". */
(function (LI) {
  'use strict';
  const { clamp } = LI.E;
  LI.KD = {
    /** positions for 16:9 and 9:16 */
    L(env) {
      return env.V
        ? {
          CX: { x: 0, y: -780, s: 42, w: 980 },
          M2: { y: -560, xs: [-150, 150], xin: -470, xout: 470, w: 150, h: 100, r: 30, s: 44, ly: -650 },
          M4: { y: -560, xs: [-340, -115, 115, 340], xin: -500, xout: 500, w: 124, h: 100, r: 28, s: 40, ly: -650 },
          M1: { y: -560, xs: [0], xin: -400, xout: 400, w: 220, h: 110, r: 30, s: 46, ly: -650 },
          TB: { lx: -380, x0: -230, dx: 130, y: [-420, -340], s: 42 },
          E: { x: 0, y: [-240, -150, -60, 30], s: 42, w: 980 },
          SUM: { x: 0, y: [-560, -450, -340, -230], s: 46, w: 980 },
          nx: -360, gy: 560, s: 1.15 }
        : {
          CX: { x: 60, y: -445, s: 48, w: 1300 },
          M2: { y: -260, xs: [-150, 170], xin: -560, xout: 580, w: 170, h: 110, r: 32, s: 50, ly: -345 },
          M4: { y: -260, xs: [-370, -110, 150, 410], xin: -600, xout: 640, w: 150, h: 110, r: 30, s: 46, ly: -345 },
          M1: { y: -260, xs: [60], xin: -400, xout: 520, w: 240, h: 120, r: 32, s: 52, ly: -345 },
          TB: { lx: -300, x0: -140, dx: 140, y: [-110, -30], s: 48 },
          E: { x: 120, y: [60, 140, 220], s: 50, w: 1250 },
          SUM: { x: 100, y: [-240, -140, -40, 80], s: 54, w: 1250 },
          nx: -800, gy: 262, s: 1.15 };
    },
    cam(env, o = {}) { return Object.assign({ x: env.V ? 0 : -60, y: env.V ? 60 : 0, zoom: 1, rot: 0, tilt: 1 }, o); },
    /** pupils + face toward a world point */
    look(p, target) {
      const e = LI.Nokta.eyes(p)[0];
      const dx = target[0] - e[0], dy = target[1] - e[1], d = Math.hypot(dx, dy) || 1;
      p.lookX = clamp(dx / d * 1.1, -1, 1); p.lookY = clamp(dy / d * 1.1, -1, 1);
      p.turn = clamp(dx / 900, -0.5, 0.5);
      return p;
    },
    /** a short ground stroke under Nokta */
    ground(ctx, env, x, gy) { LI.Ambient.ground(ctx, x - 360, x + 360, gy + 6, { alpha: 0.32 }); },
  };
})(window.LI = window.LI || {});
