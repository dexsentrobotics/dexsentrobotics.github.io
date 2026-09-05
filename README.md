# QR Maker

A browser-based QR code generator. Paste a link, the code redraws as you type, download it as a PNG.

No backend, no build step — three static files, so GitHub Pages serves it as-is.

## Files

| File | Purpose |
|---|---|
| `index.html` | Page structure and inputs |
| `style.css` | Styling |
| `script.js` | QR generation + PNG download |

The QR encoding itself comes from [qrcodejs](https://github.com/davidshimjs/qrcodejs), loaded from cdnjs in `index.html`.

## Deploy to GitHub Pages

```bash
git init
git add .
git commit -m "QR maker"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

Then in the repo: **Settings → Pages → Source: Deploy from a branch → Branch: `main`, folder: `/ (root)` → Save.**

The site appears at `https://<your-username>.github.io/<repo-name>/` within a minute or two.

## Run locally

Opening `index.html` directly works. If you'd rather serve it:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

## Notes

- **Damage tolerance** is QR error correction (L/M/Q/H). Higher means the code survives scuffs and logos over the centre, but packs in more modules, so it gets denser.
- The downloaded PNG includes a white margin around the code (the quiet zone). Without it, scanners often fail to find the edges.
- Keep the code colour dark and the background light. Inverted codes scan on some phones and not others.
- Max capacity is roughly 2,900 characters at Low tolerance — links are nowhere near that.
