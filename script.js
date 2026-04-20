/**
 * ═══════════════════════════════════════════════════════
 *  SAUMYA MISHRA — PORTFOLIO  |  script.js
 *  Modules:
 *   1.  Loader             — animated ring loader
 *   2.  Three.js BG        — particle field + 3D objects
 *   3.  Custom Cursor      — dot + magnetic ring
 *   4.  Typed Text         — role cycling typewriter
 *   5.  Hero Animations    — GSAP entrance
 *   6.  Robot Eye Tracking — SVG pupils follow cursor
 *   7.  Matter.js Physics  — falling skill pills
 *   8.  Build Skills       — dynamic bar & cloud generation
 *   9.  GSAP ScrollTrigger — section reveals + counter
 *   10. 3D Card Tilt       — mouse-based perspective tilt
 *   11. Navbar             — scroll shrink + active links
 *   12. Mobile Menu        — hamburger + overlay
 *   13. Parallax           — orb + robot scroll offset
 *   14. Contact Form       — submit + success state
 * ═══════════════════════════════════════════════════════
 */

/* ═══ Wait for defer scripts to load ═══ */
window.addEventListener('load', () => {
  gsap.registerPlugin(ScrollTrigger, TextPlugin);
  initLoader();
});

/* ════════════════════════════════════════
   DATA — centralised content
════════════════════════════════════════ */
const DATA = {
  roles: [
    'Software Developer',
    'Web Developer',
    'Data Analytics Enthusiast',
    'MCA Student',
    'Power BI Developer',
    'Full Stack Engineer'
  ],
  skillsLang: [
    { name: 'Python',          pct: 85, color: '#3776ab' },
    { name: 'Java',            pct: 76, color: '#f89820' },
    { name: 'React / JS',      pct: 80, color: '#61dafb' },
    { name: 'HTML / CSS',      pct: 92, color: '#e44d26' },
  ],
  skillsData: [
    { name: 'SQL',             pct: 82, color: '#336791' },
    { name: 'MongoDB',         pct: 74, color: '#4db33d' },
    { name: 'Power BI',        pct: 85, color: '#f2c811' },
    { name: 'Microsoft Excel', pct: 80, color: '#1d6f42' },
    { name: 'Tableau',         pct: 68, color: '#e97627' },
  ],
  techCloud: [
    { icon: '🐍', label: 'Python'     },
    { icon: '☕', label: 'Java'       },
    { icon: '⚛️', label: 'React'     },
    { icon: '📜', label: 'JavaScript' },
    { icon: '🌐', label: 'HTML / CSS' },
    { icon: '🗄️', label: 'SQL'       },
    { icon: '🍃', label: 'MongoDB'    },
    { icon: '📊', label: 'Power BI'   },
    { icon: '📈', label: 'Excel'      },
    { icon: '🔧', label: 'Git'        },
    { icon: '📓', label: 'Jupyter'    },
    { icon: '📉', label: 'Tableau'    },
  ]
};

/* ════════════════════════════════════════
   MODULE 1 — LOADER
════════════════════════════════════════ */
function initLoader() {
  const bar   = document.getElementById('ldrBar');
  const label = document.getElementById('ldrLabel');
  const loader = document.getElementById('loader');
  const steps = ['Initializing...', 'Loading assets...', 'Building 3D scene...', 'Almost there...'];
  let p = 0, si = 0;

  const tick = setInterval(() => {
    // Accelerate towards 100, then snap
    p += (Math.random() * 10) + 2;
    if (p >= 100) p = 100;

    bar.style.width = p + '%';
    const ni = Math.floor((p / 100) * steps.length);
    if (ni !== si && ni < steps.length) { si = ni; label.textContent = steps[si]; }

    if (p >= 100) {
      clearInterval(tick);
      label.textContent = 'Ready!';
      setTimeout(() => {
        gsap.to(loader, {
          yPercent: -100,
          duration: 0.9,
          ease: 'power4.inOut',
          onComplete: () => {
            loader.style.display = 'none';
            bootAll(); // ← fire everything
          }
        });
      }, 320);
    }
  }, 55);
}

