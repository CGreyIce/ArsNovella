/* The sealed shelf (summit/): everything under data/ is AES-GCM ciphertext.
   The passphrase never leaves the browser. PBKDF2-SHA256 turns it into the key, which
   opens data/index.enc (the book's details and chapter list) and data/ch/<n>.enc.
   "Remember on this device" keeps the derived key (not the passphrase) in localStorage. */
(function () {
  "use strict";
  var KEYSTORE = "arsnovella.summit.key", PKEY = "arsnovella.progress.summit";
  var enc = new TextEncoder(), dec = new TextDecoder();
  var key = null, index = null, shelf = null, cache = {}, view = "";

  function $(s, el) { return (el || document).querySelector(s); }
  function esc(s) { var d = document.createElement("div"); d.textContent = s == null ? "" : String(s); return d.innerHTML; }
  function unb64(s) { var b = atob(s), u = new Uint8Array(b.length); for (var i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return u; }
  function b64(u) { var s = ""; for (var i = 0; i < u.length; i++) s += String.fromCharCode(u[i]); return btoa(s); }
  function store(kind) { try { return kind === "local" ? localStorage : sessionStorage; } catch (e) { return null; } }
  function load(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* private mode */ } }
  var ICON = {
    prev: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',
    next: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>'
  };

  function getShelf() {
    if (shelf) return Promise.resolve(shelf);
    return fetch("data/shelf.json", { cache: "no-cache" }).then(function (r) {
      if (!r.ok) throw new Error("missing");
      return r.json();
    }).then(function (s) { shelf = s; return s; });
  }
  function derive(pass) {
    return getShelf().then(function (s) {
      return crypto.subtle.importKey("raw", enc.encode(pass), "PBKDF2", false, ["deriveBits"]).then(function (base) {
        return crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: unb64(s.salt), iterations: s.iter }, base, 512);
      });
    }).then(function (bits) { return new Uint8Array(bits).slice(0, 32); });
  }
  function useKey(raw) {
    return crypto.subtle.importKey("raw", raw, "AES-GCM", false, ["decrypt"]).then(function (k) { key = k; });
  }
  function open(name) {
    if (cache[name]) return Promise.resolve(cache[name]);
    return fetch("data/" + name + ".enc", { cache: "no-cache" }).then(function (r) {
      if (!r.ok) throw new Error("missing " + name);
      return r.json();
    }).then(function (box) {
      return crypto.subtle.decrypt({ name: "AES-GCM", iv: unb64(box.iv), additionalData: enc.encode("summit:" + name) }, key, unb64(box.ct));
    }).then(function (pt) { cache[name] = dec.decode(pt); return cache[name]; });
  }
  function loadIndex() { return open("index").then(function (t) { index = JSON.parse(t); }); }

  /* ---------- views ---------- */
  function show(which) {
    view = which;
    $("[data-lockview]").hidden = which !== "lock";
    $("[data-listview]").hidden = which !== "list";
    $("[data-readview]").hidden = which !== "read";
    $("[data-list-btn]").hidden = which !== "read";
    $("[data-lock]").hidden = which === "lock";
    document.body.classList.toggle("reader", which === "read");
    var bar = $(".progress-bar"); if (bar) bar.style.width = "0";
  }
  function lockView(msg) {
    key = null; index = null; cache = {};
    $("[data-listview]").innerHTML = ""; $("[data-readview]").innerHTML = "";
    document.title = "ArsNovella";
    $("[data-brand]").textContent = "ArsNovella";
    show("lock");
    $("[data-lock-msg]").textContent = msg || "";
    var inp = $("[data-lock-form]").elements.pass; inp.value = ""; inp.focus();
  }
  function chapterHref(c) { return "#/read/" + c.n; }

  function listView() {
    var chs = index.chapters || [], vols = {}, order = [];
    chs.forEach(function (c) { var v = String(c.volume); if (!vols[v]) { vols[v] = []; order.push(v); } vols[v].push(c); });
    var words = chs.reduce(function (a, c) { return a + c.words; }, 0);
    var p = load(PKEY, null), resume = p && chs.some(function (c) { return c.n === p.n; });
    var lists = order.map(function (v) {
      var rows = vols[v].map(function (c) {
        return '<li><a href="' + chapterHref(c) + '"><span class="c-label">' + esc(c.label) + '</span><span class="c-title">' + esc(c.title) +
          '</span><span class="c-meta">' + c.words.toLocaleString() + " words · " + esc(c.date) + "</span></a></li>";
      }).join("");
      return '<section class="volume"><h3>' + esc((index.volumes || {})[v] || "Volume " + v) + '</h3><ol class="chapter-list">' + rows + "</ol></section>";
    }).join("") || '<p class="empty-note">No chapters yet. They\'ll appear here as they\'re written.</p>';
    var cta = chs.length ? ('<a class="btn' + (resume ? "" : " primary") + '" href="' + chapterHref(chs[0]) + '">Start reading</a>' +
      (resume ? '<a class="btn primary" href="#/read/' + p.n + '/resume">Continue: ' + esc(p.label) + (p.title ? " · " + esc(p.title) : "") + "</a>" : "")) : "";
    $("[data-listview]").innerHTML =
      '<div class="summit-head"><p class="eyebrow">' + esc(index.short_title) + "</p><h1>" + esc(index.title) + "</h1>" +
      (index.tagline ? '<p class="tagline">' + esc(index.tagline) + "</p>" : "") +
      '<p class="byline">by ' + esc(index.author) + "</p>" +
      '<ul class="chips"><li>' + esc(index.status || "") + "</li><li>" + chs.length + " chapter" + (chs.length === 1 ? "" : "s") + "</li><li>" + words.toLocaleString() + " words</li></ul>" +
      (cta ? '<div class="cta">' + cta + "</div>" : "") + "</div>" +
      '<section class="chapters" id="chapters"><h2>Chapters</h2>' + lists + "</section>" +
      '<footer class="foot"><p>Private. Only this passphrase opens it.</p></footer>';
    document.title = index.short_title + " | " + index.title;
    $("[data-brand]").textContent = index.short_title;
    show("list");
    scrollTo(0, 0);
  }

  function nav(pos, chs, i) {
    var prev = chs[i - 1], next = chs[i + 1];
    var opts = chs.map(function (c) { return '<option value="' + c.n + '"' + (c.n === chs[i].n ? " selected" : "") + ">" + esc(c.title ? c.label + ": " + c.title : c.label) + "</option>"; }).join("");
    return '<nav class="chapnav ' + pos + '" aria-label="Chapter navigation">' +
      (prev ? '<a class="nav-btn" href="' + chapterHref(prev) + '">' + ICON.prev + "<span>Previous</span></a>" : '<span class="nav-btn disabled" aria-disabled="true">' + ICON.prev + "<span>Previous</span></span>") +
      '<label class="chap-select"><span class="sr">Jump to chapter</span><select data-jump>' + opts + "</select></label>" +
      (next ? '<a class="nav-btn" href="' + chapterHref(next) + '"><span>Next</span>' + ICON.next + "</a>" : '<span class="nav-btn disabled" aria-disabled="true"><span>Next</span>' + ICON.next + "</span>") +
      "</nav>";
  }
  function readView(n, resume) {
    var chs = index.chapters || [], i = chs.findIndex(function (c) { return c.n === n; });
    if (i < 0) { location.hash = "#/"; return; }
    var c = chs[i], vol = (index.volumes || {})[String(c.volume)] || "Volume " + c.volume;
    var el = $("[data-readview]");
    show("read");
    el.innerHTML = '<p class="empty-note">Opening…</p>';
    open("ch/" + n).then(function (body) {
      if (view !== "read" || location.hash.indexOf("#/read/" + n) !== 0) return;
      el.innerHTML = nav("top", chs, i) +
        '<article class="chapter" id="chapter"><header class="chapter-head"><p class="kicker"><a href="#/">' + esc(index.short_title) + "</a> · " + esc(vol) +
        '</p><p class="label">' + esc(c.label) + "</p><h1>" + esc(c.title || c.label) + '</h1><p class="meta">' + c.words.toLocaleString() + " words · " + c.minutes + ' min read</p></header><div class="chapter-body">' + body + "</div></article>" +
        (chs[i + 1] ? "" : '<p class="end-note">You\'re all caught up.</p>') + nav("bottom", chs, i);
      document.title = (c.title ? c.label + ": " + c.title : c.label) + " | " + index.short_title;
      var p = load(PKEY, null);
      if (resume && p && p.n === n && p.scroll > 0.01 && p.scroll < 0.99) {
        setTimeout(function () { scrollTo(0, p.scroll * (document.documentElement.scrollHeight - innerHeight)); }, 0);
      } else scrollTo(0, 0);
      remember();
    }).catch(function () { el.innerHTML = '<p class="empty-note">This chapter couldn\'t be opened. Check your connection and try again.</p>'; });
  }
  function current() { var m = /^#\/read\/(\d+)/.exec(location.hash); return m ? Number(m[1]) : null; }
  function remember() {
    if (view !== "read" || !index) return;
    var n = current(), c = (index.chapters || []).find(function (x) { return x.n === n; }); if (!c) return;
    var max = document.documentElement.scrollHeight - innerHeight, frac = max > 0 ? Math.min(1, scrollY / max) : 0;
    save(PKEY, { n: n, label: c.label, title: c.title, scroll: frac });
    var bar = $(".progress-bar"); if (bar) bar.style.width = (frac * 100).toFixed(1) + "%";
  }
  function route() {
    if (!key || !index) return;
    $("[data-brand]").textContent = index.short_title;
    var m = /^#\/read\/(\d+)(\/resume)?/.exec(location.hash);
    if (m) readView(Number(m[1]), !!m[2]); else listView();
  }

  /* ---------- boot ---------- */
  function saved() {
    var s = store("local"), t = store("session"), v = null;
    try { v = (s && s.getItem(KEYSTORE)) || (t && t.getItem(KEYSTORE)); } catch (e) { v = null; }
    try { return v ? JSON.parse(v) : null; } catch (e) { return null; }
  }
  function forget() { ["local", "session"].forEach(function (k) { var s = store(k); try { if (s) s.removeItem(KEYSTORE); } catch (e) { } }); }

  document.addEventListener("DOMContentLoaded", function () {
    var form = $("[data-lock-form]"), msg = $("[data-lock-msg]");
    if (!window.crypto || !crypto.subtle) { msg.textContent = "This browser can't unlock it (it needs a secure https page)."; return; }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var pass = form.elements.pass.value.trim(), remember = $("[data-remember]").checked;
      if (!pass) { msg.textContent = "Type the passphrase first."; return; }
      msg.textContent = "Unlocking…";
      var raw;
      derive(pass).then(function (r) { raw = r; return useKey(r); }).then(loadIndex).then(function () {
        forget();
        var s = store(remember ? "local" : "session");
        try { if (s) s.setItem(KEYSTORE, JSON.stringify({ salt: shelf.salt, k: b64(raw) })); } catch (e2) { }
        msg.textContent = "";
        route();
      }).catch(function (err) {
        key = null;
        msg.textContent = err && err.message === "missing" ? "Nothing has been published here yet." : "That passphrase doesn't open it.";
        form.elements.pass.select();
      });
    });
    $("[data-lock]").addEventListener("click", function () { forget(); location.hash = ""; lockView("Locked. The key was removed from this device."); });
    addEventListener("hashchange", route);
    var ticking = false;
    addEventListener("scroll", function () { if (ticking) return; ticking = true; setTimeout(function () { ticking = false; remember(); }, 150); }, { passive: true });
    document.addEventListener("change", function (e) { if (e.target.matches("select[data-jump]")) location.hash = "#/read/" + e.target.value; });
    document.addEventListener("keydown", function (e) {
      if (view !== "read" || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      if (/^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName) || $("#settings.open")) return;
      var a = e.key === "ArrowLeft" ? $('.chapnav.top a.nav-btn[href]:first-child') : e.key === "ArrowRight" ? $('.chapnav.top a.nav-btn[href]:last-child') : null;
      if (a) location.hash = a.getAttribute("href");
    });

    var k = saved();
    if (!k) { lockView(); return; }
    getShelf().then(function (s) {
      if (s.salt !== k.salt) { forget(); throw new Error("changed"); }
      return useKey(unb64(k.k));
    }).then(loadIndex).then(route).catch(function (err) {
      forget();
      lockView(err && err.message === "changed" ? "The passphrase has changed. Type the new one." : "");
    });
  });
})();
