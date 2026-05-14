'use strict';

// ===== SHEET URLs =====

const SHEET_BASE    = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTzHZx7Jef19FbSPTe0XPg_s0DEeeMnbNUV4SPLzY29ZCFo34Xuk9XyZhGahYi-5uoY_jT2lXCOAEtm/pub?output=csv&gid=';
const SHEET_BOOKS   = SHEET_BASE + '0';
const SHEET_EVENTS  = SHEET_BASE + '455664417';
const SHEET_SCRIPTS = SHEET_BASE + '1291865144';
const SHEET_RELAY   = SHEET_BASE + '1886435550';

// ===== DEFAULT DATA (fallback) =====

let BOOKS = [
  { id:1, title:'이것이 내 처음이다', author:'김서연', price:14000, cat:'debut', tag:'데뷔작', c:['#2D4A2D','#3D7A3D'], desc:'단편소설집' },
  { id:2, title:'처음 쓴 편지들',     author:'박지우', price:12000, cat:'indie', tag:'독립출판', c:['#5C4033','#8B6555'], desc:'에세이'    },
  { id:3, title:'초고',               author:'이다은', price:16000, cat:'debut', tag:'데뷔작', c:['#1C2D4A','#2D4A7A'], desc:'시집'      },
  { id:4, title:'어느 첫날의 기록',   author:'정민준', price:11000, cat:'indie', tag:'독립출판', c:['#4A2D5C','#7A4A8B'], desc:'산문집'    },
  { id:5, title:'파종',               author:'오수진', price:18000, cat:'first', tag:'초판본', c:['#3A4A1C','#6B8B2D'], desc:'장편소설'   },
  { id:6, title:'무대 밖에서',         author:'최연우', price:13000, cat:'debut', tag:'데뷔작', c:['#4A2D1C','#8B5A2D'], desc:'에세이'    },
  { id:7, title:'첫 계절',             author:'윤하늘', price:15000, cat:'first', tag:'초판본', c:['#2D3A5C','#4A5C8B'], desc:'시집'      },
  { id:8, title:'시작하는 글들',       author:'한수민', price:10000, cat:'indie', tag:'독립출판', c:['#4A4A1C','#8B8B2D'], desc:'잡지'     },
];

let SCRIPTS = [
  { id: 1, title: '첫 번째 겨울',        genre: '희곡',   desc: '"처음 네 이름을 불렀을 때, 내 목소리가 낯설었다."', pdf: '' },
  { id: 2, title: '초고 없는 세계',       genre: '단막극', desc: '"당신은 지금까지 몇 번이나 처음이었습니까?"',        pdf: '' },
  { id: 3, title: '봄을 기다리는 사람들', genre: '희곡',   desc: '"기다린다는 건 이미 시작한 거야."',                 pdf: '' },
];

const EVENTS_DEFAULT = [
  {
    featured: true, badge: '진행중', badge_type: '',
    color1: '#1C4A1C', color2: '#2D6A2D',
    type: '릴레이 도서', title: '이번 달의 처음',
    desc: '한 권의 책이 여러 손을 거쳐 읽힙니다. 읽은 후 느낀 \'처음의 감각\'을 책 안에 메모로 남겨 다음 독자에게 전달하는 릴레이.',
    details: ['📅 매월 1일 시작', '👥 5명 정원', '💰 무료'],
    btn_text: '신청하기', btn_link: 'mailto:rlatmdtn8149@naver.com', btn_style: 'primary',
  },
  {
    featured: false, badge: '대관', badge_type: 'outline',
    color1: '#3A2D1C', color2: '#6B5040',
    type: '무대 대관', title: '이 공간을 당신의 무대로',
    desc: '낭독회, 소품 공연, 북토크, 아티스트 토크. 초고록 2층 공간을 창작의 무대로 빌려드립니다.',
    details: ['🏠 최대 20인', '⏰ 2시간 단위', '💰 별도 문의'],
    btn_text: '문의하기', btn_link: 'mailto:rlatmdtn8149@naver.com', btn_style: 'outline',
  },
  {
    featured: false, badge: '정기', badge_type: 'green',
    color1: '#1C2D4A', color2: '#2D4A7A',
    type: '희곡 낭독회', title: '소리 내어 읽는 밤',
    desc: '배우이자 운영자가 진행하는 희곡 낭독 모임. 처음 배우를 꿈꾸는 분, 희곡을 써보고 싶은 분 모두 환영합니다.',
    details: ['📅 매월 셋째 토요일', '👥 10명 정원', '💰 10,000원'],
    btn_text: '신청하기', btn_link: 'mailto:rlatmdtn8149@naver.com', btn_style: 'outline',
  },
  {
    featured: false, badge: '정기', badge_type: 'green',
    color1: '#4A2D1C', color2: '#8B5A2D',
    type: '첫 문장 쓰기 모임', title: '당신의 처음을 써드립니다',
    desc: '글을 쓰고 싶지만 시작하지 못한 분들을 위한 워크숍. 단 하나의 첫 문장을 함께 씁니다.',
    details: ['📅 매월 넷째 일요일', '👥 8명 정원', '💰 15,000원'],
    btn_text: '신청하기', btn_link: 'mailto:rlatmdtn8149@naver.com', btn_style: 'outline',
  },
];

