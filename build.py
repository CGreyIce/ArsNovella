#!/usr/bin/env python3
"""Build the ArsNovella site: novel.json + chapters/*.md -> docs/.

Usage: python build.py

Chapter files look like:

    ---
    number: 1
    label: Chapter 1        (optional; defaults to "Chapter N", or "Prologue" for 0)
    title: The Great Summoning
    volume: 1
    date: 2026-10-30
    ---

    Paragraphs separated by blank lines. *italic*, **bold**.
    A line of *** (or * * *) is a scene break.
"""
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "src"
OUT = ROOT / "docs"
FONTS = ("https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400"
         "&family=Inter:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap")
WPM = 230

ICONS = {
    "book": '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    "list": '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    "listen": '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>',
    "settings": '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
    "full": '<path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/>',
    "prev": '<path d="M15 18l-6-6 6-6"/>',
    "next": '<path d="M9 18l6-6-6-6"/>',
    "play": '<path d="M7 4.5l12 7.5-12 7.5z" fill="currentColor"/>',
    "pause": '<path d="M7 4h3v16H7zM14 4h3v16h-3z" fill="currentColor"/>',
    "back": '<path d="M19 20L9 12l10-8v16z" fill="currentColor"/><path d="M5 19V5"/>',
    "fwd": '<path d="M5 4l10 8-10 8V4z" fill="currentColor"/><path d="M19 5v14"/>',
    "close": '<path d="M18 6L6 18M6 6l12 12"/>',
}


def icon(name):
    return ('<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
            f'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{ICONS[name]}</svg>')


def esc(s):
    return html.escape(str(s), quote=True)


def smart_quotes(s):
    s = re.sub(r'(^|[\s(\[{—–-])"', '\\1\u201c', s)
    s = s.replace('"', '\u201d')
    s = re.sub(r"(^|[\s(\[{—–-])'", '\\1\u2018', s)
    s = s.replace("'", '\u2019')
    return s.replace("...", "\u2026")


def inline(s):
    s = smart_quotes(esc(s).replace("&quot;", '"').replace("&#x27;", "'"))
    s = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", s)
    s = re.sub(r"\*(.+?)\*", r"<em>\1</em>", s)
    return s


def parse_chapter(path):
    text = path.read_text(encoding="utf-8")
    m = re.match(r"---\n(.*?)\n---\n(.*)", text, re.S)
    if not m:
        raise SystemExit(f"{path.name}: missing front matter")
    meta = {}
    for line in m.group(1).splitlines():
        if ":" in line:
            k, v = line.split(":", 1)
            meta[k.strip()] = v.strip()
    n = int(meta["number"])
    blocks = [b.strip() for b in re.split(r"\n\s*\n", m.group(2).strip()) if b.strip()]
    parts, words, plain = [], 0, []
    for b in blocks:
        if re.fullmatch(r"(\*\s*){3,}", b):
            parts.append('<hr class="scene">')
            continue
        line = " ".join(l.strip() for l in b.splitlines())
        parts.append(f"<p>{inline(line)}</p>")
        clean = re.sub(r"\*+", "", line)
        words += len(clean.split())
        plain.append(clean)
    return {
        "n": n,
        "label": meta.get("label") or ("Prologue" if n == 0 else f"Chapter {n}"),
        "title": meta.get("title", ""),
        "volume": meta.get("volume", "1"),
        "date": meta.get("date", ""),
        "body": "\n".join(parts),
        "words": words,
        "minutes": max(1, round(words / WPM)),
        "summary": " ".join(plain)[:180].rsplit(" ", 1)[0] + "\u2026",
    }


def head(title, desc, root, extra=""):
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(title)}</title>
<meta name="description" content="{esc(desc)}">
<meta property="og:title" content="{esc(title)}">
<meta property="og:description" content="{esc(desc)}">
<meta property="og:type" content="book">
<meta name="theme-color" content="#15181d">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="{FONTS}">
<link rel="stylesheet" href="{root}assets/reader.css">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%2315181d'/%3E%3Ccircle cx='42' cy='22' r='9' fill='%23e9eef2'/%3E%3Cpath d='M10 44h44' stroke='%237cc4e8' stroke-width='4' stroke-linecap='round'/%3E%3Cpath d='M16 52h32' stroke='%237cc4e8' stroke-width='3' stroke-linecap='round' opacity='.6'/%3E%3C/svg%3E">
{extra}<script src="{root}assets/reader.js"></script>
</head>
"""


def chapter_options(chapters, current):
    out = []
    for c in chapters:
        sel = " selected" if c["n"] == current else ""
        name = f'{c["label"]}: {c["title"]}' if c["title"] else c["label"]
        out.append(f'<option value="{c["n"]}"{sel}>{esc(name)}</option>')
    return "".join(out)


def settings_drawer():
    def seg(setting, options):
        btns = "".join(f'<button type="button" data-value="{v}">{esc(t)}</button>' for v, t in options)
        return f'<div class="seg" data-setting="{setting}" role="group">{btns}</div>'

    def rng(setting, label, lo, hi, step, unit):
        return (f'<label class="row"><span class="lbl">{label} <output data-out="{setting}"></output></span>'
                f'<input type="range" data-setting="{setting}" min="{lo}" max="{hi}" step="{step}" data-unit="{unit}"></label>')

    return f"""<div class="scrim" data-close hidden></div>
