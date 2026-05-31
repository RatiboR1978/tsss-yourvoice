(function () {
  'use strict';

  /* ── Navbar scroll ─────────────────────────────── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  /* ── Mobile menu ───────────────────────────────── */
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobile-menu');
  let menuOpen = false;

  burger.addEventListener('click', () => {
    menuOpen = !menuOpen;
    burger.classList.toggle('open', menuOpen);
    burger.setAttribute('aria-expanded', menuOpen);
    mobileMenu.setAttribute('aria-hidden', !menuOpen);
    mobileMenu.style.display = menuOpen ? 'flex' : 'none';
  });

  window.closeMobileMenu = function () {
    menuOpen = false;
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    mobileMenu.style.display = 'none';
  };

/* ── IntersectionObserver reveal ──────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => revealObs.observe(el));

  /* ── Program tabs ──────────────────────────────── */
  document.querySelectorAll('.prog-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      document.querySelectorAll('.prog-tab').forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      document.querySelectorAll('.prog-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      document.getElementById('tab-' + target).classList.add('active');
    });
  });

  /* ── Module accordion ───────────────────────────── */
  document.querySelectorAll('[data-module]').forEach(mod => {
    const btn  = mod.querySelector('.prog-module-head');
    const body = mod.querySelector('.prog-module-body');
    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      // close all in this panel
      const panel = mod.closest('.prog-panel');
      panel.querySelectorAll('.prog-module-head').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        b.nextElementSibling.classList.remove('open');
      });
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        body.classList.add('open');
      }
    });
  });

  /* ── Counter animation ─────────────────────────── */
  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1200;
    const start = performance.now();
    function step(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      const val = Math.round(eased * target);
      el.textContent = (val >= 1000 ? (val / 1000).toFixed(0) + ' 000' : val) + suffix;
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const counterEls = document.querySelectorAll('[data-count]');
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCount(e.target);
        counterObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  counterEls.forEach(el => counterObs.observe(el));

  /* ── FAQ accordion ──────────────────────────────── */
  document.querySelectorAll('.faq-q').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var isOpen = btn.getAttribute('aria-expanded') === 'true';
      // close all
      document.querySelectorAll('.faq-q').forEach(function(b) {
        b.setAttribute('aria-expanded', 'false');
        b.nextElementSibling.classList.remove('open');
      });
      // open clicked if was closed
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        btn.nextElementSibling.classList.add('open');
      }
    });
  });

  /* ── Income bars ────────────────────────────────── */
  var incomeObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        var pct = e.target.dataset.incomeBar || '50';
        var fill = e.target.querySelector('.income-bar-fill');
        if (fill) {
          requestAnimationFrame(function() { fill.style.width = pct + '%'; });
        }
        incomeObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('[data-income-bar]').forEach(function(el) {
    incomeObs.observe(el);
  });

  /* ── Player wave bars ───────────────────────────── */
  const PWAVE = [15,22,36,50,62,78,90,78,62,50,38,26,18,26,40,58,74,88,74,58,44,30,20,30,46,64,82,64,46,30];
  [1, 2, 3].forEach(function(id) {
    var wEl = document.getElementById('wave-' + id);
    if (!wEl) return;
    var frag3 = document.createDocumentFragment();
    for (var i = 0; i < 30; i++) {
      var b = document.createElement('div');
      b.className = 'pwbar';
      b.style.height = PWAVE[i % PWAVE.length] + 'px';
      b.style.animationDelay = (i * 0.038) + 's';
      frag3.appendChild(b);
    }
    wEl.appendChild(frag3);
  });

  /* ── Audio players ──────────────────────────────── */
  var AUDIO_URLS = {
    '1': 'https://fs.getcourse.ru/fileservice/file/download/a/630580/sc/244/h/398b9ed2e5d451a0c8e3e46f9511bb3b.mp3',
    '2': 'https://fs.getcourse.ru/fileservice/file/download/a/630580/sc/241/h/b646252ffe3849c3d0ffd1c60731aed4.mp3',
    '3': 'https://fs.getcourse.ru/fileservice/file/download/a/630580/sc/4/h/55fcbcccc379a9bc107acb582dbbbf3a.mp3'
  };

  function fmtTime(s) {
    var m = Math.floor(s / 60), sec = Math.floor(s % 60);
    return m + ':' + (sec < 10 ? '0' : '') + sec;
  }

  var audioEls = {};
  ['1','2','3'].forEach(function(id) {
    var a = new Audio(AUDIO_URLS[id]);
    a.preload = 'none';
    audioEls[id] = a;

    a.addEventListener('timeupdate', function() {
      var pEl = document.getElementById('prog-' + id);
      var cEl = document.getElementById('cur-' + id);
      if (a.duration && pEl) pEl.style.width = (a.currentTime / a.duration * 100) + '%';
      if (cEl) cEl.textContent = fmtTime(a.currentTime);
    });

    a.addEventListener('ended', function() {
      setPlayerUI(id, false);
      var pEl = document.getElementById('prog-' + id);
      var cEl = document.getElementById('cur-' + id);
      if (pEl) pEl.style.width = '0%';
      if (cEl) cEl.textContent = '0:00';
    });

    a.addEventListener('loadedmetadata', function() {
      var durEl = document.querySelector('[data-player="' + id + '"] .player-times span:last-child');
      if (durEl) durEl.textContent = fmtTime(a.duration);
    });

    // click on progress bar to seek
    var wrap = document.querySelector('[data-player="' + id + '"] .player-progress-wrap');
    if (wrap) {
      wrap.style.cursor = 'pointer';
      wrap.addEventListener('click', function(e) {
        if (!a.duration) return;
        var rect = wrap.getBoundingClientRect();
        a.currentTime = ((e.clientX - rect.left) / rect.width) * a.duration;
      });
    }
  });

  function setPlayerUI(id, playing) {
    var card = document.querySelector('[data-player="' + id + '"]');
    if (!card) return;
    card.classList.toggle('playing', playing);
  }

  function stopPlayer(id) {
    audioEls[id].pause();
    setPlayerUI(id, false);
  }

  function startPlayer(id) {
    audioEls[id].play().catch(function() {});
    setPlayerUI(id, true);
  }

  document.querySelectorAll('[data-player-btn]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var id = btn.dataset.playerBtn;
      ['1','2','3'].forEach(function(pid) {
        if (pid !== id && !audioEls[pid].paused) stopPlayer(pid);
      });
      if (!audioEls[id].paused) { stopPlayer(id); } else { startPlayer(id); }
    });
  });

})();
