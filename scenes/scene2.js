/* SAHNE 2 — ALGORİTMA VE TABLO (10–30 s) */
(function (LI) {
  'use strict';
  const KD = LI.KD, F = () => LI.Film;
  function camera(t, env) { return LI.Camera.breathe(KD.cam(env, { zoom: 1 }), t, 0.4); }
  function render(ctx, lt, env, t) { F().base(ctx, env, t, camera(t, env), () => LI.world(ctx, env, t)); }
  LI.registerScene({ id: 2, start: 10, end: 30, name: 'Algorithm and table', nameTr: 'Algoritma ve tablo', concept: '× 2, then + 3', conceptTr: '× 2, sonra + 3', render });
})(window.LI = window.LI || {});
