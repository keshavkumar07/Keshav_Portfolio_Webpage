// =========================================================
// Mobile nav toggle
// =========================================================
const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');

if (menuToggle && mobileNav) {
  menuToggle.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
  });

  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => mobileNav.classList.remove('open'));
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
// Active nav link on scroll
// =========================================================
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = entry.target.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (!link) return;
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
}, { threshold: 0.4, rootMargin: '-80px 0px -40% 0px' });

sections.forEach(section => navObserver.observe(section));

// =========================================================
// Sticky nav shadow on scroll
// =========================================================
const nav = document.querySelector('.site-nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 8) {
    nav.style.boxShadow = '0 1px 0 rgba(18,21,27,0.04)';
  } else {
    nav.style.boxShadow = 'none';
  }
});
