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

/* ===== SCROLL REVEAL ===== */
const revealTargets = document.querySelectorAll(
  '.about-content, .skills-list, .projects-list, .timeline, .edu-grid, .certs-grid, .awards-list, .contact-links, .section-title, .section-label'
);

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08 });

revealTargets.forEach(el => { el.classList.add('reveal'); revealObserver.observe(el); });
