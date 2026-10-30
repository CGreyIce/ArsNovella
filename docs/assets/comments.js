/* ArsNovella comments: a name and a message, shared with every reader through Firestore.
   No sign-in. The reader's name is remembered in this browser only. The Firebase SDK is
   loaded on demand, when the comments come near the screen, so chapters stay light. */
(function () {
  "use strict";
  // Same free Firebase project as the BPL site; the web config is public by design and the
  // Firestore rules decide what may be written (see README: "Comments").
  var CONFIG = {
    apiKey: "AIzaSyBHqs1-KFunG49VDMVv-v63MeZb7SmMuP4",
    authDomain: "predictions-database.firebaseapp.com",
    projectId: "predictions-database",
    appId: "1:412239932219:web:4225d1be70d65e273d651e"
  };
  var SDK = "https://www.gstatic.com/firebasejs/10.12.2/";
  var COLLECTION = "arsnovella_comments";       // arsnovella_comments/{chapter}/items/{id}
  var NAME_KEY = "arsnovella.name";
  var CID_KEY = "arsnovella.cid";
  var LAST_KEY = "arsnovella.lastComment";
  var GAP = 20000;                                // ms between two posts from one browser
  var MAX_NAME = 40, MAX_TEXT = 2000, SHOWN = 300;

  function get(k) { try { return localStorage.getItem(k) || ""; } catch (e) { return ""; } }
  function put(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } }
  function clientId() {
    var c = get(CID_KEY);
    if (!c) { c = Math.random().toString(36).slice(2, 10) + Date.now().toString(36); put(CID_KEY, c); }
    return c;
  }
  function cleanName(s) { return s.replace(/\s+/g, " ").trim().slice(0, MAX_NAME); }
  function cleanText(s) { return s.replace(/\r/g, "").replace(/\n{3,}/g, "\n\n").trim().slice(0, MAX_TEXT); }

  function hue(name) {
    var h = 0;
    for (var i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
    return h;
  }
  var rtf = window.Intl && Intl.RelativeTimeFormat ? new Intl.RelativeTimeFormat("en", { numeric: "auto" }) : null;
  function ago(date) {
    var s = Math.round((date.getTime() - Date.now()) / 1000);
    if (s > -45) return "just now";
    var units = [["year", 31536000], ["month", 2592000], ["week", 604800], ["day", 86400], ["hour", 3600], ["minute", 60]];
    for (var i = 0; i < units.length; i++) {
      var n = Math.round(s / units[i][1]);
      if (Math.abs(n) >= 1) return rtf ? rtf.format(n, units[i][0]) : Math.abs(n) + " " + units[i][0] + "s ago";
    }
    return "just now";
  }

  document.addEventListener("DOMContentLoaded", function () {
    var box = document.getElementById("comments");
    if (!box) return;
    var form = box.querySelector("[data-comment-form]");
    var list = box.querySelector("[data-list]");
    var empty = box.querySelector("[data-empty]");
    var status = box.querySelector("[data-status]");
    var count = box.querySelector("[data-count]");
    var button = form.querySelector("button");
    var hint = status.textContent;
    var me = clientId();
    var items = [];
    var fs = null, col = null, loading = null;

    form.name.value = get(NAME_KEY);
    form.name.addEventListener("change", function () { put(NAME_KEY, cleanName(form.name.value)); });

    function say(msg, err) { status.textContent = msg; status.classList.toggle("err", !!err); }
    function emptyText(msg) { empty.textContent = msg; empty.hidden = false; }

    function render() {
      list.textContent = "";
      items.forEach(function (c) {
        var li = document.createElement("li");
        li.className = "c-item";
        var av = document.createElement("span");
        av.className = "c-av";
        av.setAttribute("aria-hidden", "true");
        av.style.background = "hsl(" + hue(c.name) + " 42% 42%)";
        av.textContent = (c.name.match(/[\p{L}\p{N}]/u) || ["?"])[0].toUpperCase();
        var body = document.createElement("div");
        var meta = document.createElement("div");
        meta.className = "c-meta";
        var nm = document.createElement("span");
        nm.className = "c-name";
        nm.textContent = c.name;
        meta.appendChild(nm);
        if (c.cid === me) {
          var you = document.createElement("span");
          you.className = "c-you";
          you.textContent = "you";
          meta.appendChild(you);
        }
        var tm = document.createElement("time");
        tm.className = "c-time";
        if (c.date) { tm.dateTime = c.date.toISOString(); tm.title = c.date.toLocaleString(); }
        tm.textContent = c.pending ? "sending…" : (c.date ? ago(c.date) : "");
        meta.appendChild(tm);
        var p = document.createElement("p");
        p.className = "c-text";
        p.textContent = c.text;
        body.appendChild(meta);
        body.appendChild(p);
        li.appendChild(av);
        li.appendChild(body);
        list.appendChild(li);
      });
      count.textContent = items.length ? "· " + items.length : "";
      if (items.length) empty.hidden = true;
      else emptyText("No comments yet. Be the first.");
    }

    function start() {
      if (loading) return loading;
      loading = Promise.all([import(SDK + "firebase-app.js"), import(SDK + "firebase-firestore.js")]).then(function (m) {
        var app = m[0].initializeApp(CONFIG, "arsnovella");
        fs = m[1];
        col = fs.collection(fs.getFirestore(app), COLLECTION, box.dataset.ch, "items");
        fs.onSnapshot(fs.query(col, fs.orderBy("ts", "desc"), fs.limit(SHOWN)), function (snap) {
          items = snap.docs.map(function (d) {
            var v = d.data({ serverTimestamps: "estimate" });
            return {
              name: String(v.name || "Anonymous"), text: String(v.text || ""), cid: v.cid,
              date: v.ts && v.ts.toDate ? v.ts.toDate() : null, pending: d.metadata.hasPendingWrites
            };
          });
          render();
        }, function (err) {
          emptyText(err && err.code === "permission-denied"
            ? "Comments are being set up. Check back soon."
            : "Comments couldn't load right now. Try refreshing.");
        });
      });
      loading.catch(function () { emptyText("Comments couldn't load. Check your connection and refresh."); });
      return loading;
    }

    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        if (entries.some(function (e) { return e.isIntersecting; })) { io.disconnect(); start(); }
      }, { rootMargin: "800px 0px" });
      io.observe(box);
    } else {
      start();
    }
    form.addEventListener("focusin", start);
    setInterval(function () { if (items.length) render(); }, 60000);   // keep "5 minutes ago" fresh

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = cleanName(form.name.value);
      var text = cleanText(form.text.value);
      if (!name) { say("Add a name first.", true); form.name.focus(); return; }
      if (!text) { say("Write a comment first.", true); form.text.focus(); return; }
      var wait = GAP - (Date.now() - Number(get(LAST_KEY) || 0));
      if (wait > 0) { say("Give it " + Math.ceil(wait / 1000) + " more seconds before posting again.", true); return; }
      put(NAME_KEY, name);
      form.name.value = name;
      button.disabled = true;
      say("Posting…");
      start().then(function () {
        return fs.addDoc(col, { name: name, text: text, ts: fs.serverTimestamp(), cid: me });
      }).then(function () {
        put(LAST_KEY, String(Date.now()));
        form.text.value = "";
        say(hint);
      }).catch(function (err) {
        say(err && err.code === "permission-denied"
          ? "Comments aren't switched on yet. Try again soon."
          : "Couldn't post that. Check your connection and try again.", true);
      }).then(function () { button.disabled = false; });
    });
  });
})();
