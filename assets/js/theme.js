// Evergreen Events - Theme & Direction Handler
(function() {
  var html = document.documentElement;
  var savedTheme = localStorage.getItem('eg_theme');
  if (!savedTheme) {
    savedTheme = 'light';
    localStorage.setItem('eg_theme', 'light');
  }
  var savedDir = localStorage.getItem('eg_dir') || 'ltr';

  // Apply theme immediately before render to avoid flash
  html.setAttribute('data-bs-theme', savedTheme);
  html.setAttribute('dir', savedDir);

  function syncThemeUI(theme) {
    var isDark = theme === 'dark';
    var icon = isDark ? '☀️' : '🌙';
    var title = isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme';

    var toggles = document.querySelectorAll('[data-theme-toggle]');
    toggles.forEach(function(btn) {
      btn.setAttribute('title', title);
      btn.setAttribute('aria-label', title);
      var iconSpan = btn.querySelector('.theme-icon');
      if (iconSpan) {
        iconSpan.textContent = icon;
      } else {
        btn.innerHTML = icon;
      }
    });
  }

  window.setTheme = function(theme) {
    html.setAttribute('data-bs-theme', theme);
    localStorage.setItem('eg_theme', theme);
    syncThemeUI(theme);
    // Dispatch event so charts or dynamic elements can react
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: theme } }));
  };

  window.setDir = function(dir) {
    localStorage.setItem('eg_dir', dir);
    html.setAttribute('dir', dir);
    var bsLink = document.getElementById('bs');
    if (bsLink) {
      if (dir === 'rtl') {
        bsLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.rtl.min.css';
      } else {
        bsLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css';
      }
    }
  };

  // Sync RTL stylesheet on initial load if needed
  if (savedDir === 'rtl') {
    document.write('<link id="bs_rtl_init" rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.rtl.min.css">');
  }

  // Update theme icons when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      syncThemeUI(savedTheme);
    });
  } else {
    syncThemeUI(savedTheme);
  }
})();