/* ════════════════════════════════════════
   MODULE 2 — THREE.JS BACKGROUND
════════════════════════════════════════ */
function initThree() {
  const canvas   = document.getElementById('three-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 4;

  /* ─ Particle field ─ */
  const N = 2800;
  const positions = new Float32Array(N * 3);
  for (let i = 0; i < N * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 20;
  }
  const ptGeo = new THREE.BufferGeometry();
  ptGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const ptMat = new THREE.PointsMaterial({
    size: 0.016, color: 0x6c63ff, transparent: true, opacity: 0.5, sizeAttenuation: true
  });
  const particles = new THREE.Points(ptGeo, ptMat);
  scene.add(particles);

  /* ─ Icosahedron wireframe ─ */
  const icoMesh = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.5, 1),
    new THREE.MeshBasicMaterial({ color: 0x6c63ff, wireframe: true, transparent: true, opacity: 0.035 })
  );
  icoMesh.position.set(-5.5, 2, -5);
  scene.add(icoMesh);

  /* ─ Torus knot ─ */
  const torusMesh = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.85, 0.24, 140, 20),
    new THREE.MeshBasicMaterial({ color: 0xa78bfa, wireframe: true, transparent: true, opacity: 0.03 })
  );
  torusMesh.position.set(7, -2, -6);
  scene.add(torusMesh);

  /* ─ Dodecahedron ─ */
  const dodMesh = new THREE.Mesh(
    new THREE.DodecahedronGeometry(0.9, 0),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.03 })
  );
  dodMesh.position.set(0, -4, -3);
  scene.add(dodMesh);

  /* ─ Mouse parallax ─ */
  let mx = 0, my = 0;
  window.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth  - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  /* ─ Resize ─ */
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  /* ─ Animation loop ─ */
  const clock = new THREE.Clock();
  (function loop() {
    const t = clock.getElapsedTime();
    particles.rotation.y = t * 0.032;
    particles.rotation.x = t * 0.011;
    icoMesh.rotation.x   = t * 0.2;
    icoMesh.rotation.y   = t * 0.15;
    torusMesh.rotation.x = t * 0.17;
    torusMesh.rotation.y = t * 0.22;
    dodMesh.rotation.y   = t * 0.25;
    dodMesh.rotation.z   = t * 0.1;

    // Smooth parallax
    camera.position.x += (mx * 0.5 - camera.position.x) * 0.035;
    camera.position.y += (-my * 0.4 - camera.position.y) * 0.035;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  })();
}

/* ════════════════════════════════════════
   MODULE 3 — CUSTOM CURSOR
════════════════════════════════════════ */
function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  const text = document.getElementById('cursor-text');

  /* Position dot instantly, lag ring with GSAP */
  window.addEventListener('mousemove', e => {
    dot.style.left = e.clientX + 'px';
    dot.style.top  = e.clientY + 'px';
    gsap.to(ring, { left: e.clientX, top: e.clientY, duration: 0.11, ease: 'power2.out' });
    gsap.to(text, { left: e.clientX, top: e.clientY + 44, duration: 0.11, ease: 'power2.out' });
  });

  /* Hover state for interactive elements */
  document.querySelectorAll('a, button, .proj-card, .sk-item, .cl-item, .cert, .exp-card')
    .forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

  /* "View" state for project cards */
  document.querySelectorAll('.proj-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-view');
      text.textContent = 'VIEW';
    });
    card.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-view');
    });
  });

  /* Hide on leave */
  document.addEventListener('mouseleave', () => {
    gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
  });
  document.addEventListener('mouseenter', () => {
    gsap.to([dot, ring], { opacity: 1, duration: 0.2 });
  });
}

/* ════════════════════════════════════════
   MODULE 4 — TYPED TEXT
════════════════════════════════════════ */
function initTyped() {
  const el = document.getElementById('typedText');
  if (!el) return;
  const roles = DATA.roles;
  let i = 0;

  function write() {
    const role = roles[i++ % roles.length];
    gsap.to(el, {
      duration: role.length * 0.048,
      text: { value: role, delimiter: '' },
      ease: 'none',
      onComplete: () => setTimeout(erase, 2200)
    });
  }

  function erase() {
    const len = el.textContent.length;
    gsap.to(el, {
      duration: len * 0.026,
      text: { value: '', delimiter: '' },
      ease: 'none',
      onComplete: () => setTimeout(write, 380)
    });
  }

  write();
}

