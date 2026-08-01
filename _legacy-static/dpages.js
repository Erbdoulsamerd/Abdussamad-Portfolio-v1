/* ============================================================
   DIRECTION FULL PAGES — shared behaviour
   Reveal on scroll · seamless marquee · draggable collage/stickers
   ============================================================ */
(function () {
  'use strict';
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* reveal */
  var els = $$('[data-rv]');
  if ('IntersectionObserver' in window && !RM) {
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    els.forEach(function (e) { io.observe(e); });
  } else {
    els.forEach(function (e) { e.classList.add('in'); });
  }

  /* seamless marquee — duplicate the track once */
  $$('.pmarq').forEach(function (m) {
    if (m.children.length === 1) {
      var c = m.firstElementChild.cloneNode(true);
      c.setAttribute('aria-hidden', 'true');
      m.appendChild(c);
    }
  });

  /* copy a palette value on click (case-study swatches) */
  document.addEventListener('click', function (e) {
    var sw = e.target.closest('[data-copy]');
    if (!sw) return;
    var fb = sw.querySelector('[data-copy-fb]');
    var done = function () {
      if (!fb) return;
      var old = fb.textContent;
      fb.textContent = 'Copied';
      setTimeout(function () { fb.textContent = old; }, 1300);
    };
    if (navigator.clipboard) navigator.clipboard.writeText(sw.getAttribute('data-copy')).then(done, done);
    else done();
  });

  /* draggable collage / stickers (pointer events, keyboard-safe) */
  var z = 60;
  $$('[data-drag]').forEach(function (el) {
    var dx = 0, dy = 0, sx = 0, sy = 0, on = false;
    el.style.touchAction = 'none';
    el.addEventListener('pointerdown', function (e) {
      on = true; sx = e.clientX - dx; sy = e.clientY - dy;
      el.setPointerCapture(e.pointerId);
      el.classList.add('lift'); el.style.zIndex = ++z;
    });
    el.addEventListener('pointermove', function (e) {
      if (!on) return;
      dx = e.clientX - sx; dy = e.clientY - sy;
      el.style.translate = dx + 'px ' + dy + 'px';
    });
    function end(e) {
      if (!on) return;
      on = false; el.classList.remove('lift');
      try { el.releasePointerCapture(e.pointerId); } catch (err) {}
    }
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
  });
})();
