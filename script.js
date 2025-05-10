document.addEventListener('DOMContentLoaded', () => {
  const searchInput   = document.getElementById('searchInput');
  const sortSelect    = document.getElementById('sortSelect');
  const cardsContainer= document.getElementById('cardsContainer');
  const filterBtns    = document.querySelectorAll('.filter-btn');
  const themeToggle   = document.getElementById('themeToggle');
  const paginationEl  = document.getElementById('pagination');
  const root          = document.documentElement;

  const itemsPerPage = 4;
  let allData        = [];
  let activeCategory = 'all';
  let currentPage    = 1;
  let showAll        = false;
  let sortOrder      = 'newest';  // default
  

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    root.setAttribute('data-theme', savedTheme);
    themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
  }
  themeToggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? '' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
  });

  // Load data JSON
  fetch('data.json')
    .then(res => res.json())
    .then(data => {
      allData = data;
      updateDisplay();
    })
    .catch(err => console.error('Error loading JSON:', err));

  sortSelect.addEventListener('change', () => {
    sortOrder = sortSelect.value;
    currentPage = 1;
    showAll = false;
    updateDisplay();
  });

  // Pipeline: filter → sort → paginate → render
  function updateDisplay() {
    let items = allData.slice();

    // filter kategori
    if (activeCategory !== 'all') {
      items = items.filter(i => i.cat === activeCategory);
    }
    // filter search
    const q = searchInput.value.trim().toLowerCase();
    if (q) {
      items = items.filter(i => i.title.toLowerCase().includes(q));
    }

    // sort by date
    items.sort((a, b) => {
      const da = new Date(a.date), db = new Date(b.date);
      return sortOrder === 'newest' ? db - da : da - db;
    });

    const totalPages = Math.ceil(items.length / itemsPerPage);

    // slice untuk paging (kecuali mode All)
    let pageData;
    if (showAll || activeCategory !== 'all') {
      pageData = items;
    } else {
      if (currentPage > totalPages) currentPage = 1;
      const start = (currentPage - 1) * itemsPerPage;
      pageData = items.slice(start, start + itemsPerPage);
    }

    renderCards(pageData);
    renderPagination(totalPages);
  }

  function renderCards(arr) {
    if (arr.length === 0) {
      cardsContainer.innerHTML = '<p>Tidak ada hasil.</p>';
      return;
    }
    cardsContainer.innerHTML = arr.map(item => `
      <article class="card" data-cat="${item.cat}">
        <img src="${item.img}" alt="${item.title}" />
        <div class="card-content">
          <span class="badge">${item.badge}</span>
          <time datetime="${item.date}">${new Date(item.date).toLocaleDateString('id')}</time>
          <h2>${item.title}</h2>
          <a href="detail.html?id=${item.id}" class="read-more">Baca Selengkapnya →</a>
        </div>
      </article>
    `).join('');
  }

  function renderPagination(totalPages) {
    if (activeCategory !== 'all') {
      paginationEl.innerHTML = '';
      return;
    }
    let html = '';
    if (!showAll && currentPage > 1) {
      html += `<button class="page-arrow" data-page="${currentPage - 1}">&larr;</button>`;
    }
    if (showAll) {
      html += `<button class="all-btn active" data-all="true">All</button>`;
    } else {
      html += `<span class="page-number">${currentPage}</span>`;
    }
    if (!showAll && currentPage < totalPages) {
      html += `<button class="page-arrow" data-page="${currentPage + 1}">&rarr;</button>`;
    }
    if (!showAll) {
      html += `<button class="all-btn" data-all="true">All</button>`;
    }
    paginationEl.innerHTML = html;

    paginationEl.querySelectorAll('.page-arrow').forEach(b => {
      b.addEventListener('click', () => {
        showAll = false;
        currentPage = +b.dataset.page;
        updateDisplay();
      });
    });
    paginationEl.querySelectorAll('.all-btn').forEach(b => {
      b.addEventListener('click', () => {
        showAll = true;
        updateDisplay();
      });
    });
  }

  // filter kategori
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.cat;
      currentPage = 1;
      showAll = false;
      updateDisplay();
    });
  });

  // search input
  searchInput.addEventListener('input', () => {
    currentPage = 1;
    showAll = false;
    updateDisplay();
  });
});

// =======================
// Mobile menu toggle
// =======================
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const closeMenu = document.getElementById('closeMenu');

// buka side menu
menuToggle.addEventListener('click', () => {
  mobileMenu.classList.add('open');
});

// tutup side menu
closeMenu.addEventListener('click', () => {
  mobileMenu.classList.remove('open');
});

// juga toggle tema di mobile (mirror themeToggle)
const themeToggleMobile = document.getElementById('themeToggleMobile');
themeToggleMobile.addEventListener('click', () => {
  themeToggle.click();
});

const mobileLinks = document.querySelectorAll('#mobileMenu ul a');
mobileLinks.forEach(link =>
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
  })
);
