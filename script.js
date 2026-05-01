/**
 * Lentera Literasi — script.js
 * Fitur:
 *  1. Navigasi SPA (Single Page Application) antar halaman
 *  2. Navbar scroll effect + active link
 *  3. Mobile hamburger menu
 *  4. Filter TBM berdasarkan area
 *  5. Form kontak dengan validasi & pesan sukses
 *  6. Smooth scroll untuk link dalam halaman
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────
     1. ELEMENT REFERENCES
  ────────────────────────────────────────── */
  const navbar      = document.getElementById('navbar');
  const hamburger   = document.getElementById('hamburger');
  const navLinks    = document.getElementById('navLinks');
  const allNavLinks = document.querySelectorAll('.nav-link');
  const pages       = document.querySelectorAll('.page');
  const filterChips = document.querySelectorAll('.chip');
  const tbmCards    = document.querySelectorAll('.tbm-card');
  const kontakForm  = document.getElementById('kontakForm');
  const formSuccess = document.getElementById('formSuccess');

  /* ──────────────────────────────────────────
     2. SPA NAVIGATION — tampilkan satu halaman
  ────────────────────────────────────────── */

  /**
   * Tampilkan halaman sesuai id (home | tbm | kontak)
   * @param {string} pageId
   */
  function showPage(pageId) {
    // Sembunyikan semua halaman
    pages.forEach(p => p.classList.remove('active'));

    // Tampilkan halaman yang diminta
    const target = document.getElementById(pageId);
    if (target) {
      target.classList.add('active');
      // Scroll ke atas halaman
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Update active state pada nav link
    allNavLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.page === pageId);
    });

    // Tutup mobile menu kalau terbuka
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
  }

  // Pasang event listener ke semua nav link
  allNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showPage(link.dataset.page);
    });
  });

  // CTA buttons di halaman Home → navigasi ke halaman tujuan
  const ctaButtons = {
    ctaTBM:    'tbm',
    ctaKontak: 'kontak',
    ctaBanner: 'tbm',
  };
  Object.entries(ctaButtons).forEach(([id, page]) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', (e) => { e.preventDefault(); showPage(page); });
  });

  // Logo → selalu ke Home
  document.querySelector('.nav-logo').addEventListener('click', (e) => {
    e.preventDefault();
    showPage('home');
  });

  // Tampilkan halaman Home saat pertama kali
  showPage('home');

  /* ──────────────────────────────────────────
     3. NAVBAR — efek shadow saat scroll
  ────────────────────────────────────────── */
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
  });

  /* ──────────────────────────────────────────
     4. HAMBURGER — buka / tutup mobile menu
  ────────────────────────────────────────── */
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Tutup mobile menu saat klik di luar
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    }
  });

  /* ──────────────────────────────────────────
     5. FILTER TBM
  ────────────────────────────────────────── */
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      // Update chip aktif
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const filter = chip.dataset.filter;

      // Tampilkan / sembunyikan kartu TBM
      tbmCards.forEach(card => {
        const area = card.dataset.area;
        if (filter === 'all' || area === filter) {
          card.classList.remove('hidden');
          // Animasi masuk
          card.style.animation = 'none';
          // reflow trick
          void card.offsetWidth;
          card.style.animation = 'fadeIn .4s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ──────────────────────────────────────────
     6. FORM KONTAK — validasi & pesan sukses
  ────────────────────────────────────────── */
  if (kontakForm) {
    kontakForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Ambil nilai input
      const nama   = document.getElementById('nama').value.trim();
      const email  = document.getElementById('email').value.trim();
      const subjek = document.getElementById('subjek').value.trim();
      const pesan  = document.getElementById('pesan').value.trim();

      // Validasi sederhana
      if (!nama || !email || !subjek || !pesan) {
        alert('Harap lengkapi semua kolom sebelum mengirim pesan.');
        return;
      }

      // Validasi format email
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        alert('Format email tidak valid. Contoh: nama@email.com');
        return;
      }

      // Simulasi pengiriman (sembunyikan form, tampilkan sukses)
      kontakForm.style.display = 'none';
      formSuccess.classList.add('show');

      // Reset form setelah 4 detik & kembali tampilkan
      setTimeout(() => {
        kontakForm.reset();
        kontakForm.style.display = 'flex';
        formSuccess.classList.remove('show');
      }, 4000);
    });
  }

  /* ──────────────────────────────────────────
     7. ENTRANCE ANIMATION — kartu muncul saat
        halaman TBM pertama kali ditampilkan
  ────────────────────────────────────────── */
  function animateTBMCards() {
    tbmCards.forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      setTimeout(() => {
        card.style.transition = 'opacity .4s ease, transform .4s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, i * 80); // stagger 80ms per kartu
    });
  }

  // Jalankan animasi saat tombol navigasi ke TBM diklik
  document.querySelectorAll('[data-page="tbm"]').forEach(link => {
    link.addEventListener('click', () => {
      setTimeout(animateTBMCards, 100);
    });
  });
  document.querySelectorAll('#ctaTBM, #ctaBanner').forEach(btn => {
    btn.addEventListener('click', () => {
      setTimeout(animateTBMCards, 100);
    });
  });

}); // end DOMContentLoaded
