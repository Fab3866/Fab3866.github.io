/* ============================================================
   LE NOUVEAU LÉVIATHAN — main.js
   Animations, scroll, interactions communes
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Fade-in au scroll ──────────────────────────────────
  const fadeEls = document.querySelectorAll('.fade-in');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  fadeEls.forEach(el => observer.observe(el));

  // ── Bouton retour en haut ──────────────────────────────
  const btnTop = document.getElementById('btn-top');
  if (btnTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        btnTop.style.opacity = '1';
        btnTop.style.pointerEvents = 'auto';
      } else {
        btnTop.style.opacity = '0';
        btnTop.style.pointerEvents = 'none';
      }
    });
    btnTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── Navbar scroll effect ───────────────────────────────
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 10, 15, 0.98)';
      } else {
        navbar.style.background = 'rgba(10, 10, 15, 0.92)';
      }
    });
  }

  // ── Active nav link ─────────────────────────────────────
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') && currentPath.includes(link.getAttribute('href'))) {
      link.classList.add('active');
    }
  });

  // ── Progress bars animation ────────────────────────────
  const progressFills = document.querySelectorAll('.progress-fill');
  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target.dataset.width;
        entry.target.style.width = target + '%';
        progressObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  progressFills.forEach(el => {
    el.style.width = '0%';
    progressObserver.observe(el);
  });

});
