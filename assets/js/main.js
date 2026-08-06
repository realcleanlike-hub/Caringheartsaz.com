/* ===== NAVBAR ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ===== MOBILE MENU ===== */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

/* ===== SCROLL REVEAL ===== */
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
reveals.forEach(el => revealObserver.observe(el));

/* ===== TESTIMONIALS SLIDER ===== */
const track = document.getElementById('testimonialTrack');
const dotsContainer = document.getElementById('tDots');
const cards = track.querySelectorAll('.testimonial-card');
let current = 0;
let autoplay;

cards.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.className = 't-dot' + (i === 0 ? ' active' : '');
  dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
  dot.addEventListener('click', () => goTo(i));
  dotsContainer.appendChild(dot);
});

function goTo(index) {
  current = (index + cards.length) % cards.length;
  track.style.transform = `translateX(-${current * 100}%)`;
  dotsContainer.querySelectorAll('.t-dot').forEach((d, i) => {
    d.classList.toggle('active', i === current);
  });
}

function startAutoplay() {
  autoplay = setInterval(() => goTo(current + 1), 5000);
}
function stopAutoplay() {
  clearInterval(autoplay);
}

document.getElementById('tPrev').addEventListener('click', () => { stopAutoplay(); goTo(current - 1); startAutoplay(); });
document.getElementById('tNext').addEventListener('click', () => { stopAutoplay(); goTo(current + 1); startAutoplay(); });
track.parentElement.addEventListener('mouseenter', stopAutoplay);
track.parentElement.addEventListener('mouseleave', startAutoplay);
startAutoplay();

/* ===== CONTACT FORM — Formspree AJAX ===== */
const form = document.getElementById('contactForm');
const successMsg = document.getElementById('formSuccess');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'Sending…';
  btn.disabled = true;

  try {
    const data = new FormData(form);
    const response = await fetch(form.action, {
      method: 'POST',
      body: data,
      headers: { Accept: 'application/json' }
    });

    if (response.ok) {
      form.reset();
      successMsg.style.display = 'block';
      setTimeout(() => { successMsg.style.display = 'none'; }, 6000);
    } else {
      const json = await response.json();
      const msg = (json.errors || []).map(e => e.message).join(', ') ||
                  'Something went wrong. Please call us at (602) 621-0972.';
      alert(msg);
    }
  } catch {
    alert('Unable to send. Please call us directly at (602) 621-0972.');
  } finally {
    btn.textContent = 'Send Message →';
    btn.disabled = false;
  }
});

/* ===== ACTIVE NAV LINK ON SCROLL ===== */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 140) cur = s.id;
  });
  navAnchors.forEach(a => {
    const active = a.getAttribute('href') === '#' + cur;
    a.style.fontWeight = active ? '700' : '500';
  });
}, { passive: true });