const RELAY_DEFAULT = [
  { title: '시라노 드 베르주라크', author: '에드몽 로스탕', desc: '운문으로 쓰인 5막짜리 희곡. 코가 크다는 콤플렉스를 지닌 시인 기사 시라노의 사랑 이야기.', image: '', link: 'mailto:rlatmdtn8149@naver.com', status: '가능' },
  { title: '앵무새 죽이기',       author: '하퍼 리',       desc: '미국 남부의 작은 마을을 배경으로 인종 차별과 정의를 다룬 퓰리처상 수상작.', image: '', link: 'mailto:rlatmdtn8149@naver.com', status: '대여중' },
  { title: '채식주의자',          author: '한강',          desc: '평범한 여성이 어느 날 갑자기 육식을 거부하면서 시작되는 세 편의 연결된 이야기.', image: '', link: 'mailto:rlatmdtn8149@naver.com', status: '마감' },
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

const DEFAULT_COLORS = [
  ['#2D4A2D','#3D7A3D'], ['#5C4033','#8B6555'], ['#1C2D4A','#2D4A7A'],
  ['#4A2D5C','#7A4A8B'], ['#3A4A1C','#6B8B2D'], ['#4A2D1C','#8B5A2D'],
  ['#2D3A5C','#4A5C8B'], ['#4A4A1C','#8B8B2D'],
];

// ===== CSV UTILS =====

function parseCSVRow(line) {
  const result = [];
  let cur = '', inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQ && line[i + 1] === '"') { cur += '"'; i++; }
      else inQ = !inQ;
    } else if (ch === ',' && !inQ) {
      result.push(cur); cur = '';
    } else {
      cur += ch;
    }
  }
  result.push(cur);
  return result;
}

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = parseCSVRow(lines[0]).map(h => h.trim());
  return lines.slice(1).map(line => {
    const vals = parseCSVRow(line);
    const obj = {};
    headers.forEach((h, i) => { obj[h] = (vals[i] || '').trim(); });
    return obj;
  }).filter(row => Object.values(row).some(v => v));
}

