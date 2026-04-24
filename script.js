/* ================================================================
   YASHASWI PORTFOLIO — MAIN SCRIPT
   ================================================================ */

// ---- NAVIGATION: Solid background on scroll ----
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });


// ---- NAVIGATION: Active link highlight on scroll ----
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav__links a');

function setActiveLink() {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 220) current = sec.id;
  });
  navLinks.forEach(link => {
    const href = link.getAttribute('href').slice(1); // strip '#'
    link.classList.toggle('active', href === current);
  });
}

window.addEventListener('scroll', setActiveLink, { passive: true });
setActiveLink(); // run once on load


// ---- MOBILE MENU ----
const burger     = document.getElementById('burger');
const mobileMenu = document.getElementById('mobile-menu');
const burgerSpans = burger.querySelectorAll('span');

function openMenu() {
  mobileMenu.classList.add('open');
  burgerSpans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
  burgerSpans[1].style.opacity   = '0';
  burgerSpans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
}

function closeMenu() {
  mobileMenu.classList.remove('open');
  burgerSpans[0].style.transform = '';
  burgerSpans[1].style.opacity   = '';
  burgerSpans[2].style.transform = '';
}

burger.addEventListener('click', () => {
  mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
});

// Close on any mobile link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (mobileMenu.classList.contains('open') &&
      !mobileMenu.contains(e.target) &&
      !burger.contains(e.target)) {
    closeMenu();
  }
});


// ---- SCROLL REVEAL (Intersection Observer) ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings slightly for a cascade effect
      const siblings = entry.target.parentElement.querySelectorAll('.fade-in');
      let delay = 0;
      siblings.forEach((el, idx) => {
        if (el === entry.target) delay = idx * 90;
      });
      setTimeout(() => entry.target.classList.add('visible'), delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-in').forEach(el => revealObserver.observe(el));


// ---- CONTACT FORM (Formspree async submit) ----
const contactForm = document.querySelector('.contact__form');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn       = contactForm.querySelector('button[type="submit"]');
    const origText  = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled    = true;

    try {
      const res = await fetch(contactForm.action, {
        method:  'POST',
        body:    new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        btn.textContent       = 'Sent ✓';
        btn.style.background  = 'var(--green)';
        btn.style.borderColor = 'var(--green)';
        btn.style.color       = 'var(--bg)';
        contactForm.reset();
        setTimeout(() => {
          btn.textContent       = origText;
          btn.style.background  = '';
          btn.style.borderColor = '';
          btn.style.color       = '';
          btn.disabled          = false;
        }, 3500);
      } else {
        throw new Error('Form submit failed');
      }
    } catch {
      btn.textContent = 'Failed — try email ↗';
      setTimeout(() => {
        btn.textContent = origText;
        btn.disabled    = false;
      }, 3500);
    }
  });
}


// ---- SMOOTH SCROLL for anchor links (fallback for older browsers) ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
