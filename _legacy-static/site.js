/* ============================================================
   ABDUSSAMAD IBRAHIM — Field Archive
   Shared interaction layer. Vanilla, no dependencies.
   ============================================================ */
(function () {
  'use strict';

  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FINE = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var lerp = function (a, b, n) { return a + (b - a) * n; };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };

  /* ---------- THEME ---------- */
  var THEME_KEY = 'ai-theme';
  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    try { localStorage.setItem(THEME_KEY, t); } catch (e) {}
    $$('[data-theme-toggle]').forEach(function (b) {
      b.setAttribute('aria-label', t === 'paper' ? 'Switch to dark archive' : 'Switch to paper');
      var s = $('[data-theme-icon]', b);
      if (s) s.textContent = t === 'paper' ? '☾' : '☀';
    });
  }
  (function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch (e) {}
    applyTheme(saved || 'archive');
  })();
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-theme-toggle]');
    if (!b) return;
    applyTheme(document.documentElement.getAttribute('data-theme') === 'paper' ? 'archive' : 'paper');
  });

  /* ---------- PRELOADER ----------
     Driven by rAF, but never dependent on it: a watchdog timer always
     dismisses the overlay. Without this, a throttled tab (backgrounded
     on load, reduced-power mode, headless) would strand the visitor on
     the loading screen with the body scroll-locked. */
  (function preloader() {
    var pre = $('.pre');
    if (!pre) return;
    var numEl = $('.pre-num', pre), barEl = $('.pre-bar i', pre);
    var dur = RM ? 220 : 1100, t0 = null, done = false, watchdog;

    document.body.classList.add('noscroll');

    function paint(p) {
      var eased = 1 - Math.pow(1 - p, 3);
      if (numEl) numEl.textContent = String(Math.round(eased * 100)).padStart(3, '0');
      if (barEl) barEl.style.width = (eased * 100) + '%';
    }

    function finish() {
      if (done) return;
      done = true;
      clearTimeout(watchdog);
      paint(1);
      pre.setAttribute('hidden-anim', '');
      document.body.classList.remove('noscroll');
      document.body.setAttribute('data-ready', '');
      setTimeout(function () { if (pre.parentNode) pre.remove(); }, 700);
      kickHero();
      restoreHash();
    }

    /* The scroll-lock above eats the browser's own jump to #hash on load,
       so deep links (index.html#work) would otherwise land at the top. */
    function restoreHash() {
      if (!location.hash || location.hash === '#') return;
      var t;
      try { t = document.querySelector(location.hash); } catch (e) { return; }
      if (!t) return;
      requestAnimationFrame(function () {
        window.scrollTo({ top: t.getBoundingClientRect().top + scrollY - 86, behavior: 'auto' });
      });
      setTimeout(function () {
        window.scrollTo({ top: t.getBoundingClientRect().top + scrollY - 86, behavior: 'auto' });
      }, 60);
    }

    function frame(t) {
      if (done) return;
      if (t0 === null) t0 = t;
      var p = clamp((t - t0) / dur, 0, 1);
      paint(p);
      if (p < 1) requestAnimationFrame(frame);
      else setTimeout(finish, RM ? 0 : 180);
    }
    requestAnimationFrame(frame);

    // Hard ceiling — fires whether or not a single frame was ever served.
    watchdog = setTimeout(finish, dur + 900);
    // Nothing left to wait for once everything has loaded.
    window.addEventListener('load', function () { setTimeout(finish, dur + 200); });
  })();

  function kickHero() {
    $$('[data-hero] .linemask, [data-hero] [data-rv], [data-hero] .clipr').forEach(function (el, i) {
      setTimeout(function () { el.classList.add('in'); }, RM ? 0 : i * 55);
    });
  }
  // Fallback if no preloader on page
  if (!$('.pre')) { document.body.setAttribute('data-ready', ''); requestAnimationFrame(kickHero); }

  /* ---------- REVEAL ---------- */
  (function reveal() {
    var els = $$('[data-rv], .linemask, .clipr').filter(function (el) { return !el.closest('[data-hero]'); });
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -9% 0px', threshold: 0.08 });
    els.forEach(function (e) { io.observe(e); });
  })();

  /* ---------- HEADER ---------- */
  (function header() {
    var hdr = $('.hdr');
    if (!hdr) return;
    var last = 0;
    function onScroll() {
      var y = window.scrollY;
      hdr.classList.toggle('stuck', y > 40);
      hdr.classList.toggle('hide', y > last && y > 420 && !$('.drawer.on'));
      last = y;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    var burger = $('.burger'), drawer = $('.drawer');
    if (burger && drawer) {
      burger.addEventListener('click', function () {
        var on = drawer.classList.toggle('on');
        burger.classList.toggle('on', on);
        burger.setAttribute('aria-expanded', on);
        document.body.classList.toggle('noscroll', on);
      });
      $$('a', drawer).forEach(function (a) {
        a.addEventListener('click', function () {
          drawer.classList.remove('on'); burger.classList.remove('on');
          document.body.classList.remove('noscroll');
        });
      });
    }
  })();

  /* ---------- CLOCK (Kaduna / WAT, UTC+1) ---------- */
  (function clock() {
    var els = $$('[data-clock]');
    if (!els.length) return;
    function tick() {
      var d = new Date();
      var wat = new Date(d.getTime() + (d.getTimezoneOffset() * 60000) + 3600000);
      var h = wat.getHours(), m = wat.getMinutes(), s = wat.getSeconds();
      var pad = function (v) { return String(v).padStart(2, '0'); };
      els.forEach(function (el) {
        el.innerHTML = 'Kaduna, NG&nbsp; ' + pad(h) + '<i>:</i>' + pad(m) + '<i>:</i>' + pad(s);
      });
    }
    tick(); setInterval(tick, 1000);
  })();

  /* ---------- CURSOR ---------- */
  (function cursor() {
    if (!FINE || RM) return;
    var dot = document.createElement('div'); dot.className = 'cursor';
    var lbl = document.createElement('div'); lbl.className = 'cursor-lbl';
    document.body.appendChild(dot); document.body.appendChild(lbl);
    var mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my, woke = false;
    window.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      if (!woke) { woke = true; cx = mx; cy = my; dot.classList.add('woke'); }
    }, { passive: true });
    (function loop() {
      cx = lerp(cx, mx, 0.19); cy = lerp(cy, my, 0.19);
      dot.style.transform = 'translate(' + cx + 'px,' + cy + 'px)';
      lbl.style.transform = 'translate(' + cx + 'px,' + cy + 'px)';
      requestAnimationFrame(loop);
    })();
    document.addEventListener('mouseover', function (e) {
      var t = e.target.closest('[data-cursor]');
      if (t) { dot.classList.add('is-big'); lbl.classList.add('on'); lbl.textContent = t.getAttribute('data-cursor'); }
      else if (e.target.closest('a,button,[role="button"]')) { dot.classList.add('is-big'); lbl.classList.remove('on'); }
      else { dot.classList.remove('is-big'); lbl.classList.remove('on'); }
    });
  })();

  /* ---------- MAGNETIC ---------- */
  (function magnetic() {
    if (!FINE || RM) return;
    $$('[data-mag]').forEach(function (el) {
      var str = parseFloat(el.getAttribute('data-mag')) || 0.32;
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * str) + 'px,'
                                          + ((e.clientY - r.top - r.height / 2) * str) + 'px)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transition = 'transform .55s cubic-bezier(.16,1,.3,1)';
        el.style.transform = '';
        setTimeout(function () { el.style.transition = ''; }, 560);
      });
    });
  })();

  /* ---------- MARQUEE (duplicate track for seamless loop) ---------- */
  $$('.marq').forEach(function (m) {
    var t = $('.marq-t', m);
    if (t && m.children.length === 1) {
      var c = t.cloneNode(true); c.setAttribute('aria-hidden', 'true'); m.appendChild(c);
    }
  });

  /* ---------- COUNT-UP ---------- */
  (function countup() {
    var els = $$('[data-count]');
    if (!els.length || !('IntersectionObserver' in window)) {
      els.forEach(function (e) { e.textContent = e.getAttribute('data-count'); });
      return;
    }
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target, to = parseFloat(el.getAttribute('data-count')), t0 = null, dur = RM ? 1 : 1250;
        io.unobserve(el);
        (function run(t) {
          if (t0 === null) t0 = t;
          var p = clamp((t - t0) / dur, 0, 1);
          el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * to);
          if (p < 1) requestAnimationFrame(run);
        })(performance.now());
      });
    }, { threshold: 0.5 });
    els.forEach(function (e) { io.observe(e); });
  })();

  /* ---------- SCRAMBLE TEXT ---------- */
  (function scramble() {
    if (RM) return;
    var CH = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\|<>*#';
    $$('[data-scramble]').forEach(function (el) {
      var orig = el.textContent, raf, frame = 0;
      el.addEventListener('mouseenter', function () {
        cancelAnimationFrame(raf); frame = 0;
        var q = orig.split('').map(function (c, i) { return { c: c, start: i * 1.4, end: i * 1.4 + 9 }; });
        (function run() {
          var out = '', done = 0;
          q.forEach(function (o, i) {
            if (frame >= o.end) { done++; out += o.c; }
            else if (frame >= o.start) { out += o.c === ' ' ? ' ' : CH[Math.floor(Math.random() * CH.length)]; }
            else { out += o.c === ' ' ? ' ' : ''; }
          });
          el.textContent = out;
          if (done < q.length) { frame++; raf = requestAnimationFrame(run); }
          else { el.textContent = orig; }
        })();
      });
      el.addEventListener('mouseleave', function () { cancelAnimationFrame(raf); el.textContent = orig; });
    });
  })();

  /* ---------- WORK INDEX: view switch + float preview ---------- */
  (function workIndex() {
    var idx = $('.idx');
    if (!idx) return;
    var seg = $('.seg[data-idx-seg]');
    if (seg) {
      $$('button', seg).forEach(function (b) {
        b.addEventListener('click', function () {
          $$('button', seg).forEach(function (x) { x.setAttribute('aria-selected', 'false'); });
          b.setAttribute('aria-selected', 'true');
          idx.setAttribute('data-view', b.getAttribute('data-v'));
          try { localStorage.setItem('ai-idxview', b.getAttribute('data-v')); } catch (e) {}
        });
      });
      var saved = null;
      try { saved = localStorage.getItem('ai-idxview'); } catch (e) {}
      if (saved) {
        var tgt = $('button[data-v="' + saved + '"]', seg);
        if (tgt) tgt.click();
      }
    }

    if (!FINE) return;
    var float = document.createElement('div'); float.className = 'idx-float';
    var fimg = document.createElement('img'); fimg.alt = ''; float.appendChild(fimg);
    document.body.appendChild(float);
    var fx = 0, fy = 0, tx = 0, ty = 0, on = false;
    window.addEventListener('mousemove', function (e) { tx = e.clientX; ty = e.clientY; }, { passive: true });
    (function loop() {
      fx = lerp(fx, tx, 0.13); fy = lerp(fy, ty, 0.13);
      float.style.transform = 'translate(' + fx + 'px,' + fy + 'px)';
      requestAnimationFrame(loop);
    })();
    $$('.idx-item', idx).forEach(function (item) {
      item.addEventListener('mouseenter', function () {
        if (idx.getAttribute('data-view') !== 'list') return;
        var src = item.getAttribute('data-preview');
        if (!src) return;
        fimg.src = src; float.classList.add('on'); on = true;
      });
      item.addEventListener('mouseleave', function () { float.classList.remove('on'); on = false; });
    });
  })();

  /* ---------- LIGHTBOX ---------- */
  (function lightbox() {
    var triggers = $$('[data-lb]');
    if (!triggers.length) return;
    var groups = {};
    triggers.forEach(function (t) {
      var g = t.getAttribute('data-lb') || 'default';
      (groups[g] = groups[g] || []).push(t);
    });

    var lb = document.createElement('div');
    lb.className = 'lb'; lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Image viewer');
    lb.innerHTML =
      '<div class="lb-hd"><span class="mono" data-lb-cap></span>' +
      '<button class="lb-x" aria-label="Close viewer">✕</button></div>' +
      '<div class="lb-stage"><img alt=""></div>' +
      '<div class="lb-ft"><span class="mono" data-lb-cnt></span>' +
      '<div class="lb-nav"><button data-lb-prev aria-label="Previous image">←</button>' +
      '<button data-lb-next aria-label="Next image">→</button></div></div>';
    document.body.appendChild(lb);

    var img = $('img', lb), cap = $('[data-lb-cap]', lb), cnt = $('[data-lb-cnt]', lb);
    var list = [], i = 0, lastFocus = null;

    function show(n) {
      i = (n + list.length) % list.length;
      var t = list[i];
      img.src = t.getAttribute('data-lb-src') || t.querySelector('img').src;
      img.alt = t.getAttribute('data-lb-alt') || (t.querySelector('img') || {}).alt || '';
      cap.textContent = t.getAttribute('data-lb-cap') || '';
      cnt.textContent = String(i + 1).padStart(2, '0') + ' / ' + String(list.length).padStart(2, '0');
    }
    function open(t) {
      list = groups[t.getAttribute('data-lb') || 'default'];
      lastFocus = document.activeElement;
      show(list.indexOf(t));
      lb.classList.add('on'); document.body.classList.add('noscroll');
      $('.lb-x', lb).focus();
    }
    function close() {
      lb.classList.remove('on'); document.body.classList.remove('noscroll');
      if (lastFocus) lastFocus.focus();
    }
    triggers.forEach(function (t) {
      t.addEventListener('click', function (e) { e.preventDefault(); open(t); });
      if (t.tagName !== 'BUTTON' && t.tagName !== 'A') {
        t.setAttribute('role', 'button'); t.setAttribute('tabindex', '0');
        t.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(t); }
        });
      }
    });
    $('.lb-x', lb).addEventListener('click', close);
    $('[data-lb-prev]', lb).addEventListener('click', function () { show(i - 1); });
    $('[data-lb-next]', lb).addEventListener('click', function () { show(i + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target.closest('.lb-stage')) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('on')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(i - 1);
      if (e.key === 'ArrowRight') show(i + 1);
    });
  })();

  /* ---------- SCROLLSPY (case study chapter nav) ---------- */
  (function spy() {
    var nav = $('[data-spy-nav]');
    if (!nav || !('IntersectionObserver' in window)) return;
    var links = $$('a', nav);
    var secs = links.map(function (a) { return $(a.getAttribute('href')); }).filter(Boolean);
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) {
          a.setAttribute('aria-current', a.getAttribute('href') === '#' + en.target.id ? 'true' : 'false');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    secs.forEach(function (s) { io.observe(s); });
  })();

  /* ---------- PROGRESS BAR ---------- */
  (function progress() {
    var bar = $('[data-progress]');
    if (!bar) return;
    function upd() {
      var h = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = 'scaleX(' + (h > 0 ? clamp(scrollY / h, 0, 1) : 0) + ')';
    }
    window.addEventListener('scroll', upd, { passive: true });
    window.addEventListener('resize', upd); upd();
  })();

  /* ---------- COPY-ON-CLICK SWATCHES ---------- */
  document.addEventListener('click', function (e) {
    var sw = e.target.closest('[data-copy]');
    if (!sw) return;
    var val = sw.getAttribute('data-copy');
    var done = function () {
      var f = sw.querySelector('[data-copy-fb]');
      if (!f) return;
      var old = f.textContent; f.textContent = 'Copied';
      setTimeout(function () { f.textContent = old; }, 1300);
    };
    if (navigator.clipboard) navigator.clipboard.writeText(val).then(done, done);
    else done();
  });

  /* ---------- PARALLAX ---------- */
  (function parallax() {
    if (RM) return;
    var els = $$('[data-px]');
    if (!els.length) return;
    var ticking = false;
    function upd() {
      var vh = innerHeight;
      els.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        var amt = parseFloat(el.getAttribute('data-px')) || 12;
        var prog = (r.top + r.height / 2 - vh / 2) / vh;
        el.style.transform = 'translate3d(0,' + (-prog * amt) + '%,0)';
      });
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(upd); }
    }, { passive: true });
    upd();
  })();

  /* ---------- COMPARE SLIDER ---------- */
  $$('[data-compare]').forEach(function (box) {
    var top = $('.cmp-top', box), handle = $('.cmp-handle', box), drag = false;
    function set(x) {
      var r = box.getBoundingClientRect();
      var p = clamp((x - r.left) / r.width, 0, 1) * 100;
      top.style.clipPath = 'inset(0 ' + (100 - p) + '% 0 0)';
      handle.style.left = p + '%';
      handle.setAttribute('aria-valuenow', Math.round(p));
    }
    set(box.getBoundingClientRect().left + box.getBoundingClientRect().width * 0.5);
    var start = function () { drag = true; box.classList.add('dragging'); };
    var end = function () { drag = false; box.classList.remove('dragging'); };
    box.addEventListener('mousedown', function (e) { start(); set(e.clientX); });
    window.addEventListener('mousemove', function (e) { if (drag) set(e.clientX); });
    window.addEventListener('mouseup', end);
    box.addEventListener('touchstart', function (e) { start(); set(e.touches[0].clientX); }, { passive: true });
    box.addEventListener('touchmove', function (e) { if (drag) set(e.touches[0].clientX); }, { passive: true });
    window.addEventListener('touchend', end);
    handle.addEventListener('keydown', function (e) {
      var cur = parseFloat(handle.style.left) || 50, step = e.shiftKey ? 10 : 3;
      if (e.key === 'ArrowLeft') { e.preventDefault(); cur -= step; }
      else if (e.key === 'ArrowRight') { e.preventDefault(); cur += step; }
      else return;
      var r = box.getBoundingClientRect();
      set(r.left + r.width * clamp(cur, 0, 100) / 100);
    });
  });

  /* ---------- ACCORDION ---------- */
  $$('[data-acc] > .acc-item').forEach(function (item) {
    var btn = $('.acc-hd', item), pnl = $('.acc-bd', item);
    if (!btn || !pnl) return;
    btn.addEventListener('click', function () {
      var open = item.classList.toggle('on');
      btn.setAttribute('aria-expanded', open);
      pnl.style.height = open ? pnl.scrollHeight + 'px' : '0px';
    });
  });

  /* ---------- ANCHOR OFFSET ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]:not([href="#"])');
    if (!a) return;
    var t = document.querySelector(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    var y = t.getBoundingClientRect().top + scrollY - 86;
    window.scrollTo({ top: y, behavior: RM ? 'auto' : 'smooth' });
  });

})();
