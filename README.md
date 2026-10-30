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
- Comments under every chapter: a name and a message, no sign-in. The name is remembered in the reader's browser; comments are shared with everyone through Firestore.

## Comments

`src/comments.js` stores comments in the free Firebase project `predictions-database` (shared with the BPL site), at `arsnovella_comments/{chapter}/items/{id}`. The Firebase SDK only loads when the comments come near the screen.

Firestore needs this block in its rules (Firebase console → Firestore Database → Rules), inside `match /databases/{database}/documents { ... }`, next to the `predictions` and `live` blocks:

```
    match /arsnovella_comments/{ch}/items/{id} {
      allow read: if true;
      allow create: if ch.matches('[0-9]{1,4}')
        && request.resource.data.keys().hasAll(['name', 'text', 'ts', 'cid'])
        && request.resource.data.keys().hasOnly(['name', 'text', 'ts', 'cid'])
        && request.resource.data.name is string
        && request.resource.data.name.size() > 0 && request.resource.data.name.size() <= 40
        && request.resource.data.text is string
        && request.resource.data.text.size() > 0 && request.resource.data.text.size() <= 2000
        && request.resource.data.cid is string && request.resource.data.cid.size() <= 40
        && request.resource.data.ts == request.time;
    }
```

Nobody can edit or delete comments from the site. To remove one, delete it in the Firebase console under `arsnovella_comments → <chapter> → items`.
