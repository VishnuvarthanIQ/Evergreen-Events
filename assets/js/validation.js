// Evergreen Events - Form Validation Engine
(function() {
  var Rules = {
    name: function(val) {
      if (!val || val.trim() === '') return 'Please enter your full name (letters only)';
      var trimmed = val.trim();
      if (/\d/.test(trimmed)) return 'Name cannot contain numbers (alphabetic characters only)';
      if (!/^[A-Za-z\s.'-]+$/.test(trimmed)) return 'Name can only contain alphabetic letters, spaces, hyphens, and apostrophes';
      var lettersOnly = trimmed.replace(/[^A-Za-z]/g, '');
      if (lettersOnly.length < 2) return 'Name must contain at least 2 letters';
      return true;
    },
    email: function(val) {
      if (!val || val.trim() === '') return 'Work email address is required';
      var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(val.trim())) return 'Please enter a valid work email (e.g. name@company.com)';
      return true;
    },
    phone: function(val) {
      if (!val || val.trim() === '') return '10-digit mobile number is required';
      var cleaned = val.replace(/[\s-]/g, '');
      if (!/^\d+$/.test(cleaned)) return 'Phone number must contain digits only';
      if (cleaned.length !== 10) return 'Phone number must be exactly 10 digits';
      if (!/^[6-9]/.test(cleaned)) return 'Indian mobile numbers must start with 6, 7, 8, or 9';
      return true;
    },
    pass: function(val) {
      if (!val) return 'Password is required';
      if (val.length < 8) return 'Password must be at least 8 characters';
      if (!/[A-Za-z]/.test(val) || !/\d/.test(val)) return 'Password must include both letters and numbers';
      return true;
    },
    confirm: function(val, form) {
      var passInput = form.querySelector('[data-rule="pass"]');
      if (!passInput) return true;
      if (!val) return 'Please confirm your password';
      if (val !== passInput.value) return 'Passwords do not match';
      return true;
    },
    futuredate: function(val) {
      if (!val) return 'Please select your target event date';
      var parts = val.split('-');
      if (parts.length !== 3) return 'Please select a valid date';
      var selected = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) return 'Event date cannot be in the past';
      return true;
    },
    num: function(val) {
      if (!val || val.trim() === '') return 'Please enter a valid numeric value';
      var numVal = Number(val);
      if (isNaN(numVal) || numVal <= 0) return 'Must be a positive number greater than 0';
      return true;
    },
    req: function(val) {
      if (!val || val.trim() === '') return 'This field is required';
      return true;
    },
    terms: function(val, form, input) {
      if (!input.checked) return 'You must agree to the Terms & Conditions to proceed';
      return true;
    }
  };

  function validateInput(input, form) {
    var ruleName = input.dataset.rule;
    if (!ruleName) return true;

    var val = input.value;
    var validateFn = Rules[ruleName];
    var result = validateFn ? validateFn(val, form, input) : true;

    // Locate feedback container
    var feedbackEl = form.querySelector('[data-fb="' + input.id + '"]') ||
                     (input.parentNode ? input.parentNode.querySelector('.invalid-feedback') : null) ||
                     (input.closest('.col-12, .col-md-6, .col-md-4, .col-md-3, div') ? input.closest('.col-12, .col-md-6, .col-md-4, .col-md-3, div').querySelector('.invalid-feedback') : null);

    if (result === true) {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      if (feedbackEl) {
        feedbackEl.textContent = '';
        feedbackEl.style.display = 'none';
      }
      return true;
    } else {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      if (feedbackEl) {
        feedbackEl.textContent = result;
        feedbackEl.style.display = 'block';
      }
      return false;
    }
  }

  function isNameInput(el) {
    if (!el || el.tagName !== 'INPUT') return false;
    if (el.type === 'hidden' || el.type === 'submit' || el.type === 'checkbox' || el.type === 'radio') return false;
    if (el.dataset.rule === 'name') return true;
    var id = (el.id || '').toLowerCase();
    var name = (el.name || '').toLowerCase();
    if (id === 'regname' || id === 'cf_name' || id === 'cm_name' || id === 'pn') return true;
    if (el.getAttribute('autocomplete') === 'name') return true;
    if (id.indexOf('name') !== -1 && id.indexOf('filename') === -1) return true;
    if (name.indexOf('name') !== -1 && name.indexOf('filename') === -1) return true;
    return false;
  }

  // Intercept beforeinput to prevent numbers from ever appearing
  document.addEventListener('beforeinput', function(e) {
    if (isNameInput(e.target)) {
      if (e.data && /\d/.test(e.data)) {
        e.preventDefault();
      }
    }
  });

  // Globally block typing numbers in any name input
  document.addEventListener('keydown', function(e) {
    if (isNameInput(e.target)) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key && e.key.length === 1 && /\d/.test(e.key)) {
        e.preventDefault();
      }
    }
  });

  // Globally block pasting numbers in any name input
  document.addEventListener('paste', function(e) {
    if (isNameInput(e.target)) {
      var clipboardData = e.clipboardData || window.clipboardData;
      if (clipboardData) {
        var text = clipboardData.getData('text');
        if (/\d/.test(text)) {
          e.preventDefault();
          var cleaned = text.replace(/\d/g, '');
          if (cleaned.length > 0) {
            document.execCommand('insertText', false, cleaned);
          }
        }
      }
    }
  });

  // Clean numbers on drag & drop
  document.addEventListener('drop', function(e) {
    if (isNameInput(e.target)) {
      setTimeout(function() {
        if (/\d/.test(e.target.value)) {
          e.target.value = e.target.value.replace(/\d/g, '');
        }
      }, 0);
    }
  });

  // Attach listeners to all validated forms
  document.querySelectorAll('form[data-validate]').forEach(function(form) {
    // Realtime input restriction & validation
    form.addEventListener('input', function(e) {
      // Prevent numbers in any name field
      if (isNameInput(e.target) || e.target.dataset.rule === 'name') {
        if (/\d/.test(e.target.value)) {
          e.target.value = e.target.value.replace(/\d/g, '');
        }
      }
      // Prevent letters in phone field
      if (e.target.dataset.rule === 'phone' || e.target.type === 'tel') {
        e.target.value = e.target.value.replace(/[^\d]/g, '').slice(0, 10);
      }
      if (e.target.hasAttribute('data-rule')) {
        validateInput(e.target, form);
      }
    });

    form.addEventListener('change', function(e) {
      if (e.target.hasAttribute('data-rule')) {
        validateInput(e.target, form);
      }
    });


  // Corporate client credentials manager (localStorage-backed)
  function getRegisteredUsers() {
    try {
      var stored = localStorage.getItem('eg_registered_users');
      if (stored) {
        var parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (err) {
      console.error('Error reading registered users from localStorage:', err);
    }
    // Default pre-seeded demo corporate client
    var defaultUsers = [
      {
        name: 'TechSphere Admin',
        email: 'client@techsphere.com',
        password: 'Corporate2026!',
        phone: '9876543210'
      }
    ];
    try {
      localStorage.setItem('eg_registered_users', JSON.stringify(defaultUsers));
    } catch (e) {}
    return defaultUsers;
  }

    // Submit handler
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var isValid = true;
      var firstInvalidInput = null;

      form.querySelectorAll('[data-rule]').forEach(function(input) {
        if (!validateInput(input, form)) {
          isValid = false;
          if (!firstInvalidInput) firstInvalidInput = input;
        }
      });

      if (!isValid) {
        if (firstInvalidInput) firstInvalidInput.focus();
        window.popup('Incomplete Submission', 'Please review and correct the highlighted fields.', false);
        return;
      }

      var customAction = form.dataset.action;
      var successMsg = form.dataset.msg || 'Your request has been received! Our dedicated corporate planner will connect within 24 hours.';

      if (customAction === 'login') {
        var loginEmailInput = form.querySelector('#loginEmail, [type="email"]');
        var loginPassInput = form.querySelector('#loginPass, [type="password"]');

        var emailVal = loginEmailInput ? loginEmailInput.value.trim().toLowerCase() : '';
        var passVal = loginPassInput ? loginPassInput.value : '';

        var users = getRegisteredUsers();
        var user = users.find(function(u) {
          return u.email && u.email.toLowerCase() === emailVal;
        });

        if (!user) {
          window.popup('Account Not Found', 'Account not found. Please sign up first.', false);
          return;
        }

        if (user.password !== passVal) {
          window.popup('Incorrect Credentials', 'Incorrect email or password. Please try again.', false);
          return;
        }

        // Login successful - preserve session in localStorage and update header
        try {
          localStorage.setItem('eg_logged_user', JSON.stringify(user));
          sessionStorage.setItem('eg_current_user', JSON.stringify(user));
        } catch (err) {}

        if (typeof window.updateAuthHeader === 'function') {
          window.updateAuthHeader();
        }
        window.dispatchEvent(new CustomEvent('authChange', { detail: user }));

        window.popup('Login Successful', 'Login successful! Welcome back.', true);
        return;
      } else if (customAction === 'register') {
        var regNameInput = form.querySelector('#regName, [data-rule="name"]');
        var regEmailInput = form.querySelector('#regEmail, [data-rule="email"]');
        var regPhoneInput = form.querySelector('#regPhone, [data-rule="phone"]');
        var regPassInput = form.querySelector('#regPass, [data-rule="pass"]');

        var regEmailVal = regEmailInput ? regEmailInput.value.trim().toLowerCase() : '';
        var regPassVal = regPassInput ? regPassInput.value : '';
        var regNameVal = regNameInput ? regNameInput.value.trim() : '';
        var regPhoneVal = regPhoneInput ? regPhoneInput.value.trim() : '';

        var usersList = getRegisteredUsers();
        var emailExists = usersList.some(function(u) {
          return u.email && u.email.toLowerCase() === regEmailVal;
        });

        if (emailExists) {
          window.popup('Account Already Exists', 'An account with this email address already exists. Please sign in instead.', false);
          return;
        }

        var newUser = {
          name: regNameVal,
          email: regEmailVal,
          password: regPassVal,
          phone: regPhoneVal,
          registeredAt: new Date().toISOString()
        };

        usersList.push(newUser);
        try {
          localStorage.setItem('eg_registered_users', JSON.stringify(usersList));
        } catch (err) {
          console.error('Error saving user to localStorage:', err);
        }

        window.popup('Registration Successful', 'Registration successful! You can now sign in.', true);
        form.reset();
        form.querySelectorAll('.is-valid').forEach(function(el) { el.classList.remove('is-valid'); });
        return;
      } else {
        window.popup('Thank You!', successMsg, true);
        form.reset();
        form.querySelectorAll('.is-valid').forEach(function(el) { el.classList.remove('is-valid'); });
      }
    });
  });

  
  // Social Auth Buttons Click Handler (Google & Apple)
  function initSocialAuth() {
    document.querySelectorAll('.auth-social-btn').forEach(function(btn) {
      if (btn.dataset.initialized) return;
      btn.dataset.initialized = 'true';
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        var provider = btn.getAttribute('data-social') || 'Social';
        var isRegister = document.querySelector('form[data-action="register"]') !== null;
        var actionType = isRegister ? 'Sign-Up' : 'Sign-In';
        var hint = isRegister ? 'Please complete the registration form using your corporate email.' : 'Please sign in using your registered corporate email and password.';
        
        window.popup(
          provider + ' ' + actionType,
          provider + ' authentication is currently in demo mode. ' + hint,
          false
        );
      });
    });
  }

  initSocialAuth();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSocialAuth);
  }

  // Set minimum date to today for all future date inputs so past dates are visible but disabled / unclickable
  function enforceMinDate() {
    var now = new Date();
    var yyyy = now.getFullYear();
    var mm = String(now.getMonth() + 1).padStart(2, '0');
    var dd = String(now.getDate()).padStart(2, '0');
    var todayStr = yyyy + '-' + mm + '-' + dd;

    var dateInputs = document.querySelectorAll('input[type="date"][data-rule="futuredate"], input[type="date"]');
    dateInputs.forEach(function(input) {
      if (!input.hasAttribute('data-allow-past')) {
        input.min = todayStr;
      }
    });
  }

  // Enforce on script load, DOM ready, modal display, and window focus
  enforceMinDate();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enforceMinDate);
  }
  document.addEventListener('show.bs.modal', enforceMinDate);
  window.addEventListener('focus', enforceMinDate);
})();