async function fetchCSV(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

// ===== DATA MAPPERS =====

function mapBooks(rows) {
  return rows.map((r, i) => ({
    id:    i + 1,
    title: r['제목']   || r.title  || '',
    author:r['작가']   || r['저자'] || r.author || '',
    price: parseInt(r['가격'] || r.price || '0', 10),
    cat:   r['카테고리'] || r.cat  || '독립출판',
    desc:  r['설명']   || r.desc  || '',
    image: toDriveImageUrl(r['사진URL'] || r.image || ''),
    c: DEFAULT_COLORS[i % DEFAULT_COLORS.length],
  })).filter(b => b.title);
}

function toDriveImageUrl(url) {
  if (!url) return '';
  const match = url.match(/drive\.google\.com\/(?:file\/d\/|uc\?.*?id=)([^/?#&]+)/);
  if (match) return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w800`;
  return url;
}

function mapEvents(rows) {
  return rows.map(r => {
    const priceRaw = r['가격'] || r.price || '';
    const priceNum = parseInt(priceRaw.replace(/[^0-9]/g, ''), 10);
    const priceLabel = priceRaw
      ? (isNaN(priceNum) ? `💰 ${priceRaw}` : `💰 ${priceNum.toLocaleString()}원`)
      : '';

    const 신청수 = (r['신청 현황'] || '').replace(/명$/, '').trim();
    const 정원수 = (r['정원'] || '?').replace(/명$/, '').trim();

    return {
      featured:   (r.featured || r['대표']) === 'true' || (r.featured || r['대표']) === '1',
      badge:      r.badge      || r['배지']     || '',
      badge_type: r.badge_type || r['배지유형'] || '',
      color1:     r.color1     || r['색상1']    || '#1C4A1C',
      color2:     r.color2     || r['색상2']    || '#2D6A2D',
      image:      toDriveImageUrl(r['사진URL'] || r.image || ''),
      type:       r['유형']    || r.type        || '',
      title:      r['제목']    || r.title       || '',
      desc:       r['설명']    || r.desc        || '',
      details: [
        r['날짜']      ? `📅 ${r['날짜']}`              : '',
        r['정원']      ? `👥 ${정원수}명 정원`           : '',
        신청수         ? `📋 ${신청수}/${정원수}명 신청` : '',
        priceLabel,
      ].filter(Boolean),
      btn_text:  r['버튼텍스트'] || r.btn_text  || '신청하기',
      btn_link:  r['신청링크']   || r.btn_link  || r['버튼링크'] || 'mailto:rlatmdtn8149@naver.com',
      btn_style: r['버튼스타일'] || r.btn_style || 'outline',
    };
  }).filter(e => e.title);
}

function mapRelayBooks(rows) {
  return rows.map(r => ({
    title:  r['제목']    || r.title  || '',
    author: r['저자']    || r.author || '',
    desc:   r['설명']    || r.desc   || '',
    image:  toDriveImageUrl(r['사진URL'] || r.image || ''),
    link:   r['신청링크'] || r.link  || 'mailto:rlatmdtn8149@naver.com',
    status: r['대여상태'] || r.status || '가능',
  })).filter(r => r.title);
}

function mapScripts(rows) {
  return rows.map((r, i) => ({
    id:    i + 1,
    title: r['제목']      || r.title || '',
    genre: r['유형']      || r.genre || '희곡',
    desc:  r['설명']      || r.desc  || '',
    pdf:   r['대본 읽기'] || r.pdf   || '',
  })).filter(s => s.title);
}

// ===== RENDER BOOKS =====

function getBooksPerPage() { return window.innerWidth <= 480 ? 4 : 8; }
let bookPage = 0;

function renderBooks(dir = 0) {
  const grid = document.getElementById('booksGrid');
  if (!grid) return;

  const perPage = getBooksPerPage();
  const totalPages = Math.max(1, Math.ceil(BOOKS.length / perPage));
  bookPage = Math.max(0, Math.min(bookPage, totalPages - 1));
  const pageBooks = BOOKS.slice(bookPage * perPage, (bookPage + 1) * perPage);

  const coverStyle = b => b.image
    ? `background-image:url('${b.image}');background-size:contain;background-position:center;background-repeat:no-repeat;background-color:#f4f1ec`
    : `background:linear-gradient(155deg,${b.c[0]},${b.c[1]})`;

  // 슬라이드 애니메이션
  const slideClass = dir > 0 ? 'slide-from-right' : dir < 0 ? 'slide-from-left' : '';
  grid.className = `books-grid ${slideClass}`;
  void grid.offsetWidth; // reflow

  grid.innerHTML = pageBooks.map(b => `
    <div class="book-card fade-up">
      <div class="book-cover" style="${coverStyle(b)}">
        <div class="book-spine"></div>
        ${!b.image ? `<div class="book-cover-inner">
          <p class="book-cover-title">${b.title}</p>
          <p class="book-cover-author">${b.author}</p>
        </div>` : ''}
      </div>
      <div class="book-info">
        <p class="book-info-title">${b.title}</p>
        <p class="book-info-meta">${b.author}</p>
        <p class="book-info-desc">${b.desc}</p>
        <div class="book-footer">
          <span class="book-price">₩${b.price.toLocaleString()}</span>
        </div>
      </div>
    </div>
  `).join('');

  requestAnimationFrame(() => {
    grid.querySelectorAll('.fade-up').forEach((el, i) => {
      setTimeout(() => el.classList.add('in'), i * 60);
    });
  });

  // 페이지네이션 업데이트
  const prev = document.getElementById('booksPrev');
  const next = document.getElementById('booksNext');
  const indicator = document.getElementById('booksPageIndicator');
  const pagination = document.getElementById('booksPagination');
  if (prev) prev.disabled = bookPage === 0;
  if (next) next.disabled = bookPage >= totalPages - 1;
  if (indicator) indicator.textContent = totalPages > 1 ? `${bookPage + 1} / ${totalPages}` : '';
  if (pagination) pagination.style.display = totalPages <= 1 ? 'none' : 'flex';
}

function changeBookPage(dir) {
  bookPage += dir;
  renderBooks(dir);
}

// ===== RENDER SCRIPTS =====

function renderScripts() {
  const grid = document.getElementById('scriptsGrid');
  if (!grid) return;
  grid.innerHTML = SCRIPTS.map(s => {
    const btn = s.pdf
      ? `<a href="${s.pdf}" target="_blank" rel="noopener" class="s-btn-paid">대본 읽기</a>`
      : `<button class="s-btn-paid s-btn-disabled" disabled>준비 중</button>`;
    return `
    <div class="script-card">
      <div class="script-head">
        <p class="script-genre">${s.genre}</p>
        <h3 class="script-title">${s.title}</h3>
      </div>
      <div class="script-body">
        <p class="script-excerpt">${nl(s.desc)}</p>
        <div class="script-actions">
          ${btn}
        </div>
      </div>
    </div>`;
  }).join('');
}

// ===== RENDER EVENTS =====

const EVENTS_PER_PAGE = 4;
let eventPage = 0;
let eventsData = [];

function changeEventPage(dir) {
  eventPage += dir;
  renderEvents(null, dir);
}

function renderEvents(events, dir = 0) {
  if (Array.isArray(events)) eventsData = events;
  const grid = document.getElementById('eventsGrid');
  if (!grid) return;

  const totalPages = Math.max(1, Math.ceil(eventsData.length / EVENTS_PER_PAGE));
  eventPage = Math.max(0, Math.min(eventPage, totalPages - 1));
  const pageEvents = eventsData.slice(eventPage * EVENTS_PER_PAGE, (eventPage + 1) * EVENTS_PER_PAGE);

  const badgeClass = type => {
    if (type === 'outline') return 'ev-badge ev-badge-outline';
    if (type === 'green')   return 'ev-badge ev-badge-green';
    return 'ev-badge';
  };

  const imgStyle = e => e.image
    ? `background-image:url('${e.image}');background-size:contain;background-position:center;background-repeat:no-repeat;background-color:#f4f1ec`
    : `background:linear-gradient(160deg,${e.color1},${e.color2})`;

  const isExternal = url => url.startsWith('http');

  grid.innerHTML = pageEvents.map(e => `
    <div class="ev-card${e.featured ? ' ev-featured' : ''}">
      <div class="ev-img" style="${imgStyle(e)}">
        ${e.badge ? `<span class="${badgeClass(e.badge_type)}">${e.badge}</span>` : ''}
      </div>
      <div class="ev-body">
        <span class="ev-type">${e.type}</span>
        <h3>${e.title}</h3>
        <p>${e.desc}</p>
        <div class="ev-details">
          ${e.details.map(d => `<span>${d}</span>`).join('')}
        </div>
        <a href="${e.btn_link}" class="btn btn-${e.btn_style} btn-sm"${isExternal(e.btn_link) ? ' target="_blank" rel="noopener"' : ''}>${e.btn_text}</a>
      </div>
    </div>
  `).join('');

  const prev = document.getElementById('eventsPrev');
  const next = document.getElementById('eventsNext');
  const indicator = document.getElementById('eventsPageIndicator');
  const pagination = document.getElementById('eventsPagination');
  if (prev) prev.disabled = eventPage === 0;
  if (next) next.disabled = eventPage >= totalPages - 1;
  if (indicator) indicator.textContent = totalPages > 1 ? `${eventPage + 1} / ${totalPages}` : '';
  if (pagination) pagination.style.display = totalPages <= 1 ? 'none' : 'flex';
}

// ===== RENDER RELAY BOOKS =====

function getRelayPerPage() { return 2; }
let relayPage = 0;
let relayBooks = [];

function renderRelayBooks(books, dir = 0) {
  // books 인자가 배열이면 데이터 업데이트, 없으면 현재 데이터 재렌더
  if (Array.isArray(books)) relayBooks = books;

  const grid = document.getElementById('relayGrid');
  if (!grid) return;

  const perPage = getRelayPerPage();
  const totalPages = Math.max(1, Math.ceil(relayBooks.length / perPage));
  relayPage = Math.max(0, Math.min(relayPage, totalPages - 1));
  const pageBooks = relayBooks.slice(relayPage * perPage, (relayPage + 1) * perPage);

  const STATUS = {
    '가능':   { label: '대여 가능', cls: 'relay-status-ok',     btnText: '신청하기', btnCls: 'relay-btn-primary' },
    '대여중': { label: '대여 중',   cls: 'relay-status-rented',  btnText: '예약하기', btnCls: 'relay-btn-outline' },
    '마감':   { label: '예약 마감', cls: 'relay-status-closed',  btnText: '마감',     btnCls: 'relay-btn-closed'  },
  };

  const imgStyle = b => b.image
    ? `background-image:url('${b.image}');background-size:contain;background-position:center;background-repeat:no-repeat;background-color:#f4f1ec`
    : `background:linear-gradient(160deg,#2D4A2D,#3D7A3D)`;

  // 슬라이드 애니메이션
  const slideClass = dir > 0 ? 'relay-slide-right' : dir < 0 ? 'relay-slide-left' : '';
  grid.className = `relay-grid ${slideClass}`;
  void grid.offsetWidth;

  grid.innerHTML = pageBooks.map(b => {
    const s = STATUS[b.status] || STATUS['마감'];
    const isClosed = b.status === '마감';
    const isExternal = b.link.startsWith('http');
    const btnAttr = isExternal ? ' target="_blank" rel="noopener"' : '';

    return `
      <div class="relay-card">
        <div class="relay-img" style="${imgStyle(b)}">
          <span class="relay-status-badge ${s.cls}">${s.label}</span>
        </div>
        <div class="relay-body">
          <h3 class="relay-title">${b.title}</h3>
          <p class="relay-author">${b.author}</p>
          <p class="relay-desc">${b.desc}</p>
          ${isClosed
            ? `<button class="relay-btn relay-btn-closed" disabled>마감</button>`
            : `<a href="${b.link}" class="relay-btn ${s.btnCls}"${btnAttr}>${s.btnText}</a>`}
        </div>
      </div>`;
  }).join('');

  // 페이지네이션 업데이트
  const prev = document.getElementById('relayPrev');
  const next = document.getElementById('relayNext');
  const indicator = document.getElementById('relayPageIndicator');
  const pagination = document.getElementById('relayPagination');
  if (prev) prev.disabled = relayPage === 0;
  if (next) next.disabled = relayPage >= totalPages - 1;
  if (indicator) indicator.textContent = totalPages > 1 ? `${relayPage + 1} / ${totalPages}` : '';
  if (pagination) pagination.style.display = totalPages <= 1 ? 'none' : 'flex';
}

function changeRelayPage(dir) {
  relayPage += dir;
  renderRelayBooks(null, dir);
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
  toast(`"${s.title}" 구매 안내\nrlatmdtn8149@naver.com으로 문의해 주세요.`);
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

// 화면 크기 변경 시 페이지당 항목 수가 달라지면 재렌더
let _lastBooksBreak = getBooksPerPage();
let _lastRelayBreak = getRelayPerPage();
window.addEventListener('resize', () => {
  const nb = getBooksPerPage();
  const nr = getRelayPerPage();
  if (nb !== _lastBooksBreak) { _lastBooksBreak = nb; bookPage = 0; renderBooks(); }
  if (nr !== _lastRelayBreak) { _lastRelayBreak = nr; relayPage = 0; renderRelayBooks(null); }
}, { passive: true });

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

function nl(str) { return (str || '').replace(/\n/g, '<br>'); }

// ===== INIT =====

document.addEventListener('DOMContentLoaded', async () => {
  // 1. 먼저 기본 데이터로 초기 렌더링
  renderBooks();
  renderScripts();
  renderEvents(EVENTS_DEFAULT);
  renderRelayBooks(RELAY_DEFAULT);
  renderMenu(COFFEE, 'coffeeMenu');
  renderMenu(DRINKS, 'drinkMenu');

  // 2. 구글 시트 CSV 병렬 fetch
  const [booksCSV, eventsCSV, scriptsCSV, relayCSV] = await Promise.all([
    fetchCSV(SHEET_BOOKS),
    fetchCSV(SHEET_EVENTS),
    fetchCSV(SHEET_SCRIPTS),
    fetchCSV(SHEET_RELAY),
  ]);

  // 3. 도서 업데이트
  if (booksCSV) {
    const rows = parseCSV(booksCSV);
    const mapped = mapBooks(rows);
    if (mapped.length) {
      BOOKS = mapped;
      renderBooks();
    }
  }

  // 4. 이벤트 업데이트
  if (eventsCSV) {
    const rows = parseCSV(eventsCSV);
    const mapped = mapEvents(rows);
    if (mapped.length) renderEvents(mapped);
  }

  // 5. 희곡 업데이트
  if (scriptsCSV) {
    const rows = parseCSV(scriptsCSV);
    const mapped = mapScripts(rows);
    if (mapped.length) {
      SCRIPTS = mapped;
      renderScripts();
    }
  }

  // 6. 릴레이 독서 업데이트
  if (relayCSV) {
    const rows = parseCSV(relayCSV);
    const mapped = mapRelayBooks(rows);
    if (mapped.length) renderRelayBooks(mapped);
  }

  // 8. 스크롤 애니메이션 관찰
  document.querySelectorAll('.story-grid, .ev-card, .menu-board, .location-grid').forEach(el => {
    el.classList.add('fade-up');
    io.observe(el);
  });

  // 7. 인용구 로테이션
  rotateQuote();
  setInterval(rotateQuote, 5000);
});
