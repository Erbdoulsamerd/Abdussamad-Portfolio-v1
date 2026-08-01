/* ============================================================
   TEN DIRECTIONS — stage scaling + fullscreen stepper
   Stages are authored at 1280×800 and scaled to their viewport,
   so card and fullscreen show the identical composition.
   ============================================================ */
(function () {
  'use strict';

  var W = 1280, H = 800;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- SCALE ---------- */
  function fit(dp) {
    var stage = $('.dp-stage', dp);
    if (!stage) return;
    var r = dp.getBoundingClientRect();
    if (!r.width) return;
    stage.style.setProperty('--s', Math.min(r.width / W, r.height / H));
  }
  function fitAll() { $$('.dp').forEach(fit); }

  if ('ResizeObserver' in window) {
    var ro = new ResizeObserver(function (entries) {
      entries.forEach(function (en) { fit(en.target); });
    });
    $$('.dp').forEach(function (dp) { ro.observe(dp); });
  }
  window.addEventListener('resize', fitAll);
  window.addEventListener('load', fitAll);
  fitAll();
  // Fonts change nothing about the stage box, but re-fit once they land anyway.
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitAll);

  /* ---------- FULLSCREEN ---------- */
  var cards  = $$('[data-dp]');
  var modal  = $('.dmodal');
  if (!modal || !cards.length) return;

  var host   = $('[data-dm-host]', modal);
  var nameEl = $('[data-dm-name]', modal);
  var noEl   = $('[data-dm-no]', modal);
  var i = 0, lastFocus = null;

  function render(n) {
    i = (n + cards.length) % cards.length;
    var src = cards[i];
    host.innerHTML = '';
    var clone = $('.dp-stage', src).cloneNode(true);
    clone.style.removeProperty('--s');
    host.appendChild(clone);
    nameEl.textContent = src.getAttribute('data-name');
    noEl.textContent = src.getAttribute('data-no');
    requestAnimationFrame(function () { fit(host); });
  }

  function open(n) {
    lastFocus = document.activeElement;
    render(n);
    modal.classList.add('on');
    document.body.classList.add('noscroll');
    $('.dmodal-x', modal).focus();
  }
  function close() {
    modal.classList.remove('on');
    document.body.classList.remove('noscroll');
    host.innerHTML = '';
    if (lastFocus) lastFocus.focus();
  }

  cards.forEach(function (dp, n) {
    dp.setAttribute('role', 'button');
    dp.setAttribute('tabindex', '0');
    dp.setAttribute('aria-label', 'Open ' + dp.getAttribute('data-name') + ' full screen');
    dp.addEventListener('click', function () { open(n); });
    dp.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(n); }
    });
  });

  $('.dmodal-x', modal).addEventListener('click', close);
  $('[data-dm-prev]', modal).addEventListener('click', function () { render(i - 1); });
  $('[data-dm-next]', modal).addEventListener('click', function () { render(i + 1); });
  modal.addEventListener('click', function (e) {
    if (e.target === modal || e.target.classList.contains('dmodal-body')) close();
  });
  document.addEventListener('keydown', function (e) {
    if (!modal.classList.contains('on')) return;
    if (e.key === 'Escape') { close(); }
    else if (e.key === 'ArrowLeft') { render(i - 1); }
    else if (e.key === 'ArrowRight') { render(i + 1); }
  });
  window.addEventListener('resize', function () {
    if (modal.classList.contains('on')) fit(host);
  });

})();
