/* SAHNE 4 — SİHİR NUMARASI (46–66 s) */
(function (LI) {
  'use strict';
  const KD = LI.KD, F = () => LI.Film;
  function camera(t, env) { return LI.Camera.breathe(KD.cam(env, { zoom: 1 }), t, 0.4); }
  function render(ctx, lt, env, t) { F().base(ctx, env, t, camera(t, env), () => LI.world(ctx, env, t)); }
  LI.registerScene({ id: 4, start: 46, end: 66, name: 'A number trick', nameTr: 'Sihir numarası', concept: 'n + 3, 2n + 6, 2n, n', conceptTr: 'n + 3, 2n + 6, 2n, n', render });
})(window.LI = window.LI || {});
