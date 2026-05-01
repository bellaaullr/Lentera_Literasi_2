/**
 * navigation.js
 * Modul navigasi — mengelola perpindahan antar halaman (SPA)
 * dan efek navbar saat scroll.
 */

const Navigation = (() => {

  // ── State ──
  let currentPage = 'home';

  // ── Referensi elemen ──
  const navbar    = () => document.getElementById('navbar');
  const hamburger = () => document.getElementById('hamburger');
  const navDrawer = () => document.getElementById('navDrawer');
  const pages     = () => document.querySelectorAll('.page');
  const navLinks  = () => document.querySelectorAll('.nav-link');

  /**
   * Tampilkan halaman berdasarkan ID
   * @param {string} pageId  - 'home' | 'tbm' | 'kontak'
   */
  function goTo(pageId) {
    if (pageId === currentPage) {
      closeDrawer();
      return;
    }

    // Sembunyikan semua halaman
    pages().forEach(p => p.classList.remove('active'));

    // Tampilkan halaman target
    const target = document.getElementById(`page-${pageId}`);
    if (target) {
      target.classList.add('active');
    }

    // Update active state nav link
    navLinks().forEach(link => {
      link.classList.toggle('active', link.dataset.page === pageId);
    });

    currentPage = pageId;
    closeDrawer();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Trigger event agar modul lain bisa bereaksi
    document.dispatchEvent(new CustomEvent('pageChanged', { detail: { page: pageId } }));
  }

  /**
   * Tutup mobile drawer
   */
  function closeDrawer() {
    const hb = hamburger();
    const dr = navDrawer();
    if (hb) hb.classList.remove('open');
    if (dr) dr.classList.remove('open');
  }

  /**
   * Toggle hamburger / mobile drawer
   */
  function toggleDrawer() {
    hamburger().classList.toggle('open');
    navDrawer().classList.toggle('open');
  }

  /**
   * Inisialisasi semua event listener navigasi
   */
  function init() {
    // Klik nav link
    navLinks().forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        goTo(link.dataset.page);
      });
    });

    // Hamburger toggle
    const hb = hamburger();
    if (hb) hb.addEventListener('click', toggleDrawer);

    // Tutup drawer saat klik di luar
    document.addEventListener('click', (e) => {
      const nav = navbar();
      if (nav && !nav.contains(e.target)) closeDrawer();
    });

    // Scroll: tambah class 'scrolled' pada navbar
    window.addEventListener('scroll', () => {
      const nav = navbar();
      if (nav) nav.classList.toggle('scrolled', window.scrollY > 10);
    });

    // Tampilkan halaman awal
    goTo('home');
  }

  // ── Public API ──
  return { init, goTo };

})();
