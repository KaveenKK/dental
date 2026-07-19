(function () {
  'use strict';

  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  // Sticky header
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  menuToggle.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.classList.toggle('active', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen);
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Scroll reveal
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // Dashboard stats animation
  let statsAnimated = false;
  const statsObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !statsAnimated) {
          statsAnimated = true;
          animateStat(document.querySelectorAll('.stat-value')[1], 0, 12, 1200);
        }
      });
    },
    { threshold: 0.5 }
  );

  const dashboardStats = document.querySelector('.dashboard-stats');
  if (dashboardStats) {
    statsObserver.observe(dashboardStats);
  }

  function animateStat(el, start, end, duration) {
    if (!el || end === 0) return;
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(start + (end - start) * eased);
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  // ─── Enquiry Wizard ───
  const wizard = document.getElementById('enquiry-wizard');
  if (!wizard) return;

  const form = document.getElementById('enquiry-form');
  const panels = form.querySelectorAll('.wizard-panel[data-step]');
  const proofSlides = document.querySelectorAll('.proof-slide');
  const progressBar = document.getElementById('wizard-progress-bar');
  const stepLabel = document.getElementById('wizard-step-label');
  const stepDots = document.querySelectorAll('.wizard-step-dot');
  const backBtn = document.getElementById('wizard-back');
  const nextBtn = document.getElementById('wizard-next');
  const wizardNav = document.getElementById('wizard-nav');

  const STEP_LABELS = [
    'Step 1 of 5 — Your practice',
    'Step 2 of 5 — Your setup',
    'Step 3 of 5 — Pain points',
    'Step 4 of 5 — Your preview',
    'Step 5 of 5 — Get your assessment'
  ];

  const PAIN_COPY = {
    calls: {
      headline: 'Missed calls are your biggest leak',
      copy: 'Every unanswered call is a patient booking with the practice down the road. We capture and follow up automatically.'
    },
    texts: {
      headline: 'Slow texts lose patients fast',
      copy: '62% of patients expect a reply within 10 minutes. We give your team instant alerts and smart reply templates.'
    },
    noshows: {
      headline: 'No-shows drain your diary',
      copy: 'Smart reminders sent at the right time can cut no-shows by 15–30%. We set up sequences that patients actually respond to.'
    },
    website: {
      headline: 'Website leads going cold?',
      copy: 'Contact form submissions often sit for hours. We route them straight to your team with instant notifications.'
    },
    afterhours: {
      headline: 'After-hours doesn\'t mean after-opportunity',
      copy: 'Evening and weekend enquiries get auto-acknowledged and queued for follow-up — so nothing waits until Monday.'
    },
    recall: {
      headline: 'Recall patients are revenue waiting to happen',
      copy: 'Hygiene and check-up recalls that slip through cost thousands yearly. We automate the chase so chairs stay full.'
    }
  };

  const PLAN_ITEMS = {
    calls: 'Missed call alerts with automatic SMS follow-up',
    texts: 'Unified two-way patient messaging inbox',
    noshows: 'Smart appointment reminder sequences',
    website: 'Website enquiry capture & instant routing',
    afterhours: 'After-hours auto-reply & callback scheduling',
    recall: 'Automated hygiene & check-up recall campaigns'
  };

  const state = {
    step: 1,
    role: '',
    booking: '',
    missedCalls: '',
    textSpeed: '',
    painPoints: []
  };

  let currentStep = 1;
  const TOTAL_STEPS = 5;

  // Choice card interactions
  form.querySelectorAll('.choice-grid').forEach(function (grid) {
    const field = grid.dataset.field;
    const isMulti = grid.classList.contains('choice-multi');

    grid.querySelectorAll('.choice-card').forEach(function (card) {
      card.addEventListener('click', function () {
        const value = card.dataset.value;

        if (isMulti) {
          card.classList.toggle('selected');
          const selected = Array.from(grid.querySelectorAll('.choice-card.selected'))
            .map(function (c) { return c.dataset.value; });
          state.painPoints = selected;
          updatePainProof();
        } else {
          grid.querySelectorAll('.choice-card').forEach(function (c) {
            c.classList.remove('selected');
          });
          card.classList.add('selected');

          if (field === 'role') state.role = value;
          if (field === 'booking') state.booking = value;
          if (field === 'missed-calls') state.missedCalls = value;
          if (field === 'text-speed') state.textSpeed = value;
        }

        grid.closest('.form-group')?.classList.remove('error');
        grid.closest('.form-group')?.querySelector('.field-error')?.remove();
      });
    });
  });

  backBtn.addEventListener('click', function () {
    if (currentStep > 1) goToStep(currentStep - 1);
  });

  nextBtn.addEventListener('click', function () {
    if (!validateStep(currentStep)) return;

    if (currentStep === 4) {
      buildPreview();
    }

    if (currentStep === TOTAL_STEPS) {
      submitEnquiry();
      return;
    }

    goToStep(currentStep + 1);
  });

  function goToStep(step) {
    currentStep = step;

    panels.forEach(function (panel) {
      panel.classList.toggle('active', parseInt(panel.dataset.step, 10) === step);
    });

    proofSlides.forEach(function (slide) {
      slide.classList.toggle('active', parseInt(slide.dataset.proof, 10) === step);
    });

    const progress = (step / TOTAL_STEPS) * 100;
    progressBar.style.setProperty('--progress', progress + '%');

    stepLabel.textContent = STEP_LABELS[step - 1];

    stepDots.forEach(function (dot) {
      const dotStep = parseInt(dot.dataset.step, 10);
      dot.classList.toggle('active', dotStep === step);
      dot.classList.toggle('done', dotStep < step);
    });

    backBtn.disabled = step === 1;
    nextBtn.textContent = step === TOTAL_STEPS ? 'Send My Enquiry' : step === 4 ? 'Looks Good — Continue' : 'Continue';

    if (step === 4) {
      buildPreview();
      updateProofPreview();
    }

    if (step === 5) {
      buildSummary();
    }

    wizard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function validateStep(step) {
    clearErrors();

    if (step === 1) {
      const practice = document.getElementById('practice-name');
      const name = document.getElementById('contact-name');
      let valid = true;

      if (!practice.value.trim()) {
        showError(practice, 'Please enter your practice name');
        valid = false;
      }
      if (!name.value.trim()) {
        showError(name, 'Please enter your name');
        valid = false;
      }
      if (!state.role) {
        showChoiceError('role', 'Please select your role');
        valid = false;
      }
      return valid;
    }

    if (step === 2) {
      let valid = true;
      if (!state.booking) { showChoiceError('booking', 'Please select your booking system'); valid = false; }
      if (!state.missedCalls) { showChoiceError('missed-calls', 'Please estimate missed calls'); valid = false; }
      if (!state.textSpeed) { showChoiceError('text-speed', 'Please select your text response time'); valid = false; }
      return valid;
    }

    if (step === 3) {
      if (state.painPoints.length === 0) {
        showChoiceError('pain-points', 'Please select at least one pain point');
        return false;
      }
      return true;
    }

    if (step === 5) {
      const email = document.getElementById('contact-email');
      if (!email.value.trim() || !email.validity.valid) {
        showError(email, 'Please enter a valid email address');
        return false;
      }
      return true;
    }

    return true;
  }

  function showError(input, message) {
    const group = input.closest('.form-group');
    group.classList.add('error');
    const err = document.createElement('p');
    err.className = 'field-error';
    err.textContent = message;
    group.appendChild(err);
  }

  function showChoiceError(field, message) {
    const grid = form.querySelector('[data-field="' + field + '"]');
    const group = grid.closest('.form-group');
    group.classList.add('error');
    const err = document.createElement('p');
    err.className = 'field-error';
    err.textContent = message;
    group.appendChild(err);
  }

  function clearErrors() {
    form.querySelectorAll('.form-group.error').forEach(function (g) {
      g.classList.remove('error');
    });
    form.querySelectorAll('.field-error').forEach(function (e) {
      e.remove();
    });
  }

  function calculateROI() {
    const callValues = { '0-2': 400, '3-5': 1200, '6-10': 2200, '10+': 3500 };
    const textValues = { minutes: 0, 'same-day': 300, 'often-missed': 800, 'no-text': 500 };
    const painBonus = state.painPoints.length * 200;

    let total = callValues[state.missedCalls] || 1200;
    total += textValues[state.textSpeed] || 0;
    total += painBonus;

    if (state.painPoints.includes('noshows')) total += 600;
    if (state.painPoints.includes('recall')) total += 500;
    if (state.painPoints.includes('afterhours')) total += 400;

    return Math.min(Math.max(total, 800), 5500);
  }

  function formatCurrency(amount) {
    return '£' + amount.toLocaleString('en-GB');
  }

  function buildPreview() {
    const practiceName = document.getElementById('practice-name').value.trim() || 'your practice';
    const roi = calculateROI();
    const net = roi - 150;

    document.getElementById('preview-practice-name').textContent = practiceName;
    document.getElementById('preview-roi-amount').textContent = formatCurrency(roi);
    document.getElementById('preview-roi-net').textContent = 'You could recover ~' + formatCurrency(net) + '/mo';

    const planList = document.getElementById('preview-plan-items');
    planList.innerHTML = '';

    state.painPoints.forEach(function (pain) {
      if (PLAN_ITEMS[pain]) {
        const li = document.createElement('li');
        li.textContent = PLAN_ITEMS[pain];
        planList.appendChild(li);
      }
    });

    if (state.booking && state.booking !== 'unsure') {
      const li = document.createElement('li');
      const bookingLabels = { dentally: 'Dentally', soe: 'SOE / EXACT', other: 'your booking system' };
      li.textContent = 'Direct integration with ' + (bookingLabels[state.booking] || 'your booking system');
      planList.appendChild(li);
    }

    const li = document.createElement('li');
    li.textContent = 'Free on-site setup & team training at your practice';
    planList.appendChild(li);
  }

  function updateProofPreview() {
    const roi = calculateROI();
    const practiceName = document.getElementById('practice-name').value.trim() || 'your practice';

    document.getElementById('proof-roi-value').textContent = formatCurrency(roi);
    document.getElementById('proof-preview-title').textContent = 'Here\'s what we\'d build for ' + practiceName;

    const proofList = document.getElementById('proof-plan-list');
    proofList.innerHTML = '';
    state.painPoints.slice(0, 4).forEach(function (pain) {
      if (PLAN_ITEMS[pain]) {
        const li = document.createElement('li');
        li.textContent = PLAN_ITEMS[pain];
        proofList.appendChild(li);
      }
    });
  }

  function updatePainProof() {
    const primary = state.painPoints[0];
    const copy = PAIN_COPY[primary];
    if (copy) {
      document.getElementById('proof-pain-headline').textContent = copy.headline;
      document.getElementById('proof-pain-copy').textContent = copy.copy;
    }
  }

  function buildSummary() {
    const practice = document.getElementById('practice-name').value.trim();
    const roi = calculateROI();
    const pains = state.painPoints.map(function (p) {
      return PLAN_ITEMS[p]?.split(' ').slice(0, 3).join(' ') + '…';
    }).join(', ');

    document.getElementById('enquiry-summary').innerHTML =
      '<strong>' + escapeHtml(practice) + '</strong> · Est. ' + formatCurrency(roi) + '/mo at risk<br>' +
      'Focus areas: ' + escapeHtml(pains || 'Full communication overhaul');
  }

  function submitEnquiry() {
    const name = document.getElementById('contact-name').value.trim();
    const practice = document.getElementById('practice-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();

    panels.forEach(function (p) { p.classList.remove('active'); });
    form.querySelector('[data-step="success"]').classList.add('active');
    wizardNav.classList.add('hidden');

    document.getElementById('success-name').textContent = name.split(' ')[0];
    document.getElementById('success-practice').textContent = practice;
    document.getElementById('success-email').textContent = email;

    proofSlides.forEach(function (slide) {
      slide.classList.toggle('active', slide.dataset.proof === '5');
    });

    stepLabel.textContent = 'Enquiry received';
    progressBar.style.setProperty('--progress', '100%');
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Init progress
  progressBar.style.setProperty('--progress', '20%');
})();