<aside class="drawer" id="settings" aria-label="Reader settings" aria-hidden="true">
  <div class="drawer-head"><h2>Reader settings</h2><button type="button" class="icon-btn" data-close aria-label="Close settings">{icon("close")}</button></div>
  <div class="drawer-body">
    <section><h3>Theme</h3>{seg("theme", [("dark", "Dark"), ("light", "Light"), ("sepia", "Sepia"), ("lake", "Lake")])}
      <div class="colors"><label>Background <input type="color" data-setting="bg"></label><label>Text <input type="color" data-setting="fg"></label><button type="button" class="link" data-clear-colors>Use theme colours</button></div>
    </section>
    <section><h3>Font</h3>{seg("font", [("sans", "Default"), ("georgia", "Georgia"), ("lora", "Lora"), ("legible", "Hyperlegible")])}</section>
    <section>
      {rng("size", "Font size", 12, 32, 1, "px")}
      {rng("lh", "Line spacing", 1.2, 2.4, 0.1, "×")}
      {rng("ps", "Paragraph spacing", 0, 3, 0.1, "em")}
      {rng("width", "Text width", 40, 100, 1, "%")}
    </section>
    <section class="tts-settings"><h3>Read aloud</h3>
      <p class="note" data-tts-unsupported hidden>Your browser doesn't support read-aloud. Try Chrome, Edge or Safari.</p>
      <label class="row"><span class="lbl">Voice</span><select data-setting="voice"><option value="">Browser default</option></select></label>
      {rng("rate", "Speed", 0.5, 2, 0.1, "×")}
      <label class="check"><input type="checkbox" data-setting="autoscroll"> Follow along (scroll to the paragraph being read)</label>
      <label class="check"><input type="checkbox" data-setting="autonext"> Keep going into the next chapter</label>
    </section>
    <p class="note">You can also use your browser's own reader view or read-aloud tool: the chapter text is plain, semantic HTML. <kbd>←</kbd> <kbd>→</kbd> change chapter.</p>
    <button type="button" class="btn ghost" data-reset>Reset to defaults</button>
  </div>
</aside>"""


def chapter_page(novel, chapters, i):
    c = chapters[i]
    root = "../../"
    prev_c = chapters[i - 1] if i > 0 else None
    next_c = chapters[i + 1] if i + 1 < len(chapters) else None
    href = lambda ch: f'{root}read/{ch["n"]}/'
    vol = novel["volumes"].get(str(c["volume"]), f'Volume {c["volume"]}')
    page_title = f'{c["label"]}: {c["title"]} | {novel["title"]}' if c["title"] else f'{c["label"]} | {novel["title"]}'
    links = ""
    if prev_c:
        links += f'<link rel="prev" href="{href(prev_c)}">\n'
    if next_c:
        links += f'<link rel="next" href="{href(next_c)}">\n'

    def nav(pos):
        p = (f'<a class="nav-btn" href="{href(prev_c)}" rel="prev">{icon("prev")}<span>Previous</span></a>' if prev_c
             else f'<span class="nav-btn disabled" aria-disabled="true">{icon("prev")}<span>Previous</span></span>')
        n = (f'<a class="nav-btn" href="{href(next_c)}" rel="next"><span>Next</span>{icon("next")}</a>' if next_c
             else f'<span class="nav-btn disabled" aria-disabled="true"><span>Next</span>{icon("next")}</span>')
        sel = (f'<label class="chap-select"><span class="sr">Jump to chapter</span>'
               f'<select data-jump>{chapter_options(chapters, c["n"])}</select></label>')
        return f'<nav class="chapnav {pos}" aria-label="Chapter navigation">{p}{sel}{n}</nav>'

    end_note = ("" if next_c else
                '<p class="end-note">You\'re all caught up. More chapters are on the way.</p>')
    return head(page_title, c["summary"], root, links) + f"""<body class="reader" data-root="{root}" data-n="{c["n"]}" data-label="{esc(c["label"])}" data-title="{esc(c["title"])}" data-prev="{href(prev_c) if prev_c else ""}" data-next="{href(next_c) if next_c else ""}">
