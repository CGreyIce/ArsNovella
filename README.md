# ArsNovella

***The Fisherman of Lake Ilse*** (*I Got Reincarnated To Another World, Became the Hero, and Retired to a Slow Life, Except 35 of My Friends Just Transmigrated to Slay the Demon King*), an isekai web novel, published at https://cgreyice.github.io/ArsNovella/

## Adding a chapter

1. Add `chapters/NNN-short-name.md` with front matter (`number`, `title`, `volume`, `date`; `label` is optional).
2. Run `python build.py`. It regenerates the whole site in `docs/`.
3. Commit and push. GitHub Pages serves `docs/` from `main`.

## The second novel (hidden)

***Regressor Diary of a Voyager*** lives in `voyager/` (its own `novel.json` and `chapters/`) and builds to `docs/voyager/`. It isn't linked anywhere: on the Fisherman's page the **Isekai** tag opens a code box, and the code goes to `voyager/`. The Voyager page's own Isekai tag links back. Its reading progress and comments are separate (`arsnovella.progress.voyager`, `voyager_comments`); reader settings are shared. Add its chapters exactly as above, under `voyager/chapters/`.

***Live from Elsewhere*** lives in `elsewhere/` and builds to `docs/elsewhere/`. It's hidden one level deeper: on the Voyager page the **Slow reveal** tag opens a sign-in box (checked against a SHA-256 hash in `reader.js`, so the login isn't in the source), and the Elsewhere page's **LitRPG** tag links back to Voyager. Its progress and comments are separate (`arsnovella.progress.elsewhere`, `elsewhere_comments`). Add its chapters under `elsewhere/chapters/`. Set `ARS_ELSEWHERE=0` to build without it.

## The sealed shelf (private)

The BPL novel is encrypted, not just hidden. Its chapters live outside this repo in `bpl-novel/chapters/` (same front matter as above). `python bpl-novel/tools/seal.py` encrypts them with AES-GCM (key from the passphrase in `bpl-novel/local/passphrase.txt` via PBKDF2-SHA256, 600,000 rounds) into `sealed/`, which holds only ciphertext plus the public salt. `build.py` turns `sealed/` into `docs/summit/`: a lock page where `src/shelf.js` decrypts the book in the browser. The passphrase never leaves the browser; "Remember on this device" keeps the derived key, and **Lock** forgets it.

The door is the Fisherman page's **by CGreyIce** byline. Never copy plain chapters, the bible or the passphrase into this repo. To add a chapter: write it in `bpl-novel/chapters/`, run `seal.py`, then `python build.py`, commit and push. To change the passphrase: edit the file and run `seal.py` again (it re-encrypts everything under a new salt).

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

The hidden novels' comments go to `voyager_comments/{chapter}/items/{id}` and `elsewhere_comments/{chapter}/items/{id}`, and each needs its own identical block with `arsnovella_comments` changed to that name.

Nobody can edit or delete comments from the site. To remove one, delete it in the Firebase console under `arsnovella_comments → <chapter> → items`.
