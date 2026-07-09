const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(pointer: fine)').matches;

/* ===== TYPEWRITER ===== */
const roles = [
  'AI / ML Engineer',
  'Data Scientist',
  'Machine Learning Engineer',
  'NLP & RAG Developer',
  'MSc AI Candidate @ QMUL',
];

const tw = document.getElementById('typewriter');
if (tw) {
  if (reduceMotion) {
    tw.textContent = roles[0];
  } else {
    let roleIdx = 0, charIdx = 0, deleting = false;
    (function type() {
      const word = roles[roleIdx];
      charIdx += deleting ? -1 : 1;
      tw.innerHTML = word.slice(0, charIdx) + '<span class="cursor"></span>';

      let delay = deleting ? 45 : 85;
      if (!deleting && charIdx === word.length) { delay = 2200; deleting = true; }
      else if (deleting && charIdx === 0) { deleting = false; roleIdx = (roleIdx + 1) % roles.length; delay = 350; }
      setTimeout(type, delay);
    })();
  }
}

/* ===== NAVBAR ===== */
const navbar    = document.getElementById('navbar');
const navLinks  = document.getElementById('navLinks');
const navToggle = document.getElementById('navToggle');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

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
}, { threshold: 0.35 });
sections.forEach(s => sectionObserver.observe(s));

/* ===== SCROLL REVEAL (with stagger) ===== */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); } });
}, { threshold: 0.08 });

document.querySelectorAll('.stagger').forEach(parent => {
  [...parent.children].forEach((child, i) => {
    child.classList.add('reveal');
    child.style.transitionDelay = Math.min(i * 70, 420) + 'ms';
  });
});
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ===== COUNT-UP STATS ===== */
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    counterObserver.unobserve(e.target);
    const el = e.target;
    const target = +el.dataset.count;
    if (reduceMotion) { el.textContent = target; return; }
    const t0 = performance.now(), dur = 1200;
    (function tick(now) {
      const p = Math.min((now - t0) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

/* ===== CARD SPOTLIGHT (mouse-following highlight) ===== */
if (finePointer) {
  document.querySelectorAll('.glass-hover').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });
}

/* ===== CURSOR GLOW ===== */
if (finePointer && !reduceMotion) {
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);
  let tx = innerWidth / 2, ty = innerHeight / 2, x = tx, y = ty;
  addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; }, { passive: true });
  (function loop() {
    x += (tx - x) * 0.08;
    y += (ty - y) * 0.08;
    glow.style.transform = `translate(${x - 300}px, ${y - 300}px)`;
    requestAnimationFrame(loop);
  })();
}

/* ===== NEURAL NETWORK BACKGROUND ===== */
(function neural() {
  const canvas = document.getElementById('neuralCanvas');
  if (!canvas || reduceMotion) return;

  const ctx = canvas.getContext('2d');
  const hero = canvas.parentElement;
  const N = innerWidth < 768 ? 28 : 62;
  const LINK = 135;
  const mouse = { x: -9999, y: -9999 };
  let W, H, nodes = [], running = false, rafId;

  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = hero.clientWidth; H = hero.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function init() {
    nodes = Array.from({ length: N }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35,
      r: Math.random() * 1.5 + .7,
    }));
  }

  function step() {
    ctx.clearRect(0, 0, W, H);
    for (const n of nodes) {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    }
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < LINK) {
          ctx.strokeStyle = `rgba(129,140,248,${(1 - d / LINK) * .13})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      const dm = Math.hypot(a.x - mouse.x, a.y - mouse.y);
      if (dm < LINK * 1.25) {
        ctx.strokeStyle = `rgba(56,189,248,${(1 - dm / (LINK * 1.25)) * .22})`;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
      }
      ctx.fillStyle = 'rgba(148,163,184,.5)';
      ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill();
    }
    rafId = requestAnimationFrame(step);
  }

  addEventListener('resize', () => { resize(); init(); }, { passive: true });
  hero.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
  }, { passive: true });
  hero.addEventListener('mouseleave', () => { mouse.x = mouse.y = -9999; });

  resize(); init();

  // Only animate while the hero is on screen
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !running) { running = true; step(); }
    else if (!e.isIntersecting && running) { running = false; cancelAnimationFrame(rafId); }
  }).observe(hero);
})();
