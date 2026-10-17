// Evergreen Events - Main Interactive Utilities
(function() {
  // Sync RTL bootstrap if savedDir is rtl
  if (document.documentElement.getAttribute('dir') === 'rtl') {
    var bsLink = document.getElementById('bs');
    if (bsLink) {
      bsLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.rtl.min.css';
    }
  }

  // Global Click Handlers
  document.addEventListener('click', function(e) {
    // Theme toggle
    var themeBtn = e.target.closest('[data-theme-toggle]');
    if (themeBtn) {
      var current = document.documentElement.getAttribute('data-bs-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      window.setTheme(next);
      return;
    }

    // Direction toggle
    var dirBtn = e.target.closest('[data-dir-toggle]');
    if (dirBtn) {
      var currentDir = document.documentElement.getAttribute('dir') || 'ltr';
      var nextDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
      window.setDir(nextDir);
      return;
    }

    // Password visibility toggle
    var pwBtn = e.target.closest('[data-pw]');
    if (pwBtn) {
      var targetInput = document.getElementById(pwBtn.dataset.pw);
      if (targetInput) {
        var isPassword = targetInput.type === 'password';
        targetInput.type = isPassword ? 'text' : 'password';
        pwBtn.textContent = isPassword ? 'Hide' : 'Show';
        pwBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
      }
      return;
    }

    // Auto-close mobile navigation menu when selecting a link or clicking outside
    var navCollapse = document.querySelector('.navbar-collapse.show');
    if (navCollapse) {
      var navLink = e.target.closest('.nav-link:not(.dropdown-toggle), .dropdown-item, .nav-actions a');
      var isToggler = e.target.closest('.navbar-toggler');
      var isInsideCollapse = e.target.closest('.navbar-collapse');
      if (navLink || (!isInsideCollapse && !isToggler)) {
        if (window.bootstrap && window.bootstrap.Collapse) {
          var bsCollapse = window.bootstrap.Collapse.getInstance(navCollapse);
          if (bsCollapse) {
            bsCollapse.hide();
          } else {
            navCollapse.classList.remove('show');
          }
        } else {
          navCollapse.classList.remove('show');
        }
      }
    }
  });

  // Synchronize navbar toggler icon and aria state cleanly
  var mainNavCollapse = document.getElementById('navMenu');
  var mainToggler = document.querySelector('.site-header .navbar-toggler');
  if (mainNavCollapse && mainToggler) {
    function syncToggler() {
      var isOpen = mainNavCollapse.classList.contains('show');
      mainToggler.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      mainToggler.classList.toggle('collapsed', !isOpen);
      mainToggler.classList.toggle('is-open', isOpen);
    }

    // Force initial state on load: ensure closed menu shows hamburger icon
    syncToggler();

    mainNavCollapse.addEventListener('show.bs.collapse', function() {
      mainToggler.classList.remove('collapsed');
      mainToggler.classList.add('is-open');
      mainToggler.setAttribute('aria-expanded', 'true');
    });

    mainNavCollapse.addEventListener('shown.bs.collapse', syncToggler);

    mainNavCollapse.addEventListener('hide.bs.collapse', function() {
      mainToggler.classList.add('collapsed');
      mainToggler.classList.remove('is-open');
      mainToggler.setAttribute('aria-expanded', 'false');
    });

    mainNavCollapse.addEventListener('hidden.bs.collapse', syncToggler);
  }

  // Ensure Click-Only Behavior for Header Dropdown (No Hover)
  document.querySelectorAll('.site-header .dropdown-toggle').forEach(function(toggle) {
    if (window.bootstrap && window.bootstrap.Dropdown) {
      window.bootstrap.Dropdown.getOrCreateInstance(toggle, {
        autoClose: true
      });
    }
  });

  // Scroll reveal animation observer
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(function(el) {
      revealObserver.observe(el);
    });

    // Number counters
    var counterObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var targetNum = parseInt(el.dataset.count, 10);
        if (isNaN(targetNum)) return;
        var startTime = performance.now();
        var duration = 1400;

        function updateCounter(currentTime) {
          var progress = Math.min((currentTime - startTime) / duration, 1);
          var currentVal = Math.round(targetNum * progress);
          el.textContent = currentVal.toLocaleString('en-IN');
          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          }
        }
        requestAnimationFrame(updateCounter);
        counterObserver.unobserve(el);
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('[data-count]').forEach(function(el) {
      counterObserver.observe(el);
    });
  } else {
    // Fallback for browsers without IntersectionObserver
    document.querySelectorAll('.reveal').forEach(function(el) { el.classList.add('in'); });
    document.querySelectorAll('[data-count]').forEach(function(el) { el.textContent = el.dataset.count; });
  }

  // Global Popup Modal
  window.popup = function(title, message, isSuccess) {
    var modalEl = document.getElementById('globalModal');
    if (!modalEl) {
      var modalHtml = '<div class="modal fade" id="globalModal" tabindex="-1" aria-labelledby="modalTitle" aria-hidden="true">' +
        '<div class="modal-dialog modal-dialog-centered" style="max-width: 440px;">' +
        '<div class="modal-content p-4 text-center position-relative shadow-lg border-0" style="border-radius: 1.25rem;">' +
        '<button type="button" class="btn-close position-absolute top-0 end-0 m-3" data-bs-dismiss="modal" aria-label="Close"></button>' +
        '<div id="modalIcon" class="mb-3 d-flex justify-content-center"></div>' +
        '<h4 id="modalTitle" class="font-serif mb-2 fw-semibold"></h4>' +
        '<p id="modalMsg" class="small mb-4 text-secondary"></p>' +
        '<button type="button" id="modalCloseBtn" class="btn btn-gold w-100 py-2 fw-semibold" data-bs-dismiss="modal">Close</button>' +
        '</div></div></div>';
      document.body.insertAdjacentHTML('beforeend', modalHtml);
      modalEl = document.getElementById('globalModal');
    }

    var iconEl = document.getElementById('modalIcon');
    var titleEl = document.getElementById('modalTitle');
    var msgEl = document.getElementById('modalMsg');
    var closeBtn = document.getElementById('modalCloseBtn') || modalEl.querySelector('button[data-bs-dismiss="modal"]');

    if (iconEl) {
      if (isSuccess) {
        iconEl.innerHTML = '<div class="d-inline-flex align-items-center justify-content-center rounded-circle" style="width: 58px; height: 58px; background: rgba(16, 185, 129, 0.15); color: #10b981;">' +
          '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>' +
          '</div>';
      } else {
        iconEl.innerHTML = '<div class="d-inline-flex align-items-center justify-content-center rounded-circle" style="width: 58px; height: 58px; background: rgba(245, 158, 11, 0.15); color: #d97706;">' +
          '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>' +
          '</div>';
      }
    }
    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.textContent = message;

    // Reset close button text and ensure no leftover redirects
    if (closeBtn) {
      closeBtn.textContent = 'Close';
      closeBtn.onclick = null;
    }

    if (window.bootstrap && window.bootstrap.Modal) {
      var bsModal = window.bootstrap.Modal.getOrCreateInstance(modalEl);
      bsModal.show();
    } else {
      alert(title + '\n' + message);
    }
  };

  // Countdown Timer
  window.countdown = function(targetIsoDate) {
    var el = document.getElementById('cd');
    if (!el) return;

    var targetTime = new Date(targetIsoDate).getTime();

    function update() {
      var now = new Date().getTime();
      var diff = Math.max(0, targetTime - now) / 1000;

      var days = Math.floor(diff / 86400);
      var hours = Math.floor((diff % 86400) / 3600);
      var minutes = Math.floor((diff % 3600) / 60);
      var seconds = Math.floor(diff % 60);

      var units = [
        { label: 'Days', val: days },
        { label: 'Hours', val: hours },
        { label: 'Mins', val: minutes },
        { label: 'Secs', val: seconds }
      ];

      el.innerHTML = units.map(function(u) {
        var str = u.val < 10 ? '0' + u.val : u.val;
        return '<div>' + str + '<small>' + u.label + '</small></div>';
      }).join('');

      if (diff > 0) {
        setTimeout(update, 1000);
      }
    }
    update();
  };
})();