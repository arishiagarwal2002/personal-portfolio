/* ===== TYPEWRITER ===== */
const roles = [
  'AI/ML Engineer',
  'Data Scientist',
  'Python Developer',
  'Deep Learning Researcher',
  'MSc Student @ QMUL',
];

let roleIdx = 0, charIdx = 0, deleting = false;
const tw = document.getElementById('typewriter');

function type() {
  const word = roles[roleIdx];
  if (deleting) {
    tw.innerHTML = word.slice(0, charIdx - 1) + '<span class="cursor"></span>';
    charIdx--;
  } else {
    tw.innerHTML = word.slice(0, charIdx + 1) + '<span class="cursor"></span>';
    charIdx++;
  }

  let delay = deleting ? 55 : 95;
  if (!deleting && charIdx === word.length) { delay = 2200; deleting = true; }
  else if (deleting && charIdx === 0)        { deleting = false; roleIdx = (roleIdx + 1) % roles.length; delay = 380; }

  setTimeout(type, delay);
}
type();

/* ===== THEME TOGGLE ===== */
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });
}

/* ===== NAVBAR ===== */
const navbar    = document.getElementById('navbar');
const navLinks  = document.getElementById('navLinks');
const navToggle = document.getElementById('navToggle');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

/* ===== ACTIVE NAV LINK ===== */
const sections = [...document.querySelectorAll('section[id]')];
const links    = [...document.querySelectorAll('.nav-links a')];

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${e.target.id}`));
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ===== SCROLL REVEAL (with stagger) ===== */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Simple fade-up targets
document.querySelectorAll(
  '.section-title, .section-label, .subsection-label, .about-text, .contact-sub'
).forEach(el => el.classList.add('reveal'));

// Staggered groups: children fade up one after another
const staggerGroups = [
  '.about-cards', '.skills-list', '.projects-list', '.timeline',
  '.edu-grid', '.certs-grid', '.awards-list', '.contact-links',
];
staggerGroups.forEach(sel => {
  document.querySelectorAll(sel).forEach(group => {
    group.classList.add('stagger');
    [...group.children].forEach((kid, i) => {
      kid.style.setProperty('--reveal-delay', `${Math.min(i * 70, 420)}ms`);
    });
  });
});

const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .stagger').forEach(el => revealObserver.observe(el));

/* ===== HERO MESH PARALLAX (subtle) ===== */
const mesh = document.querySelector('.hero-blob');
const heroEl = document.querySelector('.hero');
if (mesh && heroEl && !reduceMotion) {
  heroEl.addEventListener('mousemove', e => {
    const r = heroEl.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    mesh.style.transform = `translate3d(${x * -24}px, ${y * -24}px, 0)`;
  });
  heroEl.addEventListener('mouseleave', () => { mesh.style.transform = ''; });
}

/* ===== STAT COUNT-UP ===== */
function countUp(el) {
  const raw = el.textContent.trim();
  const target = parseInt(raw, 10);
  if (isNaN(target)) return;
  const suffix = raw.replace(/[0-9]/g, '');
  const duration = 1100;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const statNums = document.querySelectorAll('.hstat .hn');
if (reduceMotion) {
  // leave values as-is
} else {
  const statObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) { countUp(e.target); obs.unobserve(e.target); }
    });
  }, { threshold: 0.6 });
  statNums.forEach(n => statObserver.observe(n));
}
