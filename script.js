// =========================================================
// Mobile nav toggle
// =========================================================
const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');

if (menuToggle && mobileNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      menuToggle.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// =========================================================
// Scroll reveal
// =========================================================
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// =========================================================
// Animate skill bars when visible
// =========================================================
const skillRows = document.querySelectorAll('.skill-row');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target.querySelector('.bar-fill');
      const pct = entry.target.getAttribute('data-pct');
      if (fill && pct) {
        requestAnimationFrame(() => { fill.style.width = pct + '%'; });
      }
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

skillRows.forEach(row => skillObserver.observe(row));

// =========================================================
// Animate stat numbers when visible
// =========================================================
const statNums = document.querySelectorAll('.stat .num[data-count], .stat .num[data-decimal]');

function animateCount(el) {
  const isDecimal = el.hasAttribute('data-decimal');
  const target = parseFloat(el.getAttribute(isDecimal ? 'data-decimal' : 'data-count'));
  const duration = 900;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;
    el.textContent = isDecimal ? value.toFixed(1) : Math.round(value);
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = isDecimal ? target.toFixed(1) : target;
  }
  requestAnimationFrame(tick);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(el => statObserver.observe(el));

// =========================================================
// Active nav link on scroll (position-based scrollspy)
//
// NOTE: an IntersectionObserver with a fixed `threshold` (e.g. 0.4)
// requires that fraction of the *entire section* to be on screen
// before it counts as active. Sections like About, Journey,
// Projects, Philosophy and Skills are all taller than the viewport,
// so that threshold can never be reached and the underline gets
// stuck on whichever short section (Hero/Contact) last qualified.
// A scroll-position comparison works correctly no matter how tall
// each section is.
// =========================================================
const sections = Array.from(document.querySelectorAll('main section[id]'));
const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');
const nav = document.querySelector('.site-nav');
const progressBar = document.getElementById('scrollProgress');

function setActiveLink(id) {
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
  });
}

function updateActiveSection() {
  if (!sections.length) return;

  const navHeight = nav ? nav.offsetHeight : 0;
  const probeLine = window.scrollY + navHeight + 48; // just below the sticky nav

  // Near the very bottom of the page, force the last section active —
  // short trailing sections (like Contact) can otherwise be skipped.
  const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
  if (atBottom) {
    setActiveLink(sections[sections.length - 1].id);
    return;
  }

  let current = sections[0];
  for (const section of sections) {
    if (section.offsetTop <= probeLine) {
      current = section;
    } else {
      break;
    }
  }
  setActiveLink(current.id);
}

// =========================================================
// Sticky nav shadow + scroll progress bar + active link,
// batched into a single rAF-throttled scroll handler.
// =========================================================
let scrollTicking = false;

function onScrollFrame() {
  if (window.scrollY > 8) {
    nav.style.boxShadow = '0 1px 0 rgba(22,24,29,0.05)';
  } else {
    nav.style.boxShadow = 'none';
  }

  if (progressBar) {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }

  updateActiveSection();
  scrollTicking = false;
}

window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    requestAnimationFrame(onScrollFrame);
    scrollTicking = true;
  }
}, { passive: true });

window.addEventListener('resize', () => {
  if (!scrollTicking) {
    requestAnimationFrame(onScrollFrame);
    scrollTicking = true;
  }
}, { passive: true });

// Run once on load so the correct link is active immediately,
// and again after fonts/images settle (offsetTop can shift once
// web fonts finish loading and reflow the page).
onScrollFrame();
window.addEventListener('load', onScrollFrame);
