/* ==========================================================
   NINE MINUTES | ٩ دقايق
   No dependencies. Arabic ships in the markup; EN is the toggle.
   ========================================================== */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var isAr = function () { return document.documentElement.getAttribute('lang') === 'ar'; };
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SVGNS = 'http://www.w3.org/2000/svg';

  var AR = '٠١٢٣٤٥٦٧٨٩';
  function arNum(s) { return String(s).replace(/\d/g, function (d) { return AR[+d]; }).replace(/,/g, '٬').replace(/\./g, '٫'); }
  function fmt(n, dec) {
    var s = dec ? n.toFixed(dec) : Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return isAr() ? arNum(s) : s;
  }

  /* Saudi Arabia keeps UTC+3 all year — no daylight saving — so Jeddah
     time is a fixed offset, cheap enough to read on every frame. */
  function jeddah() {
    var d = new Date(Date.now() + 3 * 3600e3);
    return { h: d.getUTCHours(), m: d.getUTCMinutes(), s: d.getUTCSeconds(), ms: d.getUTCMilliseconds() };
  }
  // open 13:00 → 03:00, every day
  function isOpen(t) { var m = t.h * 60 + t.m; return m >= 780 || m < 180; }
  function hLabel(h, m) {
    var h12 = h % 12 || 12, t = h12 + (m ? ':' + (m < 10 ? '0' : '') + m : '');
    return isAr() ? arNum(t) + (h < 12 ? ' ص' : ' م') : t + (h < 12 ? 'am' : 'pm');
  }

  /* ---------- the station clock ---------- */
  (function ticks() {
    var g = $('#ticks');
    for (var i = 0; i < 60; i++) {
      if (i === 45) continue;                 // the 9 sits where the 9 o'clock bar would
      var hour = i % 5 === 0, r = document.createElementNS(SVGNS, 'rect');
      var w = hour ? 12 : 4, len = hour ? 40 : 12;
      r.setAttribute('x', 200 - w / 2); r.setAttribute('y', 22); r.setAttribute('width', w); r.setAttribute('height', len);
      r.setAttribute('class', 'tk'); r.setAttribute('transform', 'rotate(' + (i * 6) + ' 200 200)');
      g.appendChild(r);
    }
  })();
  var hH = $('#hH'), hM = $('#hM'), hS = $('#hS');
  function hands() {
    var t = jeddah();
    // the famous stop-to-go: the second hand laps in 58.5s, then waits for
    // the minute to turn over before setting off again
    var secs = t.s + t.ms / 1000;
    var sa = Math.min(360, secs / 58.5 * 360);
    var ma = t.m * 6;                       // the minute hand jumps, it does not creep
    var ha = (t.h % 12) * 30 + t.m * .5;
    hS.style.transform = 'rotate(' + (reduce ? t.s * 6 : sa) + 'deg)';
    hM.style.transform = 'rotate(' + ma + 'deg)';
    hH.style.transform = 'rotate(' + ha + 'deg)';
  }
  (function loop() { hands(); requestAnimationFrame(loop); })();
  setInterval(hands, 1000);                   // keeps time even where rAF is throttled

  /* ---------- the 24h strip ---------- */
  function strip() {
    var t = jeddah();
    $('#strip').style.setProperty('--now', ((t.h * 60 + t.m) / 1440 * 100).toFixed(2) + '%');
    var html = '';
    for (var h = 0; h <= 24; h += 3) html += '<span style="--x:' + (h / 24 * 100) + '%">' + hLabel(h % 24, 0) + '</span>';
    $('#stripLbl').innerHTML = html;
    var open = isOpen(t), o = $('#openNow');
    o.classList.toggle('open', open);
    o.textContent = open ? (isAr() ? 'مفتوح · يقفل ٣ الفجر' : 'Open · until 3am') : (isAr() ? 'مغلق · يفتح ١ الظهر' : 'Closed · opens 1pm');
    $('#cap').innerHTML = (isAr() ? 'الحين في جدة <b>' : 'In Jeddah it’s <b>') + hLabel(t.h, t.m) + '</b> — ' +
      (open ? (isAr() ? 'والصالون مفتوح' : 'and the shop is open') : (isAr() ? 'والصالون يفتح ١ الظهر' : 'the shop opens at 1pm'));
  }

  /* ---------- language ---------- */
  var KEY = 'nm-lang', lngTx = $('#lngTx');
  function apply(lang) {
    var d = document.documentElement;
    d.setAttribute('lang', lang); d.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    $$('[data-en]').forEach(function (el) {
      var v = el.getAttribute(lang === 'ar' ? 'data-ar' : 'data-en');
      if (v != null) el.innerHTML = v;
    });
    if (lngTx) lngTx.textContent = lang === 'ar' ? 'EN' : 'ع';
    document.title = lang === 'ar' ? '٩ دقايق للحلاقة | Nine Minutes Barber Shop — السلامة، جدة' : 'Nine Minutes Barber Shop | ٩ دقايق — Al Salamah, Jeddah';
    splitWords($('#heroH'));
    strip();
    $$('.num.done').forEach(function (n) { n.textContent = fmt(+n.getAttribute('data-to'), +(n.getAttribute('data-dec') || 0)); });
  }
  $('#lngBtn').addEventListener('click', function () {
    var next = isAr() ? 'en' : 'ar'; apply(next);
    try { localStorage.setItem(KEY, next); } catch (e) {}
  });

  /* Words, never characters — per-letter spans break Arabic joining. */
  function splitWords(el) {
    var txt = (el.textContent || '').trim(); if (!txt) return;
    el.textContent = '';
    txt.split(/\s+/).forEach(function (w, i) {
      var m = document.createElement('span'); m.className = 'wm';
      var x = document.createElement('i'); x.textContent = w; x.style.setProperty('--i', i);
      m.appendChild(x); el.appendChild(m); el.appendChild(document.createTextNode(' '));
    });
  }

  /* ---------- nav ---------- */
  var nav = $('#nav'), brg = $('#brg'), menu = $('#menu');
  function closeMenu() { menu.classList.remove('open'); brg.classList.remove('on'); brg.setAttribute('aria-expanded', 'false'); document.body.classList.remove('lock'); }
  brg.addEventListener('click', function () {
    nav.classList.remove('slid');
    var o = menu.classList.toggle('open');
    brg.classList.toggle('on', o); brg.setAttribute('aria-expanded', o ? 'true' : 'false');
    document.body.classList.toggle('lock', o);
  });
  $$('a', menu).forEach(function (a) { a.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  /* ---------- counters ---------- */
  function count(el) {
    if (el.classList.contains('done')) return;
    el.classList.add('done');
    var to = +el.getAttribute('data-to'), dec = +(el.getAttribute('data-dec') || 0), t0 = Date.now(), dur = reduce ? 1 : 1300;
    var iv = setInterval(function () {
      var k = Math.min(1, (Date.now() - t0) / dur);
      el.textContent = fmt(to * (1 - Math.pow(1 - k, 3)), dec);
      if (k >= 1) clearInterval(iv);
    }, 30);
  }

  /* ---------- scroll ---------- */
  var reveals = $$('.rv'), dock = $('#dock'), lastY = 0, ticking = false;
  function onScroll() {
    var y = window.scrollY, vh = window.innerHeight;
    nav.classList.toggle('stuck', y > 30);
    if (!menu.classList.contains('open')) {
      if (y > 500 && y > lastY + 4) nav.classList.add('slid');
      else if (y < lastY - 4 || y < 500) nav.classList.remove('slid');
    }
    lastY = y;
    if (dock) dock.classList.toggle('on', y > vh * .6);
    $$('.num:not(.done)').forEach(function (n) { if (n.getBoundingClientRect().top < vh * .95) count(n); });
    for (var i = reveals.length - 1; i >= 0; i--) {
      if (reveals[i].getBoundingClientRect().top < vh * .9) { reveals[i].classList.add('in'); reveals.splice(i, 1); }
    }
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener('resize', onScroll);

  var saved = null; try { saved = localStorage.getItem(KEY); } catch (e) {}
  if (saved === 'en') apply('en'); else { splitWords($('#heroH')); strip(); }
  setInterval(strip, 30000);
  onScroll(); setTimeout(onScroll, 250);
})();