/* ════════════════════════════════════════
   MODULE 5 — HERO ENTRANCE ANIMATIONS
════════════════════════════════════════ */
function initHeroAnim() {
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  // Stagger each element
  tl.from('.hero-badge',     { opacity: 0, y: 28, duration: 0.7 }, 0.05)
    .from('.hn-inner',       { yPercent: 115, opacity: 0, duration: 1.0, stagger: 0.18 }, 0.25)
    .from('.hero-role-wrap', { opacity: 0, y: 22, duration: 0.65 }, 0.85)
    .from('.hero-desc',      { opacity: 0, y: 18, duration: 0.6  }, 1.0)
    .from('.hero-btns > *',  { opacity: 0, y: 20, duration: 0.5, stagger: 0.13 }, 1.12)
    .from('.hc-item, .hc-sep',{ opacity: 0, y: 16, duration: 0.5, stagger: 0.08 }, 1.28)
    .from('.robot-stage',    { opacity: 0, x: 70, duration: 1.0, ease: 'power3.out' }, 0.5)
    .from('.scroll-cue',     { opacity: 0, duration: 0.6 }, 1.7);
}

/* ════════════════════════════════════════
   MODULE 6 — ROBOT EYE TRACKING
════════════════════════════════════════ */
function initRobotEyes() {
  const pupilL = document.getElementById('pupilL');
  const pupilR = document.getElementById('pupilR');
  const stage  = document.getElementById('robotStage');
  if (!pupilL || !pupilR || !stage) return;

  const BASE = { lx: 88, ly: 72, rx: 152, ry: 72 };
  const MAX  = 4;

  window.addEventListener('mousemove', e => {
    const rect  = stage.getBoundingClientRect();
    if (!rect.width) return;

    // Normalised offset from robot's face
    const faceX = rect.left + rect.width  * 0.5;
    const faceY = rect.top  + rect.height * 0.3;
    const dx = e.clientX - faceX;
    const dy = e.clientY - faceY;
    const dist = Math.hypot(dx, dy);
    const clamp = dist > 80 ? 80 : dist;
    const nx = (dx / dist) * (MAX * clamp / 80);
    const ny = (dy / dist) * (MAX * clamp / 80);

    pupilL.setAttribute('cx', (BASE.lx + nx).toFixed(2));
    pupilL.setAttribute('cy', (BASE.ly + ny).toFixed(2));
    pupilR.setAttribute('cx', (BASE.rx + nx).toFixed(2));
    pupilR.setAttribute('cy', (BASE.ry + ny).toFixed(2));
  });
}

/* ════════════════════════════════════════
   MODULE 7 — MATTER.JS PHYSICS PILLS
════════════════════════════════════════ */
function initPhysics() {
  const cv = document.getElementById('physics-canvas');
  if (!cv) return;

  const W = window.innerWidth;
  const H = window.innerHeight;
  cv.width  = W;
  cv.height = H;
  const ctx = cv.getContext('2d');

  const { Engine, Runner, Bodies, Composite, Events } = Matter;
  const engine = Engine.create({ gravity: { y: 0.7 } });
  Runner.run(Runner.create(), engine);

  // Invisible walls + floor
  Composite.add(engine.world, [
    Bodies.rectangle(W / 2, H + 32, W, 64, { isStatic: true }),
    Bodies.rectangle(-32, H / 2, 64, H, { isStatic: true }),
    Bodies.rectangle(W + 32, H / 2, 64, H, { isStatic: true })
  ]);

  // Pill words from all skill arrays
  const words = DATA.skillsLang.map(s => s.name)
    .concat(DATA.skillsData.map(s => s.name))
    .concat(['Git', 'Jupyter', 'OOP', 'APIs']);

  const bodies = [];
  words.forEach((word, i) => {
    setTimeout(() => {
      const w = word.length * 9.2 + 28;
      const body = Bodies.rectangle(
        80 + Math.random() * (W - 160),
        -60 - i * 40,
        w, 36,
        { restitution: 0.3, frictionAir: 0.04, label: word, angle: (Math.random()-0.5) * 0.7 }
      );
      Composite.add(engine.world, body);
      bodies.push(body);
    }, i * 200 + 600);
  });

  /* Render pills */
  function draw() {
    ctx.clearRect(0, 0, W, H);
    bodies.forEach(b => {
      if (b.position.y > H + 60) return;
      ctx.save();
      ctx.translate(b.position.x, b.position.y);
      ctx.rotate(b.angle);

      const tw = b.label.length * 9.2 + 28;
      ctx.beginPath();
      ctx.roundRect(-tw/2, -18, tw, 36, 10);
      ctx.fillStyle   = 'rgba(108,99,255,0.10)';
      ctx.strokeStyle = 'rgba(108,99,255,0.40)';
      ctx.lineWidth   = 1;
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle    = 'rgba(167,139,250,0.90)';
      ctx.font         = '500 12px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(b.label, 0, 0);
      ctx.restore();
    });
  }

  Events.on(engine, 'afterUpdate', draw);

  // Fade canvas after 6s so it doesn't clutter scrolling
  setTimeout(() => {
    let op = 1;
    const fade = setInterval(() => {
      op -= 0.022;
      cv.style.opacity = op < 0 ? 0 : op;
      if (op <= 0) { clearInterval(fade); cv.style.pointerEvents = 'none'; }
    }, 50);
  }, 6000);
}