<a class="skip" href="#chapter">Skip to the chapter</a>
<header class="topbar">
  <a class="brand" href="{root}" title="Series details">{icon("book")}<span>{esc(novel["title"])}</span></a>
  <div class="tools">
    <a class="tool" href="{root}#chapters" title="All chapters">{icon("list")}<span>Chapters</span></a>
    <button type="button" class="tool" data-listen title="Listen (read aloud)">{icon("listen")}<span>Listen</span></button>
    <button type="button" class="tool" data-open-settings title="Reader settings">{icon("settings")}<span>Settings</span></button>
    <button type="button" class="tool" data-fullscreen title="Fullscreen">{icon("full")}<span>Fullscreen</span></button>
  </div>
  <div class="progress" aria-hidden="true"><div class="progress-bar"></div></div>
</header>
<main class="wrap">
  {nav("top")}
  <article class="chapter" id="chapter">
    <header class="chapter-head">
      <p class="kicker"><a href="{root}">{esc(novel["title"])}</a> · {esc(vol)}</p>
      <p class="label">{esc(c["label"])}</p>
      <h1>{esc(c["title"] or c["label"])}</h1>
      <p class="meta">{c["words"]:,} words · {c["minutes"]} min read</p>
    </header>
    <div class="chapter-body">
{c["body"]}
    </div>
  </article>
  {end_note}
  {nav("bottom")}
</main>
<div class="tts-bar" id="tts" hidden role="region" aria-label="Read aloud controls">
  <button type="button" class="icon-btn" data-tts="back" aria-label="Previous paragraph">{icon("back")}</button>
  <button type="button" class="icon-btn play" data-tts="toggle" aria-label="Play">{icon("play")}{icon("pause")}</button>
  <button type="button" class="icon-btn" data-tts="fwd" aria-label="Next paragraph">{icon("fwd")}</button>
  <span class="tts-status" data-tts-status aria-live="polite">Ready</span>
  <button type="button" class="icon-btn" data-tts="close" aria-label="Stop and close">{icon("close")}</button>
</div>
{settings_drawer()}
</body>
</html>
"""


COVER = """<svg class="cover-art" viewBox="0 0 300 420" role="img" aria-label="Cover: a cabin and a lone fisherman on a moonlit lake">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070d16"/><stop offset=".56" stop-color="#20405e"/></linearGradient>
    <linearGradient id="lake" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a3550"/><stop offset="1" stop-color="#060b12"/></linearGradient>
  </defs>
  <rect width="300" height="236" fill="url(#sky)"/>
  <rect y="236" width="300" height="184" fill="url(#lake)"/>
  <g fill="#e9eef2"><circle cx="40" cy="40" r="1.2"/><circle cx="90" cy="70" r="1"/><circle cx="150" cy="30" r="1.4"/><circle cx="260" cy="150" r="1"/><circle cx="30" cy="120" r="1"/><circle cx="120" cy="110" r="0.9"/><circle cx="185" cy="62" r="1"/></g>
  <circle cx="218" cy="86" r="24" fill="#eef3f6" opacity=".92"/>
  <path d="M0 236 L40 196 L70 214 L112 172 L150 208 L190 182 L232 214 L262 196 L300 222 L300 236 Z" fill="#0d1a28"/>
  <g stroke="#eef3f6" stroke-linecap="round" opacity=".55"><path d="M204 252h28" stroke-width="3"/><path d="M198 266h40" stroke-width="2"/><path d="M208 282h20" stroke-width="2"/><path d="M200 298h34" stroke-width="1.5" opacity=".6"/></g>
  <path d="M18 236 L18 214 L36 200 L54 214 L54 236 Z" fill="#081119"/>
  <rect x="31" y="218" width="7" height="7" fill="#f3c86b" opacity=".9"/>
  <path d="M96 240 H176" stroke="#081119" stroke-width="4"/>
  <path d="M160 240 v-14 m0 -2 a4 4 0 1 1 0.1 0" stroke="#081119" stroke-width="4" fill="#081119"/>
  <path d="M162 228 Q 196 186 232 176" stroke="#081119" stroke-width="1.6" fill="none"/>
  <path d="M232 176 Q 238 220 236 262" stroke="#cfd8df" stroke-width=".7" fill="none" opacity=".7"/>
  <text x="150" y="350" text-anchor="middle" fill="#eef3f6" font-family="Lora, Georgia, serif" font-size="27" letter-spacing="3">THREE YEARS</text>
  <text x="150" y="384" text-anchor="middle" fill="#eef3f6" font-family="Lora, Georgia, serif" font-size="27" letter-spacing="3">LATE</text>
  <text x="150" y="408" text-anchor="middle" fill="#8fd3c9" font-family="Inter, sans-serif" font-size="11" letter-spacing="4">ICE</text>
