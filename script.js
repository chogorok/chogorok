'use strict';

// ===== DATA =====

const BOOKS = [
  { id:1, title:'이것이 내 처음이다', author:'김서연', price:14000, cat:'debut', tag:'데뷔작', c:['#2D4A2D','#3D7A3D'], desc:'단편소설집' },
  { id:2, title:'처음 쓴 편지들',     author:'박지우', price:12000, cat:'indie', tag:'독립출판', c:['#5C4033','#8B6555'], desc:'에세이'    },
  { id:3, title:'초고',               author:'이다은', price:16000, cat:'debut', tag:'데뷔작', c:['#1C2D4A','#2D4A7A'], desc:'시집'      },
  { id:4, title:'어느 첫날의 기록',   author:'정민준', price:11000, cat:'indie', tag:'독립출판', c:['#4A2D5C','#7A4A8B'], desc:'산문집'    },
  { id:5, title:'파종',               author:'오수진', price:18000, cat:'first', tag:'초판본', c:['#3A4A1C','#6B8B2D'], desc:'장편소설'   },
  { id:6, title:'무대 밖에서',         author:'최연우', price:13000, cat:'debut', tag:'데뷔작', c:['#4A2D1C','#8B5A2D'], desc:'에세이'    },
  { id:7, title:'첫 계절',             author:'윤하늘', price:15000, cat:'first', tag:'초판본', c:['#2D3A5C','#4A5C8B'], desc:'시집'      },
  { id:8, title:'시작하는 글들',       author:'한수민', price:10000, cat:'indie', tag:'독립출판', c:['#4A4A1C','#8B8B2D'], desc:'잡지'     },
];

const SCRIPTS = [
  {
    id: 1,
    title: '첫 번째 겨울',
    subtitle: '2막 희곡',
    genre: '희곡',
    pages: 68,
    price: 8000,
    excerpt: '"처음 네 이름을 불렀을 때,\n내 목소리가 낯설었다.\n그건 아직 내가 너를\n알지 못한다는 뜻이었다."',
    scene: `1막 1장\n\n[무대: 빈 방. 창문 하나. 의자 둘.]\n\nA: (창밖을 보며) 처음엔 아무것도 없었어.\nB: (들어서며) 처음이 원래 그런 거잖아.\nA: 아무것도 없어서 처음인 게 아니라,\n    처음이라서 아무것도 없는 거겠지.\n\n[침묵]\n\nB: 커피 마실래?\nA: 응, 처음처럼.`,
  },
  {
    id: 2,
    title: '초고 없는 세계',
    subtitle: '단막극',
    genre: '단막극',
    pages: 24,
    price: 5000,
    excerpt: '"당신은 지금까지\n몇 번이나 처음이었습니까?\n그 처음들은 어디로 갔습니까?"',
    scene: `[무대: 아무 것도 없는 흰 공간]\n\nA: 쓰려고 했어.\nB: 그래서?\nA: 처음부터 다시 시작해야 할 것 같아서.\nB: 처음이 어딘데?\n\n[A, 오랫동안 생각한다.]\n\nA: 모르겠어. 그게 문제야.`,
  },
  {
    id: 3,
    title: '봄을 기다리는 사람들',
    subtitle: '3인극',
    genre: '희곡',
    pages: 52,
    price: 7000,
    excerpt: '"기다린다는 건\n이미 시작한 거야.\n봄이 오기 전부터\n우리는 이미 봄 속에 있었어."',
    scene: `1장\n\n[무대: 창문이 있는 방. 세 개의 의자.]\n\nA: 봄이 언제 와?\nB: 기다리면 와.\nC: 기다리는 게 이미 봄인 거야.\n\n[세 사람, 창밖을 바라본다.]`,
  },
];

const COFFEE = [
  { cat: '커피' },
  { name: '드립 커피',        desc: 'HOT / ICE', price: '5,000' },
  { name: '디카페인 드립커피', desc: 'HOT / ICE', price: '5,500' },
  { cat: '음료' },
  { name: '사과농장 조카 사과주스', desc: '', price: '3,800' },
  { name: '사과농장 조카 에이드',   desc: '', price: '5,000' },
  { cat: '차' },
  { name: '캐모마일', desc: 'HOT', price: '5,500' },
];

const DRINKS = [
  { cat: '와인' },
  { name: '하우스 와인', desc: '레드 / 화이트', price: '6,000' },
  { cat: '맥주' },
  { name: '아사히 / 하이네켄', desc: '330ml', price: '7,900' },
  { name: '하이네켄 제로',     desc: '330ml', price: '6,900' },
];

const QUOTES = [
  { text: '"나는 처음이 좋다.\n처음은 언제나 솔직하니까."', attr: '— 초고록 운영자 노트' },
  { text: '"소설의 첫 문장은\n작가의 목소리를 가장 날것으로 담고 있다."', attr: '— 큐레이터 메모' },
  { text: '"데뷔작 앞에서는\n모두가 동등하게 처음이다."', attr: '— 초고록 책방 안내문' },
  { text: '"초고를 쓸 용기가\n결국 책 한 권이 된다."', attr: '— 서가 메모지' },
];

// ===== RENDER BOOKS =====

