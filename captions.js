/* ─────────────────────────────────────────────────────────────
   ALTYAZILAR / CAPTIONS — düzenlenebilir.
   Kısa, tek fikir, 6. sınıf dili. start/end saniye cinsinden.
   note: öğretmen için önerilen seslendirme cümlesi.
   ───────────────────────────────────────────────────────────── */
(function (root) {
  const CAPTIONS = [
    { scene: 1, start: 4.4, end: 10.2, tr: 'Sayı makinesi: 5 girdi, 13 çıktı', en: 'A number machine: 5 in, 13 out',
      note: 'Bu bir sayı makinesi. İçine 5 attık, önce 10 oldu, sonra 13 olarak çıktı. Makinenin içinde hangi adımlar var?' },
    { scene: 2, start: 10.8, end: 20.6, tr: 'Algoritma: önce 2 ile çarp, sonra 3 ekle', en: 'The algorithm: multiply by 2, then add 3',
      note: 'Makinenin algoritması iki adım: önce 2 ile çarp, sonra 3 ekle. 1, 2, 3 ve 4’ü atalım: 5, 7, 9 ve 11 çıkıyor.' },
    { scene: 2, start: 20.8, end: 29.8, tr: 'Giren 1 artınca çıkan 2 artıyor', en: 'One more in, two more out',
      note: 'Tabloya bakalım: giren sayı 1 artınca çıkan sayı 2 artıyor. Çıkan sayı, giren sayının 2 katının 3 fazlası.' },
    { scene: 3, start: 30.4, end: 37.6, tr: 'n girerse 2n + 3 çıkar', en: 'n in, 2n + 3 out',
      note: 'Giren sayıya n diyelim. 2 ile çarpınca 2n, 3 ekleyince 2n + 3 olur. Bu cebirsel ifade makinenin algoritmasını anlatır.' },
    { scene: 3, start: 37.8, end: 45.8, tr: 'Sıra değişirse sonuç değişir: 5 ve 8', en: 'Change the order, change the result: 5 and 8',
      note: 'Adımların sırasını değiştirirsek ne olur? Önce 3 ekleyip sonra 2 ile çarparsak (n + 3) × 2, yani 2n + 6 olur. n = 1 için biri 5, öteki 8 verir. Sıra önemli!' },
    { scene: 4, start: 46.6, end: 53.6, tr: '7 tuttum: 10, 20, 14, 7!', en: 'I picked 7: 10, 20, 14, 7!',
      note: 'Bir sihir numarası: aklından bir sayı tut. 3 ekle, 2 ile çarp, 6 çıkar, 2’ye böl. 7 tuttuk: 10, 20, 14 ve yine 7!' },
    { scene: 4, start: 53.8, end: 60.0, tr: 'n → n + 3 → 2n + 6 → 2n → n', en: 'n → n + 3 → 2n + 6 → 2n → n',
      note: '12 tutsak da 12 çıkıyor. Nedenini cebirle görelim: n, n + 3, 2n + 6, 2n ve yine n.' },
    { scene: 4, start: 60.2, end: 65.8, tr: 'Her adım bir öncekini geri alıyor', en: 'Each step undoes an earlier one',
      note: 'Eklenen 6, çıkarılan 6 ile; 2 ile çarpma, 2’ye bölme ile geri alınıyor. Geriye tuttuğun sayı kalıyor.' },
    { scene: 5, start: 66.6, end: 73.8, tr: 'Gizemli makine: 1→2, 2→5, 3→8', en: 'A mystery machine: 1→2, 2→5, 3→8',
      note: 'İçini göremediğimiz bir makine: 1 girince 2, 2 girince 5, 3 girince 8 çıkıyor. Giren 1 artınca çıkan 3 artıyor; demek ki içinde 3 ile çarpma var.' },
    { scene: 5, start: 74.0, end: 79.8, tr: 'İçindeki algoritma: 3n − 1', en: 'The algorithm inside: 3n − 1',
      note: '1 çarpı 3, 3 eder ama çıkan 2; demek ki sonra 1 çıkarılıyor. Makine 3n − 1. n = 10 için 29 çıkar.' },
    { scene: 6, start: 80.6, end: 86.4, tr: 'Algoritma, tablo ve cebirsel ifade', en: 'Algorithm, table and expression',
      note: 'Aklında kalsın: algoritma sırayla yapılan adımlardır. Tabloya döküp ilişkiyi bulur, cebirsel ifadeyle yazarız. Adımların sırası önemlidir.' },
    { scene: 6, start: 86.8, end: 91.0, tr: 'Artık makinelerin sırrını çözebilirsin!', en: 'Now you can crack any machine!',
      note: 'Artık sayı makinelerinin sırrını çözebilirsin!' },
  ];
  if (typeof module !== 'undefined' && module.exports) module.exports = CAPTIONS;
  else { root.LI = root.LI || {}; root.LI.CAPTIONS = CAPTIONS; }
})(typeof window !== 'undefined' ? window : globalThis);
