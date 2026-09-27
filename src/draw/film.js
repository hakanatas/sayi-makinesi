/* ─────────────────────────────────────────────────────────────
   The film's continuous state as pure functions of time.
   A number machine (× 2, then + 3) turns 1, 2, 3, 4 into 5, 7, 9, 11:
   an algorithm, a table, 2n + 3, and why the order of steps matters.
   A four-step number trick always returns n. A mystery machine is
   read backwards from its table: 3n − 1.
   ───────────────────────────────────────────────────────────── */
(function (LI) {
  'use strict';
  const { seg, clamp, lerp, outBack, outCubic, inOut, hump } = LI.E;
  const A = LI.Ang, KD = LI.KD, Ink = LI.Ink;

  const T = (ctx, s, x, y, o = {}) => A.text(ctx, s, x, y, Object.assign({ size: 48 }, o));
  const AMB = { color: A.amber };
  /** text width in the brush font */
  function width(ctx, s, size) { ctx.save(); ctx.font = `${size}px "LI Brush", "Comic Sans MS", cursive`; const w = ctx.measureText(s).width; ctx.restore(); return w; }
  /** write text, shrinking it to fit width w */
  function fit(ctx, s, x, y, size, w, o = {}) { const m = width(ctx, s, size); T(ctx, s, x, y, Object.assign({ size: m > w ? size * w / m : size }, o)); }
  /** a hand-drawn check mark at (x, y) */
  function tick(ctx, x, y, p, a = 1) {
    if (p <= 0 || a <= 0) return;
    Ink.path(ctx, [[x, y], [x + 12, y + 14], [x + 38, y - 20]], { w: 7, p, alpha: a, color: LI.AMBER_RGB, seed: 401, taper: [0.05, 0.3] });
  }
  /** a hand-drawn cross over (x, y) */
  function cross(ctx, x, y, r, p, a = 1) {
    if (p <= 0 || a <= 0) return;
    Ink.path(ctx, [[x - r, y - r], [x + r, y + r]], { w: 6, p: clamp(p * 2), alpha: a, color: LI.AMBER_RGB, seed: 411, taper: [0.1, 0.3] });
    Ink.path(ctx, [[x + r, y - r], [x - r, y + r]], { w: 6, p: clamp(p * 2 - 1), alpha: a, color: LI.AMBER_RGB, seed: 412, taper: [0.1, 0.3] });
  }

  /** text whose last k characters can glow amber (h: 0..1) */
  function hotTail(ctx, s, x, y, size, k, h, o = {}) {
    const w = width(ctx, s, size), head = s.slice(0, s.length - k), tail = s.slice(s.length - k), wh = width(ctx, head, size);
    const a = o.alpha ?? 1, base = Object.assign({}, o, { size, align: 'left' });
    if (head) T(ctx, head, x - w / 2, y, base);
    if (h < 1) T(ctx, tail, x - w / 2 + wh, y, Object.assign({}, base, { alpha: a * (1 - h) }));
    if (h > 0) T(ctx, tail, x - w / 2 + wh, y, Object.assign({}, base, AMB, { alpha: a * h }));
  }
  /** the big number, digit by digit; hot(i) → 0..1 amber for digit i (spaces skipped) */
  const NUMBER = '2,375';
  function bigNum(ctx, NUM, a, p, hot) {
    if (a <= 0) return;
    const w = width(ctx, NUMBER, NUM.s); let x = NUM.x - w / 2, di = 0;
    [...NUMBER].forEach((ch, j) => {
      const cw = width(ctx, ch, NUM.s);
      if (/[0-9]/.test(ch)) {
        const k = seg(p, j / NUMBER.length * 0.8, j / NUMBER.length * 0.8 + 0.2), h = hot(di++);
        if (k > 0) {
          const y = NUM.y - 20 * (1 - outBack(k)) - 10 * h;
          if (h < 1) T(ctx, ch, x + cw / 2, y, { size: NUM.s, alpha: a * k * (1 - h) });
          if (h > 0) T(ctx, ch, x + cw / 2, y, Object.assign({ size: NUM.s * (1 + 0.08 * h), alpha: a * k * h }, AMB));
        }
      }
      else if (ch !== ' ') { const k = seg(p, j / NUMBER.length * 0.8, j / NUMBER.length * 0.8 + 0.2); if (k > 0) T(ctx, ch, x + cw / 2, NUM.y, { size: NUM.s, alpha: a * k }); }
      x += cw;
    });
  }
  /* ── fractions and expressions ──────────────────────────── */
  /** width of one expression item (a string, or {n, d} for a fraction) */
  function itemW(ctx, it, s) { return typeof it === 'string' ? width(ctx, it, s) : Math.max(width(ctx, String(it.n), s * 0.72), width(ctx, String(it.d), s * 0.72)) + s * 0.25; }
  /** a row of text and stacked fractions, centred at x */
  function expr(ctx, items, x, y, s, o = {}) {
    const a = o.alpha ?? 1, col = o.color ? { color: o.color } : {};
    let w = items.reduce((u, it) => u + itemW(ctx, it, s), 0);
    const sc = o.w && w > o.w ? o.w / w : 1; s *= sc; w *= sc;
    let cx = x - w / 2;
    items.forEach((it) => {
      const iw = itemW(ctx, it, s);
      if (typeof it === 'string') T(ctx, it, cx, y, Object.assign({ size: s, alpha: a, align: 'left', halo: o.halo }, col));
      else {
        const fc = it.hot ? AMB : col, m = cx + iw / 2;
        T(ctx, String(it.n), m, y - s * 0.42, Object.assign({ size: s * 0.72, alpha: a }, fc));
        ctx.strokeStyle = it.hot ? `rgba(${LI.AMBER_RGB},${a})` : `rgba(${LI.INK_RGB},${0.85 * a})`; ctx.lineWidth = Math.max(2.5, s * 0.055);
        ctx.beginPath(); ctx.moveTo(cx + s * 0.1, y + 2); ctx.lineTo(cx + iw - s * 0.1, y + 2); ctx.stroke();
        T(ctx, String(it.d), m, y + s * 0.46, Object.assign({ size: s * 0.72, alpha: a }, fc));
      }
      cx += iw;
    });
  }
  const fr = (n, d, hot) => ({ n, d, hot });

  /* ── number machines ─────────────────────────────────────── */
  /** the pipe and the boxes; ops[i] is the label of box i; k: draw-on */
  function machine(ctx, M, ops, k, a, hot = () => 0) {
    if (a <= 0 || k <= 0) return;
    Ink.path(ctx, [[M.xin, M.y], [M.xout, M.y]], { w: 3, p: k, alpha: a * 0.45, seed: 1200, taper: [0, 0] });
    Ink.path(ctx, [[M.xout - 22, M.y - 14], [M.xout, M.y], [M.xout - 22, M.y + 14]], { w: 3, p: seg(k, 0.8, 1), alpha: a * 0.6, seed: 1201, taper: [0, 0] });
    ops.forEach((op, i) => {
      const g = seg(k, i / ops.length * 0.7, i / ops.length * 0.7 + 0.3); if (g <= 0) return;
      const x = M.xs[i], w = M.w, h = M.hot, hh = hot(i);
      ctx.fillStyle = `rgba(${LI.PAPER_RGB},${a})`; ctx.fillRect(x - w / 2, M.y - M.h / 2, w, M.h);
      ctx.fillStyle = `rgba(${LI.AMBER_RGB},${(0.12 + 0.25 * hh) * a * g})`; ctx.fillRect(x - w / 2, M.y - M.h / 2, w, M.h);
      Ink.path(ctx, [[x - w / 2, M.y - M.h / 2], [x + w / 2, M.y - M.h / 2], [x + w / 2, M.y + M.h / 2], [x - w / 2, M.y + M.h / 2], [x - w / 2, M.y - M.h / 2]], { w: 4, p: g, alpha: a, seed: 1210 + i, taper: [0, 0], wob: 0.12 });
      [-1, 1].forEach((sd, j) => { ctx.strokeStyle = `rgba(${LI.INK_RGB},${0.5 * a * g})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x + sd * w * 0.3, M.y + M.h / 2, 9, Math.PI, 0); ctx.stroke(); });
      T(ctx, op, x, M.y + 2, { size: M.s, alpha: a * seg(g, 0.5, 1) });
    });
  }
  /** a ball carrying a number along the pipe; vals[i] is the value after i boxes; p: 0..1 along the pipe */
  function ball(ctx, M, vals, p, a) {
    if (a <= 0 || p <= 0 || p >= 1) return;
    const x = lerp(M.xin, M.xout, p); let i = 0; M.xs.forEach((bx) => { if (x > bx) i++; });
    const inside = M.xs.some((bx) => Math.abs(x - bx) < M.w / 2 - 6); if (inside) return;
    ctx.fillStyle = `rgba(${LI.AMBER_RGB},${0.9 * a})`; ctx.beginPath(); ctx.arc(x, M.y, M.r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = `rgba(${LI.INK_RGB},${0.7 * a})`; ctx.lineWidth = 3; ctx.stroke();
    const s = String(vals[i]); T(ctx, s, x, M.y + 2, { size: M.r * (s.length > 2 ? 0.95 : 1.2), alpha: a });
  }

  /** an ink (not amber) cross for "not divisible" */
  function crossInk(ctx, x, y, r, p, a = 1) {
    if (p <= 0 || a <= 0) return;
    Ink.path(ctx, [[x - r, y - r], [x + r, y + r]], { w: 6, p: clamp(p * 2), alpha: a, seed: 421, taper: [0.1, 0.3] });
    Ink.path(ctx, [[x + r, y - r], [x - r, y + r]], { w: 6, p: clamp(p * 2 - 1), alpha: a, seed: 422, taper: [0.1, 0.3] });
  }

  /** Nokta, as a function of time */
  function nokta(t, env) {
    const L = KD.L(env);
    const p = { x: L.nx, y: L.gy, s: L.s, mouth: 0.4, brow: 0.1 };
    const g = outCubic(seg(t, 1.3, 2.3));
    p.born = { body: lerp(0.3, 1, g), legs: outCubic(seg(t, 2.0, 2.6)), arms: outCubic(seg(t, 2.3, 2.8)), tuft: outBack(seg(t, 2.5, 2.9)) };
    if (t < 3.0) { p.sq = lerp(0.4, 1, clamp(LI.E.spring(seg(t, 1.3, 3.0) * 2, 8, 3.4), 0, 1.3)); p.drop = 1 - g; p.wobble = 1 - seg(t, 1.3, 2.8); }
    p.eyeOpen = outCubic(seg(t, 2.8, 3.1));
    KD.look(p, [L.M2.xs[0], L.M2.y]);
    if ((t > 20 && t < 30) || (t > 34 && t < 46) || (t > 57 && t < 66) || (t > 71 && t < 80)) KD.look(p, [L.E.x, L.E.y[1]]);
    if (t > 80 && t < 84) KD.look(p, [L.SUM.x, L.SUM.y[1]]);
    if (t > 2.9 && t < 5.6) { p.hold = 'brush'; p.brushAng = -0.8 + 0.3 * Math.sin(t * 9); p.hands = { R: [1.35, -0.2 + 0.15 * Math.sin(t * 9)] }; }
    const pointing = (a, b) => { if (t > a && t < b) { p.point = 'R'; p.hands = { L: [-1.2, 0.55], R: [1.5, -0.35] }; } };
    pointing(11.0, 12.6); pointing(23.4, 25.0); pointing(31.0, 32.6); pointing(40.6, 42.2); pointing(55.0, 56.6); pointing(76.0, 77.6); pointing(80.6, 82.4);
    const think = seg(t, 66.8, 67.2) * (1 - seg(t, 71.0, 71.3));
    if (think > 0) { p.hands = { L: [-1.2, 0.55], R: [0.75, -1.05 + 0.08 * Math.sin(t * 14)] }; p.brow = -0.5 * think; p.mouth = 0; p.lookY -= 0.3; }
    if ((t > 51.4 && t < 52.4) || (t > 42.4 && t < 43.4)) { p.mouthOpen = 0.55; p.eyeScale = 1.1; }
    const joy = (a, b) => { if (t > a && t < b) { p.squint = 1; p.mouth = 1; p.sq = 1 + 0.1 * hump(t, a, a + 0.6); p.y -= 26 * hump(t, a, a + 0.6); p.hands = { L: [-1.3, -0.35], R: [1.3, -0.35] }; } };
    joy(26.0, 27.6); joy(62.0, 63.6); joy(77.8, 79.4);
    if (t > 84.0) {
      const j = (t - 84.0) % 1.4;
      p.squint = 1; p.mouth = 1; p.turn = 0.15; p.lookX = 0.3; p.lookY = 0;
      p.sq = 1 + 0.1 * Math.sin(Math.PI * clamp(j / 0.6)); p.y -= 40 * Math.sin(Math.PI * clamp(j / 0.6));
      p.hands = { L: [-1.35, -0.6 - 0.2 * Math.sin(t * 6)], R: [1.35, -0.6 + 0.2 * Math.sin(t * 6)] };
      if (t > 89.2) { p.squint = 0; p.lookX = 0; p.lookY = 0.2; p.turn = 0; p.y = L.gy; p.sq = 1; p.hands = { L: [-1.2, 0.55], R: [1.2, -1.0 + 0.25 * Math.sin(t * 10)] }; }
    }
    p.blink = Math.max(hump(t, 5.8, 5.95), hump(t, 18.0, 18.15), hump(t, 33.0, 33.15), hump(t, 50.0, 50.15), hump(t, 70.0, 70.15), hump(t, 81.0, 81.15));
    return p;
  }

  function base(ctx, env, t, cam, drawBefore) {
    const L = KD.L(env);
    LI.Ambient.specks(ctx, env, cam, t, { alpha: 0.22, n: 18, depth: 0.4, seed: 21 });
    LI.Camera.apply(ctx, env, cam);
    KD.ground(ctx, env, L.nx, L.gy);
    if (drawBefore) drawBefore();
    LI.Nokta.draw(ctx, LI.Nokta.follow((tt) => nokta(tt, env), t), t);
    if (t < 1.35 && t > 0.3) { const f = seg(t, 0.3, 1.3); Ink.dot(ctx, L.nx, lerp(-700, L.gy - 14, f * f), 15, { seed: 2, bleed: 0 }); }
    if (t > 1.3) Ink.drops(ctx, L.nx, L.gy - 4, t - 1.3, { n: 9, seed: 5, ground: L.gy + 4, scale: 0.8, alpha: 1 - seg(t, 4, 8) * 0.6 });
    return L;
  }

  LI.Film = { T, AMB, width, fit, tick, cross, crossInk, expr, fr, machine, ball, nokta, base };
})(window.LI = window.LI || {});
