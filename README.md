# Alessia Canuto — Personal Website

An editorial-style personal website: warm, magazine-like, and built with **plain HTML, CSS
and JavaScript** — no frameworks, no build step, nothing to install. If you can edit a
text file, you can edit this site.

## What's in the folder

| File / folder | What it is |
|---|---|
| `index.html` | Homepage (hero, central question, three projects, MemSurf, the veil, selected work, numbers) |
| `about.html` | About page (essay, "How I work", FAQ) |
| `work.html` | All case studies, with category filters |
| `thinking.html` | Writing & research (essays, columns, thesis) |
| `journey.html` | Interactive map of cities, with year filters |
| `cv.html` | Expandable CV + document library |
| `contact.html` | Contact details + contact form |
| `css/style.css` | **All** the styling. Colours & fonts are at the very top. |
| `js/main.js` | All the interactivity (menu, animations, filters, form) |
| `images/` | Put photos here (empty for now) |
| `documents/` | Put the CV PDF and theses here (empty for now) |

## How to preview the site

Just double-click `index.html` — it opens in your browser. Every page works locally.

## Common edits

### Change any text
Open the page in a text editor (TextEdit, VS Code, Notepad), find the sentence, change
it, save, refresh the browser. The HTML files have big `═══ SECTION ═══` comment banners
so you can find each section quickly.

### Change the colours or fonts
Open `css/style.css`. The first block (called **1. DESIGN TOKENS**) contains every
colour and font. For example, change `--accent: #A8552E;` to recolour every accent on
the site at once.

### Add a real photo (replacing a placeholder)
1. Put the photo in the `images/` folder (e.g. `images/portrait.jpg`).
2. Find the placeholder in the HTML — placeholders are `<div class="arch-frame">` or
   `<div class="ph …">` blocks, each with a comment right above explaining the swap.
3. Replace the block with an `<img>` tag as the comment shows, e.g.
   `<img class="arch-frame" src="images/portrait.jpg" alt="Portrait of Alessia Canuto" style="object-fit: cover;">`

### Add the CV PDF (or a thesis)
1. Put the file in `documents/` (e.g. `documents/alessia-canuto-cv.pdf`).
2. In `cv.html` (and `thinking.html` for the thesis), find the "PDF — coming soon" card —
   a comment above it shows the exact download link to paste in.

### Add a new article to Thinking
In `thinking.html`, copy one whole `<article class="article-card"> … </article>` block,
paste it next to the others, and edit the title, description and link.

### Add a new case study to Work
In `work.html`, copy one whole `<article class="case"> … </article>` block. Give it:
- a unique `id="..."` (so it can be linked to),
- `data-categories="..."` — space-separated, matching the filter buttons
  (`policy esg ai behaviour research communications entrepreneurship`).

### Edit the pre-typed contact messages
In `js/main.js`, find `starters = { … }` (section 6). Each entry is the text inserted
when a visitor picks that topic. The visitor can always edit it before sending.

### Change the words on the rotating badge
The little spinning stamp on the homepage hero lives in `index.html` — search for
`orbit-badge`. The words are inside the `<textPath>` tag. Keep the text roughly the
same length so it fits the circle.

### Change navigation or footer links
The header and footer are repeated at the top/bottom of **every** HTML page (that's the
one trade-off of having no build step). If you rename a page, update the links in all
seven files — a find-and-replace across the folder takes seconds.

## How the contact form works

There's no server, so the form composes the email in the **visitor's own email app**
(a `mailto:` link to alessiacanuto@hotmail.com) with their message pre-filled. If you
later want messages delivered without an email app, sign up at
[formspree.io](https://formspree.io) (free tier), then in `contact.html` add
`action="https://formspree.io/f/YOUR-ID" method="POST"` to the `<form>` tag and delete
the submit handler in `js/main.js` (section 6b).

## Publishing the site (free, via GitHub Pages)

1. Create a repository on github.com (e.g. `alessia-website`).
2. Upload this whole folder (or push it with git).
3. In the repo: **Settings → Pages → Source: Deploy from a branch → main → / (root)**.
4. The site appears at `https://<username>.github.io/alessia-website/` in a minute or two.
   A custom domain (e.g. alessiacanuto.com) can be connected on the same settings page.

## Design notes (for future edits)

- **Serif** (Fraunces) is for headlines and quotes; **sans-serif** (Inter) is for
  labels, body text and interface. Both load from Google Fonts (see the `<link>` tags
  in each page's `<head>`).
- Animations are subtle on purpose, and automatically switch off for visitors whose
  system asks for reduced motion.
- Every number shown on the site is real. Please keep it that way — the site's
  credibility depends on it. Where something isn't available yet (photos, PDFs, article
  links) there's an elegant placeholder instead of an invention.
