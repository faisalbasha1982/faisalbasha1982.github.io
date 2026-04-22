# Faisal Bin Basha — Portfolio

Personal portfolio site for Faisal Bin Basha (AI Platform Engineer / Senior SRE / DevOps & DevSecOps). Single-page, single-file HTML with three themes, your resume data baked in, and your profile photo embedded.

---

## What's in this folder

| File | What it is |
|---|---|
| `index.html` | The whole site — HTML, CSS and JS in one file |
| `profile.jpg` | Your photo, extracted from your resume |
| `README.md` | This file |

---

## Two small things to do before going live

### 1. Wire up the contact form (takes 2 minutes)

The form is ready to work — it just needs a form endpoint. Go to [formspree.io](https://formspree.io) and sign up (free tier = 50 submissions/month), create a form, copy your form ID, then in `index.html` find:

```html
<form class="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

Replace `YOUR_FORM_ID` with your actual ID. Done.

### 2. Drop in your CV (optional)

The "Download CV" button in the hero points to `resume.pdf`. If you want it to work, just copy your resume PDF into this folder and rename it to `resume.pdf`. If you don't want that button, delete the `<a href="resume.pdf" ...>` block in the hero section.

---

## Hosting (all free)

### Option A — GitHub Pages (recommended, since you already have a GitHub account)

1. Create a new public repo called **`faisalbasha1982.github.io`** (the name matters — it has to match your GitHub username exactly).
2. Upload `index.html`, `profile.jpg` and optionally `resume.pdf` to the repo.
3. Go to **Settings → Pages** and set source to `main` branch, `/` root. Save.
4. Wait ~2 minutes. Your site is live at `https://faisalbasha1982.github.io`

### Option B — Netlify Drop (fastest, no git)

1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag this whole folder onto the page
3. You get a free `faisal-something.netlify.app` URL instantly
4. In Netlify settings you can rename the subdomain (e.g. `faisalbasha.netlify.app`)

### Option C — Cloudflare Pages

1. Sign up at [pages.cloudflare.com](https://pages.cloudflare.com)
2. Connect your GitHub repo or upload the folder directly
3. Free tier includes unlimited bandwidth

### Custom domain later (~$10/year)

Register something like `faisalbasha.com` or `faisalbasha.dev` at [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/) or [Porkbun](https://porkbun.com). Then point it at whichever host you chose above (they all have one-click custom domain setup).

---

## How to edit

Everything is in one file, `index.html`. Open it in any editor. The structure is:

- `<style>` block at the top — all CSS, grouped by section with comments
- `<body>` — HTML in clearly-labeled sections (`<section id="skills">`, `<section id="projects">` etc.)
- `<script>` at the bottom — theme switcher, tabs, scroll animations

### Common edits

**Change the accent color?**
Near the top of the `<style>` block, look for `[data-theme="dark"]`. Change `--accent: #e8b75a;` to any hex you like. Do the same for `[data-theme="light"]` and `[data-theme="sepia"]` if you want.

**Update your job title in the nav?**
Change the `<a class="logo">` content near the top.

**Add a new project?**
Copy one of the existing `<article class="project-card">` blocks, paste it in the grid, and edit the title/description/tags.

**Swap the profile photo?**
Replace `profile.jpg` with your own image. Keep it roughly square (600×600 or bigger) and under 200KB. No code change needed.

---

## What's on the site

- **Home** — your name, title, 16+ years / 18 certs / 8 companies / 4 clouds stats
- **Skills & Certifications** — 6 skill categories + all 18 certifications
- **Qualifications** — tabbed Experience (8 roles) / Education (5 institutions) timeline
- **Services** — 6 engagement types you offer
- **Career Highlights** — 6 project cards from your most impactful work
- **Contact** — form + email/phone/GitHub/location

Three themes: warm amber dark (default), burnt-orange light, sage-green sepia. Preference saves in the visitor's browser.

Mobile responsive. Keyboard accessible. No trackers, no analytics — add your own if you want them.
