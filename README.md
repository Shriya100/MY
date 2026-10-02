# Our Little Universe 💌
A romantic memory website: story timeline, photo wall, quiz, compliments, jokes, this-or-that, secret button and a love letter. Plain HTML, CSS and JavaScript. No build step.

## Folder structure
- `index.html` – page structure
- `style.css` – looks (colors are the first lines of the file)
- `script.js` – interactions
- `data.json` – **all your content**
- `assets/images/` – your photos
- `assets/music/` – your song (`song.mp3`)

## Customize (everything is in `data.json`)
- **Names/title:** `site`
- **Memories:** add objects to `memories` (`date`, `title`, `description`, `more`, `image`, `emoji`)
- **Photos:** drop files in `assets/images/` and use the same filename in `image`. Keep names lowercase with no spaces. Missing photos never break the site.
- **Photo wall:** `wall` (`style` is `polaroid` or `note`)
- **Quiz:** `quiz`. `correct` is the position of the right answer, starting at 0. Final messages are in `quizResults`.
- **Compliments, jokes, this-or-that, secret message, final screen:** same file.
- **Love letter:** `loveLetter.content`. Use `\n` for a new line.
- **Colors:** top of `style.css`.
- **Music:** put your file at `assets/music/song.mp3`. It never autoplays; visitors tap the ♪ button.

Always keep `data.json` valid: commas between items, double quotes only. Check at jsonlint.com.

## Run locally
Browsers block `fetch` on `file://`, so double-clicking `index.html` shows a notice. Use VS Code "Live Server", or run `python -m http.server` in this folder and open http://localhost:8000.

## Deploy with GitHub Pages
1. Create a repository and upload all files (keep the folder structure).
2. Go to **Settings → Pages**.
3. Under **Branch**, choose `main` and `/ (root)`, then Save.
4. After a minute your site is live at `https://YOUR-USERNAME.github.io/REPO-NAME/`.

Note: fonts load from Google Fonts. Offline, the site falls back to system fonts.