/* ════════════════════════════════════════
   MODULE 8 — BUILD SKILLS UI
════════════════════════════════════════ */
function buildSkills() {
  /* ─ Skill bars ─ */
  function renderBars(containerId, skills) {
    const wrap = document.getElementById(containerId);
    if (!wrap) return;
    skills.forEach(skill => {
      wrap.insertAdjacentHTML('beforeend', `
        <div class="sk-item">
          <div class="sk-head">
            <span class="sk-name">${skill.name}</span>
            <span class="sk-pct">${skill.pct}%</span>
          </div>
          <div class="sk-track">
            <div class="sk-bar" style="color:${skill.color}" data-pct="${skill.pct}"></div>
          </div>
        </div>
      `);
    });
  }
  renderBars('skillBarsLang', DATA.skillsLang);
  renderBars('skillBarsData', DATA.skillsData);

  /* ─ Tech cloud ─ */
  const cloud = document.getElementById('techCloud');
  if (cloud) {
    DATA.techCloud.forEach(item => {
      const el = document.createElement('div');
      el.className = 'tc-item';
      el.innerHTML = `<span class="tc-icon">${item.icon}</span><span>${item.label}</span>`;
      cloud.appendChild(el);
    });
  }
}

/* ════════════════════════════════════════
   MODULE 9 — GSAP SCROLL ANIMATIONS
════════════════════════════════════════ */
function initScrollAnims() {
  /* ─ Section titles ─ */
  gsap.utils.toArray('.section-title').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 82%' },
      opacity: 0, y: 40, duration: 0.85, ease: 'power3.out'
    });
  });

  /* ─ Eyebrows ─ */
  gsap.utils.toArray('.eyebrow').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 88%' },
      opacity: 0, y: 14, duration: 0.5
    });
  });

  /* ─ About text ─ */
  gsap.from('.about-text', {
    scrollTrigger: { trigger: '#about', start: 'top 75%' },
    opacity: 0, x: -52, duration: 0.95, ease: 'power3.out'
  });
  gsap.from('.about-visual', {
    scrollTrigger: { trigger: '#about', start: 'top 75%' },
    opacity: 0, x: 52, duration: 0.95, ease: 'power3.out', delay: 0.14
  });
  gsap.from('.cert', {
    scrollTrigger: { trigger: '.cert-list', start: 'top 88%' },
    opacity: 0, x: -20, stagger: 0.1, duration: 0.5, ease: 'power2.out'
  });

  /* ─ Skill bars ─ */
  document.querySelectorAll('.sk-bar').forEach(bar => {
    const pct = bar.getAttribute('data-pct');
    gsap.to(bar, {
      scrollTrigger: { trigger: bar, start: 'top 92%' },
      width: pct + '%',
      duration: 1.4,
      ease: 'power2.out'
    });
  });

  gsap.from('.sk-item', {
    scrollTrigger: { trigger: '#skills', start: 'top 75%' },
    opacity: 0, y: 24, stagger: 0.07, duration: 0.65
  });

  gsap.from('.tc-item', {
    scrollTrigger: { trigger: '.tech-cloud', start: 'top 85%' },
    opacity: 0, scale: 0.75, stagger: 0.055, duration: 0.4, ease: 'back.out(1.8)'
  });

  /* ─ Project cards ─ */
  gsap.from('.proj-card', {
    scrollTrigger: { trigger: '#projects', start: 'top 78%' },
    opacity: 0, y: 48, stagger: 0.1, duration: 0.8, ease: 'power3.out'
  });

  /* ─ Contact ─ */
  gsap.from('.contact-info', {
    scrollTrigger: { trigger: '#contact', start: 'top 78%' },
    opacity: 0, x: -40, duration: 0.9, ease: 'power3.out'
  });
  gsap.from('.contact-form', {
    scrollTrigger: { trigger: '#contact', start: 'top 78%' },
    opacity: 0, x: 40, duration: 0.9, ease: 'power3.out', delay: 0.12
  });

  /* ─ Hero counters (countup animation) ─ */
  ScrollTrigger.create({
    trigger: '.hero-counters',
    start: 'top 90%',
    once: true,
    onEnter: () => {
      document.querySelectorAll('.hc-num').forEach(el => {
        const target = parseInt(el.dataset.target, 10);
        let curr = 0;
        const step = target / 40;
        const iv = setInterval(() => {
          curr += step;
          if (curr >= target) { curr = target; clearInterval(iv); }
          el.textContent = Math.floor(curr);
        }, 30);
      });
    }
  });
}

