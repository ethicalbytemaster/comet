# Deploying CometBrowser

CometBrowser builds to a static `dist/` directory, so it can be deployed on any static hosting provider.

## Quick local verification

```bash
npm install
npm run build
```

The production files will be generated in `dist/`.

---

## Option 1: Vercel

This repo already includes `vercel.json`.

### Steps
1. Push this repo to GitHub.
2. Go to https://vercel.com/new
3. Import the repository.
4. Vercel should detect **Vite** automatically.
5. Deploy.

### Expected settings
- Build command: `npm run build`
- Output directory: `dist`

---

## Option 2: Netlify

This repo already includes `netlify.toml` and SPA redirects.

### Steps
1. Push this repo to GitHub.
2. Go to https://app.netlify.com/start
3. Import the repository.
4. Netlify will use the included config automatically.
5. Deploy.

### Expected settings
- Build command: `npm run build`
- Publish directory: `dist`

---

## Option 3: Cloudflare Pages

### Steps
1. Push this repo to GitHub.
2. Open Cloudflare Pages.
3. Create a new project from Git.
4. Use these settings:
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Build output directory: `dist`
5. Deploy.

The included `public/_redirects` file helps preserve SPA fallback behavior on supported static platforms.

---

## Option 4: GitHub Pages

This repo already includes a GitHub Actions workflow at:

- `.github/workflows/deploy-pages.yml`

### Steps
1. Push the project to GitHub.
2. In the GitHub repo, open **Settings → Pages**.
3. Set **Source** to **GitHub Actions**.
4. Push to the `main` branch.
5. The workflow will build and deploy `dist/` automatically.

---

## Option 5: Manual static hosting

You can also deploy the generated `dist/` folder directly to any CDN or static server.

### Example
```bash
npm install
npm run build
```

Upload the contents of `dist/` to your hosting provider.

---

## Notes

- CometBrowser is a client-side app, so no backend server is required.
- The build is production-ready and self-contained.
- If you want, the next step can be adding a custom domain, analytics, or CI-based preview deployments.
