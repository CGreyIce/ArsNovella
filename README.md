# ArsNovella

**Three Years Late**, an isekai web novel, published at https://cgreyice.github.io/ArsNovella/

## Adding a chapter

1. Add `chapters/NNN-short-name.md` with front matter (`number`, `title`, `volume`, `date`; `label` is optional).
2. Run `python build.py`. It regenerates the whole site in `docs/`.
3. Commit and push. GitHub Pages serves `docs/` from `main`.

## Reader features

- Reader settings (saved in the browser): theme (Dark, Light, Sepia, Lake, or custom colours), font, size, line and paragraph spacing, text width.
- **Listen:** read-aloud with the browser's own voices (Web Speech API). It highlights and follows the paragraph being read, has a speed and voice choice, and can carry on into the next chapter. Tap any paragraph to read from there.
- Plain, semantic chapter HTML, so browser reader views and read-aloud tools (Firefox, Safari, Edge Immersive Reader) work too.
- Previous / next chapter, a chapter jump menu, the ← → keys, fullscreen, a progress bar, and "Continue" from where you stopped.