</svg>"""


def series_page(novel, chapters):
    root = ""
    total_words = sum(c["words"] for c in chapters)
    synopsis = "".join(f"<p>{inline(p)}</p>" for p in novel["synopsis"])
    tags = "".join(f'<li>{esc(t)}</li>' for t in novel["tags"])
    vols = {}
    for c in chapters:
        vols.setdefault(str(c["volume"]), []).append(c)
    lists = ""
    for v, chs in vols.items():
        rows = "".join(
            f'<li><a href="read/{c["n"]}/"><span class="c-label">{esc(c["label"])}</span>'
            f'<span class="c-title">{esc(c["title"])}</span>'
            f'<span class="c-meta">{c["words"]:,} words · {esc(c["date"])}</span></a></li>'
            for c in chs)
        lists += f'<section class="volume"><h3>{esc(novel["volumes"].get(v, "Volume " + v))}</h3><ol class="chapter-list">{rows}</ol></section>'
    first = f'read/{chapters[0]["n"]}/' if chapters else "#"
    return head(f'{novel["title"]}', novel["tagline"], root) + f"""<body class="series">
<header class="topbar">
  <a class="brand" href="./">{icon("book")}<span>{esc(novel["title"])}</span></a>
  <div class="tools">
    <button type="button" class="tool" data-open-settings title="Reader settings">{icon("settings")}<span>Settings</span></button>
  </div>
</header>
<main class="wrap series-wrap">
  <section class="hero">
    <div class="cover">{COVER}</div>
    <div class="info">
      <h1>{esc(novel["title"])}</h1>
      <p class="tagline">{esc(novel["tagline"])}</p>
      <p class="byline">by {esc(novel["author"])}</p>
      <ul class="chips"><li>{esc(novel["status"])}</li><li>{len(chapters)} chapter{"s" if len(chapters) != 1 else ""}</li><li>{total_words:,} words</li></ul>
      <div class="cta">
        <a class="btn primary" href="{first}" data-start>Start reading</a>
        <a class="btn" href="{first}" data-continue hidden>Continue</a>
      </div>
      <div class="synopsis">{synopsis}</div>
      <ul class="tags" aria-label="Tags">{tags}</ul>
    </div>
  </section>
  <section class="chapters" id="chapters">
    <h2>Chapters</h2>
    {lists}
  </section>
  <footer class="foot"><p>Updated {esc(max((c["date"] for c in chapters), default=""))}. Reading settings and progress are saved in this browser only.</p></footer>
</main>
{settings_drawer()}
</body>
</html>
"""


def main():
    novel = json.loads((ROOT / "novel.json").read_text(encoding="utf-8"))
    chapters = sorted((parse_chapter(p) for p in (ROOT / "chapters").glob("*.md")), key=lambda c: c["n"])
    nums = [c["n"] for c in chapters]
    if len(nums) != len(set(nums)):
        raise SystemExit(f"duplicate chapter numbers: {nums}")
    # Write in place and prune stale files afterwards: deleting docs/ outright fails on
    # Windows while a preview server or OneDrive has a handle on it.
    written = set()

    def write(rel, text):
        p = OUT / rel
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(text, encoding="utf-8")
        written.add(p.resolve())

    for f in ("reader.css", "reader.js"):
        write(f"assets/{f}", (SRC / f).read_text(encoding="utf-8"))
    write(".nojekyll", "")
    write("index.html", series_page(novel, chapters))
    for i, c in enumerate(chapters):
        write(f'read/{c["n"]}/index.html', chapter_page(novel, chapters, i))
    for p in OUT.rglob("*"):
        if p.is_file() and p.resolve() not in written:
            p.unlink()
    for d in sorted((d for d in OUT.rglob("*") if d.is_dir()), reverse=True):
        try:
            d.rmdir()  # only succeeds when empty
        except OSError:
            pass
    print(f"Built {len(chapters)} chapter(s), {sum(c['words'] for c in chapters):,} words -> {OUT}")


if __name__ == "__main__":
    main()
