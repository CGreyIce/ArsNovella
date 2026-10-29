/* ArsNovella reader: settings, progress, chapter navigation and read-aloud.
   Loaded in <head> so saved settings apply before the page paints. */
(function () {
  "use strict";
  var KEY = "arsnovella.settings";
  var PKEY = "arsnovella.progress";
  var DEFAULTS = {
    theme: "dark", font: "sans", size: 18, lh: 1.6, ps: 1.5, width: 65,
    bg: "", fg: "", voice: "", rate: 1, autoscroll: true, autonext: false
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
    if (k === "lh" || k === "rate") return Number(v).toFixed(1) + unit;
    if (k === "ps") return Number(v).toFixed(1) + unit;
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
    $$('input[type="checkbox"][data-setting]').forEach(function (inp) { inp.checked = !!S[inp.dataset.setting]; });
    var cs = getComputedStyle(root);
    $$('input[type="color"][data-setting]').forEach(function (inp) {
      var k = inp.dataset.setting;
      inp.value = toHex(S[k] || cs.getPropertyValue("--" + k).trim());
    });
    var vs = $('select[data-setting="voice"]');
    if (vs) vs.value = S.voice;
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
    $$('input[type="checkbox"][data-setting]').forEach(function (inp) {
      inp.addEventListener("change", function () { set(inp.dataset.setting, inp.checked); });
    });
    $$('input[type="color"][data-setting]').forEach(function (inp) {
      inp.addEventListener("input", function () { set(inp.dataset.setting, inp.value); });
    });
    var vs = $('select[data-setting="voice"]');
    if (vs) vs.addEventListener("change", function () { set("voice", vs.value); });
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

    initSpeech(params.get("listen") === "1");
  }

  /* ---------- read aloud (Web Speech API) ---------- */
  function initSpeech(autostart) {
    var listenBtn = $("[data-listen]");
    var bar = $("#tts");
    var synth = window.speechSynthesis;
    if (!synth || !window.SpeechSynthesisUtterance) {
      if (listenBtn) listenBtn.hidden = true;
      var n = $("[data-tts-unsupported]"); if (n) n.hidden = false;
      return;
    }
    var paras = $$(".chapter-body p");
    var status = $("[data-tts-status]");
    var toggle = $('[data-tts="toggle"]');
    var idx = 0, playing = false, current = null, started = false;

    function fillVoices() {
      var sel = $('select[data-setting="voice"]');
      if (!sel) return;
      var vs = synth.getVoices().filter(function (v) { return /^en/i.test(v.lang); });
      if (!vs.length) vs = synth.getVoices();
      sel.innerHTML = '<option value="">Browser default</option>' + vs.map(function (v) {
        return '<option value="' + v.voiceURI.replace(/"/g, "&quot;") + '">' + v.name + " (" + v.lang + ")</option>";
      }).join("");
      sel.value = S.voice;
    }
    fillVoices();
    if ("onvoiceschanged" in synth) synth.addEventListener("voiceschanged", fillVoices);

    function pickVoice() {
      var vs = synth.getVoices();
      return vs.find(function (v) { return v.voiceURI === S.voice; }) ||
        vs.find(function (v) { return /^en/i.test(v.lang) && v.default; }) ||
        vs.find(function (v) { return /^en/i.test(v.lang); }) || null;
    }

    function mark(i) {
      paras.forEach(function (p, j) { p.classList.toggle("speaking", j === i); });
      if (i >= 0 && paras[i] && S.autoscroll) paras[i].scrollIntoView({ block: "center", behavior: "smooth" });
    }

    function ui() {
      toggle.classList.toggle("on", playing);
      toggle.setAttribute("aria-label", playing ? "Pause" : "Play");
      status.textContent = (playing ? "Reading " : "Paused at ") + "paragraph " + (idx + 1) + " of " + paras.length;
      if (listenBtn) listenBtn.setAttribute("aria-pressed", String(!bar.hidden));
    }

    function speak(i) {
      synth.cancel();
      if (i >= paras.length) { finish(); return; }
      idx = Math.max(0, i);
      mark(idx);
      var u = new SpeechSynthesisUtterance(paras[idx].textContent);
      var v = pickVoice();
      if (v) { u.voice = v; u.lang = v.lang; }
      u.rate = S.rate;
      u.onstart = function () { started = true; };
      u.onend = function () { if (u === current && playing) speak(idx + 1); };
      u.onerror = function (e) {
        if (u !== current || e.error === "interrupted" || e.error === "canceled") return;
        playing = false; ui(); status.textContent = "Read-aloud stopped (" + e.error + ")";
      };
      current = u; playing = true; ui();
      // Chrome can drop an utterance queued in the same tick as cancel()
      setTimeout(function () { if (current === u) synth.speak(u); }, 60);
    }

    function pause() { playing = false; current = null; synth.cancel(); ui(); }

    function finish() {
      playing = false; current = null; mark(-1); idx = 0; ui();
      status.textContent = "Finished the chapter";
      if (S.autonext && document.body.dataset.next) location.href = document.body.dataset.next + "?listen=1";
    }

    function openBar() {
      bar.hidden = false; document.body.classList.add("listening"); ui();
    }
    function closeBar() {
      pause(); mark(-1); bar.hidden = true; document.body.classList.remove("listening");
      if (listenBtn) listenBtn.setAttribute("aria-pressed", "false");
    }

    // start from the first paragraph that's on screen
    function firstVisible() {
      for (var i = 0; i < paras.length; i++) {
        var r = paras[i].getBoundingClientRect();
        if (r.bottom > 70) return i;
      }
      return 0;
    }

    if (listenBtn) listenBtn.addEventListener("click", function () {
      if (!bar.hidden) { closeBar(); return; }
      openBar(); speak(firstVisible());
    });
    toggle.addEventListener("click", function () { if (playing) pause(); else speak(idx); });
    $('[data-tts="back"]').addEventListener("click", function () { speak(Math.max(0, idx - 1)); });
    $('[data-tts="fwd"]').addEventListener("click", function () { speak(idx + 1); });
    $('[data-tts="close"]').addEventListener("click", closeBar);
    paras.forEach(function (p, i) {
      p.addEventListener("click", function () {
        if (!document.body.classList.contains("listening") || getSelection().toString()) return;
        speak(i);
      });
    });
    addEventListener("pagehide", function () { synth.cancel(); });

    if (autostart) {
      openBar(); speak(0);
      // browsers may block speech that wasn't started by a tap
      setTimeout(function () {
        if (!started) { pause(); status.textContent = "Tap play to keep listening"; }
      }, 1500);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    initSettings();
    if (document.body.classList.contains("series")) initSeries();
    if (document.body.classList.contains("reader")) initChapter();
  });
})();
