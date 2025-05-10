document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');
  
    // Inisialisasi tema dari LocalStorage
    const saved = localStorage.getItem('theme');
    if (saved) {
      root.setAttribute('data-theme', saved);
      themeToggle.textContent = saved === 'dark' ? '☀️' : '🌙';
    }
  
    themeToggle.addEventListener('click', () => {
      const curr = root.getAttribute('data-theme') === 'dark' ? '' : 'dark';
      root.setAttribute('data-theme', curr);
      localStorage.setItem('theme', curr);
      themeToggle.textContent = curr === 'dark' ? '☀️' : '🌙';
    });
  
    // Render detail artikel
    const detailContainer = document.getElementById('detailContainer');
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'), 10);
  
    fetch('data.json')
      .then(res => res.json())
      .then(data => {
        const item = data.find(d => d.id === id);
        if (!item) {
          detailContainer.innerHTML = '<p>Artikel tidak ditemukan.</p>';
          return;
        }
  
        detailContainer.innerHTML = `
          <article class="card">
            <img src="${item.img}" alt="${item.title}" />
            <div class="card-content">
              <span class="badge">${item.badge}</span>
              <time datetime="${item.date}">${new Date(item.date).toLocaleDateString('id')}</time>
              <h2>${item.title}</h2>
              <div class="article-content">
                <p>[Isi paragraf pertama artikel di sini...]</p>
                <p>[Isi paragraf kedua artikel di sini...]</p>
                <p>[Isi paragraf ketiga artikel di sini...]</p>
              </div>
              <a href="index.html" class="read-more">← Kembali ke Beranda</a>
            </div>
          </article>
        `;
      })
      .catch(err => console.error('Error loading JSON:', err));
  });

// ===== MOBILE MENU TOGGLE =====
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const closeMenu  = document.getElementById('closeMenu');

// buka/tutup
menuToggle.addEventListener('click', () => mobileMenu.classList.add('open'));
closeMenu .addEventListener('click', () => mobileMenu.classList.remove('open'));

// auto-close saat link diklik
document.querySelectorAll('#mobileMenu ul a')
  .forEach(a => a.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
  }));

// mirror theme toggle (jika di detail juga pakai toggle tema)
const themeToggleMobile = document.getElementById('themeToggleMobile');
if (themeToggleMobile) {
  themeToggleMobile.addEventListener('click', () => {
    document.getElementById('themeToggle').click();
  });
}