/* ════════════════════════════════════════
   MODULE 10 — 3D CARD TILT
════════════════════════════════════════ */
function initTilt() {
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const xN = (e.clientX - r.left) / r.width  - 0.5; // -0.5 to 0.5
      const yN = (e.clientY - r.top)  / r.height - 0.5;

      gsap.to(card, {
        rotateY: xN * 13,
        rotateX: -yN * 10,
        transformPerspective: 900,
        duration: 0.35,
        ease: 'power2.out'
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateY: 0, rotateX: 0,
        duration: 0.75,
        ease: 'elastic.out(1, 0.5)'
      });
    });
  });
}

/* ════════════════════════════════════════
   MODULE 11 — NAVBAR
════════════════════════════════════════ */
function initNavbar() {
  const header  = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nl');

  /* Scroll shrink */
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  });

  /* Active link on section intersection */
  const sections = document.querySelectorAll('section[id]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.classList.add('active');
        }
      });
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
}

/* ════════════════════════════════════════
   MODULE 12 — MOBILE MENU
════════════════════════════════════════ */
function initMobileMenu() {
  const burger  = document.getElementById('hamburger');
  const overlay = document.getElementById('mobOverlay');
  if (!burger || !overlay) return;

  let open = false;

  const openMenu = () => {
    open = true;
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true');
    // Animate lines into X
    const [l1, l2] = burger.querySelectorAll('.hb-line');
    gsap.to(l1, { y: 4,  rotate: 45,  duration: 0.3, ease: 'power2.out' });
    gsap.to(l2, { y: -4, rotate: -45, duration: 0.3, ease: 'power2.out' });
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    open = false;
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false');
    const [l1, l2] = burger.querySelectorAll('.hb-line');
    gsap.to(l1, { y: 0, rotate: 0, duration: 0.3, ease: 'power2.out' });
    gsap.to(l2, { y: 0, rotate: 0, duration: 0.3, ease: 'power2.out' });
    document.body.style.overflow = '';
  };

  burger.addEventListener('click', () => open ? closeMenu() : openMenu());

  overlay.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeMenu);
  });

  // Keyboard accessibility
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && open) closeMenu();
  });
}

/* ════════════════════════════════════════
   MODULE 13 — PARALLAX
════════════════════════════════════════ */
function initParallax() {
  const orb1   = document.querySelector('.orb-1');
  const orb2   = document.querySelector('.orb-2');
  const robot  = document.querySelector('.robot-stage');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (orb1) orb1.style.transform = `translateY(${y * 0.18}px)`;
    if (orb2) orb2.style.transform = `translateY(${y * 0.11}px)`;
    if (robot) {
      // Float animation uses CSS; add scroll offset on top via margin
      robot.style.marginTop = (y * 0.1) + 'px';
    }
  });
}

/* ════════════════════════════════════════
   MODULE 14 — CONTACT FORM
════════════════════════════════════════ */
function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const btn  = form.querySelector('.btn-submit');
    const text = btn.querySelector('.submit-text');

    // Loading state
    text.textContent = 'Sending...';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    // Simulate async send
    setTimeout(() => {
      text.textContent = 'Send Message';
      btn.disabled = false;
      btn.style.opacity = '1';
      form.reset();
      success.classList.add('show');
      setTimeout(() => success.classList.remove('show'), 5000);
    }, 1600);
  });
}

/* ════════════════════════════════════════
   BOOT — called after loader exits
════════════════════════════════════════ */
function bootAll() {
  // Build dynamic DOM first
  buildSkills();

  // Then init all modules
  initThree();
  initCursor();
  initTyped();
  initHeroAnim();
  initRobotEyes();
  initPhysics();
  initScrollAnims();
  initTilt();
  initNavbar();
  initMobileMenu();
  initParallax();
  initContactForm();

  // Small extra: GSAP footer reveal
  gsap.from('#footer .footer-inner > *', {
    scrollTrigger: { trigger: '#footer', start: 'top 90%' },
    opacity: 0, y: 20, stagger: 0.12, duration: 0.6
  });
}
