// Evergreen Events - Client Dashboard Controller
(function() {
  var STORAGE_KEY = 'evergreen_client_dashboard';

  var DEFAULT_DATA = {
    eventName: 'Annual Gala & Holiday Celebration 2026',
    eventDate: '2026-12-18',
    checklist: [
      { text: 'Finalize luxury venue booking & floor layout', done: true },
      { text: 'Select multi-course gourmet banquet menu & tastings', done: true },
      { text: 'Confirm live jazz band and corporate keynote DJ', done: true },
      { text: 'Distribute digital RSVP invitations to department leads', done: false },
      { text: 'Arrange VIP transport & executive valet service', done: false },
      { text: 'Approve custom festive floral arrangements and stage lighting', done: false }
    ],
    rsvp: {
      Invited: 250,
      Confirmed: 184,
      Declined: 22,
      Pending: 44
    },
    vendors: [
      { name: 'The Grand Ballroom & Terrace', service: 'Venue', status: 'Confirmed', contact: '+91 98765 11223' },
      { name: 'Saffron & Truffle Gourmet Catering', service: 'Catering', status: 'Confirmed', contact: '+91 98765 22334' },
      { name: 'Aura Sound & Visual Production', service: 'AV & Lighting', status: 'Confirmed', contact: '+91 98765 33445' },
      { name: 'Soulbeats Live Jazz Quartet', service: 'Entertainment', status: 'Pending', contact: '+91 98765 44556' },
      { name: 'Botanica Luxe Floral Design', service: 'Decor & Florals', status: 'Shortlisted', contact: '+91 98765 55667' },
      { name: 'Apex Executive Security & Valet', service: 'Logistics', status: 'Contacted', contact: '+91 98765 66778' }
    ],
    budget: [
      { category: 'Venue Rental & Hospitality Fee', allocated: 250000, spent: 250000 },
      { category: 'Catering, Beverages & Wine Bar', allocated: 220000, spent: 180000 },
      { category: 'Decor, Stage & Ambient Lighting', allocated: 120000, spent: 95000 },
      { category: 'Live Entertainment & Audio/Visual', allocated: 90000, spent: 65000 },
      { category: 'Guest Favors & Executive Gift Hampers', allocated: 60000, spent: 40000 }
    ],
    requirements: {
      type: 'Corporate Holiday Gala',
      date: '2026-12-18',
      venue: 'Heritage City Ballroom / 5-Star Hotel',
      budget: '740000',
      guests: '250'
    },
    profile: {
      name: 'Priya Sharma',
      company: 'TechSphere Global Innovations',
      email: 'p.sharma@techsphere.example',
      phone: '9876543210'
    }
  };

  // Load from localStorage or initialize with defaults
  var state = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || DEFAULT_DATA;

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    render();
  }

  window.resetDashboardData = function() {
    if (confirm('Reset dashboard to default sample corporate event data?')) {
      state = JSON.parse(JSON.stringify(DEFAULT_DATA));
      saveState();
      window.popup('Reset Complete', 'Default corporate event planning data has been restored.', true);
    }
  };

  function calculateProgress() {
    var totalTasks = state.checklist.length;
    if (totalTasks === 0) return 0;
    var completedTasks = state.checklist.filter(function(item) { return item.done; }).length;
    return Math.round((completedTasks / totalTasks) * 100);
  }

  function render() {
    var progressPercent = calculateProgress();
    var totalSpent = state.budget.reduce(function(sum, b) { return sum + b.spent; }, 0);
    var totalAllocated = state.budget.reduce(function(sum, b) { return sum + b.allocated; }, 0);

    // Overview Stats
    var ovp = document.getElementById('ovp');
    var bar = document.getElementById('bar');
    var ovr = document.getElementById('ovr');
    var ovb = document.getElementById('ovb');
    var daysEl = document.getElementById('eventDays');

    if (ovp) ovp.textContent = progressPercent + '%';
    if (bar) bar.style.width = progressPercent + '%';
    if (ovr) ovr.textContent = state.rsvp.Confirmed;
    if (ovb) ovb.textContent = '₹' + totalSpent.toLocaleString('en-IN');

    // Calculate days remaining to event
    if (daysEl && state.eventDate) {
      var diffMs = new Date(state.eventDate) - new Date();
      var daysLeft = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
      daysEl.textContent = daysLeft;
    }

    // Render Checklist
    var clList = document.getElementById('cl');
    if (clList) {
      clList.innerHTML = state.checklist.map(function(item, idx) {
        return '<li class="list-group-item d-flex justify-content-between align-items-center bg-transparent py-3">' +
          '<div class="form-check">' +
          '<input class="form-check-input" type="checkbox" id="chk_' + idx + '" data-check-idx="' + idx + '" ' + (item.done ? 'checked' : '') + '>' +
          '<label class="form-check-label ' + (item.done ? 'text-decoration-line-through text-muted' : '') + '" for="chk_' + idx + '">' +
          item.text +
          '</label>' +
          '</div>' +
          '<button class="btn btn-sm btn-ghost text-danger border-0 p-1" data-del-task="' + idx + '" title="Remove task">✕</button>' +
          '</li>';
      }).join('');
    }

    // Render RSVP Grid
    var rsvpGrid = document.getElementById('rs');
    if (rsvpGrid) {
      rsvpGrid.innerHTML = Object.keys(state.rsvp).map(function(statusKey) {
        var count = state.rsvp[statusKey];
        var badgeClass = statusKey === 'Confirmed' ? 'text-success' : (statusKey === 'Declined' ? 'text-danger' : 'text-warning');
        return '<div class="col-6 col-md-3">' +
          '<div class="stat">' +
          '<div class="num ' + badgeClass + '">' + count + '</div>' +
          '<div class="fw-semibold">' + statusKey + '</div>' +
          '<div class="mt-3 d-flex justify-content-center gap-2">' +
          '<button class="btn btn-sm btn-ghost px-2" data-rsvp-key="' + statusKey + '" data-rsvp-diff="-1" aria-label="Decrease ' + statusKey + ' count">−</button>' +
          '<button class="btn btn-sm btn-ghost px-2" data-rsvp-key="' + statusKey + '" data-rsvp-diff="1" aria-label="Increase ' + statusKey + ' count">+</button>' +
          '</div>' +
          '</div>' +
          '</div>';
      }).join('');
    }

    // Render Vendors Table
    var vendorTable = document.getElementById('vt');
    if (vendorTable) {
      vendorTable.innerHTML = '<thead><tr><th>Vendor / Partner</th><th>Category</th><th>Status</th><th>Direct Contact</th></tr></thead><tbody>' +
        state.vendors.map(function(v, idx) {
          var statusOptions = ['Contacted', 'Shortlisted', 'Pending', 'Confirmed'];
          var optionsHtml = statusOptions.map(function(opt) {
            return '<option value="' + opt + '"' + (opt === v.status ? ' selected' : '') + '>' + opt + '</option>';
          }).join('');

          return '<tr>' +
            '<td class="fw-semibold">' + v.name + '</td>' +
            '<td><span class="badge bg-secondary-subtle text-secondary">' + v.service + '</span></td>' +
            '<td><select class="form-select form-select-sm" data-vendor-idx="' + idx + '">' + optionsHtml + '</select></td>' +
            '<td class="text-muted">' + v.contact + '</td>' +
            '</tr>';
        }).join('') + '</tbody>';
    }

    // Render Budget Table
    var budgetTable = document.getElementById('bt');
    if (budgetTable) {
      budgetTable.innerHTML = '<thead><tr><th>Expense Category</th><th>Allocated</th><th>Spent</th><th>Variance</th></tr></thead><tbody>' +
        state.budget.map(function(item) {
          var variance = item.allocated - item.spent;
          var varClass = variance >= 0 ? 'text-success' : 'text-danger';
          return '<tr>' +
            '<td class="fw-medium">' + item.category + '</td>' +
            '<td>₹' + item.allocated.toLocaleString('en-IN') + '</td>' +
            '<td>₹' + item.spent.toLocaleString('en-IN') + '</td>' +
            '<td class="' + varClass + '">' + (variance >= 0 ? '₹' + variance.toLocaleString('en-IN') + ' Under' : '₹' + Math.abs(variance).toLocaleString('en-IN') + ' Over') + '</td>' +
            '</tr>';
        }).join('') +
        '<tr class="table-active fw-bold"><td>Total</td><td>₹' + totalAllocated.toLocaleString('en-IN') + '</td><td>₹' + totalSpent.toLocaleString('en-IN') + '</td><td class="text-success">₹' + (totalAllocated - totalSpent).toLocaleString('en-IN') + ' Remaining</td></tr>' +
        '</tbody>';
    }

    // Sync input values in requirements and profile forms if empty
    var reqType = document.getElementById('rt');
    var reqDate = document.getElementById('rd');
    var reqVenue = document.getElementById('rv');
    var reqBudget = document.getElementById('rb');
    var reqGuests = document.getElementById('rg');
    if (reqType && !reqType.value) reqType.value = state.requirements.type || '';
    if (reqDate && !reqDate.value) reqDate.value = state.requirements.date || '';
    if (reqVenue && !reqVenue.value) reqVenue.value = state.requirements.venue || '';
    if (reqBudget && !reqBudget.value) reqBudget.value = state.requirements.budget || '';
    if (reqGuests && !reqGuests.value) reqGuests.value = state.requirements.guests || '';

    var profName = document.getElementById('pn');
    var profEmail = document.getElementById('pe');
    var profPhone = document.getElementById('pp');
    var profCompany = document.getElementById('pc');
    if (profName && !profName.value) profName.value = state.profile.name || '';
    if (profEmail && !profEmail.value) profEmail.value = state.profile.email || '';
    if (profPhone && !profPhone.value) profPhone.value = state.profile.phone || '';
    if (profCompany && !profCompany.value) profCompany.value = state.profile.company || '';
  }

  // Event Listeners for Dynamic Dashboard Interactions
  document.addEventListener('change', function(e) {
    // Checklist item toggle
    if (e.target.hasAttribute('data-check-idx')) {
      var idx = parseInt(e.target.dataset.checkIdx, 10);
      if (state.checklist[idx]) {
        state.checklist[idx].done = e.target.checked;
        saveState();
      }
    }

    // Vendor status change
    if (e.target.hasAttribute('data-vendor-idx')) {
      var vIdx = parseInt(e.target.dataset.vendorIdx, 10);
      if (state.vendors[vIdx]) {
        state.vendors[vIdx].status = e.target.value;
        saveState();
      }
    }
  });

  document.addEventListener('click', function(e) {
    // RSVP adjustments
    var rsvpBtn = e.target.closest('[data-rsvp-key]');
    if (rsvpBtn) {
      var key = rsvpBtn.dataset.rsvpKey;
      var diff = parseInt(rsvpBtn.dataset.rsvpDiff, 10);
      if (state.rsvp.hasOwnProperty(key)) {
        state.rsvp[key] = Math.max(0, state.rsvp[key] + diff);
        saveState();
      }
      return;
    }

    // Delete task
    var delTaskBtn = e.target.closest('[data-del-task]');
    if (delTaskBtn) {
      var tIdx = parseInt(delTaskBtn.dataset.delTask, 10);
      state.checklist.splice(tIdx, 1);
      saveState();
      return;
    }

    // Sidebar navigation tabs
    var tabLink = e.target.closest('[data-t]');
    if (tabLink) {
      e.preventDefault();
      switchPane(tabLink.dataset.t);
      // Close mobile sidebar on selection
      var side = document.querySelector('.side');
      if (side) side.classList.remove('open');
      return;
    }
  });

  // Add Task Button
  var addTaskBtn = document.getElementById('addTaskBtn');
  var newTaskInput = document.getElementById('newTaskInput');
  if (addTaskBtn && newTaskInput) {
    addTaskBtn.addEventListener('click', function() {
      var val = newTaskInput.value.trim();
      if (val) {
        state.checklist.push({ text: val, done: false });
        newTaskInput.value = '';
        saveState();
      }
    });
    newTaskInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        addTaskBtn.click();
      }
    });
  }

  // Requirements form save
  var reqForm = document.getElementById('requirementsForm');
  if (reqForm) {
    reqForm.addEventListener('submit', function(e) {
      // If validation passed
      if (!reqForm.querySelector('.is-invalid')) {
        state.requirements = {
          type: document.getElementById('rt').value,
          date: document.getElementById('rd').value,
          venue: document.getElementById('rv').value,
          budget: document.getElementById('rb').value,
          guests: document.getElementById('rg').value
        };
        state.eventDate = state.requirements.date;
        saveState();
      }
    });
  }

  // Profile form save
  var profForm = document.getElementById('profileForm');
  if (profForm) {
    profForm.addEventListener('submit', function(e) {
      if (!profForm.querySelector('.is-invalid')) {
        state.profile = {
          name: document.getElementById('pn').value,
          email: document.getElementById('pe').value,
          phone: document.getElementById('pp') ? document.getElementById('pp').value : '',
          company: document.getElementById('pc') ? document.getElementById('pc').value : ''
        };
        saveState();
      }
    });
  }

  // Mobile sidebar toggle: show client portal menu down below Client Event Portal
  var sbBtn = document.getElementById('sb');
  var mobileNav = document.getElementById('dashMobileNav');

  document.querySelectorAll('[data-side-toggle], #sb').forEach(function(btn) {
    btn.onclick = function(e) {
      e.preventDefault();
      if (mobileNav) {
        var isOpen = mobileNav.classList.contains('open');
        if (isOpen) {
          mobileNav.classList.remove('open');
          mobileNav.style.display = 'none';
          if (sbBtn) sbBtn.innerHTML = '☰';
        } else {
          mobileNav.classList.add('open');
          mobileNav.style.display = 'block';
          if (sbBtn) sbBtn.innerHTML = '✕';
        }
      } else {
        var side = document.querySelector('.side');
        if (side) side.classList.toggle('open');
      }
    };
  });

  // Close mobile navigation on link click
  document.querySelectorAll('.side a, #dashMobileNav a').forEach(function(link) {
    link.addEventListener('click', function() {
      if (mobileNav && window.innerWidth < 992) {
        mobileNav.classList.remove('open');
        mobileNav.style.display = 'none';
        if (sbBtn) sbBtn.innerHTML = '☰';
      }
      var side = document.querySelector('.side');
      if (side && window.innerWidth < 992) {
        side.classList.remove('open');
      }
    });
  });

  function switchPane(targetId) {
    document.querySelectorAll('.pane').forEach(function(pane) {
      pane.classList.toggle('on', pane.id === 'p-' + targetId);
    });
    document.querySelectorAll('[data-t]').forEach(function(link) {
      link.classList.toggle('on', link.dataset.t === targetId);
    });
    window.location.hash = targetId;
  }

  // Global pane navigation listeners (sidebar & topbar notifications/profile)
  document.querySelectorAll('[data-t]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      var targetId = this.dataset.t;
      if (targetId && document.getElementById('p-' + targetId)) {
        e.preventDefault();
        switchPane(targetId);
      }
    });
  });

  // Initialize view from hash or overview
  var initialTab = (location.hash || '#overview').replace('#', '');
  if (!document.getElementById('p-' + initialTab)) {
    initialTab = 'overview';
  }
  // Handle logout confirmation
  var logoutBtn = document.getElementById('btnConfirmLogout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      sessionStorage.setItem('eg_logged_out', 'true');
    });
  }

  switchPane(initialTab);
  render();
})();