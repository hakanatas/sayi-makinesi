/* SAHNE 1 — SAYI MAKİNESİ (0–10 s)  A number goes in, a number comes out.
   The whole film's drawing lives in LI.world(t); each scene only sets the camera. */
(function (LI) {
  'use strict';
  const { seg, outBack } = LI.E;
  const KD = LI.KD, F = () => LI.Film, A = LI.Ang, Ink = LI.Ink;
  const END = (t) => 1 - seg(t, 90.4, 91.4);

  function win(t, a, b, fi = 0.4, fo = 0.4) { return seg(t, a, a + fi) * (1 - seg(t, b - fo, b)); }
  function exprs(ctx, t, P, list, sz) {
    const f = F();
    list.forEach(([a, b, items, hot]) => {
      const al = win(t, a, b); if (al <= 0) return;
      f.expr(ctx, typeof items === 'string' ? [items] : items, P.x, P.y, sz ?? P.s, { alpha: al, w: P.w, halo: true, color: hot ? A.amber : undefined });
    });
  }
  const at = (P, k, y) => ({ x: P.x, y: y ?? P.y[k], s: P.s, w: P.w });
  /** algebra labels above the pipe, between boxes */
  function labels(ctx, M, list, t, a) {
    const f = F(), xs = [M.xin].concat(M.xs, [M.xout]);
    list.forEach(([s, t0], i) => {
      const k = seg(t, t0, t0 + 0.5) * a; if (k <= 0) return;
      const x = (xs[i] + xs[i + 1]) / 2 + (i === 0 ? 30 : i === list.length - 1 ? -30 : 0);
      f.T(ctx, s, x, M.ly, Object.assign({ size: M.s * 0.78, alpha: k, halo: true }, i === list.length - 1 ? f.AMB : {}));
    });
  }
  /** a two-row table of inputs and outputs, filled in at the given times */
  function table(ctx, P, head, ins, outs, times, a) {
    if (a <= 0) return;
    const f = F(), X = (i) => P.x0 + i * P.dx;
    f.T(ctx, head[0], P.lx, P.y[0], { size: P.s * 0.8, alpha: a });
    f.T(ctx, head[1], P.lx, P.y[1], { size: P.s * 0.8, alpha: a });
    Ink.path(ctx, [[P.lx - 80, (P.y[0] + P.y[1]) / 2], [X(ins.length - 1) + P.dx / 2, (P.y[0] + P.y[1]) / 2]], { w: 3, alpha: a * 0.5, seed: 1300, taper: [0, 0] });
    ins.forEach((v, i) => {
      const k = times[i] * a; if (k <= 0) return;
      f.T(ctx, String(v), X(i), P.y[0], { size: P.s, alpha: k });
      f.T(ctx, String(outs[i]), X(i), P.y[1] - 10 * (1 - outBack(times[i])), Object.assign({ size: P.s, alpha: k }, f.AMB));
    });
  }

  function context(ctx, env, t) {
    exprs(ctx, t, KD.L(env).CX, [
      [4.4, 10.2, 'Bir sayı giriyor, işlemlerden geçiyor, yeni bir sayı çıkıyor'],
      [10.6, 20.6, 'Algoritma: önce 2 ile çarp, sonra 3 ekle'],
      [20.8, 29.8, 'Tabloya dökelim ve ilişkiyi bulalım'],
      [30.4, 37.6, 'Giren sayıya n diyelim'],
      [37.8, 45.8, 'Adımların sırası önemli!', true],
      [46.4, 53.6, 'Bir sayı tut: 3 ekle, 2 ile çarp, 6 çıkar, 2’ye böl'],
      [53.8, 65.8, 'Hep tuttuğun sayı çıkıyor. Neden?'],
      [66.4, 79.8, 'Gizemli makine: içinde ne var?'],
    ]);
  }

  /* ── 0–46 s: × 2, then + 3 ── */
  const RUN2 = [11.0, 13.4, 15.8, 18.2];
  function first(ctx, env, t) {
    const L = KD.L(env), M = L.M2, f = F(), a = win(t, 4.4, 45.8);
    f.machine(ctx, M, ['× 2', '+ 3'], seg(t, 4.6, 6.4), a, (i) => RUN2.reduce((h, t0) => Math.max(h, LI.E.hump(t, t0 + 0.6 + i * 0.7, t0 + 1.2 + i * 0.7)), 0));
    const intro = seg(t, 6.8, 9.4); if (intro > 0 && t < 10.4) f.ball(ctx, M, [5, 10, 13], intro, a);
    RUN2.forEach((t0, i) => f.ball(ctx, M, [i + 1, 2 * (i + 1), 2 * (i + 1) + 3], seg(t, t0, t0 + 2.2), a));
    table(ctx, L.TB, ['Giren', 'Çıkan'], [1, 2, 3, 4], [5, 7, 9, 11], RUN2.map((t0) => seg(t, t0 + 2.0, t0 + 2.4)), win(t, 10.8, 45.8));
    exprs(ctx, t, at(L.E, 0), [[21.0, 29.8, 'Giren sayı 1 artınca çıkan sayı 2 artıyor']]);
    exprs(ctx, t, at(L.E, 1), [[23.4, 29.8, 'Çıkan = giren × 2 + 3', true]]);
    labels(ctx, M, [['n', 30.8], ['2n', 32.2], ['2n + 3', 33.6]], t, win(t, 30.4, 45.8));
    exprs(ctx, t, at(L.E, 0), [[34.8, 45.8, 'Sözle: sayıyı 2 ile çarp, sonra 3 ekle']]);
    exprs(ctx, t, at(L.E, 1), [[38.2, 45.8, 'Önce 3 ekle, sonra 2 ile çarp: (n + 3) × 2 = 2n + 6']]);
    exprs(ctx, t, at(L.E, 2), [[40.6, 45.8, 'n = 1 için: 1 × 2 + 3 = 5, ama (1 + 3) × 2 = 8', true]]);
  }

  /* ── 46–66 s: the number trick ── */
  function trick(ctx, env, t) {
    const L = KD.L(env), M = L.M4, f = F(), a = win(t, 46.4, 65.8); if (a <= 0) return;
    f.machine(ctx, M, ['+ 3', '× 2', '− 6', '÷ 2'], seg(t, 46.6, 47.4), a);
    f.ball(ctx, M, [7, 10, 20, 14, 7], seg(t, 47.6, 51.4), a);
    f.ball(ctx, M, [12, 15, 30, 24, 12], seg(t, 51.8, 55.0), a);
    const ra = (t0) => { const k = seg(t, t0, t0 + 0.4) * a; return k; };
    const r1 = ra(51.2), r2 = ra(54.8);
    if (r1 > 0) f.T(ctx, '7 tuttum, 7 çıktı', L.E.x, L.E.y[0], Object.assign({ size: L.E.s, alpha: r1 * (1 - seg(t, 54.6, 55.0)), halo: true }, f.AMB));
    if (r2 > 0) f.T(ctx, '12 tuttum, 12 çıktı', L.E.x, L.E.y[0], Object.assign({ size: L.E.s, alpha: r2 * (1 - seg(t, 57.4, 57.8)), halo: true }, f.AMB));
    labels(ctx, M, [['n', 55.4], ['n + 3', 56.0], ['2n + 6', 56.6], ['2n', 57.2], ['n', 57.8]], t, a);
    exprs(ctx, t, at(L.E, 0), [[58.0, 65.8, '+ 3 ve × 2 ile 6 eklendi, − 6 ile geri alındı']]);
    exprs(ctx, t, at(L.E, 1), [[60.2, 65.8, '× 2, ÷ 2 ile geri alındı: geriye n kalır', true]]);
  }

  /* ── 66–80 s: reading a machine backwards ── */
  const RUN1 = [66.8, 68.4, 70.0];
  function mystery(ctx, env, t) {
    const L = KD.L(env), M = L.M1, f = F(), a = win(t, 66.4, 79.8); if (a <= 0) return;
    const rev = seg(t, 76.0, 76.6);
    f.machine(ctx, M, [rev > 0.5 ? '× 3 − 1' : '?'], seg(t, 66.4, 67.0), a);
    RUN1.forEach((t0, i) => f.ball(ctx, M, [i + 1, 3 * (i + 1) - 1], seg(t, t0, t0 + 1.4), a));
    table(ctx, L.TB, ['Giren', 'Çıkan'], [1, 2, 3], [2, 5, 8], RUN1.map((t0) => seg(t, t0 + 1.2, t0 + 1.6)), a);
    exprs(ctx, t, at(L.E, 0), [[72.0, 79.8, 'Giren 1 artınca çıkan 3 artıyor: içinde × 3 var']]);
    exprs(ctx, t, at(L.E, 1), [[74.0, 79.8, '1 × 3 = 3 ama çıkan 2: sonra 1 çıkarılıyor']]);
    exprs(ctx, t, at(L.E, 2), [[76.0, 79.8, 'Makine: 3n − 1 · n = 10 için 29', true]]);
  }

  function summary(ctx, env, t) {
    if (t < 80.4) return;
    const S = KD.L(env).SUM, f = F(), a = END(t);
    [['Algoritma: sırayla yapılan adımlar', 80.6], ['Tabloya dök, ilişkiyi bul', 81.6], ['Cebirsel yaz: 2n + 3', 82.6], ['Adımların sırası önemli', 83.6, true]].forEach(([s, t0, hot], i) => {
      const al = seg(t, t0, t0 + 0.4) * a; if (al <= 0) return;
      f.expr(ctx, [s], S.x, S.y[i], S.s * (i === 3 ? 1.2 : 1), { alpha: al, w: S.w, halo: true, color: hot ? A.amber : undefined });
    });
  }

  LI.fireworks = function (ctx, env, t) {
    const k = seg(t, 84.4, 86.4);
    if (k <= 0 || t >= 91) return;
    const n = F().nokta(t, env), C = [n.x, n.y - 170];
    [30, 60, 90, 120, 150].forEach((d, i) => {
      const r = 150 + 30 * Math.sin(t * 2 + i);
      A.arc(ctx, C, r, d - 12, d + 12, { p: seg(k, i * 0.12, i * 0.12 + 0.4), alpha: 0.8 * (1 - seg(t, 90.2, 91)), w: 6, seed: 80 + i });
    });
  };

  LI.world = function (ctx, env, t) { context(ctx, env, t); first(ctx, env, t); trick(ctx, env, t); mystery(ctx, env, t); summary(ctx, env, t); };

  function camera(t, env) {
    const L = KD.L(env);
    return LI.Camera.breathe(LI.Camera.track([
      [0, KD.cam(env, { x: L.nx, y: env.V ? 380 : 140, zoom: 1.6 })],
      [3.0, KD.cam(env, { x: L.nx, y: env.V ? 380 : 140, zoom: 1.6 })],
      [4.8, KD.cam(env, { zoom: 1 })],
    ], t), t, 0.5);
  }
  function render(ctx, lt, env, t) { F().base(ctx, env, t, camera(t, env), () => LI.world(ctx, env, t)); }
  LI.registerScene({ id: 1, start: 0, end: 10, name: 'A number machine', nameTr: 'Sayı makinesi', concept: 'In, steps, out', conceptTr: 'Gir, işlem, çık', render });
})(window.LI = window.LI || {});