function renderBooks(filter) {
  const grid = document.getElementById('booksGrid');
  if (!grid) return;
  const list = filter === 'all' ? BOOKS : BOOKS.filter(b => b.cat === filter);

  grid.innerHTML = list.map(b => `
    <div class="book-card fade-up" data-cat="${b.cat}">
      <div class="book-cover" style="background:linear-gradient(155deg,${b.c[0]},${b.c[1]})">
        <div class="book-spine"></div>
        <div class="book-cover-inner">
          <p class="book-cover-title">${b.title}</p>
          <p class="book-cover-author">${b.author}</p>
        </div>
        <span class="book-badge">${b.tag}</span>
      </div>
      <div class="book-info">
        <p class="book-info-title">${b.title}</p>
        <p class="book-info-meta">${b.author} · ${b.desc}</p>
        <div class="book-footer">
          <span class="book-price">₩${b.price.toLocaleString()}</span>
          <button class="book-btn" onclick="addToCart(${b.id})">담기</button>
        </div>
      </div>
    </div>
  `).join('');

  requestAnimationFrame(() => {
    grid.querySelectorAll('.fade-up').forEach((el, i) => {
      setTimeout(() => el.classList.add('in'), i * 70);
    });
  });
}

// ===== RENDER SCRIPTS =====

function renderScripts() {
  const grid = document.getElementById('scriptsGrid');
  if (!grid) return;
  grid.innerHTML = SCRIPTS.map(s => `
    <div class="script-card">
      <div class="script-head">
        <p class="script-genre">${s.genre} · ${s.pages}p</p>
        <h3 class="script-title">${s.title}</h3>
        <p class="script-subtitle">${s.subtitle}</p>
      </div>
      <div class="script-body">
        <p class="script-excerpt">${nl(s.excerpt)}</p>
        <div class="script-actions">
          <button class="s-btn-free" onclick="openPreview(${s.id})">미리보기 (무료)</button>
          <button class="s-btn-paid" onclick="buyScript(${s.id})">전체 구매 ₩${s.price.toLocaleString()}</button>
        </div>
      </div>
    </div>
  `).join('');
}

// ===== RENDER CAFE MENU =====

function renderMenu(items, elId) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.innerHTML = items.map(m => m.cat
    ? `<p class="menu-cat">${m.cat}</p>`
    : `<div class="menu-item">
        <div class="menu-item-info">
          <p class="menu-item-name">${m.name}</p>
          ${m.desc ? `<p class="menu-item-desc">${m.desc}</p>` : ''}
        </div>
        <span class="menu-item-price">${m.price}원</span>
      </div>`
  ).join('');
}

// ===== CART (PLACEHOLDER) =====

const cart = [];

function addToCart(id) {
  const book = BOOKS.find(b => b.id === id);
  if (!book) return;
  cart.push(book);
  toast(`"${book.title}"\n장바구니에 담았습니다.\n(결제 기능 준비 중입니다)`);
}

function buyScript(id) {
  const s = SCRIPTS.find(x => x.id === id);
  if (!s) return;
  toast(`"${s.title}" 구매 안내\nchogorok@gmail.com으로 문의해 주세요.`);
}

// ===== PREVIEW MODAL =====

function openPreview(id) {
  const s = SCRIPTS.find(x => x.id === id);
  if (!s) return;
  const content = document.getElementById('modalContent');
  content.innerHTML = `
    <p class="modal-label">${s.genre} 미리보기</p>
    <h2 class="modal-title">${s.title}</h2>
    <p class="modal-sub">${s.subtitle} · ${s.pages}p</p>
    <div class="modal-pull">${nl(s.excerpt)}</div>
    <div class="modal-excerpt">${nl(s.scene)}</div>
    <p class="modal-price-note">전체 텍스트는 ₩${s.price.toLocaleString()}에 구매하실 수 있습니다.</p>
    <button class="btn btn-primary btn-sm" onclick="buyScript(${s.id}); closeModal()">전체 구매하기</button>
  `;
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

// ===== TOAST =====

function toast(msg) {
  let el = document.querySelector('.toast');
  if (!el) {
    el = document.createElement('div');
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.remove('show'), 3000);
}

// ===== ROTATING QUOTES =====

let quoteIdx = 0;
function rotateQuote() {
  const el = document.getElementById('heroQuote');
  if (!el) return;
  const q = QUOTES[quoteIdx % QUOTES.length];
  el.classList.remove('visible');
  setTimeout(() => {
    el.innerHTML = `${nl(q.text)}<span class="hero-quote-book">${q.attr}</span>`;
    el.classList.add('visible');
  }, 400);
  quoteIdx++;
}

// ===== NAV =====

const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 70);

  const pos = window.scrollY + 120;
  document.querySelectorAll('section[id]').forEach(sec => {
    const top = sec.offsetTop, h = sec.offsetHeight, id = sec.id;
    if (pos >= top && pos < top + h) {
      document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
      const a = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (a) a.classList.add('active');
    }
  });
}, { passive: true });

document.getElementById('navToggle').addEventListener('click', function () {
  this.classList.toggle('open');
  document.getElementById('navLinks').classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('open');
    document.getElementById('navToggle').classList.remove('open');
  });
});

// ===== FILTER =====

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    renderBooks(this.dataset.filter);
  });
});

// ===== MODAL CLOSE =====

document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalOverlay').addEventListener('click', e => {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ===== SCROLL ANIMATIONS =====

const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

// ===== UTILS =====

function nl(str) { return str.replace(/\n/g, '<br>'); }

// ===== INIT =====

document.addEventListener('DOMContentLoaded', () => {
  renderBooks('all');
  renderScripts();
  renderMenu(COFFEE, 'coffeeMenu');
  renderMenu(DRINKS, 'drinkMenu');

  // Observe static fade-up targets
  document.querySelectorAll('.story-grid, .ev-card, .menu-board, .location-grid').forEach(el => {
    el.classList.add('fade-up');
    io.observe(el);
  });

  // Rotating quote
  rotateQuote();
  setInterval(rotateQuote, 5000);
});
