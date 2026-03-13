/* ============================================================
   PARTICLES CANVAS
   ============================================================ */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function randBetween(a, b) { return a + Math.random() * (b - a); }

  function createParticles() {
    particles = [];
    const count = Math.min(60, Math.floor(W / 22));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: randBetween(1, 2.8),
        vx: randBetween(-0.18, 0.18),
        vy: randBetween(-0.18, 0.18),
        alpha: randBetween(0.2, 0.6),
      });
    }
  }
  createParticles();

  function getAccentColor() {
    const theme = document.documentElement.getAttribute('data-theme');
    return theme === 'light' ? '157,78,221' : '199,125,255';
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const color = getAccentColor();

    particles.forEach(p => {
      // Move
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      // Draw
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color}, ${p.alpha})`;
      ctx.fill();
    });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${color}, ${0.12 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }
  draw();
})();

/* ============================================================
   THEME TOGGLE
   ============================================================ */
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');
const html        = document.documentElement;

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('portfolio-theme', theme);

  if (theme === 'light') {
    themeIcon.className = 'fas fa-moon';
    updateGitHubCards('light');
  } else {
    themeIcon.className = 'fas fa-sun';
    updateGitHubCards('dark');
  }
}

// GitHub stats cards — swap src based on theme
function updateGitHubCards(theme) {
  const bg      = theme === 'dark' ? '1a0a2e' : 'fff0f7';
  const title   = theme === 'dark' ? 'c77dff'  : '9d4edd';
  const icon    = theme === 'dark' ? '9d4edd'  : 'c930e8';
  const textCol = theme === 'dark' ? 'c8b4e3'  : '4a2070';

  const ghStats = document.getElementById('ghStats');
  const ghLangs = document.getElementById('ghLangs');
  const ghStreak = document.getElementById('ghStreak');

  if (ghStats) {
    ghStats.src =
      `https://github-readme-stats.vercel.app/api?username=Iddah-chela&show_icons=true&hide_border=true&bg_color=${bg}&title_color=${title}&icon_color=${icon}&text_color=${textCol}&rank_icon=github`;
  }
  if (ghLangs) {
    ghLangs.src =
      `https://github-readme-stats.vercel.app/api/top-langs/?username=Iddah-chela&layout=compact&hide_border=true&bg_color=${bg}&title_color=${title}&text_color=${textCol}`;
  }
  if (ghStreak) {
    const ringCol   = theme === 'dark' ? '9d4edd' : '9d4edd';
    const fireCol   = theme === 'dark' ? 'c77dff' : 'f72585';
    const labelCol  = theme === 'dark' ? 'c8b4e3' : '4a2070';
    const datesCol  = theme === 'dark' ? '8a7a9b' : '7a5a8a';
    ghStreak.src =
      `https://streak-stats.demolab.com/?user=Iddah-chela&hide_border=true&background=${bg}&ring=${ringCol}&fire=${fireCol}&currStreakLabel=${labelCol}&sideLabels=${labelCol}&dates=${datesCol}`;
  }
}

// Load saved theme or default dark
const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
applyTheme(savedTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
}

/* ============================================================
   NAVBAR SCROLL EFFECT
   ============================================================ */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  highlightActiveNav();
}, { passive: true });

/* ============================================================
   MOBILE MENU
   ============================================================ */
const hamburger  = document.getElementById('navHamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });

  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
    });
  });
}

/* ============================================================
   ACTIVE NAV LINK ON SCROLL
   ============================================================ */
function highlightActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  let current = '';

  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    if (window.scrollY >= top) {
      current = sec.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

/* ============================================================
   TYPEWRITER EFFECT
   ============================================================ */
(function typewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const words = [
    'Full Stack Developer',
    'Web App Builder',
    'Problem Solver',
    'UI Crafter',
    'Kenyan Dev 🇰🇪',
  ];

  let wordIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let pause = false;

  function type() {
    const current = words[wordIdx];

    if (pause) {
      pause = false;
      setTimeout(type, 1400);
      return;
    }

    if (!deleting) {
      el.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        deleting = true;
        pause = true;
      }
      setTimeout(type, 90);
    } else {
      el.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        wordIdx = (wordIdx + 1) % words.length;
      }
      setTimeout(type, 45);
    }
  }
  setTimeout(type, 800);
})();

/* ============================================================
   SCROLL REVEAL (IntersectionObserver)
   ============================================================ */
(function scrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Don't unobserve so that re-entering also works
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

/* ============================================================
   CONTACT FORM (client-side only — wire up Formspree to actually send)
   ============================================================ */
const contactForm = document.getElementById('contactForm');
const formStatus  = document.getElementById('formStatus');

if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    const action = (contactForm.getAttribute('action') || '').trim();
    const hasRealAction = action && action !== '#';

    if (!hasRealAction) {
      e.preventDefault();

      // PLACEHOLDER: Replace this block with a real submission using Formspree or EmailJS.
      // Formspree: set the form's action to "https://formspree.io/f/YOUR_FORM_ID"
      //            and let it submit normally (remove e.preventDefault), OR
      //            use fetch to POST and handle the response here.
      // EmailJS:   https://emailjs.com — free tier allows 200 emails/month.

      // Simulated success feedback:
      if (formStatus) {
        formStatus.style.color = 'var(--accent-light)';
        formStatus.textContent = '✓ Message sent! I\'ll get back to you soon.';
      }
      contactForm.reset();

      setTimeout(() => {
        if (formStatus) formStatus.textContent = '';
      }, 5000);
      return;
    }

    // Real submission path (Formspree or another backend)
    if (formStatus) {
      formStatus.style.color = 'var(--text-muted)';
      formStatus.textContent = 'Sending...';
    }
  });
}

/* ============================================================
   SMOOTH SCROLL FOR BUTTONS / LINKS
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
