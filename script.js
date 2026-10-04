(function () {
  "use strict";

  var SHEET_URLS = {
    books: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTzHZx7Jef19FbSPTe0XPg_s0DEeeMnbNUV4SPLzY29ZCFo34Xuk9XyZhGahYi-5uoY_jT2lXCOAEtm/pub?output=csv&gid=1886435550",
    events: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTzHZx7Jef19FbSPTe0XPg_s0DEeeMnbNUV4SPLzY29ZCFo34Xuk9XyZhGahYi-5uoY_jT2lXCOAEtm/pub?output=csv&gid=455664417"
  };

  var app = document.getElementById("app");
  var cache = { books: null, events: null };
  var SPINE_TONES = ["#2D6A2D", "#3d7a3d", "#234f23", "#e8dcc8", "#d8c9a8"];

  // ---------- CSV parsing (RFC4180-ish) ----------
  function parseCSV(text) {
    var rows = [];
    var row = [];
    var field = "";
    var inQuotes = false;
    var i = 0;
    var len = text.length;
    text = text.replace(/^﻿/, "");
    len = text.length;
    while (i < len) {
      var c = text[i];
      if (inQuotes) {
        if (c === '"') {
          if (text[i + 1] === '"') { field += '"'; i += 2; continue; }
          inQuotes = false; i++; continue;
        }
        field += c; i++; continue;
      } else {
        if (c === '"') { inQuotes = true; i++; continue; }
        if (c === ',') { row.push(field); field = ""; i++; continue; }
        if (c === '\r') { i++; continue; }
        if (c === '\n') { row.push(field); rows.push(row); row = []; field = ""; i++; continue; }
        field += c; i++; continue;
      }
    }
    row.push(field);
    if (row.length > 1 || row[0] !== "") rows.push(row);
    return rows;
  }

  function rowsToObjects(rows) {
    if (!rows.length) return [];
    var headers = rows[0].map(function (h) { return h.trim(); });
    var out = [];
    for (var r = 1; r < rows.length; r++) {
      var cells = rows[r];
      if (cells.length === 1 && cells[0].trim() === "") continue;
      var obj = {};
      for (var c = 0; c < headers.length; c++) {
        obj[headers[c]] = (cells[c] || "").trim();
      }
      out.push(obj);
    }
    return out;
  }

  function fetchSheet(kind) {
    if (cache[kind]) return Promise.resolve(cache[kind]);
    return fetch(SHEET_URLS[kind], { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.text();
      })
      .then(function (text) {
        var data = rowsToObjects(parseCSV(text));
        cache[kind] = data;
        return data;
      });
  }

  // ---------- field helpers ----------
  function pick(row, keys) {
    var headerNames = Object.keys(row);
    for (var k = 0; k < keys.length; k++) {
      for (var h = 0; h < headerNames.length; h++) {
        if (headerNames[h].indexOf(keys[k]) !== -1 && row[headerNames[h]]) {
          return row[headerNames[h]];
        }
      }
    }
    return "";
  }

  function firstValue(row) {
    var headerNames = Object.keys(row);
    for (var h = 0; h < headerNames.length; h++) {
      if (row[headerNames[h]]) return row[headerNames[h]];
    }
    return "";
  }

  var FIELD_KEYS = {
    title: ["제목", "도서명", "책이름", "이름"],
    image: ["사진", "이미지", "표지"],
    link: ["신청링크", "신청 링크", "링크"],
    desc: ["설명", "소개", "내용"],
    price: ["가격", "비용", "참가비"],
    capacity: ["정원"],
    applied: ["신청 현황", "신청현황", "신청인원"],
    type: ["유형", "분류", "장르", "카테고리"],
    date: ["날짜", "일정", "기간"],
    time: ["시간"],
    author: ["저자", "작가", "글쓴이"],
    publisher: ["출판사"],
    condition: ["교환", "상태"]
  };

  function extract(row) {
    var d = {};
    for (var key in FIELD_KEYS) {
      d[key] = pick(row, FIELD_KEYS[key]);
    }
    if (!d.title) d.title = firstValue(row) || "제목 미정";
    d.imageUrl = toDirectImage(d.image);
    return d;
  }

  function toDirectImage(url) {
    if (!url) return "";
    var m = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (m) return "https://drive.google.com/thumbnail?id=" + m[1] + "&sz=w1000";
    return url;
  }

  function spineTone(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
    return SPINE_TONES[hash % SPINE_TONES.length];
  }

  function toneTextColor(hex) {
    return (hex === "#e8dcc8" || hex === "#d8c9a8") ? "#1C1C1C" : "#FAFAF5";
  }

  function numFrom(str) {
    var m = (str || "").match(/\d+/);
    return m ? parseInt(m[0], 10) : null;
  }

  var UNAVAILABLE_WORDS = ["대여중", "불가", "품절", "마감"];
  function isUnavailable(condition) {
    if (!condition) return false;
    for (var i = 0; i < UNAVAILABLE_WORDS.length; i++) {
      if (condition.indexOf(UNAVAILABLE_WORDS[i]) !== -1) return true;
    }
    return false;
  }

  function escapeHtml(s) {
    return String(s || "").replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // ---------- Router ----------
  function parseHash() {
    var h = location.hash.replace(/^#\/?/, "");
    var parts = h.split("/").filter(Boolean);
    return { view: parts[0] || "home", id: parts[1] !== undefined ? decodeURIComponent(parts[1]) : null };
  }

  function navigate(path) {
    location.hash = path;
  }

  function render() {
    var route = parseHash();
    closeOverlay();
    if (route.view === "exchange") {
      renderExchange();
      if (route.id !== null) openBookDetail(parseInt(route.id, 10));
    } else if (route.view === "events") {
      renderEvents();
      if (route.id !== null) openEventDetail(parseInt(route.id, 10));
    } else if (route.view === "about") {
      renderAbout();
    } else {
      renderHome();
    }
  }

  // ---------- Home ----------
  function renderHome() {
    app.innerHTML =
      '<div class="home">' +
      '  <div class="home-mark">' +
      '    <p class="hanja">草稿錄</p>' +
      "    <h1>초고록</h1>" +
      '    <p class="eng">Chogorok Bookstore</p>' +
      "  </div>" +
      '  <div class="home-panels">' +
      '    <button class="home-panel home-panel--exchange" data-go="exchange">' +
      '      <span class="bg-ghost">BOOK</span>' +
      '      <span class="panel-inner">' +
      '        <span class="panel-sub">Book Exchange</span>' +
      '        <span class="panel-title">교환독서</span>' +
      '        <span class="panel-hint">릴레이 도서 살펴보기 <span class="panel-arrow">&#8594;</span></span>' +
      "      </span>" +
      "    </button>" +
      '    <button class="home-panel home-panel--events" data-go="events">' +
      '      <span class="bg-ghost">STAGE</span>' +
      '      <span class="panel-inner">' +
      '        <span class="panel-sub">Events</span>' +
      '        <span class="panel-title">행사</span>' +
      '        <span class="panel-hint">모임과 무대 살펴보기 <span class="panel-arrow">&#8594;</span></span>' +
      "      </span>" +
      "    </button>" +
      "  </div>" +
      '  <button class="home-footer" data-go="about">초고록 이야기 <span class="footer-arrow">&#8594;</span></button>' +
      "</div>";

    app.querySelectorAll("[data-go]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        navigate("/" + btn.getAttribute("data-go"));
      });
    });
  }

  // ---------- About ----------
  function renderAbout() {
    app.innerHTML =
      '<div class="section section--about">' +
      '  <div class="section-header">' +
      '    <button class="back-btn" data-back>&#8592;</button>' +
      '    <div class="section-heading"><h2>초고록 이야기</h2><span class="sub">ABOUT</span></div>' +
      "  </div>" +
      '  <div class="section-body about-body">' +
      '    <p class="about-hanja">草稿錄</p>' +
      '    <p class="about-slogan">오늘도 우리는<br>초고를 기록하는 중입니다.</p>' +
      '    <div class="about-group">' +
      '      <p class="about-text about-oneline">초벌로 쓴 원고를 뜻하는 \'초고(草稿)\'와 기록할 \'록(錄)\'.</p>' +
      '      <p class="about-text"><span class="nobreak">\'초고를 기록하다\'</span>를 뜻하는 책방 초고록입니다.</p>' +
      "    </div>" +
      '    <div class="about-group">' +
      '      <p class="about-text">세상 모든 처음을 응원하는 마음으로<br>책장과 무대를 준비해 두었습니다.</p>' +
      "    </div>" +
      '    <div class="about-group">' +
      '      <p class="about-text">여러분에게 처음은 어떤 의미인가요?</p>' +
      "    </div>" +
      '    <div class="about-programs">' +
      '      <button class="about-program-link" data-go="exchange"><span>교환독서</span><span class="footer-arrow">&#8594;</span></button>' +
      '      <button class="about-program-link" data-go="events"><span>행사</span><span class="footer-arrow">&#8594;</span></button>' +
      "    </div>" +
      '    <div class="about-info">' +
      '      <div class="info-row"><span class="info-k">주소</span><span class="info-v">대구 중구 공평로8길 32, 2층</span></div>' +
      '      <div class="info-row"><span class="info-k">영업시간</span><span class="info-v">12:00 - 21:00<br>수요일 휴무</span></div>' +
      '      <div class="info-row"><span class="info-k">이메일</span><span class="info-v"><a href="mailto:rlatmdtn8149@naver.com">rlatmdtn8149@naver.com</a></span></div>' +
      '      <div class="info-row"><span class="info-k">전화</span><span class="info-v"><a href="tel:01038428149">010-3842-8149</a></span></div>' +
      "    </div>" +
      "  </div>" +
      "</div>";
    bindBack();
    app.querySelectorAll("[data-go]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        navigate("/" + btn.getAttribute("data-go"));
      });
    });
  }

  // ---------- Exchange (books) ----------
  var EXCHANGE_TABS = [
    { key: "all", label: "전체" },
    { key: "available", label: "대여 가능" },
    { key: "unavailable", label: "대여중" }
  ];
  var exchangeFilter = "all";

  function matchesFilter(d, filter) {
    if (filter === "all") return true;
    var unavailable = isUnavailable(d.condition);
    if (filter === "unavailable") return unavailable;
    if (filter === "available") return !unavailable;
    return true;
  }

  function renderExchange() {
    exchangeFilter = "all";
    app.innerHTML =
      '<div class="section section--exchange">' +
      '  <div class="section-header">' +
      '    <button class="back-btn" data-back>&#8592;</button>' +
      '    <div class="section-heading"><h2>교환독서</h2><span class="sub">BOOK EXCHANGE</span></div>' +
      "  </div>" +
      '  <div class="tab-bar" id="exchange-tabs"></div>' +
      '  <div class="section-body" id="exchange-body">' +
      '    <p class="state-msg">책장을 정리하고 있어요…</p>' +
      "  </div>" +
      "</div>";
    bindBack();

    fetchSheet("books")
      .then(function (data) {
        var body = document.getElementById("exchange-body");
        var tabsEl = document.getElementById("exchange-tabs");
        if (!body) return;
        if (!data.length) {
          body.innerHTML = '<p class="state-msg">교환독서 도서 목록을 준비 중입니다.<br>곧 책장을 채워드릴게요.</p>';
          return;
        }

        function paintTabs() {
          tabsEl.innerHTML = EXCHANGE_TABS.map(function (t) {
            return '<button class="tab-btn' + (exchangeFilter === t.key ? " active" : "") + '" data-tab="' + t.key + '">' + t.label + "</button>";
          }).join("");
          tabsEl.querySelectorAll("[data-tab]").forEach(function (btn) {
            btn.addEventListener("click", function () {
              exchangeFilter = btn.getAttribute("data-tab");
              paintTabs();
              paintGrid();
            });
          });
        }

        function paintGrid() {
          var html = '<div class="shelf-grid">';
          var shown = 0;
          data.forEach(function (row, idx) {
            var d = extract(row);
            if (!matchesFilter(d, exchangeFilter)) return;
            shown++;
            var tone = spineTone(d.title + idx);
            var textColor = toneTextColor(tone);
            var unavailable = isUnavailable(d.condition);
            html +=
              '<button class="book-card" data-detail="' + idx + '">' +
              '  <div class="book-cover" style="background:' + tone + '">' +
              (unavailable ? '<span class="book-status-badge">대여중</span>' : "") +
              (d.imageUrl
                ? '<img src="' + escapeHtml(d.imageUrl) + '" alt="" loading="lazy" onerror="this.style.display=\'none\'">'
                : '<span class="spine-title" style="color:' + textColor + '">' + escapeHtml(d.title) + "</span>") +
              "  </div>" +
              '  <div class="book-meta">' +
              '    <div class="title">' + escapeHtml(d.title) + "</div>" +
              (d.author || d.type ? '<span class="tag">' + escapeHtml(d.author || d.type) + "</span>" : "") +
              "  </div>" +
              "</button>";
          });
          html += "</div>";
          if (!shown) {
            body.innerHTML = '<p class="state-msg">해당하는 책이 없습니다.</p>';
            return;
          }
          body.innerHTML = html;
          body.querySelectorAll("[data-detail]").forEach(function (btn) {
            btn.addEventListener("click", function () {
              navigate("/exchange/" + btn.getAttribute("data-detail"));
            });
          });
        }

        paintTabs();
        paintGrid();
      })
      .catch(function () {
        var body = document.getElementById("exchange-body");
        if (body) {
          body.innerHTML = '<p class="state-msg">책장을 불러오지 못했어요.<br><span class="retry" data-retry>다시 시도</span></p>';
          body.querySelector("[data-retry]").addEventListener("click", function () {
            cache.books = null;
            renderExchange();
          });
        }
      });
  }

  function openBookDetail(idx) {
    fetchSheet("books").then(function (data) {
      var row = data[idx];
      if (!row) return;
      var d = extract(row);
      var tone = spineTone(d.title + idx);
      var textColor = toneTextColor(tone);
      var unavailable = isUnavailable(d.condition);
      var facts = [];
      if (d.author) facts.push(["작가", d.author]);
      if (d.publisher) facts.push(["출판사", d.publisher]);
      if (d.type) facts.push(["분야", d.type]);
      if (d.condition) facts.push(["대여상태", d.condition]);

      var overlay = buildOverlay(
        '<div class="detail-media" style="background:' + tone + '">' +
          (d.imageUrl
            ? '<img src="' + escapeHtml(d.imageUrl) + '" alt="" onerror="this.parentElement.innerHTML=\'<span class=spine-title style=color:' + textColor + '>' + escapeHtml(d.title).replace(/'/g, "&#39;") + '</span>\'">'
            : '<span class="spine-title" style="color:' + textColor + '">' + escapeHtml(d.title) + "</span>") +
        "</div>" +
        '<div class="detail-body">' +
          '<span class="detail-type">릴레이 독서</span>' +
          '<h3 class="detail-title">' + escapeHtml(d.title) + "</h3>" +
          (facts.length
            ? '<div class="detail-facts">' + facts.map(function (f) {
                return '<span class="fact"><span class="k">' + escapeHtml(f[0]) + "</span><span class=\"v\">" + escapeHtml(f[1]) + "</span></span>";
              }).join("") + "</div>"
            : "") +
          '<p class="detail-desc">' + (escapeHtml(d.desc) || "자세한 설명이 곧 추가됩니다.") + "</p>" +
          (unavailable ? '<span class="apply-btn disabled">현재 대여중입니다</span>' : applyButtonHtml(d.link)) +
        "</div>",
        "/exchange"
      );
      document.body.appendChild(overlay);
    });
  }

  // ---------- Events ----------
  function renderEvents() {
    app.innerHTML =
      '<div class="section section--events">' +
      '  <div class="section-header">' +
      '    <button class="back-btn" data-back>&#8592;</button>' +
      '    <div class="section-heading"><h2>행사</h2><span class="sub">EVENTS</span></div>' +
      "  </div>" +
      '  <div class="section-body" id="events-body">' +
      '    <p class="state-msg">무대를 준비하고 있어요…</p>' +
      "  </div>" +
      "</div>";
    bindBack();

    fetchSheet("events")
      .then(function (data) {
        var body = document.getElementById("events-body");
        if (!body) return;
        if (!data.length) {
          body.innerHTML = '<p class="state-msg">행사 일정을 준비 중입니다.</p>';
          return;
        }
        var html = '<div class="events-grid">';
        data.forEach(function (row, idx) {
          var d = extract(row);
          var tone = spineTone(d.title + idx);
          var cap = numFrom(d.capacity);
          var applied = numFrom(d.applied);
          var isFull = cap !== null && applied !== null && applied >= cap && cap > 0;
          html +=
            '<button class="event-card" data-detail="' + idx + '">' +
            (d.imageUrl
              ? '<img src="' + escapeHtml(d.imageUrl) + '" alt="" loading="lazy" onerror="this.remove()">'
              : '<div class="no-image-bg" style="background:' + tone + '"></div>') +
            '<div class="scrim"></div>' +
            '<div class="card-content">' +
              (d.type ? '<span class="type-chip">' + escapeHtml(d.type) + "</span>" : "") +
              '<h3 class="ev-title">' + escapeHtml(d.title) + "</h3>" +
              (d.date ? '<span class="ev-date">' + escapeHtml(d.date) + (d.time ? " · " + escapeHtml(d.time) : "") + "</span>" : "") +
              '<div class="ev-meta">' +
                (isFull
                  ? '<span class="ev-line ev-full">마감</span>'
                  : (cap !== null ? '<span class="ev-line">정원 ' + cap + "명" + (applied !== null ? " · 신청 " + applied + "명" : "") + "</span>" : "")) +
                (d.price ? '<span class="ev-line">' + escapeHtml(d.price) + "</span>" : "") +
              "</div>" +
            "</div>" +
            "</button>";
        });
        html += "</div>";
        body.innerHTML = html;
        body.querySelectorAll("[data-detail]").forEach(function (btn) {
          btn.addEventListener("click", function () {
            navigate("/events/" + btn.getAttribute("data-detail"));
          });
        });
      })
      .catch(function () {
        var body = document.getElementById("events-body");
        if (body) {
          body.innerHTML = '<p class="state-msg">행사 정보를 불러오지 못했어요.<br><span class="retry" data-retry>다시 시도</span></p>';
          body.querySelector("[data-retry]").addEventListener("click", function () {
            cache.events = null;
            renderEvents();
          });
        }
      });
  }

  function openEventDetail(idx) {
    fetchSheet("events").then(function (data) {
      var row = data[idx];
      if (!row) return;
      var d = extract(row);
      var tone = spineTone(d.title + idx);
      var cap = numFrom(d.capacity);
      var applied = numFrom(d.applied);
      var isFull = cap !== null && applied !== null && applied >= cap && cap > 0;
      var facts = [];
      if (d.date) facts.push(["날짜", d.date]);
      if (d.time) facts.push(["시간", d.time]);
      if (d.price) facts.push(["가격", d.price]);
      if (cap !== null) facts.push(["정원", cap + "명"]);
      if (applied !== null) facts.push(["신청 현황", applied + "명"]);

      var overlay = buildOverlay(
        '<div class="detail-media" style="background:' + tone + '">' +
          (d.imageUrl
            ? '<img src="' + escapeHtml(d.imageUrl) + '" alt="" onerror="this.parentElement.innerHTML=\'<span class=spine-title>' + escapeHtml(d.title).replace(/'/g, "&#39;") + '</span>\'">'
            : '<span class="spine-title">' + escapeHtml(d.title) + "</span>") +
        "</div>" +
        '<div class="detail-body">' +
          (d.type ? '<span class="detail-type">' + escapeHtml(d.type) + "</span>" : "") +
          '<h3 class="detail-title">' + escapeHtml(d.title) + "</h3>" +
          (facts.length
            ? '<div class="detail-facts">' + facts.map(function (f) {
                return '<span class="fact"><span class="k">' + escapeHtml(f[0]) + "</span><span class=\"v\">" + escapeHtml(f[1]) + "</span></span>";
              }).join("") + "</div>"
            : "") +
          '<p class="detail-desc">' + (escapeHtml(d.desc) || "") + "</p>" +
          (isFull ? '<span class="apply-btn disabled">신청 마감</span>' : applyButtonHtml(d.link)) +
        "</div>",
        "/events"
      );
      document.body.appendChild(overlay);
    });
  }

  function applyButtonHtml(link) {
    if (!link) return '<span class="apply-btn disabled">신청 링크 준비 중</span>';
    return '<a class="apply-btn" href="' + escapeHtml(link) + '" target="_blank" rel="noopener">신청하기</a>';
  }

  // ---------- Overlay ----------
  function buildOverlay(innerHtml, backPath) {
    var overlay = document.createElement("div");
    overlay.className = "overlay";
    overlay.id = "detail-overlay";
    overlay.innerHTML =
      '<div class="overlay-panel">' +
      '  <button class="overlay-close" data-close>&times;</button>' +
      innerHtml +
      "</div>";
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) navigate(backPath);
    });
    overlay.querySelector("[data-close]").addEventListener("click", function () {
      navigate(backPath);
    });
    return overlay;
  }

  function closeOverlay() {
    var el = document.getElementById("detail-overlay");
    if (el) el.remove();
  }

  function bindBack() {
    var btn = app.querySelector("[data-back]");
    if (btn) btn.addEventListener("click", function () { navigate("/"); });
  }

  window.addEventListener("hashchange", render);
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && document.getElementById("detail-overlay")) {
      var route = parseHash();
      navigate("/" + route.view);
    }
  });
  render();
})();
