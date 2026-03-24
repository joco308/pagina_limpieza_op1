/* =========================================================
   MARKA CH'UXÑA MULTISERVICIOS S.R.L. — main.js
   Interacciones: Navbar, menú móvil, scroll suave,
                  animaciones on-scroll, back-to-top
   ========================================================= */

(function () {
  'use strict';

  /* ─── Elementos del DOM ─── */
  const navbar     = document.getElementById('navbar');
  const menuBtn    = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('.mobile-link, .btn-cta') : [];
  const backToTop  = document.getElementById('back-to-top');

  /* ───────────────────────────────────────
     1. NAVBAR — cambio de fondo al hacer scroll
  ─────────────────────────────────────── */
  function handleNavbarScroll () {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // ejecutar al cargar

  /* ───────────────────────────────────────
     2. MENÚ HAMBURGUESA (mobile)
  ─────────────────────────────────────── */
  function openMenu () {
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    menuBtn.classList.add('open');
    menuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // evitar scroll de fondo
  }

  function closeMenu () {
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    menuBtn.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function toggleMenu () {
    const isOpen = mobileMenu.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', toggleMenu);
  }

  // Cerrar al hacer clic en cualquier enlace del menú móvil
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Cerrar al hacer clic fuera del menú
  document.addEventListener('click', function (e) {
    if (
      mobileMenu &&
      mobileMenu.classList.contains('open') &&
      !mobileMenu.contains(e.target) &&
      !menuBtn.contains(e.target)
    ) {
      closeMenu();
    }
  });

  /* ───────────────────────────────────────
     3. SCROLL SUAVE para anclas (fallback
        por si el CSS scroll-behavior no es
        suficiente en algún navegador)
  ─────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const navHeight = navbar ? navbar.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ───────────────────────────────────────
     4. ANIMACIONES ON-SCROLL
        (IntersectionObserver para .fade-up)
  ─────────────────────────────────────── */
  const fadeElements = document.querySelectorAll('.fade-up');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // disparar solo una vez
          }
        });
      },
      {
        threshold: 0.12,   // 12 % del elemento visible dispara la animación
        rootMargin: '0px 0px -40px 0px',
      }
    );

    fadeElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: mostrar todo inmediatamente si no hay soporte
    fadeElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ───────────────────────────────────────
     5. BOTÓN "VOLVER ARRIBA"
  ─────────────────────────────────────── */
  function handleBackToTop () {
    if (!backToTop) return;
    if (window.scrollY > 300) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    window.addEventListener('scroll', handleBackToTop, { passive: true });
    handleBackToTop();
  }

  /* ───────────────────────────────────────
     6. LINK ACTIVO EN NAVBAR
        Resalta el enlace de la sección visible
  ─────────────────────────────────────── */
  const sections  = document.querySelectorAll('section[id], footer[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  function setActiveLink () {
    const scrollY   = window.scrollY;
    const navHeight = navbar ? navbar.offsetHeight : 80;
    let current     = '';

    sections.forEach(function (section) {
      const top    = section.offsetTop - navHeight - 60;
      const bottom = top + section.offsetHeight;
      if (scrollY >= top && scrollY < bottom) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active-link');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active-link');
      }
    });
  }

  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

  /* ───────────────────────────────────────
     7. ACTIVE LINK STYLE  (inyectado dinám.)
  ─────────────────────────────────────── */
  var styleTag = document.createElement('style');
  styleTag.textContent = '.nav-link.active-link { color: var(--navy-900); } .nav-link.active-link::after { transform: scaleX(1); }';
  document.head.appendChild(styleTag);

})();
