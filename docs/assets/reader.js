/* ArsNovella reader: settings, progress and chapter navigation.
   Loaded in <head> so saved settings apply before the page paints. */
(function () {
  "use strict";
  var KEY = "arsnovella.settings";
  var PKEY = "arsnovella.progress";
  var DEFAULTS = {
    theme: "dark", font: "sans", size: 18, lh: 1.6, ps: 1.5, width: 65, bg: "", fg: ""
  };
  var FONTS = {
    sans: '"Inter", system-ui, sans-serif',
    georgia: 'Georgia, "Times New Roman", serif',
    lora: '"Lora", Georgia, serif',
    legible: '"Atkinson Hyperlegible", system-ui, sans-serif'
  };

  function load(k, d) {
    try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; }
  }
  function save(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* private mode: settings just won't persist */ }
  }

  var S = Object.assign({}, DEFAULTS, load(KEY, {}));
  var root = document.documentElement;

  function apply() {
    root.dataset.theme = S.theme;
    root.style.setProperty("--reader-font", FONTS[S.font] || FONTS.sans);
    root.style.setProperty("--reader-size", S.size + "px");
    root.style.setProperty("--reader-lh", S.lh);
    root.style.setProperty("--reader-ps", S.ps + "em");
    root.style.setProperty("--reader-width", S.width + "%");
    if (S.bg) root.style.setProperty("--bg", S.bg); else root.style.removeProperty("--bg");
    if (S.fg) root.style.setProperty("--fg", S.fg); else root.style.removeProperty("--fg");
  }
  apply();

  function set(k, v) { S[k] = v; save(KEY, S); apply(); syncControls(); }

  function $(sel, el) { return (el || document).querySelector(sel); }
  function $$(sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); }

  /* ---------- settings drawer ---------- */
  function fmt(k, v, unit) {
    if (k === "lh" || k === "ps") return Number(v).toFixed(1) + unit;
    return v + unit;
  }

  function syncControls() {
    $$(".seg").forEach(function (seg) {
      var k = seg.dataset.setting;
      $$("button", seg).forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.value === S[k])); });
    });
    $$('input[type="range"][data-setting]').forEach(function (inp) {
      var k = inp.dataset.setting;
      inp.value = S[k];
      var out = $('output[data-out="' + k + '"]');
      if (out) out.textContent = fmt(k, S[k], inp.dataset.unit || "");
    });
    var cs = getComputedStyle(root);
    $$('input[type="color"][data-setting]').forEach(function (inp) {
      var k = inp.dataset.setting;
      inp.value = toHex(S[k] || cs.getPropertyValue("--" + k).trim());
    });
  }

  function toHex(c) {
    if (/^#[0-9a-f]{6}$/i.test(c)) return c;
    var m = c.match(/\d+/g);
    if (!m) return "#000000";
    return "#" + m.slice(0, 3).map(function (n) { return ("0" + Number(n).toString(16)).slice(-2); }).join("");
  }

  function initSettings() {
    var drawer = $("#settings"), scrim = $(".scrim");
    if (!drawer) return;
    var opener = null;
    function open() {
      opener = document.activeElement;
      drawer.classList.add("open"); drawer.setAttribute("aria-hidden", "false"); scrim.hidden = false;
      var first = $("button, input, select", drawer); if (first) first.focus();
    }
    function close() {
      drawer.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); scrim.hidden = true;
      if (opener && opener.focus) opener.focus();
    }
    $$("[data-open-settings]").forEach(function (b) { b.addEventListener("click", open); });
    $$("[data-close]").forEach(function (b) { b.addEventListener("click", close); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && drawer.classList.contains("open")) close(); });

    $$(".seg").forEach(function (seg) {
      seg.addEventListener("click", function (e) {
        var b = e.target.closest("button"); if (b) set(seg.dataset.setting, b.dataset.value);
      });
    });
    $$('input[type="range"][data-setting]').forEach(function (inp) {
      inp.addEventListener("input", function () { set(inp.dataset.setting, Number(inp.value)); });
    });
    $$('input[type="color"][data-setting]').forEach(function (inp) {
      inp.addEventListener("input", function () { set(inp.dataset.setting, inp.value); });
    });
    var clear = $("[data-clear-colors]");
    if (clear) clear.addEventListener("click", function () { S.bg = ""; S.fg = ""; save(KEY, S); apply(); syncControls(); });
    var reset = $("[data-reset]");
    if (reset) reset.addEventListener("click", function () { S = Object.assign({}, DEFAULTS); save(KEY, S); apply(); syncControls(); });
    syncControls();
  }

  /* ---------- series page ---------- */
  function initSeries() {
    var p = load(PKEY, null);
    var btn = $("[data-continue]");
    if (!p || !btn || !p.href) return;
    btn.href = p.href + "?resume=1";
    btn.textContent = "Continue: " + p.label + (p.title ? " · " + p.title : "");
    btn.hidden = false;
    var start = $("[data-start]");
    if (start) start.classList.remove("primary");
    btn.classList.add("primary");
  }

  /* ---------- chapter page ---------- */
  function initChapter() {
    var body = document.body, d = body.dataset;
    var here = "read/" + d.n + "/";
    var saved = load(PKEY, null);
    var params = new URLSearchParams(location.search);

    // remember where the reader is
    function remember() {
      var max = document.documentElement.scrollHeight - innerHeight;
      var frac = max > 0 ? Math.min(1, scrollY / max) : 0;
      save(PKEY, { href: here, n: Number(d.n), label: d.label, title: d.title, scroll: frac });
      var bar = $(".progress-bar"); if (bar) bar.style.width = (frac * 100).toFixed(1) + "%";
    }
    if (params.get("resume") && saved && saved.href === here && saved.scroll > 0.01 && saved.scroll < 0.99) {
      setTimeout(function () {
        scrollTo(0, saved.scroll * (document.documentElement.scrollHeight - innerHeight));
      }, 0);
    }
    var ticking = false;
    addEventListener("scroll", function () {
      if (ticking) return; ticking = true;
      setTimeout(function () { ticking = false; remember(); }, 100);
    }, { passive: true });
    remember();

    // chapter jump + keyboard
    $$("select[data-jump]").forEach(function (sel) {
      sel.addEventListener("change", function () { location.href = d.root + "read/" + sel.value + "/"; });
    });
    document.addEventListener("keydown", function (e) {
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      if (/^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName)) return;
      if ($("#settings.open")) return;
      if (e.key === "ArrowLeft" && d.prev) location.href = d.prev;
      if (e.key === "ArrowRight" && d.next) location.href = d.next;
    });

    // fullscreen
    var fs = $("[data-fullscreen]");
    if (fs) {
      if (!document.fullscreenEnabled) fs.hidden = true;
      fs.addEventListener("click", function () {
        if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen();
      });
    }

  }

  document.addEventListener("DOMContentLoaded", function () {
    initSettings();
    if (document.body.classList.contains("series")) initSeries();
    if (document.body.classList.contains("reader")) initChapter();
  });
})();
