# ArsNovella

***The Fisherman of Lake Ilse*** (*I Got Reincarnated To Another World, Became the Hero, and Retired to a Slow Life, Except 35 of My Friends Just Transmigrated to Slay the Demon King*), an isekai web novel, published at https://cgreyice.github.io/ArsNovella/

## Adding a chapter

1. Add `chapters/NNN-short-name.md` with front matter (`number`, `title`, `volume`, `date`; `label` is optional).
2. Run `python build.py`. It regenerates the whole site in `docs/`.
3. Commit and push. GitHub Pages serves `docs/` from `main`.

## Reader features

- Reader settings (saved in the browser): theme (Dark, Light, Sepia, Lake, or custom colours), font, size, line and paragraph spacing, text width.
- Plain, semantic chapter HTML, so browser reader views (Firefox, Safari, Edge Immersive Reader) work too.
- Status windows: a paragraph written as `[ Name · Tier 0: Initiate ]` renders as a status-window box.
- Previous / next chapter, a chapter jump menu, the ← → keys, fullscreen, a progress bar, and "Continue" from where you stopped.
